// Particles.js इनिशियलायझेशन (Vibrant – अधिक कण)
particlesJS('particles-js', {
    particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: ['#4a7c59', '#6b8e23', '#2c5530'] }, // Vibrant मल्टिपल कलर्स
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1, direction: 'bottom', random: true }
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
        window.location.href = href;
    });
});

// डबल टॅप/क्लिक बॅक (चॅप्टर्ससाठी)
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
            window.location.href = '../index.html';
            clickCount = 0;
        }
    }
}, false);

// टच डबल टॅपसाठी (मोबाइल)
document.addEventListener('touchend', (e) => {
    if (window.location.pathname.includes('chapter')) {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            window.location.href = '../index.html';
            clickCount = 0;
        }
    }
}, false);

// डायरेक्ट टॉगल बटण्स (मजेदार – active हायलाइट)
function applySettings() {
    const savedSize = localStorage.getItem('fontSize') || 'medium';
    const savedTheme = localStorage.getItem('theme') || 'day';

    document.body.className = `font-size-${savedSize} ${savedTheme === 'night' ? 'night' : ''}`;
    document.querySelector(`#font-${savedSize}`)?.classList.add('active');
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.textContent = savedTheme === 'night' ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
    applySettings();

    // फॉन्ट साइज टॉगल
    ['small', 'medium', 'large'].forEach(size => {
        const btn = document.getElementById(`font-${size}`);
        if (btn) {
            btn.addEventListener('click', () => {
                document.body.className = document.body.className.replace(/font-size-\w+/, `font-size-${size}`);
                localStorage.setItem('fontSize', size);
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        }
    });

    // डे/नाइट टॉगल
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('night');
            const isNight = document.body.classList.contains('night');
            themeToggle.textContent = isNight ? '☀️' : '🌙';
            localStorage.setItem('theme', isNight ? 'night' : 'day');
        });
    }
});
