/**
 * GENERATOR.JS - Générateur d'horoscopes quotidiens
 */
const fs = require('fs/promises');
const path = require('path');
const { askAI } = require('./lib/ai');

const DATA_DIR = path.join(__dirname, 'data');
const SIGNS = ['belier', 'taureau', 'gemeaux', 'cancer', 'lion', 'vierge', 'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'];

const todayDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

async function generateHoroscope(sign) {
    console.log(`🔮 Prédictions pour : ${sign}...`);
    
    const systemPrompt = "Tu es une astrologue renommée. Tes prédictions sont précises, empathiques et sans jargon inutile.";
    const userPrompt = `Génère l'horoscope du jour pour le signe : ${sign}. Date : ${todayDate}.
    
    Format JSON strict :
    {
        "date": "${todayDate}",
        "general": "Paragraphe général (3 phrases max)",
        "love": "Conseil amour",
        "work": "Conseil travail",
        "health": "Conseil forme",
        "advice": "Une phrase courte de coaching",
        "lucky_number": "Nombre (1-99)",
        "color": "Couleur du jour",
        "ratings": { "love": (1-5), "work": (1-5), "health": (1-5), "global": (1-5) },
        "teaser": "Une phrase d'accroche très courte pour la page d'accueil"
    }`;

    try {
        return await askAI(systemPrompt, userPrompt, true);
    } catch (e) {
        console.error(`❌ Erreur ${sign}`, e.message);
        return null;
    }
}

async function main() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const summary = {};

    // Exécution en parallèle par lots de 3 pour ne pas surcharger
    for (let i = 0; i < SIGNS.length; i += 3) {
        const batch = SIGNS.slice(i, i + 3);
        const promises = batch.map(async (sign) => {
            const data = await generateHoroscope(sign);
            if (data) {
                await fs.writeFile(path.join(DATA_DIR, `${sign}.json`), JSON.stringify(data, null, 2));
                summary[sign] = {
                    rating: data.ratings.global,
                    teaser: data.teaser
                };
            }
        });
        await Promise.all(promises);
    }

    await fs.writeFile(path.join(DATA_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log("✨ Tous les horoscopes ont été générés.");
}

main();