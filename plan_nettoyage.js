// État initial de l'application
let state = {
    currentPage: 'main',
    currentZone: null,
    zones: [
        {
            id: 'a',
            name: 'A - Cuisine Quotidien',
            completed: false,
            posts: [
                { id: 'a1', name: 'Inox', checked: false, comments: '', photos: [] },
                { id: 'a2', name: 'Matériel de cuisson', checked: false, comments: '', photos: [] },
                { id: 'a3', name: 'Plan de travail', checked: false, comments: '', photos: [] },
                { id: 'a4', name: 'Poignées des portes', checked: false, comments: '', photos: [] },
                { id: 'a5', name: 'Sols', checked: false, comments: '', photos: [] }
            ]
        },
        {
            id: 'b',
            name: 'B - Cuisine Hebdo',
            completed: false,
            posts: [
                { id: 'b1', name: 'Étagères cuisine', checked: false, comments: '', photos: [] },
                { id: 'b2', name: 'Intérieur des frigos', checked: false, comments: '', photos: [] },
                { id: 'b3', name: 'Nettoyage des hottes', checked: false, comments: '', photos: [] }
            ]
        },
        {
            id: 'c',
            name: 'C - Zone de Stockage',
            completed: false,
            posts: [
                { id: 'c1', name: 'Dégivrage Congel', checked: false, comments: '', photos: [] },
                { id: 'c2', name: 'Intérieur chambre froide', checked: false, comments: '', photos: [] },
                { id: 'c3', name: 'Intérieur des frigos', checked: false, comments: '', photos: [] }
            ]
        }
    ]
};

// Sauvegarder l'état dans le localStorage
function saveState() {
    localStorage.setItem('cleaningAppState', JSON.stringify(state));
}

// Charger l'état depuis le localStorage
function loadState() {
    const savedState = localStorage.getItem('cleaningAppState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
}

// Rendu de la page principale
function renderMainPage() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const zonesList = state.zones.map(zone => `
        <div class="zone-item" data-id="${zone.id}">
            <div class="zone-header">
                <span class="zone-name">${zone.name}</span>
                ${zone.completed ? '<span class="zone-check">✓</span>' : ''}
            </div>
        </div>
    `).join('');

    main.innerHTML = `
        <div class="action-date">
            <h2>
                Date de l'action de nettoyage
                <span class="help-icon">?</span>
            </h2>
            <div class="date-time-section">
                <div class="date">
                    <span class="icon">📅</span>
                    <input type="date" id="cleaning-date">
                </div>
                <div class="time">
                    <span class="icon">⏰</span>
                    <input type="time" id="cleaning-time">
                </div>
            </div>
        </div>
        <div class="zone-list">
            <div class="zone-header">
                <h2>Liste des zones à nettoyer</h2>
            </div>
            <div class="zones">
                ${zonesList}
            </div>
        </div>
    `;

    // Mettre à jour le titre et afficher le bouton retour
    document.querySelector('.title').textContent = 'Plan de nettoyage';
    document.querySelector('.back-button').style.display = 'block';
    
    // Configuration du bouton retour pour la page principale
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.onclick = () => window.location.href = 'index.html';
    }

    setupZoneItems();
}

