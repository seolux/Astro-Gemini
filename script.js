/**
 * SCRIPT-ENHANCED.JS - Fonctionnalités interactives avancées
 */

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    initializeAnimations();
    initializeShareButtons();
});

// ========================================
// INITIALIZATION
// ========================================

function initializePage() {
    // Populate day selector
    const daySelect = document.getElementById('calc-day');
    if (daySelect) {
        for (let i = 1; i <= 31; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            daySelect.appendChild(opt);
        }
        
        // Set current day by default
        const today = new Date();
        daySelect.value = today.getDate();
        
        // Add month selector default
        const monthSelect = document.getElementById('calc-month');
        if (monthSelect) {
            monthSelect.value = today.getMonth();
        }
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// ZODIAC SIGN CALCULATOR
// ========================================

const SIGNS_DATA = [
    { id: 'belier', start: {m:2, d:21}, end: {m:3, d:19} },
    { id: 'taureau', start: {m:3, d:20}, end: {m:4, d:20} },
    { id: 'gemeaux', start: {m:4, d:21}, end: {m:5, d:20} },
    { id: 'cancer', start: {m:5, d:21}, end: {m:6, d:22} },
    { id: 'lion', start: {m:6, d:23}, end: {m:7, d:22} },
    { id: 'vierge', start: {m:7, d:23}, end: {m:8, d:22} },
    { id: 'balance', start: {m:8, d:23}, end: {m:9, d:22} },
    { id: 'scorpion', start: {m:9, d:23}, end: {m:10, d:21} },
    { id: 'sagittaire', start: {m:10, d:22}, end: {m:11, d:21} },
    { id: 'capricorne', start: {m:11, d:22}, end: {m:0, d:19} },
    { id: 'verseau', start: {m:0, d:20}, end: {m:1, d:18} },
    { id: 'poissons', start: {m:1, d:19}, end: {m:2, d:20} },
];

function findSign(day, month) {
    for (const sign of SIGNS_DATA) {
        if (sign.start.m === month && day >= sign.start.d) return sign.id;
        if (sign.end.m === month && day <= sign.end.d) return sign.id;
    }
    return 'capricorne';
}

function calculateSignRedirect() {
    const dayEl = document.getElementById('calc-day');
    const monthEl = document.getElementById('calc-month');
    
    if (!dayEl || !monthEl || !dayEl.value || !monthEl.value) {
        showNotification('Veuillez sélectionner une date', 'warning');
        return;
    }
    
    const day = parseInt(dayEl.value);
    const month = parseInt(monthEl.value);
    const signId = findSign(day, month);
    
    // Language detection via HTML attribute
    const lang = document.body.getAttribute('data-lang') || 'fr';
    
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        // Redirection relative contextuelle
        // Si on est dans /en/, window.location.href en relatif fonctionne
        // Mais plus sûr d'utiliser la structure de dossier
        if (lang === 'fr') {
            window.location.href = `horoscope-${signId}/`;
        } else {
            // Si on est à la racine de la langue (/en/)
            if (window.location.pathname.endsWith('/')) {
                window.location.href = `horoscope-${signId}/`;
            } else {
                // Si on est ailleurs, on reconstruit le chemin
                window.location.href = `/${lang}/horoscope-${signId}/`;
            }
        }
    }, 300);
}

// ========================================
// ANIMATIONS & VISUAL EFFECTS
// ========================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    document.querySelectorAll('.sign-card, .blog-card, .guide-card, .domain-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add parallax effect to video background
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const video = document.getElementById('bg-video');
                if (video) {
                    const scrolled = window.pageYOffset;
                    video.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add hover effect to sign cards with tilt
    document.querySelectorAll('.sign-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
    });
}

// ========================================
// SHARE FUNCTIONALITY
// ========================================

function initializeShareButtons() {
    // Initialize share buttons if they exist
    const shareButtons = document.querySelectorAll('.share-btn');
    if (shareButtons.length > 0) {
        console.log('Share buttons initialized');
    }
}

