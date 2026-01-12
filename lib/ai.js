/**
 * LIB/AI.JS - Adaptateur OpenAI (Optimisé gpt-4o-mini)
 */
require('dotenv').config();
const axios = require('axios');

// Récupération des clés OpenAI (supporte plusieurs clés séparées par des virgules)
const keysEnv = process.env.OPENAI_API_KEYS || process.env.OPENAI_API_KEY || "";
const API_KEYS = keysEnv.split(',').map(k => k.trim()).filter(k => k && k.startsWith('sk-'));

let currentKeyIndex = 0;

// CONFIGURATION DU MODÈLE
// gpt-4o-mini est le plus économique ($0.15/1M tokens input) et très performant.
const MODEL = "gpt-4o-mini";

// Fonction de délai pour les retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rotation des clés (utile si vous avez plusieurs comptes/projets pour répartir la facturation)
function getApiKey() {
    if (API_KEYS.length === 0) {
        console.warn("⚠️  ATTENTION: Aucune clé API OpenAI trouvée dans le .env");
        return "";
    }
    return API_KEYS[currentKeyIndex];
}

function rotateKey() {
    if (API_KEYS.length > 1) {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        console.log(`   🔄 Rotation clé API (${currentKeyIndex + 1}/${API_KEYS.length})`);
    }
}

/**
 * Fonction générique pour interroger l'IA
 * @param {string} systemPrompt - Le contexte
 * @param {string} userPrompt - La demande
 * @param {boolean} jsonMode - Si true, force le format JSON (très fiable sur gpt-4o)
 */
async function askAI(systemPrompt, userPrompt, jsonMode = false) {
    let lastError = null;

    if (API_KEYS.length === 0) {
        throw new Error("❌ Clé API OpenAI manquante. Vérifiez votre fichier .env");
    }

    // On fait jusqu'à 3 tentatives en cas d'erreur réseau ou 500/503
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: MODEL,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    // OpenAI supporte nativement le JSON mode
                    response_format: jsonMode ? { type: "json_object" } : undefined
                },
                {
                    headers: {
                        "Authorization": `Bearer ${getApiKey()}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 30000 // 30s timeout
                }
            );

            let content = response.data.choices[0].message.content;

            if (jsonMode) {
                try {
                    return JSON.parse(content);
                } catch (e) {
                    console.warn(`⚠️  Erreur parsing JSON, tentative ${attempt + 1}/${maxRetries}...`);
                    throw new Error("Invalid JSON response");
                }
            }

            return content;

        } catch (error) {
            lastError = error;
            const status = error.response?.status;
            
            // Gestion des quotas (429) ou clés invalides (401)
            if (status === 429 || status === 401) {
                console.log(`   ⚠️  Erreur ${status} (Quota/Auth). Rotation de clé...`);
                rotateKey();
                await delay(1000);
            } else {
                console.log(`   ⚠️  Erreur ${status || 'Réseau'}. Tentative ${attempt + 1}/${maxRetries}`);
                await delay(1000);
            }
        }
    }
    
    throw lastError || new Error("Échec de la génération OpenAI");
}

module.exports = { askAI };