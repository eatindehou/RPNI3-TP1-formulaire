let btnChargerGalerie = document.getElementById('btnCharger')
let refDivChargement = document.querySelector('#galerie');
btnChargerGalerie.addEventListener('click', chargerLesimages)

function chargerLesimages() {
    fetch('data/animaux.json')
        .then(function (reponse) {
            console.log(reponse);
            reponse.json().then(function (json) {
                console.log('reussite', json);

                for (let cpt = 0; cpt <= json.length - 1; cpt++) {
                    // Création des éléments HTML
                    let carte = document.createElement('div')
                    let refImg = document.createElement('img');
                    let nomAnimale = document.createElement('h3');
                    let descriptionAnimale = document.createElement('p');

                    // Ajout du contenu des éléments HTML
                    refImg.src = json[cpt].url;
                    nomAnimale.innerHTML = json[cpt].nom;
                    descriptionAnimale.innerHTML = json[cpt].description;

                    // Mise en place de la structure HTML
                    carte.classList.add('carte');
                    refDivChargement.append(carte);
                    carte.append(refImg);
                    carte.append(nomAnimale);
                    carte.append(descriptionAnimale);
                }
            });
        })
        .catch(function (erreur) {
            console.log('erreur !', erreur);
        });
}
