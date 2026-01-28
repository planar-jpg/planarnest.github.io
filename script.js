document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Tracking Spotlight Effect for Bento Cards
    const cards = document.querySelectorAll('.bento-card');

    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Hero Visual Parallax Tilt
    const heroVisual = document.querySelector('.hero-visual');
    const appWindow = document.querySelector('.app-window');

    if (heroVisual && appWindow) {
        document.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10deg
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

            // Subtle tilt
            appWindow.style.transform = `
                perspective(1000px)
                rotateY(${xPos * 0.5}deg)
                rotateX(${-yPos * 0.5 + 2}deg) /* +2 for initial tilt */
                translateY(0)
            `;
        });
    }

    // 3. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
