// Configuration des plages de température
const typeRanges = {
    'Congélateur': { min: -25, max: -18, default: -21.5 },
    'Frigo': { min: 0, max: 4, default: 2 },
    'Chaud': { min: 63, max: Infinity, default: 63 }
};

// État initial des équipements
let equipment = [
    { id: 'eje', name: 'Eje', type: 'Frigo', temperature: 2, enabled: true },
    { id: 'congel1', name: 'Congel 1', type: 'Congélateur', temperature: -21.5, enabled: true },
    { id: 'frigo1', name: 'Frigo 1', type: 'Frigo', temperature: 3, enabled: true }
];

// Variables pour la modal
let selectedType = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderEquipmentList();
    setupTypeOptions();
});

// Rendu de la liste des équipements
function renderEquipmentList() {
    const list = document.getElementById('equipment-list');
    list.innerHTML = '';

    equipment.forEach(eq => {
        const li = document.createElement('li');
        li.className = 'equipment-item';
        
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
                <span class="temperature ${eq.enabled ? (isOutOfRange ? 'text-red-600' : '') : 'disabled'}">
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
                ${isOutOfRange && eq.enabled ? `
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
        list.appendChild(li);
    });
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

// Vérification de la plage de température
function isTemperatureOutOfRange(eq) {
    const range = typeRanges[eq.type];
    return eq.temperature < range.min || eq.temperature > range.max;
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

// Affichage de l'alerte
function showAlert(id) {
    const eq = equipment.find(e => e.id === id);
    const range = typeRanges[eq.type];
    alert(`Alerte pour ${eq.name} : Température hors plage recommandée (${range.min}°C à ${range.max === Infinity ? '+∞' : range.max}°C)`);
}

// Configuration des options de type dans la modal
function setupTypeOptions() {
    const container = document.getElementById('type-options');
    container.innerHTML = '';

    Object.entries(typeRanges).forEach(([type, range]) => {
        const button = document.createElement('button');
        button.className = `type-button ${selectedType === type ? 'selected' : ''}`;
        button.onclick = () => selectType(type);
        button.textContent = `${type} (min : ${range.min}°C, max : ${range.max === Infinity ? '+∞' : range.max}°C)`;
        container.appendChild(button);
    });
}

// Sélection du type dans la modal
function selectType(type) {
    selectedType = type;
    setupTypeOptions();
}

// Gestion de la modal
function openAddModal() {
    const modal = document.getElementById('add-equipment-modal');
    modal.classList.add('show');
    selectedType = null;
    setupTypeOptions();
    document.getElementById('equipment-name').value = '';
}

function closeAddModal() {
    const modal = document.getElementById('add-equipment-modal');
    modal.classList.remove('show');
}

// Ajout d'un nouvel équipement
function addEquipment() {
    const nameInput = document.getElementById('equipment-name');
    const name = nameInput.value.trim();

    if (!name || !selectedType) {
        alert("Veuillez entrer un nom et sélectionner un type d'équipement.");
        return;
    }

    const id = name.toLowerCase().replace(/ /g, '-');
    const range = typeRanges[selectedType];

    equipment.push({
        id,
        name,
        type: selectedType,
        temperature: range.default,
        enabled: true
    });

    renderEquipmentList();
    closeAddModal();
}