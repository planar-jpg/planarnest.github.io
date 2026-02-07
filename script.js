document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Premium Scroll Reveal ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // --- 2. Spotlight Logic ---
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

    // --- 3. Smooth Magnetic Buttons (Lerp) ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHovering = false;

        btn.addEventListener('mousemove', (e) => {
            isHovering = true;
            const rect = btn.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width / 2) * 0.5; // Factor
            mouseY = (e.clientY - rect.top - rect.height / 2) * 0.5;
        });

        btn.addEventListener('mouseleave', () => {
            isHovering = false;
            mouseX = 0;
            mouseY = 0;
        });

        // Animation Loop for Smoothness
        function animate() {
            if (isHovering || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                // Lerp current to target
                currentX += (mouseX - currentX) * 0.1;
                currentY += (mouseY - currentY) * 0.1;
                btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
                requestAnimationFrame(animate);
            } else {
                // Stop loop if settled
                btn.style.transform = 'translate(0, 0)';
            }
        }

        btn.addEventListener('mouseenter', () => {
            requestAnimationFrame(animate);
        });
    });

    // --- 4. Parallax Background Orbs ---
    const orbs = document.querySelectorAll('.orb');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 20;
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

    // --- 5. SVG Animation ---
    const container = document.getElementById('nesting-animation-container');
    if (container) {
        fetch('./assets/nesting_result.svg')
            .then(response => {
                if (!response.ok) return; // Silent fail
                return response.text();
            })
            .then(svgText => {
                if (!svgText) return;
                container.innerHTML = svgText;
                const svg = container.querySelector('svg');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');

                // Style the paths for the dark theme (Increased visibility)
                const paths = Array.from(svg.querySelectorAll('path'));
                paths.forEach((path, i) => {
                    path.style.fill = 'rgba(255,255,255,0.1)'; // Brighter fill
                    path.style.stroke = 'rgba(129, 140, 248, 0.6)'; // Brighter stroke
                    path.style.strokeWidth = '1px';
                    path.style.opacity = 0;
                    path.style.transition = 'all 1.5s cubic-bezier(0.19, 1, 0.22, 1)';

                    // Initial Scatter
                    const rX = (Math.random() - 0.5) * 2000;
                    const rY = (Math.random() - 0.5) * 2000;
                    path.style.transform = `translate(${rX}px, ${rY}px) scale(0)`;
                });

                // Assemble with Variable Speed
                // Request: Start slow, accelerate DRAMATICALLY.
                // Previous logic was grouping by 10, which is too slow for few parts.
                // New logic: Exponential decay of interval. 
                setTimeout(() => {
                    let accumulatedDelay = 0;

                    paths.forEach((path, i) => {
                        // Exponential acceleration:
                        // Start very slow (600ms), drop rapidly to variable speed limit (10ms)
                        // Formula: Initial * Math.exp(-decay * index)
                        // With decay 0.15: 
                        // i=0: 600ms, i=5: ~280ms, i=10: ~130ms, i=20: ~30ms
                        let interval = Math.max(20, 600 * Math.exp(-0.15 * i));

                        accumulatedDelay += interval;

                        setTimeout(() => {
                            path.style.opacity = 1;
                            path.style.transform = 'translate(0,0) scale(1)';
                        }, accumulatedDelay);
                    });
                }, 500);
            });
    }

    // --- 6. Smooth Scroll Anchor ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    // --- 7. Demo Video Interaction ---
    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- 7. Demo Video Interaction ---
    const demoContainer = document.querySelector('.demo-3d-container');
    const demoVideo = document.getElementById('demoVideo');

    if (demoContainer && demoVideo) {
        demoContainer.addEventListener('mouseenter', () => {
            // demoVideo.currentTime = 0; // Removing reset to allow continuity or immediate play
            demoVideo.play().catch(e => console.log('Autoplay prevented:', e));
        });

        demoContainer.addEventListener('mouseleave', () => {
            demoVideo.pause();
            // demoVideo.currentTime = 0; // Don't reset, just pause
        });
    }
});
