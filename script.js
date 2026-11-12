/**
 * ==============================================================================
 * JAVASCRIPT - EMPRENDIMIENTO NAVIDEÑO
 * Proyecto: Regalos con magia navideña (Edición Festiva y Decorada 🎄✨)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Estado del carrito de compras
    let cart = [];

    // Elementos del DOM
    const cartCountEl = document.getElementById('cartCount');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModalOverlay = document.getElementById('cartModalOverlay');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPriceEl = document.getElementById('cartTotalPrice');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const searchInput = document.getElementById('searchInput');
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMsg = document.getElementById('newsletterMsg');
    const btnArmarPack = document.getElementById('btnArmarPack');
    const snowToggleBtn = document.getElementById('snowToggleBtn');
    const countdownEl = document.getElementById('countdownDays');

    // ==========================================================================
    // 1. EFECTO DE NIEVE SUAVE EN CANVAS (DECORACIÓN MÁGICA ❄️)
    // ==========================================================================
    const canvas = document.getElementById('snowCanvas');
    let ctx = null;
    let snowflakes = [];
    let snowActive = true;
    let animationFrameId = null;

    if (canvas) {
        ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Crear copos de nieve
        const totalFlakes = Math.min(window.innerWidth / 18, 65);
        for (let i = 0; i < totalFlakes; i++) {
            snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2.8 + 1,
                speedY: Math.random() * 0.9 + 0.4,
                speedX: Math.random() * 0.6 - 0.3,
                opacity: Math.random() * 0.6 + 0.3
            });
        }

        function drawSnow() {
            if (!snowActive) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            snowflakes.forEach(flake => {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 4;
                ctx.fill();

                flake.y += flake.speedY;
                flake.x += flake.speedX;

                if (flake.y > canvas.height) {
                    flake.y = -5;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width) flake.x = 0;
                if (flake.x < 0) flake.x = canvas.width;
            });

            animationFrameId = requestAnimationFrame(drawSnow);
        }
        drawSnow();

        // Botón para alternar la nieve
        if (snowToggleBtn) {
            snowToggleBtn.addEventListener('click', () => {
                snowActive = !snowActive;
                if (snowActive) {
                    snowToggleBtn.innerHTML = '<i class="fa-regular fa-snowflake"></i> Nieve: On';
                    drawSnow();
                } else {
                    snowToggleBtn.innerHTML = '<i class="fa-regular fa-snowflake"></i> Nieve: Off';
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    cancelAnimationFrame(animationFrameId);
                }
            });
        }
    }

    // ==========================================================================
    // 2. CUENTA REGRESIVA PARA NAVIDAD 🎅
    // ==========================================================================
    function updateCountdown() {
        if (!countdownEl) return;
        const now = new Date();
        const currentYear = now.getFullYear();
        let christmas = new Date(currentYear, 11, 24, 23, 59, 59); // 24 de diciembre

        if (now > christmas) {
            christmas = new Date(currentYear + 1, 11, 24, 23, 59, 59);
        }

        const diff = christmas - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);

        countdownEl.textContent = `${days} días y ${hours}h ${minutes}m`;
    }
    updateCountdown();
    setInterval(updateCountdown, 60000);

    // ==========================================================================
    // 3. CONFETI FESTIVO AL AGREGAR PRODUCTO (✨🎁⭐)
    // ==========================================================================
    function burstFestiveConfetti(x, y) {
        const particles = ['✨', '⭐', '❄️', '🎁', '🔔', '🎄'];
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('span');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.fontSize = `${Math.random() * 12 + 16}px`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '99999';
            particle.style.transition = 'all 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
            particle.style.opacity = '1';

            document.body.appendChild(particle);

            const destX = (Math.random() - 0.5) * 160;
            const destY = (Math.random() - 0.8) * 160;

            requestAnimationFrame(() => {
                particle.style.transform = `translate(${destX}px, ${destY}px) scale(0.6) rotate(${Math.random() * 360}deg)`;
                particle.style.opacity = '0';
            });

            setTimeout(() => {
                particle.remove();
            }, 900);
        }
    }

    // ==========================================================================
    // 4. CARRITO DE COMPRAS INTERACTIVO
    // ==========================================================================
    function addToCart(product, event) {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                img: product.img,
                quantity: 1
            });
        }

        updateCartUI();
        showToast(`¡"${product.name}" agregado a tu carrito! 🎁`);

        // Lanzar partículas festivas en la posición del botón
        if (event) {
            burstFestiveConfetti(event.clientX, event.clientY);
        }

        // Animación en el botón del carrito
        openCartBtn.style.transform = 'scale(1.15) rotate(-3deg)';
        setTimeout(() => {
            openCartBtn.style.transform = '';
        }, 250);
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCountEl.textContent = totalItems;
        cartTotalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fa-solid fa-sleigh" style="font-size: 2.8rem; color: #ff5258; margin-bottom: 12px;"></i>
                    <p style="font-weight: 700; font-size: 1.1rem; color: #111827;">Tu trineo está vacío</p>
                    <small style="color: #6b7280;">¡Elige tus regalos favoritos para comenzar a empacar la magia!</small>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}" title="Eliminar producto">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
    }

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');

        if (action === 'increase') {
            const item = cart.find(i => i.id === id);
            if (item) item.quantity += 1;
        } else if (action === 'decrease') {
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
            }
        } else if (target.classList.contains('remove-btn') || target.closest('.remove-btn')) {
            cart = cart.filter(i => i.id !== id);
        }

        updateCartUI();
    });

    clearCartBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('El carrito ya está vacío ❄️');
            return;
        }
        if (confirm('¿Deseas vaciar tu carrito navideño?')) {
            cart = [];
            updateCartUI();
            showToast('Carrito vaciado con éxito ✨');
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('¡Tu carrito está vacío! Elige un regalo antes de continuar.');
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`🎉 ¡Muchas gracias por tu compra navideña!\nTotal procesado: $${totalPrice.toFixed(2)}\n\n¡Tus regalos están siendo preparados con mucha magia y amor para estas fiestas! 🎄🎅🎁✨`);
        cart = [];
        updateCartUI();
        closeModal();
    });

    // ==========================================================================
    // 5. MODAL ABRIR / CERRAR
    // ==========================================================================
    function openModal() {
        cartModalOverlay.classList.add('active');
    }

    function closeModal() {
        cartModalOverlay.classList.remove('active');
    }

    openCartBtn.addEventListener('click', openModal);
    closeCartBtn.addEventListener('click', closeModal);

    cartModalOverlay.addEventListener('click', (e) => {
        if (e.target === cartModalOverlay) {
            closeModal();
        }
    });

    // ==========================================================================
    // 6. BOTONES "AGREGAR AL CARRITO"
    // ==========================================================================
    const addCartButtons = document.querySelectorAll('.btn-add-cart');
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const imgEl = card.querySelector('.product-img-box img');
            const product = {
                id: card.getAttribute('data-id'),
                name: card.getAttribute('data-name') || card.querySelector('.product-name').textContent.trim(),
                price: card.getAttribute('data-price') || "25.00",
                img: imgEl ? imgEl.getAttribute('src') : 'img/hero_regalos.jpg'
            };
            addToCart(product, e);
        });
    });

    // ==========================================================================
    // 7. TOAST NOTIFICACIÓN FLOTANTE
    // ==========================================================================
    let toastTimeout;
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // ==========================================================================
    // 8. BUSCADOR INTERACTIVO
    // ==========================================================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const productCards = document.querySelectorAll('.product-card');

            productCards.forEach(card => {
                const name = (card.getAttribute('data-name') || card.querySelector('.product-name').textContent).toLowerCase();
                const desc = (card.querySelector('.product-description')?.textContent || '').toLowerCase();
                const price = (card.getAttribute('data-price') || '').toLowerCase();

                if (name.includes(query) || desc.includes(query) || price.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==========================================================================
    // 9. FORMULARIO DE NEWSLETTER
    // ==========================================================================
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();

            if (email) {
                newsletterMsg.textContent = `¡Bienvenido a la familia navideña! Recibirás sorpresas y cupones en ${email} 🎄✨`;
                newsletterMsg.className = 'newsletter-message success';
                newsletterEmail.value = '';

                setTimeout(() => {
                    newsletterMsg.textContent = '';
                }, 5500);
            }
        });
    }

    // ==========================================================================
    // 10. BOTÓN "ARMAR UN PACK"
    // ==========================================================================
    if (btnArmarPack) {
        btnArmarPack.addEventListener('click', (e) => {
            burstFestiveConfetti(e.clientX, e.clientY);
            alert('🎁 ¡Promoción Especial de Nochebuena!\nElige 2 o más artículos para tu pack personalizado y recibe un 15% de descuento directo en el total.');
        });
    }

    // ==========================================================================
    // 11. CLIC EN CATEGORÍAS
    // ==========================================================================
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(cat => {
        cat.addEventListener('click', () => {
            const catTitle = cat.querySelector('.category-title')?.textContent || 'Colección';
            showToast(`Explorando colección: "${catTitle}" 🎅✨`);
        });
    });

    updateCartUI();
});
