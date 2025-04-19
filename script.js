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

// Variables globales
let tours = [];
let currentUser = null;

// Fonctions
function isValidMalagasyNumber(phone) {
    return /^[0-9]{9}$/.test(phone);
}

function isValidActivationCode(code) {
    return VALID_CODES.includes(code);
}

function handleRegistration() {
    const phone = phoneInput.value.trim();
    const code = codeInput.value.trim();

    registerError.textContent = "";

    if (!isValidMalagasyNumber(phone)) {
        registerError.textContent = "Numéro invalide (9 chiffres requis)";
        return;
    }

    if (!isValidActivationCode(code)) {
        registerError.textContent = "Code d'activation invalide";
        return;
    }

    currentUser = { phone: phone, code: code };
    localStorage.setItem('aviator_user', JSON.stringify(currentUser));
    showMainInterface();
}

function showMainInterface() {
    registerContainer.style.display = "none";
    mainContainer.style.display = "block";
    userPhoneSpan.textContent = `+261 ${currentUser.phone}`;
    timeInput.value = "";
    responseElement.innerHTML = "";
}

function logout() {
    currentUser = null;
    localStorage.removeItem('aviator_user');
    registerContainer.style.display = "block";
    mainContainer.style.display = "none";
    phoneInput.value = "";
    codeInput.value = "";
    registerError.textContent = "";
}

function addMinutes(time, minutes) {
    const [hours, mins] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

function generateSpecialPrediction(baseTime) {
    if (baseTime === "01:30") {
        return {
            time1: "01:36", // 96 minutes
            prediction1: "x2-x4",
            time2: "01:37", // 97 minutes
            prediction2: "x2-x4"
        };
    }
    return null;
}

function generateNormalPrediction() {
    return Math.random() < 0.5 ? "x3" : "x10+";
}

function updateDisplay() {
    const time = timeInput.value;
    if (!time) {
        alert("Veuillez entrer une heure valide.");
        return;
    }

    const specialPrediction = generateSpecialPrediction(time);
    
    if (specialPrediction) {
        responseElement.innerHTML = `
            <p>${specialPrediction.time1} - ${specialPrediction.prediction1}</p>
            <p>${specialPrediction.time2} - ${specialPrediction.prediction2}</p>
        `;
        tours.push(
            { time: specialPrediction.time1, prediction: specialPrediction.prediction1 },
            { time: specialPrediction.time2, prediction: specialPrediction.prediction2 }
        );
    } else {
        const time1 = addMinutes(time, 3);
        const time2 = addMinutes(time, 4);
        const prediction1 = generateNormalPrediction();
        const prediction2 = generateNormalPrediction();

        responseElement.innerHTML = `
            <p>${time1} - ${prediction1}</p>
            <p>${time2} - ${prediction2}</p>
        `;
        tours.push(
            { time: time1, prediction: prediction1 },
            { time: time2, prediction: prediction2 }
        );
    }

    updateTopTour();
}

function updateTopTour() {
    const sortedTours = [...tours].sort((a, b) => {
        if (a.prediction === "x2-x4" && b.prediction !== "x2-x4") return -1;
        if (b.prediction === "x2-x4" && a.prediction !== "x2-x4") return 1;
        if (a.prediction === "x10+" && b.prediction !== "x10+") return -1;
        if (b.prediction === "x10+" && a.prediction !== "x10+") return 1;
        return 0;
    });

    topTourList.innerHTML = sortedTours.slice(0, 5)
        .map(tour => `<li><span>${tour.time}</span> - ${tour.prediction}</li>`)
        .join("");
}

// Événements
registerBtn.addEventListener("click", handleRegistration);
logoutBtn.addEventListener("click", logout);
updateButton.addEventListener("click", updateDisplay);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('aviator_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainInterface();
    }
});
