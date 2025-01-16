// Fonction pour basculer la sélection d'un produit
function toggleSelection(element) {
    // Ajoute ou supprime la classe "selected" pour un produit
    element.classList.toggle("selected");

    // Met à jour l'état visuel de l'icône de sélection
    const selectIcon = element.querySelector(".select-icon");
    if (element.classList.contains("selected")) {
        selectIcon.style.backgroundColor = "#007bff"; // Couleur de sélection
    } else {
        selectIcon.style.backgroundColor = "white"; // Couleur par défaut
    }
}

// Fonction pour rechercher un produit dans la liste
function rechercherProduit() {
    const input = document.getElementById("search").value.toLowerCase(); // Texte saisi
    const items = document.querySelectorAll(".product-item"); // Liste des produits

    items.forEach(item => {
        const text = item.textContent.toLowerCase(); // Texte du produit
        // Affiche ou masque les produits en fonction de la correspondance
        item.style.display = text.includes(input) ? "flex" : "none";
    });
}

// Fonction pour valider les produits sélectionnés
function validerProduits() {
    const selectedItems = document.querySelectorAll(".product-item.selected");
    if (selectedItems.length > 0) {
        // Affiche les noms des produits sélectionnés dans une alerte
        const selectedNames = Array.from(selectedItems).map(item => item.querySelector("span").textContent);
        alert(`Vous avez sélectionné :\n${selectedNames.join(", ")}`);
    } else {
        alert("Aucun produit sélectionné");
    }
}

// Fonction pour simuler la fermeture de la page
function fermerPage() {
    alert("La page sera fermée (fonctionnalité en cours de développement).");
}

// Fonction pour simuler le scan d'un code-barres
function scannerCodeBarre() {
    alert("Fonctionnalité de scan de code-barres en cours de développement.");
}

// Fonction pour créer un produit
function creerProduit() {
    alert("Fonctionnalité de création de produit en cours de développement.");
}

// Fonction pour créer une recette
function creerRecette() {
    alert("Fonctionnalité de création de recette en cours de développement.");
}
