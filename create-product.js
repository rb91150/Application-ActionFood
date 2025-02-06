// DOM Elements
const categoryButtons = document.querySelectorAll('.category-button');
const measureButtons = document.querySelectorAll('.measure-button');
const unitModal = document.getElementById('unitModal');
const unitOptions = document.querySelectorAll('.unit-option');
const cancelButton = document.querySelector('.cancel-button');
const validateButton = document.querySelector('.validate-button');
const productNameInput = document.querySelector('input[placeholder="Ex: Huile d\'olive"]');
const brandNameInput = document.querySelector('input[placeholder="Ex: BioFrance"]');
const inputGroups = document.querySelectorAll('.input-group');
const pageTitle = document.querySelector('.page-title');
const measureInputContainer = document.querySelector('.measure-input-container');
const measureInput = document.querySelector('.measure-input');
const unitSelector = document.querySelector('.unit-selector');

// State
let selectedCategory = localStorage.getItem('selectedCategory') || 'autres';
let selectedMeasure = '';
let selectedUnit = 'g';
let hasAttemptedSubmit = false;

// Functions
function updatePageTitle(category) {
    if (category === 'all') {
        pageTitle.textContent = 'Créez le produit';
        return;
    }

    let categoryName = '';
    switch(category) {
        case 'frais':
            categoryName = 'Frais';
            break;
        case 'surgele':
            categoryName = 'Surgelé';
            break;
        case 'sec':
            categoryName = 'Sec';
            break;
        case 'autres':
            categoryName = 'Autres';
            break;
        case 'recette':
            categoryName = 'Recette';
            break;
        default:
            categoryName = 'Autres';
    }
    pageTitle.textContent = `Créez le produit - ${categoryName}`;
}

function showUnitModal(measure) {
    unitModal.classList.add('active');
    if (measure === 'weight') {
        unitOptions[0].textContent = 'g';
        unitOptions[1].textContent = 'Kg';
    } else {
        unitOptions[0].textContent = 'L';
        unitOptions[1].textContent = 'mL';
    }
}

function hideUnitModal() {
    unitModal.classList.remove('active');
}

function validateField(input) {
    if (!hasAttemptedSubmit) return true;
    
    const isValid = input.value.trim() !== '';
    const inputGroup = input.parentElement;
    
    if (!isValid) {
        inputGroup.classList.add('error');
    } else {
        inputGroup.classList.remove('error');
    }
    
    return isValid;
}

function validateForm() {
    hasAttemptedSubmit = true;
    
    const isProductNameValid = validateField(productNameInput);
    const isBrandNameValid = validateField(brandNameInput);

    return isProductNameValid && isBrandNameValid;
}

function resetValidation(input) {
    if (hasAttemptedSubmit) {
        validateField(input);
    }
}

function updateMeasureInput(measure) {
    measureInputContainer.style.display = measure ? 'block' : 'none';
    if (measure === 'weight') {
        unitSelector.textContent = 'g';
        selectedUnit = 'g';
    } else if (measure === 'volume') {
        unitSelector.textContent = 'L';
        selectedUnit = 'L';
    }
}

function initializeCategory() {
    const categoryToSelect = selectedCategory;
    const button = document.querySelector(`[data-category="${categoryToSelect}"]`);
    if (button) {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updatePageTitle(categoryToSelect);
    }
}

function addNewProduct(productData) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newProduct = {
        ...productData,
        id: products.length + 1,
        unit: `${productData.value || ''}${productData.unit || ''}`
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
}

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCategory = button.dataset.category;
        updatePageTitle(selectedCategory);
    });
});

measureButtons.forEach(button => {
    button.addEventListener('click', () => {
        measureButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedMeasure = button.dataset.measure;
        updateMeasureInput(selectedMeasure);
    });
});

unitSelector.addEventListener('click', () => {
    showUnitModal(selectedMeasure);
});

unitOptions.forEach(option => {
    option.addEventListener('click', () => {
        unitOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedUnit = option.textContent;
        unitSelector.textContent = selectedUnit;
        hideUnitModal();
    });
});

productNameInput.addEventListener('input', () => resetValidation(productNameInput));
brandNameInput.addEventListener('input', () => resetValidation(brandNameInput));

cancelButton.addEventListener('click', () => {
    window.location.href = 'selection.html';
});

validateButton.addEventListener('click', () => {
    if (validateForm()) {
        const productData = {
            name: productNameInput.value.trim(),
            brand: brandNameInput.value.trim(),
            category: selectedCategory,
            measure: selectedMeasure,
            unit: selectedUnit,
            value: measureInput.value
        };
        
        // Add the new product to the products list
        addNewProduct(productData);
        
        // Store the current product data for the consumption page
        localStorage.setItem('selectedProduct', JSON.stringify(productData));
        
        // Navigate to consumption page
        window.location.href = 'consumption.html';
    }
});

document.addEventListener('click', (e) => {
    if (e.target === unitModal) {
        hideUnitModal();
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    inputGroups.forEach(group => group.classList.remove('error'));
    initializeCategory();
    updateMeasureInput(selectedMeasure);
});