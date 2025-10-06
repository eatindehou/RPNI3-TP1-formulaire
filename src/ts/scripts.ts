
let numEtape: number = 0;
let sections: NodeListOf<HTMLElement>;

let boutonSuivant: HTMLButtonElement;
let boutonPrecedent: HTMLButtonElement;
let boutonDonner: HTMLButtonElement;
let touslesBoutonsRadios: any;
let btnRadiosValeurDon: any;
let btnRadiosDon: any;
let checkboxDons: any;
let liensNavigation: any;

let dedicaceEstCheck: boolean = false;
let entrepriseEstCheck: boolean = false;
let divAutreMontant: any;
let champAffiche: boolean = false;

let champEmail: any;

let champNumeroCarte: any;

/*** RECUPÉRATION DES DONNÉES ENTRÉES PAR L'UTILISATEUR */
// Étape don
let typeDonAEntree = document.getElementById('typeDeDon') as HTMLElement;
let valeurDonAEntree = document.getElementById('valeurDuDon') as HTMLElement;
let estDedicaceAEntree = document.getElementById('reponseDon') as HTMLElement;
let nomDedicaceAEntree = document.getElementById('nomDedicace') as HTMLElement;
// Étape donneur

let estEntrepriseAEntree = document.getElementById('reponseEntreprise') as HTMLElement;
let nomEntrepriseAEntree = document.getElementById('nomEntreprise') as HTMLElement;
let genreAEntree = document.getElementById('infosGenre') as HTMLElement;
let nomAEntree = document.getElementById('donneesNom') as HTMLElement;
let prenomAEntree = document.getElementById('donneesPrenom') as HTMLElement;
let courrielAEntree = document.getElementById('donneesCourriel') as HTMLElement;
let telephoneAEntree = document.getElementById('donneesTelephone') as HTMLElement;
let adresseAEntree = document.getElementById('donneesAdresse') as HTMLElement;
let codepostalAEntree = document.getElementById('donneesCodePostal') as HTMLElement;
let numAppAEntre = document.getElementById('donneesNumApp') as HTMLElement
let paysAEntree = document.getElementById('donneesPays') as HTMLElement;
let provinceAEntree = document.getElementById('donneesProvince') as HTMLElement;

// Étape paiement
let nomTitulaireAEntree = document.getElementById('donnesTitulaire') as HTMLElement;
let numCarteAEntree = document.getElementById('donnesNumeroCarte') as HTMLElement;
let dateExpAEntree = document.getElementById('donnesExpCarte') as HTMLElement;
let cvvAEntree = document.getElementById('donnesNumeroCvv') as HTMLElement;



interface messageErreur {
    vide?: string;
    pattern?: string;
    tldSuspicieux?: string;
    erreursCommunes?: string;
    duree?: string;
    dureeExedee?: string;
    longeur?: string
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
    liensNavigation = document.querySelectorAll('.etat-etape');
    liensNavigation.forEach((leLien: any) => {
        leLien.addEventListener('click', (event: Event) => {
            const leNumDeLienClique = parseInt(leLien.dataset.etape);
            naviguerParLiensNav(event, leNumDeLienClique)
        })
    })

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

