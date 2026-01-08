/**
 * BUILDER-ENHANCED.JS - Construction du site avec contenu éditorial
 */
const fs = require('fs/promises');
const path = require('path');

const SITE_URL = "https://astro.lu";
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

const NOW = new Date();
const BUILD_DATE = NOW.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
});

const getBaseHtml = (seo, content, rootPath = '.', extraHead = '') => `
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
    <link rel="stylesheet" href="${rootPath}/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    ${extraHead}
</head>
<body>
    <div class="video-overlay"></div>
    <video autoplay muted loop playsinline id="bg-video">
        <source src="${rootPath}/zodiak.mp4" type="video/mp4">
    </video>

    <header class="site-header">
        <div class="container header-content">
            <a href="${rootPath}/" class="logo" style="text-decoration:none;">
                <i data-lucide="sparkles" class="logo-icon"></i>
                <span>Astro.lu</span>
            </a>
            <nav class="nav-links">
                <a href="${rootPath}/">Accueil</a>
                <a href="${rootPath}/blog/">Blog</a>
                <a href="${rootPath}/guides/">Guides</a>
            </nav>
        </div>
    </header>

    <main class="container main-wrapper">
        ${content}
    </main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col">
                <h4>Astro.lu</h4>
                <p>Votre horoscope quotidien alimenté par l'intelligence artificielle.</p>
            </div>
            <div class="footer-col">
                <h4>Explorer</h4>
                <ul>
                    <li><a href="${rootPath}/">Horoscopes</a></li>
                    <li><a href="${rootPath}/blog/">Blog</a></li>
                    <li><a href="${rootPath}/guides/">Guides</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Suivez-nous</h4>
                <div class="social-links">
                    <a href="#" aria-label="Facebook"><i data-lucide="facebook"></i></a>
                    <a href="#" aria-label="Twitter"><i data-lucide="twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i data-lucide="instagram"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${NOW.getFullYear()} Astro.lu &bull; Guidé par les étoiles.</p>
            <p class="update-time">Dernière mise à jour : ${BUILD_DATE}</p>
        </div>
    </footer>

    <script src="${rootPath}/script.js"></script>
    <script>lucide.createIcons();</script>
</body>
</html>`;

