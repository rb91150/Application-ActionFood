// DOM Elements
const helpButton = document.getElementById('help-button');
const helpModal = document.getElementById('help-modal');
const closeHelp = document.getElementById('close-help');
const serviceButtons = document.querySelectorAll('.service-button');
const nextStepButton = document.getElementById('next-step');
const openDateInput = document.getElementById('open-date');
const openTimeInput = document.getElementById('open-time');

// State
let selectedService = '';

// Event Listeners
helpButton.addEventListener('click', () => {
    helpModal.classList.add('active');
});

closeHelp.addEventListener('click', () => {
    helpModal.classList.remove('active');
});

// Close modal when clicking outside
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.remove('active');
    }
});

// Service selection
serviceButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        serviceButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Update selected service
        selectedService = button.dataset.service;
    });
});

// Next step validation
nextStepButton.addEventListener('click', () => {
    if (!openDateInput.value || !openTimeInput.value || !selectedService) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Store the data in localStorage for the next page
    localStorage.setItem('openDate', openDateInput.value);
    localStorage.setItem('openTime', openTimeInput.value);
    localStorage.setItem('selectedService', selectedService);
    
    // Navigate to the selection page
    window.location.href = 'selection.html';
});