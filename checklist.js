let scannerActive = false;



// Activer/désactiver le scanner

function toggleScanner() {

    const scannerContainer = document.getElementById("scanner-container");



    if (scannerActive) {

        stopScanner();

    } else {

        scannerContainer.style.display = "block";

        startScanner();

    }

}



// Démarrer le scanner

function startScanner() {

    scannerActive = true;



    Quagga.init(

        {

            inputStream: {

                name: "Live",

                type: "LiveStream",

                target: document.querySelector("#interactive"),

                constraints: {

                    facingMode: "environment" // Utiliser la caméra arrière

                }

            },

            decoder: {

                readers: ["code_128_reader", "ean_reader", "ean_8_reader"] // Types de codes-barres supportés

            }

        },

        function (err) {

            if (err) {

                console.error(err);

                alert("Erreur lors de l'initialisation du scanner.");

                stopScanner();

                return;

            }

            Quagga.start();

        }

    );



    Quagga.onDetected(function (data) {

        const code = data.codeResult.code;

        alert(`Code-barres détecté : ${code}`);

        stopScanner();

    });

}



// Arrêter le scanner

function stopScanner() {

    scannerActive = false;

    const scannerContainer = document.getElementById("scanner-container");

    scannerContainer.style.display = "none";

    Quagga.stop();

}