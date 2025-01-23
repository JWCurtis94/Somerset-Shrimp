// Product data with organized structure
const products = {
    shrimp: [
        { id: 'rcs1', name: 'Red Cherry Shrimp', price: 3.50 },
        { id: 'rcs2', name: 'Red Cherry Shrimp', price: 3.00 },
        { id: 'rcs3', name: 'Red Cherry Shrimp', price: 2.50 },
        { id: 'crs1', name: 'Green Jade Davidi', price: 3.50 },
        { id: 'crs2', name: 'Green Jade Davidi', price: 3.00 },
        { id: 'crs3', name: 'Green Jade Davidi', price: 2.50 },
        { id: 'bds1', name: 'Blue Dream Shrimp', price: 3.50 },
        { id: 'bds2', name: 'Blue Dream Shrimp', price: 3.00 },
        { id: 'bds3', name: 'Blue Dream Shrimp', price: 2.50 },
        { id: 'rcs1', name: 'Yellow Fire Shrimp', price: 3.50 },
        { id: 'rcs2', name: 'Yellow Fire Shrimp', price: 3.00 },
        { id: 'rcs3', name: 'Yellow Fire Shrimp', price: 3.50 },
        { id: 'pcr1', name: '(Pinto) Crystal Red', price: 10.00 },
        { id: 'bg1', name: 'Black Galaxy', price: 10.00 },
        { id: 'prlcr1', name: '(PRL) Crystal Red', price: 3.50 },
    ],
    plants: [
        { id: 'jm1', name: 'Java Moss', price: 6.99 },
        { id: 'an1', name: 'Anubias Nana', price: 9.99 },
        { id: 'mc1', name: 'Monte Carlo', price: 7.99 },
        { id: 'jm1', name: 'Java Moss', price: 6.99 },
        { id: 'an1', name: 'Anubias Nana', price: 9.99 },
    ]
};

// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateCartCount();
        this.calculateTotal();
    }

    addItem(id, name, price, quantity = 1) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id,
                name,
                price,
                quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.calculateTotal();
        this.showNotification(`${name} added to cart!`);
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index > -1) {
            const removedItem = this.items.splice(index, 1)[0];
            this.saveCart();
            this.updateCartCount();
            this.calculateTotal();
            this.showNotification(`${removedItem.name} removed from cart`);
        }
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
                this.calculateTotal();
                this.updateCartCount();
            }
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.total;
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.calculateTotal();
    }

    showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// DOM Elements and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-product-id');
            const product = [...products.shrimp, ...products.plants].find(p => p.id === productId);
            if (product) {
                cart.addItem(product.id, product.name, product.price);
            }
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
});

// Checkout page specific code
if (window.location.pathname.includes('payment.html')) {
    function updateOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const orderTotal = document.getElementById('order-total');
            
        if (!cart.items.length) {
            orderItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart mb-3" style="font-size: 2rem;"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            orderTotal.textContent = '$0.00';
            return;
        }

        orderItems.innerHTML = cart.items.map(item => `
            <div class="item-row">
                <div class="item-details">
                    <div>${item.name}</div>
                    <div class="text-muted">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="quantity-control">
                    <button type="button" class="quantity-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="quantity-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
                <i class="fas fa-times remove-item" onclick="removeItem('${item.id}')"></i>
            </div>
        `).join('');
        
        orderTotal.textContent = `$${cart.calculateTotal().toFixed(2)}`;
    }

    // Make these functions available globally for the onclick handlers
    window.updateItemQuantity = function(id, quantity) {
        cart.updateQuantity(id, quantity);
        updateOrderSummary();
    };

    window.removeItem = function(id) {
        cart.removeItem(id);
        updateOrderSummary();
    };

    // Initialize order summary on page load
    document.addEventListener('DOMContentLoaded', () => {
        updateOrderSummary();
    });
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add custom styling for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 120px;  /* Increased to 120px to clear the navbar completely */
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 300px;  /* Added minimum width */
        max-width: 400px;  /* Added maximum width */
    }

    .notification::before {
        content: '🛒';
        font-size: 1.2em;
    }

    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }

    .notification:hover {
        background-color: #2980b9;
        transform: translateY(0) scale(1.02);
        cursor: pointer;
    }

    .notification {
        position: fixed;
        top: 80px;  /* Changed from 20px to go below navbar */
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;  /* Increased z-index to appear above navbar */
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification::before {
        content: '🛒';
        font-size: 1.2em;
    }

    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }

    .notification:hover {
        background-color: #2980b9;
        transform: translateY(0) scale(1.02);
        cursor: pointer;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification::before {
        content: '🛒';
        font-size: 1.2em;
    }

    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }

    .notification:hover {
        background-color: #2980b9;
        transform: translateY(0) scale(1.02);
    }

    .navbar-scrolled {
        background-color: rgba(44, 62, 80, 0.95) !important;
        backdrop-filter: blur(5px);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);