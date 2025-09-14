
let numEtape: number = 0;
let sections: NodeListOf<HTMLElement>;

let boutonSuivant: HTMLButtonElement;
let boutonPrecedent: HTMLButtonElement;
let boutonDonner: HTMLButtonElement;
let btnRadiosValeurDon: any;
let btnRadiosDon: any;
let checkboxDons: any;
let divCheckboxCache: any;

let estCheck: boolean = false;;
let divAutreMontant: any;
let champAffiche: boolean = false;

let champEmail: any;

interface messageErreur {
    vide?: string;
    pattern?: string;
    tldSuspicieux?: string;
    erreursCommunes?: string
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
    // boutonDonner?.addEventListener('click', naviguerBouton)

    /*
    ÉTAPE 1 --> VOTRE DON
    ***Selection des boutons radios :
    ****** Choix des dons
    ****** Choix de la valeur des dons + le champ caché Autre montant
    ***Selection des checkbox + le champ caché décdicae
    */
    btnRadiosDon = document.querySelectorAll("input[name='don']");
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
    const expresRegex = /^[a-zA-ZÀ-ÿ]+$/
    const leTexte = champ.value
    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        console.log('valider champ: ' + id);
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
    let etapeValide = false;
    switch (etape) {
        case 0:
            if (champAffiche || estCheck) {
                if (champAffiche) {

                    const montantElement = document.getElementById('autreMontant') as HTMLInputElement;
                    const montantValide = validerChamp(montantElement);

                    if (!montantValide) {
                        etapeValide = false;
                    }
                    else {
                        etapeValide = true;
                    }
                }
                if (estCheck) {
                    const nomDedicaceElement = document.getElementById('ouiDedicace') as HTMLInputElement;
                    const nomDedicaceValide = validerChamp(nomDedicaceElement);

                    if (!nomDedicaceValide) {
                        etapeValide = false;
                    }
                    else {
                        etapeValide = true;
                    }
                }

            }
            else {
                etapeValide = true;
            }
            break;
        case 1:
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
        boutonSuivant.classList.add('cache');
        boutonDonner.classList.remove('cache');
    }
    const elementsEtat: any = document.querySelectorAll('etat-etape',)
    const etatElement: any = document.getElementById('etat_etape' + (lesEtapes + 1));
    etatElement.classList.add('evidence')

    elementsEtat.forEach((element: any) => {
        element.classList.remove("evidence")
    });
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