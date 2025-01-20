// Gestion des clics sur les items
document.querySelectorAll(".history-list li").forEach(item => {
    item.addEventListener("click", () => {
        alert(`Vous avez sélectionné : ${item.innerText}`);
    });
});
