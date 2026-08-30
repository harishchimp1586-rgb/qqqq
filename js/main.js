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
    // Add to Cart & WhatsApp Logic
    // ============================
    const cartCountEl = document.getElementById('cartCount');
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    // Store cart items as an array of objects: { name, size }
    let cart = [];

    const addBtns = document.querySelectorAll('.add-to-cart-btn');

    addBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find product details
            const card = this.closest('.product-card');
            const productName = card.querySelector('.product-name').textContent.trim();
            const activeSizeChip = card.querySelector('.size-chip.active');
            const size = activeSizeChip ? activeSizeChip.textContent.trim() : 'Default';
            const imgSrc = card.querySelector('img').getAttribute('src');

            // Add to cart array
            cart.push({ name: productName, size: size, img: imgSrc });
            
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
            const count = cart.length;
            cartCountEl.textContent = count;
            cartCountEl.setAttribute('data-count', count);
            if (count > 0) {
                cartCountEl.style.display = 'flex';
            } else {
                cartCountEl.style.display = 'none';
            }
        }
    }

    // Handle WhatsApp checkout logic (Original Button)
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            checkoutViaWhatsApp();
        });
    }

    // ============================
    // Cart Drawer Logic
    // ============================
    const cartBottomBtn = document.getElementById('cartBottomBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

    function openCartDrawer() {
        renderCartItems();
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCartDrawer() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (cartBottomBtn) cartBottomBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            checkoutViaWhatsApp();
        });
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            return;
        }

        const itemGroups = getGroupedCartItems();
        let html = '';

        for (const [key, item] of Object.entries(itemGroups)) {
            html += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-size">Size: ${item.size}</span>
                    </div>
                    <div class="cart-item-qty">${item.qty}x</div>
                </div>
            `;
        }

        cartItemsContainer.innerHTML = html;
    }

    function getGroupedCartItems() {
        const itemGroups = {};
        cart.forEach(item => {
            const key = `${item.name} (${item.size})`;
            if (!itemGroups[key]) {
                itemGroups[key] = {
                    name: item.name,
                    size: item.size,
                    img: item.img,
                    qty: 0
                };
            }
            itemGroups[key].qty += 1;
        });
        return itemGroups;
    }

    function checkoutViaWhatsApp() {
        let message = "Hello Rejoice Enterprise,\n\nI would like to inquire about the following items:\n\n";
        
        if (cart.length === 0) {
            message = "Hello Rejoice Enterprise, I am interested in your packaging products. Could you share a catalog?";
        } else {
            const itemGroups = getGroupedCartItems();
            for (const [key, item] of Object.entries(itemGroups)) {
                message += `- ${item.qty}x ${item.name} (${item.size})\n`;
            }
            message += "\nCould you please let me know the pricing and availability?";
        }
        
        const whatsappUrl = `https://wa.me/916374450321?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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
