/**
 * BUILDER.JS - Générateur de Site Statique SEO
 * Usage: node builder.js
 */
const fs = require('fs/promises');
const path = require('path');

// Configuration du site
const SITE_URL = "https://astro.lu"; 
const OUTPUT_DIR = __dirname;

// 1. Calcul de la date de mise à jour (format : 8 janvier 2026 à 10:30)
const now = new Date();
const UPDATE_TIME = now.toLocaleDateString('fr-FR', {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
});

const SIGNS = [
    { id: 'belier', name: 'Bélier', symbol: '♈', dateStr: '21 Mars - 19 Avril' },
    { id: 'taureau', name: 'Taureau', symbol: '♉', dateStr: '20 Avril - 20 Mai' },
    { id: 'gemeaux', name: 'Gémeaux', symbol: '♊', dateStr: '21 Mai - 20 Juin' },
    { id: 'cancer', name: 'Cancer', symbol: '♋', dateStr: '21 Juin - 22 Juillet' },
    { id: 'lion', name: 'Lion', symbol: '♌', dateStr: '23 Juillet - 22 Août' },
    { id: 'vierge', name: 'Vierge', symbol: '♍', dateStr: '23 Août - 22 Septembre' },
    { id: 'balance', name: 'Balance', symbol: '♎', dateStr: '23 Septembre - 22 Octobre' },
    { id: 'scorpion', name: 'Scorpion', symbol: '♏', dateStr: '23 Octobre - 21 Novembre' },
    { id: 'sagittaire', name: 'Sagittaire', symbol: '♐', dateStr: '22 Novembre - 21 Décembre' },
    { id: 'capricorne', name: 'Capricorne', symbol: '♑', dateStr: '22 Décembre - 19 Janvier' },
    { id: 'verseau', name: 'Verseau', symbol: '♒', dateStr: '20 Janvier - 18 Février' },
    { id: 'poissons', name: 'Poissons', symbol: '♓', dateStr: '19 Février - 20 Mars' },
];

