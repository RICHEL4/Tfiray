// Codes d'activation valides
const validCodes = ['1012', '2345', '6363', '6969', '9878', '4125', '7485'];
let isAuthenticated = false;

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

// Vérifier les identifiants
function verifyAuth() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const activationCode = document.getElementById('activationCode').value;
  const errorElement = document.getElementById('authError');
  
  // Réinitialiser les erreurs
  errorElement.textContent = '';
  
  // Validation du numéro
  if (!phoneNumber || phoneNumber.length < 10 || !/^[0-9]+$/.test(phoneNumber)) {
    errorElement.textContent = 'Numéro de téléphone invalide';
    return;
  }
  
  // Validation du code
  if (!validCodes.includes(activationCode)) {
    errorElement.textContent = 'Code d\'activation incorrect';
    return;
  }
  
  // Authentification réussie
  isAuthenticated = true;
  checkAuth();
  
  // Ajouter une animation
  document.getElementById('appContent').classList.add('fade-in');
}

// Horloge en temps réel
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('liveClock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// Générer les prédictions
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

  // Calcul des heures
  const [hours, minutes] = timeInput.split(':').map(Number);
  
  const timePlus3 = new Date();
  timePlus3.setHours(hours, minutes + 3);
  
  const timePlus4 = new Date();
  timePlus4.setHours(hours, minutes + 4);

  // Formatage
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Multiplicateurs aléatoires entre 4 et 6
  const getRandomMultiplier = () => {
    return (Math.random() * 2 + 4).toFixed(1); // Entre 4.0 et 6.0
  };
  
  const multiplier1 = getRandomMultiplier();
  const multiplier2 = getRandomMultiplier();

  // Niveaux de risque
  const riskLevels = [10, 20, 50, 60, 100, 150];
  const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

  // Affichage des résultats
  resultDiv.innerHTML = `
    <h2>Résultats de prédiction</h2>
    <div class="prediction">
      <p><strong>Heure :</strong> ${formatTime(timePlus3)}</p>
      <p><strong>Multiplicateur :</strong> x${multiplier1}</p>
    </div>
    <div class="prediction">
      <p><strong>Heure :</strong> ${formatTime(timePlus4)}</p>
      <p><strong>Multiplicateur :</strong> x${multiplier2}</p>
    </div>
    ${multiplier1 > 5.5 || multiplier2 > 5.5 ? 
      `<div class="risk">Niveau de risque : ${randomRisk}</div>` : ''}
  `;
}

// Initialisation
checkAuth();

// Empêcher le zoom sur mobile
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
