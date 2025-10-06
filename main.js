// Particles.js इनिशियलायझेशन (सिनेमॅटिक – अधिक पार्टिकल्स)
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#4a7c59', '#2c5530', '#1a3c1a'] }, // मल्टिपल हिरवी शेड्स
        shape: { type: 'polygon', polygon: { nb_sides: 5 } }, // पानांसारखे शेप
        opacity: { value: 0.6, random: true },
        size: { value: 4, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.8, direction: 'bottom', random: true, out_mode: 'out' }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' } },
        modes: { repulse: { distance: 120, duration: 0.4 } }
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

// प्रत्येक चॅप्टरसाठी वचने लोड करा
async function loadVachanPreview(chapterNum) {
    const preview = document.getElementById(`preview-${chapterNum}`);
    if (!preview) return;

    preview.innerHTML = '<p style="color: #d4e4d4;">लोड होत आहे...</p>';

    try {
        const response = await fetch(`chapters/chapter${chapterNum}.html`);
        if (!response.ok) {
            preview.innerHTML = '<p style="color: #d4e4d4;">वचने सापडली नाहीत.</p>';
            return;
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const vachans = doc.querySelectorAll('.vachan');

        let vachanHtml = '';
        vachans.forEach((vachan, index) => {
            const text = vachan.textContent.trim();
            if (text) {
                const vachanNumMatch = text.match(/वचन (\d+):?\s*(.*)/);
                const num = vachanNumMatch ? vachanNumMatch[1] : (index + 1);
                const cleanText = vachanNumMatch ? vachanNumMatch[2].trim() : text;
                vachanHtml += `<div class="vachan-item">वचन ${num}: ${cleanText}</div>`;
            }
        });

        if (vachanHtml === '') {
            preview.innerHTML = '<p style="color: #d4e4d4;">या चॅप्टरमध्ये वचने नाहीत.</p>';
        } else {
            // फिक्स: setTimeout ने force show (transition पूर्ण होण्यासाठी)
            setTimeout(() => {
                preview.innerHTML = vachanHtml;
            }, 100);
        }
    } catch (err) {
        preview.innerHTML = '<p style="color: #d4e4d4;">त्रुटी: वचने लोड होऊ शकली नाहीत.</p>';
    }
}

// एक्सपँड/कोलॅप्स सेटअप
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterNum = btn.dataset.chapter;
            const preview = document.getElementById(`preview-${chapterNum}`);
            preview.classList.toggle('expanded');
            btn.textContent = preview.classList.contains('expanded') ? '▲ वचने लपवा' : '▼ वचने पहा';
            if (preview.classList.contains('expanded') && preview.innerHTML.includes('लोड होत आहे')) {
                loadVachanPreview(chapterNum);
            }
        });
    });
});
