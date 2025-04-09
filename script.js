document.addEventListener('DOMContentLoaded', function() {
    const contactSupportBtn = document.getElementById('contact-support');
    
    // Empêcher toute interaction avec le formulaire
    document.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // Désactiver tous les champs de formulaire
    const allInputs = document.querySelectorAll('input, button, textarea, select');
    allInputs.forEach(input => {
        input.setAttribute('disabled', 'disabled');
    });

    // Gestion du bouton de contact (simulé)
    contactSupportBtn.addEventListener('click', function() {
        alert("Service support indisponible pour le moment. Veuillez réessayer plus tard.");
        return false;
    });

    // Bloquer la navigation
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
    });

    // Empêcher l'accès à la console
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    
    // Message dans la console (visible uniquement si la console est ouverte avant le chargement)
    console.log("%cACCÈS BLOQUÉ", "color: red; font-size: 40px; font-weight: bold;");
    console.log("%cLe site est temporairement inaccessible.", "color: white; font-size: 16px;");
});
