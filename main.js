// Particles.js इनिशियलायझेशन (नैसर्गिक पार्टिकल्स)
particlesJS('particles-js', {
    particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#4a7c59' }, // हिरवी शेड
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

// चॅप्टर लिंक्सवर क्लिक (स्मूथ ट्रान्झिशन)
document.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.location.href = href;
    });
});

// ऑटोमॅटिक सूत्रसूची तयार करा
async function generateSutraIndex() {
    const sutraList = document.getElementById('sutra-list');
    if (!sutraList) return;

    sutraList.innerHTML = 'लोड होत आहे...';

    // सर्व चॅप्टर्सची फाइल्स (१ ते १४)
    const chapters = Array.from({length: 14}, (_, i) => `chapters/chapter${i + 1}.html`);

    // वचने collect करण्यासाठी मॅप
    const allVachans = new Map(); // पहिल्या अक्षर => {chapterNum: [text, chapterName]}

    try {
        for (const chapterPath of chapters) {
            try {
                const response = await fetch(chapterPath);
                if (!response.ok) continue;
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const vachans = doc.querySelectorAll('.vachan');
                const chapterNum = chapterPath.match(/chapter(\d+)\.html/)[1];
                const chapterName = doc.querySelector('h1.title')?.textContent || `चॅप्टर ${chapterNum}`;

                vachans.forEach(vachan => {
                    const text = vachan.textContent.trim();
                    if (text) {
                        const firstChar = text.charAt(0); // पहिले अक्षर
                        if (/[\u0900-\u097F]/.test(firstChar)) { // देवनागरी चेक
                            if (!allVachans.has(firstChar)) {
                                allVachans.set(firstChar, []);
                            }
                            allVachans.get(firstChar).push({ text, chapterNum, chapterName });
                        }
                    }
                });
            } catch (err) {
                console.warn(`Error loading ${chapterPath}:`, err);
            }
        }

        // आद्याक्षरानुसार सॉर्ट आणि HTML बिल्ड
        const sortedLetters = Array.from(allVachans.keys()).sort((a, b) => a.localeCompare(b, 'mr')); // मराठी सॉर्ट
        let html = '';

        sortedLetters.forEach(letter => {
            const group = allVachans.get(letter);
            html += `<div class="letter-group"><h3>${letter}</h3><ul>`;
            group.forEach(item => {
                const linkText = `${item.text.substring(0, 50)}...`; // शॉर्ट टेक्स्ट
                html += `<li><a href="chapters/${item.chapterNum === '1' ? 'chapter1.html' : `chapter${item.chapterNum}.html`}" class="vachan-item">${linkText} (चॅप्टर ${item.chapterNum}: ${item.chapterName})</a></li>`;
            });
            html += `</ul></div>`;
        });

        if (html === '') {
            html = '<p>कोणतेही वचन सापडले नाही.</p>';
        }

        sutraList.innerHTML = html;
    } catch (err) {
        sutraList.innerHTML = '<p>सूत्रसूची लोड करण्यात त्रुटी.</p>';
    }
}

// पेज लोड झाल्यावर कॉल करा
document.addEventListener('DOMContentLoaded', generateSutraIndex);
