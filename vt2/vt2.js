"use strict";
//@ts-check 
// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//

//TODO RIVITÄ CSS-tiedostossa TUO LOMAKE KUNTOON!!!!


/**
 * Funktio ottaa sarjaIdn ja hakee datasta id:tä vastaavan sarjan nimen.
 * @param {Integer} sarjanId 
 * @returns sarjan nimi
 */
function haeSarja(sarjanId) {
    for (let i = 0; i < data.sarjat.length; i++) {
        if (sarjanId == data.sarjat[i].id) {
            return data.sarjat[i].nimi;
        }
    }
}

// Funktio lisää taulukkomuodossa www-sivulle joukkueet ja joukkueiden sarjat, sarjan mukaan ensisijaisesti järjestettynä. 
// Jos sarja on sama niin järjestäminen tehdään joukkueen nimen mukaan.
function listaaJoukkueetJaSarjat() {
    
    let taulukko = [];
    for (let i = 0; i < data.joukkueet.length; i++) {
        let uusiObjekti = {
            nimi: data.joukkueet[i].nimi,
            sarja: haeSarja(data.joukkueet[i].sarja)
        };
        taulukko.push(uusiObjekti);
    }

    // Järjestetään taulukko halutulla tavalla; ensiksi sarjan ja toiseksi joukkueen nimen mukaan.
    taulukko.sort( function (a,b) {
        if (a.sarja == b.sarja) {
            let eka = a.nimi.toLowerCase().trim();
            let toka = b.nimi.toLowerCase().trim();

            if (eka < toka) {
                return -1;
            }
            if (eka > toka) {
                return 1;
            }
            return 0;
        }
        return parseInt(a.sarja)-parseInt(b.sarja);
    });

    //DOM-rajapintaa hyödyntäen haetaan oikeat paikat ja luodaan elementtejä, joilla joukkueet ja sarjat lisätään sivustolle

    let div = document.getElementById("tupa");
    let table = div.getElementsByTagName("table")[0];

    for (let i = 0; i < taulukko.length; i++) {
        
        //let sarjaNode = document.createTextNode(taulukko[i].sarja);
        //let joukkueNode = document.createTextNode(taulukko[i].nimi);
        let uusiTR = document.createElement('tr');
        let tdSarja = document.createElement('td');
        let tdJoukkue = document.createElement('td');
        tdSarja.textContent = taulukko[i].sarja;
        tdJoukkue.textContent = taulukko[i].nimi;
        uusiTR.appendChild(tdSarja);
        uusiTR.appendChild(tdJoukkue);
        table.appendChild(uusiTR);
    }
}

// Apufunktio hakemaan uuden uniikin id:n tehtävänannon mukaisesti.
function haeUusiId() {
    let isoinId = 0;
    for (let i = 0; i < data.rastit.length; i++) {
        if (data.rastit[i].id > isoinId) {
            isoinId = data.rastit[i].id;
        }
    }

    return isoinId+1;
}

// Apufunktio, joka vain lisää parametrin tiedot sisältävän rastin tietorakenteeseen
function lisaaRastiTietorakenteeseen(lat, lon, koodi) {
    let uusiRasti = {
        lon: lon,
        koodi: koodi,
        lat: lat,
        id: haeUusiId()
    };

    data.rastit.push(uusiRasti);
}

// Apufunktio tarkistamaan onko parametrina tuotu luku float, eli liukuluku
// Palautetaan true, jos on ja false jos ei ole
function onkoFloat(luku) {
    return luku % 1 != 0;
}

// Apufunktio tulostamaan rastit konsoliin aakkosjärjestyksessä
function tulostaRastitKonsoliin() {
    let rastit = [];
    for (let i = 0; i < data.rastit.length; i++) {
        rastit.push(data.rastit[i].koodi);
    }
    
    rastit.sort();

    console.log("Rasti    Lat               Lon");

    for (let j = 0; j < rastit.length; j++) {
        let rasti = rastit[j];
        for (let k = 0; k < data.rastit.length; k++) {
            if (data.rastit[k].koodi == rasti) {
                let lat = data.rastit[k].lat;
                let lon = data.rastit[k].lon;
                console.log(rasti + "       " + lat + "         " + lon); 
            }
        }
    }
}

// Funktio lisää rastin, annettujen tietojen mukaisesti
// Jos kentät tyhjiä tai data invalidia, lisäystä ei tehdä
function lisaaRasti(e) {
    e.preventDefault();
    
    let fieldset = e.target.parentNode;
    let labelit = fieldset.getElementsByTagName("label");
    
    let latLabel = labelit[0].getElementsByTagName("input")[0];
    let latArvo = latLabel.value;
    
    let lonLabel = labelit[1].getElementsByTagName("input")[0];
    let lonArvo = lonLabel.value;

    let koodiLabel = labelit[2].getElementsByTagName("input")[0];
    let koodiArvo = koodiLabel.value; 

    if (latArvo == undefined) {
        return;
    }
    if (lonArvo == undefined) {
        return;
    }
    if (koodiArvo == undefined) {
        return;
    }
    if (!onkoFloat(latArvo)) {
        return;
    }
    if (!onkoFloat(lonArvo)) {
        return;
    }

    lisaaRastiTietorakenteeseen(latArvo, lonArvo, koodiArvo);
    latLabel.value = "";
    lonLabel.value = "";
    koodiLabel.value = "";
    tulostaRastitKonsoliin();
}

// Funktio, joka luo www-sivulle rastin lisäämistä varten lomakkeen
function luoRastiLomake() {
    let form = document.getElementsByTagName('form')[0];

    let fieldset = document.createElement('fieldset');
    let legend = document.createElement('legend');
    legend.textContent = "Rastin tiedot";

    let labelLatille = document.createElement('label');
    let spanLatille = document.createElement('span');
    spanLatille.textContent = "Lat";
    let inputLatille = document.createElement('input');
    inputLatille.type = "text";
    inputLatille.value = "";
    labelLatille.appendChild(spanLatille);
    labelLatille.appendChild(inputLatille);
    
    let labelLonille = document.createElement('label');
    let spanLonille = document.createElement('span');
    spanLonille.textContent = "Lon";
    let inputLonille = document.createElement('input');
    inputLonille.type = "text";
    inputLonille.value = "";
    labelLonille.appendChild(spanLonille);
    labelLonille.appendChild(inputLonille);

    let labelKoodille = document.createElement('label');
    let spanKoodille = document.createElement('span');
    spanKoodille.textContent = "Koodi";
    let inputKoodille = document.createElement('input');
    inputKoodille.type = "text";
    inputKoodille.value = "";
    labelKoodille.appendChild(spanKoodille);
    labelKoodille.appendChild(inputKoodille);

    let button = document.createElement('button');
    button.id = "rasti";
    button.textContent = "Lisää rasti";

    fieldset.appendChild(legend);
    fieldset.appendChild(labelLatille);
    fieldset.appendChild(labelLonille);
    fieldset.appendChild(labelKoodille);
    fieldset.appendChild(button);
    form.appendChild(fieldset);

    button.addEventListener("click", lisaaRasti);
}


//Kutsutaan tarvittavia funktioita load-tapahtumankäsittelijästä
window.addEventListener("load", function() {
    listaaJoukkueetJaSarjat();
    luoRastiLomake();
});

console.log(data);

