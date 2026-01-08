/**
 * UPDATE-ENHANCED.JS - Orchestrateur de mise à jour quotidienne
 * 
 * Ce script coordonne la génération complète du site :
 * 1. Génération des horoscopes quotidiens
 * 2. Génération du contenu éditorial (articles/guides)
 * 3. Construction du site statique
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const DAYS_BETWEEN_CONTENT = 3; // Générer du nouveau contenu tous les X jours
const CONFIG_FILE = path.join(__dirname, '.last-content-gen.json');

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

// Vérifier si on doit générer du nouveau contenu
async function shouldGenerateContent() {
    try {
        const configData = await fs.readFile(CONFIG_FILE, 'utf-8');
        const config = JSON.parse(configData);
        
        const lastGen = new Date(config.lastContentGeneration);
        const now = new Date();
        const daysSinceLastGen = Math.floor((now - lastGen) / (1000 * 60 * 60 * 24));
        
        console.log(`ℹ️  Dernier contenu généré il y a ${daysSinceLastGen} jour(s)`);
        
        return daysSinceLastGen >= DAYS_BETWEEN_CONTENT;
    } catch (error) {
        // Si le fichier n'existe pas, on génère du contenu
        console.log("ℹ️  Première génération de contenu");
        return true;
    }
}

// Mettre à jour la date de dernière génération de contenu
async function updateContentGenerationDate() {
    const config = {
        lastContentGeneration: new Date().toISOString(),
        generationCount: await getGenerationCount() + 1
    };
    
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Obtenir le nombre de générations effectuées
async function getGenerationCount() {
    try {
        const configData = await fs.readFile(CONFIG_FILE, 'utf-8');
        const config = JSON.parse(configData);
        return config.generationCount || 0;
    } catch (error) {
        return 0;
    }
}

// Fonction principale de mise à jour
async function dailyUpdate() {
    const startTime = Date.now();
    
    try {
        // Étape 1 : Génération des horoscopes quotidiens
        await runScript('generator.js', 'GÉNÉRATION DES HOROSCOPES');
        
        // Étape 2 : Génération du contenu éditorial (si nécessaire)
        const shouldGenContent = await shouldGenerateContent();
        
        if (shouldGenContent) {
            console.log("\n🎨 Génération de nouveau contenu éditorial programmée");
            
            try {
                await runScript('content-generator.js', 'GÉNÉRATION DU CONTENU ÉDITORIAL');
                await updateContentGenerationDate();
            } catch (error) {
                console.warn("⚠️  Erreur lors de la génération de contenu, on continue...");
                console.warn(error.message);
            }
        } else {
            console.log("\n⏭️  Génération de contenu éditorial non nécessaire aujourd'hui");
        }
        
        // Étape 3 : Construction du site
        await runScript('builder-enhanced.js', 'CONSTRUCTION DU SITE');
        
        // Statistiques finales
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        const generationCount = await getGenerationCount();
        
        console.log("\n");
        console.log("═".repeat(50));
        console.log("✨ MISE À JOUR TERMINÉE AVEC SUCCÈS ! ✨");
        console.log("═".repeat(50));
        console.log(`⏱️  Durée totale : ${duration} secondes`);
        console.log(`📊 Générations de contenu : ${generationCount}`);
        console.log(`📅 Date : ${new Date().toLocaleString('fr-FR')}`);
        console.log("═".repeat(50));
        console.log("\n🚀 Le site est prêt à être publié !");
        console.log("💡 Exécutez 'git add . && git commit -m \"Update\" && git push' pour déployer");
        
        // Générer un rapport de mise à jour
        await generateUpdateReport(duration, generationCount);
        
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

// Générer un rapport de mise à jour
async function generateUpdateReport(duration, generationCount) {
    const report = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('fr-FR'),
        duration: `${duration}s`,
        generationCount: generationCount,
        status: 'success'
    };
    
    const reportPath = path.join(__dirname, 'logs', 'last-update.json');
    
    try {
        await fs.mkdir(path.join(__dirname, 'logs'), { recursive: true });
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    } catch (error) {
        console.warn("⚠️  Impossible de créer le rapport de mise à jour");
    }
}

// Point d'entrée
console.log("🔄 Démarrage de la séquence de mise à jour...\n");
dailyUpdate();