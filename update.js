const { exec } = require('child_process');

console.log("🔄 Lancement de la mise à jour quotidienne...");

// 1. Lancer le Générateur
const runGenerator = () => {
    return new Promise((resolve, reject) => {
        const process = exec('node generator.js');
        
        process.stdout.on('data', (data) => console.log(data.toString()));
        process.stderr.on('data', (data) => console.error(data.toString()));
        
        process.on('exit', (code) => {
            if (code === 0) resolve();
            else reject('Erreur Générateur');
        });
    });
};

// 2. Lancer le Builder
const runBuilder = () => {
    return new Promise((resolve, reject) => {
        const process = exec('node builder.js');
        
        process.stdout.on('data', (data) => console.log(data.toString()));
        process.stderr.on('data', (data) => console.error(data.toString()));
        
        process.on('exit', (code) => {
            if (code === 0) resolve();
            else reject('Erreur Builder');
        });
    });
};

// Exécution séquentielle
async function dailyUpdate() {
    try {
        await runGenerator();
        console.log("-----------------------------------");
        await runBuilder();
        console.log("✅ TOUT EST À JOUR ! Site prêt à être publié.");
    } catch (error) {
        console.error("❌ Une erreur est survenue :", error);
    }
}

dailyUpdate();