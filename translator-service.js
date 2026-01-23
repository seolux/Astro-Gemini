/**
 * TRANSLATOR-SERVICE.JS
 * Traduit les fichiers JSON de données (Horoscopes & Blog)
 */
const fs = require('fs/promises');
const path = require('path');
const { askAI } = require('./lib/ai');

const DATA_DIR = path.join(__dirname, 'data');
const BLOG_DIR = path.join(__dirname, 'content');
const TARGET_LANGS = ['en', 'de'];

// Prompt optimisé pour la traduction JSON
const getPrompt = (jsonContent, lang) => {
    return `Tu es un traducteur expert natif en ${lang === 'en' ? 'Anglais' : 'Allemand'}.
    Traduis les valeurs de ce JSON du Français vers le ${lang}.
    
    RÈGLES STRICTES :
    1. NE TRADUIS PAS les clés du JSON.
    2. NE TRADUIS PAS les nombres (lucky_number, ratings).
    3. Garde le ton : Mystique, bienveillant et professionnel.
    4. Format de sortie : JSON valide uniquement.
    
    JSON À TRADUIRE :
    ${JSON.stringify(jsonContent)}`;
};

async function translateFile(filePath, type) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        const fileName = path.basename(filePath, '.json');

        // Si le fichier est déjà une traduction (ex: belier.en.json), on ignore
        if (fileName.includes('.')) return;

        console.log(`🌍 Traduction de ${fileName} (${type})...`);

        for (const lang of TARGET_LANGS) {
            const targetFile = path.join(path.dirname(filePath), `${fileName}.${lang}.json`);
            
            // Vérifier si la traduction existe déjà et est récente (optionnel, ici on écrase pour l'exemple)
            // On lance la traduction IA
            try {
                const translatedStr = await askAI("Tu es un traducteur JSON strict.", getPrompt(data, lang), true);
                
                // Nettoyage si l'IA bavarde
                let cleanJson = translatedStr;
                if(typeof translatedStr === 'string') {
                     const match = translatedStr.match(/\{[\s\S]*\}/);
                     if (match) cleanJson = match[0];
                }

                await fs.writeFile(targetFile, typeof cleanJson === 'string' ? cleanJson : JSON.stringify(cleanJson, null, 2));
                console.log(`   ✅ [${lang.toUpperCase()}] Généré.`);
            } catch (err) {
                console.error(`   ❌ Erreur traduction ${lang}:`, err.message);
            }
        }
    } catch (e) {
        console.error("Erreur lecture fichier:", e);
    }
}

async function runTranslations() {
    // 1. Traduire les Horoscopes
    const signFiles = (await fs.readdir(DATA_DIR)).filter(f => f.endsWith('.json') && !f.includes('summary') && !f.includes('.en.') && !f.includes('.de.'));
    for (const file of signFiles) {
        await translateFile(path.join(DATA_DIR, file), 'Horoscope');
    }

    // 2. Traduire le résumé (summary.json)
    // C'est un cas spécial car structure {sign: {data}}
    try {
        const summary = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'summary.json'), 'utf-8'));
        for (const lang of TARGET_LANGS) {
            let summaryTrans = {};
            for (const [key, val] of Object.entries(summary)) {
                // On traduit juste le teaser sommairement ou via IA (ici simplifié pour l'exemple)
                const prompt = `Traduis cette phrase en ${lang} (court, accrocheur): "${val.teaser}"`;
                const teaser = await askAI("Traducteur", prompt, false); // false = pas de json forcé
                summaryTrans[key] = { ...val, teaser: teaser.replace(/"/g, '') };
            }
            await fs.writeFile(path.join(DATA_DIR, `summary.${lang}.json`), JSON.stringify(summaryTrans, null, 2));
        }
    } catch (e) {}

    // 3. Traduire les Articles de Blog (Optionnel, peut être long)
    // Pour l'instant on se concentre sur les pages principales
}

runTranslations();