// Éléments du DOM pour l'authentification
const authContainer = document.getElementById("auth-container");
const mainContainer = document.getElementById("main-container");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const activationForm = document.getElementById("activation-form");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const activateBtn = document.getElementById("activate-btn");
const showLogin = document.getElementById("show-login");
const showRegister = document.getElementById("show-register");
const logoutBtn = document.getElementById("logout-btn");

// Éléments du DOM pour le contenu principal
const responseElement = document.getElementById("response");
const highOddsElement = document.getElementById("high-odds");
const timeInput = document.getElementById("time-input");
const updateButton = document.getElementById("update-btn");
const topTourList = document.getElementById("top-tour-list");

// Stockage simple (simulation base de données)
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = null;
let tours = [];

// Code d'activation valide
const VALID_ACTIVATION_CODE = "TAFAIRAY1210";

// Gestion de l'inscription
registerBtn.addEventListener("click", () => {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    if (username && password) {
        if (users[username]) {
            alert("Ce nom d'utilisateur existe déjà !");
        } else {
            users[username] = { password, activated: false };
            localStorage.setItem("users", JSON.stringify(users));
            alert("Inscription réussie ! Veuillez entrer le code d'activation.");
            registerForm.style.display = "none";
            activationForm.style.display = "block";
        }
    } else {
        alert("Veuillez remplir tous les champs !");
    }
});

// Gestion de la connexion
loginBtn.addEventListener("click", () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    if (users[username] && users[username].password === password) {
        if (users[username].activated) {
            currentUser = username;
            authContainer.style.display = "none";
            mainContainer.style.display = "block";
        } else {
            alert("Compte non activé ! Veuillez entrer le code d'activation.");
            loginForm.style.display = "none";
            activationForm.style.display = "block";
        }
    } else {
        alert("Nom d'utilisateur ou mot de passe incorrect !");
    }
});

// Gestion de l'activation
activateBtn.addEventListener("click", () => {
    const code = document.getElementById("activation-code").value;
    const username = document.getElementById("register-username").value || document.getElementById("login-username").value;
    if (code === VALID_ACTIVATION_CODE) {
        users[username].activated = true;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Compte activé avec succès ! Veuillez vous connecter.");
        activationForm.style.display = "none";
        loginForm.style.display = "block";
    } else {
        alert("Code d'activation incorrect !");
    }
});

// Gestion de la déconnexion
logoutBtn.addEventListener("click", () => {
    currentUser = null;
    authContainer.style.display = "block";
    mainContainer.style.display = "none";
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    activationForm.style.display = "none";
});

// Basculer entre inscription et connexion
showLogin.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

showRegister.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

// Fonction pour formater l'heure sans secondes
function formatTimeWithoutSeconds(time) {
    const [hours, mins] = time.split(":").slice(0, 2);
    return `${hours}:${mins}`;
}

// Fonction pour ajouter des minutes et des secondes à une heure
function addTime(time, minutes, seconds) {
    const [hours, mins, secs] = time.split(":").map(Number);
    const totalSeconds = hours * 3600 + mins * 60 + (secs || 0) + minutes * 60 + seconds;
    const newHours = Math.floor(totalSeconds / 3600) % 24;
    const newMins = Math.floor((totalSeconds % 3600) / 60);
    const newSecs = totalSeconds % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`;
}

// Fonction pour générer une prédiction
function generatePrediction() {
    const random = Math.random();
    return random < 0.5 ? "x5" : "x10+";
}

// Fonction pour générer une cote élevée
function generateHighOdds() {
    const odds = ["x20", "x50", "x100"];
    return odds[Math.floor(Math.random() * odds.length)];
}

// Mettre à jour la réponse avec les heures décalées
function updateDisplay() {
    const time = timeInput.value;
    if (!time || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
        alert("Veuillez entrer une heure valide au format HH:MM ou HH:MM:SS.");
        return;
    }

    const time1 = addTime(time, 3, 0);
    const time2 = addTime(time, 4, 30);

    const prediction1 = generatePrediction();
    const prediction2 = generatePrediction();

    const displayTime1 = formatTimeWithoutSeconds(time1);
    const displayTime2 = formatTimeWithoutSeconds(time2);

    responseElement.innerHTML = `
        <p>${displayTime1} - ${prediction1}</p>
        <p>${displayTime2} - ${prediction2}</p>
    `;

    if (Math.random() > 0.5) {
        const highOdds = generateHighOdds();
        highOddsElement.innerHTML = `
            <p>Cote élevée : ${highOdds}</p>
        `;
    } else {
        highOddsElement.innerHTML = `<p>Aucune cote élevée pour le moment.</p>`;
    }

    tours.push({ time: displayTime1, prediction: prediction1 });
    tours.push({ time: displayTime2, prediction: prediction2 });

    updateTopTour();
}

// Mettre à jour la section Top Tour
function updateTopTour() {
    const sortedTours = tours.sort((a, b) => {
        if (a.prediction === "x10+" && b.prediction !== "x10+") return -1;
        if (b.prediction === "x10+" && a.prediction !== "x10+") return 1;
        return 0;
    });

    const topTours = sortedTours.slice(0, 5);

    topTourList.innerHTML = topTours
        .map((tour) => `<li><span>${tour.time}</span> - ${tour.prediction}</li>`)
        .join("");
}

// Événement pour le bouton de mise à jour
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