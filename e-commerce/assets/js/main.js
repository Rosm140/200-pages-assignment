// ShopHub - Complete E-Commerce Functionality
// Full cart system with localStorage, dynamic updates, and checkout

// ===================================
// CART MANAGEMENT SYSTEM
// ===================================

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.wishlist = this.loadWishlist();
        this.init();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('shophub_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shophub_cart', JSON.stringify(this.items));
        this.updateCartUI();
    }

    // Load wishlist from localStorage
    loadWishlist() {
        const saved = localStorage.getItem('shophub_wishlist');
        return saved ? JSON.parse(saved) : [];
    }

    // Save wishlist to localStorage
    saveWishlist() {
        localStorage.setItem('shophub_wishlist', JSON.stringify(this.wishlist));
    }

    // Initialize cart functionality
    init() {
        this.updateCartUI();
        this.attachEventListeners();
        this.startCountdown();
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`✓ ${product.name} added to cart!`, 'success');
        this.animateCartIcon();
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Item removed from cart', 'info');
        
        // Refresh cart page if on cart page
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Update item quantity
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                if (window.location.pathname.includes('cart.html')) {
                    this.renderCartPage();
                }
            }
        }
    }

    // Get cart totals
    getCartTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // Update cart counter in header
    updateCartUI() {
        const totals = this.getCartTotals();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totals.itemCount;
            if (totals.itemCount > 0) {
                element.style.display = 'inline-block';
            }
        });
    }

    // Animate cart icon when item added
    animateCartIcon() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.style.animation = 'none';
            setTimeout(() => {
                cartBtn.style.animation = 'cartBounce 0.5s ease';
            }, 10);
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#00D9A3' : '#FF6B00'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Render cart page
    renderCartPage() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartItemsContainer) return;

        const totals = this.getCartTotals();

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div style="font-size: 5rem; margin-bottom: 1rem;">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p style="color: var(--text-secondary); margin: 1rem 0 2rem;">Add some products to get started!</p>
                    <a href="../index.html" class="btn-add-cart">Continue Shopping</a>
                </div>
            `;
            cartSummary.innerHTML = '';
            return;
        }

        // Render cart items
        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">${item.image}</div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p style="color: #B4B7C3;">Price: $${item.price.toFixed(2)}</p>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                        <span style="padding: 0 1rem; font-weight: 700;">${item.quantity}</span>
                        <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="cart.removeFromCart('${item.id}')">Remove</button>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.5rem; font-weight: 800; color: #FF6B00;">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        `).join('');

        // Render cart summary
        cartSummary.innerHTML = `
            <h2>Order Summary</h2>
            <div class="summary-row">
                <span>Subtotal (${totals.itemCount} items):</span>
                <span>$${totals.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span style="color: ${totals.shipping === '0.00' ? '#00D9A3' : 'white'};">
                    ${totals.shipping === '0.00' ? 'FREE' : '$' + totals.shipping}
                </span>
            </div>
            ${totals.shipping !== '0.00' ? `
                <div class="summary-note">
                    <small>Add $${(50 - parseFloat(totals.subtotal)).toFixed(2)} more for FREE shipping!</small>
                </div>
            ` : ''}
            <div class="summary-row">
                <span>Tax (8%):</span>
                <span>$${totals.tax}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span style="color: #FF6B00;">$${totals.total}</span>
            </div>
            <button class="btn-checkout" onclick="cart.proceedToCheckout()">
                Proceed to Checkout →
            </button>
            <a href="../index.html" style="display: block; text-align: center; margin-top: 1rem; color: #FF6B00; text-decoration: none;">
                ← Continue Shopping
            </a>
            
            <div class="payment-methods" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">We Accept:</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="padding: 0.4rem 0.8rem; background: var(--secondary-dark); border-radius: 4px; font-size: 0.8rem;">💳 Visa</span>
                    <span style="padding: 0.4rem 0.8rem; background: var(--secondary-dark); border-radius: 4px; font-size: 0.8rem;">💳 Mastercard</span>
                    <span style="padding: 0.4rem 0.8rem; background: var(--secondary-dark); border-radius: 4px; font-size: 0.8rem;">💰 PayPal</span>
                </div>
            </div>
        `;
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'info');
            return;
        }
        
        // Save order data for checkout page
        localStorage.setItem('shophub_checkout_data', JSON.stringify({
            items: this.items,
            totals: this.getCartTotals(),
            timestamp: new Date().toISOString()
        }));
        
        window.location.href = 'checkout.html';
    }

    // Add to wishlist
    addToWishlist(product) {
        const exists = this.wishlist.find(item => item.id === product.id);
        if (!exists) {
            this.wishlist.push(product);
            this.saveWishlist();
            this.showNotification(`♥ Added to wishlist!`, 'success');
        } else {
            this.showNotification('Already in wishlist!', 'info');
        }
    }

    // Attach event listeners
    attachEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-cart')) {
                e.preventDefault();
                
                // Get product data from button or card
                const card = e.target.closest('.product-card');
                if (card) {
                    const product = {
                        id: 'product_' + Math.random().toString(36).substr(2, 9),
                        name: card.querySelector('.product-title')?.textContent || 'Product',
                        price: parseFloat(card.querySelector('.current-price')?.textContent.replace('$', '') || '0'),
                        image: card.querySelector('.placeholder-img')?.textContent || '📦'
                    };
                    this.addToCart(product);
                }
            }

            // Wishlist buttons
            if (e.target.classList.contains('wishlist-btn')) {
                const card = e.target.closest('.product-card');
                if (card) {
                    const product = {
                        id: 'product_' + Math.random().toString(36).substr(2, 9),
                        name: card.querySelector('.product-title')?.textContent || 'Product',
                        price: parseFloat(card.querySelector('.current-price')?.textContent.replace('$', '') || '0'),
                        image: card.querySelector('.placeholder-img')?.textContent || '📦'
                    };
                    this.addToWishlist(product);
                    e.target.classList.toggle('active');
                }
            }
        });

        // Initialize cart page if on cart page
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    // Countdown timer for deals
    startCountdown() {
        const countdownEl = document.querySelector('.countdown');
        if (!countdownEl) return;
        
        let hours = 2, minutes = 45, seconds = 30;
        
        setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
            }
            if (minutes < 0) {
                minutes = 59;
                hours--;
            }
            if (hours < 0) {
                hours = 0;
                minutes = 0;
                seconds = 0;
            }
            
            countdownEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }
}

