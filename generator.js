/**
 * GENERATOR.JS - Version Avancée (Multi-Clés + Summary + Ratings)
 */
require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

const OUTPUT_DIR = path.join(__dirname, 'data');

// 1. GESTION MULTI-CLÉS
// Récupère les clés depuis .env (séparées par des virgules)
const keysEnv = process.env.OPENROUTER_API_KEYS || process.env.OPENROUTER_API_KEY || "";
const API_KEYS = keysEnv.split(',').map(k => k.trim()).filter(k => k);
let currentKeyIndex = 0;

const MODELS = [
    "nex-agi/deepseek-v3.1-nex-n1:free",
    "google/gemini-2.0-flash-exp:free",
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3-8b-instruct:free"
];

const SIGNS = [
    'belier', 'taureau', 'gemeaux', 'cancer', 'lion', 'vierge', 
    'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'
];

let dailySummary = {};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getApiKey() {
    if (API_KEYS.length === 0) throw new Error("Aucune clé API trouvée dans .env");
    return API_KEYS[currentKeyIndex];
}

function rotateKey() {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log(`   🔀 Rotation de clé. Nouvelle clé index : ${currentKeyIndex}`);
}

async function generateHoroscope(sign) {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    // Prompt demandant la structure enrichie (notes, teaser, etc.)
    const prompt = `
    Tu es un astrologue expert. Génère l'horoscope pour le signe "${sign}" du ${today}.
    
    IMPORTANT : Réponds UNIQUEMENT avec un JSON brut (pas de markdown).
    Format attendu :
    {
        "date": "${today}",
        "teaser": "Phrase mystérieuse et courte (max 12 mots) pour la page d'accueil.",
        "general": "Climat astral général (env 30 mots).",
        "love": "Prévisions amour (env 25 mots).",
        "work": "Prévisions travail (env 25 mots).",
        "health": "Prévisions forme/santé (env 25 mots).",
        "ratings": {
            "global": (entier 1 à 5),
            "love": (entier 1 à 5),
            "work": (entier 1 à 5),
            "health": (entier 1 à 5)
        },
        "advice": "Conseil court et actionnable.",
        "lucky_number": (nombre entier 1-99),
        "color": "Une couleur porte-bonheur"
    }`;

    // Boucle sur les modèles
    for (const model of MODELS) {
        let attempts = 0;
        // On essaie avec les clés disponibles
        while (attempts < API_KEYS.length) {
            try {
                const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                }, {
                    headers: { 
                        "Authorization": `Bearer ${getApiKey()}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "Astro Generator"
                    },
                    timeout: 20000 
                });

                let content = response.data.choices[0].message.content;
                // Nettoyage Markdown
                if (content.includes('```')) {
                    content = content.replace(/```json/g, '').replace(/```/g, '');
                }
                
                const data = JSON.parse(content.trim());
                
                // Vérification de structure minimale
                if(!data.ratings) data.ratings = { global: 3, love: 3, work: 3, health: 3 };
                
                console.log(`   ✅ Succès : ${sign} (Modèle: ${model})`);
                return data;

            } catch (error) {
                attempts++;
                const status = error.response ? error.response.status : 'Erreur réseau';
                
                // Si erreur d'auth ou quota, on change de clé
                if ([401, 402, 429].includes(status)) {
                    console.log(`   ⚠️ Clé ${currentKeyIndex} KO (${status}). Rotation...`);
                    rotateKey();
                } else {
                    // Sinon on change de modèle
                    break;
                }
                await delay(500);
            }
        }
    }
    return null;
}

async function main() {
    console.log("🚀 Démarrage du générateur Astro-IA...");
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const sign of SIGNS) {
        console.log(`\n🔮 Génération : ${sign.toUpperCase()}`);
        const data = await generateHoroscope(sign);
        
        if (data) {
            // Sauvegarde du fichier détaillé
            await fs.writeFile(path.join(OUTPUT_DIR, `${sign}.json`), JSON.stringify(data, null, 2));
            
            // Ajout au résumé pour la page d'accueil
            dailySummary[sign] = {
                teaser: data.teaser,
                rating: data.ratings.global
            };
        } else {
            console.error(`   ❌ Échec pour ${sign}`);
        }
        await delay(1000);
    }

    // Sauvegarde du résumé global
    if (Object.keys(dailySummary).length > 0) {
        await fs.writeFile(path.join(OUTPUT_DIR, 'summary.json'), JSON.stringify(dailySummary, null, 2));
        console.log("\n📦 Fichier 'summary.json' généré avec succès.");
    }
    
    console.log("✨ Terminé !");
}

main();