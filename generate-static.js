/**
 * GENERATE-STATIC.JS - Version Finale (Production)
 * Génère les pages "Mentions Légales" et "Contact" avec contenu réel.
 * Usage : node generate-static.js
 */
const fs = require('fs/promises');
const path = require('path');
const { LOCALES } = require('./lib/locales');

const NOW = new Date();

// Helper Date
const formatDate = (date, lang) => {
    const localeCode = lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'de-DE';
    return date.toLocaleDateString(localeCode, LOCALES[lang].dateFormat);
};

// Template HTML
const getHtml = (seo, content, pathToRoot, langCode) => {
    const t = LOCALES[langCode];
    const assetPath = (langCode === 'fr') ? pathToRoot : path.join(pathToRoot, '..');
    const cleanAssetPath = assetPath === '.' ? '.' : assetPath.replace(/\\/g, '/');
    const homeLink = pathToRoot === '.' ? './' : pathToRoot + '/';
    const blogLink = homeLink + 'blog/';
    const legalLink = langCode === 'fr' ? 'legal.html' : 'legal.html';
    const contactLink = langCode === 'fr' ? 'contact.html' : 'contact.html';

    return `<!DOCTYPE html>
<html lang="${langCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <link rel="icon" href="${cleanAssetPath}/favicon.png" type="image/png">
    <link rel="stylesheet" href="${cleanAssetPath}/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        /* Styles spécifiques pour les pages statiques */
        .static-content h3 { color: var(--primary); margin-top: 2rem; margin-bottom: 1rem; font-family: var(--font-serif); }
        .static-content p { margin-bottom: 1rem; color: #e2e8f0; }
        .static-content ul { margin-bottom: 1.5rem; padding-left: 1.5rem; list-style-type: disc; color: #cbd5e1; }
        .static-content li { margin-bottom: 0.5rem; }
        .legal-info-box { background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--glass-border); margin-bottom: 2rem; }
        iframe { border-radius: 12px; }
    </style>
</head>
<body data-lang="${langCode}">
    <div class="video-overlay"></div>
    <video autoplay muted loop playsinline id="bg-video"><source src="${cleanAssetPath}/zodiak.mp4" type="video/mp4"></video>

    <header class="site-header">
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

    <main class="container main-wrapper" style="padding-top: 4rem; padding-bottom: 4rem;">
        <div class="card-glass" style="padding: 2rem; max-width: 900px; margin: 0 auto;">
            ${content}
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col brand-col">
                <div class="footer-logo">Astro.lu</div>
                <p>${t.footer.about}</p>
                <div class="last-update-footer">
                   <i data-lucide="refresh-cw"></i> ${t.footer.update} : <strong>${formatDate(NOW, langCode)}</strong>
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
    <script src="${cleanAssetPath}/script.js"></script>
</body>
</html>`;
};

