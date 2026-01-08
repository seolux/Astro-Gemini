/**
 * Configuration des Signes
 */
const SIGNS = [
    { id: 'belier', name: 'Bélier', date: '21 Mars - 19 Avril', symbol: '♈' },
    { id: 'taureau', name: 'Taureau', date: '20 Avril - 20 Mai', symbol: '♉' },
    { id: 'gemeaux', name: 'Gémeaux', date: '21 Mai - 20 Juin', symbol: '♊' },
    { id: 'cancer', name: 'Cancer', date: '21 Juin - 22 Juillet', symbol: '♋' },
    { id: 'lion', name: 'Lion', date: '23 Juillet - 22 Août', symbol: '♌' },
    { id: 'vierge', name: 'Vierge', date: '23 Août - 22 Septembre', symbol: '♍' },
    { id: 'balance', name: 'Balance', date: '23 Septembre - 22 Octobre', symbol: '♎' },
    { id: 'scorpion', name: 'Scorpion', date: '23 Octobre - 21 Novembre', symbol: '♏' },
    { id: 'sagittaire', name: 'Sagittaire', date: '22 Novembre - 21 Décembre', symbol: '♐' },
    { id: 'capricorne', name: 'Capricorne', date: '22 Décembre - 19 Janvier', symbol: '♑' },
    { id: 'verseau', name: 'Verseau', date: '20 Janvier - 18 Février', symbol: '♒' },
    { id: 'poissons', name: 'Poissons', date: '19 Février - 20 Mars', symbol: '♓' },
];

