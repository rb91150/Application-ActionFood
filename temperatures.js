// Open and close modals

function openAddModal() {

    document.getElementById('add-modal').style.display = 'flex';

}



function closeAddModal() {

    document.getElementById('add-modal').style.display = 'none';

}



function openDeleteModal() {

    document.getElementById('delete-modal').style.display = 'flex';

}



function closeDeleteModal() {

    document.getElementById('delete-modal').style.display = 'none';

}



// Add equipment

function addEquipment() {

    const name = document.getElementById('equipment-name').value;

    const list = document.getElementById('equipment-list');

    const li = document.createElement('li');

    li.innerHTML = `

        <span>${name}</span>

        <button onclick="openDeleteModal()">Supprimer</button>

    `;

    list.appendChild(li);

    closeAddModal();

}



// Delete equipment

function deleteEquipment() {

    // Logic to delete equipment

    closeDeleteModal();

}



// Save data

function saveData() {

    alert('Relevés enregistrés !');

}



// Navigation

function goBack() {

    window.history.back();

}