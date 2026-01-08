/**
 * Frontend Script
 */
document.addEventListener('DOMContentLoaded', () => {
    const daySelect = document.getElementById('calc-day');
    if (daySelect) {
        for (let i = 1; i <= 31; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            daySelect.appendChild(opt);
        }
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

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
    const day = parseInt(document.getElementById('calc-day').value);
    const month = parseInt(document.getElementById('calc-month').value);
    const signId = findSign(day, month);
    
    // Modification ICI : redirection vers le dossier
    window.location.href = `horoscope-${signId}/`;
}