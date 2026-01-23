/**
 * BUILDER-ENHANCED.JS - Version Corrective (SEO, Links, Time, Blog)
 */
const fs = require('fs/promises');
const path = require('path');
const { LOCALES, SIGNS_TRANS } = require('./lib/locales');

const SITE_URL = "https://astro.lu";
const NOW = new Date();

// Configuration des signes
const BASE_SIGNS = [
    { id: 'belier', name: 'Bélier', symbol: '♈', dateStr: '21/03 - 19/04' },
    { id: 'taureau', name: 'Taureau', symbol: '♉', dateStr: '20/04 - 20/05' },
    { id: 'gemeaux', name: 'Gémeaux', symbol: '♊', dateStr: '21/05 - 20/06' },
    { id: 'cancer', name: 'Cancer', symbol: '♋', dateStr: '21/06 - 22/07' },
    { id: 'lion', name: 'Lion', symbol: '♌', dateStr: '23/07 - 22/08' },
    { id: 'vierge', name: 'Vierge', symbol: '♍', dateStr: '23/08 - 22/09' },
    { id: 'balance', name: 'Balance', symbol: '♎', dateStr: '23/09 - 22/10' },
    { id: 'scorpion', name: 'Scorpion', symbol: '♏', dateStr: '23/10 - 21/11' },
    { id: 'sagittaire', name: 'Sagittaire', symbol: '♐', dateStr: '22/11 - 21/12' },
    { id: 'capricorne', name: 'Capricorne', symbol: '♑', dateStr: '22/12 - 19/01' },
    { id: 'verseau', name: 'Verseau', symbol: '♒', dateStr: '20/01 - 18/02' },
    { id: 'poissons', name: 'Poissons', symbol: '♓', dateStr: '19/02 - 20/03' },
];

// Helper Date Complète (Jour + Heure)
const formatDateTime = (date, lang) => {
    const localeCode = lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'de-DE';
    return date.toLocaleString(localeCode, LOCALES[lang].dateFormat);
};

// Helper Date Simple (pour l'injection SEO : "22 janvier 2026")
const formatDateSimple = (date, lang) => {
    const localeCode = lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'de-DE';
    return date.toLocaleDateString(localeCode, { day: 'numeric', month: 'long', year: 'numeric' });
};

const getSignName = (id, lang) => (lang === 'fr') ? BASE_SIGNS.find(s=>s.id===id).name : SIGNS_TRANS[id][lang];

