
let numEtape: number = 0;
let boutonSuivant: HTMLButtonElement;
let boutonPrecedent: HTMLButtonElement;
let boutonDonner: HTMLButtonElement;
let sections: NodeListOf<HTMLElement>;

interface messageErreur {
    vide?: string;
    pattern?: string;
}
interface erreursJSON{
   [fieldName:string]: messageErreur;
}

let messagesErreur:erreursJSON;
initaliser();

function initaliser() {
    // const formulaire :HTMLFormElement = 
    sections = document.querySelectorAll('section');
    boutonSuivant = document.getElementById('btnSuivant') as HTMLButtonElement;
    boutonPrecedent = document.getElementById('btnRetour') as HTMLButtonElement;
    boutonDonner = document.getElementById('btnDonner') as HTMLButtonElement;
    console.log(sections, boutonSuivant, boutonPrecedent);

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
    console.log(reponse)
    messagesErreur = await reponse.json()
    console.log(messagesErreur)

}
function validerChamp(champ: HTMLInputElement): boolean {
    let valide = false;
    const id = champ.id;
    const idMessageErreur = "erreur_" + id;
    const erreurElement = document.getElementById(idMessageErreur);

    console.log('dans validerChamp voici là où l\'erreur se trouve  ' + messagesErreur[id].vide)

    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesErreur[id].vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesErreur[id].vide;
        console.log('valider champ: ' + id);
    }
    // else if (champ.validity.typeMismatch && messagesErreur[id].typeMismatch) {
    //     // Type de données incorrect (email, url, tel, etc.)
    //     erreurElement.innerText = messagesErreur[id].vide;
    //     valide = false;
    // }
    else if (champ.validity.patternMismatch && messagesErreur[id].pattern) {
        // Ne correspond pas au pattern regex défini
        erreurElement.innerText = messagesErreur[id].pattern;
        valide = false;
    }
    return valide
}

function validerEtape(etape: number): boolean {
    let etapeValide = false;
    switch (etape) {
        case 0:
            etapeValide = true;
            break;
        case 1:
            // etapeValide = true;
            const nomElement = document.getElementById('nom') as HTMLInputElement;
            const prenomElement = document.getElementById('prenom') as HTMLInputElement;
            const emailElement = document.getElementById('email') as HTMLInputElement;
            const telephoneElement = document.getElementById('telephone') as HTMLInputElement;
            
            console.log(nomElement);
            const nomValide = validerChamp(nomElement);
            const prenomValide = validerChamp(prenomElement);
            const emailValide = validerChamp(emailElement);
            const telephoneValide = validerChamp(telephoneElement);


            // etapeValide = validerChamp(nomElement) || validerChamp(nomElement) || validerChamp(nomElement)

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
    const etapeValide = validerEtape(numEtape);
    if (etapeValide) {//


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