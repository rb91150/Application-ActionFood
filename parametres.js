// Exemple : Ajouter une interaction pour les éléments de la liste
document.querySelectorAll('.settings-list li').forEach(item => {
    item.addEventListener('click', () => {
        alert(`Vous avez sélectionné : ${item.innerText}`);
    });
});
