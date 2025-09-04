"use strict";
let etape = 0;
let boutonSuivant;
let boutonPrecedent;
let boutonDonner;
let sections;
function initaliser() {
    console.log("Hello word");
    sections = document.querySelectorAll('section');
    boutonSuivant = document.getElementById('boutonSuivant');
    boutonPrecedent = document.getElementById('boutonRetour');
    boutonDonner = document.getElementById('boutonDonner');
    boutonSuivant?.addEventListener('click', naviguerSuivant);
    boutonPrecedent?.addEventListener('click', naviguerRetour);
    // boutonDonner?.addEventListener('click', naviguerBouton)
}
function afficherEtape(etape) {
    const etapes = document.querySelectorAll('se4ction');
    cacherSections();
    if (etape >= 0 && etape < etapes.length) {
        etapes[etape].classList.remove('cahcer');
    }
    if (etape == 0) {
        boutonPrecedent.classList.add('cacher');
        boutonSuivant.classList.remove('cacher');
        boutonDonner.classList.add('cacher');
    }
    else if (etape == 1) {
        boutonPrecedent.classList.remove('cacher');
        boutonSuivant.classList.remove('cacher');
        boutonDonner.classList.add('cacher');
    }
    else if (etape == 2) {
        boutonPrecedent.classList.remove('cacher');
        boutonSuivant.classList.add('cacher');
        boutonDonner.classList.remove('cacher');
    }
    const elementsEtat = document.querySelectorAll('etat-etapes');
    const etatElement = document.getElementById('etat_etape' + (etape + 1));
    etatElement?.classList.add('evidence');
    elementsEtat.forEach(elements => {
        elements.classList.remove("evidence");
    });
}
function cacherSections() {
    sections.forEach(section => {
        section.classList.add("cacher");
    });
    sections[0].classList.remove('cacher');
}
function naviguerSuivant(event) {
    if (etape < cacherSections.length - 1) {
        etape++;
        console.log(etape);
        afficherEtape(etape);
    }
}
function naviguerRetour(event) {
    if (etape > 0) {
        etape--;
    }
}