function shareHoroscope(platform) {
    const url = window.location.href;
    const title = document.querySelector('.horoscope-title')?.textContent || 'Mon Horoscope';
    const text = `Découvrez l'horoscope ${title} sur Astro.lu`;
    
    shareContent(platform, url, title, text);
}

function shareArticle(platform) {
    const url = window.location.href;
    const title = document.querySelector('.article-header h1')?.textContent || 'Article Astrologique';
    const text = document.querySelector('.article-excerpt')?.textContent || 'Découvrez cet article sur Astro.lu';
    
    shareContent(platform, url, title, text);
}

function shareContent(platform, url, title, text) {
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, 'share', 'width=600,height=400,scrollbars=yes');
}

function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Lien copié !', 'success');
        }).catch(() => {
            fallbackCopyLink(url);
        });
    } else {
        fallbackCopyLink(url);
    }
}

function fallbackCopyLink(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Lien copié !', 'success');
    } catch (err) {
        showNotification('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const styles = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        backdrop-filter: blur(10px);
    `;
    
    notification.setAttribute('style', styles);
    document.body.appendChild(notification);
    
    // Add animation keyframe
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// FAVORITE SYSTEM (Local Storage)
// ========================================

function toggleFavorite(signId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(signId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Retiré des favoris', 'info');
    } else {
        favorites.push(signId);
        showNotification('Ajouté aux favoris ⭐', 'success');
    }
    
    localStorage.setItem('astro_favorites', JSON.stringify(favorites));
    updateFavoriteUI(signId);
}

function getFavorites() {
    const stored = localStorage.getItem('astro_favorites');
    return stored ? JSON.parse(stored) : [];
}

function updateFavoriteUI(signId) {
    const button = document.querySelector(`[data-sign="${signId}"] .favorite-btn`);
    if (button) {
        const favorites = getFavorites();
        const isFavorite = favorites.includes(signId);
        button.innerHTML = isFavorite ? '⭐' : '☆';
        button.classList.toggle('is-favorite', isFavorite);
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.sign-card, .blog-card, .guide-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(query);
            
            card.style.display = matches || query === '' ? '' : 'none';
            
            if (matches && query !== '') {
                card.style.animation = 'pulse 0.5s ease';
            }
        });
    });
}

// ========================================
// THEME TOGGLE (Bonus Feature)
// ========================================

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('astro_theme', newTheme);
    
    showNotification(`Thème ${newTheme === 'light' ? 'clair' : 'sombre'} activé`, 'info');
}

function loadTheme() {
    const saved = localStorage.getItem('astro_theme');
    if (saved) {
        document.body.setAttribute('data-theme', saved);
    }
}

// ========================================
// READING PROGRESS BAR
// ========================================

function initReadingProgress() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// ========================================
// LOAD MORE FUNCTIONALITY
// ========================================

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.blog-card.hidden');
        const itemsToShow = 3;
        
        for (let i = 0; i < Math.min(itemsToShow, hiddenCards.length); i++) {
            hiddenCards[i].classList.remove('hidden');
            hiddenCards[i].style.animation = 'fadeInUp 0.6s ease';
        }
        
        if (hiddenCards.length <= itemsToShow) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// ========================================
// EASTER EGG - Konami Code
// ========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Create starfield effect
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            animation: twinkle ${1 + Math.random() * 2}s ease-in-out infinite;
            z-index: -1;
        `;
        document.body.appendChild(star);
        
        setTimeout(() => star.remove(), 5000);
    }
    
    showNotification('🌟 Les étoiles vous sourient ! 🌟', 'success');
}

// Initialize additional features on load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initSearch();
    initReadingProgress();
    initLoadMore();
});

// Export functions for global use
window.calculateSignRedirect = calculateSignRedirect;
window.shareHoroscope = shareHoroscope;
window.shareArticle = shareArticle;
window.copyLink = copyLink;
window.toggleFavorite = toggleFavorite;
window.toggleTheme = toggleTheme;