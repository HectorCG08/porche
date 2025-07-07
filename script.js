// Variables globales
let currentUser = null;
let userCart = [];

// Función para verificar si el usuario está autenticado
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        currentUser = user;
        return true;
    }
    return false;
}

// Función para redirigir según el tipo de usuario
function redirectUser() {
    if (currentUser && currentUser.type === 'admin') {
        window.location.href = 'admin.html';
    } else if (currentUser && currentUser.type === 'user') {
        window.location.href = 'usuario.html';
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userCart');
    window.location.href = 'index.html';
}

// ===== LOGIN PAGE =====
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('error-message');

        // Verificar si ya hay sesión activa
        if (checkAuth()) {
            redirectUser();
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
                // Login como administrador
                currentUser = { email, type: 'admin' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'admin.html';
            } else if (email && password) {
                // Login como usuario
                currentUser = { email, type: 'user' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'usuario.html';
            } else {
                errorMessage.textContent = 'Por favor completa todos los campos';
            }
        });
    });
}

// ===== ADMIN PAGE =====
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar autenticación
        if (!checkAuth() || currentUser.type !== 'admin') {
            window.location.href = 'index.html';
            return;
        }

        // Configurar logout
        document.getElementById('logoutBtn').addEventListener('click', logout);

        // Cargar datos del administrador
        loadAdminData();
    });

    function loadAdminData() {
        const sales = JSON.parse(localStorage.getItem('porscheSales')) || [];
        const inventory = JSON.parse(localStorage.getItem('porscheInventory')) || porscheData;

        // Actualizar estadísticas
        updateAdminStats(sales);
        
        // Cargar tabla de ventas
        loadSalesTable(sales);
        
        // Cargar inventario
        loadInventoryGrid(inventory);
    }

    function updateAdminStats(sales) {
        const totalSales = sales.reduce((sum, sale) => sum + sale.price, 0);
        const totalCars = sales.length;
        const uniqueCustomers = new Set(sales.map(sale => sale.customer)).size;

        document.getElementById('totalSales').textContent = formatPrice(totalSales);
        document.getElementById('totalCars').textContent = totalCars;
        document.getElementById('totalCustomers').textContent = uniqueCustomers;
    }

    function loadSalesTable(sales) {
        const tbody = document.getElementById('salesTableBody');
        tbody.innerHTML = '';

        if (sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No hay ventas registradas</td></tr>';
            return;
        }

        sales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.customer}</td>
                <td>${sale.carName}</td>
                <td>${formatPrice(sale.price)}</td>
                <td>${sale.date}</td>
                <td><span class="status completed">Completada</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadInventoryGrid(inventory) {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';

        inventory.forEach(car => {
            const card = document.createElement('div');
            card.className = 'inventory-card';
            card.innerHTML = `
                <img src="${car.image}" alt="${car.name}">
                <div class="inventory-info">
                    <h3>${car.name}</h3>
                    <p class="price">${formatPrice(car.price)}</p>
                    <p class="status ${car.available ? 'available' : 'sold'}">
                        ${car.available ? 'Disponible' : 'Vendido'}
                    </p>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// ===== USER PAGE =====
if (window.location.pathname.includes('usuario.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar autenticación
        if (!checkAuth() || currentUser.type !== 'user') {
            window.location.href = 'index.html';
            return;
        }

        // Configurar logout
        document.getElementById('logoutBtn').addEventListener('click', logout);
        
        // Mostrar email del usuario
        document.getElementById('userEmail').textContent = currentUser.email;

        // Cargar datos del usuario
        loadUserData();
    });

    function loadUserData() {
        const inventory = JSON.parse(localStorage.getItem('porscheInventory')) || porscheData;
        userCart = JSON.parse(localStorage.getItem('userCart')) || [];

        // Cargar catálogo
        loadCarsGrid(inventory);
        
        // Cargar carrito
        loadCart();
    }

    function loadCarsGrid(inventory) {
        const grid = document.getElementById('carsGrid');
        grid.innerHTML = '';

        inventory.forEach(car => {
            if (car.available) {
                const card = document.createElement('div');
                card.className = 'car-card';
                card.innerHTML = `
                    <img src="${car.image}" alt="${car.name}">
                    <div class="car-info">
                        <h3>${car.name}</h3>
                        <p class="description">${car.description}</p>
                        <div class="specs">
                            <span><strong>Motor:</strong> ${car.specs.engine}</span>
                            <span><strong>Potencia:</strong> ${car.specs.power}</span>
                            <span><strong>Aceleración:</strong> ${car.specs.acceleration}</span>
                        </div>
                        <div class="car-footer">
                            <span class="price">${formatPrice(car.price)}</span>
                            <button class="add-to-cart-btn" onclick="addToCart(${car.id})">
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            }
        });
    }

    function loadCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (userCart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            cartTotal.textContent = '$0';
            checkoutBtn.disabled = true;
            return;
        }

        cartItems.innerHTML = '';
        let total = 0;

        userCart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
            `;
            cartItems.appendChild(cartItem);
            total += item.price;
        });

        cartTotal.textContent = formatPrice(total);
        checkoutBtn.disabled = false;
    }
}

// ===== FUNCIONES DEL CARRITO =====
function addToCart(carId) {
    const inventory = JSON.parse(localStorage.getItem('porscheInventory')) || porscheData;
    const car = inventory.find(c => c.id === carId);
    
    if (car && car.available) {
        userCart.push({
            id: car.id,
            name: car.name,
            price: car.price
        });
        
        localStorage.setItem('userCart', JSON.stringify(userCart));
        loadCart();
        
        // Mostrar notificación
        showNotification(`${car.name} agregado al carrito`);
    }
}

function removeFromCart(carId) {
    userCart = userCart.filter(item => item.id !== carId);
    localStorage.setItem('userCart', JSON.stringify(userCart));
    loadCart();
}

// ===== CHECKOUT =====
if (window.location.pathname.includes('usuario.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (userCart.length > 0) {
                showPurchaseModal();
            }
        });

        // Configurar modal de compra
        document.getElementById('confirmPurchase').addEventListener('click', confirmPurchase);
        document.getElementById('cancelPurchase').addEventListener('click', function() {
            document.getElementById('purchaseModal').style.display = 'none';
        });
    });
}

function showPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    const details = document.getElementById('purchaseDetails');
    const total = userCart.reduce((sum, item) => sum + item.price, 0);

    details.innerHTML = `
        <p><strong>Cliente:</strong> ${currentUser.email}</p>
        <p><strong>Total:</strong> ${formatPrice(total)}</p>
        <div class="purchase-items">
            ${userCart.map(item => `
                <div class="purchase-item">
                    <span>${item.name}</span>
                    <span>${formatPrice(item.price)}</span>
                </div>
            `).join('')}
        </div>
    `;

    modal.style.display = 'flex';
}

function confirmPurchase() {
    const sales = JSON.parse(localStorage.getItem('porscheSales')) || [];
    const inventory = JSON.parse(localStorage.getItem('porscheInventory')) || porscheData;

    // Registrar cada compra
    userCart.forEach(item => {
        const sale = {
            id: Date.now() + Math.random(),
            customer: currentUser.email,
            carName: item.name,
            price: item.price,
            date: getCurrentDate(),
            status: 'completed'
        };
        sales.push(sale);

        // Marcar auto como vendido
        const carIndex = inventory.findIndex(c => c.id === item.id);
        if (carIndex !== -1) {
            inventory[carIndex].available = false;
        }
    });

    // Guardar en localStorage
    localStorage.setItem('porscheSales', JSON.stringify(sales));
    localStorage.setItem('porscheInventory', JSON.stringify(inventory));
    localStorage.setItem('userCart', JSON.stringify([]));

    // Limpiar carrito
    userCart = [];
    loadCart();

    // Cerrar modal
    document.getElementById('purchaseModal').style.display = 'none';

    // Mostrar confirmación
    showNotification('¡Compra realizada con éxito!');
}

// ===== FUNCIONES AUXILIARES =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 