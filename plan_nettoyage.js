// État initial de l'application
let state = {
    currentPage: 'main',
    currentZone: null,
    isEditing: false,
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
        const parsedState = JSON.parse(savedState);
        // Toujours démarrer sur la page principale
        state = {
            ...parsedState,
            currentPage: 'main',
            currentZone: null,
            isEditing: false
        };
    }
}

// Fonction pour ajouter une zone
function handleAddZone() {
    const modal = document.querySelector('.zone-modal');
    const input = modal.querySelector('input');
    const saveButton = modal.querySelector('.save');
    const cancelButton = modal.querySelector('.cancel');

    modal.style.display = 'flex';
    input.value = '';

    const handleSave = () => {
        const name = input.value.trim();
        if (name) {
            state.zones.push({
                id: Date.now().toString(),
                name,
                completed: false,
                posts: []
            });
            saveState();
            renderPage();
        }
        modal.style.display = 'none';
    };

    const handleCancel = () => {
        modal.style.display = 'none';
    };

    saveButton.onclick = handleSave;
    cancelButton.onclick = handleCancel;
}

// Fonction pour supprimer une zone
function handleDeleteZone(zoneId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
        state.zones = state.zones.filter(zone => zone.id !== zoneId);
        saveState();
        renderPage();
    }
}

// Fonction pour renommer une zone
function handleRenameZone(zoneId) {
    const zone = state.zones.find(z => z.id === zoneId);
    if (!zone) return;

    const newName = prompt('Nouveau nom de la zone:', zone.name);
    if (newName && newName.trim()) {
        state.zones = state.zones.map(z => {
            if (z.id === zoneId) {
                return { ...z, name: newName.trim() };
            }
            return z;
        });
        saveState();
        renderPage();
    }
}

// Fonction pour revenir à la page principale
function handleBack() {
    if (state.currentPage === 'zone') {
        // Si on est dans la page "Liste des postes", on revient à la page principale "Plan de nettoyage"
        state.currentPage = 'main';
        state.currentZone = null;
        renderPage();
        updateHeader();
    } else {
        // Si on est déjà sur la page principale, on redirige vers index.html
        window.location.href = "index.html";
    }
}


// Fonction pour valider une zone
function handleValidateZone() {
    if (state.currentZone) {
        const hasCheckedPosts = state.currentZone.posts.some(post => post.checked);
        state.zones = state.zones.map(zone => {
            if (zone.id === state.currentZone.id) {
                return { ...zone, completed: hasCheckedPosts };
            }
            return zone;
        });
        saveState();
    }
    handleBack();
}

// Fonction pour mettre à jour le titre du header
function updateHeader() {
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        titleElement.textContent = state.currentPage === 'main' 
            ? 'Plan de nettoyage'
            : `${state.currentZone?.name || ''} - Liste des postes`;
    }
}

// Fonction pour gérer le toggle d'édition
function handleEditToggle(e) {
    state.isEditing = e.target.checked;
    renderPage();
}

// Fonction pour supprimer un poste
function handleDeletePost(postId) {
    if (!state.currentZone) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce poste ?')) {
        state.zones = state.zones.map(zone => {
            if (zone.id === state.currentZone.id) {
                return {
                    ...zone,
                    posts: zone.posts.filter(post => post.id !== postId)
                };
            }
            return zone;
        });
        
        state.currentZone = state.zones.find(z => z.id === state.currentZone.id) || null;
        saveState();
        renderPage();
    }
}

