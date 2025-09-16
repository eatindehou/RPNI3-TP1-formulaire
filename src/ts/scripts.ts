
let numEtape: number = 0;
let sections: NodeListOf<HTMLElement>;

let boutonSuivant: HTMLButtonElement;
let boutonPrecedent: HTMLButtonElement;
let boutonDonner: HTMLButtonElement;
let touslesBoutonsRadios: any;
let btnRadiosValeurDon: any;
let btnRadiosDon: any;
let checkboxDons: any;
let divCheckboxCache: any;

let estCheck: boolean = false;;
let divAutreMontant: any;
let champAffiche: boolean = false;

let champEmail: any;

/*** RECUPÉRATION DES DONNÉES ENTRÉES PAR L'UTILISATEUR */
// Étape don
let typeDeDonEntree: string;
let valeurDeDonEntree: string;
let estDedicaceEntree: string;
let nomDedicaceEntree: string

let typeDonAEntree = document.getElementById('typeDeDon') as HTMLElement;
let valeurDonAEntree = document.getElementById('valeurDuDon') as HTMLElement;
let estDedicaceAEntree = document.getElementById('reponseDon') as HTMLElement;
let nomDedicaceAEntree = document.getElementById('nomDedicace') as HTMLElement;
// Étape donneur
let estEntrepriseEntree: string;
let nomEntrepriseEntree: string;
let genreEntree: string;
let nomEntree: string;
let prenomEntree: string;
let courrielEntree: string;
let telephoneEntree: string;
let adresseEntree: string;
let codepostalEntree: string;
let paysEntree: string;
let provinceEntree: string;

let estEntrepriseAEntree = document.getElementById('typeDeDon') as HTMLElement;
let nomEntrepriseAEntree = document.getElementById('valeurDuDon') as HTMLElement;
let genreAEntree = document.getElementById('reponseDon') as HTMLElement;
let nomAEntree = document.getElementById('nomDedicace') as HTMLElement;
let prenomAEntree = document.getElementById('nomDedicace') as HTMLElement;
let courrielAEntree = document.getElementById('nomDedicace') as HTMLElement;
let telephoneAEntree = document.getElementById('nomDedicace') as HTMLElement;
let adresseAEntree = document.getElementById('nomDedicace') as HTMLElement;
let codepostalAEntree = document.getElementById('nomDedicace') as HTMLElement;
let paysAEntree = document.getElementById('nomDedicace') as HTMLElement;
let provinceAEntree = document.getElementById('nomDedicace') as HTMLElement;

// Étape paiement
let nomTitulaireEntree: string;
let numCarteEntree: string;
let dateExpEntree: string;
let cvvEntree: string;



interface messageErreur {
    vide?: string;
    pattern?: string;
    tldSuspicieux?: string;
    erreursCommunes?: string;
    duree?: string;
    dureeExedee?: string
}
interface erreursJSON {
    [fieldName: string]: messageErreur;
}
interface PaysRegion {
    name: string
    code: string
}
interface paysProvince {
    pays: PaysRegion;
    provinces: PaysRegion;
    etats: PaysRegion;
}

let paysProvinceJSON: paysProvince;
let messagesErreur: erreursJSON;
initaliser();

