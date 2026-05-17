// ========== PRODUITS ==========
const products = [
    // Mode
    { id: 1, name: "T-shirt Premium", price: 15000, category: "mode", image: "https://picsum.photos/id/20/300/300", rating: 4.5, sold: 128, badge: "Nouveau" },
    { id: 2, name: "Jean Slim Fit", price: 35000, category: "mode", image: "https://picsum.photos/id/21/300/300", rating: 4.2, sold: 95 },
    { id: 3, name: "Robe Chic", price: 45000, category: "mode", image: "https://picsum.photos/id/22/300/300", rating: 4.8, sold: 67, badge: "Best Seller" },
    { id: 4, name: "Blazer Élégant", price: 65000, category: "mode", image: "https://picsum.photos/id/23/300/300", rating: 4.3, sold: 43 },
    { id: 5, name: "Basket Sport", price: 55000, category: "mode", image: "https://picsum.photos/id/24/300/300", rating: 4.6, sold: 156 },
    // Électronique
    { id: 6, name: "Smartphone Pro", price: 250000, category: "electronique", image: "https://picsum.photos/id/25/300/300", rating: 4.7, sold: 89, badge: "-10%" },
    { id: 7, name: "Laptop Ultra", price: 450000, category: "electronique", image: "https://picsum.photos/id/26/300/300", rating: 4.9, sold: 34 },
    { id: 8, name: "Écouteurs BT", price: 35000, category: "electronique", image: "https://picsum.photos/id/27/300/300", rating: 4.4, sold: 234 },
    { id: 9, name: "Enceinte Portable", price: 45000, category: "electronique", image: "https://picsum.photos/id/28/300/300", rating: 4.1, sold: 78 },
    // Maison
    { id: 10, name: "Lampe Design", price: 25000, category: "maison", image: "https://picsum.photos/id/29/300/300", rating: 4.3, sold: 56 },
    { id: 11, name: "Canapé Confort", price: 250000, category: "maison", image: "https://picsum.photos/id/30/300/300", rating: 4.6, sold: 23, badge: "Premium" },
    { id: 12, name: "Table Basse", price: 85000, category: "maison", image: "https://picsum.photos/id/31/300/300", rating: 4.2, sold: 45 },
    // Sport
    { id: 13, name: "Tapis Yoga", price: 25000, category: "sport", image: "https://picsum.photos/id/32/300/300", rating: 4.5, sold: 112 },
    { id: 14, name: "Haltères 10kg", price: 45000, category: "sport", image: "https://picsum.photos/id/33/300/300", rating: 4.4, sold: 67 },
    { id: 15, name: "Ballon Foot", price: 15000, category: "sport", image: "https://picsum.photos/id/34/300/300", rating: 4.3, sold: 89 },
    // Beauté
    { id: 16, name: "Parfum Luxe", price: 65000, category: "beaute", image: "https://picsum.photos/id/35/300/300", rating: 4.8, sold: 78, badge: "-20%" },
    { id: 17, name: "Crème Visage", price: 15000, category: "beaute", image: "https://picsum.photos/id/36/300/300", rating: 4.6, sold: 234 },
    { id: 18, name: "Maquillage Kit", price: 35000, category: "beaute", image: "https://picsum.photos/id/37/300/300", rating: 4.4, sold: 156 }
];

// ========== VARIABLES ==========
let cart = [];
let currentCategory = "all";
let currentProducts = [...products];
let currentSort = "default";

// ========== INITIALISATION ==========
function init() {
    displayProducts(currentProducts);
    loadCart();
    updateCartCount();
    
    document.getElementById("searchInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") searchProducts();
    });
    
    document.getElementById("newsletterForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        showToast(`Merci ${email} ! 🎉`, "success");
        this.reset();
    });
}

// ========== AFFICHAGE PRODUITS ==========
function displayProducts(productsToShow) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    
    if (productsToShow.length === 0) {
        grid.innerHTML = `<div class="empty-cart" style="grid-column: 1/-1;"><i class="fas fa-search"></i><h3>Aucun produit trouvé</h3><p>Essayez une autre recherche</p></div>`;
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://picsum.photos/id/1/300/300'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${generateStars(product.rating)} <span style="color:#666;">(${product.sold})</span></div>
                <div class="product-price">${product.price.toLocaleString()} FCFA</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i> Ajouter</button>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - Math.ceil(rating); i++) stars += '<i class="far fa-star"></i>';
    return stars;
}

