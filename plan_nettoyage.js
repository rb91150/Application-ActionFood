// Sauvegarder les données

function saveData() {

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    alert(`Date: ${date}, Heure: ${time}`);

}



// Ajouter une nouvelle zone

function addZone() {

    const zones = document.querySelector(".zones");

    const newZone = document.createElement("li");

    const zoneName = prompt("Entrez le nom de la nouvelle zone :");

    if (zoneName) {

        newZone.textContent = zoneName;

        zones.appendChild(newZone);

    }

}