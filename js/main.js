document.addEventListener('DOMContentLoaded', () => {
    
    // Bottom Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');
        });
    });

    // Category Chips Logic
    const chips = document.querySelectorAll('.category-chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add to Cart Logic (visual only)
    const addBtns = document.querySelectorAll('.add-btn');
    const cartBadge = document.querySelector('.cart-badge');
    let cartCount = 0;
    
    addBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cartCount++;
            cartBadge.textContent = cartCount;
            
            // Visual feedback on the button
            const originalHTML = this.innerHTML;
            this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            this.style.backgroundColor = '#10b981'; // Success green
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = ''; // Reset
            }, 1000);
        });
    });

    // Handle initial scroll active states based on IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.nav-item[href="#${id}"]`);
                if (navLink) {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
    
});