function initaliser() {
    // const formulaire :HTMLFormElement = 
    // GENERALE
    sections = document.querySelectorAll('section');
    boutonSuivant = document.getElementById('btnSuivant') as HTMLButtonElement;
    boutonPrecedent = document.getElementById('btnRetour') as HTMLButtonElement;
    boutonDonner = document.getElementById('btnDonner') as HTMLButtonElement;
    cacherSections();
    afficherEtape(numEtape);
    obtenirMessage();
    boutonSuivant.addEventListener('click', naviguerSuivant);
    boutonPrecedent.addEventListener('click', naviguerRetour);
    // boutonDonner.addEventListener('click', naviguerSuivant);

    /*
    ÉTAPE 1 --> VOTRE DON
    ***Selection des boutons radios :
    ****** Choix des dons
    ****** Choix de la valeur des dons + le champ caché Autre montant
    ***Selection des checkbox + le champ caché décdicae
    */
    btnRadiosDon = document.querySelectorAll("input[name='don']");

    btnRadiosDon.forEach((btnDonChoisi: any) => {
        connaitreValeur(btnDonChoisi);
    });
    touslesBoutonsRadios = document.querySelectorAll("input[type='radio']");

    touslesBoutonsRadios.forEach((unBtnRadio: any) => {
        /**** Debut du code provenant de Gemini */
        unBtnRadio.addEventListener('click', (event: Event) => {
            const leBtnClique = event.currentTarget as HTMLInputElement
            connaitreValeur(leBtnClique);
        });
    });
    // ***** Fin du code provenant de Gemini
    btnRadiosValeurDon = document.querySelectorAll("input[name='valeurDon']");
    btnRadiosValeurDon.forEach((btnChoisi: any) => {
        btnChoisi.addEventListener('click', afficherLesChampsCache);
    });
    divAutreMontant = document.querySelector('.donAutreCache');
    checkboxDons = document.querySelectorAll("input[type='checkbox']");
    checkboxDons.forEach((unCheckboxDon: any) => {
        unCheckboxDon.addEventListener('click', afficherChampCheckbox);
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
    ***Entrée du code postal du donneur
    ***Entrée du pays du donneur
    ***Entrée de la province du donneur
    */
    champEmail = document.getElementById('email');
    champEmail.addEventListener('change', faireValiderEmail);
    obtenirPays();
    // console.log(obtenirMessage());
    // console.log(obtenirPays());
}

async function obtenirMessage(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    // console.log(reponse)
    messagesErreur = await reponse.json()
    // console.log(messagesErreur)

}
// OBTENIR LE PAYS DU DONNEUR
async function obtenirPays(): Promise<void> {
    // ENVOI DE LA LISTE DES PAYS DANS LE CHAMP SELECT
    // ENVOI DE LA LISTE DES REGIONS DANS LE CHAMP SELECT
    // ENVOI DE LA LISTE DES PROVINCE DANS LE CHAMP SELECT
    // ENVOI DE LA LISTE DES ÉTATS DANS LE CHAMP SELECT
    const reponse = await fetch('pays_prov_etats.json');
    // console.log(reponse)
    paysProvinceJSON = await reponse.json()
    console.log(paysProvinceJSON)
    // créer les élémemts options pour les inputs de la balise selct
    const listePays = document.getElementById('pays') as HTMLInputElement;
    const leInputPays = document.getElementById('listePays') as HTMLInputElement;

    const leInputProvince = document.getElementById('listeProvince') as HTMLInputElement;
    const listeProvince = document.getElementById('province') as HTMLElement;

    const inputEtats = document.getElementById('listeEtat') as HTMLInputElement;
    const listeEtats = document.getElementById('etat') as HTMLElement;

    const paysConteneur = document.getElementById('pays_conteneur') as HTMLElement;
    const provinceContneur = document.getElementById('province_conteneur') as HTMLElement;
    const etatConteneur = document.getElementById('etat_conteneur') as HTMLElement;

    paysProvinceJSON.pays.forEach((region: PaysRegion) => {
        const elementRegion = document.createElement('option');
        elementRegion.value = region.name;
        elementRegion.textContent = region.name;
        listePays.appendChild(elementRegion);
    })
    paysProvinceJSON.provinces.forEach((region: PaysRegion) => {
        const elementRegion = document.createElement('option');
        elementRegion.value = region.name;
        elementRegion.textContent = region.name;
        listeProvince.appendChild(elementRegion);
    })
    paysProvinceJSON.etats.forEach((region: PaysRegion) => {
        const elementRegion = document.createElement('option');
        elementRegion.value = region.name;
        elementRegion.textContent = region.name;
        listeEtats.appendChild(elementRegion);
    })


    provinceContneur.classList.add('cache');
    etatConteneur.classList.add('cache');
    inputEtats.disabled = true;
    leInputProvince.disabled = true;

    leInputPays.addEventListener('change', () => {
        console.log('VOICI LA VALEUR DE NOTRE PATRIE ' + listePays.value);
        if (leInputPays.value == 'Canada') {
            leInputProvince.disabled = false;
            inputEtats.disabled = true;

            etatConteneur.classList.add('cache')
            provinceContneur.classList.remove('cache');
        }
        else if (leInputPays.value == 'United States of America (the)') {
            leInputProvince.disabled = true;
            inputEtats.disabled = false;

            provinceContneur.classList.add('cache');
            etatConteneur.classList.remove('cache')
        }
        else {
            provinceContneur.classList.add('cache');
            etatConteneur.classList.add('cache');
            inputEtats.disabled = true;
            leInputProvince.disabled = true;
        }

    })

}
// CONNAITRE LA VALEUR DES BOUTON RADIOS CLIQUÉS
function connaitreValeur(leBoutonClique: any) {
    if (leBoutonClique.checked == true) {
        console.log(leBoutonClique.value)
        return leBoutonClique.value
    }
}
// APPELER VALIDATION DU CHAMP EMAIL
function faireValiderEmail(event: Event) {
    const monInput = event.currentTarget as HTMLInputElement;
    validerEmail(monInput);
}
// VALIDATION D'UN CHAMP
function validerChamp(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[a-zA-ZÀ-ÿ\s]+$/
    const leTexte = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        console.log('valider champ: ' + id);
    }
    else if (expresRegex.test(leTexte) == false && messagesErreur[id].pattern) {
        console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide
}
// VALIDATION DU CHAMP EMAIL
function validerEmail(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const leEmail = champ.value
    const expresRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/

    const tldSuspicieux = [
        '.ru',
        '.cn',
        '.click',
        '.party',
    ]
    const erreursCommunes = {
        'hotnail.fr': 'hotmail.fr',
        'hotnail.com': 'hotmail.com',
        'gnail.com': 'gmail.com',
        'gnail.fr': 'gmail.fr',
        'yahooo.com': 'yahoo.com',
        'yahooo.fr': 'yahoo.fr',
    }
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        console.log('valider champ: ' + id);
    }
    else if (expresRegex.test(leEmail) == false && messagesErreur[id].pattern) {
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else if (tldSuspicieux.some(
        (tld) => {
            const contientSuspect = leEmail.toLowerCase().endsWith(tld);
            return contientSuspect;
        }) && messagesErreur[id].tldSuspicieux) {
        valide = false;
        erreurElement.innerText = messagesErreur[id].tldSuspicieux;
    }
    else {
        const valeursCles = Object.keys(erreursCommunes)
        const erreurCle = valeursCles.find((domaine) => {

            return leEmail.toLowerCase().includes(domaine)
        })
        if (erreurCle) {
            valide = false;
            const domaineCorrect = erreursCommunes[erreurCle]
            const monMessage = messagesErreur[id].erreursCommunes?.replace('{domaine}', domaineCorrect)
            erreurElement.innerText = monMessage;
        }
        else {

            valide = true;
            erreurElement.innerText = "";
        }
    }
    return valide
}
//VALIDATION DU CHAMP TELEPHONE
function validerTelephone(champ: HTMLInputElement) {
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
        console.log('valider champ: ' + id);
    }
    else if (expresRegex.test(leTelephone) == false && messagesErreur[id].pattern) {
        console.log('erreur de pattern');
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
function validerAdresse(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[0-9]+[a-zA-ZÀ-ÿ0-9 \-]+$/
    const lAdresse = champ.value
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        console.log('valider champ vide: ' + id);
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
    return valide
}
//VALIDATION DU CHAMP CODE POSTAL
function validerCodePostal(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[a-zA-Z][0-9][a-zA-Z] [0-9][a-zA-Z][0-9]$/
    const leCodePostal = champ.value
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide, expresRegex.test(leCodePostal))
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
    return valide
}
//VALIDATION DU CHAMP DATALIST
function validerListeDeSelection(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        console.log(idMessageErreur)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide
}

//VALIDATION DU CHAMP CODE POSTAL
function validerCarteCredit(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/
    const leNumDeCarte = champ.value
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide, expresRegex.test(leNumDeCarte))
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
    return valide
}

// VALIDATION DU CHAMP DE DATE D'EXPIRATION
function validerChampDate(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4})$/
    const laDate = champ.value
    const dateAujourdhui = new Date();
    let leMoisActuelle = dateAujourdhui.getMonth() + 1;
    let lAnneeActuelle = dateAujourdhui.getFullYear();
    let mois: any;
    let annee: any;
    const nbMoisMaximum: number = 12;

    if (laDate.length == 7) {
        mois = parseInt(laDate.substring(0, 2));
        annee = parseInt(laDate.substring(3, 7));
    }
    else if (laDate.length == 6) {
        mois = parseInt(laDate.substring(0, 2));
        annee = parseInt(laDate.substring(2, 6));
    }
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide, expresRegex.test(laDate))
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
    return valide
}

