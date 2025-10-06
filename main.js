// Particles.js इनिशियलायझेशन (ट्रॅडिशनल – सॉफ्ट पान कण)
particlesJS('particles-js', {
    particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: '#d4e4d4' }, // लाइट शेड्स
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.5, direction: 'bottom', random: true }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' } },
        modes: { repulse: { distance: 80, duration: 0.4 } }
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
    if (window.location.pathname.includes('chapter')) { // फक्त चॅप्टर्समध्ये
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            window.location.href = '../index.html'; // बॅक टू इंडेक्स
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

// सेटिंग्स हँडलर (localStorage ने सेव्ह – इंडेक्स आणि चॅप्टर्स दोन्ही पेजवर लागू)
function applySettings() {
    const savedSize = localStorage.getItem('fontSize') || 'medium';
    const savedColor = localStorage.getItem('fontColor') || 'dark';
    const savedTheme = localStorage.getItem('theme') || 'day';

    document.body.className = `font-size-${savedSize} font-color-${savedColor} ${savedTheme === 'night' ? 'night' : ''}`;
    if (document.getElementById('font-size-select')) document.getElementById('font-size-select').value = savedSize;
    if (document.getElementById('font-color-select')) document.getElementById('font-color-select').value = savedColor;
    if (document.getElementById('theme-toggle')) document.getElementById('theme-toggle').textContent = savedTheme === 'night' ? '☀️ डे' : '🌙 नाइट';
}

document.addEventListener('DOMContentLoaded', () => {
    applySettings();

    // सेटिंग्स टॉगल (फक्त जेथे पॅनल असेल – इंडेक्समध्ये)
    const settingsToggle = document.getElementById('settings-toggle');
    if (settingsToggle) {
        const settingsContent = document.getElementById('settings-content');
        const settingsClose = document.getElementById('settings-close');
        const fontSizeSelect = document.getElementById('font-size-select');
        const fontColorSelect = document.getElementById('font-color-select');
        const themeToggle = document.getElementById('theme-toggle');

        settingsToggle.addEventListener('click', () => {
            settingsContent.style.display = settingsContent.style.display === 'block' ? 'none' : 'block';
        });

        settingsClose.addEventListener('click', () => {
            localStorage.setItem('fontSize', fontSizeSelect.value);
            localStorage.setItem('fontColor', fontColorSelect.value);
            localStorage.setItem('theme', document.body.classList.contains('night') ? 'night' : 'day');
            applySettings();
            settingsContent.style.display = 'none';
        });

        fontSizeSelect.addEventListener('change', () => {
            document.body.className = document.body.className.replace(/font-size-\w+/, `font-size-${fontSizeSelect.value}`);
        });

        fontColorSelect.addEventListener('change', () => {
            document.body.className = document.body.className.replace(/font-color-\w+/, `font-color-${fontColorSelect.value}`);
        });

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('night');
            themeToggle.textContent = document.body.classList.contains('night') ? '☀️ डे' : '🌙 नाइट';
        });
    }
});
