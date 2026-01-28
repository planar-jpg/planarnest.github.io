document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in to elements
    const animatedElements = document.querySelectorAll('.feature-card, .section-header, .cta-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Simulate "Loading" the app preview
    setTimeout(() => {
        const placeholder = document.getElementById('app-preview-placeholder');
        const image = document.querySelector('.window-image');

        if (placeholder && image && image.getAttribute('src') !== '') {
            // Check if image loads (if we have one)
            // For now, simple transition if we had an image
            // placeholder.style.display = 'none';
            // image.style.display = 'block';
        }
    }, 2000);
});