function validerChampCvv(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^[0-9]{3,4}$/
    const leNumDeCvv = champ.value
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide, expresRegex.test(leNumDeCvv))
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
    return valide
}

function validerChampNumerique(champ: HTMLInputElement) {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const expresRegex = /^\d+$/
    const leMontantEntre = champ.value
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide, expresRegex.test(leMontantEntre))
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
    else {
        valide = true;
        erreurElement.innerText = "";
    }
    return valide
}
//AFFICHAGE DES CHAMPS CACHÉ
function afficherLesChampsCache(): boolean {
    btnRadiosValeurDon.forEach((btnChoisi: any) => {

        if (btnChoisi.checked == true) {
            if (btnChoisi.value !== 'donAutre') {
                champAffiche = false;
                divAutreMontant.classList.add("cache");

            }
            else {
                champAffiche = true;
                divAutreMontant.classList.remove("cache");
            }
        }
    })
    return champAffiche;
}
// AFFICHAGE DES CHAMPS SI CHECKBOX EST ACTIVE
function afficherChampCheckbox(): boolean {
    estCheck = false;
    checkboxDons.forEach((unCheckboxDon: any) => {
        if (unCheckboxDon.checked) {
            divCheckboxCache = document.querySelector('.div_' + unCheckboxDon.value);
            if (unCheckboxDon.value == "ouiDedicace" || unCheckboxDon.value == "ouiNomEntreprise") {
                estCheck = true;
            }
        }
        if (estCheck) {
            divCheckboxCache.classList.remove('cache');
        }
        else {
            estCheck = false;
            divCheckboxCache.classList.add('cache');
        }
    })
    return estCheck
}

