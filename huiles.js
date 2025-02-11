document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs pour les modales et les listes
    const modifyLink = document.querySelector('.modify-link');
    const equipmentListModal = document.getElementById('equipmentListModal');
    const newEquipmentModal = document.getElementById('newEquipmentModal');
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    const modalCloseBtn = document.querySelector('.modal-close');
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const mainEquipmentList = document.querySelector('.equipment-list');
    const emptyState = document.querySelector('.empty-state');
    const controlTypeSection = document.querySelector('.control-type-section');
    const addFirstEquipmentBtn = document.querySelector('.add-first-equipment-btn');
    const cancelNewEquipmentBtn = document.querySelector('.btn-cancel');
    const addNewEquipmentBtn = document.querySelector('.btn-add');
    const controlTypeBtn = document.querySelector('.control-type-btn');
    const controlTypeMenu = document.querySelector('.control-type-menu');
    const backBtn = document.querySelector('.back-btn');

    // Gestionnaire pour le bouton retour
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Date et heure
    const dateBtn = document.querySelector('.date-btn');
    const timeBtn = document.querySelector('.time-btn');
    const dateBtnSpan = dateBtn.querySelector('span');
    const timeBtnSpan = timeBtn.querySelector('span');

    // Options de formatage
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

    // Fonction pour vérifier si la liste est vide
    function checkEmptyState() {
        const hasEquipments = mainEquipmentList.querySelector('.checkbox-container') !== null;
        emptyState.style.display = hasEquipments ? 'none' : 'flex';
        controlTypeSection.style.display = hasEquipments ? 'block' : 'none';
    }

    // Fonction pour mettre à jour la visibilité du type de contrôle
    function updateControlTypeVisibility() {
        const checkedEquipments = mainEquipmentList.querySelectorAll('input[type="checkbox"]:checked').length;
        controlTypeSection.style.display = checkedEquipments > 0 ? 'block' : 'none';
    }

    // Ajouter l'écouteur d'événements pour les cases à cocher
    mainEquipmentList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            updateControlTypeVisibility();
        }
    });

    // Vérification initiale
    checkEmptyState();
    updateControlTypeVisibility();

    // Mise à jour de la date et l'heure
    function updateDateTime() {
        const now = new Date();
        dateBtnSpan.textContent = now.toLocaleDateString('fr-FR', dateOptions);
        timeBtnSpan.textContent = now.toLocaleTimeString('fr-FR', timeOptions);
    }

    // Mise à jour initiale
    updateDateTime();

    // Mise à jour toutes les minutes
    setInterval(updateDateTime, 60000);

    // Création des sélecteurs de date et heure
    const datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.style.display = 'none';
    dateBtn.appendChild(datePicker);

    const timePicker = document.createElement('input');
    timePicker.type = 'time';
    timePicker.style.display = 'none';
    timeBtn.appendChild(timePicker);

    // Gestionnaires d'événements pour la date et l'heure
    dateBtn.addEventListener('click', () => {
        datePicker.click();
    });

    timeBtn.addEventListener('click', () => {
        timePicker.click();
    });

    datePicker.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        dateBtnSpan.textContent = selectedDate.toLocaleDateString('fr-FR', dateOptions);
    });

    timePicker.addEventListener('change', (e) => {
        const [hours, minutes] = e.target.value.split(':');
        const now = new Date();
        now.setHours(hours, minutes);
        timeBtnSpan.textContent = now.toLocaleTimeString('fr-FR', timeOptions);
    });

    // Gestionnaires d'événements pour les modales
    if (modifyLink) {
        modifyLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (equipmentListModal) {
                equipmentListModal.classList.add('show');
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            equipmentListModal.classList.remove('show');
        });
    }

    // Gestionnaire pour le bouton "Ajouter un équipement"
    if (addEquipmentBtn) {
        addEquipmentBtn.addEventListener('click', () => {
            equipmentListModal.classList.remove('show');
            newEquipmentModal.classList.add('show');
            // Réinitialiser le formulaire
            document.getElementById('equipmentName').value = '';
            document.getElementById('newEquipmentStateToggle').checked = true;
            document.getElementById('temperatureToggle').checked = true;
            document.getElementById('polarityToggle').checked = true;
            addNewEquipmentBtn.textContent = 'Ajouter';
        });
    }

    // Gestionnaire pour le bouton "Ajouter un équipement" dans l'état vide
    if (addFirstEquipmentBtn) {
        addFirstEquipmentBtn.addEventListener('click', () => {
            newEquipmentModal.classList.add('show');
            // Réinitialiser le formulaire
            document.getElementById('equipmentName').value = '';
            document.getElementById('newEquipmentStateToggle').checked = true;
            document.getElementById('temperatureToggle').checked = true;
            document.getElementById('polarityToggle').checked = true;
            addNewEquipmentBtn.textContent = 'Ajouter';
        });
    }

    // Fonction pour supprimer un équipement
    function deleteEquipment(equipmentName) {
        // Supprimer de la liste principale
        const mainEquipmentItems = mainEquipmentList.querySelectorAll('.checkbox-container');
        mainEquipmentItems.forEach(item => {
            if (item.querySelector('span:last-child').textContent === equipmentName) {
                item.remove();
            }
        });

        // Supprimer de la liste modale
        const modalEquipmentItems = equipmentListModal.querySelectorAll('.equipment-item');
        modalEquipmentItems.forEach(item => {
            if (item.querySelector('.equipment-name').textContent === equipmentName) {
                item.remove();
            }
        });

        // Vérifier l'état vide après la suppression
        checkEmptyState();
        updateControlTypeVisibility();
    }

    // Gestionnaires pour la modale de nouvel équipement
    if (cancelNewEquipmentBtn) {
        cancelNewEquipmentBtn.addEventListener('click', () => {
            newEquipmentModal.classList.remove('show');
            equipmentListModal.classList.add('show');
        });
    }

    if (addNewEquipmentBtn) {
        addNewEquipmentBtn.addEventListener('click', () => {
            const equipmentName = document.getElementById('equipmentName').value;
            const isActive = document.getElementById('newEquipmentStateToggle').checked;
            const tempEnabled = document.getElementById('temperatureToggle').checked;
            const polarityEnabled = document.getElementById('polarityToggle').checked;
            
            // Récupérer les valeurs de température et polarité
            const tempInputs = document.querySelectorAll('#newTemperatureSection .range-input');
            const polarityInputs = document.querySelectorAll('#newPolaritySection .range-input');
            const tempValues = Array.from(tempInputs).map(input => input.value);
            const polarityValues = Array.from(polarityInputs).map(input => input.value);

            if (!equipmentName) {
                alert('Le nom de l\'équipement est obligatoire');
                return;
            }

            // Si c'est une mise à jour
            if (addNewEquipmentBtn.textContent === 'Mettre à jour') {
                // Mettre à jour dans la liste principale
                const mainEquipmentItems = mainEquipmentList.querySelectorAll('.checkbox-container');
                mainEquipmentItems.forEach(item => {
                    const span = item.querySelector('span:last-child');
                    if (span.textContent === document.getElementById('equipmentName').defaultValue) {
                        span.textContent = equipmentName;
                    }
                });

                // Mettre à jour dans la liste modale
                const modalEquipmentItems = equipmentListModal.querySelectorAll('.equipment-item');
                modalEquipmentItems.forEach(item => {
                    const nameSpan = item.querySelector('.equipment-name');
                    if (nameSpan.textContent === document.getElementById('equipmentName').defaultValue) {
                        nameSpan.textContent = equipmentName;
                    }
                });
            } else {
                // Ajouter à la liste principale
                const newCheckboxContainer = document.createElement('label');
                newCheckboxContainer.className = 'checkbox-container';
                newCheckboxContainer.innerHTML = `
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span>${equipmentName}</span>
                `;
                mainEquipmentList.appendChild(newCheckboxContainer);

                // Ajouter à la liste modale
                const newEquipmentItem = document.createElement('div');
                newEquipmentItem.className = 'equipment-item';
                newEquipmentItem.innerHTML = `
                    <span class="equipment-name">${equipmentName}</span>
                    <div class="equipment-actions">
                        <button class="action-btn edit-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                            </svg>
                        </button>
                        <button class="action-btn delete-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                `;
                const equipmentItems = equipmentListModal.querySelector('.equipment-items');
                equipmentItems.appendChild(newEquipmentItem);

                // Ajouter les gestionnaires d'événements pour les nouveaux boutons
                const newEditBtn = newEquipmentItem.querySelector('.edit-btn');
                const newDeleteBtn = newEquipmentItem.querySelector('.delete-btn');

                newEditBtn.addEventListener('click', () => {
                    document.getElementById('equipmentName').value = equipmentName;
                    document.getElementById('equipmentName').defaultValue = equipmentName;
                    addNewEquipmentBtn.textContent = 'Mettre à jour';
                    equipmentListModal.classList.remove('show');
                    newEquipmentModal.classList.add('show');
                });

                newDeleteBtn.addEventListener('click', () => {
                    if (confirm(`Voulez-vous vraiment supprimer l'équipement "${equipmentName}" ?`)) {
                        deleteEquipment(equipmentName);
                    }
                });

                // Ajouter l'écouteur d'événements pour la case à cocher
                const newCheckbox = newCheckboxContainer.querySelector('input[type="checkbox"]');
                newCheckbox.addEventListener('change', updateControlTypeVisibility);
            }

            // Fermer la modale et réinitialiser le formulaire
            newEquipmentModal.classList.remove('show');
            equipmentListModal.classList.add('show');
            document.getElementById('equipmentName').value = '';
            document.getElementById('equipmentName').defaultValue = '';
            addNewEquipmentBtn.textContent = 'Ajouter';

            // Mettre à jour l'état vide et la visibilité du type de contrôle
            checkEmptyState();
            updateControlTypeVisibility();
        });
    }

    // Gestionnaires d'événements pour les boutons d'édition existants
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const equipmentItem = btn.closest('.equipment-item');
            const equipmentName = equipmentItem.querySelector('.equipment-name').textContent;
            
            document.getElementById('equipmentName').value = equipmentName;
            document.getElementById('equipmentName').defaultValue = equipmentName;
            addNewEquipmentBtn.textContent = 'Mettre à jour';
            
            equipmentListModal.classList.remove('show');
            newEquipmentModal.classList.add('show');
        });
    });

    // Gestionnaires d'événements pour les boutons de suppression existants
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const equipmentItem = btn.closest('.equipment-item');
            const equipmentName = equipmentItem.querySelector('.equipment-name').textContent;
            if (confirm(`Voulez-vous vraiment supprimer l'équipement "${equipmentName}" ?`)) {
                deleteEquipment(equipmentName);
            }
        });
    });

    // Gestionnaire pour le type de contrôle
    if (controlTypeBtn) {
        controlTypeBtn.addEventListener('click', () => {
            if (controlTypeMenu) {
                controlTypeMenu.style.display = 'block';
                setTimeout(() => {
                    controlTypeMenu.classList.add('show');
                }, 10);
            }
        });
    }

    // Gestionnaire pour les éléments du menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedText = item.textContent.trim();
            const controlTypeBtnSpan = controlTypeBtn.querySelector('span');
            if (controlTypeBtnSpan) {
                controlTypeBtnSpan.textContent = selectedText;
            }
            controlTypeMenu.classList.remove('show');
            setTimeout(() => {
                controlTypeMenu.style.display = 'none';
            }, 300);
        });
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (controlTypeMenu && 
            !controlTypeMenu.contains(e.target) && 
            !controlTypeBtn.contains(e.target) &&
            controlTypeMenu.classList.contains('show')) {
            controlTypeMenu.classList.remove('show');
            setTimeout(() => {
                controlTypeMenu.style.display = 'none';
            }, 300);
        }
    });
});