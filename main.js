// ---------- Particles.js Global Initialization ----------
particlesJS('particles-js', {
    particles: {
        number:{ value:70, density:{ enable:true, value_area:900 } },
        color:{ value:['#ffd700','#ffffff'] },
        shape:{ type:'circle' },
        opacity:{ value:0.5, random:true },
        size:{ value:3, random:true },
        move:{ enable:true, speed:1.5, direction:'none', out_mode:'out' }
    },
    interactivity:{ events:{ onhover:{ enable:true, mode:'repulse' } } },
    retina_detect:true
});

// ---------- GSAP Scroll Reveal for Lapika/Vachan/Tika ----------
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.lapika, .vachan, .tika');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
});