// Rendu de la page de zone
function renderZonePage() {
    const main = document.getElementById('main-content');
    if (!main || !state.currentZone) return;

    const postsList = state.currentZone.posts.map(post => `
        <div class="post-item ${post.checked ? 'checked' : ''}" data-id="${post.id}">
            <div class="post-header">
                <label class="post-checkbox">
                    <input type="checkbox" ${post.checked ? 'checked' : ''}>
                    <span class="post-name">${post.name}</span>
                </label>
                ${post.checked ? `
                    <div class="post-actions">
                        <button class="photo-btn" data-id="${post.id}">
                            <span class="icon">📷</span>
                            Photo
                        </button>
                        <button class="comment-btn" data-id="${post.id}">
                            <span class="icon">💬</span>
                            Commentaire
                        </button>
                    </div>
                ` : ''}
            </div>
            ${post.comments ? `
                <div class="post-comment">${post.comments}</div>
            ` : ''}
            ${post.photos.length > 0 ? `
                <div class="post-photos">
                    ${post.photos.map((photo, index) => `
                        <img src="${photo}" alt="Photo ${index + 1}" class="post-photo">
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');

    main.innerHTML = `
        <div class="zone-detail">
            <div class="posts-list">
                ${postsList}
            </div>
            <div class="zone-actions">
                <button class="cancel-button">Annuler</button>
                <button class="validate-button">Valider</button>
            </div>
        </div>
    `;

    // Mettre à jour le titre et afficher le bouton retour
    document.querySelector('.title').textContent = `${state.currentZone.name} - Liste des postes`;
    document.querySelector('.back-button').style.display = 'block';
    
    // Configuration du bouton retour pour la page de zone
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.onclick = () => {
            state.currentPage = 'main';
            state.currentZone = null;
            renderPage();
        };
    }

    setupPostCheckboxes();
    setupZoneButtons();
    setupPhotoButtons();
    setupCommentButtons();
}

// Configuration des événements
function setupZoneItems() {
    const zoneItems = document.querySelectorAll('.zone-item');
    zoneItems.forEach(item => {
        item.onclick = () => {
            const zoneId = item.dataset.id;
            if (zoneId) {
                state.currentZone = state.zones.find(z => z.id === zoneId) || null;
                state.currentPage = 'zone';
                renderPage();
            }
        };
    });
}

function setupPostCheckboxes() {
    const checkboxes = document.querySelectorAll('.post-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.onchange = (e) => {
            const postItem = e.target.closest('.post-item');
            const postId = postItem ? postItem.dataset.id : null;
            if (postId) {
                handlePostCheck(postId);
            }
        };
    });
}

function setupZoneButtons() {
    const cancelButton = document.querySelector('.cancel-button');
    const validateButton = document.querySelector('.validate-button');

    if (cancelButton) {
        cancelButton.onclick = () => {
            state.currentPage = 'main';
            state.currentZone = null;
            renderPage();
        };
    }

    if (validateButton) {
        validateButton.onclick = () => {
            if (state.currentZone) {
                const hasCheckedPosts = state.currentZone.posts.some(post => post.checked);
                state.currentZone.completed = hasCheckedPosts;
                saveState();
            }
            state.currentPage = 'main';
            state.currentZone = null;
            renderPage();
        };
    }
}

function setupPhotoButtons() {
    const photoButtons = document.querySelectorAll('.photo-btn');
    photoButtons.forEach(button => {
        button.onclick = () => {
            const postId = button.dataset.id;
            if (postId) {
                handleAddPhoto(postId);
            }
        };
    });
}

function setupCommentButtons() {
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(button => {
        button.onclick = () => {
            const postId = button.dataset.id;
            if (postId) {
                handleAddComment(postId);
            }
        };
    });
}

// Gestionnaires d'événements
function handlePostCheck(postId) {
    if (!state.currentZone) return;

    const updatedZones = state.zones.map(zone => {
        if (zone.id === state.currentZone.id) {
            return {
                ...zone,
                posts: zone.posts.map(post => {
                    if (post.id === postId) {
                        return { ...post, checked: !post.checked };
                    }
                    return post;
                })
            };
        }
        return zone;
    });

    state.zones = updatedZones;
    state.currentZone = updatedZones.find(z => z.id === state.currentZone.id) || null;
    saveState();
    renderPage();
}

async function handleAddPhoto(postId) {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (e) => {
            const files = e.target.files;
            const file = files ? files[0] : null;
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const photoUrl = reader.result;
                    
                    state.zones = state.zones.map(zone => {
                        if (zone.id === state.currentZone.id) {
                            return {
                                ...zone,
                                posts: zone.posts.map(post => {
                                    if (post.id === postId) {
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
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    } catch (error) {
        console.error('Erreur lors de l\'accès à l\'appareil photo:', error);
        alert("Une erreur est survenue lors de l'accès à l'appareil photo.");
    }
}

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

// Fonction principale de rendu
function renderPage() {
    if (state.currentPage === 'main') {
        renderMainPage();
    } else {
        renderZonePage();
    }
}

// Initialisation de l'application
function initApp() {
    loadState();
    renderPage();

    // Initialiser la date et l'heure actuelles
    const now = new Date();
    const dateInput = document.getElementById('cleaning-date');
    const timeInput = document.getElementById('cleaning-time');
    
    if (dateInput) {
        dateInput.value = now.toISOString().split('T')[0];
    }
    if (timeInput) {
        timeInput.value = now.toTimeString().slice(0, 5);
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', initApp);