const messages = {};

// Vérifie chaque type d'erreur de validation
if (champ.validity.valueMissing && messages.valueMissing) {
    // Champ obligatoire vide (attribut required)
    messageErreur = messages.valueMissing;
} else if (champ.validity.typeMismatch && messages.typeMismatch) {
    // Type de données incorrect (email, url, tel, etc.)
    messageErreur = messages.typeMismatch;
} else if (champ.validity.patternMismatch && messages.patternMismatch) {
    // Ne correspond pas au pattern regex défini
    messageErreur = messages.patternMismatch;
} else if (champ.validity.tooShort && messages.tooShort) {
    // Valeur plus courte que minlength
    messageErreur = messages.tooShort;
} else if (champ.validity.tooLong && messages.tooLong) {
    // Valeur plus longue que maxlength
    messageErreur = messages.tooLong;
} else if (champ.validity.rangeUnderflow && messages.rangeUnderflow) {
    // Valeur numérique inférieure à min
    messageErreur = messages.rangeUnderflow;
} else if (champ.validity.rangeOverflow && messages.rangeOverflow) {
    // Valeur numérique supérieure à max
    messageErreur = messages.rangeOverflow;
} else if (champ.validity.stepMismatch && messages.stepMismatch) {
    // Valeur qui ne respecte pas l'attribut step
    messageErreur = messages.stepMismatch;
} else if (champ.validity.badInput && messages.badInput) {
    // Saisie que le navigateur ne peut pas convertir (ex: texte dans un champ number)
    messageErreur = messages.badInput;
} else if (champ.validity.customError && messages.customError) {
    // Erreur personnalisée définie avec setCustomValidity()
    messageErreur = messages.customError;
} else if (champ.validity.valid === false) {
    // Catch-all pour toute autre erreur de validation non spécifique
    messageErreur = messages.generic || "Veuillez corriger ce champ.";
} else {
    // Message générique si aucun message personnalisé n'est défini
    messageErreur = "Veuillez corriger ce champ.";
}