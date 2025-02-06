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
    modalOpen: false
  };
  
  // Sélecteurs DOM
  const selectors = {
    checklistContainer: '.checklist-items',
    commentModal: '.comment-modal',
    modalTextarea: '.comment-modal textarea',
    modalCancelBtn: '.modal-footer .cancel-btn',
    modalSaveBtn: '.modal-footer .save-btn',
    validateBtn: '.validate-btn',
    backBtn: '.back-btn',
    dateInput: '.date-input',
    timeInput: '.time-input',
    cameraInput: '#camera-input'
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
        ${item.comment ? `
          <div class="item-comment">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>${item.comment}</p>
          </div>
        ` : ''}
        ${item.photo && item.status !== 'non-evalue' ? `
          <div class="item-photo">
            <img src="${item.photo}" alt="Photo du contrôle">
          </div>
        ` : ''}
      ` : ''}
    `;
  
    // Gestion des clics sur les boutons de statut
    const actionButtons = itemElement.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        updateItemStatus(item.id, button.dataset.status);
        actionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Afficher/masquer les boutons média
        const mediaActions = itemElement.querySelector('.media-actions');
        if (mediaActions) {
          mediaActions.classList.toggle('visible', button.dataset.status !== 'non-evalue');
        }
      });
    });
  
    // Gestion des boutons média si disponibles
    if (item.hasMedia) {
      const commentBtn = itemElement.querySelector('.comment-btn');
      const photoBtn = itemElement.querySelector('.photo-btn');
  
      commentBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openCommentModal(item.id);
      });
  
      photoBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        takePicture(item.id);
      });
    }
  
    // Ajouter le gestionnaire de clic sur la photo
    const photoElement = itemElement.querySelector('.item-photo');
    if (photoElement) {
      photoElement.addEventListener('click', () => {
        openPhotoViewer(item.photo);
      });
    }
  
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
    
    const modal = document.querySelector(selectors.commentModal);
    const textarea = modal.querySelector(selectors.modalTextarea);
    const item = state.items.find(item => item.id === itemId);
    
    textarea.value = item.comment || '';
    modal.style.display = 'flex';
  }
  
  function closeCommentModal() {
    const modal = document.querySelector(selectors.commentModal);
    modal.style.display = 'none';
    state.modalOpen = false;
    state.currentItemId = null;
  }
  
  function saveComment() {
    if (!state.currentItemId) return;
  
    const textarea = document.querySelector(selectors.modalTextarea);
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
    const cameraInput = document.querySelector(selectors.cameraInput);
    
    // Vérifier si l'appareil est mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Alterner entre caméra avant et arrière
      const currentFacing = cameraInput.getAttribute('capture') === 'environment' ? 'user' : 'environment';
      cameraInput.setAttribute('capture', currentFacing);
    } else {
      // Sur desktop, on permet la sélection de fichiers
      cameraInput.removeAttribute('capture');
    }
    
    cameraInput.click();
  }
  
  function handlePhotoCapture(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    // Vérifier si le fichier est une image
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
      // Reset l'input pour permettre de reprendre la même photo
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  }
  
  // Ajouter les fonctions pour le visualiseur de photo
  function openPhotoViewer(photoSrc) {
    const viewer = document.querySelector('.photo-viewer');
    const img = viewer.querySelector('img');
    img.src = photoSrc;
    viewer.classList.add('visible');
    
    // Empêcher le défilement du body
    document.body.style.overflow = 'hidden';
  }
  
  function closePhotoViewer() {
    const viewer = document.querySelector('.photo-viewer');
    viewer.classList.remove('visible');
    const img = viewer.querySelector('img');
    img.src = '';
    
    // Réactiver le défilement
    document.body.style.overflow = '';
  }
  
  // Validation de la checklist
  function validateChecklist() {
    // Sauvegarde finale
    updateLocalStorage();
    alert('Contrôles validés avec succès !');
    
    // Redirection vers index.html
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
  
  function openUserModal() {
    const userModal = document.querySelector('.user-modal');
    userModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  
  function closeUserModal() {
    const userModal = document.querySelector('.user-modal');
    userModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  // Initialisation de l'application
  function initApp() {
    // Chargement des données sauvegardées
    loadFromLocalStorage();
  
    // Rendu initial de la checklist
    const container = document.querySelector(selectors.checklistContainer);
    state.items.forEach(item => {
      container.appendChild(createChecklistItem(item));
    });
  
    // Event listeners pour la modale de commentaire
    const commentModal = document.querySelector(selectors.commentModal);
    commentModal.querySelector('.close-btn').addEventListener('click', closeCommentModal);
    commentModal.querySelector('.cancel-btn').addEventListener('click', closeCommentModal);
    commentModal.querySelector('.save-btn').addEventListener('click', saveComment);
  
    // Event listener pour la capture photo
    const cameraInput = document.querySelector(selectors.cameraInput);
    cameraInput.addEventListener('change', handlePhotoCapture);
  
    // Event listener pour le bouton de validation
    const validateBtn = document.querySelector(selectors.validateBtn);
    validateBtn.addEventListener('click', validateChecklist);
    validateBtn.disabled = false; // Le bouton est toujours actif
  
    // Event listener pour le bouton retour
    const backBtn = document.querySelector(selectors.backBtn);
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  
    // Initialisation de la date et l'heure
    const now = new Date();
    const dateInput = document.querySelector(selectors.dateInput);
    const timeInput = document.querySelector(selectors.timeInput);
    
    dateInput.valueAsDate = now;
    timeInput.value = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  
    // Ajouter l'event listener pour fermer le visualiseur de photo
    const photoViewer = document.querySelector('.photo-viewer');
    const closePhotoBtn = photoViewer.querySelector('.close-photo');
    
    closePhotoBtn.addEventListener('click', closePhotoViewer);
    
    // Fermer aussi en cliquant sur l'arrière-plan
    photoViewer.addEventListener('click', (e) => {
      if (e.target === photoViewer) {
        closePhotoViewer();
      }
    });
  
    // Ajouter les gestionnaires pour le modal utilisateur
    const userIcon = document.querySelector('.user-icon');
    const userModalCloseBtn = document.querySelector('.user-modal .close-btn');
    const disconnectBtn = document.querySelector('.disconnect-btn');
  
    userIcon.addEventListener('click', openUserModal);
    userModalCloseBtn.addEventListener('click', closeUserModal);
    disconnectBtn.addEventListener('click', () => {
      // Ici, vous pouvez ajouter la logique de déconnexion
      window.location.href = 'index.html';
    });
  }
  
  // Démarrage de l'application quand le DOM est chargé
  document.addEventListener('DOMContentLoaded', initApp);