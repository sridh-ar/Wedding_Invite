document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNavigation();
    initCountdown();
    initCarousel();
    createPetals();
    initOrbParallax();
});

// Prevent pinch-to-zoom only, allow normal scroll
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: true });
window.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

// ── BIDIRECTIONAL SCROLL REVEAL ──
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-gallery, .reveal-rotate');
    let lastScrollY = window.scrollY;

    const observer = new IntersectionObserver((entries) => {
        const scrollingDown = window.scrollY >= lastScrollY;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.remove('reveal-exit-down', 'reveal-exit-up');
            } else {
                entry.target.classList.add(scrollingDown ? 'reveal-exit-up' : 'reveal-exit-down');
                entry.target.classList.remove('revealed');
            }
        });
    }, { threshold: 0.12 });

    window.addEventListener('scroll', () => { lastScrollY = window.scrollY; }, { passive: true });
    els.forEach(el => observer.observe(el));
}

// ── NAVIGATION ──
function initNavigation() {
    const dots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                dots.forEach(d => d.classList.toggle('active', d.dataset.section === id));
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(dot.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ── RING COUNTDOWN ──
function initCountdown() {
    const weddingDate = (typeof WEDDING_DATE !== 'undefined' ? WEDDING_DATE : new Date('August 30, 2026 07:30:00').getTime());
    const circumference = 2 * Math.PI * 45;

    function update() {
        const distance = weddingDate - Date.now();
        if (distance < 0) return;
        const days    = Math.floor(distance / 86400000);
        const hours   = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('days',    days);
        set('hours',   String(hours).padStart(2, '0'));
        set('minutes', String(minutes).padStart(2, '0'));
        set('seconds', String(seconds).padStart(2, '0'));

        const rings = {
            '.days-ring':    (days % 365) / 365,
            '.hours-ring':   hours / 24,
            '.minutes-ring': minutes / 60,
            '.seconds-ring': seconds / 60,
        };
        Object.entries(rings).forEach(([sel, progress]) => {
            const el = document.querySelector(sel);
            if (el) el.style.strokeDashoffset = circumference * (1 - progress);
        });
    }

    update();
    setInterval(update, 1000);
}

// ── PETALS ──
function createPetals() {
    const container = document.getElementById('petals');
    if (!container) return;
    const count = window.innerWidth < 768 ? 8 : 22;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left              = Math.random() * 100 + 'vw';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay    = (Math.random() * 10) + 's';
        p.style.transform         = 'rotate(' + (Math.random() * 360) + 'deg)';
        container.appendChild(p);
    }
}

// ── CAROUSEL ──
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots  = document.querySelectorAll('.cdot');
    if (!track) return;
    const total = track.children.length;
    let current = 0, startX = 0, dragging = false;

    function goTo(n) {
        current = (n + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    document.getElementById('carouselPrev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('carouselNext')?.addEventListener('click', () => goTo(current + 1));

    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    track.addEventListener('touchend',   e => {
        if (!dragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        dragging = false;
    });
}

// ── ORB PARALLAX ──
function initOrbParallax() {
    const orbs = document.querySelectorAll('.orb');
    let mouseX = 0, mouseY = 0;
    const currentX = Array(orbs.length).fill(0);
    const currentY = Array(orbs.length).fill(0);
    const strengths = [30, 22, 18, 26];

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateOrbs() {
        orbs.forEach((orb, i) => {
            currentX[i] += (mouseX * strengths[i] - currentX[i]) * 0.05;
            currentY[i] += (mouseY * strengths[i] - currentY[i]) * 0.05;
            orb.style.marginLeft = currentX[i] + 'px';
            orb.style.marginTop  = currentY[i] + 'px';
        });
        requestAnimationFrame(animateOrbs);
    }
    animateOrbs();
}
