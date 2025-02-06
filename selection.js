// DOM Elements
const searchInput = document.querySelector('.search-input');
const categoryButtons = document.querySelectorAll('.category-button');
const productList = document.querySelector('.product-list');
const addButton = document.getElementById('addButton');
const scanButton = document.getElementById('scanButton');
const printButton = document.querySelector('.print-button');
const finishButton = document.querySelector('.finish-button');

// Get products from localStorage or use default products
function getProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        return JSON.parse(storedProducts);
    }
    
    // Default products if none in storage
    const defaultProducts = [
        { id: 1, name: 'BEURRE AOP', brand: 'Normandie', category: 'frais', unit: '250g', usage: 'Utilisé: 2' },
        { id: 2, name: 'FF', brand: 'Fr', category: 'surgele', unit: '500g' },
        { id: 3, name: 'FX', brand: 'Xx', category: 'sec', unit: '3g', usage: 'Utilisé: 5' },
        { id: 4, name: 'HG', brand: 'Jh', category: 'autres', unit: '400g' },
        { id: 5, name: 'HUILE D\'OLIVE', brand: 'Vierge Extra', category: 'sec', unit: '1L' }
    ];
    
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return defaultProducts;
}

let products = getProducts();

// Functions
function renderProducts(filteredProducts = products) {
    productList.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-name">${product.name} - ${product.brand}</div>
            ${product.unit ? `<div class="product-brand">${product.unit}</div>` : ''}
            ${product.usage ? `<div class="product-usage">${product.usage}</div>` : ''}
        </div>
    `).join('');

    // Add click listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const product = products.find(p => p.id === parseInt(card.dataset.id));
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'consumption.html';
        });
    });
}

function filterProducts(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    renderProducts(filtered);
}

function searchProducts(query) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filtered);
}

// Event Listeners
searchInput.addEventListener('input', (e) => searchProducts(e.target.value));

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProducts(button.dataset.category);
    });
});

addButton.addEventListener('click', () => {
    const activeCategory = document.querySelector('.category-button.active');
    const selectedCategory = activeCategory ? activeCategory.dataset.category : 'autres';
    localStorage.setItem('selectedCategory', selectedCategory);
    window.location.href = 'create-product.html';
});

scanButton.addEventListener('click', () => {
    alert('Le scan du code-barres a échoué');
});

printButton.addEventListener('click', () => {
    alert('Impression en cours...');
    window.location.href = 'index.html';
});

finishButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Initialize products list
renderProducts();