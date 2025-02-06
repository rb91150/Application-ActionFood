// État de l'application
let state = {
    currentPage: 'main',
    currentZone: null,
    isModifying: false,
    currentPostId: null,
    stream: null,
    zones: [
        {
            id: 'a',
            name: 'A - Cuisine Quotidien',
            completed: false,
            posts: [
                { id: 'a1', name: 'Inox', checked: false, comments: '', photos: [] },
                { id: 'a2', name: 'Matériel de cuisson', checked: false, comments: '', photos: [] },
                { id: 'a3', name: 'Plan de travail', checked: false, comments: '', photos: [] }
            ]
        },
        {
            id: 'b',
            name: 'B - Cuisine Hebdo',
            completed: false,
            posts: [
                { id: 'b1', name: 'Étagères', checked: false, comments: '', photos: [] },
                { id: 'b2', name: 'Frigos', checked: false, comments: '', photos: [] }
            ]
        }
    ]
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Définir la date et l'heure actuelles
    const now = new Date();
    const dateInput = document.getElementById('cleaning-date');
    const timeInput = document.getElementById('cleaning-time');
    
    if (dateInput) dateInput.value = now.toISOString().split('T')[0];
    if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);

    // Charger l'état sauvegardé s'il existe
    const savedState = localStorage.getItem('cleaningAppState');
    if (savedState) {
        state = JSON.parse(savedState);
    }

    setupEventListeners();
    renderPage();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Toggle de modification
    const toggle = document.querySelector('.toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            state.isModifying = !state.isModifying;
            toggle.classList.toggle('active');
            renderPage();
        });
    }

    // Bouton retour
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // Bouton d'ajout de zone
    const addZoneButton = document.querySelector('.add-zone');
    if (addZoneButton) {
        addZoneButton.addEventListener('click', () => {
            const modal = document.querySelector('.zone-modal');
            if (modal) modal.style.display = 'flex';
        });
    }

    // Gestion des modales
    const zoneModal = document.querySelector('.zone-modal');
    const postModal = document.querySelector('.post-modal');

    if (zoneModal) {
        const cancelBtn = zoneModal.querySelector('.cancel');
        const saveBtn = zoneModal.querySelector('.save');
        const input = zoneModal.querySelector('input');

        cancelBtn?.addEventListener('click', () => {
            zoneModal.style.display = 'none';
            if (input) input.value = '';
        });

        saveBtn?.addEventListener('click', () => {
            if (input && input.value.trim()) {
                const newZone = {
                    id: Date.now().toString(),
                    name: input.value.trim(),
                    completed: false,
                    posts: []
                };
                state.zones.push(newZone);
                saveState();
                renderPage();
                zoneModal.style.display = 'none';
                input.value = '';
            }
        });
    }

    if (postModal) {
        const cancelBtn = postModal.querySelector('.cancel');
        const saveBtn = postModal.querySelector('.save');
        const input = postModal.querySelector('input');

        cancelBtn?.addEventListener('click', () => {
            postModal.style.display = 'none';
            if (input) input.value = '';
        });

        saveBtn?.addEventListener('click', () => {
            if (input && input.value.trim() && state.currentZone) {
                const newPost = {
                    id: Date.now().toString(),
                    name: input.value.trim(),
                    checked: false,
                    comments: '',
                    photos: []
                };
                state.currentZone.posts.push(newPost);
                saveState();
                renderPage();
                postModal.style.display = 'none';
                input.value = '';
            }
        });
    }

    // Bouton terminer
    const finishButton = document.querySelector('.finish-button');
    if (finishButton) {
        finishButton.addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment terminer le nettoyage ?')) {
                resetApp();
            }
        });
    }
}

// Gestion de la caméra
async function openCamera(postId) {
    state.currentPostId = postId;
    const cameraModal = document.querySelector('.camera-modal');
    const video = document.getElementById('camera-preview');

    try {
        state.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });

        video.srcObject = state.stream;
        cameraModal.style.display = 'flex';
    } catch (error) {
        console.error('Erreur lors de l\'accès à la caméra:', error);
        alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
}

function closeCamera() {
    const cameraModal = document.querySelector('.camera-modal');
    const video = document.getElementById('camera-preview');

    if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
        state.stream = null;
    }

    video.srcObject = null;
    cameraModal.style.display = 'none';
    state.currentPostId = null;
}

function capturePhoto() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('photo-canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoUrl = canvas.toDataURL('image/jpeg');

    if (state.currentPostId && state.currentZone) {
        state.zones = state.zones.map(zone => {
            if (zone.id === state.currentZone.id) {
                return {
                    ...zone,
                    posts: zone.posts.map(post => {
                        if (post.id === state.currentPostId) {
                            return {
                                ...post,
                                photos: [...post.photos, photoUrl]
                            };
                        }
                        return post;
                    })
                };
            }
            return zone;
        });

        state.currentZone = state.zones.find(z => z.id === state.currentZone.id) || null;
        saveState();
        renderPage();
    }

    closeCamera();
}

// Fonction pour revenir en arrière
function goBack() {
    if (state.currentZone) {
        const hasCheckedPosts = state.currentZone.posts.some(post => post.checked);
        
        state.zones = state.zones.map(zone => {
            if (zone.id === state.currentZone.id) {
                return {
                    ...zone,
                    completed: hasCheckedPosts
                };
            }
            return zone;
        });
    }
    
    state.currentPage = 'main';
    state.currentZone = null;
    saveState();
    renderPage();
}

