/**
 * BUILDER-ENHANCED.JS - Version Finale (Clean & Visible)
 */
const fs = require('fs/promises');
const path = require('path');

const SITE_URL = "https://astro.lu";
const NOW = new Date();

// Formatage de la date de mise à jour
const UPDATE_DATE_STR = NOW.toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'long', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
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

const getBaseHtml = (seo, content, rootPath = '.', extraHead = '') => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <link rel="canonical" href="${seo.url}">
    <link rel="icon" href="${rootPath}/favicon.png" type="image/png">
    <link rel="stylesheet" href="${rootPath}/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
    ${extraHead}
</head>
<body>
    <div class="video-overlay"></div>
    <video autoplay muted loop playsinline id="bg-video"><source src="${rootPath}/zodiak.mp4" type="video/mp4"></video>

    <header class="site-header">
        <div class="top-bar">
            <div class="container top-bar-content">
                <span class="update-badge"><i data-lucide="clock" class="icon-sm"></i> Mise à jour : ${UPDATE_DATE_STR}</span>
                <div class="top-socials">
                    <span>Astro.lu</span>
                </div>
            </div>
        </div>
        <div class="main-header">
            <div class="container header-content">
                <a href="${rootPath}/" class="logo">
                    <div class="logo-symbol"><i data-lucide="sparkles"></i></div>
                    <span>Astro.lu</span>
                </a>
                <nav class="nav-links">
                    <a href="${rootPath}/">Horoscope</a>
                    <a href="${rootPath}/blog/">Blog & Conseils</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="container main-wrapper">${content}</main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col brand-col">
                <div class="footer-logo">Astro.lu</div>
                <p>Votre guide céleste quotidien. Des prédictions précises basées sur l'analyse des transits planétaires et la sagesse ancestrale.</p>
                <div class="last-update-footer">
                   <i data-lucide="refresh-cw"></i> Dernière mise à jour : <strong>${UPDATE_DATE_STR}</strong>
                </div>
            </div>
            <div class="footer-col">
                <h4>Navigation</h4>
                <ul>
                    <li><a href="${rootPath}/">Horoscope du Jour</a></li>
                    <li><a href="${rootPath}/blog/">Blog Astrologique</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Mentions</h4>
                <ul>
                    <li><a href="#">Confidentialité</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${NOW.getFullYear()} Astro.lu &bull; Guidé par les étoiles.</p>
        </div>
    </footer>
    <script src="${rootPath}/script.js"></script>
