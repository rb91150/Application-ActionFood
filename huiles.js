// Données des items de la checklist
const checklistItems = [
    {
      id: '1',
      label: 'DLC des produits vérifiées dans mes frigos/congel',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    },
    {
      id: '2',
      label: 'Le personnel de cuisine ne porte pas de bijoux/montre',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    },
    {
      id: '3',
      label: 'Le personnel de cuisine porte une tenue propre',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    },
    {
      id: '4',
      label: 'Pas de cartons en zone de Stockage',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    },
    {
      id: '5',
      label: 'Pas de stockage au sol',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    },
    {
      id: '6',
      label: 'Tous les produits entamés sont filmés/étiquetés',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    }
  ];
  
  // État global de l'application
  const state = {
    currentItemId: null,
    items: checklistItems,
    modalOpen: false,
    editMode: false
  };
  
  // Fonction pour créer un item de la checklist
  function createChecklistItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'checklist-item';
    itemElement.dataset.id = item.id;
    itemElement.dataset.status = item.status;
    
    const statusText = {
      'non': 'Non conforme',
      'oui': 'Conforme',
      'non-evalue': 'Non évalué'
    };
    
    itemElement.innerHTML = `
      <div class="item-content">
        <div class="item-status ${item.status}">
          ${statusText[item.status]}
        </div>
        <div class="item-header">${item.label}</div>
        <div class="item-actions">
          <button class="action-btn non ${item.status === 'non' ? 'active' : ''}" data-status="non">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Non
          </button>
          <button class="action-btn oui ${item.status === 'oui' ? 'active' : ''}" data-status="oui">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Oui
          </button>
          <button class="action-btn non-evalue ${item.status === 'non-evalue' ? 'active' : ''}" data-status="non-evalue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Non évalué
          </button>
        </div>
        ${item.hasMedia ? `
          <div class="media-actions ${item.status === 'non-evalue' ? '' : 'visible'}">
            <button class="media-btn photo-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              ${item.photo ? 'Remplacer la photo' : 'Photo'}
            </button>
            <button class="media-btn comment-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Commentaire
            </button>
          </div>
        ` : ''}
        ${item.comment ? `
          <div class="item-comment">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>${item.comment}</p>
          </div>
        ` : ''}
        ${item.photo ? `
          <div class="item-photo">
            <img src="${item.photo}" alt="Photo du contrôle">
          </div>
        ` : ''}
      </div>
      <div class="edit-actions">
        <button class="edit-icon" title="Modifier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
        <button class="delete-icon" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  
    // Gestion des clics sur les boutons de statut
    const actionButtons = itemElement.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (state.editMode) return;
        e.stopPropagation();
        updateItemStatus(item.id, button.dataset.status);
        actionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Afficher/masquer les boutons média
        const mediaActions = itemElement.querySelector('.media-actions');
        if (mediaActions) {
          mediaActions.classList.toggle('visible', button.dataset.status !== 'non-evalue');
        }
        
        updateValidateButton();
      });
    });
  
    // Gestion des boutons média si disponibles
    if (item.hasMedia) {
      const commentBtn = itemElement.querySelector('.comment-btn');
      const photoBtn = itemElement.querySelector('.photo-btn');
  
      commentBtn?.addEventListener('click', (e) => {
        if (state.editMode) return;
        e.stopPropagation();
        openCommentModal(item.id);
      });
  
      photoBtn?.addEventListener('click', (e) => {
        if (state.editMode) return;
        e.stopPropagation();
        takePicture(item.id);
      });
    }
  
    // Ajouter le gestionnaire de clic sur la photo
    const photoElement = itemElement.querySelector('.item-photo');
    if (photoElement) {
      photoElement.addEventListener('click', () => {
        if (!state.editMode) {
          openPhotoViewer(item.photo);
        }
      });
    }
  
    // Gestion des boutons d'édition
    const editIcon = itemElement.querySelector('.edit-icon');
    const deleteIcon = itemElement.querySelector('.delete-icon');
  
    editIcon?.addEventListener('click', () => {
      openEditItemModal(item);
    });
  
    deleteIcon?.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment supprimer ce point de contrôle ?')) {
        deleteItem(item.id);
      }
    });
  
    return itemElement;
  }
  
  // Mise à jour du statut d'un item
  function updateItemStatus(itemId, newStatus) {
    const item = state.items.find(item => item.id === itemId);
    if (item) {
      item.status = newStatus;
      updateLocalStorage();
      refreshItem(itemId);
    }
  }
  
  // Rafraîchir l'affichage d'un item
  function refreshItem(itemId) {
    const oldElement = document.querySelector(`.checklist-item[data-id="${itemId}"]`);
    const item = state.items.find(item => item.id === itemId);
    if (oldElement && item) {
      const newElement = createChecklistItem(item);
      oldElement.replaceWith(newElement);
    }
  }
  
  // Gestion du modal de commentaire
  function openCommentModal(itemId) {
    state.currentItemId = itemId;
    state.modalOpen = true;
    
    const modal = document.querySelector('.comment-modal');
    const textarea = modal.querySelector('textarea');
    const item = state.items.find(item => item.id === itemId);
    
    textarea.value = item.comment || '';
    modal.style.display = 'flex';
  }
  
  function closeCommentModal() {
    const modal = document.querySelector('.comment-modal');
    modal.style.display = 'none';
    state.modalOpen = false;
    state.currentItemId = null;
  }
  
  function saveComment() {
    if (!state.currentItemId) return;
  
    const textarea = document.querySelector('.comment-modal textarea');
    const item = state.items.find(item => item.id === state.currentItemId);
    
    if (item) {
      item.comment = textarea.value;
      updateLocalStorage();
      refreshItem(state.currentItemId);
    }
    
    closeCommentModal();
  }
  
  // Gestion de la prise de photo
  function takePicture(itemId) {
    state.currentItemId = itemId;
    const cameraInput = document.querySelector('#camera-input');
    cameraInput.click();
  }
  
  function handlePhotoCapture(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(e) {
      const item = state.items.find(item => item.id === state.currentItemId);
      if (item) {
        item.photo = e.target.result;
        updateLocalStorage();
        refreshItem(state.currentItemId);
      }
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  }
  
  // Gestion du mode édition
  function openEditItemModal(item) {
    state.currentItemId = item.id;
    const modal = document.querySelector('.edit-item-modal');
    const input = modal.querySelector('.edit-item-input');
    const deleteBtn = modal.querySelector('.delete-btn');
    
    input.value = item.label;
    modal.style.display = 'flex';
    
    // Gestionnaire pour le bouton de suppression dans le modal
    deleteBtn.onclick = () => {
      if (confirm('Voulez-vous vraiment supprimer ce point de contrôle ?')) {
        deleteItem(item.id);
        closeEditItemModal();
      }
    };
  }
  
  function closeEditItemModal() {
    const modal = document.querySelector('.edit-item-modal');
    modal.style.display = 'none';
    state.currentItemId = null;
  }
  
  function saveEditedItem() {
    if (!state.currentItemId) return;
    
    const input = document.querySelector('.edit-item-input');
    const item = state.items.find(item => item.id === state.currentItemId);
    
    if (item && input.value.trim()) {
      item.label = input.value.trim();
      updateLocalStorage();
      refreshItem(state.currentItemId);
      closeEditItemModal();
    }
  }
  
  function deleteItem(itemId) {
    state.items = state.items.filter(item => item.id !== itemId);
    updateLocalStorage();
    const container = document.querySelector('.checklist-items');
    const itemElement = container.querySelector(`[data-id="${itemId}"]`);
    if (itemElement) {
      itemElement.remove();
    }
  }
  
  function addNewItem() {
    const newItem = {
      id: Date.now().toString(),
      label: 'Nouveau point de contrôle',
      status: 'non-evalue',
      hasMedia: true,
      comment: '',
      photo: null
    };
    
    state.items.push(newItem);
    updateLocalStorage();
    
    const container = document.querySelector('.checklist-items');
    container.appendChild(createChecklistItem(newItem));
    
    // Ouvrir directement le modal d'édition pour le nouveau point
    openEditItemModal(newItem);
  }
  
  function toggleEditMode(enabled) {
    state.editMode = enabled;
    const items = document.querySelectorAll('.checklist-item');
    const addButton = document.querySelector('.add-item-btn');
    
    items.forEach(item => {
      const editActions = item.querySelector('.edit-actions');
      if (editActions) {
        editActions.classList.toggle('visible', enabled);
      }
    });
    
    addButton.style.display = enabled ? 'flex' : 'none';
  }
  
  // Gestion du visualiseur de photo
  function openPhotoViewer(photoSrc) {
    const viewer = document.querySelector('.photo-viewer');
    const img = viewer.querySelector('img');
    img.src = photoSrc;
    viewer.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  
  function closePhotoViewer() {
    const viewer = document.querySelector('.photo-viewer');
    viewer.classList.remove('visible');
    const img = viewer.querySelector('img');
    img.src = '';
    document.body.style.overflow = '';
  }
  
  // Gestion du modal utilisateur
  function openUserModal() {
    const modal = document.querySelector('.user-modal');
    modal.style.display = 'flex';
  }
  
  function closeUserModal() {
    const modal = document.querySelector('.user-modal');
    modal.style.display = 'none';
  }
  
  function handleDisconnect() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      window.location.href = 'index.html';
    }
  }
  
  // Validation de la checklist
  function updateValidateButton() {
    const validateBtn = document.querySelector('.validate-btn');
    const uncheckedItems = state.items.filter(item => item.status === 'non-evalue');
    validateBtn.disabled = uncheckedItems.length > 0;
  }
  
  function validateChecklist() {
    const uncheckedItems = state.items.filter(item => item.status === 'non-evalue');
    
    if (uncheckedItems.length > 0) {
      alert('Veuillez évaluer tous les points de contrôle avant de valider.');
      return;
    }
  
    updateLocalStorage();
    alert('Contrôles validés avec succès !');
    window.location.href = 'index.html';
  }
  
  // Gestion du stockage local
  function updateLocalStorage() {
    localStorage.setItem('checklistData', JSON.stringify(state.items));
  }
  
  function loadFromLocalStorage() {
    const savedData = localStorage.getItem('checklistData');
    if (savedData) {
      state.items = JSON.parse(savedData);
    }
  }
  
  // Initialisation de l'application
  function initApp() {
    loadFromLocalStorage();
  
    const container = document.querySelector('.checklist-items');
    state.items.forEach(item => {
      container.appendChild(createChecklistItem(item));
    });
  
    // Event listeners existants
    document.querySelector('.comment-modal .close-btn').addEventListener('click', closeCommentModal);
    document.querySelector('.comment-modal .cancel-btn').addEventListener('click', closeCommentModal);
    document.querySelector('.comment-modal .save-btn').addEventListener('click', saveComment);
    document.querySelector('#camera-input').addEventListener('change', handlePhotoCapture);
    document.querySelector('.validate-btn').addEventListener('click', validateChecklist);
    document.querySelector('.back-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  
    // Event listeners pour le mode édition
    document.querySelector('.edit-mode-toggle').addEventListener('change', (e) => {
      toggleEditMode(e.target.checked);
    });
  
    document.querySelector('.add-item-btn').addEventListener('click', addNewItem);
  
    // Event listeners pour le modal d'édition
    const editModal = document.querySelector('.edit-item-modal');
    editModal.querySelector('.close-btn').addEventListener('click', closeEditItemModal);
    editModal.querySelector('.cancel-btn').addEventListener('click', closeEditItemModal);
    editModal.querySelector('.save-btn').addEventListener('click', saveEditedItem);
  
    // Event listeners pour le modal utilisateur
    const userIcon = document.querySelector('.user-icon');
    const userModal = document.querySelector('.user-modal');
    userIcon.addEventListener('click', openUserModal);
    userModal.querySelector('.close-btn').addEventListener('click', closeUserModal);
    userModal.querySelector('.disconnect-btn').addEventListener('click', handleDisconnect);
  
    // Initialisation de la date et l'heure
    const now = new Date();
    document.querySelector('.date-input').valueAsDate = now;
    document.querySelector('.time-input').value = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  
    // Photo viewer
    const photoViewer = document.querySelector('.photo-viewer');
    const closePhotoBtn = photoViewer.querySelector('.close-photo');
    
    closePhotoBtn.addEventListener('click', closePhotoViewer);
    photoViewer.addEventListener('click', (e) => {
      if (e.target === photoViewer) {
        closePhotoViewer();
      }
    });
  
    updateValidateButton();
  }
  
  // Démarrage de l'application
  document.addEventListener('DOMContentLoaded', initApp);