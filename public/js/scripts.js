"use strict";
let numEtape = 0;
let sections;
let boutonSuivant;
let boutonPrecedent;
let boutonDonner;
let touslesBoutonsRadios;
let btnRadiosValeurDon;
let btnRadiosDon;
let checkboxDons;
let liensNavigation;
let dedicaceEstCheck = false;
let entrepriseEstCheck = false;
let divAutreMontant;
let champAffiche = false;
let champEmail;
let champNumeroCarte;
/*** RECUPÉRATION DES DONNÉES ENTRÉES PAR L'UTILISATEUR */
// Étape don
let typeDonAEntree = document.getElementById('typeDeDon');
let valeurDonAEntree = document.getElementById('valeurDuDon');
let estDedicaceAEntree = document.getElementById('reponseDon');
let nomDedicaceAEntree = document.getElementById('nomDedicace');
// Étape donneur
let estEntrepriseAEntree = document.getElementById('reponseEntreprise');
let nomEntrepriseAEntree = document.getElementById('nomEntreprise');
let genreAEntree = document.getElementById('infosGenre');
let nomAEntree = document.getElementById('donneesNom');
let prenomAEntree = document.getElementById('donneesPrenom');
let courrielAEntree = document.getElementById('donneesCourriel');
let telephoneAEntree = document.getElementById('donneesTelephone');
let adresseAEntree = document.getElementById('donneesAdresse');
let codepostalAEntree = document.getElementById('donneesCodePostal');
let numAppAEntre = document.getElementById('donneesNumApp');
let paysAEntree = document.getElementById('donneesPays');
let provinceAEntree = document.getElementById('donneesProvince');
// Étape paiement
let nomTitulaireAEntree = document.getElementById('donnesTitulaire');
let numCarteAEntree = document.getElementById('donnesNumeroCarte');
let dateExpAEntree = document.getElementById('donnesExpCarte');
let cvvAEntree = document.getElementById('donnesNumeroCvv');
let paysProvinceJSON;
let messagesErreur;
initaliser();
function initaliser() {
    // const formulaire :HTMLFormElement = 
    // GENERALE
    sections = document.querySelectorAll('section');
    boutonSuivant = document.getElementById('btnSuivant');
    boutonPrecedent = document.getElementById('btnRetour');
    boutonDonner = document.getElementById('btnDonner');
    cacherSections();
    afficherEtape(numEtape);
    obtenirMessage();
    boutonSuivant.addEventListener('click', naviguerSuivant);
    boutonPrecedent.addEventListener('click', naviguerRetour);
    // boutonDonner.addEventListener('click', naviguerSuivant);
    liensNavigation = document.querySelectorAll('.etat-etape');
    liensNavigation.forEach((leLien) => {
        leLien.addEventListener('click', (event) => {
            const leNumDeLienClique = parseInt(leLien.dataset.etape);
            naviguerParLiensNav(event, leNumDeLienClique);
        });
    });
    /*
    ÉTAPE 1 --> VOTRE DON
    ***Selection des boutons radios :
    ****** Choix des dons
    ****** Choix de la valeur des dons + le champ caché Autre montant
    ***Selection des checkbox + le champ caché décdicae
    */
    btnRadiosDon = document.querySelectorAll("input[name='don']");
    btnRadiosDon.forEach((btnDonChoisi) => {
        connaitreValeur(btnDonChoisi);
    });
    touslesBoutonsRadios = document.querySelectorAll("input[type='radio']");
    touslesBoutonsRadios.forEach((unBtnRadio) => {
        /**** Debut du code provenant de Gemini */
        unBtnRadio.addEventListener('click', (event) => {
            const leBtnClique = event.currentTarget;
            connaitreValeur(leBtnClique);
        });
    });
    // ***** Fin du code provenant de Gemini
    btnRadiosValeurDon = document.querySelectorAll("input[name='valeurDon']");
    btnRadiosValeurDon.forEach((btnChoisi) => {
        btnChoisi.addEventListener('click', afficherLesChampsCache);
    });
    divAutreMontant = document.querySelector('.donAutreCache');
    checkboxDons = document.querySelectorAll(".checkboxDons");
    console.log(checkboxDons);
    checkboxDons.forEach((unCheckboxDon) => {
        unCheckboxDon.addEventListener('click', (event) => {
            const leCheckboxClique = event.currentTarget;
            afficherChampCheckbox(leCheckboxClique);
        });
        // afficherChampCheckbox)
    });
    /*
    ÉTAPE 2 --> INFORMATIONS SUR LE DONNEUR
    ***Selection des boutons radios :
    ****** Choix des dons
    ****** Choix de la valeur des dons + le champ caché Autre montant
    ***Selection des checkbox + le champ caché entreprise
    ***Entrée du nom du donneur
    ***Entrée du prenom du donneur
    ***Entrée de l'adresse courriel du donneur
    ***Entrée du telephone du donneur
    ***Entrée de l'adresse du donneur
    ***Entrée du numéro d'appartement du donneur
    ***Entrée du code postal du donneur
    ***Entrée du pays du donneur
    ***Entrée de la province du donneur
    */
    champEmail = document.getElementById('email');
    champEmail.addEventListener('change', faireValiderEmail);
    obtenirPays();
    /*
    ÉTAPE 3 --> PAIEMENT
    ***Entrée du nom du titulaire de la carte
    ***Entrée du numéro de carte
    ***Entrée de la date d'expiration
    ***Entrée du numéro de cvv
    */
    const champNumeroCarte = document.getElementById('numCarteCredit');
    champNumeroCarte.addEventListener('change', faireValiderNumCarte);
}
async function obtenirMessage() {
    const reponse = await fetch('objJSONMessages.json');
    messagesErreur = await reponse.json();
}
// OBTENIR LE PAYS DU DONNEUR
async function obtenirPays() {
    // ENVOI DE LA LISTE DES PAYS DANS LE CHAMP SELECT
    // ENVOI DE LA LISTE DES REGIONS DANS LE CHAMP SELECT
    // ENVOI DE LA LISTE DES PROVINCE DANS LE CHAMP SELECT
    // ENVOI DE LA LISTE DES ÉTATS DANS LE CHAMP SELECT
    const reponse = await fetch('pays_prov_etats.json');
    // console.log(reponse)
    paysProvinceJSON = await reponse.json();
    // créer les élémemts options pour les inputs de la balise selct
    const listePays = document.getElementById('pays');
    const leInputPays = document.getElementById('listePays');
    const leInputProvince = document.getElementById('listeProvince');
    const listeProvince = document.getElementById('province');
    const inputEtats = document.getElementById('listeEtat');
    const listeEtats = document.getElementById('etat');
    const paysConteneur = document.getElementById('pays_conteneur');
    const provinceContneur = document.getElementById('province_conteneur');
    const etatConteneur = document.getElementById('etat_conteneur');
    paysProvinceJSON.pays.forEach((region) => {
        const elementRegion = document.createElement('option');
        elementRegion.value = region.name;
        elementRegion.textContent = region.name;
        listePays.appendChild(elementRegion);
    });
    paysProvinceJSON.provinces.forEach((region) => {
        const elementRegion = document.createElement('option');
        elementRegion.value = region.name;
        elementRegion.textContent = region.name;
        listeProvince.appendChild(elementRegion);
    });
    paysProvinceJSON.etats.forEach((region) => {
        const elementRegion = document.createElement('option');
        elementRegion.value = region.name;
        elementRegion.textContent = region.name;
        listeEtats.appendChild(elementRegion);
    });
    provinceContneur.classList.add('cache');
    provinceContneur.classList.add('cacher');
    etatConteneur.classList.add('cache');
    etatConteneur.classList.add('cacher');
    inputEtats.disabled = true;
    leInputProvince.disabled = true;
    leInputPays.addEventListener('change', () => {
        if (leInputPays.value == 'Canada') {
            leInputProvince.disabled = false;
            inputEtats.disabled = true;
            etatConteneur.classList.add('cache');
            etatConteneur.classList.add('cacher');
            provinceContneur.classList.remove('cache');
            provinceContneur.classList.remove('cacher');
        }
        else if (leInputPays.value == 'United States of America (the)') {
            leInputProvince.disabled = true;
            inputEtats.disabled = false;
            provinceContneur.classList.add('cache');
            etatConteneur.classList.remove('cache');
            provinceContneur.classList.add('cacher');
            etatConteneur.classList.remove('cacher');
        }
        else {
            provinceContneur.classList.add('cache');
            etatConteneur.classList.add('cache');
            provinceContneur.classList.add('cacher');
            etatConteneur.classList.add('cacher');
            inputEtats.disabled = true;
            leInputProvince.disabled = true;
        }
    });
}
// CONNAITRE LA VALEUR DES BOUTON RADIOS CLIQUÉS
function connaitreValeur(leBoutonClique) {
    if (leBoutonClique.checked == true) {
        return leBoutonClique.value;
    }
}
// APPELER VALIDATION DU CHAMP EMAIL
function faireValiderEmail(event) {
    const monInput = event.currentTarget;
    validerEmail(monInput);
}
// APPELER VALIDATION DU CHAMP DU NUMÉRO DE LA CARTE BANCAIRE
function faireValiderNumCarte(event) {
    const monInput = event.currentTarget;
    validerCarteCredit(monInput);
}
// VALIDATION D'UN CHAMP
function validerChamp(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[a-zA-ZÀ-ÿ\s\']+$/;
    const leTexte = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leTexte) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
// VALIDATION DU CHAMP EMAIL
function validerEmail(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const leEmail = champ.value;
    const expresRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    const tldSuspicieux = [
        '.ru',
        '.cn',
        '.click',
        '.party',
    ];
    const erreursCommunes = {
        'hotnail.fr': 'hotmail.fr',
        'hotnail.com': 'hotmail.com',
        'gnail.com': 'gmail.com',
        'gnail.fr': 'gmail.fr',
        'yahooo.com': 'yahoo.com',
        'yahooo.fr': 'yahoo.fr',
    };
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leEmail) == false && messagesErreur[id].pattern) {
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else if (tldSuspicieux.some((tld) => {
        const contientSuspect = leEmail.toLowerCase().endsWith(tld);
        return contientSuspect;
    }) && messagesErreur[id].tldSuspicieux) {
        valide = false;
        erreurElement.innerText = messagesErreur[id].tldSuspicieux;
    }
    else {
        const valeursCles = Object.keys(erreursCommunes);
        const erreurCle = valeursCles.find((domaine) => {
            return leEmail.toLowerCase().includes(domaine);
        });
        if (erreurCle) {
            valide = false;
            const domaineCorrect = erreursCommunes[erreurCle];
            const monMessage = messagesErreur[id].erreursCommunes?.replace('{domaine}', domaineCorrect);
            erreurElement.innerText = monMessage;
        }
        else {
            valide = true;
            erreurElement.innerText = "";
        }
    }
    return valide;
}
//VALIDATION DU CHAMP TELEPHONE
function validerTelephone(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const leTelephone = champ.value;
    const expresRegex = /^\(?([0-9]{3})\)?[ ]?([0-9]{3})[-]?([0-9]{4})$/;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leTelephone) == false && messagesErreur[id].pattern) {
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
//VALIDATION DU CHAMP ADRESSE
function validerAdresse(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[0-9]+[a-zA-ZÀ-ÿ0-9 \-]+$/;
    const lAdresse = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(lAdresse) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
//VALIDATION DU CHAMP CODE POSTAL
function validerCodePostal(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[a-zA-Z][0-9][a-zA-Z] ?[0-9][a-zA-Z][0-9]$/;
    const leCodePostal = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leCodePostal) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
//VALIDATION DU CHAMP DATALIST
function validerListeDeSelection(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
//VALIDATION DU CHAMP CODE POSTAL
function validerCarteCredit(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/;
    const leNumDeCarte = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leNumDeCarte) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
// VALIDATION DU CHAMP DE DATE D'EXPIRATION
function validerChampDate(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4})$/;
    const laDate = champ.value;
    const dateAujourdhui = new Date();
    let leMoisActuelle = dateAujourdhui.getMonth() + 1;
    let lAnneeActuelle = dateAujourdhui.getFullYear();
    let mois;
    let annee;
    const nbMoisMaximum = 12;
    if (laDate.length == 7) {
        mois = parseInt(laDate.substring(0, 2));
        annee = parseInt(laDate.substring(3, 7));
    }
    else if (laDate.length == 6) {
        mois = parseInt(laDate.substring(0, 2));
        annee = parseInt(laDate.substring(2, 6));
    }
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(laDate) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        if (mois > nbMoisMaximum) {
            erreurElement.innerText = messagesErreur[id].dureeExedee;
        }
        else {
            erreurElement.innerText = messagesErreur[id].pattern;
        }
        valide = false;
    }
    else {
        if (annee < lAnneeActuelle) {
            erreurElement.innerText = messagesErreur[id].duree;
            valide = false;
        }
        else if (annee == lAnneeActuelle && mois <= leMoisActuelle) {
            erreurElement.innerText = messagesErreur[id].duree;
            valide = false;
        }
        else {
            valide = true;
            erreurElement.innerText = "";
        }
    }
    return valide;
}
function validerChampCvv(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[0-9]{3,4}$/;
    const leNumDeCvv = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leNumDeCvv) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
