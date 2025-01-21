let selectedType = '';

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

    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" id="${id}" checked onchange="toggleEquipment('${id}')">
        <label for="${id}">${name} (${selectedType})</label>
        <span id="${id}-temp" class="temperature">0 °C</span>
        <button class="temp-button" data-id="${id}" data-action="increase">+</button>
        <button class="temp-button" data-id="${id}" data-action="decrease">-</button>
        <span id="${id}-alert" class="alert" onclick="openAlert('${name}')" style="display: none;">⚠️</span>
    `;

    list.appendChild(li);

    closeAddModal();
    attachDynamicEvents();
}

function attachDynamicEvents() {
    const buttons = document.querySelectorAll('.temp-button');
    buttons.forEach(button => {
        button.addEventListener('click', handleTempAdjustment);
    });
}

function handleTempAdjustment(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const action = button.getAttribute('data-action');
    const tempSpan = document.getElementById(`${id}-temp`);

    const currentTemp = parseFloat(tempSpan.innerText);
    const increment = action === 'increase' ? 0.5 : -0.5;

    let min = -Infinity, max = Infinity;

    if (id.includes('congel')) {
        min = -25; max = -18;
    } else if (id.includes('frigo')) {
        min = 0; max = 4;
    } else if (id.includes('eje')) {
        min = 0; max = 4;
    }

    const newTemp = currentTemp + increment;

    if (newTemp < min || newTemp > max) {
        tempSpan.style.color = 'red';
        document.getElementById(`${id}-alert`).style.display = 'inline';
    } else {
        tempSpan.style.color = 'black';
        document.getElementById(`${id}-alert`).style.display = 'none';
    }

    tempSpan.innerText = `${newTemp.toFixed(1)} °C`;
}

function toggleEquipment(equipmentId) {
    const checkbox = document.getElementById(equipmentId);
    const tempSpan = document.getElementById(`${equipmentId}-temp`);
    const buttons = document.querySelectorAll(`[data-id="${equipmentId}"]`);
    const alertSpan = document.getElementById(`${equipmentId}-alert`);

    if (checkbox.checked) {
        tempSpan.style.color = 'black';
        tempSpan.style.display = 'inline';
        buttons.forEach(button => button.disabled = false);
    } else {
        tempSpan.style.color = 'gray';
        tempSpan.style.display = 'none';
        buttons.forEach(button => button.disabled = true);
        alertSpan.style.display = 'none';
    }
}

function openAlert(equipmentName) {
    alert(`Alerte pour ${equipmentName} : Température hors plage recommandée.`);
}

document.addEventListener('DOMContentLoaded', () => {
    attachDynamicEvents();
});
