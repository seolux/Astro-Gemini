/**
 * CONTENT-GENERATOR.JS - Version "Context-Aware"
 * - Anti-doublons thématiques (vérifie les sujets précédents)
 * - Maillage interne (crée des liens vers les anciens articles)
 */
const fs = require('fs/promises');
const path = require('path');
const { constants } = require('fs'); 
const { askAI } = require('./lib/ai');

const OUTPUT_DIR = path.join(__dirname, 'content');
const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Utilitaires
const generateSlug = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// SUJETS DE SECOURS (Intemporels)
const FALLBACK_TOPICS = [
    { title: "Comprendre son Ascendant", topic: "L'importance de l'ascendant dans le thème astral et son influence sur la personnalité." },
    { title: "La Lune en Astrologie", topic: "Que représente la Lune dans un thème natal ? Les émotions, l'intuition et le subconscient." },
    { title: "Mercure Rétrograde", topic: "Pourquoi ce phénomène influence-t-il la communication et comment s'y préparer ?" },
    { title: "Compatibilité Amoureuse", topic: "L'analyse des éléments (Feu, Terre, Air, Eau) dans les relations de couple." },
    { title: "Les 12 Maisons", topic: "Introduction simplifiée aux secteurs de vie dans un thème astral." }
];

function cleanAndParseJSON(str) {
    try {
        const match = str.match(/\[.*\]/s) || str.match(/\{.*\}/s);
        const jsonStr = match ? match[0] : str;
        return JSON.parse(jsonStr);
    } catch (e) { return null; }
}

function getFallbackTopic() {
    const topic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    return [topic];
}

/**
 * 1. Recherche de sujet avec contexte des articles précédents
 */
async function getDailyTopics(existingArticles) {
    console.log("🔭 Recherche de sujets d'actualité via IA...");

    // On prépare la liste des 20 derniers titres pour éviter les répétitions
    const recentTitles = existingArticles
        .slice(0, 20)
        .map(a => `- ${a.title}`)
        .join('\n');
    
    const systemPrompt = "Tu es rédacteur en chef d'un blog d'astrologie.";
    const userPrompt = `Nous sommes le ${today}. Propose 1 sujet d'article pertinent (Saison du zodiaque, Lune, Transits).
    
    ⛔ LISTE DES SUJETS DÉJÀ TRAITÉS RÉCEMMENT (INTERDICTION DE RÉPÉTER) :
    ${recentTitles || "Aucun article précédent."}

    CONSIGNE : Trouve un angle NOUVEAU ou un sujet différent des titres ci-dessus.
    
    Format JSON Array strict : [{"title": "Titre Français", "topic": "Description"}]`;

    try {
        let topics = await askAI(systemPrompt, userPrompt, true);
        if (typeof topics === 'string') topics = cleanAndParseJSON(topics);
        
        if (!Array.isArray(topics)) {
            if (topics?.topics) topics = topics.topics;
            else if (topics?.title) topics = [topics];
            else return getFallbackTopic();
        }
        return topics.length ? topics : getFallbackTopic();

    } catch (e) {
        return getFallbackTopic();
    }
}

/**
 * 2. Rédaction avec instructions de maillage interne
 */
async function writeArticle(topicConfig, existingArticles) {
    if (!topicConfig?.title) return null;
    console.log(`✍️  Rédaction : "${topicConfig.title}"...`);

    // On prépare la liste pour le maillage interne (Titre + Lien relatif)
    // On suppose que l'article sera dans /content/slug/, donc pour aller vers un autre, on fait ../autre-slug/
    const internalLinksContext = existingArticles
        .slice(0, 50) // On donne les 50 plus récents pour le maillage
        .map(a => `- Titre: "${a.title}" => Lien: "../${a.slug}/"`)
        .join('\n');

    const systemPrompt = "Tu es astrologue experte. Tu écris des articles HTML captivants.";
    const userPrompt = `Sujet: "${topicConfig.topic}". Titre: "${topicConfig.title}".
    
    CONTEXTE POUR MAILLAGE INTERNE (SEO) :
    Voici la liste de nos articles existants. Si un paragraphe s'y prête, insère naturellement un lien HTML <a href="..."> vers l'un d'eux.
    LISTE DES ARTICLES :
    ${internalLinksContext || "Aucun article pour le moment."}
    
    JSON attendu :
    {
        "title": "${topicConfig.title}",
        "excerpt": "Accroche courte (150 chars max).",
        "content": "Contenu HTML complet avec balises <h2>, <p> et liens internes <a> si pertinents...",
        "keywords": ["tag1", "tag2"],
        "readingTime": "5 min"
    }`;

    try {
        let data = await askAI(systemPrompt, userPrompt, true);
        if (typeof data === 'string') data = cleanAndParseJSON(data);
        if (!data?.content) throw new Error("Contenu vide");

        data.slug = generateSlug(data.title);
        data.type = 'article'; 
        data.date = new Date().toISOString();
        data.publishDate = today;
        return data;
    } catch (e) {
        console.error(`❌ Erreur rédaction : ${e.message}`);
        return null;
    }
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath, constants.F_OK);
        return true;
    } catch { return false; }
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // 1. Charger l'index existant EN PREMIER
    let existingIndex = [];
    try { 
        const jsonContent = await fs.readFile(path.join(OUTPUT_DIR, 'index.json'), 'utf-8');
        existingIndex = JSON.parse(jsonContent);
    } catch (e) {
        // Index vide ou inexistant
    }

    // 2. Chercher un sujet en passant l'historique pour éviter les doublons
    const topics = await getDailyTopics(existingIndex);
    const newArticles = [];

    for (const topic of topics) {
        const slug = generateSlug(topic.title);
        const filePath = path.join(OUTPUT_DIR, `${slug}.json`);

        // Sécurité doublon strict (slug identique)
        if (existingIndex.find(a => a.slug === slug)) {
            console.log(`🔒 Article déjà indexé (Slug identique) : "${topic.title}" - Ignoré.`);
            continue;
        }
        if (await fileExists(filePath)) {
            console.log(`🔒 Fichier existant : "${slug}.json" - Ignoré.`);
            continue;
        }

        // 3. Rédiger l'article en passant l'historique pour le maillage interne
        const article = await writeArticle(topic, existingIndex);
        
        if (article) {
            await fs.writeFile(filePath, JSON.stringify(article, null, 2));
            newArticles.push({
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                date: article.date,
                keywords: article.keywords
            });
            console.log(`✅ Nouvel article créé avec maillage : ${article.slug}`);
        }
    }

    if (newArticles.length > 0) {
        // Ajout des nouveaux en haut de la liste
        const updatedIndex = [...newArticles, ...existingIndex].slice(0, 50);
        await fs.writeFile(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(updatedIndex, null, 2));
        console.log(`📚 ${newArticles.length} article(s) ajouté(s) à l'index.`);
    } else {
        console.log("⏸️  Aucun contenu n'a nécessité de mise à jour.");
    }
}

main();