// Fonction pour renommer un poste
function handleRenamePost(postId) {
    if (!state.currentZone) return;
    
    const post = state.currentZone.posts.find(p => p.id === postId);
    if (!post) return;

    const newName = prompt('Nouveau nom du poste:', post.name);
    if (newName && newName.trim()) {
        state.zones = state.zones.map(zone => {
            if (zone.id === state.currentZone.id) {
                return {
                    ...zone,
                    posts: zone.posts.map(p => {
                        if (p.id === postId) {
                            return { ...p, name: newName.trim() };
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
}

// Fonction pour ajouter un nouveau poste
function handleAddPost() {
    const modal = document.querySelector('.post-modal');
    const input = modal.querySelector('input');
    const saveButton = modal.querySelector('.save');
    const cancelButton = modal.querySelector('.cancel');

    modal.style.display = 'flex';
    input.value = '';

    const handleSave = () => {
        const name = input.value.trim();
        if (name && state.currentZone) {
            state.zones = state.zones.map(zone => {
                if (zone.id === state.currentZone.id) {
                    return {
                        ...zone,
                        posts: [...zone.posts, {
                            id: Date.now().toString(),
                            name,
                            checked: false,
                            comments: '',
                            photos: []
                        }]
                    };
                }
                return zone;
            });
            
            state.currentZone = state.zones.find(z => z.id === state.currentZone.id) || null;
            saveState();
            renderPage();
        }
        modal.style.display = 'none';
    };

    const handleCancel = () => {
        modal.style.display = 'none';
    };

    saveButton.onclick = handleSave;
    cancelButton.onclick = handleCancel;
}

// Fonction pour gérer le clic sur une zone
function handleZoneClick(event) {
    if (state.isEditing) return;
    
    const zoneId = event.currentTarget.dataset.id;
    if (zoneId) {
        state.currentZone = state.zones.find(z => z.id === zoneId) || null;
        state.currentPage = 'zone';
        renderPage();
        updateHeader();
    }
}

// Rendu de la page principale
function renderMainPage() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const zonesList = state.zones.map(zone => `
        <div class="zone-item" data-id="${zone.id}" onclick="handleZoneClick(event)">
            <div class="zone-header">
                <span class="zone-name">${zone.name}</span>
                ${zone.completed ? '<span class="zone-check">✓</span>' : ''}
                ${state.isEditing ? `
                    <div class="zone-edit-actions">
                        <button class="edit-btn" onclick="event.stopPropagation(); handleRenameZone('${zone.id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                            </svg>
                        </button>
                        <button class="delete-btn" onclick="event.stopPropagation(); handleDeleteZone('${zone.id}')">
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
    `).join('');

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().slice(0, 5);

    main.innerHTML = `
        <div class="action-date">
            <h2>
                Date de l'action de nettoyage
                <span class="help-icon">?</span>
            </h2>
            <div class="date-time-section">
                <div class="date">
                    <span class="icon">📅</span>
                    <input type="date" id="cleaning-date" value="${today}">
                </div>
                <div class="time">
                    <span class="icon">⏰</span>
                    <input type="time" id="cleaning-time" value="${now}">
                </div>
            </div>
        </div>
        <div class="zone-list">
            <div class="zone-header">
                <h2>Liste des zones à nettoyer</h2>
                <div class="edit-toggle">
                    <span>Modifier</span>
                    <label class="switch">
                        <input type="checkbox" ${state.isEditing ? 'checked' : ''} onchange="handleEditToggle(event)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="zones">
                ${zonesList}
            </div>
            <button class="add-zone-button" onclick="handleAddZone()">
                <span>+</span>
                <span>Ajouter une zone de nettoyage</span>
            </button>
        </div>
        <footer>
            <button class="finish-button" ${!state.zones.some(zone => zone.completed) ? 'disabled' : ''}>
                Terminer
            </button>
        </footer>
    `;
}

// Rendu de la page de zone
function renderZonePage() {
    const main = document.getElementById('main-content');
    if (!main || !state.currentZone) return;

    const postsList = state.currentZone.posts.map(post => `
        <div class="post-item ${post.checked ? 'checked' : ''}" data-id="${post.id}">
            <div class="post-header">
                <label class="post-checkbox">
                    <input type="checkbox" ${post.checked ? 'checked' : ''} onchange="handlePostCheck('${post.id}')" ${state.isEditing ? 'disabled' : ''}>
                    <span class="post-name">${post.name}</span>
                </label>
                ${state.isEditing ? `
                    <div class="post-edit-actions">
                        <button class="edit-btn" onclick="handleRenamePost('${post.id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                            </svg>
                        </button>
                        <button class="delete-btn" onclick="handleDeletePost('${post.id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                ` : post.checked ? `
                    <div class="post-actions">
                        <button class="photo-btn" onclick="handleAddPhoto('${post.id}')">
                            <span class="icon">📷</span>
                            Photo
                        </button>
                        <button class="comment-btn" onclick="handleAddComment('${post.id}')">
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
                        <div class="post-photo-container">
                            <img src="${photo}" alt="Photo ${index + 1}" class="post-photo" onclick="handlePhotoPreview('${photo}')">
                            ${state.isEditing ? `
                                <button class="delete-photo" onclick="handleDeletePhoto('${post.id}', ${index})">×</button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');

    main.innerHTML = `
        <div class="zone-detail">
            <div class="zone-header">
                <h2>Liste des postes</h2>
                <div class="edit-toggle">
                    <span>Modifier</span>
                    <label class="switch">
                        <input type="checkbox" ${state.isEditing ? 'checked' : ''} onchange="handleEditToggle(event)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="posts-list">
                ${postsList}
            </div>
            <button class="add-zone-button" onclick="handleAddPost()">
                <span>+</span>
                <span>Ajouter un poste de nettoyage</span>
            </button>
            <div class="zone-actions">
                <button class="cancel-button" onclick="handleBack()">Annuler</button>
                <button class="validate-button" onclick="handleValidateZone()">Valider</button>
            </div>
        </div>
    `;
}

// Gestion des photos
function handlePhotoPreview(photoUrl) {
    const modal = document.querySelector('.photo-preview-modal');
    const image = modal.querySelector('.photo-preview-image');
    const closeButton = modal.querySelector('.close-preview');

    image.src = photoUrl;
    modal.style.display = 'flex';

    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function handleDeletePhoto(postId, photoIndex) {
    if (!state.currentZone) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
        state.zones = state.zones.map(zone => {
            if (zone.id === state.currentZone.id) {
                return {
                    ...zone,
                    posts: zone.posts.map(post => {
                        if (post.id === postId) {
                            const newPhotos = [...post.photos];
                            newPhotos.splice(photoIndex, 1);
                            return { ...post, photos: newPhotos };
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
}

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
    if (!state.currentZone) return;
    
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const photoUrl = reader.result;
                    
                    state.zones = state.zones.map(zone => {
                        if (zone.id === state.currentZone?.id) {
                            return {
                                ...zone,
                                posts: zone.posts.map(p => {
                                    if (p.id === postId) {
                                        return {
                                            ...p,
                                            photos: [...p.photos, photoUrl]
                                        };
                                    }
                                    return p;
                                })
                            };
                        }
                        return zone;
                    });

                    state.currentZone = state.zones.find(z => z.id === state.currentZone?.id) || null;
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
    updateHeader();
}

// Initialisation de l'application
function initApp() {
    loadState();
    renderPage();
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', initApp);
function handleFinish() {
    window.location.href = "index.html"; 
}
