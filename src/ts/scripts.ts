
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

interface messageErreur {
    vide?: string;
    pattern?: string;
}
interface erreursJSON {
    [fieldName: string]: messageErreur;
}

let messagesErreur: erreursJSON;
initaliser();

function initaliser() {
    // const formulaire :HTMLFormElement = 
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
    })
    divAutreMontant = document.querySelector('.donAutreCache');



    checkboxDons = document.querySelectorAll("input[type='checkbox']");
    checkboxDons.forEach((unCheckboxDon: any) => {
        unCheckboxDon.addEventListener('click', afficherChampCheckbox);
    })
    /*
    ÉTAPE 2 --> INFORMATIONS SUR LE DONNEUR
    ***Selection des boutons radios :
    ****** Choix des dons
    ****** Choix de la valeur des dons + le champ caché Autre montant
    ***Selection des checkbox + le champ caché entreprise
    */
    sections = document.querySelectorAll('section');
    boutonSuivant = document.getElementById('btnSuivant') as HTMLButtonElement;
    boutonPrecedent = document.getElementById('btnRetour') as HTMLButtonElement;
    boutonDonner = document.getElementById('btnDonner') as HTMLButtonElement;


    cacherSections();
    afficherEtape(numEtape);
    obtenirMessage();


    boutonSuivant.addEventListener('click', naviguerSuivant)
    boutonPrecedent.addEventListener('click', naviguerRetour)
    // boutonDonner?.addEventListener('click', naviguerBouton)

    console.log(obtenirMessage())
}

async function obtenirMessage(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    // console.log(reponse)
    messagesErreur = await reponse.json()
    // console.log(messagesErreur)

}
function validerChamp(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    console.log(champ.id);

    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)

    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        console.log('valider champ: ' + id);
    }
    else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
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
function afficherLesChampsCache(): boolean {
    console.log('champ activé');
    btnRadiosValeurDon.forEach((btnChoisi: any) => {

        if (btnChoisi.checked == true) {
            if (btnChoisi.value !== 'donAutre') {
                champAffiche = false;
                divAutreMontant.classList.add("cache");
            }
            else {
                champAffiche = true;
                divAutreMontant.classList.remove("cache");
                console.log(btnChoisi.value)
            }

        }
    })
    return champAffiche;
}