async function build() {
    console.log("🏗️  Construction du site enrichi...");

    // 1. Charger le summary des horoscopes
    let summary = {};
    try {
        const summaryData = await fs.readFile(path.join(__dirname, 'data/summary.json'), 'utf-8');
        summary = JSON.parse(summaryData);
    } catch (e) { console.warn("⚠️ Pas de summary.json"); }

    // --- PAGE D'ACCUEIL ---
    console.log("📄 Génération de la page d'accueil");
    
    const gridHtml = SIGNS.map(sign => {
        const info = summary[sign.id] || {};
        const rating = info.rating || 3;
        const teaser = info.teaser || "Découvrez vos prévisions...";
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        
        return `
        <a href="horoscope-${sign.id}/" class="sign-card" style="text-decoration:none;">
            <div class="sign-icon-circle">${sign.symbol}</div>
            <div class="card-header">
                <span class="sign-name">${sign.name}</span>
            </div>
            <div class="stars-container" title="${rating}/5">${stars}</div>
            <p class="sign-teaser">${teaser}</p>
            <span class="card-link">Lire l'horoscope <i data-lucide="arrow-right"></i></span>
        </a>`;
    }).join('');

    const homeContent = `
        <div class="hero-split">
            <div class="hero-date-block">
                <span class="hero-label">Horoscope du</span>
                <h1 id="hero-date">${NOW.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</h1>
            </div>
            <div class="hero-sign-block">
                <p class="hero-tagline">✨ Les étoiles vous guident aujourd'hui</p>
            </div>
        </div>

        <div class="sign-calculator-widget">
            <div class="widget-content">
                <h3><i data-lucide="search"></i> Quel est mon signe ?</h3>
                <p class="widget-subtitle">Trouvez votre signe astrologique et consultez vos prévisions</p>
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

        <div class="section-header">
            <h2>Les 12 Signes du Zodiaque</h2>
            <p>Découvrez les prévisions détaillées pour chaque signe</p>
        </div>
        <div class="zodiac-grid">${gridHtml}</div>

        <div class="cta-section">
            <h2>Explorez l'univers de l'astrologie</h2>
            <p>Découvrez nos guides complets et articles pour approfondir vos connaissances</p>
            <div class="cta-buttons">
                <a href="blog/" class="btn-primary">Lire le blog</a>
                <a href="guides/" class="btn-secondary">Consulter les guides</a>
            </div>
        </div>
    `;

    const homeSeo = {
        title: "Horoscope du Jour Gratuit - Prévisions Astrologiques | Astro.lu",
        description: "Consultez votre horoscope quotidien gratuit. Prévisions astrologiques détaillées pour tous les signes du zodiaque.",
        url: `${SITE_URL}/`
    };

    await fs.writeFile('index.html', getBaseHtml(homeSeo, homeContent, '.'));

    // --- PAGES SIGNES ---
    for (const sign of SIGNS) {
        console.log(`✨ Génération : horoscope-${sign.id}/`);
        
        let data = { 
            general: "Contenu en cours de génération...", 
            love: "", work: "", health: "", 
            ratings: {global:3, love:3, work:3, health:3},
            advice: "Revenez bientôt.",
            lucky_number: "?", color: "Mystère"
        };

        try {
            const jsonContent = await fs.readFile(path.join(__dirname, `data/${sign.id}.json`), 'utf-8');
            data = JSON.parse(jsonContent);
        } catch (e) { }

        const stars = (r) => '★'.repeat(r) + '☆'.repeat(5 - r);

        const signContent = `
            <a href="../" class="btn-back"><i data-lucide="chevron-left"></i> Retour aux signes</a>

            <article class="horoscope-full">
                <header class="horoscope-header">
                    <div class="header-symbol">${sign.symbol}</div>
                    <h1 class="horoscope-title">${sign.name}</h1>
                    <p class="sign-dates">${sign.dateStr}</p>
                    
                    <div class="header-meta">
                        <span class="date-badge"><i data-lucide="calendar"></i> ${data.date || "Aujourd'hui"}</span>
                        <span class="lucky-badge"><i data-lucide="sparkles"></i> ${data.lucky_number} • ${data.color}</span>
                    </div>
                </header>

                <div class="main-prediction">
                    <p>${data.general}</p>
                    <div class="advice-box">
                        <i data-lucide="lightbulb"></i>
                        <div>
                            <strong>Conseil du jour</strong>
                            <p>${data.advice}</p>
                        </div>
                    </div>
                </div>

                <div class="domains-grid">
                    <section class="domain-card">
                        <div class="domain-header">
                            <h3><i data-lucide="heart"></i> Amour</h3>
                            <div class="rating-stars">${stars(data.ratings.love)}</div>
                        </div>
                        <p>${data.love}</p>
                    </section>
                    <section class="domain-card">
                        <div class="domain-header">
                            <h3><i data-lucide="briefcase"></i> Travail</h3>
                            <div class="rating-stars">${stars(data.ratings.work)}</div>
                        </div>
                        <p>${data.work}</p>
                    </section>
                    <section class="domain-card">
                        <div class="domain-header">
                            <h3><i data-lucide="activity"></i> Santé</h3>
                            <div class="rating-stars">${stars(data.ratings.health)}</div>
                        </div>
                        <p>${data.health}</p>
                    </section>
                </div>

                <div class="share-section">
                    <p>Partagez cet horoscope</p>
                    <div class="share-buttons">
                        <button onclick="shareHoroscope('facebook')" class="share-btn">
                            <i data-lucide="facebook"></i>
                        </button>
                        <button onclick="shareHoroscope('twitter')" class="share-btn">
                            <i data-lucide="twitter"></i>
                        </button>
                        <button onclick="copyLink()" class="share-btn">
                            <i data-lucide="link"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;

        const signSeo = {
            title: `Horoscope ${sign.name} du Jour - Prévisions ${sign.dateStr} | Astro.lu`,
            description: `${data.teaser || "Prévisions astrologiques quotidiennes"} - Découvrez l'horoscope complet du ${sign.name} : amour, travail, santé.`,
            url: `${SITE_URL}/horoscope-${sign.id}/`
        };

        const folderPath = path.join(__dirname, `horoscope-${sign.id}`);
        await fs.mkdir(folderPath, { recursive: true });
        await fs.writeFile(path.join(folderPath, 'index.html'), getBaseHtml(signSeo, signContent, '..'));
    }

    // --- PAGES DE CONTENU (BLOG & GUIDES) ---
    await buildContentPages();

    // --- SITEMAP ---
    await buildSitemap();

    console.log("✅ Site construit avec succès !");
}

