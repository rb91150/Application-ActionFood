// script.js



// Interaction sur les modules

document.querySelectorAll(".module").forEach((module) => {

    module.addEventListener("click", () => {

        alert(`Vous avez cliqué sur : ${module.textContent}`);

    });

});