function validerDonnees() {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const friteuseChecked = document.getElementById("friteuse").checked;

    let message = `Date du relevé : ${date}\nHeure du relevé : ${time}\n`;

    if (friteuseChecked) {
        message += "Équipement sélectionné : Friteuse";
    } else {
        message += "Aucun équipement sélectionné.";
    }

    alert(message);
}
