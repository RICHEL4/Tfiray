// Codes d'activation valides
const validCodes = ['1012', '2345', '6363', '6969', '9878', '4125', '7485'];
let isAuthenticated = false;
const predictionsCache = {};

// Fonction de hachage simple pour créer une graine basée sur l'heure
function hashTime(timeStr) {
  let hash = 0;
  for (let i = 0; i < timeStr.length; i++) {
    hash = (hash << 5) - hash + timeStr.charCodeAt(i);
    hash |= 0; // Convertir en entier 32bits
  }
  return hash;
}

// Générateur pseudo-aléatoire déterministe
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Vérifier l'authentification au chargement
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

// Vérifier les identifiants avec effet de chargement
function verifyAuth() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const activationCode = document.getElementById('activationCode').value;
  const errorElement = document.getElementById('authError');
  const authBtnText = document.getElementById('authBtnText');
  const authSpinner = document.getElementById('authSpinner');
  
  // Afficher le spinner
  authBtnText.textContent = 'Vérification...';
  authSpinner.style.display = 'inline-block';
  
  // Réinitialiser les erreurs
  errorElement.textContent = '';
  
  // Simuler un délai de vérification
  setTimeout(() => {
    // Validation du numéro
    if (!phoneNumber || phoneNumber.length < 10 || !/^[0-9]+$/.test(phoneNumber)) {
      errorElement.textContent = 'Numéro de téléphone invalide';
      authBtnText.textContent = 'Valider';
      authSpinner.style.display = 'none';
      return;
    }
    
    // Validation du code
    if (!validCodes.includes(activationCode)) {
      errorElement.textContent = 'Code d\'activation incorrect';
      authBtnText.textContent = 'Valider';
      authSpinner.style.display = 'none';
      return;
    }
    
    // Authentification réussie
    isAuthenticated = true;
    authBtnText.textContent = 'Accès autorisé';
    authSpinner.style.display = 'none';
    
    // Ajouter une animation et transition
    document.getElementById('authContainer').style.opacity = '0';
    setTimeout(() => {
      checkAuth();
      document.getElementById('appContent').classList.add('fade-in');
    }, 500);
  }, 1000);
}

// Horloge en temps réel
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('liveClock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// Générer les prédictions (déterministe basé sur l'heure)
function generatePrediction() {
  if (!isAuthenticated) {
    checkAuth();
    return;
  }

  const timeInput = document.getElementById('timeInput').value;
  const resultDiv = document.getElementById('result');
  const predictBtnText = document.getElementById('predictBtnText');
  const predictSpinner = document.getElementById('predictSpinner');
  const difficultMode = document.getElementById('difficultMode').checked;
  const toggleContainer = document.getElementById('difficultToggleContainer');

  // Style du toggle en fonction de l'état
  if (difficultMode) {
    toggleContainer.classList.add('toggle-active');
  } else {
    toggleContainer.classList.remove('toggle-active');
  }

  if (!timeInput) {
    resultDiv.innerHTML = '<div class="risk">Veuillez sélectionner une heure valide</div>';
    return;
  }

  // Afficher le spinner
  predictBtnText.textContent = 'Analyse en cours...';
  predictSpinner.style.display = 'inline-block';
  resultDiv.innerHTML = '';

  // Simuler un délai de calcul
  setTimeout(() => {
    // Vérifier le cache avec une clé qui inclut le mode
    const cacheKey = `${timeInput}-${difficultMode ? 'hard' : 'normal'}`;
    if (predictionsCache[cacheKey]) {
      displayPredictions(predictionsCache[cacheKey]);
      predictBtnText.textContent = 'Générer Prédiction';
      predictSpinner.style.display = 'none';
      return;
    }

    // Calcul des heures en fonction du mode
    const [hours, minutes] = timeInput.split(':').map(Number);
    
    const timePlus1 = new Date();
    const timePlus2 = new Date();
    
    if (difficultMode) {
      // Mode difficile: décalage de 9 et 10 minutes
      timePlus1.setHours(hours, minutes + 9);
      timePlus2.setHours(hours, minutes + 10);
    } else {
      // Mode normal: décalage de 3 et 4 minutes
      timePlus1.setHours(hours, minutes + 3);
      timePlus2.setHours(hours, minutes + 4);
    }

    // Formatage
    const formatTime = (date) => {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    // Créer une graine basée sur l'heure et le mode
    const seed = hashTime(timeInput + (difficultMode ? 'hard' : 'normal'));
    
    // Multiplicateurs déterministes (plage différente selon le mode)
    let multiplier1, multiplier2;
    
    if (difficultMode) {
      // Mode difficile: plage plus large et plus risquée
      multiplier1 = (seededRandom(seed) * 3 + 3).toFixed(1); // 3.0 - 6.0
      multiplier2 = (seededRandom(seed + 1) * 3 + 3).toFixed(1);
    } else {
      // Mode normal: plage plus stable
      multiplier1 = (seededRandom(seed) * 2 + 4).toFixed(1); // 4.0 - 6.0
      multiplier2 = (seededRandom(seed + 1) * 2 + 4).toFixed(1);
    }

    // Niveaux de risque (plus élevés en mode difficile)
    const riskLevels = difficultMode 
      ? [20, 30, 60, 80, 120, 200] 
      : [10, 20, 50, 60, 100, 150];
      
    const riskIndex = Math.floor(seededRandom(seed + 2) * riskLevels.length);
    const randomRisk = riskLevels[riskIndex];

    // Stocker dans le cache
    const predictionData = {
      timePlus1: formatTime(timePlus1),
      timePlus2: formatTime(timePlus2),
      multiplier1,
      multiplier2,
      showRisk: difficultMode ? true : (multiplier1 > 5.5 || multiplier2 > 5.5),
      randomRisk,
      isDifficult: difficultMode
    };
    
    predictionsCache[cacheKey] = predictionData;
    
    // Afficher les résultats
    displayPredictions(predictionData);
    predictBtnText.textContent = 'Générer Prédiction';
    predictSpinner.style.display = 'none';
  }, 800);
}

function displayPredictions(data) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <h2>Résultats de prédiction ${data.isDifficult ? '<span style="color:var(--accent);">(Difficile)</span>' : ''}</h2>
    <div class="prediction">
      <div>
        <p><strong>Heure :</strong> ${data.timePlus1}</p>
        <p><strong>Multiplicateur :</strong> x${data.multiplier1}</p>
      </div>
      <div class="prediction-value pulse">x${data.multiplier1}</div>
    </div>
    <div class="prediction">
      <div>
        <p><strong>Heure :</strong> ${data.timePlus2}</p>
        <p><strong>Multiplicateur :</strong> x${data.multiplier2}</p>
      </div>
      <div class="prediction-value pulse">x${data.multiplier2}</div>
    </div>
    ${data.showRisk ? 
      `<div class="risk">Niveau de risque : ${data.randomRisk}% - ${data.isDifficult ? 'Risque très élevé!' : 'Soyez prudent'}</div>` : ''}
  `;
}

// Initialisation
checkAuth();

// Empêcher le zoom sur mobile
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Focus sur le premier champ au chargement
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('phoneNumber').focus();
});
