// Comptes valides avec codes et mots de passe
const validAccounts = {
  '1012': { password: 'pass1012', used: false, phone: '' },
  '2345': { password: 'pass2345', used: false, phone: '' },
  '6363': { password: 'pass6363', used: false, phone: '' },
  '6969': { password: 'pass6969', used: false, phone: '' },
  '9878': { password: 'pass9878', used: false, phone: '' },
  '4125': { password: 'pass4125', used: false, phone: '' },
  '7485': { password: 'pass7485', used: false, phone: '' }
};

let isAuthenticated = false;
const predictionsCache = {};
let currentUser = null;

// Fonction pour afficher le modal de mot de passe
function showPasswordModal(callback) {
  const modal = document.createElement('div');
  modal.className = 'password-modal';
  modal.innerHTML = `
    <div class="password-content">
      <h3>Entrez votre mot de passe</h3>
      <input type="password" id="passwordInput" placeholder="Votre mot de passe">
      <button onclick="verifyPassword()">Valider</button>
      <div id="passwordError" class="error" style="margin-top: 10px;"></div>
    </div>
  `;
  document.body.appendChild(modal);
  
  window.verifyPassword = function() {
    const password = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('passwordError');
    
    if (!password) {
      errorElement.textContent = 'Veuillez entrer un mot de passe';
      return;
    }
    
    if (callback(password)) {
      document.body.removeChild(modal);
    } else {
      errorElement.textContent = 'Mot de passe incorrect';
    }
  };
}

// Fonction de hachage pour la prédiction
function hashTime(timeStr) {
  let hash = 0;
  for (let i = 0; i < timeStr.length; i++) {
    hash = (hash << 5) - hash + timeStr.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function checkAuth() {
  const authContainer = document.getElementById('authContainer');
  const appContent = document.getElementById('appContent');
  
  if (isAuthenticated) {
    authContainer.style.display = 'none';
    appContent.style.display = 'block';
  } else {
    authContainer.style.display = 'block';
    appContent.style.display = 'none';
  }
}

function verifyAuth() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const activationCode = document.getElementById('activationCode').value;
  const errorElement = document.getElementById('authError');
  
  errorElement.textContent = '';
  
  if (!phoneNumber || phoneNumber.length < 10 || !/^[0-9]+$/.test(phoneNumber)) {
    errorElement.textContent = 'Numéro de téléphone invalide';
    return;
  }
  
  if (!validAccounts[activationCode]) {
    errorElement.textContent = 'Code d\'activation incorrect';
    return;
  }
  
  showPasswordModal((password) => {
    if (password !== validAccounts[activationCode].password) {
      errorElement.textContent = 'Mot de passe incorrect';
      return false;
    }
    
    if (validAccounts[activationCode].used && validAccounts[activationCode].phone !== phoneNumber) {
      errorElement.textContent = 'Ce code est déjà utilisé avec un autre numéro';
      return false;
    }
    
    // Authentification réussie
    validAccounts[activationCode].used = true;
    validAccounts[activationCode].phone = phoneNumber;
    isAuthenticated = true;
    currentUser = {
      phone: phoneNumber,
      code: activationCode,
      password: password
    };
    
    // Sauvegarder dans localStorage
    localStorage.setItem('aviatorAuth', JSON.stringify({
      phone: phoneNumber,
      code: activationCode
    }));
    
    checkAuth();
    document.getElementById('appContent').classList.add('fade-in');
    return true;
  });
}

function checkAuthOnLoad() {
  const savedAuth = localStorage.getItem('aviatorAuth');
  if (savedAuth) {
    const authData = JSON.parse(savedAuth);
    const activationCode = authData.code;
    
    if (validAccounts[activationCode] && 
        validAccounts[activationCode].used && 
        validAccounts[activationCode].phone === authData.phone) {
      isAuthenticated = true;
      currentUser = {
        phone: authData.phone,
        code: activationCode
      };
      
      // Pré-remplir les champs
      document.getElementById('phoneNumber').value = authData.phone;
      document.getElementById('activationCode').value = activationCode;
    } else {
      localStorage.removeItem('aviatorAuth');
    }
  }
  checkAuth();
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('liveClock').textContent = timeString;
}

function generatePrediction() {
  if (!isAuthenticated) {
    checkAuth();
    return;
  }

  const timeInput = document.getElementById('timeInput').value;
  const resultDiv = document.getElementById('result');

  if (!timeInput) {
    resultDiv.innerHTML = '<div class="risk">Veuillez sélectionner une heure valide</div>';
    return;
  }

  if (predictionsCache[timeInput]) {
    displayPredictions(predictionsCache[timeInput]);
    return;
  }

  const [hours, minutes] = timeInput.split(':').map(Number);
  
  const timePlus3 = new Date();
  timePlus3.setHours(hours, minutes + 3);
  
  const timePlus4 = new Date();
  timePlus4.setHours(hours, minutes + 4);

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const seed = hashTime(timeInput);
  
  const multiplier1 = (seededRandom(seed) * 2 + 4).toFixed(1);
  const multiplier2 = (seededRandom(seed + 1) * 2 + 4).toFixed(1);

  const riskLevels = [10, 20, 50, 60, 100, 150];
  const riskIndex = Math.floor(seededRandom(seed + 2) * riskLevels.length);
  const randomRisk = riskLevels[riskIndex];

  const predictionData = {
    timePlus3: formatTime(timePlus3),
    timePlus4: formatTime(timePlus4),
    multiplier1,
    multiplier2,
    showRisk: multiplier1 > 5.5 || multiplier2 > 5.5,
    randomRisk
  };
  
  predictionsCache[timeInput] = predictionData;
  displayPredictions(predictionData);
}

function displayPredictions(data) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <h2>Résultats de prédiction</h2>
    <div class="prediction">
      <p><strong>Heure :</strong> ${data.timePlus3}</p>
      <p><strong>Multiplicateur :</strong> x${data.multiplier1}</p>
    </div>
    <div class="prediction">
      <p><strong>Heure :</strong> ${data.timePlus4}</p>
      <p><strong>Multiplicateur :</strong> x${data.multiplier2}</p>
    </div>
    ${data.showRisk ? 
      `<div class="risk">Niveau de risque : ${data.randomRisk}</div>` : ''}
  `;
}

// Initialisation
checkAuthOnLoad();
setInterval(updateClock, 1000);
updateClock();

// Empêcher le zoom sur mobile
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Empêcher le clic droit et l'inspection
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
    e.preventDefault();
  }
});
