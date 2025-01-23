document.addEventListener('DOMContentLoaded', () => {
    const scannerContainer = document.getElementById('scanner-container');
    const scanButton = document.getElementById('scan-barcode');
    const stopScannerButton = document.getElementById('stop-scanner');

    // Fonction pour démarrer le scanner
    function startScanner() {
        scannerContainer.style.display = 'block';
        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#interactive'),
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
                console.log("Quagga est initialisé avec succès");
                Quagga.start();
            }
        );

        // Gestion de la détection d'un code-barres
        Quagga.onDetected((data) => {
            alert(`Code-barres détecté : ${data.codeResult.code}`);
            stopScanner(); // Arrêter le scanner après détection
        });
    }

    // Fonction pour arrêter le scanner
    function stopScanner() {
        Quagga.stop();
        scannerContainer.style.display = 'none';
    }

    // Écouteurs d'événements
    scanButton.addEventListener('click', startScanner);
    stopScannerButton.addEventListener('click', stopScanner);
});