// Fonction pour réinitialiser l'application
function resetApp() {
    state = {
        currentPage: 'main',
        currentZone: null,
        isModifying: false,
        zones: state.zones.map(zone => ({
            ...zone,
            completed: false,
            posts: zone.posts.map(post => ({ ...post, checked: false, comments: '', photos: [] }))
        }))
    };
    saveState();
    renderPage();
}

// Sauvegarder l'état dans le localStorage
function saveState() {
    localStorage.setItem('cleaningAppState', JSON.stringify(state));
}

// Fonction pour afficher une zone
function showZone(zoneId) {
    if (state.isModifying) return;
    
    const zone = state.zones.find(z => z.id === zoneId);
    if (zone) {
        state.currentZone = zone;
        state.currentPage = 'zone';
        saveState();
        renderPage();
    }
}

// Fonction pour gérer la case à cocher d'un poste
function handlePostCheck(postId) {
    if (!state.currentZone) return;

    state.zones = state.zones.map(zone => {
        if (zone.id === state.currentZone.id) {
            const updatedPosts = zone.posts.map(post => {
                if (post.id === postId) {
                    return { ...post, checked: !post.checked };
                }
                return post;
            });
            const hasCheckedPosts = updatedPosts.some(post => post.checked);
            return {
                ...zone,
                posts: updatedPosts,
                completed: hasCheckedPosts
            };
        }
        return zone;
    });

    state.currentZone = state.zones.find(z => z.id === state.currentZone.id) || null;
    saveState();
    renderPage();
}

// Fonction pour ajouter un commentaire
function handleAddComment(postId) {
    if (!state.currentZone) return;
    const post = state.currentZone.posts.find(p => p.id === postId);
    if (!post) return;

    const comment = prompt('Ajouter un commentaire:', post.comments);
    if (comment === null) return;

    state.zones = state.zones.map(zone => {
        if (zone.id === state.currentZone.id) {
            return {
                ...zone,
                posts: zone.posts.map(p => {
                    if (p.id === postId) {
                        return { ...p, comments: comment };
                    }
                    return p;
                })
            };
        }
        return zone;
    });

    state.currentZone = state.zones.find(z => z.id === state.currentZone.id) || null;
    saveState();
    renderPage();
}

// Fonctions de rendu
function renderPage() {
    const backButton = document.querySelector('.back-button');
    const titleElement = document.querySelector('.title');
    const mainContent = document.getElementById('main-content');
    const finishButton = document.querySelector('.finish-button');

    if (state.currentPage === 'main') {
        if (backButton) backButton.style.display = 'none';
        if (titleElement) titleElement.textContent = 'Plan de nettoyage';
        renderMainPage();
    } else {
        if (backButton) backButton.style.display = 'block';
        if (titleElement && state.currentZone) {
            titleElement.textContent = state.currentZone.name;
        }
        renderZonePage();
    }

    // Mettre à jour le bouton Terminer
    if (finishButton) {
        const anyZoneCompleted = state.zones.some(zone => zone.completed);
        finishButton.disabled = !anyZoneCompleted;
    }
}

// Fonction pour rendre la page principale
function renderMainPage() {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = `
        <div class="action-date">
            <h2>
                Date de l'action de nettoyage
                <span class="help-icon">?</span>
            </h2>
            <div class="date-time-section">
                <div class="date">
                    <span class="icon">📅</span>
                    <label>Date</label>
                    <input type="date" id="cleaning-date">
                </div>
                <div class="time">
                    <span class="icon">⏰</span>
                    <label>Heure</label>
                    <input type="time" id="cleaning-time">
                </div>
            </div>
        </div>

        <div class="zone-list">
            <div class="zone-header">
                <h2>Liste des zones à nettoyer</h2>
                <div class="toggle-container">
                    <span class="toggle-label">Modifier</span>
                    <div class="toggle ${state.isModifying ? 'active' : ''}">
                        <div class="toggle-handle"></div>
                    </div>
                </div>
            </div>

            <div class="zones">
                ${state.zones.map(zone => `
                    <div class="zone-item" onclick="showZone('${zone.id}')">
                        <div class="zone-header">
                            <div class="zone-name">
                                ${zone.name}
                                ${zone.completed ? '<span class="zone-check">✓</span>' : ''}
                            </div>
                            ${state.isModifying ? `
                                <div class="zone-actions">
                                    <button onclick="event.stopPropagation(); editZone('${zone.id}')">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                                        </svg>
                                    </button>
                                    <button onclick="event.stopPropagation(); deleteZone('${zone.id}')">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            <button class="add-zone">
                <span>+</span>
                <span>Ajouter une zone de nettoyage</span>
            </button>
        </div>
    `;

    // Réattacher les écouteurs d'événements après le rendu
    setupEventListeners();
}

// Fonction pour rendre la page d'une zone
function renderZonePage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent || !state.currentZone) return;

    mainContent.innerHTML = `
        <div class="posts-list">
            ${state.currentZone.posts.map(post => `
                <div class="post-item ${post.checked ? 'checked' : ''}">
                    <div class="post-header">
                        <label class="post-checkbox">
                            <input type="checkbox" ${post.checked ? 'checked' : ''} 
                                   onchange="handlePostCheck('${post.id}')">
                            <span class="post-name">${post.name}</span>
                        </label>
                        ${post.checked ? `
                            <div class="post-actions">
                                <button onclick="openCamera('${post.id}')">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                        <circle cx="12" cy="13" r="4"/>
                                    </svg>
                                </button>
                                <button onclick="handleAddComment('${post.id}')">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    ${post.comments ? `
                        <div class="post-comment">${post.comments}</div>
                    ` : ''}
                    ${post.photos.length > 0 ? `
                        <div class="post-photos">
                            ${post.photos.map(photo => `
                                <img src="${photo}" alt="Photo" class="post-photo">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}