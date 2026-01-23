// lib/locales.js
const LOCALES = {
    fr: {
        lang: 'fr',
        root: '', 
        // Ajout de l'heure dans le format
        dateFormat: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
        // SEO optimisé avec placeholder {{date}}
        meta: { 
            title: "Horoscope du {{date}} - Prévisions Gratuites & Complètes | Astro.lu", 
            desc: "Découvrez votre horoscope du {{date}}. Amour, travail, santé : vos prévisions astrologiques détaillées et gratuites pour les 12 signes du zodiaque." 
        },
        nav: { horoscope: "Horoscope", blog: "Blog & Conseils", back: "Tous les signes", read_more: "Lire l'article", back_blog: "Retour au blog" },
        hero: { title: "Horoscope du", subtitle: "Guidance Quotidienne", desc: "Les étoiles s'alignent. Découvrez vos prévisions précises pour aujourd'hui." },
        calc: { title: "Calculez votre signe", btn: "Révéler", placeholder_day: "Jour", placeholder_month: "Mois" },
        card: { link: "Lire l'horoscope", chance: "Chance", color: "Couleur" },
        sections: { general: "Atmosphère Générale", love: "Amour", work: "Travail", health: "Bien-être", advice: "Conseil du jour" },
        footer: { 
            about: "Votre guide céleste quotidien.", 
            update: "Mise à jour", 
            rights: "Guidé par les étoiles.",
            legal_title: "Mentions Légales",
            contact: "Contact"
        },
        static: {
            legal_title: "Mentions Légales",
            contact_title: "Contact",
            legal_desc: "Informations légales et conditions d'utilisation.",
            contact_desc: "Contactez l'équipe d'Astro.lu"
        },
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    },
    en: {
        lang: 'en',
        root: 'en',
        dateFormat: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
        meta: { 
            title: "Daily Horoscope for {{date}} - Free Forecasts | Astro.lu", 
            desc: "Your free daily horoscope for {{date}}. Love, career, wellness: discover what the stars have in store for you today." 
        },
        nav: { horoscope: "Horoscope", blog: "Blog & Tips", back: "All Signs", read_more: "Read Article", back_blog: "Back to Blog" },
        hero: { title: "Horoscope for", subtitle: "Daily Guidance", desc: "The stars align. Discover your precise forecast for today." },
        calc: { title: "Calculate your sign", btn: "Reveal", placeholder_day: "Day", placeholder_month: "Month" },
        card: { link: "Read Horoscope", chance: "Luck", color: "Color" },
        sections: { general: "General Atmosphere", love: "Love", work: "Career", health: "Wellness", advice: "Tip of the Day" },
        footer: { 
            about: "Your daily celestial guide.", 
            update: "Updated", 
            rights: "Guided by the stars.",
            legal_title: "Legal Notice",
            contact: "Contact"
        },
        static: {
            legal_title: "Legal Notice",
            contact_title: "Contact Us",
            legal_desc: "Legal information and terms of use.",
            contact_desc: "Contact the Astro.lu team."
        },
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    de: {
        lang: 'de',
        root: 'de',
        dateFormat: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
        meta: { 
            title: "Tageshoroskop für {{date}} - Kostenlos | Astro.lu", 
            desc: "Ihr kostenloses Tageshoroskop für {{date}}. Liebe, Beruf, Gesundheit: Entdecken Sie Ihre detaillierten Vorhersagen." 
        },
        nav: { horoscope: "Horoskop", blog: "Blog & Ratgeber", back: "Alle Sternzeichen", read_more: "Artikel lesen", back_blog: "Zurück zum Blog" },
        hero: { title: "Horoskop für", subtitle: "Tägliche Führung", desc: "Die Sterne stehen gut. Entdecken Sie Ihre genaue Vorhersage für heute." },
        calc: { title: "Sternzeichen berechnen", btn: "Enthüllen", placeholder_day: "Tag", placeholder_month: "Monat" },
        card: { link: "Horoskop lesen", chance: "Glück", color: "Farbe" },
        sections: { general: "Allgemeine Atmosphäre", love: "Liebe", work: "Beruf", health: "Gesundheit", advice: "Tipp des Tages" },
        footer: { 
            about: "Dein täglicher himmlischer Begleiter.", 
            update: "Aktualisiert", 
            rights: "Von den Sternen geleitet.",
            legal_title: "Impressum",
            contact: "Kontakt"
        },
        static: {
            legal_title: "Impressum",
            contact_title: "Kontakt",
            legal_desc: "Rechtliche Informationen und Nutzungsbedingungen.",
            contact_desc: "Kontaktieren Sie das Astro.lu-Team."
        },
        months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    }
};

const SIGNS_TRANS = {
    belier: { en: "Aries", de: "Widder" },
    taureau: { en: "Taurus", de: "Stier" },
    gemeaux: { en: "Gemini", de: "Zwillinge" },
    cancer: { en: "Cancer", de: "Krebs" },
    lion: { en: "Leo", de: "Löwe" },
    vierge: { en: "Virgo", de: "Jungfrau" },
    balance: { en: "Libra", de: "Waage" },
    scorpion: { en: "Scorpio", de: "Skorpion" },
    sagittaire: { en: "Sagittarius", de: "Schütze" },
    capricorne: { en: "Capricorn", de: "Steinbock" },
    verseau: { en: "Aquarius", de: "Wassermann" },
    poissons: { en: "Pisces", de: "Fische" }
};

module.exports = { LOCALES, SIGNS_TRANS };