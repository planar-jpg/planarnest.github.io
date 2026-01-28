document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive 3D Tilt for Hero Container
    const heroContainer = document.getElementById('nesting-animation-container');

    if (heroContainer) {
        document.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 50; // -25 to 25deg
            const yPos = (e.clientY / window.innerHeight - 0.5) * 50;

            // Compose with the base tilt
            // Base: rotateX(20deg) rotateY(-10deg) rotateZ(5deg)
            // We add mouse influence
            heroContainer.style.transform = `
                rotateX(${20 - yPos * 0.5}deg) 
                rotateY(${-10 + xPos * 0.5}deg) 
                rotateZ(5deg)
            `;
        });
    }

    // 2. Bento Card Spotlight
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

    // 3. SVG Animation Mechanism
    const container = document.getElementById('nesting-animation-container');
    if (container) {
        fetch('./assets/nesting_result.svg')
            .then(response => response.text())
            .then(svgText => {
                // Determine if we need to remove a specific sheet size
                // Simple parser to find 600x400 rect if needed, but CSS filtering is safer visually
                container.innerHTML = svgText;

                const svg = container.querySelector('svg');
                if (!svg) return;

                // Fix ViewBox scaling
                svg.removeAttribute('width');
                svg.removeAttribute('height');

                const paths = Array.from(svg.querySelectorAll('path'));

                // Scatter Preparation
                paths.forEach((path, index) => {
                    // Random start position (Chaos)
                    // We want them to fly in from "above" and "around"
                    const randomX = (Math.random() - 0.5) * 2000;
                    const randomY = (Math.random() - 0.5) * 2000 - 1000; // biased upwards
                    const randomRotate = (Math.random() - 0.5) * 720;
                    const randomScale = 0.5 + Math.random();

                    // Apply Chaos
                    path.style.transformOrigin = 'center';
                    path.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
                    path.style.opacity = '0';

                    // Identify potential "Sheet" (large rect) and hide it
                    // Heuristic: If path string has standard rect format or checking bbox (hard without rendering)
                    // We'll trust visual check or user's specific exclusion.
                    // For now, let's assume all paths are parts. 
                    // If the user provided file has a frame, we might see it flying. 
                });

                // Trigger Assembly (Order)
                // Small delay to ensure browser renders the chaos state first
                setTimeout(() => {
                    paths.forEach((path, index) => {
                        // Stagger the animation slightly for more "organic" feel
                        setTimeout(() => {
                            path.style.opacity = '1';
                            path.style.transform = 'translate(0, 0) rotate(0) scale(1)';
                        }, index * 10 + Math.random() * 500); // Random delay
                    });
                }, 100);
            });
    }

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
