// Récupérer le bouton "Suivant"

document.querySelector(".next-button").addEventListener("click", () => {

    const operation = document.getElementById("operation").value;

    const additionalInfo = document.getElementById("additional-info").value;



    // Afficher les données collectées

    alert(`Type d'opération : ${operation}\nInformations additionnelles : ${additionalInfo}`);

});



// Interaction pour "Produit indépendant"

document.querySelector(".add-product-btn").addEventListener("click", () => {

    const productName = prompt("Entrez le nom du produit indépendant :");

    if (productName) {

        alert(`Produit ajouté : ${productName}`);

    }

});