// VALIDATION DES ÉTAPES
function validerEtape(etape: number): boolean {

    let etapeValide: boolean = false;
    switch (etape) {
        case 0:
            const leTypeDeDonChecked = document.querySelector("input[name='don']:checked") as HTMLInputElement;
            const laValeurDeDonChecked = document.querySelector("input[name='valeurDon']:checked") as HTMLInputElement;
            // attribution du type de don
            typeDeDonEntree = leTypeDeDonChecked.value;
            valeurDeDonEntree = laValeurDeDonChecked.value;

            if (champAffiche || estCheck) {
                const montantElement = document.getElementById('autreMontant') as HTMLInputElement;
                const nomDedicaceElement = document.getElementById('ouiDedicace') as HTMLInputElement;
                if (champAffiche) {

                    montantElement.required = true;
                    const montantValide = validerChampNumerique(montantElement);

                    if (!montantValide) {
                        etapeValide = false;
                    }
                    else {
                        // attribution de la valeur de don
                        valeurDeDonEntree = montantElement.value;
                        etapeValide = true;
                    }
                }
                else {
                    montantElement.required = false;
                }
                if (estCheck) {
                    estDedicaceEntree = "oui";
                    nomDedicaceElement.required = true;
                    const nomDedicaceValide = validerChamp(nomDedicaceElement);

                    if (!nomDedicaceValide) {
                        etapeValide = false;
                    }
                    else {
                        etapeValide = true;
                        nomDedicaceEntree = nomDedicaceElement.value
                        nomDedicaceAEntree.classList.remove('cache');
                    }
                }
                else {
                    estDedicaceEntree = "non";
                    nomDedicaceElement.required = false;
                    nomDedicaceAEntree.classList.add('cache');
                }
            }
            else {
                estDedicaceEntree = "non";
                nomDedicaceAEntree.classList.add('cache');
                etapeValide = true;
            }

            break;
        case 1:
            console.log(estDedicaceEntree);
            const nomElement = document.getElementById('nom') as HTMLInputElement;
            const prenomElement = document.getElementById('prenom') as HTMLInputElement;
            const emailElement = document.getElementById('email') as HTMLInputElement;
            const telephoneElement = document.getElementById('telephone') as HTMLInputElement;
            const adresseElement = document.getElementById('adresse') as HTMLInputElement;
            const codePostalElement = document.getElementById('codePostal') as HTMLInputElement;
            const listePaysElement = document.getElementById('listePays') as HTMLInputElement;
            const listeProvinceElement = document.getElementById('listeProvince') as HTMLInputElement;
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

            if (estCheck) {
                const nomEntrepriseElement = document.getElementById('ouiNomEntreprise') as HTMLInputElement;
                const nomEntrepriseValide = validerChamp(nomEntrepriseElement);

                if (!nomEntrepriseValide) {
                    etapeValide = false;
                }
                else {
                    etapeValide = true;
                }
            }

            if (!nomValide || !prenomValide || !emailValide || !telephoneValide || !adresseValide || !codePostalValide || !listePaysValide || !listeProvinceValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
            }
            break;

        case 2:
            // const titulaireCarteElement = document.getElementById('titulaireCarte') as HTMLInputElement;
            // const numCarteElement = document.getElementById('numCarteCredit') as HTMLInputElement;
            // const dateExpElement = document.getElementById('dateExpiration') as HTMLInputElement;
            // const cvvElement = document.getElementById('cvv') as HTMLInputElement;

            // const titulaireCarteValide = validerChamp(titulaireCarteElement);
            // const numCarteValide = validerCarteCredit(numCarteElement);
            // const dateExpValide = validerChampDate(dateExpElement);
            // const cvvValide = validerChampCvv(cvvElement);

            // // const listeEtatValide = validerListeDeSelection(listeEtatElement);

            // if (!numCarteValide || !titulaireCarteValide || !dateExpValide || !cvvValide) {
            //     etapeValide = false;
            // }
            // else {
            //     etapeValide = true;
            // }
            etapeValide = true;
            console.log('gyuhdgsuysgdgds')

            typeDonAEntree.innerText = typeDeDonEntree;
            valeurDonAEntree.innerText = valeurDeDonEntree;
            estDedicaceAEntree.innerText = estDedicaceEntree;
            nomDedicaceAEntree.innerText += nomDedicaceEntree;

            console.log("ahhhhhhhhhhhh" + typeDonAEntree);
            break;
        case 3:
            // divDonneesEntreprise.appendChild(nomDedicaceAEntree); 


            break;

    }
    return etapeValide
}
// AFFICHAGE DES ÉTAPES
function afficherEtape(lesEtapes: number) {
    console.log("Voici l'étape : " + lesEtapes);
    const etapes: NodeListOf<HTMLElement> = document.querySelectorAll('section');
    cacherSections();
    if (lesEtapes >= 0 && lesEtapes < etapes.length) {
        etapes[lesEtapes].classList.remove('cache');
    }
    if (lesEtapes == 0) {
        boutonPrecedent.classList.add('cache');
        boutonSuivant.classList.remove('cache');
        boutonDonner.classList.add('cache');
    }
    else if (lesEtapes == 1) {
        console.log(lesEtapes)
        boutonPrecedent.classList.remove('cache');
        boutonSuivant.classList.remove('cache');
        boutonDonner.classList.add('cache');
    }
    else if (lesEtapes == 2) {
        boutonPrecedent.classList.remove('cache');
        boutonSuivant.classList.remove('cache');
        boutonDonner.classList.add('cache');
    }
    else if (lesEtapes == 3) {
        boutonPrecedent.classList.remove('cache');
        boutonSuivant.classList.add('cache');
        boutonDonner.classList.remove('cache');
    }
}
// CACHE LES SECTIONS QUI NE S0NT PAS ENCORE ACTIVÉE
function cacherSections() {
    sections.forEach((uneSection: any) => {
        uneSection.classList.add("cache")
    });

}

// NAVIAGATION ENTRE LES ÉTAPES
function naviguerSuivant(event: any) {
    const etapeValider = validerEtape(numEtape);
    if (etapeValider) {
        if (numEtape < sections.length - 1) {
            numEtape++
            afficherEtape(numEtape)
        }
    }
    else {
        event.preventDefault()
    }
}
function naviguerRetour(event: any) {
    if (numEtape > 0) {
        numEtape--
        afficherEtape(numEtape)
    }
}