// ===================================
// CHECKOUT PROCESS
// ===================================

class CheckoutProcess {
    constructor() {
        this.currentStep = 1;
        this.formData = {
            shipping: {},
            payment: {}
        };
        this.init();
    }

    init() {
        if (window.location.pathname.includes('checkout.html')) {
            this.loadCheckoutData();
            this.renderCheckout();
            this.attachCheckoutListeners();
        }
    }

    loadCheckoutData() {
        const data = localStorage.getItem('shophub_checkout_data');
        if (!data) {
            window.location.href = 'cart.html';
            return;
        }
        this.checkoutData = JSON.parse(data);
    }

    renderCheckout() {
        const checkoutContainer = document.getElementById('checkoutContainer');
        if (!checkoutContainer) return;

        checkoutContainer.innerHTML = `
            <div class="checkout-layout">
                <div class="checkout-main">
                    <div class="checkout-steps">
                        <div class="step ${this.currentStep === 1 ? 'active' : ''}">1. Shipping</div>
                        <div class="step ${this.currentStep === 2 ? 'active' : ''}">2. Payment</div>
                        <div class="step ${this.currentStep === 3 ? 'active' : ''}">3. Review</div>
                    </div>

                    <div id="stepContent">
                        ${this.renderCurrentStep()}
                    </div>
                </div>

                <div class="checkout-summary">
                    ${this.renderOrderSummary()}
                </div>
            </div>
        `;
    }

    renderCurrentStep() {
        switch(this.currentStep) {
            case 1:
                return this.renderShippingForm();
            case 2:
                return this.renderPaymentForm();
            case 3:
                return this.renderReviewOrder();
            default:
                return '';
        }
    }

    renderShippingForm() {
        return `
            <h2>Shipping Information</h2>
            <form id="shippingForm" class="checkout-form">
                <div class="form-row-2">
                    <div class="form-group">
                        <label>First Name *</label>
                        <input type="text" name="firstName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name *</label>
                        <input type="text" name="lastName" class="form-input" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="phone" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Address *</label>
                    <input type="text" name="address" class="form-input" required>
                </div>
                <div class="form-row-3">
                    <div class="form-group">
                        <label>City *</label>
                        <input type="text" name="city" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>State *</label>
                        <input type="text" name="state" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>ZIP *</label>
                        <input type="text" name="zip" class="form-input" required>
                    </div>
                </div>
                <button type="submit" class="btn-checkout">Continue to Payment →</button>
            </form>
        `;
    }

    renderPaymentForm() {
        return `
            <h2>Payment Method</h2>
            <form id="paymentForm" class="checkout-form">
                <div class="payment-methods-select">
                    <label class="payment-option">
                        <input type="radio" name="paymentMethod" value="card" checked>
                        <span>💳 Credit/Debit Card</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="paymentMethod" value="paypal">
                        <span>💰 PayPal</span>
                    </label>
                </div>

                <div id="cardPaymentFields">
                    <div class="form-group">
                        <label>Card Number *</label>
                        <input type="text" name="cardNumber" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19" required>
                    </div>
                    <div class="form-row-2">
                        <div class="form-group">
                            <label>Expiry Date *</label>
                            <input type="text" name="expiry" class="form-input" placeholder="MM/YY" maxlength="5" required>
                        </div>
                        <div class="form-group">
                            <label>CVV *</label>
                            <input type="text" name="cvv" class="form-input" placeholder="123" maxlength="4" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Cardholder Name *</label>
                        <input type="text" name="cardName" class="form-input" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="checkout.previousStep()">← Back</button>
                    <button type="submit" class="btn-checkout">Review Order →</button>
                </div>
            </form>
        `;
    }

