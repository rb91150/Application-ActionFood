// DOM Elements
const productNameElement = document.querySelector('.product-name');
const quantityValue = document.querySelector('.quantity-value');
const decreaseButton = document.querySelector('.decrease');
const increaseButton = document.querySelector('.increase');
const cameraContainer = document.querySelector('.camera-container');
const camera = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const photoPreview = document.querySelector('.photo-preview');
const capturedImage = document.getElementById('captured-image');
const startCameraButton = document.getElementById('start-camera');
const activeCameraControls = document.querySelector('.active-camera-controls');
const flipCameraButton = document.getElementById('flip-camera');
const takePhotoButton = document.getElementById('take-photo');
const replacePhotoButton = document.querySelector('.replace-photo-button');
const dlcInput = document.getElementById('dlc');
const lotNumberInput = document.getElementById('lot-number');
const cancelButton = document.querySelector('.cancel-button');
const continueButton = document.querySelector('.continue-button');

// State
let quantity = 1;
let selectedProduct = null;
let stream = null;
let facingMode = 'environment';
let isCameraActive = false;
let capturedImageData = null;

// Functions
async function compressImage(dataUrl, maxWidth = 800) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = dataUrl;
    });
}

async function initCamera() {
    try {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        camera.srcObject = stream;
        
        cameraContainer.style.display = 'block';
        photoPreview.style.display = 'none';
        startCameraButton.style.display = 'none';
        activeCameraControls.style.display = 'flex';
        
        isCameraActive = true;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    camera.srcObject = null;
    cameraContainer.style.display = 'none';
    startCameraButton.style.display = 'block';
    activeCameraControls.style.display = 'none';
    isCameraActive = false;
}

async function flipCamera() {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    await initCamera();
}

async function takePhoto() {
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(camera, 0, 0, canvas.width, canvas.height);
    
    const rawImageData = canvas.toDataURL('image/jpeg', 0.8);
    capturedImageData = await compressImage(rawImageData);
    
    capturedImage.src = capturedImageData;
    photoPreview.style.display = 'block';
    
    stopCamera();
}

function loadSelectedProduct() {
    const productData = localStorage.getItem('selectedProduct');
    if (productData) {
        selectedProduct = JSON.parse(productData);
        productNameElement.textContent = `${selectedProduct.name} - ${selectedProduct.brand}`;
    }
}

function updateQuantity(increment) {
    quantity = Math.max(1, quantity + increment);
    quantityValue.textContent = quantity;
}

async function saveAndContinue() {
    try {
        let consumptions = [];
        try {
            consumptions = JSON.parse(localStorage.getItem('consumptions') || '[]');
        } catch (e) {
            console.error('Error parsing consumptions:', e);
            consumptions = [];
        }
        
        const consumptionData = {
            product: selectedProduct,
            quantity,
            dlc: dlcInput.value,
            lotNumber: lotNumberInput.value,
            photo: capturedImageData,
            timestamp: new Date().toISOString()
        };
        
        let saved = false;
        let retries = 3;
        
        while (!saved && retries > 0) {
            try {
                consumptions.push(consumptionData);
                localStorage.setItem('consumptions', JSON.stringify(consumptions));
                saved = true;
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    if (capturedImageData) {
                        capturedImageData = await compressImage(capturedImageData, 400);
                        consumptionData.photo = capturedImageData;
                    }
                    retries--;
                } else {
                    throw error;
                }
            }
        }
        
        if (!saved) {
            throw new Error('Impossible de sauvegarder l\'image même après compression');
        }
        
        stopCamera();
        window.location.href = 'selection.html';
        
    } catch (error) {
        console.error('Error saving consumption:', error);
        alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer avec une photo de plus petite taille.');
    }
}

// Event Listeners
decreaseButton.addEventListener('click', () => updateQuantity(-1));
increaseButton.addEventListener('click', () => updateQuantity(1));
startCameraButton.addEventListener('click', initCamera);
flipCameraButton.addEventListener('click', flipCamera);
takePhotoButton.addEventListener('click', takePhoto);
replacePhotoButton.addEventListener('click', initCamera);
cancelButton.addEventListener('click', () => {
    stopCamera();
    window.history.back();
});
continueButton.addEventListener('click', saveAndContinue);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedProduct();
});