function afficherChampCheckbox(): boolean {
    estCheck = false;
    checkboxDons.forEach((unCheckboxDon: any) => {
        if (unCheckboxDon.checked) {
            console.log(unCheckboxDon.value)
            divCheckboxCache = document.querySelector('.div_' + unCheckboxDon.value);
            console.log(divCheckboxCache)
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

            const nomValide = validerChamp(nomElement);
            const prenomValide = validerChamp(prenomElement);
            const emailValide = validerChamp(emailElement);
            const telephoneValide = validerChamp(telephoneElement);

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

            if (!nomValide || !prenomValide || !emailValide || !telephoneValide) {
                etapeValide = false;
            }
            else {
                etapeValide = true;
            }
            break;
    }
    return etapeValide
}

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

function cacherSections() {
    sections.forEach((uneSection: any) => {
        uneSection.classList.add("cache")
    });

}

function naviguerSuivant(event: any) {
    console.log("btn suivant")
    const etapeValider = validerEtape(numEtape);
    if (etapeValider) {//

        // console.log(numEtape)
        if (numEtape < sections.length - 1) {
            console.log('aloha')
            numEtape++
            // console.log(numEtape)
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













// let numEtape: number = 0;
// let sections: NodeListOf<HTMLElement>;

// let boutonSuivant: HTMLButtonElement;
// let boutonPrecedent: HTMLButtonElement;
// let boutonDonner: HTMLButtonElement;
// let btnRadiosValeurDon: any;
// let btnRadiosDon: any;
// let checkboxDons: any;

// let estCheck: boolean = false;;
// let divAutreMontant: any;
// let champAffiche: boolean = false;
// let divNomEntreprises: any;

// interface messageErreur {
//     vide?: string;
//     pattern?: string;
// }
// interface erreursJSON {
//     [fieldName: string]: messageErreur;
// }

// let messagesErreur: erreursJSON;
// initaliser();

// function initaliser() {
//     // const formulaire :HTMLFormElement = 
//     /*
//     ÉTAPE 1 --> VOTRE DON
//     ***Selection des boutons radios :
//     ****** Choix des dons
//     ****** Choix de la valeur des dons + le champ caché Autre montant
//     ***Selection des checkbox + le champ caché décdicae
//     */
//     btnRadiosDon = document.querySelectorAll("input[name='don']");
//     btnRadiosValeurDon = document.querySelectorAll("input[name='valeurDon']");
//     btnRadiosValeurDon.forEach((btnChoisi: any) => {
//         btnChoisi.addEventListener('click', afficherLesChampsCache);
//     })
//     divAutreMontant = document.querySelector('.donAutreCache');

//     checkboxDons = document.querySelectorAll("input[type='checkbox']");
//     checkboxDons.forEach((unCheckboxDon: any) => {
//         unCheckboxDon.addEventListener('click', afficherChampCheckbox);
//     })
//     checkboxDons.forEach((unCheckboxDon: any) => {
//         unCheckboxDon.addEventListener('click', afficherChampCheckbox);
//     })
//     divNomEntreprises = document.querySelectorAll('inputTexteFerme')
//     /*
//     ÉTAPE 2 --> INFORMATIONS SUR LE DONNEUR
//     ***Selection des boutons radios :
//     ****** Choix des dons
//     ****** Choix de la valeur des dons + le champ caché Autre montant
//     ***Selection des checkbox + le champ caché décdice
//     */
//     sections = document.querySelectorAll('section');
//     boutonSuivant = document.getElementById('btnSuivant') as HTMLButtonElement;
//     boutonPrecedent = document.getElementById('btnRetour') as HTMLButtonElement;
//     boutonDonner = document.getElementById('btnDonner') as HTMLButtonElement;
//     console.log(divAutreMontant);

//     cacherSections();
//     afficherEtape(numEtape);
//     obtenirMessage();


//     boutonSuivant.addEventListener('click', naviguerSuivant)
//     boutonPrecedent.addEventListener('click', naviguerRetour)
//     // boutonDonner?.addEventListener('click', naviguerBouton)

//     console.log(obtenirMessage())
// }

// async function obtenirMessage(): Promise<void> {
//     const reponse = await fetch('objJSONMessages.json');
//     // console.log(reponse)
//     messagesErreur = await reponse.json()
//     // console.log(messagesErreur)

// }
// function validerChamp(champ: HTMLInputElement): boolean {
//     let valide = false;
//     const id = champ.id;
//     const idMessageErreur = "erreur_" + id;
//     const erreurElement = document.getElementById(idMessageErreur);
//     console.log(champ.validity);

//     console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)

//     // Vérifie chaque type d'erreur de validation
//     if (champ.validity.valueMissing && messagesErreur[id].vide) {
//         // Champ obligatoire vide (attribut required)
//         valide = false;
//         erreurElement.innerText = messagesErreur[id].vide;
//         console.log('valider champ: ' + id);
//     }
//     else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
//         // Ne correspond pas au pattern regex défini
//         erreurElement.innerText = messagesErreur[id].pattern;
//         valide = false;
//     }
//     else {
//         valide = true;
//         erreurElement.innerText = "";
//     }
//     return valide
// }
// function afficherLesChampsCache(): boolean {
//     console.log('champ activé');
//     btnRadiosValeurDon.forEach((btnChoisi: any) => {
//         if (btnChoisi.checked == true) {
//             if (btnChoisi.value !== 'donAutre') {
//                 champAffiche = false;
//                 divAutreMontant.classList.add("cache");
//             }
//             else {
//                 champAffiche = true;
//                 divAutreMontant.classList.remove("cache");
//                 console.log(btnChoisi.value)
//             }

//         }
//     })
//     return champAffiche;
// }

// function afficherChampCheckbox(): boolean {
//     estCheck = false;
//     checkboxDons.forEach((unCheckboxDon: any) => {
//         if (unCheckboxDon.checked) {
//             estCheck = true;
//             console.log(unCheckboxDon);
//             console.log('voici le greul !');

//             console.log(divNomEntreprises)
//             divNomEntreprises.forEach((uneDivNomEntreprise: any) => {
//                 uneDivNomEntreprise.classList.remove('cache');
//             })
//         }
//         else {
//             estCheck = false;
//             divNomEntreprises.forEach((uneDivNomEntreprise: any) => {
//                 uneDivNomEntreprise.classList.add('cache');
//             })

//         }
//     })
//     return estCheck
// }
// function validerEtape(etape: number): boolean {
//     let etapeValide = false;
//     switch (etape) {
//         case 0:
//             if (champAffiche) {

//                 const montantElement = document.getElementById('autreMontant') as HTMLInputElement;
//                 const montantValide = validerChamp(montantElement);

//                 if (!montantValide) {
//                     etapeValide = false;
//                 }
//                 else {
//                     etapeValide = true;
//                 }

//             }
//             else {
//                 etapeValide = true;

//             }
//             break;
//         case 1:
//             // etapeValide = true;
//             const nomElement = document.getElementById('nom') as HTMLInputElement;
//             const prenomElement = document.getElementById('prenom') as HTMLInputElement;
//             const emailElement = document.getElementById('email') as HTMLInputElement;
//             const telephoneElement = document.getElementById('telephone') as HTMLInputElement;

//             // console.log(nomElement);
//             const nomValide = validerChamp(nomElement);
//             const prenomValide = validerChamp(prenomElement);
//             const emailValide = validerChamp(emailElement);
//             const telephoneValide = validerChamp(telephoneElement);


//             if (!nomValide || !prenomValide || !emailValide || !telephoneValide) {
//                 etapeValide = false;
//             }
//             else {
//                 etapeValide = true;
//             }
//             break;
//     }
//     return etapeValide
// }

// function afficherEtape(lesEtapes: number) {
//     console.log("Voici l'étape : " + lesEtapes);
//     const etapes: NodeListOf<HTMLElement> = document.querySelectorAll('section');
//     cacherSections();
//     if (lesEtapes >= 0 && lesEtapes < etapes.length) {
//         etapes[lesEtapes].classList.remove('cache');
//     }
//     if (lesEtapes == 0) {
//         boutonPrecedent.classList.add('cache');
//         boutonSuivant.classList.remove('cache');
//         boutonDonner.classList.add('cache');
//     }
//     else if (lesEtapes == 1) {
//         console.log(lesEtapes)
//         boutonPrecedent.classList.remove('cache');
//         boutonSuivant.classList.remove('cache');
//         boutonDonner.classList.add('cache');
//     }
//     else if (lesEtapes == 2) {
//         boutonPrecedent.classList.remove('cache');
//         boutonSuivant.classList.add('cache');
//         boutonDonner.classList.remove('cache');
//     }
//     const elementsEtat: any = document.querySelectorAll('etat-etape',)
//     const etatElement: any = document.getElementById('etat_etape' + (lesEtapes + 1));
//     etatElement.classList.add('evidence')

//     elementsEtat.forEach((element: any) => {
//         element.classList.remove("evidence")
//     });
// }

// function cacherSections() {
//     sections.forEach((uneSection: any) => {
//         uneSection.classList.add("cache")
//     });

// }

// function naviguerSuivant(event: any) {
//     console.log("btn suivant")
//     const etapeValider = validerEtape(numEtape);
//     if (etapeValider) {//

//         // console.log(numEtape)
//         if (numEtape < sections.length - 1) {
//             console.log('aloha')
//             numEtape++
//             // console.log(numEtape)
//             afficherEtape(numEtape)
//         }
//     }
//     else {
//         event.preventDefault()
//     }
// }
// function naviguerRetour(event: any) {
//     if (numEtape > 0) {
//         numEtape--
//         afficherEtape(numEtape)
//     }
// }