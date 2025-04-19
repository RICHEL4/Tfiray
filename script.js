// Éléments du DOM
const responseElement = document.getElementById("response");
const timeInput = document.getElementById("time-input");
const updateButton = document.getElementById("update-btn");
const topTourList = document.getElementById("top-tour-list");

// Tableau pour stocker les tours
let tours = [];

// Fonction pour ajouter des minutes à une heure
function addMinutes(time, minutes) {
    const [hours, mins] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Fonction pour générer une prédiction
function generatePrediction() {
    const random = Math.random();
    return random < 0.5 ? "x3" : "x10+";
}

// Mettre à jour la réponse avec les heures décalées
function updateDisplay() {
    const time = timeInput.value;
    if (!time) {
        alert("Veuillez entrer une heure valide.");
        return;
    }

    const time1 = addMinutes(time, 3); // Ajoute 3 minutes
    const time2 = addMinutes(time, 4); // Ajoute 4 minutes

    const prediction1 = generatePrediction();
    const prediction2 = generatePrediction();

    responseElement.innerHTML = `
        <p>${time1} - ${prediction1}</p>
        <p>${time2} - ${prediction2}</p>
    `;

    // Ajouter les tours au tableau
    tours.push({ time: time1, prediction: prediction1 });
    tours.push({ time: time2, prediction: prediction2 });

    // Mettre à jour le Top Tour
    updateTopTour();
}

// Mettre à jour la section Top Tour
function updateTopTour() {
    // Trier les tours par prédiction (x10+ en premier)
    const sortedTours = tours.sort((a, b) => {
        if (a.prediction === "x10+" && b.prediction !== "x10+") return -1;
        if (b.prediction === "x10+" && a.prediction !== "x10+") return 1;
        return 0;
    });

    // Limiter à 5 tours maximum
    const topTours = sortedTours.slice(0, 5);

    // Mettre à jour l'affichage
    topTourList.innerHTML = topTours
        .map((tour) => `<li><span>${tour.time}</span> - ${tour.prediction}</li>`)
        .join("");
}

// Événement pour le bouton
updateButton.addEventListener("click", updateDisplay);

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:application/javascript;base64,' + btoa(`
        self.addEventListener('install', (event) => {
            console.log('Service Worker installé');
        });

        self.addEventListener('fetch', (event) => {
            console.log('Requête interceptée :', event.request.url);
        });
    `))
        .then(() => console.log('Service Worker enregistré'))
        .catch((err) => console.log('Échec de l\'enregistrement du Service Worker :', err));
}