</body>
</html>`;

async function build() {
    console.log("🏗️  Construction du site (Version Finale)...");

    let summary = {};
    try { summary = JSON.parse(await fs.readFile(path.join(__dirname, 'data/summary.json'), 'utf-8')); } catch (e) {}

    const gridHtml = SIGNS.map(sign => {
        const info = summary[sign.id] || { rating: 3, teaser: "Découvrez vos prévisions..." };
        const stars = '★'.repeat(info.rating) + '<span class="star-dim">' + '★'.repeat(5 - info.rating) + '</span>';
        return `
        <a href="horoscope-${sign.id}/" class="sign-card" data-sign="${sign.id}">
            <div class="card-glow"></div>
            <div class="sign-icon-wrapper">${sign.symbol}</div>
            <div class="card-content">
                <span class="sign-name">${sign.name}</span>
                <span class="sign-date">${sign.dateStr}</span>
                <div class="stars-container">${stars}</div>
                <p class="sign-teaser">${info.teaser}</p>
                <span class="card-link">Lire l'horoscope <i data-lucide="arrow-right"></i></span>
            </div>
        </a>`;
    }).join('');

    const homeContent = `
        <div class="hero-section">
            <div class="hero-content">
                <span class="hero-subtitle">Guidance Quotidienne</span>
                <h1 class="hero-title">Horoscope du <span class="highlight-date">${NOW.toLocaleDateString('fr-FR', {day:'numeric', month:'long'})}</span></h1>
                <p class="hero-desc">Les étoiles s'alignent pour vous. Découvrez ce que l'univers vous réserve aujourd'hui.</p>
                
                <div class="sign-calculator-widget">
                    <h3><i data-lucide="search"></i> Calculez votre signe</h3>
                    <div class="calculator-form">
                        <select id="calc-day" class="form-select"></select>
                        <select id="calc-month" class="form-select">
                            <option value="0">Janvier</option><option value="1">Février</option><option value="2">Mars</option>
                            <option value="3">Avril</option><option value="4">Mai</option><option value="5">Juin</option>
                            <option value="6">Juillet</option><option value="7">Août</option><option value="8">Septembre</option>
                            <option value="9">Octobre</option><option value="10">Novembre</option><option value="11">Décembre</option>
                        </select>
                        <button onclick="calculateSignRedirect()" class="btn-calc">Révéler</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="zodiac-grid-container">
            <h2 class="section-title">Choisissez votre Signe</h2>
            <div class="zodiac-grid">${gridHtml}</div>
        </div>

        <div class="cta-section">
            <div class="cta-content">
                <h2>Envie d'aller plus loin ?</h2>
                <p>Explorez nos analyses approfondies et nos guides spirituels.</p>
                <a href="blog/" class="btn-primary">Visiter le Blog</a>
            </div>
        </div>`;

    await fs.writeFile('index.html', getBaseHtml({
        title: "Horoscope du Jour Gratuit | Astro.lu",
        description: "Votre horoscope quotidien gratuit et complet, mis à jour en temps réel.",
        url: `${SITE_URL}/`
    }, homeContent, '.'));

    for (const sign of SIGNS) {
        let data = { general: "...", ratings: {love:3, work:3, health:3}, advice: "...", lucky_number: "?", color: "..." };
        try { data = JSON.parse(await fs.readFile(path.join(__dirname, `data/${sign.id}.json`), 'utf-8')); } catch (e) {}
        const stars = (r) => '★'.repeat(r) + '<span class="star-dim">' + '★'.repeat(5 - r) + '</span>';

        const signContent = `
            <div class="nav-breadcrumb">
                <a href="../" class="btn-back"><i data-lucide="arrow-left"></i> Tous les signes</a>
            </div>
            <article class="horoscope-full">
                <header class="horoscope-header">
                    <div class="sign-badge">${sign.symbol}</div>
                    <h1 class="horoscope-title">${sign.name}</h1>
                    <p class="horoscope-date">${NOW.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
                    
                    <div class="lucky-metrics">
                        <div class="metric-item">
                            <i data-lucide="sparkles"></i>
                            <span>Chance: <strong>${data.lucky_number}</strong></span>
                        </div>
                        <div class="metric-item">
                            <i data-lucide="palette"></i>
                            <span>Couleur: <strong>${data.color}</strong></span>
                        </div>
                    </div>
                </header>

                <div class="main-prediction card-glass">
                    <div class="prediction-content">
                        <h2>Atmosphère Générale</h2>
                        <p>${data.general}</p>
                    </div>
                    <div class="advice-box">
                        <div class="advice-icon"><i data-lucide="lightbulb"></i></div>
                        <div class="advice-text">
                            <strong>Conseil du jour</strong>
                            <p>${data.advice}</p>
                        </div>
                    </div>
                </div>

                <div class="domains-grid">
                    <section class="domain-card card-glass">
                        <div class="domain-header">
                            <i data-lucide="heart" class="icon-love"></i>
                            <h3>Amour</h3>
                            <div class="mini-stars">${stars(data.ratings.love)}</div>
                        </div>
                        <p>${data.love}</p>
                    </section>
                    <section class="domain-card card-glass">
                        <div class="domain-header">
                            <i data-lucide="briefcase" class="icon-work"></i>
                            <h3>Travail</h3>
                            <div class="mini-stars">${stars(data.ratings.work)}</div>
                        </div>
                        <p>${data.work}</p>
                    </section>
                    <section class="domain-card card-glass">
                        <div class="domain-header">
                            <i data-lucide="activity" class="icon-health"></i>
                            <h3>Bien-être</h3>
                            <div class="mini-stars">${stars(data.ratings.health)}</div>
                        </div>
                        <p>${data.health}</p>
                    </section>
                </div>
            </article>`;

        const folder = path.join(__dirname, `horoscope-${sign.id}`);
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(path.join(folder, 'index.html'), getBaseHtml({
            title: `Horoscope ${sign.name} du Jour | Astro.lu`,
            description: `Prévisions ${sign.name} : ${data.teaser || ''}`,
            url: `${SITE_URL}/horoscope-${sign.id}/`
        }, signContent, '..'));
    }

    await buildBlog();
    await buildSitemap();
    console.log("✅ Site généré avec succès !");
}

async function buildBlog() {
    let articles = [];
    try { articles = JSON.parse(await fs.readFile(path.join(__dirname, 'content/index.json'), 'utf-8')); } catch (e) {}
    await fs.mkdir('blog', { recursive: true });
    
    const blogList = articles.map(item => `
        <article class="blog-card card-glass">
            <div class="blog-card-content">
                <span class="blog-date">${new Date(item.date).toLocaleDateString('fr-FR')}</span>
                <h2><a href="../content/${item.slug}/">${item.title}</a></h2>
                <p class="blog-excerpt">${item.excerpt}</p>
                <a href="../content/${item.slug}/" class="read-more">Lire l'article <i data-lucide="arrow-right"></i></a>
            </div>
        </article>`).join('');

    await fs.writeFile('blog/index.html', getBaseHtml({
        title: "Blog Astrologique & Conseils | Astro.lu",
        description: "Explorez nos articles sur l'astrologie, les signes et la spiritualité.",
        url: `${SITE_URL}/blog/`
    }, `
        <div class="page-header">
            <span class="sub-header">Magazine</span>
            <h1>Blog Astrologique</h1>
            <p>Comprendre le ciel pour mieux vivre sur Terre.</p>
        </div>
        <div class="blog-grid container">${blogList || '<p>Chargement des astres...</p>'}</div>
    `, '..'));

    await fs.mkdir('content', { recursive: true });
    for (const item of articles) {
        try {
            const article = JSON.parse(await fs.readFile(path.join(__dirname, `content/${item.slug}.json`), 'utf-8'));
            const articleHtml = `
                <article class="article-full card-glass">
                    <div class="article-nav">
                        <a href="../../blog/" class="btn-text"><i data-lucide="arrow-left"></i> Retour au blog</a>
                    </div>
                    <header class="article-header">
                        <div class="article-meta">
                            <span class="article-date"><i data-lucide="calendar"></i> ${article.publishDate}</span>
                            <span class="article-time"><i data-lucide="clock"></i> 5 min de lecture</span>
                        </div>
                        <h1>${article.title}</h1>
                        <div class="keywords">${(article.keywords||[]).map(k=>`<span class="tag">#${k}</span>`).join('')}</div>
                    </header>
                    <div class="article-content">${article.content}</div>
                </article>`;
            
            const folder = path.join(__dirname, `content/${item.slug}`);
            await fs.mkdir(folder, { recursive: true });
            await fs.writeFile(path.join(folder, 'index.html'), getBaseHtml({
                title: `${article.title} | Astro.lu`,
                description: article.excerpt,
                url: `${SITE_URL}/content/${item.slug}/`
            }, articleHtml, '../..'));
        } catch (e) {}
    }
}

async function buildSitemap() {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>
    <url><loc>${SITE_URL}/blog/</loc><priority>0.9</priority></url>`;
    SIGNS.forEach(s => sitemap += `<url><loc>${SITE_URL}/horoscope-${s.id}/</loc><priority>0.8</priority></url>`);
    try {
        const articles = JSON.parse(await fs.readFile(path.join(__dirname, 'content/index.json'), 'utf-8'));
        articles.forEach(a => sitemap += `<url><loc>${SITE_URL}/content/${a.slug}/</loc><priority>0.7</priority></url>`);
    } catch(e) {}
    sitemap += `</urlset>`;
    await fs.writeFile('sitemap.xml', sitemap);
}

build();