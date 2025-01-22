let selectedType = '';
const typeRanges = {
    'Congélateur': { min: -25, max: -18, default: -21.5 },
    'Frigo': { min: 0, max: 4, default: 2 },
    'Chaud': { min: 63, max: Infinity, default: 63 }
};

function openAddModal() {
    document.getElementById('add-equipment-modal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('add-equipment-modal').style.display = 'none';
    document.getElementById('equipment-name').value = '';
    selectedType = '';
}

function setEquipmentType(type) {
    selectedType = type;
    alert(`Type sélectionné : ${type}`);
}

function addEquipment() {
    const name = document.getElementById('equipment-name').value;

    if (!name || !selectedType) {
        alert("Veuillez entrer un nom et sélectionner un type d'équipement.");
        return;
    }

    const list = document.querySelector('.equipment-list');
    const id = name.toLowerCase().replace(/ /g, '-');
    const defaultTemp = typeRanges[selectedType].default;

    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" id="${id}" checked onchange="toggleEquipment('${id}')">
        <label for="${id}">${name} (${selectedType})</label>
        <span id="${id}-temp" class="temperature">${defaultTemp} °C</span>
        <button class="temp-button" data-id="${id}" data-type="${selectedType}" data-action="increase">+</button>
        <button class="temp-button" data-id="${id}" data-type="${selectedType}" data-action="decrease">-</button>
        <span id="${id}-alert" class="alert" onclick="openAlert('${name}')" style="display: none;">⚠️</span>
    `;

    list.appendChild(li);

    closeAddModal();
    attachDynamicEvents();
}

function attachDynamicEvents() {
    document.querySelectorAll('.temp-button').forEach(button => {
        button.addEventListener('click', handleTempAdjustment);
    });
}

function handleTempAdjustment(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const type = button.getAttribute('data-type');
    const action = button.getAttribute('data-action');
    const tempSpan = document.getElementById(`${id}-temp`);

    const currentTemp = parseFloat(tempSpan.innerText);
    const increment = action === 'increase' ? 0.5 : -0.5;
    const range = typeRanges[type];

    const newTemp = currentTemp + increment;
    tempSpan.innerText = `${newTemp.toFixed(1)} °C`;

    if (newTemp < range.min || newTemp > range.max) {
        tempSpan.style.color = 'red';
        document.getElementById(`${id}-alert`).style.display = 'inline';
    } else {
        tempSpan.style.color = 'black';
        document.getElementById(`${id}-alert`).style.display = 'none';
    }
}

function toggleEquipment(id) {
    const checkbox = document.getElementById(id);
    const tempSpan = document.getElementById(`${id}-temp`);
    const alertSpan = document.getElementById(`${id}-alert`);
    const buttons = document.querySelectorAll(`[data-id="${id}"]`);

    if (checkbox.checked) {
        tempSpan.style.color = 'black';
        buttons.forEach(button => button.disabled = false);
    } else {
        tempSpan.style.color = 'gray';
        buttons.forEach(button => button.disabled = true);
        alertSpan.style.display = 'none';
    }
}

function openAlert(name) {
    alert(`Alerte pour ${name} : Température hors plage recommandée.`);
}

document.addEventListener('DOMContentLoaded', attachDynamicEvents);
