document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Scroll Reveal Observer ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // --- 2. 3D Tilt Effect for Bento Cards ---
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            // Set custom properties for spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- 3. Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button slightly towards mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // --- 4. Parallax Background ---
    const starsContainer = document.querySelector('.stars-container');
    const heroVisual = document.querySelector('.hero-visual');

    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        if (starsContainer) {
            starsContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        // Slightly move the hero visual for depth
        if (heroVisual) {
            heroVisual.style.transform = `translateX(-50%) translate(${-moveX * 2}px, ${-moveY * 2}px)`;
        }
    });

    // --- 5. SVG Animation Mechanism (Existing Logic Preserved) ---
    const container = document.getElementById('nesting-animation-container');
    if (container) {
        fetch('./assets/nesting_result.svg') // Verify this path exists in your repo
            .then(response => {
                if (!response.ok) throw new Error("SVG not found");
                return response.text();
            })
            .then(svgText => {
                container.innerHTML = svgText;
                const svg = container.querySelector('svg');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');

                const paths = Array.from(svg.querySelectorAll('path'));

                // Initial Chaos State
                paths.forEach((path) => {
                    const randomX = (Math.random() - 0.5) * 3000;
                    const randomY = (Math.random() - 0.5) * 3000 - 1500;
                    const randomRotate = (Math.random() - 0.5) * 360;
                    const randomScale = 0.2 + Math.random() * 0.5;

                    path.style.transformOrigin = 'center';
                    path.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
                    path.style.opacity = '0';
                    path.style.transition = 'all 1.5s cubic-bezier(0.19, 1, 0.22, 1)';
                });

                // Trigger Assembly
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        paths.forEach((path, index) => {
                            setTimeout(() => {
                                path.style.opacity = '1';
                                // Assembly State
                                path.style.transform = 'translate(0, 0) rotate(0) scale(1)';
                            }, index * 5 + Math.random() * 300);
                        });
                    }, 100);
                });
            })
            .catch(err => console.log('SVG Animation omitted:', err)); // Graceful fallback
    }

    // --- 6. Smooth Anchor Scrolling ---
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
