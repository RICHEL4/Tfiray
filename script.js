// Configuration des comptes
const appConfig = {
  masterPassword: "t@f@1r@y", // Mot de passe principal
  validCodes: {
    '1012': { used: false, phone: '' },
    '2345': { used: false, phone: '' },
    '6363': { used: false, phone: '' },
    '6969': { used: false, phone: '' },
    '9878': { used: false, phone: '' },
    '4125': { used: false, phone: '' },
    '7485': { used: false, phone: '' }
  }
};

let isAuthenticated = false;
const predictionsCache = {};
let currentAuthStep = 1;

// Initialisation
function init() {
  checkSavedSession();
  updateClock();
  setInterval(updateClock, 1000);
  preventInspection();
}

// Vérifier une session existante
function checkSavedSession() {
  const savedSession = localStorage.getItem('aviatorSession');
  if (savedSession) {
    const session = JSON.parse(savedSession);
    if (session.expires > Date.now() && appConfig.validCodes[session.code]) {
      isAuthenticated = true;
      showAppContent();
    } else {
      localStorage.removeItem('aviatorSession');
    }
  }
}

// Étape 1: Vérification du mot de passe
function verifyPassword() {
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('passwordError');
  
  if (password === appConfig.masterPassword) {
    document.getElementById('passwordContainer').classList.remove('active');
    document.getElementById('codeContainer').classList.add('active');
    currentAuthStep = 2;
  } else {
    errorElement.textContent = 'Mot de passe incorrect';
  }
}

// Étape 2: Vérification du code d'activation
function verifyCode() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const activationCode = document.getElementById('activationCode').value;
  const errorElement = document.getElementById('codeError');
  
  // Validation
  if (!phoneNumber || phoneNumber.length < 10 || !/^[0-9]+$/.test(phoneNumber)) {
    errorElement.textContent = 'Numéro invalide';
    return;
  }
  
  if (!appConfig.validCodes[activationCode]) {
    errorElement.textContent = 'Code invalide';
    return;
  }
  
  if (appConfig.validCodes[activationCode].used) {
    errorElement.textContent = 'Code déjà utilisé';
    return;
  }
  
  // Activer le compte
  appConfig.validCodes[activationCode].used = true;
  appConfig.validCodes[activationCode].phone = phoneNumber;
  
  // Sauvegarder la session (valide 30 jours)
  const session = {
    code: activationCode,
    phone: phoneNumber,
    expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
  };
  localStorage.setItem('aviatorSession', JSON.stringify(session));
  
  isAuthenticated = true;
  showAppContent();
}

// Afficher l'application
function showAppContent() {
  document.getElementById('passwordContainer').style.display = 'none';
  document.getElementById('codeContainer').style.display = 'none';
  document.getElementById('appContent').style.display = 'block';
}

// Fonctions pour les prédictions (inchangées)
function hashTime(timeStr) {
  let hash = 0;
  for (let i = 0; i < timeStr.length; i++) {
    hash = (hash << 5) - hash + timeStr.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function generatePrediction() {
  if (!isAuthenticated) return;
  
  const timeInput = document.getElementById('timeInput').value;
  if (!timeInput) {
    document.getElementById('result').innerHTML = '<div class="risk">Veuillez sélectionner une heure</div>';
    return;
  }

  // Génération des prédictions...
  // (Conserver le code existant de génération des prédictions)
}

// Empêcher l'inspection
function preventInspection() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
    }
  });
}

// Horloge
function updateClock() {
  const now = new Date();
  document.getElementById('liveClock').textContent = now.toLocaleTimeString('fr-FR');
}

// Initialiser l'application
window.onload = init;
