// Datos de los Porsches
const porscheData = [
    {
        id: 1,
        name: "911 Carrera S",
        price: 125000,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "El legendario deportivo de Porsche con 450 caballos de fuerza",
        specs: {
            engine: "3.0L Twin-Turbo",
            power: "450 HP",
            acceleration: "3.3s 0-100 km/h",
            topSpeed: "308 km/h"
        },
        available: true
    },
    {
        id: 2,
        name: "Cayenne Turbo",
        price: 135000,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "SUV de lujo con rendimiento deportivo excepcional",
        specs: {
            engine: "4.0L V8 Twin-Turbo",
            power: "550 HP",
            acceleration: "3.7s 0-100 km/h",
            topSpeed: "286 km/h"
        },
        available: true
    },
    {
        id: 3,
        name: "Macan GTS",
        price: 85000,
        image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "SUV compacto con alma deportiva",
        specs: {
            engine: "2.9L V6 Twin-Turbo",
            power: "380 HP",
            acceleration: "4.3s 0-100 km/h",
            topSpeed: "272 km/h"
        },
        available: true
    },
    {
        id: 4,
        name: "Panamera 4S",
        price: 110000,
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Sedán deportivo de lujo con cuatro puertas",
        specs: {
            engine: "2.9L V6 Twin-Turbo",
            power: "440 HP",
            acceleration: "4.1s 0-100 km/h",
            topSpeed: "289 km/h"
        },
        available: true
    },
    {
        id: 5,
        name: "Taycan Turbo S",
        price: 185000,
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "El primer Porsche 100% eléctrico de alto rendimiento",
        specs: {
            engine: "Dual Electric Motors",
            power: "750 HP",
            acceleration: "2.6s 0-100 km/h",
            topSpeed: "260 km/h"
        },
        available: true
    },
    {
        id: 6,
        name: "Boxster GTS",
        price: 95000,
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Roadster deportivo con techo convertible",
        specs: {
            engine: "4.0L Flat-6",
            power: "400 HP",
            acceleration: "4.0s 0-100 km/h",
            topSpeed: "293 km/h"
        },
        available: true
    },
    {
        id: 7,
        name: "Cayman GT4",
        price: 105000,
        image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Coupé deportivo de alto rendimiento",
        specs: {
            engine: "4.0L Flat-6",
            power: "420 HP",
            acceleration: "4.2s 0-100 km/h",
            topSpeed: "304 km/h"
        },
        available: true
    }
];

// Configuración del administrador
const ADMIN_CONFIG = {
    email: "admin@admin.com",
    password: "admin123"
};

// Inicializar localStorage si no existe
function initializeLocalStorage() {
    if (!localStorage.getItem('porscheSales')) {
        localStorage.setItem('porscheSales', JSON.stringify([]));
    }
    if (!localStorage.getItem('porscheInventory')) {
        localStorage.setItem('porscheInventory', JSON.stringify(porscheData));
    }
    if (!localStorage.getItem('userCart')) {
        localStorage.setItem('userCart', JSON.stringify([]));
    }
}

// Función para formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Función para obtener fecha actual formateada
function getCurrentDate() {
    return new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', initializeLocalStorage); 