async function buildContentPages() {
    console.log("\n📚 Construction des pages de contenu...");
    
    // Charger l'index des contenus
    let contentIndex = [];
    try {
        const indexData = await fs.readFile(path.join(__dirname, 'content/index.json'), 'utf-8');
        contentIndex = JSON.parse(indexData);
    } catch (e) {
        console.warn("⚠️ Pas de contenu généré trouvé");
        return;
    }

    // Créer la page Blog
    await fs.mkdir('blog', { recursive: true });
    
    const blogListHtml = contentIndex
        .filter(item => item.type === 'article')
        .map(item => `
        <article class="blog-card">
            <div class="blog-card-content">
                <span class="blog-date"><i data-lucide="calendar"></i> ${new Date(item.date).toLocaleDateString('fr-FR')}</span>
                <h2><a href="../content/${item.slug}/">${item.title}</a></h2>
                <p class="blog-excerpt">${item.excerpt}</p>
                <div class="blog-meta">
                    ${item.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
                </div>
                <a href="../content/${item.slug}/" class="read-more">Lire l'article <i data-lucide="arrow-right"></i></a>
            </div>
        </article>
    `).join('');

    const blogPageContent = `
        <div class="page-header">
            <h1><i data-lucide="book-open"></i> Blog Astrologique</h1>
            <p class="page-subtitle">Articles, conseils et découvertes sur l'astrologie</p>
        </div>
        <div class="blog-grid">
            ${blogListHtml || '<p>Aucun article disponible pour le moment.</p>'}
        </div>
    `;

    const blogSeo = {
        title: "Blog Astrologique - Articles et Conseils | Astro.lu",
        description: "Découvrez nos articles sur l'astrologie : compatibilité, phases lunaires, éléments astrologiques et bien plus.",
        url: `${SITE_URL}/blog/`
    };

    await fs.writeFile('blog/index.html', getBaseHtml(blogSeo, blogPageContent, '..'));

    // Créer la page Guides
    await fs.mkdir('guides', { recursive: true });
    
    const guidesListHtml = contentIndex
        .filter(item => item.type === 'guide')
        .map(item => `
        <article class="guide-card">
            <div class="guide-icon"><i data-lucide="book"></i></div>
            <h2><a href="../content/${item.slug}/">${item.title}</a></h2>
            <p>${item.excerpt}</p>
            <a href="../content/${item.slug}/" class="guide-link">Consulter le guide <i data-lucide="arrow-right"></i></a>
        </article>
    `).join('');

    const guidesPageContent = `
        <div class="page-header">
            <h1><i data-lucide="compass"></i> Guides Astrologiques</h1>
            <p class="page-subtitle">Approfondissez vos connaissances en astrologie</p>
        </div>
        <div class="guides-grid">
            ${guidesListHtml || '<p>Aucun guide disponible pour le moment.</p>'}
        </div>
    `;

    const guidesSeo = {
        title: "Guides Astrologiques Complets | Astro.lu",
        description: "Guides détaillés pour débuter et maîtriser l'astrologie : signes, planètes, maisons astrologiques.",
        url: `${SITE_URL}/guides/`
    };

    await fs.writeFile('guides/index.html', getBaseHtml(guidesSeo, guidesPageContent, '..'));

    // Créer les pages individuelles de contenu
    await fs.mkdir('content', { recursive: true });
    
    for (const item of contentIndex) {
        try {
            const contentData = await fs.readFile(
                path.join(__dirname, `content/${item.slug}.json`), 
                'utf-8'
            );
            const article = JSON.parse(contentData);

            const articleHtml = `
                <article class="article-full">
                    <a href="../../${article.type === 'guide' ? 'guides' : 'blog'}/" class="btn-back">
                        <i data-lucide="chevron-left"></i> Retour
                    </a>
                    
                    <header class="article-header">
                        <div class="article-meta">
                            <span class="article-type">${article.type === 'guide' ? '📖 Guide' : '📝 Article'}</span>
                            <span class="article-date">${article.publishDate}</span>
                            <span class="reading-time"><i data-lucide="clock"></i> ${article.readingTime}</span>
                        </div>
                        <h1>${article.title}</h1>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <div class="keywords">
                            ${article.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
                        </div>
                    </header>

                    <div class="article-content">
                        ${article.content}
                    </div>

                    <div class="article-footer">
                        <div class="share-section">
                            <p>Partager cet article</p>
                            <div class="share-buttons">
                                <button onclick="shareArticle('facebook')" class="share-btn">
                                    <i data-lucide="facebook"></i>
                                </button>
                                <button onclick="shareArticle('twitter')" class="share-btn">
                                    <i data-lucide="twitter"></i>
                                </button>
                                <button onclick="copyLink()" class="share-btn">
                                    <i data-lucide="link"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;

            const articleSeo = {
                title: `${article.title} | Astro.lu`,
                description: article.excerpt,
                url: `${SITE_URL}/content/${article.slug}/`
            };

            const articleFolder = path.join(__dirname, `content/${article.slug}`);
            await fs.mkdir(articleFolder, { recursive: true });
            await fs.writeFile(
                path.join(articleFolder, 'index.html'), 
                getBaseHtml(articleSeo, articleHtml, '../..')
            );

        } catch (e) {
            console.error(`❌ Erreur article ${item.slug}:`, e.message);
        }
    }

    console.log("✅ Pages de contenu créées !");
}

async function buildSitemap() {
    console.log("\n🗺️  Génération du Sitemap...");
    const sitemapDate = NOW.toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${sitemapDate}</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/blog/</loc>
        <lastmod>${sitemapDate}</lastmod>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${SITE_URL}/guides/</loc>
        <lastmod>${sitemapDate}</lastmod>
        <priority>0.9</priority>
    </url>`;

    SIGNS.forEach(sign => {
        sitemap += `
    <url>
        <loc>${SITE_URL}/horoscope-${sign.id}/</loc>
        <lastmod>${sitemapDate}</lastmod>
        <priority>0.8</priority>
    </url>`;
    });

    // Ajouter les articles
    try {
        const contentIndex = JSON.parse(
            await fs.readFile(path.join(__dirname, 'content/index.json'), 'utf-8')
        );
        contentIndex.forEach(item => {
            sitemap += `
    <url>
        <loc>${SITE_URL}/content/${item.slug}/</loc>
        <lastmod>${sitemapDate}</lastmod>
        <priority>0.7</priority>
    </url>`;
        });
    } catch (e) { }

    sitemap += `\n</urlset>`;
    await fs.writeFile('sitemap.xml', sitemap);
}

build();