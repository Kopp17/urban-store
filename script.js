// ========== DONNÉES PRODUITS ==========
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

// ========== VARIABLES GLOBALES ==========
let cart = [];
let currentCategory = "all";
let currentProducts = [...products];
let currentSort = "default";

// ========== INITIALISATION ==========
function init() {
    displayProducts(currentProducts);
    loadCart();
    updateCartCount();
    
    // Écouter l'entrée recherche
    document.getElementById("searchInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") searchProducts();
    });
    
    // Formulaire newsletter
    document.getElementById("newsletterForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        showToast(`Merci pour votre inscription, ${email}! 🎉`, "success");
        this.reset();
    });
}

// ========== AFFICHAGE PRODUITS ==========
function displayProducts(productsToShow) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    
    if (productsToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-cart" style="grid-column: 1/-1;">
                <i class="fas fa-search"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez une autre recherche</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span style="color: #666;">(${product.sold} vendus)</span>
                </div>
                <div class="product-price">
                    ${product.price.toLocaleString()} FCFA
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

// Générer les étoiles
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// ========== FILTRES ==========
function filterProducts(category) {
    currentCategory = category;
    
    if (category === "all") {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(p => p.category === category);
    }
    
    // Trier si nécessaire
    if (currentSort !== "default") {
        sortProducts(currentSort);
    } else {
        displayProducts(currentProducts);
    }
    
    // Mettre à jour les classes actives
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(category === 'all' ? 'Accueil' : category)) {
            link.classList.add('active');
        }
    });
}

function searchProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    
    if (!query) {
        filterProducts(currentCategory);
        return;
    }
    
    const filtered = currentProducts.filter(product => 
        product.name.toLowerCase().includes(query)
    );
    
    displayProducts(filtered);
}

function sortProducts(sortType = null) {
    const select = document.getElementById("sortSelect");
    const sort = sortType || select.value;
    currentSort = sort;
    
    let sorted = [...currentProducts];
    
    switch(sort) {
        case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "name-asc":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            sorted = [...currentProducts];
    }
    
    displayProducts(sorted);
}

// ========== PANIER ==========
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        showToast(`Quantité augmentée : ${product.name}`, "info");
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(`${product.name} ajouté au panier ✅`, "success");
    }
    
    saveCart();
    updateCartCount();
    updateCartModal();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        const removed = cart[index];
        cart.splice(index, 1);
        showToast(`${removed.name} retiré du panier ❌`, "info");
        saveCart();
        updateCartCount();
        updateCartModal();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            updateCartModal();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = count;
}

function updateCartModal() {
    const cartContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Votre panier est vide</h3>
                <p>Ajoutez des produits pour commencer</p>
            </div>
        `;
        if (cartTotal) cartTotal.innerHTML = "";
        return;
    }
    
    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
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
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    if (cartTotal) {
        cartTotal.innerHTML = `
            <strong>Total:</strong> ${total.toLocaleString()} FCFA
        `;
    }
}

// ========== COMMANDE ==========
function openCart() {
    updateCartModal();
    document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function checkout() {
    if (cart.length === 0) {
        showToast("Votre panier est vide !", "error");
        return;
    }
    closeCart();
    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

// Formulaire de commande
document.getElementById("checkoutForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const name = document.getElementById("clientName").value;
    const phone = document.getElementById("clientPhone").value;
    const address = document.getElementById("clientAddress").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const comment = document.getElementById("clientComment").value;
    
    if (!name || !phone || !address) {
        showToast("Veuillez remplir tous les champs obligatoires", "error");
        return;
    }
    
    // Calculer le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Créer le message de commande
    let orderMessage = `🛍️ *NOUVELLE COMMANDE URBAN STORE*%0A`;
    orderMessage += `━━━━━━━━━━━━━━━━━━%0A%0A`;
    orderMessage += `👤 *Client:* ${name}%0A`;
    orderMessage += `📞 *Téléphone:* ${phone}%0A`;
    orderMessage += `📍 *Adresse:* ${address}%0A`;
    orderMessage += `💳 *Paiement:* ${paymentMethod}%0A%0A`;
    orderMessage += `📦 *DÉTAILS DE LA COMMANDE*%0A`;
    orderMessage += `─────────────────%0A`;
    
    cart.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name}%0A`;
        orderMessage += `   Quantité: ${item.quantity} x ${item.price.toLocaleString()} FCFA%0A`;
        orderMessage += `   Sous-total: ${(item.price * item.quantity).toLocaleString()} FCFA%0A%0A`;
    });
    
    orderMessage += `─────────────────%0A`;
    orderMessage += `💰 *TOTAL: ${total.toLocaleString()} FCFA*%0A`;
    orderMessage += `━━━━━━━━━━━━━━━━━━%0A%0A`;
    
    if (comment) {
        orderMessage += `💬 *Commentaire:* ${comment}%0A%0A`;
    }
    
    orderMessage += `_Merci de votre commande ! Nous vous contacterons sous 24h._ 🙏`;
    
    // WhatsApp
    const phoneNumber = "2250758167537";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${orderMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Vider le panier
    cart = [];
    saveCart();
    updateCartCount();
    updateCartModal();
    
    // Fermer modal
    closeCheckout();
    
    showToast("Commande envoyée avec succès! 🎉", "success");
    
    // Réinitialiser formulaire
    this.reset();
});

// ========== STOCKAGE LOCAL ==========
function saveCart() {
    localStorage.setItem("urbanStoreCart", JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem("urbanStoreCart");
    if (saved) {
        cart = JSON.parse(saved);
        updateCartModal();
    }
}

// ========== NOTIFICATIONS ==========
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8";
    toast.style.display = "block";
    
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// ========== FERMETURE MODALS ==========
window.onclick = function(event) {
    const cartModal = document.getElementById("cartModal");
    const checkoutModal = document.getElementById("checkoutModal");
    
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
}

function toggleUserMenu() {
    showToast("Fonctionnalité bientôt disponible! 🔧", "info");
}

// DÉMARRAGE
init();