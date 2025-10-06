// Particles.js इनिशियलायझेशन (Forest Dust – Green-Golden Tone)
particlesJS('particles-js', {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ['#4a7c59', '#b6d7a8', '#e9f7ef'] }, // Green-Golden Tone
        shape: { type: 'circle' },
        opacity: { value: 0.6, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.8, direction: 'bottom', random: true, out_mode: 'out' }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' } },
        modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
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

// Cinematic Fade for Title & Subtitle (GSAP)
gsap.from('.title', { duration: 1.5, y: -50, opacity: 0, ease: "power2.out" });
gsap.from('.subtitle', { duration: 1.5, y: 50, opacity: 0, ease: "power2.out", delay: 0.5 });

// Chapter List Reveal on Button Click
function scrollToChapters() {
    gsap.to('.glowing-btn', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
    gsap.fromTo('.chapter-list', 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" } // Staggered reveal
    );
    gsap.to(window, { scrollTo: "#chapters-section", duration: 1, ease: "power2.inOut" });
}

// Smooth ScrollTrigger for Chapters (GSAP)
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('.chapter-link').forEach((link, i) => {
    gsap.from(link, {
        scrollTrigger: link,
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// डबल टॅप बॅक (चॅप्टर्ससाठी)
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
            gsap.to(e.target, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }); // Quick feedback
            setTimeout(() => { window.location.href = '../index.html'; }, 200);
            clickCount = 0;
        }
    }
}, false);

// टच डबल टॅपसाठी
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
