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
// Interaction sur les modules
document.querySelectorAll(".module").forEach((module) => {
    module.addEventListener("click", () => {
        console.log(`Vous avez cliqué sur : ${module.textContent}`);
    });
});
