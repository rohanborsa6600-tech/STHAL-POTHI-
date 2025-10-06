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

// चॅप्टर लिंक्सवर क्लिक (जैसे थे)
document.querySelectorAll('.chapter-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.location.href = href;
    });
});

// प्रत्येक चॅप्टरसाठी वचने लोड करा (Promise return करण्यासाठी सुधारित)
async function loadVachanPreview(chapterNum) {
    const preview = document.getElementById(`preview-${chapterNum}`);
    if (!preview) return Promise.resolve(); 

    try {
        const response = await fetch(`chapters/chapter${chapterNum}.html`);
        if (!response.ok) {
            preview.innerHTML = '<p style="color: #d4e4d4;">वचने सापडली नाहीत.</p>';
            return Promise.resolve();
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

        // फिक्स: setTimeout ने force show
        setTimeout(() => {
            if (vachanHtml === '') {
                preview.innerHTML = '<p style="color: #d4e4d4;">या चॅप्टरमध्ये वचने नाहीत.</p>';
            } else {
                preview.innerHTML = vachanHtml;
            }
        }, 100);

        return Promise.resolve(); // यश मिळाल्यावर Promise परत करा
    } catch (err) {
        preview.innerHTML = '<p style="color: #d4e4d4;">त्रुटी: वचने लोड होऊ शकली नाहीत.</p>';
        return Promise.resolve(); // त्रुटी असूनही Promise परत करा
    }
}

// एक्सपँड/कोलॅप्स सेटअप (लोडिंग टेक्स्टसाठी सुधारित)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterNum = btn.dataset.chapter;
            const preview = document.getElementById(`preview-${chapterNum}`);
            const isExpanded = preview.classList.contains('expanded');
            
            // 1. क्लास टॉगल करा
            preview.classList.toggle('expanded');
            
            // 2. बटणाचा मजकूर त्वरित अपडेट करा
            if (isExpanded) {
                // जर ते बंद होत असेल
                btn.textContent = '▼ वचने पहा';
            } else {
                // जर ते उघडत असेल
                if (preview.innerHTML.includes('लोड होत आहे')) {
                    // लोडिंग स्थिती दर्शवा
                    btn.textContent = '...वचने लोड होत आहेत...';
                    // वचने लोड करा आणि बटण अपडेट करा
                    loadVachanPreview(chapterNum).then(() => {
                        btn.textContent = '▲ वचने लपवा';
                    });
                } else {
                    // लोड केलेले असल्यास, फक्त टॉगल मजकूर
                    btn.textContent = '▲ वचने लपवा';
                }
            }
        });
    });
});
