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

// चॅप्टर लिंक्सवर क्लिक
document.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.location.href = href;
    });
});

// वचन लिंक्ससाठी (डायनॅमिक)
function setupVachanLinks() {
    document.querySelectorAll('.vachan-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.href = href;
        });
    });
}

// एक्सपँड/कोलॅप्स टॉगल
function setupSutraToggle() {
    const toggleBtn = document.getElementById('toggle-sutra');
    const sutraContent = document.querySelector('.sutra-content');
    if (!toggleBtn || !sutraContent) return;

    toggleBtn.addEventListener('click', () => {
        sutraContent.classList.toggle('collapsed');
        toggleBtn.textContent = sutraContent.classList.contains('collapsed') ? '▶' : '▼';
    });
}

// ऑटोमॅटिक सूत्रसूची तयार करा
async function generateSutraIndex() {
    const sutraList = document.getElementById('sutra-list');
    if (!sutraList) return;

    sutraList.innerHTML = 'लोड होत आहे...';

    const chapters = Array.from({length: 14}, (_, i) => `chapters/chapter${i + 1}.html`);
    const allVachans = new Map();

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

                vachans.forEach((vachan, index) => {
                    const text = vachan.textContent.trim();
                    if (text) {
                        // वचन नंबर काढा (regex ने "वचन १:" सारखे)
                        const vachanNumMatch = text.match(/वचन (\d+):?\s*(.*)/);
                        const vachanNum = vachanNumMatch ? vachanNumMatch[1] : (index + 1).toString(); // जर नसले तर index ने
                        const cleanText = vachanNumMatch ? vachanNumMatch[2].trim() : text;
                        const firstChar = cleanText.charAt(0);
                        if (/[\u0900-\u097F]/.test(firstChar)) {
                            if (!allVachans.has(firstChar)) {
                                allVachans.set(firstChar, []);
                            }
                            allVachans.get(firstChar).push({ text: cleanText, num: vachanNum, chapterNum, chapterName });
                        }
                    }
                });
            } catch (err) {
                console.warn(`Error loading ${chapterPath}:`, err);
            }
        }

        const sortedLetters = Array.from(allVachans.keys()).sort((a, b) => a.localeCompare(b, 'mr'));
        let html = '';

        sortedLetters.forEach(letter => {
            const group = allVachans.get(letter);
            html += `<div class="letter-group"><h3>${letter}</h3><ul>`;
            group.forEach(item => {
                const linkText = `वचन ${item.num}: ${item.text.substring(0, 40)}...`;
                html += `<li><a href="chapters/chapter${item.chapterNum}.html" class="vachan-item">${linkText} (${item.chapterName})</a></li>`;
            });
            html += `</ul></div>`;
        });

        if (html === '') {
            html = '<p>कोणतेही वचन सापडले नाही.</p>';
        }

        sutraList.innerHTML = html;
        setupVachanLinks(); // लिंक्स सेटअप
    } catch (err) {
        sutraList.innerHTML = '<p>सूत्रसूची लोड करण्यात त्रुटी.</p>';
    }
}

// पेज लोड झाल्यावर (sutra.html वर कॉल होईल)
if (document.getElementById('sutra-list')) {
    document.addEventListener('DOMContentLoaded', () => {
        generateSutraIndex();
        setupSutraToggle();
    });
}
