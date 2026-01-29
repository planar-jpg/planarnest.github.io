document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive 3D Tilt for Hero Container
    const heroContainer = document.getElementById('nesting-animation-container');

    // 2D mode - no mouse tilt effect needed
    // Animation SVG stays flat as background

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
                    // Chaos State: Scattered far away, small scale, invisible
                    const randomX = (Math.random() - 0.5) * 3000;
                    const randomY = (Math.random() - 0.5) * 3000 - 1500; // Come from top/sky
                    const randomRotate = (Math.random() - 0.5) * 360;
                    const randomScale = 0.2 + Math.random() * 0.5; // Start small

                    path.style.transformOrigin = 'center';
                    path.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
                    path.style.opacity = '0';
                    path.style.transition = 'all 1.5s cubic-bezier(0.19, 1, 0.22, 1)'; // Exponential ease out for "slamming" effect
                });

                // Trigger Assembly (Order)
                // Slight delay to ensure DOM has painted the scattered state
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        paths.forEach((path, index) => {
                            setTimeout(() => {
                                path.style.opacity = '1';
                                // Assembly State: Original position but SCALED UP (User requested 3x)
                                // Since SVG is 600x400, 3x might be huge. Let's try 1.8x first to fill the screen width better without overflow.
                                // Actually user said "3x", let's be bold but maybe handle it via container scale or path scale.
                                // Scaling paths individually 3x works if they are centered, but they will overlap weirdly if not careful.
                                // Better to scale the CONTAINER or the SVG ViewBox.
                                // Let's reset the path transform to Identity (scale 1 relative to SVG space)
                                // And we will scale the container in CSS.
                                path.style.transform = 'translate(0, 0) rotate(0) scale(1)';
                            }, index * 5 + Math.random() * 300); // Faster, more chaotic arrival
                        });
                    }, 100);
                });
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
