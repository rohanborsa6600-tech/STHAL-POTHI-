// Particles.js (Feature 1: Dynamic Interaction – Mouse/Scroll React + Aura on Hover)
particlesJS('particles-js', {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ['#4a7c59', '#b6d7a8', '#e9f7ef'] }, // Green-Golden Forest Dust
        shape: { type: 'circle' },
        opacity: { value: 0.6, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.8, direction: 'bottom', random: true, out_mode: 'out' }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { 
            onhover: { enable: true, mode: 'repulse' }, // Mouse react
            onwindowresize: { enable: true }
        },
        modes: { 
            repulse: { distance: 100, duration: 0.4 } 
        }
    },
    retina_detect: true
});

// Parallax Scroll (Feature 3: Background Slow, Cards Fast)
gsap.registerPlugin(ScrollTrigger);
gsap.to('.animated-gradient-overlay', {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// Card Entry Animation (Feature 4: Sequential Slide-In)
gsap.from('.chapter-link', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});

// Hover Scale + Glow (Feature 4)
document.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, { scale: 1.02, duration: 0.3, ease: "power2.out" });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
});

// Subtle Sound (Feature 5: Hover Chime – Free CDN Sound)
const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'); // Soft chime (optional, replace if needed)
audio.volume = 0.3;
document.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        audio.play().catch(() => {}); // Silent fail if no audio
    });
});

// Chapter Number Highlight (Feature 7: Golden Glow on Hover)
document.querySelectorAll('.chapter-number').forEach(num => {
    num.addEventListener('mouseenter', () => {
        gsap.to(num, { color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)', duration: 0.3 });
    });
    num.addEventListener('mouseleave', () => {
        gsap.to(num, { color: '#b6d7a8', textShadow: 'none', duration: 0.3 });
    });
});

// चॅप्टर लिंक्सवर क्लिक
document.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        gsap.to(link, { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }); // Quick bounce
        setTimeout(() => { window.location.href = href; }, 200);
    });
});

// डबल टॅप बॅक (चॅप्टर्ससाठी – untouched)
let clickCount = 0;
let clickTimer = null;
document.addEventListener('click', (e) => {
    if (window.location.pathname.includes('chapter')) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            gsap.to(e.target, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
            setTimeout(() => { window.location.href = '../index.html'; }, 200);
            clickCount = 0;
        }
    }
}, false);

document.addEventListener('touchend', (e) => {
    if (window.location.pathname.includes('chapter')) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            setTimeout(() => { window.location.href = '../index.html'; }, 200);
            clickCount = 0;
        }
    }
}, false);