// ========== FILTRES ==========
function filterProducts(category) {
    currentCategory = category;
    currentProducts = category === "all" ? [...products] : products.filter(p => p.category === category);
    if (currentSort !== "default") sortProducts(currentSort);
    else displayProducts(currentProducts);
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(category === 'all' ? 'Accueil' : category)) link.classList.add('active');
    });
}

function searchProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!query) { filterProducts(currentCategory); return; }
    displayProducts(currentProducts.filter(p => p.name.toLowerCase().includes(query)));
}

function sortProducts(sortType = null) {
    const select = document.getElementById("sortSelect");
    const sort = sortType || select.value;
    currentSort = sort;
    let sorted = [...currentProducts];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts(sorted);
}

// ========== PANIER ==========
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) { existing.quantity++; showToast(`+1 ${product.name}`, "info"); }
    else { cart.push({ ...product, quantity: 1 }); showToast(`${product.name} ajouté ✅`, "success"); }
    saveCart();
    updateCartCount();
    updateCartModal();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) { const removed = cart[index]; cart.splice(index, 1); showToast(`${removed.name} retiré ❌`, "info"); }
    saveCart();
    updateCartCount();
    updateCartModal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(productId);
        else { saveCart(); updateCartCount(); updateCartModal(); }
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = count;
}

function updateCartModal() {
    const container = document.getElementById("cartItems");
    const totalElem = document.getElementById("cartTotal");
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><h3>Panier vide</h3><p>Ajoutez des produits</p></div>`;
        if (totalElem) totalElem.innerHTML = "";
        return;
    }
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} FCFA</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
    if (totalElem) totalElem.innerHTML = `<strong>Total: ${total.toLocaleString()} FCFA</strong>`;
}

// ========== COMMANDE ==========
function openCart() { updateCartModal(); document.getElementById("cartModal").style.display = "flex"; }
function closeCart() { document.getElementById("cartModal").style.display = "none"; }
function closeCheckout() { document.getElementById("checkoutModal").style.display = "none"; }
function toggleUserMenu() { showToast("Bientôt disponible! 🔧", "info"); }

function checkout() {
    if (cart.length === 0) { showToast("Panier vide !", "error"); return; }
    closeCart();
    document.getElementById("checkoutModal").style.display = "flex";
}

document.getElementById("checkoutForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("clientName").value;
    const phone = document.getElementById("clientPhone").value;
    const address = document.getElementById("clientAddress").value;
    const payment = document.getElementById("paymentMethod").value;
    const comment = document.getElementById("clientComment").value;
    
    if (!name || !phone || !address) { showToast("Remplissez tous les champs !", "error"); return; }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let msg = `🛍️ *NOUVELLE COMMANDE*%0A━━━━━━━━━━━━━━━━%0A👤 ${name}%0A📞 ${phone}%0A📍 ${address}%0A💳 ${payment}%0A%0A📦 *DÉTAILS*%0A`;
    cart.forEach((item, i) => { msg += `${i+1}. ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} FCFA%0A`; });
    msg += `━━━━━━━━━━━━━━━━%0A💰 *TOTAL: ${total.toLocaleString()} FCFA*%0A`;
    if (comment) msg += `%0A💬 ${comment}%0A`;
    msg += `%0A_Merci !_ 🙏`;
    
    window.open(`https://wa.me/2250758167537?text=${msg}`, '_blank');
    cart = [];
    saveCart();
    updateCartCount();
    updateCartModal();
    closeCheckout();
    showToast("Commande envoyée ! 🎉", "success");
    this.reset();
});

// ========== STOCKAGE ==========
function saveCart() { localStorage.setItem("urbanStoreCart", JSON.stringify(cart)); }
function loadCart() { const saved = localStorage.getItem("urbanStoreCart"); if (saved) { cart = JSON.parse(saved); updateCartModal(); } }

// ========== NOTIFICATION ==========
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8";
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// ========== PRELOADER ==========
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const percentElement = document.getElementById('loaderPercent');
    
    // Animation du pourcentage
    let percent = 0;
    const interval = setInterval(() => {
        if (percent < 100) {
            percent += Math.floor(Math.random() * 10) + 5;
            if (percent > 100) percent = 100;
            if (percentElement) percentElement.textContent = percent + '%';
        } else {
            clearInterval(interval);
        }
    }, 150);
    
    // Cacher le preloader
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }
    }, 2000);
});

// ========== FERMETURE MODALS ==========
window.onclick = function(event) {
    if (event.target === document.getElementById("cartModal")) closeCart();
    if (event.target === document.getElementById("checkoutModal")) closeCheckout();
}

// DÉMARRAGE
init();