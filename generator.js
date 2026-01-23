/**
 * GENERATOR.JS - Générateur d'horoscopes avec Source Externe (Ohmanda API)
 * 1. Tente de récupérer le contenu brut depuis ohmanda.com
 * 2. Si succès : L'IA traduit, reformule et structure les données.
 * 3. Si échec : L'IA génère les prédictions de zéro (Fallback).
 */
const fs = require('fs/promises');
const path = require('path');
const { askAI } = require('./lib/ai');

const DATA_DIR = path.join(__dirname, 'data');

// Mapping ID Interne (FR) <-> API Externe (EN)
const SIGN_MAPPING = {
    'belier': 'aries',
    'taureau': 'taurus',
    'gemeaux': 'gemini',
    'cancer': 'cancer',
    'lion': 'leo',
    'vierge': 'virgo',
    'balance': 'libra',
    'scorpion': 'scorpio',
    'sagittaire': 'sagittarius',
    'capricorne': 'capricorn',
    'verseau': 'aquarius',
    'poissons': 'pisces'
};

const todayDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * Récupère l'horoscope brut depuis l'API Ohmanda
 * @param {string} signId - ID en français (ex: belier)
 * @returns {string|null} - Le texte en anglais ou null si erreur
 */
async function fetchRawHoroscope(signId) {
    const apiSign = SIGN_MAPPING[signId];
    if (!apiSign) return null;

    const url = `https://ohmanda.com/api/horoscope/${apiSign}`;
    
    try {
        // Timeout de 5 secondes pour ne pas bloquer le build
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        
        const data = await response.json();
        if (data && data.horoscope) {
            return data.horoscope;
        }
        return null;
    } catch (error) {
        console.warn(`⚠️  API Error (${signId}): ${error.message} -> Passage en mode génération IA pure.`);
        return null;
    }
}

async function generateHoroscope(sign) {
    // 1. Essayer de récupérer la source externe
    const rawContent = await fetchRawHoroscope(sign);
    let sourceInstruction = "";

    if (rawContent) {
        console.log(`   ✅ Source récupérée pour ${sign}`);
        sourceInstruction = `
        SOURCE DE VÉRITÉ (En Anglais) : "${rawContent}"
        
        CONSIGNE PRIORITAIRE : 
        1. Utilise cette "SOURCE DE VÉRITÉ" comme base pour tes prédictions.
        2. Traduis et adapte le contenu en Français.
        3. Tu peux enrichir le texte pour qu'il soit plus complet, mais respecte l'ambiance du texte source.
        4. Déduis les notes (ratings) et les conseils (amour/travail) à partir de ce texte source.`;
    } else {
        console.log(`   ⚡ Pas de source pour ${sign} -> Génération IA autonome`);
        sourceInstruction = `CONSIGNE : Génère une prédiction astrologique créative et cohérente basée sur les transits planétaires théoriques du jour.`;
    }

    // 2. Préparer le prompt
    const systemPrompt = "Tu es une astrologue renommée. Tes prédictions sont précises, empathiques et sans jargon inutile. Tu génères toujours du JSON valide.";
    
    const userPrompt = `Génère l'horoscope du jour pour le signe : ${sign}. Date : ${todayDate}.
    
    ${sourceInstruction}

    Format JSON strict attendu :
    {
        "date": "${todayDate}",
        "general": "Paragraphe général (Basé sur la source si dispo)",
        "love": "Conseil amour spécifique",
        "work": "Conseil travail spécifique",
        "health": "Conseil forme spécifique",
        "advice": "Une phrase courte de coaching",
        "lucky_number": "Nombre (1-99)",
        "color": "Couleur du jour",
        "ratings": { "love": (1-5), "work": (1-5), "health": (1-5), "global": (1-5) },
        "teaser": "Une phrase d'accroche très courte (max 10 mots) pour la page d'accueil"
    }`;

    try {
        return await askAI(systemPrompt, userPrompt, true);
    } catch (e) {
        console.error(`❌ Erreur IA ${sign}`, e.message);
        return null;
    }
}

async function main() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const summary = {};
    const SIGNS = Object.keys(SIGN_MAPPING);

    console.log("🔮 Démarrage du générateur hybride (API + IA)...");

    // Exécution en parallèle par lots de 3
    for (let i = 0; i < SIGNS.length; i += 3) {
        const batch = SIGNS.slice(i, i + 3);
        const promises = batch.map(async (sign) => {
            const data = await generateHoroscope(sign);
            if (data) {
                await fs.writeFile(path.join(DATA_DIR, `${sign}.json`), JSON.stringify(data, null, 2));
                summary[sign] = {
                    rating: data.ratings ? data.ratings.global : 3,
                    teaser: data.teaser || "Découvrez vos prévisions..."
                };
            }
        });
        await Promise.all(promises);
    }

    await fs.writeFile(path.join(DATA_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log("✨ Tous les horoscopes ont été générés.");
}

main();