// Variables
const video = document.createElement('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const takePhotoButton = document.getElementById('take-photo-btn');
const retakePhotoButton = document.getElementById('retake-photo-btn');
const confirmPhotoButton = document.getElementById('confirm-photo-btn');
const feedbackText = document.getElementById('feedback-text');
const photoCount = document.getElementById('photo-count');

// Compteur de photos
let count = 0;
let currentStream = null;

// Démarrer la vidéo
async function startVideo() {
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = currentStream;
        video.play();
    } catch (err) {
        console.error('Erreur d\'accès à la caméra: ', err);
    }
}

// Prendre une photo
function takePhoto() {
    const context = canvas.getContext('2d');
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);

    const imageDataUrl = canvas.toDataURL('image/png');
    photo.src = imageDataUrl;
    photo.style.display = 'block';
    
    // Afficher le feedback
    feedbackText.textContent = "La photo vous convient-elle ?";
    retakePhotoButton.style.display = 'inline-block';
    confirmPhotoButton.style.display = 'inline-block';

    // Masquer la vidéo pendant qu'on prend la photo
    video.style.display = 'none';
}

// Réessayer de prendre la photo
function retakePhoto() {
    photo.style.display = 'none';
    feedbackText.textContent = '';
    retakePhotoButton.style.display = 'none';
    confirmPhotoButton.style.display = 'none';
    video.style.display = 'block';
}

// Confirmer la photo
function confirmPhoto() {
    count += 1;
    photoCount.textContent = count;

    feedbackText.textContent = "Photo confirmée. Vous pouvez en prendre d'autres.";
    retakePhotoButton.style.display = 'none';
    confirmPhotoButton.style.display = 'none';
}

// Initialisation
startVideo();

// Événements
takePhotoButton.addEventListener('click', takePhoto);
retakePhotoButton.addEventListener('click', retakePhoto);
confirmPhotoButton.addEventListener('click', confirmPhoto);