class CameraManager {
    constructor() {
        this.photos = [];
        this.stream = null;
        this.facingMode = 'environment';
    }

    async startCamera() {
        try {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.facingMode }
            });

            const cameraContainer = document.getElementById('cameraContainer');
            cameraContainer.innerHTML = `
                <div class="camera-view">
                    <video id="camera" autoplay playsinline></video>
                    <div class="camera-frame"></div>
                    <div class="camera-controls">
                        <button class="control-button" id="switchCamera">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <path d="M17 1l4 4-4 4"/>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                                <path d="M7 23l-4-4 4-4"/>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                            </svg>
                        </button>
                        <button class="control-button capture" id="capturePhoto">
                            <div class="capture-inner"></div>
                        </button>
                        <button class="control-button" id="closeCamera">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <path d="M18 6L6 18"/>
                                <path d="M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            const video = document.getElementById('camera');
            video.srcObject = stream;
            this.stream = stream;

            // Event listeners
            document.getElementById('switchCamera').onclick = () => this.switchCamera();
            document.getElementById('capturePhoto').onclick = () => this.takePhoto();
            document.getElementById('closeCamera').onclick = () => this.stopCamera();

        } catch (err) {
            console.error('Erreur lors de l\'accès à la caméra:', err);
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        const cameraContainer = document.getElementById('cameraContainer');
        cameraContainer.innerHTML = `
            <button class="camera-button" id="openCameraButton">
                <div class="camera-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4096FF" stroke-width="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <div class="plus-icon">+</div>
                </div>
            </button>
        `;

        document.getElementById('openCameraButton').onclick = () => this.startCamera();
    }

    switchCamera() {
        this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
        this.startCamera();
    }

    takePhoto() {
        const video = document.getElementById('camera');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            if (this.facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0);
            const photoUrl = canvas.toDataURL('image/jpeg');
            this.photos.push(photoUrl);
            this.updatePhotoCount();
            this.updatePhotosGrid();
            this.stopCamera();
        }
    }

    updatePhotoCount() {
        const photoCount = document.getElementById('photoCount');
        photoCount.textContent = `Nombre de photos : ${this.photos.length}`;
    }

    updatePhotosGrid() {
        const photosGrid = document.getElementById('photosGrid');
        photosGrid.innerHTML = this.photos.map((photo, index) => `
            <div class="photo-item">
                <img src="${photo}" alt="Photo ${index + 1}">
            </div>
        `).join('');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const cameraManager = new CameraManager();
    
    // Event listeners
    document.getElementById('openCameraButton').onclick = () => cameraManager.startCamera();
    document.querySelector('.back-button').onclick = () => window.location.href = 'App.html';
    document.querySelector('.validate-button').onclick = () => {
        if (cameraManager.photos.length === 0) {
            alert('Veuillez prendre au moins une photo');
            return;
        }
        window.location.href = 'App.html';
    };

    // Date et heure
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const dateDisplay = document.getElementById('dateDisplay');
    const timeDisplay = document.getElementById('timeDisplay');

    dateInput.onchange = (e) => {
        const date = new Date(e.target.value);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        dateDisplay.textContent = date.toLocaleDateString('fr-FR', options);
    };

    timeInput.onchange = (e) => {
        timeDisplay.textContent = e.target.value;
    };
});