// Template HTML de base (Header/Footer communs)
const getBaseHtml = (seo, content, isHome = false) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <link rel="canonical" href="${seo.url}">
    
    <meta property="og:type" content="website">
    <meta property="og:url" content="${seo.url}">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="video-overlay"></div>
    <video autoplay muted loop playsinline id="bg-video">
        <source src="zodiak.mp4" type="video/mp4">
    </video>

    <header class="site-header">
        <div class="container header-content">
            <a href="index.html" class="logo" style="text-decoration:none;">
                <i data-lucide="sparkles" class="logo-icon"></i>
                <span>Astro.lu</span>
            </a>
            <nav class="nav-links">
                <a href="index.html">Accueil</a>
            </nav>
        </div>
    </header>

    <main class="container main-wrapper">
        ${content}
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Astro.lu &bull; Guidé par les étoiles.</p>
            <p style="font-size: 0.85em; opacity: 0.6; margin-top: 0.5rem;">
                Dernière mise à jour : ${UPDATE_TIME}
            </p>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>`;

async function build() {
    console.log("🏗️  Démarrage de la construction du site statique...");

    // 1. Charger le Summary
    let summary = {};
    try {
        const summaryData = await fs.readFile(path.join(__dirname, 'data/summary.json'), 'utf-8');
        summary = JSON.parse(summaryData);
    } catch (e) { console.error("⚠️ Pas de summary.json trouvé."); }

    // --- CONSTRUCTION DE LA HOMEPAGE ---
    console.log("📄 Génération de index.html");
    
    const gridHtml = SIGNS.map(sign => {
        const info = summary[sign.id] || {};
        const rating = info.rating || 3;
        const teaser = info.teaser || "Découvrez vos prévisions...";
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        
        return `
        <a href="horoscope-${sign.id}.html" class="sign-card" style="text-decoration:none;">
            <div class="sign-icon-circle">${sign.symbol}</div>
            <div class="card-header">
                <span class="sign-name">${sign.name}</span>
            </div>
            <div class="stars-container" title="${rating}/5">${stars}</div>
            <p class="sign-teaser">${teaser}</p>
            <span class="card-link">Lire l'horoscope</span>
        </a>`;
    }).join('');

    const homeContent = `
        <div class="hero-split">
            <div class="hero-date-block">
                <span class="hero-label">Horoscope du</span>
                <h1 id="hero-date">${new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</h1>
            </div>
            <div class="hero-sign-block">
                 <p style="font-size:1.1rem; color:#fff;">Les étoiles vous guident aujourd'hui.</p>
            </div>
        </div>

        <div class="sign-calculator-widget">
            <div class="widget-content">
                <h3><i data-lucide="search"></i> Quel est mon signe ?</h3>
                <div class="calculator-form">
                    <select id="calc-day" class="form-select"></select>
                    <select id="calc-month" class="form-select">
                        <option value="0">Janvier</option><option value="1">Février</option><option value="2">Mars</option>
                        <option value="3">Avril</option><option value="4">Mai</option><option value="5">Juin</option>
                        <option value="6">Juillet</option><option value="7">Août</option><option value="8">Septembre</option>
                        <option value="9">Octobre</option><option value="10">Novembre</option><option value="11">Décembre</option>
                    </select>
                    <button onclick="calculateSignRedirect()" class="btn-calc">Voir mon horoscope</button>
                </div>
            </div>
        </div>

        <div class="zodiac-grid">${gridHtml}</div>
        
        <div class="seo-text" style="background:var(--glass-bg); padding:2rem; border-radius:12px; margin-top:2rem;">
            <h2>Horoscope Gratuit du Jour</h2>
            <p>Retrouvez votre horoscope quotidien complet sur Astro.lu. Nos astrologues analysent les mouvements planétaires pour vous offrir des prévisions précises en amour, travail et santé pour les 12 signes du zodiaque : Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau et Poissons.</p>
        </div>
    `;

    const homeSeo = {
        title: "Horoscope du Jour Gratuit - Astro.lu",
        description: "Consultez votre horoscope quotidien gratuit. Amour, travail, santé : découvrez ce que les astres réservent à votre signe aujourd'hui.",
        url: `${SITE_URL}/index.html`
    };

    await fs.writeFile('index.html', getBaseHtml(homeSeo, homeContent, true));


    // --- CONSTRUCTION DES PAGES SIGNES ---
    for (const sign of SIGNS) {
        console.log(`✨ Génération de horoscope-${sign.id}.html`);
        
        let data = { 
            general: "Contenu indisponible.", 
            love: "", work: "", health: "", 
            ratings: {global:3, love:3, work:3, health:3},
            advice: "Revenez plus tard.",
            lucky_number: "?", color: "Mystère"
        };

        try {
            const jsonContent = await fs.readFile(path.join(__dirname, `data/${sign.id}.json`), 'utf-8');
            data = JSON.parse(jsonContent);
        } catch (e) { console.log(`   Info: Pas de JSON pour ${sign.id}, utilisation défaut.`); }

        const stars = (r) => '★'.repeat(r) + '☆'.repeat(5 - r);

        const signContent = `
            <a href="index.html" class="btn-back"><i data-lucide="chevron-left"></i> Retour aux signes</a>

            <article class="horoscope-full">
                <header class="horoscope-header">
                    <div class="header-symbol">${sign.symbol}</div>
                    <h1 class="horoscope-title">${sign.name}</h1>
                    <p class="sign-dates">${sign.dateStr}</p>
                    
                    <div class="header-meta">
                        <span class="date-badge">Horoscope du ${data.date || "Jour"}</span>
                        <span class="lucky-badge">🍀 ${data.lucky_number} • ${data.color}</span>
                    </div>
                </header>

                <div class="main-prediction">
                    <p>${data.general}</p>
                    <div class="advice-box">
                        <strong>💡 Conseil du jour :</strong> ${data.advice}
                    </div>
                </div>

                <div class="domains-grid">
                    <section class="domain-card">
                        <div class="domain-header">
                            <h3>❤️ Amour</h3>
                            <div class="rating-stars">${stars(data.ratings.love)}</div>
                        </div>
                        <p>${data.love}</p>
                    </section>
                    
                    <section class="domain-card">
                        <div class="domain-header">
                            <h3>💼 Travail</h3>
                            <div class="rating-stars">${stars(data.ratings.work)}</div>
                        </div>
                        <p>${data.work}</p>
                    </section>
                    
                    <section class="domain-card">
                        <div class="domain-header">
                            <h3>⚕️ Santé</h3>
                            <div class="rating-stars">${stars(data.ratings.health)}</div>
                        </div>
                        <p>${data.health}</p>
                    </section>
                </div>
            </article>
        `;

        const signSeo = {
            title: `Horoscope ${sign.name} du Jour - Amour, Travail, Santé`,
            description: `Prévisions gratuites pour le ${sign.name} aujourd'hui : ${data.teaser || "climat astral, amours et conseils..."}`,
            url: `${SITE_URL}/horoscope-${sign.id}.html`
        };

        await fs.writeFile(`horoscope-${sign.id}.html`, getBaseHtml(signSeo, signContent));
    }

    // --- SITEMAP ---
    console.log("🗺️  Génération du Sitemap.xml");
    const today = new Date().toISOString().split('T')[0];
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/index.html</loc>
        <lastmod>${today}</lastmod>
        <priority>1.0</priority>
    </url>`;

    SIGNS.forEach(sign => {
        sitemap += `
    <url>
        <loc>${SITE_URL}/horoscope-${sign.id}.html</loc>
        <lastmod>${today}</lastmod>
        <priority>0.8</priority>
    </url>`;
    });

    sitemap += `\n</urlset>`;
    await fs.writeFile('sitemap.xml', sitemap);

    console.log("✅ Site statique généré avec date de mise à jour !");
}

build();