// TEMPLATE HTML PRINCIPAL
const getHtml = (seo, content, pathToRoot, langCode, extraHead = '') => {
    const t = LOCALES[langCode];
    
    // Normalisation des chemins (Windows/Unix)
    const cleanPath = (p) => p === '.' ? '.' : p.replace(/\\/g, '/');
    const rootRel = cleanPath(pathToRoot);
    const homeLink = rootRel === '.' ? './' : rootRel + '/';
    
    // CORRECTION DES LIENS (Relatifs à la racine de la langue)
    const assetPath = (langCode === 'fr') ? rootRel : cleanPath(path.join(rootRel, '..'));
    const blogLink = homeLink + 'blog/';
    
    // Liens Footer : Doivent toujours pointer vers legal.html à la racine de la langue
    const legalLink = cleanPath(path.join(rootRel, 'legal.html'));
    const contactLink = cleanPath(path.join(rootRel, 'contact.html'));

    // Sélecteur de langue
    const langSwitch = `
        <div class="lang-switch">
            <a href="${assetPath}/" class="${langCode==='fr'?'active':''}">FR</a>
            <a href="${assetPath}/en/" class="${langCode==='en'?'active':''}">EN</a>
            <a href="${assetPath}/de/" class="${langCode==='de'?'active':''}">DE</a>
        </div>
    `;

    return `<!DOCTYPE html>
<html lang="${langCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <link rel="icon" href="${assetPath}/favicon.png" type="image/png">
    <link rel="stylesheet" href="${assetPath}/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
    <script>const CURRENT_LANG = "${langCode}";</script>
    ${extraHead}
</head>
<body data-lang="${langCode}">
    <div class="video-overlay"></div>
    <video autoplay muted loop playsinline id="bg-video"><source src="${assetPath}/zodiak.mp4" type="video/mp4"></video>

    <header class="site-header">
        <div class="top-bar">
            <div class="container top-bar-content">
                <span class="update-badge"><i data-lucide="clock" class="icon-sm"></i> ${t.footer.update} : ${formatDateTime(NOW, langCode)}</span>
                <div class="top-socials">${langSwitch}</div>
            </div>
        </div>
        <div class="main-header">
            <div class="container header-content">
                <a href="${homeLink}" class="logo">
                    <div class="logo-symbol"><i data-lucide="sparkles"></i></div>
                    <span>Astro.lu</span>
                </a>
                <nav class="nav-links">
                    <a href="${homeLink}">${t.nav.horoscope}</a>
                    <a href="${blogLink}">${t.nav.blog}</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="container main-wrapper">${content}</main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col brand-col">
                <div class="footer-logo">Astro.lu</div>
                <p>${t.footer.about}</p>
                <div class="last-update-footer">
                   <i data-lucide="refresh-cw"></i> ${t.footer.update} : <strong>${formatDateTime(NOW, langCode)}</strong>
                </div>
            </div>
            <div class="footer-col">
                <h4>Navigation</h4>
                <ul>
                    <li><a href="${homeLink}">${t.nav.horoscope}</a></li>
                    <li><a href="${blogLink}">${t.nav.blog}</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Information</h4>
                <ul>
                    <li><a href="${legalLink}">${t.footer.legal_title}</a></li>
                    <li><a href="${contactLink}">${t.footer.contact}</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${NOW.getFullYear()} Astro.lu &bull; ${t.footer.rights}</p>
        </div>
    </footer>
    <script src="${assetPath}/script.js"></script>
</body>
</html>`;
};