function validerChampNumerique(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^\d+$/;
    const leMontantEntre = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leMontantEntre) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else if (champ.validity.rangeOverflow && messagesErreur[id].longeur) {
        // Valeur numérique supérieure à max
        erreurElement.innerText = messagesErreur[id].longeur;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    console.log(valide);
    return valide;
}
function validerChampNumApp(champ) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^\d+$/;
    const leNumApp = champ.value;
    // Vérifie chaque type d'erreur de validation
    if (expresRegex.test(leNumApp) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else if (champ.validity.rangeOverflow && messagesErreur[id].longeur) {
        // Valeur numérique supérieure à max
        erreurElement.innerText = messagesErreur[id].longeur;
        valide = false;
    }
    else {
        // Champ obligatoire vide (attribut required)
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
//AFFICHAGE DES CHAMPS CACHÉ
function afficherLesChampsCache() {
    btnRadiosValeurDon.forEach((btnChoisi) => {
        if (btnChoisi.checked == true) {
            if (btnChoisi.value !== 'donAutre') {
                champAffiche = false;
                divAutreMontant.classList.add("cache");
                divAutreMontant.classList.add("cacher");
            }
            else {
                champAffiche = true;
                divAutreMontant.classList.remove("cache");
                divAutreMontant.classList.remove("cacher");
            }
        }
    });
    return champAffiche;
}
// AFFICHAGE DES CHAMPS SI CHECKBOX EST ACTIVE
function afficherChampCheckbox(checkBoxCheck) {
    let laDivCache = document.querySelector('.div_' + checkBoxCheck.value);
    if (checkBoxCheck.value == "ouiDedicace") {
        dedicaceEstCheck = checkBoxCheck.checked;
    }
    else if ((checkBoxCheck.value == "ouiNomEntreprise")) {
        entrepriseEstCheck = checkBoxCheck.checked;
    }
    if (checkBoxCheck.checked == true) {
        laDivCache.classList.remove('cache');
        laDivCache.classList.remove('cacher');
    }
    else {
        laDivCache.classList.add('cache');
        laDivCache.classList.add('cacher');
    }
    return laDivCache;
}
// VALIDATION DES ÉTAPES
function validerEtape(etape) {
    let etapeValide = false;
    switch (etape) {
        case 0:
            const leTypeDeDonChecked = document.querySelector("input[name='don']:checked");
            const laValeurDeDonChecked = document.querySelector("input[name='valeurDon']:checked");
            // attribution du type de don
            typeDonAEntree.innerHTML = leTypeDeDonChecked.value;
            valeurDonAEntree.innerText = laValeurDeDonChecked.value;
            const montantElement = document.getElementById('autreMontant');
            const nomDedicaceElement = document.getElementById('ouiDedicace');
            let leCheckEstValide = false;
            let leChampEstValide = false;
            if (champAffiche) {
                montantElement.required = true;
                const montantValide = validerChampNumerique(montantElement);
                if (!montantValide) {
                    etapeValide = false;
                }
                else {
                    // attribution de la valeur de don
                    leChampEstValide = true;
                    valeurDonAEntree.innerText = montantElement.value;
                }
            }
            else {
                leChampEstValide = true;
                montantElement.required = false;
            }
            if (dedicaceEstCheck) {
                nomDedicaceElement.required = true;
                const nomDedicaceValide = validerChamp(nomDedicaceElement);
                estDedicaceAEntree.innerText = "oui";
                if (!nomDedicaceValide) {
                    etapeValide = false;
                }
                else {
                    leCheckEstValide = true;
                    nomDedicaceAEntree.classList.remove('cache');
                    nomDedicaceAEntree.classList.remove('cacher');
                    nomDedicaceAEntree.innerText = `En l'honneur de ${nomDedicaceElement.value}`;
                }
            }
            else {
                leCheckEstValide = true;
                nomDedicaceElement.required = false;
                estDedicaceAEntree.innerText = "non";
                nomDedicaceAEntree.classList.add('cache');
                nomDedicaceAEntree.classList.add('cacher');
            }
            if (leCheckEstValide && leChampEstValide) {
                etapeValide = true;
            }
            break;
        case 1:
            const nomElement = document.getElementById('nom');
            const prenomElement = document.getElementById('prenom');
            const genreDonneur = document.querySelector("input[name='genre']:checked");
            const emailElement = document.getElementById('email');
            const telephoneElement = document.getElementById('telephone');
            const adresseElement = document.getElementById('adresse');
            const codePostalElement = document.getElementById('codePostal');
            const listePaysElement = document.getElementById('listePays');
            const listeProvinceElement = document.getElementById('listeProvince');
            const leNumeroDapp = document.getElementById('numApp');
            // const listeEtatElement = document.getElementById('listeEtat') as HTMLInputElement;
            const nomValide = validerChamp(nomElement);
            const prenomValide = validerChamp(prenomElement);
            const emailValide = validerEmail(emailElement);
            const telephoneValide = validerTelephone(telephoneElement);
            const adresseValide = validerAdresse(adresseElement);
            const codePostalValide = validerCodePostal(codePostalElement);
            const listePaysValide = validerListeDeSelection(listePaysElement);
            const listeProvinceValide = validerListeDeSelection(listeProvinceElement);
            // const listeEtatValide = validerListeDeSelection(listeEtatElement);
            const nomEntrepriseElement = document.getElementById('ouiNomEntreprise');
            if (!nomValide || !prenomValide || !emailValide || !telephoneValide || !adresseValide || !codePostalValide || !listePaysValide || !listeProvinceValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
                genreAEntree.innerText = genreDonneur.value;
                nomAEntree.innerText = nomElement.value;
                prenomAEntree.innerText = prenomElement.value;
                courrielAEntree.innerText = emailElement.value;
                telephoneAEntree.innerText = telephoneElement.value;
                adresseAEntree.innerText = adresseElement.value;
                codepostalAEntree.innerText = codePostalElement.value;
                paysAEntree.innerText = listePaysElement.value;
                provinceAEntree.innerText = listeProvinceElement.value;
            }
            if (leNumeroDapp.value.trim() == "") {
                leNumeroDapp.required = false;
                numAppAEntre.innerText = "Aucun numéro d'appartement";
                let champErreur = document.getElementById('erreur_numApp');
                champErreur.innerText = "";
            }
            else {
                leNumeroDapp.required = true;
                const numAppValide = validerChampNumApp(leNumeroDapp);
                if (!numAppValide) {
                    etapeValide = false;
                }
                else {
                    numAppAEntre.innerText = `Votre numéro d'appartement ${leNumeroDapp.value}`;
                }
            }
            if (entrepriseEstCheck == true) {
                nomEntrepriseElement.required = true;
                const nomEntrepriseValide = validerChamp(nomEntrepriseElement);
                estEntrepriseAEntree.innerText = "oui";
                if (!nomEntrepriseValide) {
                    etapeValide = false;
                    console.log('echec encore');
                }
                else {
                    nomEntrepriseAEntree.classList.remove('cache');
                    nomEntrepriseAEntree.classList.remove('cacher');
                    nomEntrepriseAEntree.innerText = `Nom de l'entreprise ${nomEntrepriseElement.value}`;
                }
            }
            else {
                nomEntrepriseElement.required = false;
                estEntrepriseAEntree.innerText = "non";
                nomEntrepriseAEntree.classList.add('cache');
                nomEntrepriseAEntree.classList.add('cacher');
            }
            break;
        case 2:
            const titulaireCarteElement = document.getElementById('titulaireCarte');
            const numCarteElement = document.getElementById('numCarteCredit');
            const dateExpElement = document.getElementById('dateExpiration');
            const cvvElement = document.getElementById('cvv');
            const titulaireCarteValide = validerChamp(titulaireCarteElement);
            const numCarteValide = validerCarteCredit(numCarteElement);
            const dateExpValide = validerChampDate(dateExpElement);
            const cvvValide = validerChampCvv(cvvElement);
            // const listeEtatValide = validerListeDeSelection(listeEtatElement);
            if (!numCarteValide || !titulaireCarteValide || !dateExpValide || !cvvValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
                nomTitulaireAEntree.innerText = titulaireCarteElement.value.toLocaleUpperCase();
                let leNumeroAAfficher = numCarteElement.value.substring(12, 16);
                let leNumeroACacher = numCarteElement.value.substring(0, 11).replace(numCarteElement.value.substring(0, 11), "************");
                numCarteAEntree.innerText = leNumeroACacher + leNumeroAAfficher;
                dateExpAEntree.innerText = dateExpElement.value;
                cvvAEntree.innerText = cvvElement.value;
            }
            break;
        case 3:
            break;
    }
    return etapeValide;
}
// FAIRE LA NAVIGATION DES ÉTAPES PAR LES LIENS DE NAVIGATION
function naviguerParLiensNav(event, leNumeroDEtape) {
    event.preventDefault();
    if (leNumeroDEtape <= numEtape) {
        numEtape = leNumeroDEtape;
        afficherEtape(numEtape);
    }
    else {
        console.log('Ne peux pas avancer !');
    }
}
// AFFICHAGE DES ÉTAPES
function afficherEtape(lesEtapes) {
    console.log("Voici l'étape : " + lesEtapes);
    const etapes = document.querySelectorAll('section');
    const etatElement0 = document.getElementById('etat_etape0');
    const etatElement1 = document.getElementById('etat_etape1');
    const etatElement2 = document.getElementById('etat_etape2');
    const etatElement3 = document.getElementById('etat_etape3');
    // const etatLiensElement0: any = document.querySelector('#etat_etape0 + a');
    // const etatLiensElement1: any = document.querySelector('#etat_etape1 + a ');
    // const etatLiensElement2: any = document.querySelector('#etat_etape2 + a');
    // const etatLiensElement3: any = document.querySelector('#etat_etape3 + a');
    cacherSections();
    if (lesEtapes >= 0 && lesEtapes < etapes.length) {
        etapes[lesEtapes].classList.remove('cache');
        etapes[lesEtapes].classList.remove('cacher');
    }
    if (lesEtapes == 0) {
        boutonPrecedent.classList.add('cache');
        boutonSuivant.classList.remove('cache');
        boutonDonner.classList.add('cache');
        boutonPrecedent.classList.add('cacher');
        boutonSuivant.classList.remove('cacher');
        boutonDonner.classList.add('cacher');
        etatElement0.classList.add('enCours');
        etatElement1.classList.remove('enCours');
        etatElement1.classList.remove('menu__lien--active');
        etatElement1.classList.add('menu__lien--inactive');
        etatElement2.classList.remove('enCours');
        etatElement2.classList.remove('menu__lien--active');
        etatElement2.classList.add('menu__lien--inactive');
        etatElement3.classList.remove('enCours');
        etatElement3.classList.add('menu__lien--inactive');
    }
    else if (lesEtapes == 1) {
        boutonPrecedent.classList.remove('cache');
        boutonSuivant.classList.remove('cache');
        boutonDonner.classList.add('cache');
        boutonPrecedent.classList.remove('cacher');
        boutonSuivant.classList.remove('cacher');
        boutonDonner.classList.add('cacher');
        etatElement0.classList.remove('enCours');
        etatElement0.classList.add('menu__lien--active');
        etatElement1.classList.add('enCours');
        etatElement1.classList.remove('menu__lien--inactive');
        etatElement1.setAttribute('aria-disabled', 'false');
        etatElement2.classList.remove('enCours');
        etatElement2.classList.remove('menu__lien--active');
        etatElement2.classList.add('menu__lien--inactive');
        etatElement3.classList.remove('enCours');
        etatElement3.classList.add('menu__lien--inactive');
    }
    else if (lesEtapes == 2) {
        boutonPrecedent.classList.remove('cache');
        boutonSuivant.classList.remove('cache');
        boutonDonner.classList.add('cache');
        boutonPrecedent.classList.remove('cacher');
        boutonSuivant.classList.remove('cacher');
        boutonDonner.classList.add('cacher');
        etatElement1.classList.remove('enCours');
        etatElement1.classList.add('menu__lien--active');
        etatElement1.classList.remove('menu__lien--inactive');
        etatElement2.classList.add('enCours');
        etatElement2.classList.remove('menu__lien--inactive');
        etatElement3.classList.remove('enCours');
        etatElement3.classList.add('menu__lien--inactive');
    }
    else if (lesEtapes == 3) {
        boutonPrecedent.classList.remove('cache');
        boutonSuivant.classList.add('cache');
        boutonDonner.classList.remove('cache');
        boutonPrecedent.classList.remove('cacher');
        boutonSuivant.classList.add('cacher');
        boutonDonner.classList.remove('cacher');
        etatElement1.classList.remove('menu__lien--inactive');
        etatElement2.classList.remove('enCours');
        etatElement2.classList.add('menu__lien--active');
        etatElement2.classList.remove('menu__lien--inactive');
        etatElement3.classList.add('enCours');
        etatElement3.classList.remove('menu__lien--inactive');
    }
}
// CACHE LES SECTIONS QUI NE S0NT PAS ENCORE ACTIVÉE
function cacherSections() {
    sections.forEach((uneSection) => {
        uneSection.classList.add("cache");
        uneSection.classList.add("cacher");
    });
}
// NAVIAGATION ENTRE LES ÉTAPES
function naviguerSuivant(event) {
    const etapeValider = validerEtape(numEtape);
    if (etapeValider) {
        if (numEtape < sections.length - 1) {
            numEtape++;
            afficherEtape(numEtape);
        }
    }
    else {
        event.preventDefault();
    }
}
function naviguerRetour(event) {
    if (numEtape > 0) {
        numEtape--;
        afficherEtape(numEtape);
    }
    else {
        event.preventDefault();
    }
}
