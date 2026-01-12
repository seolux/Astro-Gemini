/**
 * TEST-ENV.JS - Diagnostic des clés API
 * Exécutez : node test-env.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log("🔍 DIAGNOSTIC DES CLÉS API");
console.log("═".repeat(50));

// 1. Vérifier l'emplacement du fichier .env
const envPath = path.join(__dirname, '.env');
console.log("\n📁 Chemin du fichier .env :");
console.log(`   ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log("   ✅ Fichier .env trouvé");
    
    // Lire le contenu (sans afficher les clés complètes)
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log(`\n📄 Contenu du .env (${lines.length} ligne(s)) :`);
    lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            const maskedValue = value.substring(0, 15) + '...' + value.substring(value.length - 4);
            console.log(`   ${key} = ${maskedValue}`);
        }
    });
} else {
    console.log("   ❌ Fichier .env NON TROUVÉ");
    console.log("\n💡 Créez un fichier .env à la racine du projet avec :");
    console.log("   OPENROUTER_API_KEYS=sk-or-v1-xxx,sk-or-v1-yyy,sk-or-v1-zzz");
}

console.log("\n" + "─".repeat(50));

// 2. Vérifier les variables d'environnement
console.log("\n🔑 Variables d'environnement chargées :");

const keys1 = process.env.OPENROUTER_API_KEYS;
const keys2 = process.env.OPENROUTER_API_KEY;

if (keys1) {
    console.log(`   ✅ OPENROUTER_API_KEYS trouvé`);
    const keyArray = keys1.split(',').map(k => k.trim()).filter(k => k);
    console.log(`   📊 Nombre de clés : ${keyArray.length}`);
    
    keyArray.forEach((key, index) => {
        const isValid = key.startsWith('sk-or-v1-');
        const status = isValid ? '✅' : '❌';
        const preview = key.substring(0, 15) + '...' + key.substring(key.length - 4);
        console.log(`   ${status} Clé ${index + 1} : ${preview} (${key.length} caractères)`);
        
        if (!isValid) {
            console.log(`      ⚠️  Format invalide ! Doit commencer par 'sk-or-v1-'`);
        }
    });
} else if (keys2) {
    console.log(`   ⚠️  OPENROUTER_API_KEY trouvé (ancien format)`);
    console.log(`   💡 Renommez en OPENROUTER_API_KEYS pour multi-clés`);
} else {
    console.log(`   ❌ Aucune variable OPENROUTER_API_KEYS ou OPENROUTER_API_KEY`);
}

console.log("\n" + "─".repeat(50));

// 3. Test de format
console.log("\n✅ FORMAT CORRECT attendu :");
console.log("   OPENROUTER_API_KEYS=sk-or-v1-1eb56...,sk-or-v1-2ab78...,sk-or-v1-3cd90...");
console.log("\n❌ FORMATS INCORRECTS :");
console.log("   OPENROUTER_API_KEYS=\"sk-or-v1-xxx,sk-or-v1-yyy\"  ← Pas de guillemets");
console.log("   OPENROUTER_API_KEYS=sk-or-v1-xxx, sk-or-v1-yyy    ← Pas d'espace après virgule");
console.log("   OPENROUTER_API_KEYS='sk-or-v1-xxx,sk-or-v1-yyy'   ← Pas d'apostrophes");

console.log("\n" + "═".repeat(50));

// 4. Vérifier si dotenv est installé
console.log("\n📦 Package dotenv :");
try {
    const dotenvPath = require.resolve('dotenv');
    console.log("   ✅ dotenv installé");
    console.log(`   📍 ${dotenvPath}`);
} catch (e) {
    console.log("   ❌ dotenv NON installé");
    console.log("   💡 Exécutez : npm install dotenv");
}

console.log("\n" + "═".repeat(50));
console.log("\n💡 PROCHAINES ÉTAPES :");
console.log("   1. Créez/corrigez votre fichier .env");
console.log("   2. Relancez : node test-env.js");
console.log("   3. Si tout est OK, lancez : node generator.js");
console.log("═".repeat(50));