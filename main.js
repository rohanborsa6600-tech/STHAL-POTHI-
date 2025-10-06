// Particles.js इनिशियलायझेशन (जैसे थे)
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#4a7c59', '#2c5530', '#1a3c1a'] }, 
        shape: { type: 'polygon', polygon: { nb_sides: 5 } }, 
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


// प्रत्येक चॅप्टरसाठी वचने लोड करा (Promise return करण्यासाठी सुधारित)
async function loadVachanPreview(chapterNum) {
    const preview = document.getElementById(`preview-${chapterNum}`);
    if (!preview) return Promise.resolve(); 

    try {
        // (तुमच्या chapter*.html फाईल्सचा path 'chapters/chapterX.html' आहे असे गृहीत धरले आहे)
        const response = await fetch(`chapters/chapter${chapterNum}.html`);
        if (!response.ok) {
            preview.innerHTML = '<p style="color: #d4e4d4;">वचने सापडली नाहीत.</p>';
            return Promise.resolve();
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // .vachan क्लास असलेले सर्व घटक काढतोय
        const vachans = doc.querySelectorAll('.vachan'); 

        let vachanHtml = '';
        vachans.forEach((vachan, index) => {
            const text = vachan.textContent.trim();
            if (text) {
                // (वचन 1: किंवा वचन 1 हे स्वरूप गृहीत धरून)
                const vachanNumMatch = text.match(/वचन (\d+):?\s*(.*)/);
                const num = vachanNumMatch ? vachanNumMatch[1] : (index + 1);
                const cleanText = vachanNumMatch ? vachanNumMatch[2].trim() : text;
                // इथे .vachan-item वापरला आहे जो style.css मध्ये स्टाईल केलेला आहे
                vachanHtml += `<div class="vachan-item">वचन ${num}: ${cleanText}</div>`;
            }
        });

        setTimeout(() => {
            if (vachanHtml === '') {
                preview.innerHTML = '<p style="color: #d4e4d4;">या चॅप्टरमध्ये वचने नाहीत.</p>';
            } else {
                preview.innerHTML = vachanHtml;
            }
        }, 100);

        return Promise.resolve(); 
    } catch (err) {
        preview.innerHTML = '<p style="color: #d4e4d4;">त्रुटी: वचने लोड होऊ शकली नाहीत.</p>';
        return Promise.resolve(); 
    }
}

// एक्सपँड/कोलॅप्स सेटअप (लोडिंग टेक्स्ट आणि बटण मजकूर सुधारित)
document.addEventListener('DOMContentLoaded', () => {
    
    // 'वचने पहा' बटण हँडलर
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterNum = btn.dataset.chapter;
            const preview = document.getElementById(`preview-${chapterNum}`);
            const isExpanded = preview.classList.contains('expanded');
            
            preview.classList.toggle('expanded');
            
            if (isExpanded) {
                // बंद होत असताना
                btn.textContent = '▼ वचने पहा';
            } else {
                // उघडत असताना
                // 'लोड होत आहे...' हा तुमचा placeholder text आहे हे गृहीत धरून
                if (preview.innerHTML.includes('लोड होत आहे')) { 
                    btn.textContent = '...लोड होत आहे...';
                    
                    loadVachanPreview(chapterNum).then(() => {
                        btn.textContent = '▲ वचने लपवा';
                    });
                } else {
                    // कंटेंट आधीच लोड झालेला असल्यास
                    btn.textContent = '▲ वचने लपवा';
                }
            }
        });
    });

    // --- डबल टॅप/क्लिक हँडलर (मागे जाण्यासाठी) ---
    // chapter*.html आणि sutra.html (जिथे .container आहे) या दोन्ही पेजेससाठी
    const container = document.querySelector('.container');
    if (container) {
        let lastTap = 0;
        const DOUBLE_TAP_DELAY = 400; // 400ms आत दुसरा टॅप/क्लिक
        
        container.addEventListener('click', (e) => {
            const now = Date.now();
            const timeSinceLastTap = now - lastTap;

            // एक्सपँड बटणावर किंवा लिंकवर डबल टॅप होऊ नये म्हणून चेक करा
            if (e.target.closest('.expand-btn') || e.target.closest('.chapter-link') || e.target.closest('a') || e.target.closest('button')) {
                 lastTap = now; // बटणावर क्लिक झाल्यावर टाइम रीसेट करा, डबल-टॅप होऊ नये
                 return;
            }

            // डबल टॅप/क्लिक चेक
            if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
                // मागील पेजवर जा
                window.history.back();
                lastTap = 0; // डबल टॅप पूर्ण झाल्यावर रीसेट करा
            } else {
                lastTap = now; // पहिला टॅप/क्लिक नोंदवा
            }
        });
    }

    // sutra.html किंवा chapter*.html वरील 'मागे जा' बटण लपवा
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.style.display = 'none';
    }
});
