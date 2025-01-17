// Fonction pour sélectionner un service
function selectService(button) {
    const allButtons = document.querySelectorAll(".service-btn");
    allButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

// Fonction pour aller à la prochaine étape
function prochaineEtape() {
    const date = document.getElementById("date").value;
    const selectedService = document.querySelector(".service-btn.active").innerText;
    alert(`Date : ${date}\nService sélectionné : ${selectedService}`);
}
