function navigateTo(page) {

    window.location.href = page;

}



function changeLanguage() {

    const languages = ['Français', 'Anglais', 'Espagnol'];

    const selected = prompt(`Choisissez une langue :\n1. ${languages[0]}\n2. ${languages[1]}\n3. ${languages[2]}`);

    if (selected && languages[selected - 1]) {

        alert(`Langue sélectionnée : ${languages[selected - 1]}`);

        localStorage.setItem('language', languages[selected - 1]);

    } else {

        alert("Aucune langue sélectionnée.");

    }

}



function orderLabels() {

    const confirmation = confirm("Voulez-vous commander des rouleaux d'étiquettes ?");

    if (confirmation) {

        alert("Commande effectuée avec succès !");

        // Logique pour enregistrer la commande

    }

}



function referFriend() {

    const friendEmail = prompt("Entrez l'email de votre ami pour le parrainer :");

    if (friendEmail) {

        alert(`Un email a été envoyé à ${friendEmail} pour le parrainer !`);

        // Logique pour enregistrer le parrainage

    }

}



function exportLogs() {

    const data = [

        ['Date', 'Équipement', 'Température', 'Alerte'],

        ['2025-01-16', 'Congel 1', '-21.5', 'OK'],

        ['2025-01-16', 'Frigo 1', '3', 'OK'],

    ];

    let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);

    link.setAttribute("download", "journal.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}



function configureNotifications() {

    alert("Redirection vers la configuration des notifications !");

    navigateTo('notifications.html');

}



function confirmDeleteAccount() {

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");

    if (confirmation) {

        alert("Votre compte a été supprimé avec succès !");

        // Logique pour supprimer le compte

    }

}