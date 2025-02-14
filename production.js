document.addEventListener('DOMContentLoaded', function() {
    // Initialize recipes array in localStorage if it doesn't exist
    if (!localStorage.getItem('recipes')) {
        localStorage.setItem('recipes', JSON.stringify([]));
    }

    // Service buttons functionality
    const serviceButtons = document.querySelectorAll('.service-button');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            serviceButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Calendar functionality
    const datePickerContainer = document.querySelector('.date-picker-container');
    const calendar = document.getElementById('calendar');
    const currentDateDisplay = document.getElementById('currentDate');
    const monthYearDisplay = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = new Date();
    let displayedMonth = currentDate.getMonth();
    let displayedYear = currentDate.getFullYear();

    function updateDisplayDate() {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString('fr-FR', options)
            .replace('.', '')
            .replace(' ', ' ');
        currentDateDisplay.textContent = formattedDate;
    }

    function createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day' + (isOtherMonth ? ' other-month' : '');
        dayElement.textContent = day;

        if (!isOtherMonth) {
            dayElement.addEventListener('click', function(e) {
                e.stopPropagation();
                selectedDate = new Date(displayedYear, displayedMonth, day);
                updateDisplayDate();
                renderCalendar();
                calendar.classList.remove('show');
            });
        }

        return dayElement;
    }

    function renderCalendar() {
        const firstDay = new Date(displayedYear, displayedMonth, 1);
        const lastDay = new Date(displayedYear, displayedMonth + 1, 0);
        const startingDay = firstDay.getDay() || 7;
        const monthLength = lastDay.getDate();

        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        monthYearDisplay.textContent = `${monthNames[displayedMonth]} ${displayedYear}`;

        calendarDays.innerHTML = '';

        for (let i = 1; i < startingDay; i++) {
            const prevMonthLastDay = new Date(displayedYear, displayedMonth, 0).getDate();
            const dayElement = createDayElement(prevMonthLastDay - startingDay + i + 1, true);
            calendarDays.appendChild(dayElement);
        }

        for (let i = 1; i <= monthLength; i++) {
            const dayElement = createDayElement(i, false);
            
            if (i === currentDate.getDate() && 
                displayedMonth === currentDate.getMonth() && 
                displayedYear === currentDate.getFullYear()) {
                dayElement.classList.add('today');
            }

            if (i === selectedDate.getDate() && 
                displayedMonth === selectedDate.getMonth() && 
                displayedYear === selectedDate.getFullYear()) {
                dayElement.classList.add('selected');
            }

            calendarDays.appendChild(dayElement);
        }

        const remainingCells = 42 - (startingDay - 1 + monthLength);
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = createDayElement(i, true);
            calendarDays.appendChild(dayElement);
        }
    }

    // Initialize calendar
    if (calendar && currentDateDisplay && monthYearDisplay && calendarDays && prevMonthBtn && nextMonthBtn && datePickerContainer) {
        updateDisplayDate();
        renderCalendar();

        datePickerContainer.addEventListener('click', function(e) {
            calendar.classList.toggle('show');
            e.stopPropagation();
        });

        document.addEventListener('click', function(e) {
            if (!calendar.contains(e.target) && !datePickerContainer.contains(e.target)) {
                calendar.classList.remove('show');
            }
        });

        prevMonthBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            displayedMonth--;
            if (displayedMonth < 0) {
                displayedMonth = 11;
                displayedYear--;
            }
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            displayedMonth++;
            if (displayedMonth > 11) {
                displayedMonth = 0;
                displayedYear++;
            }
            renderCalendar();
        });
    }

    // Recipe functionality
    const recipeSection = document.querySelector('.recipe-section');
    const noRecipesMessage = document.querySelector('.no-recipes');
    const nextStepButton = document.querySelector('.next-step-button');
    let isEditMode = false;

    function updateRecipeList() {
        if (!recipeSection || !noRecipesMessage) return;

        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const existingList = recipeSection.querySelector('.recipe-list');
        if (existingList) {
            existingList.remove();
        }

        if (recipes.length > 0) {
            recipeSection.classList.add('has-recipes');
            noRecipesMessage.style.display = 'none';
        } else {
            recipeSection.classList.remove('has-recipes');
            noRecipesMessage.style.display = 'block';
            isEditMode = false;
            const modifyToggle = recipeSection.querySelector('.modify-toggle input');
            if (modifyToggle) modifyToggle.checked = false;
        }

        if (recipes.length > 0) {
            const recipeList = document.createElement('div');
            recipeList.className = 'recipe-list';
            
            recipes.forEach((recipe, index) => {
                const recipeItem = document.createElement('div');
                recipeItem.className = 'recipe-item' + (isEditMode ? ' edit-mode' : '');
                
                const recipeContent = document.createElement('span');
                recipeContent.className = 'recipe-content';
                recipeContent.textContent = recipe.name;
                if (recipe.measure) {
                    recipeContent.textContent += ` (${recipe.measure.value} ${recipe.measure.unit})`;
                }

                const controls = document.createElement('div');
                controls.className = 'recipe-controls';
                
                // Edit button
                const editBtn = document.createElement('button');
                editBtn.className = 'recipe-control-btn edit-btn';
                editBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                `;
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleRecipeEdit(recipe, index);
                });

                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'recipe-control-btn delete-btn';
                deleteBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                `;
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleRecipeDelete(index);
                });

                controls.appendChild(editBtn);
                controls.appendChild(deleteBtn);
                
                const selectionIndicator = document.createElement('div');
                selectionIndicator.className = 'recipe-selection-indicator';
                selectionIndicator.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                
                recipeItem.appendChild(recipeContent);
                recipeItem.appendChild(controls);
                recipeItem.appendChild(selectionIndicator);
                
                if (!isEditMode) {
                    recipeItem.addEventListener('click', () => handleRecipeSelection(recipeItem));
                }
                
                recipeList.appendChild(recipeItem);
            });

            recipeSection.insertBefore(recipeList, recipeSection.querySelector('.search-container'));
        }
    }

    function handleRecipeEdit(recipe, index) {
        const modal = document.getElementById('addRecipeModal');
        const recipeName = modal?.querySelector('#recipeName');
        const measureValue = modal?.querySelector('#measureValue');
        const measureUnit = modal?.querySelector('#measureUnit');
        const measureButtons = modal?.querySelectorAll('.measure-button');

        if (modal && recipeName && measureValue && measureUnit && measureButtons) {
            recipeName.value = recipe.name;
            if (recipe.measure) {
                const button = Array.from(measureButtons)
                    .find(btn => btn.dataset.type === recipe.measure.type);
                if (button) {
                    button.click();
                    measureValue.value = recipe.measure.value;
                    measureUnit.value = recipe.measure.unit;
                }
            }

            const saveButton = modal.querySelector('.save-button');
            if (saveButton) {
                const oldClick = saveButton.onclick;
                saveButton.onclick = function() {
                    const newName = recipeName.value;
                    const measureType = modal.querySelector('.measure-button.active')?.dataset.type;
                    const value = measureValue.value;
                    const unit = measureUnit.value;

                    if (newName.trim()) {
                        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
                        recipes[index] = {
                            name: newName,
                            measure: measureType && value && unit ? {
                                type: measureType,
                                value,
                                unit
                            } : null
                        };
                        localStorage.setItem('recipes', JSON.stringify(recipes));
                        
                        updateRecipeList();
                        resetModalForm(modal, recipeName, measureButtons, measureValue, measureUnit);
                        saveButton.onclick = oldClick;
                    }
                };
            }

            modal.classList.add('show');
        }
    }

    function handleRecipeDelete(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
            const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            recipes.splice(index, 1);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            updateRecipeList();
        }
    }

    function handleRecipeSelection(recipeItem) {
        const wasSelected = recipeItem.classList.contains('selected');
        document.querySelectorAll('.recipe-item').forEach(item => {
            item.classList.remove('selected');
        });
        if (!wasSelected) {
            recipeItem.classList.add('selected');
            if (nextStepButton) {
                nextStepButton.disabled = false;
                nextStepButton.style.opacity = '1';
                nextStepButton.style.cursor = 'pointer';
            }
        } else {
            if (nextStepButton) {
                nextStepButton.disabled = true;
                nextStepButton.style.opacity = '0.5';
                nextStepButton.style.cursor = 'not-allowed';
            }
        }
    }

    function resetModalForm(modal, recipeName, measureButtons, measureValue, measureUnit) {
        recipeName.value = '';
        measureButtons.forEach(btn => btn.classList.remove('active'));
        measureValue.classList.add('hidden');
        measureUnit.classList.add('hidden');
        measureValue.value = '';
        measureUnit.value = '';
        modal.classList.remove('show');
    }

    // Modal functionality
    const modal = document.getElementById('addRecipeModal');
    const addButton = document.querySelector('.add-button');
    const cancelButton = modal?.querySelector('.cancel-button');
    const saveButton = modal?.querySelector('.save-button');
    const measureButtons = modal?.querySelectorAll('.measure-button');
    const measureValue = document.getElementById('measureValue');
    const measureUnit = document.getElementById('measureUnit');

    if (modal && addButton && cancelButton && saveButton && measureButtons && measureValue && measureUnit) {
        addButton.addEventListener('click', function() {
            modal.classList.add('show');
        });

        cancelButton.addEventListener('click', function() {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        measureButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.dataset.type;
                
                measureButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                measureValue.classList.remove('hidden');
                measureUnit.classList.remove('hidden');

                measureUnit.innerHTML = type === 'weight' 
                    ? `
                        <option value="">Unité</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                    `
                    : `
                        <option value="">Unité</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                    `;
            });
        });

        saveButton.addEventListener('click', function() {
            const recipeName = document.getElementById('recipeName');
            if (!recipeName) return;

            const name = recipeName.value;
            const measureType = modal.querySelector('.measure-button.active')?.dataset.type;
            const value = measureValue.value;
            const unit = measureUnit.value;

            if (name.trim()) {
                const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
                recipes.push({
                    name,
                    measure: measureType && value && unit ? {
                        type: measureType,
                        value,
                        unit
                    } : null
                });
                localStorage.setItem('recipes', JSON.stringify(recipes));
                
                updateRecipeList();
                
                recipeName.value = '';
                measureButtons.forEach(btn => btn.classList.remove('active'));
                measureValue.classList.add('hidden');
                measureUnit.classList.add('hidden');
                measureValue.value = '';
                measureUnit.value = '';
                modal.classList.remove('show');
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const recipeItems = document.querySelectorAll('.recipe-item');
            
            recipeItems.forEach(item => {
                const recipeName = item.querySelector('.recipe-content').textContent.toLowerCase();
                if (recipeName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Toggle modification mode
    const modifyToggle = recipeSection?.querySelector('.modify-toggle input');
    if (modifyToggle) {
        modifyToggle.addEventListener('change', function() {
            isEditMode = this.checked;
            const recipeItems = document.querySelectorAll('.recipe-item');
            recipeItems.forEach(item => {
                if (isEditMode) {
                    item.classList.add('edit-mode');
                    item.classList.remove('selected');
                } else {
                    item.classList.remove('edit-mode');
                }
            });

            if (nextStepButton) {
                nextStepButton.disabled = isEditMode;
                nextStepButton.style.opacity = isEditMode ? '0.5' : '1';
                nextStepButton.style.cursor = isEditMode ? 'not-allowed' : 'pointer';
            }
        });
    }

    // Navigation
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.reload();
        });
    }

    if (nextStepButton) {
        nextStepButton.addEventListener('click', function() {
            const selectedRecipe = document.querySelector('.recipe-item.selected');
            if (selectedRecipe) {
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="product-selection">
                            <div class="search-container">
                                <input type="text" placeholder="Exemple: Steak, fromage, etc..." class="search-input">
                                <button class="barcode-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                        <path d="M7 7h2v10H7z"></path>
                                        <path d="M11 7h2v10h-2z"></path>
                                        <path d="M15 7h2v10h-2z"></path>
                                    </svg>
                                </button>
                                <button class="add-button">+</button>
                            </div>
                            <div class="product-categories">
                                <button class="category-button active">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                    Indifférent
                                </button>
                                <button class="category-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m6 19 5-5-5 5Z"></path>
                                        <path d="m12 13-5 5 5-5Z"></path>
                                        <path d="M12 13v8-8Z"></path>
                                        <path d="M12 13h8-8Z"></path>
                                        <path d="m12 13 5 5-5-5Z"></path>
                                        <path d="m19 19-5-5 5 5Z"></path>
                                        <path d="M19 19v-8 8Z"></path>
                                        <path d="M19 19H12h7Z"></path>
                                        <path d="M12 13V5v8Z"></path>
                                        <path d="M12 13H4h8Z"></path>
                                        <path d="m12 13-5-5 5 5Z"></path>
                                        <path d="M5 5 10 10 5 5Z"></path>
                                        <path d="M5 5v8-8Z"></path>
                                        <path d="M5 5h7-7Z"></path>
                                    </svg>
                                    Frais
                                </button>
                                <button class="category-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 2v20M2 12h20"></path>
                                        <path d="m4.93 4.93 14.14 14.14"></path>
                                        <path d="m19.07 4.93-14.14 14.14"></path>
                                    </svg>
                                    Surgelé
                                </button>
                                <button class="category-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                                        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                                        <path d="M12 3v6"></path>
                                    </svg>
                                    Sec
                                </button>
                                <button class="category-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 3v18h18"></path>
                                        <path d="m19 9-5 5-4-4-3 3"></path>
                                    </svg>
                                    Autres
                                </button>
                                <button class="category-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                    </svg>
                                    Recette
                                </button>
                            </div>
                            <div class="product-message">
                                <p>Vous êtes en train de réaliser une production à partir de la recette : "${selectedRecipe.querySelector('.recipe-content').textContent}"</p>
                                <p>Vous ne voyez aucun produit s'afficher dans cet écran car aucun produit favori n'a été associé à cette recette.</p>
                                <p>Vous avez toute fois la possibilité de continuer votre enregistrement en recherchant les produits dans le champs de recherche ci-dessus.</p>
                            </div>
                            <div class="product-counter">
                                <span>0 produits</span>
                            </div>
                        </div>
                    `;

                    const categoryButtons = mainContent.querySelectorAll('.category-button');
                    categoryButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            categoryButtons.forEach(btn => btn.classList.remove('active'));
                            this.classList.add('active');
                        });
                    });
                }
            }
        });
    }

    // Initial recipe list update
    updateRecipeList();
});
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back-button');

    if (backButton) {
        backButton.addEventListener('click', function() {
            // Vérifie si on est sur la page "sélection de produits" (présence de la classe .product-selection)
            const isProductPage = document.querySelector('.product-selection') !== null; 

            if (isProductPage) {
                // Si on est sur la page des produits, revenir à la première page
                location.reload(); // Recharge la page pour revenir à l'état initial
            } else {
                // Sinon, on suppose qu'on est sur la première page, donc on redirige vers index.html
                window.location.href = "index.html";
            }
        });
    }
});
