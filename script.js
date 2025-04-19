// Codes d'activation valides
const validCodes = ['1012', '2345', '6363', '6969', '9878', '4125', '7485'];
let isAuthenticated = false;

// Configuration des multiplicateurs fixes
const PREDICTION_CONFIG = {
  firstMultiplier: 4.5,    // Premier multiplicateur fixe
  secondMultiplier: 5.2,   // Deuxième multiplicateur fixe
  riskLevel: 50,           // Niveau de risque fixe
  firstDelay: 3,           // Délai en minutes pour la première prédiction
  secondDelay: 4           // Délai en minutes pour la deuxième prédiction
};

// Vérifier l'authentification
function checkAuth() {
  const authContainer = document.getElementById('authContainer');
  const appContent = document.getElementById('appContent');
  
  if (isAuthenticated) {
    authContainer.style.display = 'none';
    appContent.style.display = 'block';
    appContent.classList.add('fade-in');
  } else {
    authContainer.style.display = 'block';
    appContent.style.display = 'none';
  }
}

// Vérification des identifiants
function verifyAuth() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const activationCode = document.getElementById('activationCode').value.trim();
  const errorElement = document.getElementById('authError');
  
  errorElement.textContent = '';
  
  if (!phoneNumber || phoneNumber.length < 10 || !/^[0-9]+$/.test(phoneNumber)) {
    errorElement.textContent = 'Numéro de téléphone invalide';
    return;
  }
  
  if (!validCodes.includes(activationCode)) {
    errorElement.textContent = 'Code d\'activation incorrect';
    return;
  }
  
  isAuthenticated = true;
  checkAuth();
}

// Mise à jour de l'horloge en temps réel
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  document.getElementById('liveClock').textContent = timeString;
}

// Calcul de l'heure future
function calculateFutureTime(baseTime, minutesToAdd) {
  const time = new Date(baseTime);
  time.setMinutes(time.getMinutes() + minutesToAdd);
  return time;
}

// Formatage de l'heure
function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Génération des prédictions fixes
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

  const [hours, minutes] = timeInput.split(':').map(Number);
  const baseTime = new Date();
  baseTime.setHours(hours, minutes, 0, 0);

  const firstPredictionTime = calculateFutureTime(baseTime, PREDICTION_CONFIG.firstDelay);
  const secondPredictionTime = calculateFutureTime(baseTime, PREDICTION_CONFIG.secondDelay);

  resultDiv.innerHTML = `
    <h2>Résultats de prédiction</h2>
    <div class="prediction">
      <p><strong>Heure :</strong> ${formatTime(firstPredictionTime)}</p>
      <p><strong>Multiplicateur :</strong> x${PREDICTION_CONFIG.firstMultiplier.toFixed(1)}</p>
    </div>
    <div class="prediction">
      <p><strong>Heure :</strong> ${formatTime(secondPredictionTime)}</p>
      <p><strong>Multiplicateur :</strong> x${PREDICTION_CONFIG.secondMultiplier.toFixed(1)}</p>
    </div>
    <div class="risk">Niveau de risque conseillé : ${PREDICTION_CONFIG.riskLevel}%</div>
  `;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Empêcher le zoom sur mobile
  document.addEventListener('gesturestart', (e) => e.preventDefault());
});
