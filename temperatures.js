// État de l'application
let editMode = false;
let selectedType = 'Frigo';
let equipmentToEdit = null; // Ajout d'une variable pour stocker l'ID de l'équipement en cours d'édition
let equipmentToDelete = null;
let equipment = [
    { id: 'eje', name: 'Eje', type: 'Frigo', temperature: 2, enabled: true },
    { id: 'congel1', name: 'Congel 1', type: 'Congélateur', temperature: -21.5, enabled: true },
    { id: 'frigo1', name: 'Frigo 1', type: 'Frigo', temperature: 3, enabled: true }
];

// Configuration des plages de température
const typeRanges = {
    'Congélateur': { min: -25, max: -18, default: -21.5 },
    'Frigo': { min: 0, max: 4, default: 2 },
    'Chaud': { min: 63, max: Infinity, default: 63 }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderEquipmentList();
    setupTypeOptions();
    initializeDateAndTime();
});

// Initialisation de la date et de l'heure
function initializeDateAndTime() {
    const now = new Date();
    const dateInput = document.getElementById('date-picker');
    const timeInput = document.getElementById('time-picker');
    
    dateInput.value = now.toISOString().split('T')[0];
    timeInput.value = now.toTimeString().slice(0, 5);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    const editModeToggle = document.getElementById('edit-mode-toggle');
    editModeToggle.addEventListener('change', (e) => {
        editMode = e.target.checked;
        renderEquipmentList();
        
        // Ajouter une classe pour l'animation de transition
        document.querySelectorAll('.equipment-item').forEach(item => {
            item.classList.add('edit-mode-transition');
        });
    });

    document.getElementById('equipment-filter').addEventListener('change', renderEquipmentList);
}

// Rendu de la liste des équipements
function renderEquipmentList() {
    const list = document.getElementById('equipment-list');
    const filter = document.getElementById('equipment-filter').value;
    list.innerHTML = '';

    let filteredEquipment = equipment;
    if (filter === 'active') {
        filteredEquipment = equipment.filter(eq => eq.enabled);
    } else if (filter === 'inactive') {
        filteredEquipment = equipment.filter(eq => !eq.enabled);
    }

    filteredEquipment.forEach(eq => {
        const li = document.createElement('li');
        li.className = `equipment-item ${editMode ? 'edit-mode' : ''}`;
        
        if (editMode) {
            li.innerHTML = `
                <div class="equipment-left">
                    <span class="equipment-name">${eq.name} (${eq.type})</span>
                </div>
                <div class="equipment-right">
                    <button class="edit-button" onclick="editEquipment('${eq.id}')" title="Modifier">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                        </svg>
                    </button>
                    <button class="delete-button" onclick="openDeleteModal('${eq.id}')" title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            `;
        } else {
            const isOutOfRange = isTemperatureOutOfRange(eq);
            li.innerHTML = `
                <div class="equipment-left">
                    <input
                        type="checkbox"
                        ${eq.enabled ? 'checked' : ''}
                        onchange="toggleEquipment('${eq.id}')"
                    >
                    <span class="${eq.enabled ? '' : 'disabled'}">
                        ${eq.name} (${eq.type})
                    </span>
                </div>
                <div class="equipment-right">
                    <span class="temperature ${isOutOfRange ? 'text-red-600' : ''}">
                        ${eq.temperature.toFixed(1)} °C
                    </span>
                    <button
                        class="temp-button"
                        onclick="handleTemperatureChange('${eq.id}', true)"
                        ${eq.enabled ? '' : 'disabled'}
                    >+</button>
                    <button
                        class="temp-button"
                        onclick="handleTemperatureChange('${eq.id}', false)"
                        ${eq.enabled ? '' : 'disabled'}
                    >-</button>
                    ${isOutOfRange ? `
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="alert-icon"
                            onclick="showAlert('${eq.id}')"
                        >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    ` : ''}
                </div>
            `;
        }
        list.appendChild(li);
    });

    updateSaveButtonState();
}

// Configuration des options de type
function setupTypeOptions() {
    const container = document.getElementById('type-options');
    container.innerHTML = '';

    Object.entries(typeRanges).forEach(([type, range]) => {
        const button = document.createElement('button');
        button.className = `type-button ${type === selectedType ? 'selected' : ''}`;
        button.onclick = () => selectType(type);
        button.innerHTML = `
            <div class="flex justify-between items-center">
                <span>${type}</span>
                <span class="text-sm text-gray-500">
                    ${range.min}°C à ${range.max === Infinity ? '+∞' : range.max}°C
                </span>
            </div>
        `;
        container.appendChild(button);
    });
}

