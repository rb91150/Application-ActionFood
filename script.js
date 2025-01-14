// Interaction sur les modules

document.querySelectorAll(".module").forEach((module) => {

    module.addEventListener("click", () => {

        // Laissez ce commentaire si vous souhaitez ajouter des actions ici.

        // Pour l'instant, ce code ne fait rien.

        console.log(`Vous avez cliqué sur : ${module.textContent}`); // Pour vérifier dans la console si un module a été cliqué.

    });

});



// Redirection pour un module spécifique

document.querySelector(".module").addEventListener("click", () => {

    window.location.href = "App.html"; // Exemple de redirection vers une autre page.

});
// Activer ou désactiver le mode édition

document.getElementById('edit-mode').addEventListener('change', function () {

    const isEditMode = this.checked;

    document.querySelectorAll('.edit-button, .delete-button').forEach(button => {

        button.style.display = isEditMode ? 'inline-block' : 'none';

    });

});



// Ajouter un équipement

document.querySelector('.add-equipment-button').addEventListener('click', () => {

    document.getElementById('add-popup').style.display = 'block';

});



// Fermer le popup

document.querySelectorAll('.cancel-button').forEach(button => {

    button.addEventListener('click', () => {

        document.querySelector('.popup').style.display = 'none';

    });

});



// Confirmer la suppression

document.querySelectorAll('.delete-button').forEach(button => {

    button.addEventListener('click', () => {

        document.getElementById('delete-popup').style.display = 'block';

    });

});