async function generatePage(pageKey, fileName) {
    console.log(`📄 Génération de ${fileName}...`);

    for (const lang of ['fr', 'en', 'de']) {
        const t = LOCALES[lang];
        const title = t.static ? t.static[pageKey + '_title'] : (pageKey === 'legal' ? 'Mentions' : 'Contact');
        const desc = t.static ? t.static[pageKey + '_desc'] : 'Info page';
        
        let contentHtml = "";

        // ==========================================
        // PAGE CONTACT (TALLY EMBED)
        // ==========================================
        if (pageKey === 'contact') {
            const txt = {
                fr: "Une question, une suggestion ou besoin d'informations ? Remplissez le formulaire ci-dessous, notre équipe vous répondra dans les meilleurs délais.",
                en: "A question, a suggestion, or need information? Fill out the form below, and our team will get back to you as soon as possible.",
                de: "Haben Sie eine Frage, einen Vorschlag oder benötigen Sie Informationen? Füllen Sie das untenstehende Formular aus."
            }[lang];

            contentHtml = `
                <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary); text-align: center;">${title}</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem; text-align: center;">${txt}</p>
                
                <iframe data-tally-src="https://tally.so/embed/MeEzlX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="447" frameborder="0" marginheight="0" marginwidth="0" title="Contact"></iframe>
                <script>var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}</script>
            `;
        } 
        
        // ==========================================
        // PAGE MENTIONS LEGALES (CONTENU RÉEL)
        // ==========================================
        else if (pageKey === 'legal') {
            if (lang === 'fr') {
                contentHtml = `
                <div class="static-content">
                    <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem; color: var(--primary); text-align: center;">Mentions Légales & CGU</h1>
                    
                    <div class="legal-info-box">
                        <h3 style="margin-top:0">Informations légales</h3>
                        <p>Le site <strong>www.astro.lu</strong> est exploité par une société de droit luxembourgeois immatriculée au Registre de Commerce et des Sociétés du Luxembourg.</p>
                        <ul style="list-style: none; padding-left: 0;">
                            <li><strong>Numéro RCS :</strong> B 12.138</li>
                            <li><strong>Numéro de TVA :</strong> LU 164 485 13</li>
                            <li><strong>Siège social :</strong> 208, rue de Noertzange, L-3670 Kayl, Luxembourg</li>
                            <li><strong>Téléphone :</strong> (+352) 49 60 51-1</li>
                            <li><strong>Fax :</strong> (+352) 49 60 56</li>
                        </ul>
                    </div>

                    <h3>Objet</h3>
                    <p>Le site a pour vocation de mettre à disposition des utilisateurs un ensemble de contenus et de services relatifs à l’univers de l’astrologie et des arts divinatoires : horoscopes, études des signes, actualités astrales, conseils bien-être et outils numériques.</p>
                    <p>L’accès et l’utilisation du site impliquent l’adhésion pleine et entière aux présentes conditions générales d’utilisation (CGU).</p>

                    <h3>Accès et utilisation</h3>
                    <p>L’accès au site est gratuit, hors frais de connexion internet. L’utilisateur s’engage à un usage strictement personnel et à ne pas recourir à des procédés automatisés (robots, scrapers…). Toute extraction ou reproduction substantielle du contenu est interdite.</p>

                    <h3>Création d’un compte</h3>
                    <p>Certains services (gestion de profil, accès à des outils personnalisés, contenus exclusifs) nécessitent la création d’un compte. Les identifiants sont strictement personnels et l’utilisateur est seul responsable de leur utilisation. Toute utilisation frauduleuse doit être signalée sans délai.</p>

                    <h3>Contenus et responsabilités</h3>
                    <p>Les informations publiées sur le site sont régulièrement mises à jour mais peuvent contenir des inexactitudes. Les contenus liés à l'astrologie sont fournis à titre indicatif et de divertissement.</p>
                    <p>L’utilisateur demeure seul responsable de l’usage des informations et interprétations disponibles. Tout contenu illicite (diffamatoire, violent, haineux, pornographique, etc.) pourra être supprimé sans préavis.</p>

                    <h3>Propriété intellectuelle</h3>
                    <p>L’ensemble des éléments constitutifs du site (textes, images, illustrations, bases de données, logos, etc.) est protégé par la législation sur la propriété intellectuelle. Toute reproduction, diffusion ou exploitation non autorisée est interdite.</p>

                    <h3>Données personnelles</h3>
                    <p>Les données collectées via le site sont traitées conformément au RGPD et à la législation luxembourgeoise. Elles peuvent être utilisées pour la gestion des services, la personnalisation, la sécurité, la prospection (avec consentement) et la réalisation de statistiques.</p>
                    <p>L’utilisateur dispose d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de ses données. Ces droits s’exercent par mail ou par courrier à : <strong>Données Personnelles, 208, rue de Noertzange, L-3670 Kayl, Luxembourg</strong>, avec un justificatif d’identité.</p>
                    <p><em>Durées de conservation :</em> 3 ans max. pour la prospection, 10 ans pour les données contractuelles/comptables, 13 mois pour les cookies.</p>

                    <h3>Utilisation de cookies et outils de mesure</h3>
                    <p>Le site utilise des traceurs et outils de mesure d’audience tels que <strong>Piwik Pro</strong> et <strong>Microsoft Clarity</strong>. Ces solutions permettent d’analyser l’utilisation du site afin d’améliorer l’expérience utilisateur et les contenus proposés.</p>
                    <p>Le dépôt de cookies ou traceurs non essentiels est soumis au consentement préalable de l’utilisateur. Celui-ci peut le gérer à tout moment via la bannière ou les paramètres de confidentialité.</p>

                    <h3>Formulaires de contact</h3>
                    <p>Les informations fournies dans les formulaires de contact sont collectées dans le seul but de traiter la demande de l’utilisateur. Ces données restent strictement confidentielles et ne sont pas transmises à des tiers non autorisés.</p>

                    <h3>Droit applicable</h3>
                    <p>Les présentes conditions sont régies par le droit luxembourgeois. En cas de litige, les juridictions compétentes seront celles du Grand-Duché de Luxembourg.</p>
                </div>`;
            } else {
                // Version EN/DE (Placeholder pour l'instant pour éviter les erreurs juridiques)
                const warning = lang === 'en' ? "Please refer to the French version for the legally binding terms." : "Bitte beziehen Sie sich auf die französische Version für die rechtlich bindenden Bedingungen.";
                const titleTrans = lang === 'en' ? "Legal Notice" : "Impressum";
                
                contentHtml = `
                    <div class="static-content" style="text-align:center; min-height:400px; display:flex; flex-direction:column; justify-content:center;">
                        <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem; color: var(--primary);">${titleTrans}</h1>
                        <p>${warning}</p>
                        <a href="../legal.html" style="color:var(--primary); text-decoration:underline;">Voir la version française (Original)</a>
                    </div>
                `;
            }
        }

        const outDir = lang === 'fr' ? '.' : lang;
        const rootRel = lang === 'fr' ? '.' : '..';
        
        if (lang !== 'fr') await fs.mkdir(outDir, { recursive: true });

        await fs.writeFile(path.join(outDir, fileName), getHtml({
            title: `${title} | Astro.lu`,
            description: desc
        }, contentHtml, rootRel, lang));
    }
}

async function main() {
    try {
        await generatePage('legal', 'legal.html');
        await generatePage('contact', 'contact.html');
        console.log("✅ Pages Contact (Tally) & Mentions (Texte complet) générées !");
    } catch (error) {
        console.error("❌ Erreur:", error);
    }
}

main();