async function buildLanguage(lang) {
    console.log(`🏗️  Construction version : [${lang.toUpperCase()}]...`);
    const t = LOCALES[lang];
    const outDir = lang === 'fr' ? '.' : lang;
    if (lang !== 'fr') await fs.mkdir(outDir, { recursive: true });

    // 1. Charger Summary
    let summary = {};
    const summaryFile = lang === 'fr' ? 'summary.json' : `summary.${lang}.json`;
    try { summary = JSON.parse(await fs.readFile(path.join(__dirname, 'data', summaryFile), 'utf-8')); } catch (e) {
        try { summary = JSON.parse(await fs.readFile(path.join(__dirname, 'data/summary.json'), 'utf-8')); } catch(err) {}
    }

    // 2. Index / Home
    const gridHtml = BASE_SIGNS.map(sign => {
        const info = summary[sign.id] || { rating: 3, teaser: "..." };
        const stars = '★'.repeat(info.rating) + '<span class="star-dim">' + '★'.repeat(5 - info.rating) + '</span>';
        return `
        <a href="horoscope-${sign.id}/" class="sign-card" data-sign="${sign.id}">
            <div class="card-glow"></div>
            <div class="sign-icon-wrapper">${sign.symbol}</div>
            <div class="card-content">
                <span class="sign-name">${getSignName(sign.id, lang)}</span>
                <span class="sign-date">${sign.dateStr}</span>
                <div class="stars-container">${stars}</div>
                <p class="sign-teaser">${info.teaser}</p>
                <span class="card-link">${t.card.link} <i data-lucide="arrow-right"></i></span>
            </div>
        </a>`;
    }).join('');

    const monthOptions = t.months.map((m, i) => `<option value="${i}">${m}</option>`).join('');
    const dateStr = formatDateSimple(NOW, lang); // "22 Janvier 2026"

    // SEO Injection
    const homeTitle = t.meta.title.replace('{{date}}', dateStr);
    const homeDesc = t.meta.description ? t.meta.description.replace('{{date}}', dateStr) : t.meta.desc.replace('{{date}}', dateStr);

    const homeContent = `
        <div class="hero-section">
            <div class="hero-content">
                <span class="hero-subtitle">${t.hero.subtitle}</span>
                <h1 class="hero-title">${t.hero.title} <span class="highlight-date">${dateStr.split(' ').slice(0,2).join(' ')}</span></h1>
                <p class="hero-desc">${t.hero.desc}</p>
                <div class="sign-calculator-widget">
                    <h3><i data-lucide="search"></i> ${t.calc.title}</h3>
                    <div class="calculator-form">
                        <select id="calc-day" class="form-select"></select>
                        <select id="calc-month" class="form-select">${monthOptions}</select>
                        <button onclick="calculateSignRedirect()" class="btn-calc">${t.calc.btn}</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="zodiac-grid-container">
            <div class="zodiac-grid">${gridHtml}</div>
        </div>`;

    await fs.writeFile(path.join(outDir, 'index.html'), getHtml({
        title: homeTitle,
        description: homeDesc,
    }, homeContent, '.', lang));

    // 3. Pages Horoscope
    for (const sign of BASE_SIGNS) {
        let data = { general: "...", ratings: {love:3, work:3, health:3}, advice: "...", lucky_number: "?" };
        const jsonName = lang === 'fr' ? `${sign.id}.json` : `${sign.id}.${lang}.json`;
        try { data = JSON.parse(await fs.readFile(path.join(__dirname, 'data', jsonName), 'utf-8')); } catch (e) {
            try { data = JSON.parse(await fs.readFile(path.join(__dirname, `data/${sign.id}.json`), 'utf-8')); } catch(err) {}
        }
        const stars = (r) => '★'.repeat(r) + '<span class="star-dim">' + '★'.repeat(5 - r) + '</span>';

        // SEO Injection pour horoscope
        const signTitle = `${getSignName(sign.id, lang)}: ${t.nav.horoscope} ${dateStr} | Astro.lu`;
        const signDesc = `${t.nav.horoscope} ${getSignName(sign.id, lang)} ${dateStr}. Amour: ${data.ratings.love}/5, Travail: ${data.ratings.work}/5. ${data.general.substring(0, 100)}...`;

        const signContent = `
            <div class="nav-breadcrumb"><a href="../" class="btn-back"><i data-lucide="arrow-left"></i> ${t.nav.back}</a></div>
            <article class="horoscope-full">
                <header class="horoscope-header">
                    <div class="sign-badge">${sign.symbol}</div>
                    <h1 class="horoscope-title">${getSignName(sign.id, lang)}</h1>
                    <p class="horoscope-date">${dateStr}</p>
                    <div class="lucky-metrics">
                        <div class="metric-item"><i data-lucide="sparkles"></i><span>${t.card.chance}: <strong>${data.lucky_number}</strong></span></div>
                        <div class="metric-item"><i data-lucide="palette"></i><span>${t.card.color}: <strong>${data.color}</strong></span></div>
                    </div>
                </header>
                <div class="main-prediction card-glass">
                    <div class="prediction-content"><h2>${t.sections.general}</h2><p>${data.general}</p></div>
                    <div class="advice-box">
                        <div class="advice-icon"><i data-lucide="lightbulb"></i></div>
                        <div class="advice-text"><strong>${t.sections.advice}</strong><p>${data.advice}</p></div>
                    </div>
                </div>
                <div class="domains-grid">
                    <section class="domain-card card-glass">
                        <div class="domain-header"><i data-lucide="heart" class="icon-love"></i><h3>${t.sections.love}</h3><div class="mini-stars">${stars(data.ratings.love)}</div></div>
                        <p>${data.love}</p>
                    </section>
                    <section class="domain-card card-glass">
                        <div class="domain-header"><i data-lucide="briefcase" class="icon-work"></i><h3>${t.sections.work}</h3><div class="mini-stars">${stars(data.ratings.work)}</div></div>
                        <p>${data.work}</p>
                    </section>
                    <section class="domain-card card-glass">
                        <div class="domain-header"><i data-lucide="activity" class="icon-health"></i><h3>${t.sections.health}</h3><div class="mini-stars">${stars(data.ratings.health)}</div></div>
                        <p>${data.health}</p>
                    </section>
                </div>
            </article>`;

        const folder = path.join(outDir, `horoscope-${sign.id}`);
        await fs.mkdir(folder, { recursive: true });
        const rootRel = lang === 'fr' ? '..' : '../..';
        await fs.writeFile(path.join(folder, 'index.html'), getHtml({ title: signTitle, description: signDesc }, signContent, rootRel, lang));
    }

    // 4. Blog (FIXED PATHS)
    await buildBlog(lang, outDir, t);
}

