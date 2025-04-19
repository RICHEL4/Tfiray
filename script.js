document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments
    const themeToggle = document.getElementById('themeToggle');
    const calculateBtn = document.getElementById('calculateBtn');
    const timeInput = document.getElementById('timeInput');
    const predictionValue = document.getElementById('predictionValue');
    
    // Initialisation de l'heure
    timeInput.value = getCurrentTime();
    
    // Gestion du thème
    themeToggle.addEventListener('click', toggleTheme);
    
    // Calcul de prédiction
    calculateBtn.addEventListener('click', calculatePrediction);
    
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
    
    function calculatePrediction() {
        const time = timeInput.value;
        if (!time) return;
        
        // Simulation de calcul
        const randomMultiplier = (Math.random() * 5 + 1).toFixed(2);
        predictionValue.textContent = `${randomMultiplier}x`;
    }
    
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
});
