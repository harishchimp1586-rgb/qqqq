document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // Mobile Drawer Toggle
    // ============================
    const menuToggle = document.getElementById('menuToggle');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer on link click
    const drawerLinks = document.querySelectorAll('.drawer-nav a');
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // ============================
    // Size Chip Selection
    // ============================
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const chips = card.querySelectorAll('.size-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            });
        });
    });

    // ============================
    // Add to Cart Logic
    // ============================
    const cartCountEl = document.getElementById('cartCount');
    const cartBottomBtn = document.getElementById('cartBottomBtn');
    let cartCount = 0;

    const addBtns = document.querySelectorAll('.add-to-cart-btn');

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cartCount++;
            updateCartBadge();

            // Visual feedback — button briefly shows "Added ✓"
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Added
            `;
            btn.classList.add('added');

            // Animate cart badge
            if (cartCountEl) {
                cartCountEl.classList.add('cart-pop');
                setTimeout(() => cartCountEl.classList.remove('cart-pop'), 300);
            }

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('added');
            }, 1200);
        });
    });

    function updateCartBadge() {
        if (cartCountEl) {
            cartCountEl.textContent = cartCount;
            cartCountEl.setAttribute('data-count', cartCount);
            if (cartCount > 0) {
                cartCountEl.style.display = 'flex';
            }
        }
    }

    // ============================
    // Desktop Nav Active State
    // ============================
    const desktopNavLinks = document.querySelectorAll('.desktop-nav a');
    const sections = document.querySelectorAll('section[id]');

    const observerOpts = {
        root: null,
        rootMargin: '-60px 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                desktopNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOpts);

    sections.forEach(sec => sectionObserver.observe(sec));

    // ============================
    // Smooth Scroll for anchor links
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
