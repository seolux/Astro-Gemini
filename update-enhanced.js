/**
 * UPDATE-ENHANCED.JS - Orchestrateur de mise à jour quotidienne
 * * Ce script coordonne la génération complète du site :
 * 1. Génération des horoscopes quotidiens
 * 2. Génération d'un article quotidien via l'IA
 * 3. Construction du site statique
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

console.log("🌟 ======================================");
console.log("🌟   ASTRO.LU - Mise à jour quotidienne");
console.log("🌟 ======================================\n");

// Fonction utilitaire pour exécuter un script
const runScript = (scriptPath, description) => {
    return new Promise((resolve, reject) => {
        console.log(`\n📍 ${description}...`);
        console.log("─".repeat(50));
        
        const process = exec(`node ${scriptPath}`);
        
        process.stdout.on('data', (data) => {
            console.log(data.toString().trim());
        });
        
        process.stderr.on('data', (data) => {
            console.error(data.toString().trim());
        });
        
        process.on('exit', (code) => {
            if (code === 0) {
                console.log(`✅ ${description} - Terminé avec succès\n`);
                resolve();
            } else {
                console.error(`❌ ${description} - Erreur (code ${code})\n`);
                reject(new Error(`${description} failed with code ${code}`));
            }
        });
    });
};

// Fonction principale de mise à jour
async function dailyUpdate() {
    const startTime = Date.now();
    
    try {
        // Étape 1 : Génération des horoscopes quotidiens
        await runScript('generator.js', '🔮 HOROSCOPES DU JOUR');
        
        // Étape 2 : Génération du contenu éditorial (1 article par jour)
        // Appel systématique au générateur intelligent qui trouve le sujet du jour
        await runScript('content-generator.js', '✍️  ARTICLE DU JOUR');
        
        // Étape 3 : Construction du site
        await runScript('builder-enhanced.js', '🏗️  COMPILATION DU SITE');
        
        // Statistiques finales
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log("\n");
        console.log("═".repeat(50));
        console.log("✨ MISE À JOUR TERMINÉE AVEC SUCCÈS ! ✨");
        console.log("═".repeat(50));
        console.log(`⏱️  Durée totale : ${duration} secondes`);
        console.log(`📅 Date : ${new Date().toLocaleString('fr-FR')}`);
        console.log("═".repeat(50));
        console.log("\n🚀 Le site est prêt à être publié !");
        console.log("💡 Exécutez 'git add . && git commit -m \"Update\" && git push' pour déployer");
        
        // Générer un rapport de mise à jour
        await generateUpdateReport(duration);
        
    } catch (error) {
        console.error("\n");
        console.error("═".repeat(50));
        console.error("❌ ERREUR LORS DE LA MISE À JOUR");
        console.error("═".repeat(50));
        console.error(error.message);
        console.error("\n💡 Consultez les logs ci-dessus pour plus de détails");
        process.exit(1);
    }
}

// Générer un rapport de mise à jour (Logs)
async function generateUpdateReport(duration) {
    const report = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('fr-FR'),
        duration: `${duration}s`,
        status: 'success',
        type: 'daily_update'
    };
    
    const reportPath = path.join(__dirname, 'logs', 'last-update.json');
    
    try {
        await fs.mkdir(path.join(__dirname, 'logs'), { recursive: true });
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    } catch (error) {
        console.warn("⚠️  Impossible de créer le rapport de mise à jour (dossier logs inaccessible ?)");
    }
}

// Point d'entrée
console.log("🔄 Démarrage de la séquence de mise à jour...\n");
dailyUpdate();