    checkboxDons = document.querySelectorAll(".checkboxDons");
    // console.log(checkboxDons);
    checkboxDons.forEach((unCheckboxDon: any) => {
        unCheckboxDon.addEventListener('click', (event: Event) => {
            const leCheckboxClique = event.currentTarget as HTMLInputElement;
            afficherChampCheckbox(leCheckboxClique)

        });

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
    const champNumeroCarte = document.getElementById('numCarteCredit') as HTMLInputElement;
    champNumeroCarte.addEventListener('change', faireValiderNumCarte);


}

async function obtenirMessage(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    messagesErreur = await reponse.json()

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
    provinceContneur.classList.add('cacher');
    etatConteneur.classList.add('cache');
    etatConteneur.classList.add('cacher');
    inputEtats.disabled = true;
    leInputProvince.disabled = true;

    leInputPays.addEventListener('change', () => {
        if (leInputPays.value == 'Canada') {
            leInputProvince.disabled = false;
            inputEtats.disabled = true;

            etatConteneur.classList.add('cache')
            etatConteneur.classList.add('cacher')
            provinceContneur.classList.remove('cache');
            provinceContneur.classList.remove('cacher');
        }
        else if (leInputPays.value == 'United States of America (the)') {
            leInputProvince.disabled = true;
            inputEtats.disabled = false;

            provinceContneur.classList.add('cache');
            etatConteneur.classList.remove('cache')
            provinceContneur.classList.add('cacher');
            etatConteneur.classList.remove('cacher')
        }
        else {
            provinceContneur.classList.add('cache');
            etatConteneur.classList.add('cache');
            provinceContneur.classList.add('cacher');
            etatConteneur.classList.add('cacher');
            inputEtats.disabled = true;
            leInputProvince.disabled = true;
        }

    })

}
// CONNAITRE LA VALEUR DES BOUTON RADIOS CLIQUÉS
/* leBoutonClique: valeur du bouton qui vient d'être cliqué  
* Retourne la valeur du bouton cliqué
*/
function connaitreValeur(leBoutonClique: any): void {
    if (leBoutonClique.checked == true) {
        return leBoutonClique.value
    }
}
// APPELER VALIDATION DU CHAMP EMAIL
function faireValiderEmail(event: Event): void {
    const monInput = event.currentTarget as HTMLInputElement;
    validerEmail(monInput);
}
// APPELER VALIDATION DU CHAMP DU NUMÉRO DE LA CARTE BANCAIRE
function faireValiderNumCarte(event: Event): void {
    const monInput = event.currentTarget as HTMLInputElement;
    validerCarteCredit(monInput);
}
// VALIDATION D'UN CHAMP
/* champ: le champ dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerChamp(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^[a-zA-ZÀ-ÿ\s\']+$/
    const leTexte = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        // console.log(erreurElementClass)
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
    }
    else if (expresRegex.test(leTexte) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerHTML = messagesErreur[id].pattern;

        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
    }
    else {
        valide = true;
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElement.innerHTML = "";
    }
    return valide
}
// VALIDATION DU CHAMP EMAIL
/* champ: le champ email dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerEmail(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
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
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
    }
    else if (expresRegex.test(leEmail) == false && messagesErreur[id].pattern) {
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
    }
    else if (tldSuspicieux.some(
        (tld) => {
            const contientSuspect = leEmail.toLowerCase().endsWith(tld);
            return contientSuspect;
        }) && messagesErreur[id].tldSuspicieux) {
        valide = false;
        erreurElement.innerText = messagesErreur[id].tldSuspicieux;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
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
            erreurElementClass.classList.remove('texteCacheErreur');
            erreurElementClass.classList.add('texteErreurAfficher');
        }
        else {
            valide = true;
            erreurElementClass.classList.add('texteCacheErreur');
            erreurElementClass.classList.remove('texteErreurAfficher');
            erreurElement.innerText = "";
        }
    }
    return valide
}
//VALIDATION DU CHAMP TELEPHONE
/* champ: le champ du telephone dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerTelephone(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const leTelephone = champ.value;
    const expresRegex = /^\(?([0-9]{3})\)?[ ]?([0-9]{3})[-]?([0-9]{4})$/;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
    }
    else if (expresRegex.test(leTelephone) == false && messagesErreur[id].pattern) {
        erreurElement.innerText = messagesErreur[id].pattern;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        valide = false;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide;
}
//VALIDATION DU CHAMP ADRESSE
/* champ: le champ adresse dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerAdresse(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^[0-9]+[a-zA-ZÀ-ÿ0-9 \-]+$/
    const lAdresse = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
    }
    else if (expresRegex.test(lAdresse) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        valide = false;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide
}
//VALIDATION DU CHAMP CODE POSTAL
/* champ: le champ du code postal dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerCodePostal(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^[a-zA-Z][0-9][a-zA-Z] ?[0-9][a-zA-Z][0-9]$/
    const leCodePostal = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leCodePostal) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        valide = false;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide
}
//VALIDATION DU CHAMP DATALIST
/* champ: le champ datalist (pays, province ou état) dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerListeDeSelection(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide
}

//VALIDATION DU CHAMP CARTE DE CRÉDIT
/* champ: le champ de carte de crédit dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerCarteCredit(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/
    const leNumDeCarte = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leNumDeCarte) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide
}

// VALIDATION DU CHAMP DE DATE D'EXPIRATION
/* champ: le champ de la date d'expiration dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerChampDate(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^(0[1-9]|1[0-2])\/?([0-9]{4})$/
    const laDate = champ.value
    const dateAujourdhui = new Date();
    let leMoisActuelle = dateAujourdhui.getMonth() + 1;
    let lAnneeActuelle = dateAujourdhui.getFullYear();
    let mois: any;
    let annee: any;
    const nbMoisMaximum: number = 12;
    // Si la longueur du texte entré est égale à 7
    // Convertir le mois en int et recupérer les deux premiers caratères
    // Convertir l'année en int et recupérer les quatres derniers caratères
    if (laDate.length == 7) {
        mois = parseInt(laDate.substring(0, 2));
        annee = parseInt(laDate.substring(3, 7));
    }
    // Sinon si la longueur du texte entré est égale à 7
    // Convertir le mois en int et recupérer les deux premiers caratères
    // Convertir l'année en int et recupérer les quatres derniers caratères
    else if (laDate.length == 6) {
        mois = parseInt(laDate.substring(0, 2));
        annee = parseInt(laDate.substring(2, 6));
    }
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
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
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        valide = false;
    }
    else {
        // Si l'année entrée est inférieur à l'année en cours
        // valide est false
        if (annee < lAnneeActuelle) {
            erreurElementClass.classList.remove('texteCacheErreur');
            erreurElementClass.classList.add('texteErreurAfficher');
            erreurElement.innerText = messagesErreur[id].duree;
            valide = false;
        }
        // Sinon si l'année entrée est égale à l'année en cours et que le mois entré entré est inférieur ou égal au mois en cours
        // valide est false
        else if (annee == lAnneeActuelle && mois <= leMoisActuelle) {
            erreurElementClass.classList.remove('texteCacheErreur');
            erreurElementClass.classList.add('texteErreurAfficher');
            erreurElement.innerText = messagesErreur[id].duree;
            valide = false;
        }
        // Sinon l'étape est valide
        else {
            valide = true;
            erreurElementClass.classList.add('texteCacheErreur');
            erreurElementClass.classList.remove('texteErreurAfficher');
            erreurElement.innerText = "";
        }
    }
    return valide
}
/* champ: le champ de cvv/cvc dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/

function validerChampCvv(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^[0-9]{3,4}$/
    const leNumDeCvv = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leNumDeCvv) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        valide = false;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide
}
/* champ: le champ numérique dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/
function validerChampNumerique(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^\d+$/
    const leMontantEntre = champ.value
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].vide;
    }
    else if (expresRegex.test(leMontantEntre) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else if (champ.validity.rangeOverflow && messagesErreur[id].longeur) {
        // Valeur numérique supérieure à max
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].longeur
        valide = false;
    }
    else {
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    // console.log(valide)
    return valide
}

/* champ: le champ du numéro d'appartement dans lequel l'utilisateur a inscrit les informations  
* Retourne si ce que l'utilsateur a inscrit est valide (true) ou non (false)
*/
function validerChampNumApp(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurElementClass = document.querySelector("." + idMessageErreur);
    const expresRegex = /^\d+$/
    const leNumApp = champ.value
    // Vérifie chaque type d'erreur de validation
    if (expresRegex.test(leNumApp) == false && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    else if (champ.validity.rangeOverflow && messagesErreur[id].longeur) {
        // Valeur numérique supérieure à max
        erreurElementClass.classList.remove('texteCacheErreur');
        erreurElementClass.classList.add('texteErreurAfficher');
        erreurElement.innerText = messagesErreur[id].longeur
        valide = false;
    }
    else {
        // Champ obligatoire vide (attribut required)
        valide = true;
        erreurElementClass.classList.add('texteCacheErreur');
        erreurElementClass.classList.remove('texteErreurAfficher');
        erreurElement.innerText = "";
    }
    return valide
}
//AFFICHAGE DES CHAMPS CACHÉ
// Retourne si les champs sont cachés (true) ou non (false)
function afficherLesChampsCache(): boolean {
    btnRadiosValeurDon.forEach((btnChoisi: any) => {
        /* Si un bouton est coché
        * Vérifier si la valeur du bouton est 'donAutre'
        * Sinon afficher les champs cachés
        */
        if (btnChoisi.checked == true) {
            if (btnChoisi.value !== 'donAutre') {
                champAffiche = false;
                divAutreMontant.classList.add("cache");
                divAutreMontant.classList.add("cacher");

                const champAssocie = divAutreMontant.querySelector("p") as HTMLInputElement;
                const champInputAssocie = divAutreMontant.querySelector("input") as HTMLInputElement;
                // Enlever les messages d'erreur:
                champAssocie.classList.remove('texteErreurAfficher');
                champAssocie.classList.add('texteCacheErreur');

                // 2. Vider le contenu du champ et enlever la classe erreur
                champInputAssocie.innerHTML = "";
                champInputAssocie.classList.remove('erreurInput');

            }
            else {
                champAffiche = true;
                divAutreMontant.classList.remove("cache");
                divAutreMontant.classList.remove("cacher");
            }
        }
    })
    return champAffiche;
}
// AFFICHAGE DES CHAMPS SI CHECKBOX EST ACTIVE
// Retourne si les champs checkbox sont cachés (true) ou non (false)
function afficherChampCheckbox(checkBoxCheck: any): boolean {
    let laDivCache: any = document.querySelector('.div_' + checkBoxCheck.value);

    /* Si la valeur du bouton est 'ouiDedicace'
    * la dedicace est check
    * Sinon si la valeur du bouton est 'ouiNomEntreprise'
    * l'entreprise est check
    */
    if (checkBoxCheck.value == "ouiDedicace") {
        dedicaceEstCheck = checkBoxCheck.checked;
    }
    else if ((checkBoxCheck.value == "ouiNomEntreprise")) {
        entrepriseEstCheck = checkBoxCheck.checked;
    }
    /* Si un bouton checkbox est coché
    * afficher les champs cachés
    */
    if (checkBoxCheck.checked == true) {
        laDivCache.classList.remove('cache')
        laDivCache.classList.remove('cacher')
    }
    else { // Lorsque le champ est décoché...
        laDivCache.classList.add('cache');
        laDivCache.classList.add('cacher');
        const champAssocie = document.querySelector('.div_' + checkBoxCheck.value + ">p") as HTMLInputElement;
        const champInputAssocie = document.querySelector('.div_' + checkBoxCheck.value + ">input") as HTMLInputElement;

        // Enlever les messages d'erreur:
        champAssocie.classList.remove('texteErreurAfficher');
        champAssocie.classList.add('texteCacheErreur');

        // 2. Vider le contenu du champ et enlever la classe erreur
        champInputAssocie.innerHTML = "";
        champInputAssocie.classList.remove('erreurInput');

    }
    return laDivCache

}

// VALIDATION DES ÉTAPES
/* etape: l'étape actuelle de l'utilisateur'
* Retourne si toute les étapes sont valides (true) ou non (false)
*/
function validerEtape(etape: number): boolean {

    let etapeValide: boolean = false;
    switch (etape) {
        case 0:
            const leTypeDeDonChecked = document.querySelector("input[name='don']:checked") as HTMLInputElement;
            const laValeurDeDonChecked = document.querySelector("input[name='valeurDon']:checked") as HTMLInputElement;
            // attribution du type de don
            typeDonAEntree.innerHTML = leTypeDeDonChecked.value;
            valeurDonAEntree.innerText = laValeurDeDonChecked.value;

            const montantElement = document.getElementById('autreMontant') as HTMLInputElement;
            const nomDedicaceElement = document.getElementById('ouiDedicace') as HTMLInputElement;
            let leCheckEstValide = false;
            let leChampEstValide = false;


            if (champAffiche) {
                montantElement.required = true;
                const montantValide = validerChampNumerique(montantElement);

                if (!montantValide) {
                    etapeValide = false;
                    montantElement.classList.add('erreurInput')
                }
                else {
                    // attribution de la valeur de don
                    montantElement.classList.remove('erreurInput')
                    leChampEstValide = true;
                    valeurDonAEntree.innerText = montantElement.value;
                }
            }
            else {
                let champErreur = document.getElementById('erreur_autreMontant') as HTMLInputElement;
                champErreur.innerText = "";
                leChampEstValide = true;
                montantElement.classList.remove('erreurInput')
                montantElement.required = false;
            }

            if (dedicaceEstCheck) {
                nomDedicaceElement.required = true;
                const nomDedicaceValide = validerChamp(nomDedicaceElement);
                estDedicaceAEntree.innerText = "oui";

                if (!nomDedicaceValide) {
                    etapeValide = false;
                    nomDedicaceElement.classList.add('erreurInput')
                }
                else {
                    leCheckEstValide = true;
                    nomDedicaceElement.classList.remove('erreurInput')
                    nomDedicaceAEntree.classList.remove('cache');
                    nomDedicaceAEntree.classList.remove('cacher');
                    nomDedicaceAEntree.innerText = `En l'honneur de ${nomDedicaceElement.value}`
                }
            }
            else {
                leCheckEstValide = true;
                let champErreur = document.getElementById('erreur_ouiDedicace') as HTMLInputElement;
                champErreur.innerText = "";
                nomDedicaceElement.classList.remove('erreurInput')
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
            const nomElement = document.getElementById('nom') as HTMLInputElement;
            const prenomElement = document.getElementById('prenom') as HTMLInputElement;
            const genreDonneur = document.querySelector("input[name='genre']:checked") as HTMLInputElement
            const emailElement = document.getElementById('email') as HTMLInputElement;
            const telephoneElement = document.getElementById('telephone') as HTMLInputElement;
            const adresseElement = document.getElementById('adresse') as HTMLInputElement;
            const codePostalElement = document.getElementById('codePostal') as HTMLInputElement;
            const listePaysElement = document.getElementById('listePays') as HTMLInputElement;
            const listeProvinceElement = document.getElementById('listeProvince') as HTMLInputElement;
            const leNumeroDapp = document.getElementById('numApp') as HTMLInputElement;
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
            const nomEntrepriseElement = document.getElementById('ouiNomEntreprise') as HTMLInputElement;


            if (!nomValide || !prenomValide || !emailValide || !telephoneValide || !adresseValide || !codePostalValide || !listePaysValide || !listeProvinceValide) {
                etapeValide = false;
                nomElement.classList.add('erreurInput')
                prenomElement.classList.add('erreurInput')
                genreDonneur.classList.add('erreurInput')
                emailElement.classList.add('erreurInput')
                telephoneElement.classList.add('erreurInput')
                adresseElement.classList.add('erreurInput')
                codePostalElement.classList.add('erreurInput')
                listePaysElement.classList.add('erreurInput')
                listeProvinceElement.classList.add('erreurInput')

            }
            else {
                etapeValide = true;
                nomElement.classList.remove('erreurInput')
                prenomElement.classList.remove('erreurInput')
                genreDonneur.classList.remove('erreurInput')
                emailElement.classList.remove('erreurInput')
                telephoneElement.classList.remove('erreurInput')
                adresseElement.classList.remove('erreurInput')
                codePostalElement.classList.remove('erreurInput')
                listePaysElement.classList.remove('erreurInput')
                listeProvinceElement.classList.remove('erreurInput')

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
            // Si le champ de numéro d'appartement est vide le champ n'est pas requis
            if (leNumeroDapp.value.trim() == "") {
                leNumeroDapp.required = false
                numAppAEntre.innerText = "Aucun numéro d'appartement";
                let champErreur = document.getElementById('erreur_numApp') as HTMLInputElement;
                champErreur.innerText = "";
            }
            // Sinon procéder à la validation
            else {
                leNumeroDapp.required = true;
                const numAppValide = validerChampNumApp(leNumeroDapp)
                if (!numAppValide) {
                    etapeValide = false;
                    leNumeroDapp.classList.add('erreurInput')
                }
                else {
                    leNumeroDapp.classList.remove('erreurInput')
                    numAppAEntre.innerText = `Votre numéro d'appartement ${leNumeroDapp.value}`
                }
            }

            if (entrepriseEstCheck == true) {
                nomEntrepriseElement.required = true;
                const nomEntrepriseValide = validerChamp(nomEntrepriseElement);
                estEntrepriseAEntree.innerText = "oui";

                if (!nomEntrepriseValide) {
                    etapeValide = false;
                    nomEntrepriseElement.classList.add('erreurInput')
                }
                else {
                    nomEntrepriseElement.classList.remove('erreurInput')
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
            const titulaireCarteElement = document.getElementById('titulaireCarte') as HTMLInputElement;
            const numCarteElement = document.getElementById('numCarteCredit') as HTMLInputElement;
            const dateExpElement = document.getElementById('dateExpiration') as HTMLInputElement;
            const cvvElement = document.getElementById('cvv') as HTMLInputElement;

            const titulaireCarteValide = validerChamp(titulaireCarteElement);
            const numCarteValide = validerCarteCredit(numCarteElement);
            const dateExpValide = validerChampDate(dateExpElement);
            const cvvValide = validerChampCvv(cvvElement);
            // const listeEtatValide = validerListeDeSelection(listeEtatElement);

            if (!numCarteValide || !titulaireCarteValide || !dateExpValide || !cvvValide) {
                etapeValide = false;

                titulaireCarteElement.classList.add('erreurInput')
                numCarteElement.classList.add('erreurInput')
                dateExpElement.classList.add('erreurInput')
                cvvElement.classList.add('erreurInput')
            }
            else {
                etapeValide = true;
                titulaireCarteElement.classList.remove('erreurInput')
                numCarteElement.classList.remove('erreurInput')
                dateExpElement.classList.remove('erreurInput')
                cvvElement.classList.remove('erreurInput')
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
    return etapeValide
}
// FAIRE LA NAVIGATION DES ÉTAPES PAR LES LIENS DE NAVIGATION
/* leNumeroDEtape: l'étape à laquelle l'utilisateur veut se rendre'
*/
function naviguerParLiensNav(event: Event, leNumeroDEtape: number) {
    event.preventDefault();
    if (leNumeroDEtape <= numEtape) {
        numEtape = leNumeroDEtape;
        afficherEtape(numEtape);
    }
    else {
        // console.log('Ne peux pas avancer !');
    }

}
// AFFICHAGE DES ÉTAPES
/* lesEtapes: toutes les étapes du formulaire'
* Afficher les sections à venir et cacher les sections précédente
*/
function afficherEtape(lesEtapes: number): void {
    // console.log("Voici l'étape : " + lesEtapes);
    const etapes: NodeListOf<HTMLElement> = document.querySelectorAll('section');
    const etatElement0: any = document.getElementById('etat_etape0');
    const etatElement1: any = document.getElementById('etat_etape1');
    const etatElement2: any = document.getElementById('etat_etape2');
    const etatElement3: any = document.getElementById('etat_etape3');

    const etatLienElement1: any = document.querySelector('#etat_etape1 + a');
    const etatLienElement2: any = document.querySelector('#etat_etape2 + a');
    const etatLienElement3: any = document.querySelector('#etat_etape3 + a');

    const imageEnArrierePlan: any = document.querySelector('.imageDeFond1');
    const imageEnAvantPlan: any = document.querySelector('.imagePetit1');


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
        etatLienElement1.setAttribute('aria-disabled', 'true');

        etatElement2.classList.remove('enCours');
        etatElement2.classList.remove('menu__lien--active');
        etatElement2.classList.add('menu__lien--inactive')
        etatLienElement2.setAttribute('aria-disabled', 'true');

        etatElement3.classList.remove('enCours');
        etatElement3.classList.add('menu__lien--inactive')
        etatLienElement3.setAttribute('aria-disabled', 'true');

        imageEnArrierePlan.classList.add('imageDeFond1');
        imageEnAvantPlan.classList.add('imagePetit1');

        imageEnAvantPlan.classList.remove('imagePetit2');
        imageEnArrierePlan.classList.remove('imageDeFond2');

        imageEnAvantPlan.classList.remove('imagePetit3');
        imageEnArrierePlan.classList.remove('imageDeFond3');

        imageEnAvantPlan.classList.remove('imagePetit4');
        imageEnArrierePlan.classList.remove('imageDeFond4');

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
        etatElement1.classList.remove('menu__lien--inactive')
        etatLienElement1.setAttribute('aria-disabled', 'false');

        etatElement2.classList.remove('enCours');
        etatElement2.classList.remove('menu__lien--active');
        etatElement2.classList.add('menu__lien--inactive');
        etatLienElement2.setAttribute('aria-disabled', 'true');

        etatElement3.classList.remove('enCours');
        etatElement3.classList.add('menu__lien--inactive');
        etatLienElement3.setAttribute('aria-disabled', 'true');


        imageEnArrierePlan.classList.add('imageDeFond2');
        imageEnAvantPlan.classList.add('imagePetit2');

        imageEnAvantPlan.classList.remove('imagePetit3');
        imageEnArrierePlan.classList.remove('imageDeFond3');

        imageEnAvantPlan.classList.remove('imagePetit4');
        imageEnArrierePlan.classList.remove('imageDeFond4');



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
        etatElement1.classList.remove('menu__lien--inactive')

        etatElement2.classList.add('enCours');
        etatElement2.classList.remove('menu__lien--inactive');
        etatLienElement2.setAttribute('aria-disabled', 'false');

        etatElement3.classList.remove('enCours');
        etatElement3.classList.add('menu__lien--inactive');
        etatLienElement3.setAttribute('aria-disabled', 'true');


        imageEnArrierePlan.classList.add('imageDeFond3');
        imageEnAvantPlan.classList.add('imagePetit3');

        imageEnArrierePlan.classList.remove('imageDeFond2');
        imageEnAvantPlan.classList.remove('imagePetit2');

        imageEnAvantPlan.classList.remove('imagePetit4');
        imageEnArrierePlan.classList.remove('imageDeFond4');


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
        etatLienElement3.setAttribute('aria-disabled', 'false');


        imageEnArrierePlan.classList.add('imageDeFond4');
        imageEnAvantPlan.classList.add('imagePetit4');


    }

}
// CACHE LES SECTIONS QUI NE S0NT PAS ENCORE ACTIVÉE
function cacherSections(): void {
    sections.forEach((uneSection: any) => {
        uneSection.classList.add("cache")
        uneSection.classList.add("cacher")
    });

}

// NAVIAGATION ENTRE LES ÉTAPES
function naviguerSuivant(event: any): void {
    const etapeValider = validerEtape(numEtape);
    if (etapeValider) {
        if (numEtape < sections.length - 1) {
            numEtape++
            afficherEtape(numEtape)
        }
    }
    else {
        event.preventDefault();
    }
}
function naviguerRetour(event: any): void {
    if (numEtape > 0) {
        numEtape--
        afficherEtape(numEtape)
    }
    else {
        event.preventDefault();
    }
}