async function buildBlog(lang, outDir, t) {
    const blogDir = path.join(outDir, 'blog');
    await fs.mkdir(blogDir, { recursive: true });
    
    // Charger l'index des articles
    let articles = [];
    try { articles = JSON.parse(await fs.readFile(path.join(__dirname, 'content/index.json'), 'utf-8')); } catch (e) {
        console.warn("⚠️ Pas d'index de blog trouvé ou vide.");
    }

    const rootRel = lang === 'fr' ? '..' : '../..';
    // Pour lister les articles, le lien doit être relatif à la page /blog/
    // Si on est dans /blog/, pour aller à /content/slug/, on doit faire ../content/slug/
    const pathToContent = lang === 'fr' ? '../content' : '../../content';

    const blogList = articles.map(item => `
        <article class="blog-card card-glass">
            <div class="blog-card-content">
                <span class="blog-date">${new Date(item.date).toLocaleDateString()}</span>
                <h2><a href="${pathToContent}/${item.slug}/">${item.title}</a></h2>
                <p class="blog-excerpt">${item.excerpt}</p>
                <a href="${pathToContent}/${item.slug}/" class="read-more">${t.nav.read_more} <i data-lucide="arrow-right"></i></a>
            </div>
        </article>`).join('');

    await fs.writeFile(path.join(blogDir, 'index.html'), getHtml({
        title: `${t.nav.blog} | Astro.lu`,
        description: "Articles astrologie et conseils spirituels."
    }, `
        <div class="page-header"><span class="sub-header">Magazine</span><h1>${t.nav.blog}</h1></div>
        <div class="blog-grid container">${blogList || '<p>Chargement...</p>'}</div>
    `, rootRel, lang));

    // GENERATION DES PAGES ARTICLES (Seulement pour le FR pour l'instant ou Multilingue si dispo)
    // IMPORTANT : On génère les fichiers HTML des articles uniquement lors de la passe FR
    // car le dossier /content/ est partagé (ou alors il faudrait dupliquer /content/ dans /en/ et /de/)
    if (lang === 'fr') {
        const contentDir = path.join(__dirname, 'content');
        for (const item of articles) {
            try {
                // Lecture du fichier JSON source
                const articleData = JSON.parse(await fs.readFile(path.join(contentDir, `${item.slug}.json`), 'utf-8'));
                
                const articleHtml = `
                    <article class="article-full card-glass">
                        <div class="article-nav"><a href="../../blog/" class="btn-text"><i data-lucide="arrow-left"></i> ${t.nav.back_blog}</a></div>
                        <header class="article-header">
                            <div class="article-meta">
                                <span class="article-date"><i data-lucide="calendar"></i> ${item.publishDate}</span>
                            </div>
                            <h1>${articleData.title}</h1>
                        </header>
                        <div class="article-content">${articleData.content}</div>
                    </article>`;
                
                // Création du dossier physique : content/slug/
                const articleFolder = path.join(contentDir, item.slug);
                await fs.mkdir(articleFolder, { recursive: true });
                
                // Le fichier HTML est dans content/slug/index.html.
                // Sa racine est donc ../../
                await fs.writeFile(path.join(articleFolder, 'index.html'), getHtml({
                    title: `${articleData.title} | Astro.lu`,
                    description: articleData.excerpt
                }, articleHtml, '../..', 'fr')); // Force FR pour les articles content/
                
            } catch (e) {
                console.error(`❌ Erreur article ${item.slug}:`, e.message);
            }
        }
    }
}

async function main() {
    await buildLanguage('fr');
    await buildLanguage('en');
    await buildLanguage('de');
    console.log("✅ Site généré : SEO OK, Dates OK, Blog OK.");
}

main();