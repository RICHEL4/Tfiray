// Codes d'activation valides
const VALID_CODES = ["1220", "3055", "1012", "5057", "6699", "7788", "4450"];

// Éléments du DOM
const registerContainer = document.getElementById("register-container");
const mainContainer = document.getElementById("main-container");
const registerBtn = document.getElementById("register-btn");
const phoneInput = document.getElementById("phone");
const codeInput = document.getElementById("activation-code");
const registerError = document.getElementById("register-error");
const userPhoneSpan = document.getElementById("user-phone");
const logoutBtn = document.getElementById("logout-btn");
const responseElement = document.getElementById("response");
const timeInput = document.getElementById("time-input");
const updateButton = document.getElementById("update-btn");
const topTourList = document.getElementById("top-tour-list");

// Tableau pour stocker les tours
let tours = [];
let currentUser = null;

// Fonction pour vérifier le numéro malgache
function isValidMalagasyNumber(phone) {
    return /^[0-9]{9}$/.test(phone);
}

// Fonction pour vérifier le code d'activation
function isValidActivationCode(code) {
    return VALID_CODES.includes(code);
}

// Fonction pour gérer l'inscription
function handleRegistration() {
    const phone = phoneInput.value;
    const code = codeInput.value;

    if (!isValidMalagasyNumber(phone)) {
        registerError.textContent = "Numéro malgache invalide (9 chiffres)";
        return;
    }

    if (!isValidActivationCode(code)) {
        registerError.textContent = "Code d'activation invalide";
        return;
    }

    // Enregistrement réussi
    currentUser = {
        phone: phone,
        code: code
    };

    // Sauvegarder en localStorage
    localStorage.setItem('aviator_user', JSON.stringify(currentUser));

    // Afficher l'interface principale
    showMainInterface();
}

// Fonction pour afficher l'interface principale
function showMainInterface() {
    registerContainer.style.display = "none";
    mainContainer.style.display = "block";
    userPhoneSpan.textContent = `+261 ${currentUser.phone}`;
}

// Fonction pour déconnecter l'utilisateur
function logout() {
    currentUser = null;
    localStorage.removeItem('aviator_user');
    registerContainer.style.display = "block";
    mainContainer.style.display = "none";
    phoneInput.value = "";
    codeInput.value = "";
    registerError.textContent = "";
}

// Fonction pour ajouter des minutes à une heure
function addMinutes(time, minutes) {
    const [hours, mins] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Fonction pour générer une prédiction spéciale pour 90
function generateSpecialPrediction(baseTime) {
    if (baseTime === "01:30") { // 90 minutes = 1h30
        return {
            time1: "01:36", // 96 minutes
            prediction1: "x2-x4",
            time2: "01:37", // 97 minutes
            prediction2: "x2-x4"
        };
    }
    return null;
}

// Fonction pour générer une prédiction normale
function generateNormalPrediction() {
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

    // Vérifier si c'est le cas spécial (90 minutes = 1h30)
    const specialPrediction = generateSpecialPrediction(time);
    
    if (specialPrediction) {
        responseElement.innerHTML = `
            <p>${specialPrediction.time1} - ${specialPrediction.prediction1}</p>
            <p>${specialPrediction.time2} - ${specialPrediction.prediction2}</p>
        `;

        // Ajouter les tours spéciaux au tableau
        tours.push({ time: specialPrediction.time1, prediction: specialPrediction.prediction1 });
        tours.push({ time: specialPrediction.time2, prediction: specialPrediction.prediction2 });
    } else {
        const time1 = addMinutes(time, 3); // Ajoute 3 minutes
        const time2 = addMinutes(time, 4); // Ajoute 4 minutes

        const prediction1 = generateNormalPrediction();
        const prediction2 = generateNormalPrediction();

        responseElement.innerHTML = `
            <p>${time1} - ${prediction1}</p>
            <p>${time2} - ${prediction2}</p>
        `;

        // Ajouter les tours normaux au tableau
        tours.push({ time: time1, prediction: prediction1 });
        tours.push({ time: time2, prediction: prediction2 });
    }

    // Mettre à jour le Top Tour
    updateTopTour();
}

// Mettre à jour la section Top Tour
function updateTopTour() {
    // Trier les tours avec les prédictions spéciales en premier
    const sortedTours = tours.sort((a, b) => {
        // Les prédictions x2-x4 ont la priorité
        if (a.prediction === "x2-x4" && b.prediction !== "x2-x4") return -1;
        if (b.prediction === "x2-x4" && a.prediction !== "x2-x4") return 1;
        
        // Ensuite les x10+
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

// Événements
registerBtn.addEventListener("click", handleRegistration);
logoutBtn.addEventListener("click", logout);
updateButton.addEventListener("click", updateDisplay);

// Vérifier si l'utilisateur est déjà connecté au chargement
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('aviator_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainInterface();
    }
});

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
