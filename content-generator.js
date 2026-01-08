/**
 * CONTENT-GENERATOR.JS - Génération automatique de contenu éditorial
 * Crée des articles de blog, guides, et pages de contenu enrichies
 */
require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

const OUTPUT_DIR = path.join(__dirname, 'content');
const keysEnv = process.env.OPENROUTER_API_KEYS || process.env.OPENROUTER_API_KEY || "";
const API_KEYS = keysEnv.split(',').map(k => k.trim()).filter(k => k);
let currentKeyIndex = 0;

const MODELS = [
    "nex-agi/deepseek-v3.1-nex-n1:free",
    "google/gemini-2.0-flash-exp:free",
    "mistralai/mistral-7b-instruct:free"
];

// Types de contenu à générer automatiquement
const CONTENT_TYPES = [
    {
        type: 'article',
        topic: 'compatibilite-amoureuse',
        title: 'Compatibilité Amoureuse entre les Signes',
        prompt: 'Écris un article détaillé (400 mots) sur la compatibilité amoureuse en astrologie. Explique comment les éléments (Feu, Terre, Air, Eau) influencent les relations. Donne des exemples concrets de couples compatibles. Ton professionnel mais accessible.'
    },
    {
        type: 'article',
        topic: 'phases-lunaires',
        title: 'Comprendre les Phases Lunaires et leur Influence',
        prompt: 'Écris un guide complet (450 mots) sur les phases lunaires : Nouvelle Lune, Premier Quartier, Pleine Lune, Dernier Quartier. Explique leur influence sur nos émotions et comment en tirer parti. Inclus des rituels simples pour chaque phase.'
    },
    {
        type: 'article',
        topic: 'elements-astrologiques',
        title: 'Les 4 Éléments en Astrologie : Guide Complet',
        prompt: 'Explique en détail (500 mots) les 4 éléments astrologiques : Feu (Bélier, Lion, Sagittaire), Terre (Taureau, Vierge, Capricorne), Air (Gémeaux, Balance, Verseau), Eau (Cancer, Scorpion, Poissons). Décris les caractéristiques, forces et défis de chaque élément.'
    },
    {
        type: 'guide',
        topic: 'debuter-astrologie',
        title: 'Débuter en Astrologie : Le Guide du Débutant',
        prompt: 'Crée un guide pour débutants (550 mots) en astrologie. Explique : les 12 signes, les planètes principales, les maisons astrologiques, comment lire un thème natal de base. Vocabulaire simple et exemples concrets.'
    },
    {
        type: 'article',
        topic: 'retrogradation-mercure',
        title: 'Mercure Rétrograde : Mythe ou Réalité ?',
        prompt: 'Article informatif (400 mots) sur Mercure rétrograde. Explique le phénomène astronomique, son interprétation astrologique, les domaines affectés (communication, technologie, transports). Conseils pratiques pour traverser ces périodes.'
    },
    {
        type: 'article',
        topic: 'saisons-astrologiques',
        title: 'Les Saisons Astrologiques et Votre Énergie',
        prompt: 'Explore (450 mots) comment chaque saison astrologique (commençant avec les signes cardinaux) influence notre énergie. Printemps/Bélier, Été/Cancer, Automne/Balance, Hiver/Capricorne. Conseils pour s\'aligner avec ces cycles.'
    }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getApiKey() {
    if (API_KEYS.length === 0) throw new Error("Aucune clé API trouvée");
    return API_KEYS[currentKeyIndex];
}

function rotateKey() {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log(`   🔀 Rotation de clé. Index : ${currentKeyIndex}`);
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function generateContent(contentConfig) {
    const prompt = `${contentConfig.prompt}

IMPORTANT : Réponds UNIQUEMENT avec un JSON brut (pas de markdown, pas de \`\`\`).
Format attendu :
{
    "title": "${contentConfig.title}",
    "excerpt": "Résumé accrocheur de 2 phrases (max 150 caractères)",
    "content": "Contenu HTML formaté avec <h2>, <p>, <strong>, <em>. Bien structuré en sections.",
    "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"],
    "readingTime": "X min"
}`;

    for (const model of MODELS) {
        let attempts = 0;
        while (attempts < API_KEYS.length) {
            try {
                const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8,
                    max_tokens: 2000
                }, {
                    headers: { 
                        "Authorization": `Bearer ${getApiKey()}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://astro.lu",
                        "X-Title": "Astro Content Generator"
                    },
                    timeout: 30000
                });

                let content = response.data.choices[0].message.content;
                if (content.includes('```')) {
                    content = content.replace(/```json/g, '').replace(/```/g, '');
                }
                
                const data = JSON.parse(content.trim());
                
                // Enrichissement des métadonnées
                data.type = contentConfig.type;
                data.slug = generateSlug(contentConfig.topic);
                data.date = new Date().toISOString();
                data.publishDate = new Date().toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                
                console.log(`   ✅ Généré : ${contentConfig.title} (${model})`);
                return data;

            } catch (error) {
                attempts++;
                const status = error.response ? error.response.status : 'Erreur réseau';
                
                if ([401, 402, 429].includes(status)) {
                    console.log(`   ⚠️ Clé ${currentKeyIndex} KO (${status})`);
                    rotateKey();
                } else {
                    break;
                }
                await delay(1000);
            }
        }
    }
    return null;
}

async function main() {
    console.log("📝 Démarrage du générateur de contenu...");
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const generatedContent = [];

    for (const config of CONTENT_TYPES) {
        console.log(`\n✍️  Génération : ${config.title}`);
        const content = await generateContent(config);
        
        if (content) {
            const filename = `${content.slug}.json`;
            await fs.writeFile(
                path.join(OUTPUT_DIR, filename), 
                JSON.stringify(content, null, 2)
            );
            generatedContent.push({
                slug: content.slug,
                title: content.title,
                excerpt: content.excerpt,
                type: content.type,
                date: content.date,
                keywords: content.keywords
            });
        } else {
            console.error(`   ❌ Échec pour ${config.title}`);
        }
        
        await delay(2000); // Délai entre chaque génération
    }

    // Index des contenus générés
    if (generatedContent.length > 0) {
        await fs.writeFile(
            path.join(OUTPUT_DIR, 'index.json'), 
            JSON.stringify(generatedContent, null, 2)
        );
        console.log("\n📚 Index de contenu créé avec succès !");
    }
    
    console.log("✨ Génération de contenu terminée !");
}

main();