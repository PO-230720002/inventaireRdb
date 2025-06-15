const html5QrCode = new Html5Qrcode("reader");
let isScanning = false;
let code = "";

setTimeout(() => {
    afficherAccueil();
    cacherResultat();
    cacherFormulaire();
    initFormulaireEventListener();
  },
  0);

// --------- Methode principale ----------------
function startStopScanning() {
  isScanning = !isScanning;
  const button = document.getElementById("startStopScanningButton");

  if (isScanning) {
    if (html5QrCode.getState() === Html5QrcodeScannerState.NOT_STARTED) {
      const config = {fps: 10, qrbox: {width: 370, height: 150}};
      html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccessCallback).then(() => {
        cacherFormulaireAccueil();
        button.innerText = "Arrêter le scan";
        button.style.backgroundColor = "#bd0c00";
      });
    } else {
      isScanning = !isScanning
    }
  } else {
    if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
      html5QrCode.stop().then(() => {
        afficherFormulaireAccueil();
        button.innerText = "Commencer le scan";
        button.style.backgroundColor = "#4CAF50";
        cacherResultat();
      });
    } else {
      isScanning = !isScanning;
    }

  }
}

function qrCodeSuccessCallback(decodedText, decodedResult) {
  code = decodedText; // Stocke le code scanné
  document.getElementById("resultText").innerText = decodedText;
  afficherResultat();
}

//fonction appellée lors du VRAI / FAUX
function isScanBon(isScanBon) {
  // Cache résultats
  cacherResultat();

  if (isScanBon) {
    startStopScanning();
    goToFormulaire(null);
  }
}

// Fonction appelée lors de la recherche via input
function rechercherProduitViaInput() {
  const codeSaisi = document.getElementById("codeItemInput").value;
  if (!codeSaisi || codeSaisi.trim() === "e") {
    console.error('Aucun code saisi');
    document.getElementById("codeItemInput").value = "";
    document.getElementById("codeItemInput").style.borderColor = "red";
    return;
  }
  console.log("Code saisi :", codeSaisi);
  goToFormulaire(codeSaisi);
}

//
function cleanCodeItemInput() {
  document.getElementById("codeItemInput").value = "";
}

function goToFormulaire(codeArticle) {
  if (codeArticle !== null) {
    code = codeArticle;
  }
  getArticle(code).then(article => {
    if (article) {
      // TODO mettre les bons attributs à 'article'
      document.getElementById("nomProduitValue").innerText = article.nom;
      document.getElementById("codeProduitValue").innerText = code;
      document.getElementById("prixProduitValue").value = article.prix;
      document.getElementById("quantiteProduitValue").value = article.quantite;
    } else {
      console.error('Article non trouvé');
    }
  }).then(() => {
      cacherAccueil();
      afficherFormulaire();
    }
  );
}

// --------- API  REST ----------------
// TODO mettre l'url de l'API ici
const API_URL = ""; // ← Mets ton URL ici

// Un Get /{code},
function getArticle(code) {
  return fetch(API_URL + "/" + code.toString())
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'article');
      }
      return response.json();
    })
    .catch(error => console.error('Erreur:', error));
}

// Un Post/{code} avec body { quantite: X }
function AjouterOuRemplacer(action) {
  const quantitySaisie = parseInt(document.getElementById('itemQuantitySaisie').value);
  let quantityInitiale = 0;
  if (action === "ajouter") {
    quantityInitiale = parseInt(document.getElementById('quantiteProduitValue').value);
  }
  const quantityFinale = quantitySaisie + quantityInitiale;

  fetch(API_URL + "/" + code.toString(), {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({quantite: quantityFinale})
  })
    .then(() => {
      cacherFormulaire()
      afficherAccueil();
    })
    .catch(e => console.error('Erreur Remplacement :', e));
}

function annulerSaisie() {
  cacherFormulaire()
  afficherAccueil();
}


// --------- CACHER / AFFICHER ----------------
// Fonction afficher ou cacher le résultat du scan
function afficherResultat() {
  document.getElementById("resultText").style.visibility = "visible";
  document.getElementById("resultButtonWrapper").style.visibility = "visible";
}

function cacherResultat() {
  document.getElementById("resultText").style.visibility = "hidden";
  document.getElementById("resultButtonWrapper").style.visibility = "hidden";
}

function afficherFormulaire() {
  document.getElementById("informationProduitList").style.visibility = "visible";
  document.getElementById("formulaire").style.visibility = "visible";
  document.getElementById("itemQuantitySaisie").focus();
}

function cacherFormulaire() {
  document.getElementById("informationProduitList").style.visibility = "hidden";
  document.getElementById("formulaire").style.visibility = "hidden";
}

function afficherAccueil() {
  document.getElementById("startStopScanningButton").style.visibility = "visible";
  afficherFormulaireAccueil();
  code = null;
}

function cacherAccueil() {
  document.getElementById("startStopScanningButton").style.visibility = "hidden";
  cacherFormulaireAccueil();
}

let formulaireAccueilElement = "";
let formulaireAccueilElementWrapper = document.getElementById("formulaireAccueilWrapper");

function afficherFormulaireAccueil() {
  formulaireAccueilElementWrapper.append(formulaireAccueilElement);
  document.getElementById("codeItemInput").value = "";
}

function cacherFormulaireAccueil() {
  formulaireAccueilElement = document.getElementById("formulaireAccueil");
  formulaireAccueilElementWrapper.removeChild(formulaireAccueilElement);
}


// --------- INIT Comportement----------------
function initFormulaireEventListener() {
  document.getElementById('formulaire').addEventListener('submit', function (e) {
    e.preventDefault(); // Empêche le formulaire d’être soumis par défaut
    document.getElementById("itemQuantitySaisie").blur(); // Retire le focus du formulaire
    return false;
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById("itemQuantitySaisie").blur();
      return false;
    }
  }, true); // "true" => phase de capture
}


