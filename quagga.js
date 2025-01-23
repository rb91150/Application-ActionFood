document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de Quagga
    Quagga.init(
        {
            inputStream: {
                name: "Live",
                type: "LiveStream", // Utilisation de la caméra en direct
                target: document.querySelector("#scanner-container"), // Div cible
                constraints: {
                    facingMode: "environment", // Caméra arrière
                },
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader"], // Types de codes-barres à scanner
            },
        },
        (err) => {
            if (err) {
                console.error("Erreur lors de l'initialisation de Quagga :", err);
                return;
            }
            console.log("QuaggaJS initialisé avec succès !");
            Quagga.start(); // Lance le scanner
        }
    );

    // Événement déclenché lorsqu'un code-barres est détecté
    Quagga.onDetected((data) => {
        const code = data.codeResult.code; // Récupère le code détecté
        document.getElementById("output").textContent = `Code-barres détecté : ${code}`;
        console.log("Code-barres détecté :", code);
    });
});