    renderReviewOrder() {
        const totals = this.checkoutData.totals;
        return `
            <h2>Review Your Order</h2>
            
            <div class="review-section">
                <h3>Shipping Address</h3>
                <p>
                    ${this.formData.shipping.firstName} ${this.formData.shipping.lastName}<br>
                    ${this.formData.shipping.address}<br>
                    ${this.formData.shipping.city}, ${this.formData.shipping.state} ${this.formData.shipping.zip}<br>
                    ${this.formData.shipping.email} | ${this.formData.shipping.phone}
                </p>
            </div>

            <div class="review-section">
                <h3>Payment Method</h3>
                <p>
                    ${this.formData.payment.paymentMethod === 'card' ? '💳 Card ending in ' + this.formData.payment.cardNumber.slice(-4) : '💰 PayPal'}
                </p>
            </div>

            <div class="review-section">
                <h3>Order Items</h3>
                ${this.checkoutData.items.map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>${item.image} ${item.name} (x${item.quantity})</span>
                        <span style="font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="checkout.previousStep()">← Back</button>
                <button type="button" class="btn-checkout" onclick="checkout.placeOrder()">Place Order - $${totals.total}</button>
            </div>
        `;
    }

    renderOrderSummary() {
        const totals = this.checkoutData.totals;
        return `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${totals.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${totals.shipping === '0.00' ? 'FREE' : '$' + totals.shipping}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${totals.tax}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span style="color: #FF6B00;">$${totals.total}</span>
            </div>
        `;
    }

    attachCheckoutListeners() {
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'shippingForm') {
                e.preventDefault();
                this.saveShippingInfo(new FormData(e.target));
                this.nextStep();
            }
            
            if (e.target.id === 'paymentForm') {
                e.preventDefault();
                this.savePaymentInfo(new FormData(e.target));
                this.nextStep();
            }
        });
    }

    saveShippingInfo(formData) {
        this.formData.shipping = Object.fromEntries(formData);
    }

    savePaymentInfo(formData) {
        this.formData.payment = Object.fromEntries(formData);
    }

    nextStep() {
        this.currentStep++;
        this.renderCheckout();
    }

    previousStep() {
        this.currentStep--;
        this.renderCheckout();
    }

    placeOrder() {
        // Save order to localStorage
        const order = {
            id: 'ORDER_' + Date.now(),
            items: this.checkoutData.items,
            totals: this.checkoutData.totals,
            shipping: this.formData.shipping,
            payment: { method: this.formData.payment.paymentMethod },
            date: new Date().toISOString(),
            status: 'Processing'
        };

        const orders = JSON.parse(localStorage.getItem('shophub_orders') || '[]');
        orders.push(order);
        localStorage.setItem('shophub_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('shophub_cart');
        localStorage.removeItem('shophub_checkout_data');

        // Show success and redirect
        alert(`✅ Order placed successfully!\n\nOrder ID: ${order.id}\n\nYou will receive a confirmation email shortly.`);
        window.location.href = 'orders.html';
    }
}

// ===================================
// INITIALIZE
// ===================================

// Global cart instance
let cart;
let checkout;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShopHub);
} else {
    initShopHub();
}

function initShopHub() {
    cart = new ShoppingCart();
    checkout = new CheckoutProcess();
    console.log('🛒 ShopHub E-Commerce System Loaded!');
}

// Add CSS animation for cart bounce
const style = document.createElement('style');
style.textContent = `
    @keyframes cartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .empty-cart {
        text-align: center;
        padding: 4rem 2rem;
    }
    .checkout-steps {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    .step {
        flex: 1;
        padding: 1rem;
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        text-align: center;
        font-weight: 700;
    }
    .step.active {
        border-color: var(--primary-orange);
        background: rgba(255, 107, 0, 0.1);
        color: var(--primary-orange);
    }
    .checkout-form {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
    }
    .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .form-row-3 {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 1rem;
    }
    .payment-methods-select {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    .payment-option {
        flex: 1;
        padding: 1.5rem;
        background: var(--secondary-dark);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .payment-option input[type="radio"]:checked + span {
        color: var(--primary-orange);
    }
    .payment-option:has(input:checked) {
        border-color: var(--primary-orange);
        background: rgba(255, 107, 0, 0.1);
    }
    .review-section {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    .review-section h3 {
        margin-bottom: 1rem;
        color: var(--primary-orange);
    }
    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    .btn-secondary {
        flex: 1;
        background: transparent;
        border: 2px solid var(--border-color);
        color: var(--text-primary);
        padding: 1rem;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
    }
    .checkout-layout {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
    }
    .checkout-summary {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        height: fit-content;
        position: sticky;
        top: 100px;
    }
    .summary-note {
        padding: 0.75rem;
        background: rgba(0, 217, 163, 0.1);
        border-left: 3px solid var(--success-green);
        border-radius: 4px;
        margin: 0.5rem 0;
    }
    .summary-note small {
        color: var(--success-green);
    }
`;
document.head.appendChild(style);