const App = {
    init: () => {
        // Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateEl = document.getElementById('current-date');
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString('fr-FR', options);
        
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        // Générer grille
        App.renderGrid();
        
        // Router simple
        const urlParams = new URLSearchParams(window.location.search);
        const signParam = urlParams.get('sign');
        
        if (signParam) {
            const foundSign = SIGNS.find(s => s.id === signParam);
            if (foundSign) {
                App.loadSign(signParam);
            } else {
                console.warn("Signe inconnu dans l'URL:", signParam);
            }
        }
    },

    renderGrid: () => {
        const grid = document.getElementById('zodiac-grid');
        if (!grid) return;
        
        grid.innerHTML = SIGNS.map(sign => `
            <article class="sign-card" onclick="app.loadSign('${sign.id}')">
                <span class="sign-symbol">${sign.symbol}</span>
                <h3 class="sign-name">${sign.name}</h3>
                <p class="sign-date">${sign.date}</p>
            </article>
        `).join('');
    },

    showHome: () => {
        document.getElementById('view-home').classList.add('active');
        
        // Gestion propre de la vue détail : on retire active et on remet hidden
        const viewSign = document.getElementById('view-sign');
        viewSign.classList.remove('active');
        viewSign.classList.add('hidden');
        
        window.history.pushState({}, '', window.location.pathname);
    },

    loadSign: async (signId) => {
        const signData = SIGNS.find(s => s.id === signId);
        if (!signData) return;

        // Bascule de vue
        document.getElementById('view-home').classList.remove('active');
        
        // Gestion propre de la vue détail : on retire hidden et on met active
        const viewSign = document.getElementById('view-sign');
        viewSign.classList.remove('hidden'); // C'était la ligne manquante !
        viewSign.classList.add('active');
        
        const contentDiv = document.getElementById('horoscope-content');
        
        // Loader
        contentDiv.innerHTML = `
            <div class="loading">
                <div style="margin-bottom: 1rem; font-size: 2rem;">🔮</div>
                Lecture du fichier data/${signId}.json ...
            </div>`;

        try {
            // 1. TENTATIVE DE CHARGEMENT
            const filePath = `./data/${signId}.json?t=${Date.now()}`;
            console.log("Tentative de fetch sur :", filePath);

            const response = await fetch(filePath);
            
            // 2. VERIFICATION HTTP
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} (${response.statusText}) - Fichier non trouvé ?`);
            }
            
            // 3. RECUPERATION DU TEXTE BRUT (pour debug)
            const textData = await response.text();
            console.log("Contenu reçu :", textData); // Regarder la console F12 si besoin

            if (!textData || textData.trim() === "") {
                throw new Error("Le fichier JSON est vide.");
            }

            // 4. PARSING JSON
            let data;
            try {
                data = JSON.parse(textData);
            } catch (e) {
                // Si le JSON est mal formé, on l'affiche pour comprendre
                throw new Error(`Erreur de syntaxe JSON. Le fichier contient peut-être du texte en trop.\nDébut du fichier : ${textData.substring(0, 100)}...`);
            }

            // 5. RENDU
            App.renderHoroscope(signData, data);
            
            // MAJ URL
            const newUrl = `?sign=${signId}`;
            window.history.pushState({ path: newUrl }, '', newUrl);

        } catch (error) {
            // AFFICHAGE DE L'ERREUR DANS LA PAGE (ZONE ROUGE)
            console.error("Erreur fatale:", error);
            contentDiv.innerHTML = `
                <div style="background: #451a1a; border: 1px solid #f87171; padding: 2rem; border-radius: 8px; color: #fca5a5; font-family: monospace;">
                    <h3 style="color: #fff; margin-bottom: 1rem;">⚠️ Oups, une erreur est survenue</h3>
                    <p style="margin-bottom: 1rem;"><strong>Message :</strong> ${error.message}</p>
                    <p>Vérifiez que le fichier <code>data/${signId}.json</code> existe bien à côté de index.html.</p>
                    <button class="btn-back" style="margin-top: 20px; background: #fff; color: #000; padding: 5px 10px; border-radius: 4px;" onclick="app.showHome()">Retour Accueil</button>
                </div>
            `;
        }
    },

    renderHoroscope: (staticData, apiData) => {
        const container = document.getElementById('horoscope-content');
        
        // Sécurisation des données (fallback si une clé manque)
        const safeData = {
            general: apiData.general || "Prévisions indisponibles.",
            love: apiData.love || "Pas de données.",
            work: apiData.work || "Pas de données.",
            health: apiData.health || "Pas de données.",
            advice: apiData.advice || "Soyez prudent.",
            lucky_number: apiData.lucky_number || apiData.luckyNumber || "?", // Gestion des deux cas (snake_case ou camelCase)
            color: apiData.color || "Inconnue",
            date: apiData.date || "Aujourd'hui"
        };

        container.innerHTML = `
            <div class="horoscope-header">
                <div class="sign-symbol" style="font-size: 4rem">${staticData.symbol}</div>
                <h2 class="horoscope-title">${staticData.name}</h2>
                <p class="date-display">${safeData.date}</p>
            </div>

            <div class="main-text">
                <p>${safeData.general}</p>
            </div>

            <div class="domains-grid">
                <div class="domain-card">
                    <h3>❤️ Amour</h3>
                    <p>${safeData.love}</p>
                </div>
                <div class="domain-card">
                    <h3>💼 Travail</h3>
                    <p>${safeData.work}</p>
                </div>
                <div class="domain-card">
                    <h3>⚕️ Santé</h3>
                    <p>${safeData.health}</p>
                </div>
            </div>

            <div class="meta-box">
                <div class="meta-item">
                    <span class="meta-label">Conseil</span>
                    <span class="meta-value" style="font-size: 1rem; font-style: italic">"${safeData.advice}"</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Chiffre</span>
                    <span class="meta-value" style="color: var(--primary)">${safeData.lucky_number}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Couleur</span>
                    <span class="meta-value">${safeData.color}</span>
                </div>
            </div>
        `;
        
        // Réinit des icônes si Lucide est chargé
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
};

window.app = App;
document.addEventListener('DOMContentLoaded', App.init);