// Sélection du type d'équipement
function selectType(type) {
    selectedType = type;
    setupTypeOptions();
}

// Gestion de la température
function handleTemperatureChange(id, increment) {
    equipment = equipment.map(eq => {
        if (eq.id === id) {
            return {
                ...eq,
                temperature: eq.temperature + (increment ? 0.5 : -0.5)
            };
        }
        return eq;
    });
    renderEquipmentList();
}

// Activation/désactivation d'un équipement
function toggleEquipment(id) {
    equipment = equipment.map(eq => {
        if (eq.id === id) {
            return { ...eq, enabled: !eq.enabled };
        }
        return eq;
    });
    renderEquipmentList();
}

// Vérification de la plage de température
function isTemperatureOutOfRange(eq) {
    const range = typeRanges[eq.type];
    return eq.temperature < range.min || eq.temperature > range.max;
}

// Gestion des modales
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    if (modalId === 'equipment-modal') {
        equipmentToEdit = null; // Réinitialiser l'équipement en cours d'édition
    }
}

// Fonctions pour les modales spécifiques
function openHelpModal() {
    openModal('help-modal');
}

function openProfileModal() {
    document.getElementById('current-user').textContent = 'John Doe'; // À remplacer par l'utilisateur réel
    openModal('profile-modal');
}

function openAddModal() {
    equipmentToEdit = null; // Réinitialiser l'équipement en cours d'édition
    document.getElementById('modal-title').textContent = 'Ajouter un équipement';
    document.getElementById('equipment-name').value = '';
    selectedType = 'Frigo';
    setupTypeOptions();
    openModal('equipment-modal');
}

function openDeleteModal(id) {
    equipmentToDelete = id;
    openModal('delete-modal');
}

// Édition d'un équipement
function editEquipment(id) {
    const eq = equipment.find(e => e.id === id);
    if (eq) {
        equipmentToEdit = id; // Stocker l'ID de l'équipement en cours d'édition
        document.getElementById('modal-title').textContent = 'Modifier l\'équipement';
        document.getElementById('equipment-name').value = eq.name;
        selectedType = eq.type;
        setupTypeOptions();
        openModal('equipment-modal');
    }
}

// Sauvegarde des modifications
function saveEquipment() {
    const name = document.getElementById('equipment-name').value.trim();
    if (!name) {
        alert("Veuillez entrer un nom d'équipement");
        return;
    }

    if (equipmentToEdit) {
        // Mode modification
        equipment = equipment.map(eq => {
            if (eq.id === equipmentToEdit) {
                return {
                    ...eq,
                    name,
                    type: selectedType
                };
            }
            return eq;
        });
    } else {
        // Mode ajout
        const id = name.toLowerCase().replace(/ /g, '-');
        equipment.push({
            id,
            name,
            type: selectedType,
            temperature: typeRanges[selectedType].default,
            enabled: true
        });
    }

    closeModal('equipment-modal');
    renderEquipmentList();
}

// Confirmation de suppression
function confirmDelete() {
    if (equipmentToDelete) {
        equipment = equipment.filter(eq => eq.id !== equipmentToDelete);
        equipmentToDelete = null;
        closeModal('delete-modal');
        renderEquipmentList();
    }
}

// Affichage des alertes
function showAlert(id) {
    const eq = equipment.find(e => e.id === id);
    const range = typeRanges[eq.type];
    alert(`Alerte pour ${eq.name} : Température hors plage recommandée (${range.min}°C à ${range.max === Infinity ? '+∞' : range.max}°C)`);
}

// Gestion de la déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        window.location.href = '/login';
    }
}

// Mise à jour de l'état du bouton d'enregistrement
function updateSaveButtonState() {
    const saveButton = document.getElementById('save-records');
    const hasEnabledEquipment = equipment.some(eq => eq.enabled);
    saveButton.disabled = !hasEnabledEquipment;
}

// Enregistrement des relevés
function saveRecords() {
    const date = document.getElementById('date-picker').value;
    const time = document.getElementById('time-picker').value;
    const enabledEquipment = equipment.filter(eq => eq.enabled);

    const records = {
        date,
        time,
        equipment: enabledEquipment.map(eq => ({
            name: eq.name,
            type: eq.type,
            temperature: eq.temperature
        }))
    };

    console.log('Enregistrement des relevés :', records);
    alert('Relevés enregistrés avec succès !');
}