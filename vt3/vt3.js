"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 

console.log(data);

// Funktio, joka hakee tietorakenteesta löytyvät sarjat valittaviksi radiobuttoneiksi
function haeSarjatRadioButtoneiksi() {
    let paikka = document.getElementsByTagName("span")[0];
    let rastit_t = [];
    
    for (let i = 0; i < data.sarjat.length; i++) {
        rastit_t.push(data.sarjat[i]);
    }

    rastit_t.sort(function (a, b) {
        return parseInt(a.nimi)-parseInt(b.nimi);
    });
    
    
    for (let i = 0; i<rastit_t.length; i++) {
        let rasti = rastit_t[i];
        let uusiLabeli = document.createElement("label");
        uusiLabeli.textContent = rasti.nimi;
        
        let uusiInputti = document.createElement("input");
        uusiInputti.setAttribute("type", "radio");
        uusiInputti.setAttribute("name", "sarja");
        uusiInputti.setAttribute("value", rasti.id);
        uusiInputti.setAttribute("class", "sarjaradio");
        if(i==0) {
            uusiInputti.setAttribute("checked", "checked");
        }

        uusiLabeli.appendChild(uusiInputti);
        
        paikka.appendChild(uusiLabeli);
    }
}

// Pieni apufunktio jeesaamaan sarjan noutamisessa. Funktio saa parametrina joukkueen nimen, joka tässä tietorakennetoteutuksessa on yksi-
// löllinen ja tämän perusteella palauttaa joukkueen sarjan.
function haeSarja(joukkueenNimi) {
    let sarjaId = -1;

    for (let i = 0; i < data.joukkueet.length; i++) {
        if (data.joukkueet[i].nimi == joukkueenNimi) {
            sarjaId = data.joukkueet[i].sarja;
        }
    }

    for (let i = 0; i <data.sarjat.length; i++) {
        if (data.sarjat[i].id == sarjaId) {
            return data.sarjat[i].nimi;
        }
    }
}

// Funktio, joka tulostaa sivun alalaitaan (jäsenten lisäämis-formin jälkeen)
// joukkueet aakkosjärjestyksessä, joukkueen nimen alla on myös sisennettynä joukkueen jäsenet
// samalla tavoin aakkosjärjestyksessä. Joukkueen nimi on tehtävänannon mukaan yksilöllinen, joten aluksi
// etsitään joukkueen nimet taulukkoon ja sortataan tämä. Aakkosjärjestyksessä olevaa taulukkoa aletaan taas
// iteroimaan ja haetaan jäsenet järjestykseen.
function tulostaJoukkueetJaJasenet() {
    let joukkueetJarjestyksessa = [];

    for (let i = 0; i <data.joukkueet.length; i++) {
        joukkueetJarjestyksessa.push(data.joukkueet[i].nimi);
    }
    joukkueetJarjestyksessa.sort(function (a, b) {
        let nimi1 = a.toLowerCase().trim();
        let nimi2 = b.toLowerCase().trim();

        if (nimi1 < nimi2) {
            return -1;
        }
        if (nimi1 > nimi2) {
            return 1;
        }
        return 0;
    });

    let elementtiTaulukko = [];

    for (let i = 0; i < joukkueetJarjestyksessa.length; i++) {
        let joukkue = joukkueetJarjestyksessa[i];
        let jasenet = [];

        for (let j = 0; j < data.joukkueet.length; j++) {
            if (data.joukkueet[j].nimi == joukkue) {
                jasenet = Array.from(data.joukkueet[j].jasenet);
            }
        }
        jasenet.sort();

        let li = document.createElement("li");
        li.textContent = joukkue.trim()+" ";
        
        let strong = document.createElement("strong");
        let sarjaOikeassaMuodossa = parseInt(haeSarja(joukkue)) + " h";
        strong.textContent = sarjaOikeassaMuodossa;
        li.appendChild(strong);

        let ul = document.createElement("ul");
        for (let k = 0; k < jasenet.length; k++) {
            let jasen_li = document.createElement("li");
            jasen_li.textContent = jasenet[k];
            ul.appendChild(jasen_li);
        }
        li.appendChild(ul);
        elementtiTaulukko.push(li);
    }

    let oikea_paikka_ul = document.getElementById("joukkuelistaus");
    for (let i = 0; i < elementtiTaulukko.length; i++) {
        oikea_paikka_ul.appendChild(elementtiTaulukko[i]);
    }
}

function haeSarjaObjektiIdlla(id) {
    for (let i = 0; i < data.sarjat.length; i++) {
        if (data.sarjat[i].id == id) {
            return data.sarjat[i];
        }
    }
}

// Apufunktio tarkastamaan joukkueen nimi mahdollisia duplikaatteja varten.
// palautetaan true, jos tällä nimellä löytyy jo joukkue.
function tarkistaJoukkueenNimi(nimi) {
    let sanitoituNimi = nimi.toLowerCase().trim();
    for (let i = 0; i < data.joukkueet.length; i++) {
        let sanitoituDatastaLoytyvaJoukkue = data.joukkueet[i].nimi.toLowerCase().trim();
        if (sanitoituDatastaLoytyvaJoukkue == sanitoituNimi) {
            return true;
        } 
    }
    return false;
}

// Apufunktio, joka käy läpi datan joukkueiden id:t ja palauttaa uuden uniikin yhtä suuremman id:n kuin edellinen suurin.
function haeJoukkueelleUusiID() {
    let id = 0;
    for (let i = 0; i < data.joukkueet.length; i++) {
        if (data.joukkueet[i].id > id) {
            id = data.joukkueet[i].id;
        }
    }
    return id+1;
}

//Apufunktio asettamaan lomakkeen takaisin default-asetuksille, eli tyhjentää input kentät
function tyhjennaLomake() {
    //Joukkueen nimi input-kentän nollaus
    let joukkueenNimiInput = document.getElementById("joukkueen_nimi");
    joukkueenNimiInput.value = "";

    //Radiobuttonin asettaminen defaulttiin, eli ensimmäiseen
    let joukkueenTiedotFieldset = document.getElementsByTagName("fieldset")[0];
    let oikea_p = joukkueenTiedotFieldset.getElementsByTagName("p")[1];
    let radiobutton_span = oikea_p.getElementsByTagName("span")[0];
    let eka_labeli = radiobutton_span.getElementsByTagName("label")[0];
    let inputtiKentta = eka_labeli.getElementsByTagName("input")[0];
    inputtiKentta.setAttribute("checked", "checked");

    //Jäsenten input-kenttien nollaus ja turhien poisto
    let jasenfieldset = document.getElementById("jasenFieldset");
    let p_elementti = jasenfieldset.getElementsByTagName("p")[0];
    let labelit = p_elementti.getElementsByTagName("label");

    for (let i = labelit.length - 1; i >= 0; i--) {
        labelit[i].remove();
    }
    haeLomakkeelleJasenInputit();
}

function tallennaJoukkue(e) {
    e.preventDefault();
    
    //Haetaan ensiksi käyttäjän syöttämä joukkueen nimi talteen
    let form = e.target.parentNode;
    let fieldset = form.getElementsByTagName("fieldset")[0];
    let p1 = fieldset.getElementsByTagName("p")[0];
    let input = p1.getElementsByTagName("input")[0];
    let joukkueenNimi = input.value;

    //Asetetaan virheilmoitus, jos yritetään tallettaa kahta samannimistä joukuetta kantaan
    input.setCustomValidity("");
    if (tarkistaJoukkueenNimi(joukkueenNimi)) {
        input.setCustomValidity("Joukkueen nimi on jo varattu");
        input.reportValidity();
        return;
    }
    //Virheilmoitus annetaan myös, jos joukkueen nimi on tyhjä tai alle kaksi merkkiä pitkä
    if (joukkueenNimi.length < 2) {
        input.setCustomValidity("Joukkueen nimen tulee olla pidempi kuin kaksi merkkiä");
        input.reportValidity();
        return;
    }

    //Seuraavaksi haetaan sarja talteen radio-buttoneista
    let p2 = fieldset.getElementsByTagName("p")[1];
    let span = p2.getElementsByTagName("span")[0];
    let radioButtonLabelit_t = span.getElementsByTagName("label");
    let sarjaId = -1;

    for (let i = 0; i < radioButtonLabelit_t.length; i++) {
        let input = radioButtonLabelit_t[i].getElementsByTagName("input")[0];
        if (input.checked) {
            sarjaId = input.value;
            break;
        }
    }

    let sarjaObjekti = haeSarjaObjektiIdlla(sarjaId);

    //tähän vielä jäsenten hakeminen formista ja lisääminen joukkueelle
    let fieldset2 = form.getElementsByTagName("fieldset")[1];
    let jasen_p = fieldset2.getElementsByTagName("p")[0];
    let jasen_labelit = jasen_p.getElementsByTagName("label");

    let jasenet_t = [];

    for (let i = 0; i < jasen_labelit.length; i++) {
        let jasenenNimi = jasen_labelit[i].getElementsByTagName("input")[0].value;
        if ( jasenenNimi != "" ) {
            jasenet_t.push(jasenenNimi);
        }
    }

    let jasenenNimi_input = jasen_labelit[0].getElementsByTagName("input")[0];
    jasenenNimi_input.setCustomValidity("");
    if (jasenet_t.length < 2) {
        jasenenNimi_input.setCustomValidity("Joukkueella tulee olla vähintään 2 jäsentä");
        jasenenNimi_input.reportValidity();
        return;
    }

    let lisattavaJoukkue = {
        nimi: joukkueenNimi,
        id: haeJoukkueelleUusiID(),
        sarja: sarjaObjekti.id,
        jasenet: jasenet_t,
        leimaustapa: [0],
        rastit: []
    };
    data.joukkueet.push(lisattavaJoukkue);

    //Poistetaan vanha joukkuelistaus
    document.getElementById("joukkuelistaus").textContent = "";
    //Ja lisätään uusi
    tulostaJoukkueetJaJasenet();
    //Lomakkeen tyhjennys onnistuneen lisäyksen jälkeen
    tyhjennaLomake();
    

}

function haeLomakkeelleJasenInputit() {
    let jasenetFieldset = document.getElementsByTagName("fieldset")[1];
    let p_elementti = jasenetFieldset.getElementsByTagName("p")[0];
    
    let uusiLabel1 = document.createElement("label");
    uusiLabel1.textContent = "Jäsen 1";
    let uusiInput1 = document.createElement("input");
    uusiInput1.setAttribute("type", "text");
    uusiInput1.setAttribute("value", "");
    uusiLabel1.appendChild(uusiInput1);
    

    let uusiLabel2 = document.createElement("label");
    uusiLabel2.textContent = "Jäsen 2";
    let uusiInput2 = document.createElement("input");
    uusiInput2.setAttribute("type", "text");
    uusiInput2.setAttribute("value", "");
    uusiLabel2.appendChild(uusiInput2);

    p_elementti.appendChild(uusiLabel1);
    p_elementti.appendChild(uusiLabel2);
    
    let inputit = jasenetFieldset.getElementsByTagName("input");
    inputit[0].addEventListener("input", lisaaUusi);
    inputit[1].addEventListener("input", lisaaUusi);
    

    // Funktio, joka hoitaa uusien input-rivien lisäämisen tarvittaessa (jos jäseniä enemmän, kuin kaksi)
    // Funktio noudattaa esimerkkiä opetusmateriaalista
    function lisaaUusi(e) {
        let viimeinenTyhja = -1;
        for (let i=inputit.length-1; i>0; i--) {
            let input = inputit[i];
            if (viimeinenTyhja > -1 && input.value.trim() == "") {
                let poistettava = inputit[viimeinenTyhja].parentNode;
                jasenetFieldset.getElementsByTagName("p")[0].removeChild(poistettava);
                viimeinenTyhja = i;
            }
            if (viimeinenTyhja == -1 && input.value.trim() == "") {
                viimeinenTyhja = i;
            }
        }

        if (viimeinenTyhja == -1) {
            let label = document.createElement("label");
            label.textContent = "Jäsen";
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.addEventListener("input", lisaaUusi);
            jasenetFieldset.getElementsByTagName("p")[0].appendChild(label).appendChild(input);
        }
        for(let i=0; i<inputit.length; i++) { // inputit näkyy ulommasta funktiosta
            let label = inputit[i].parentNode;
            label.firstChild.nodeValue = "Jäsen " + (i+1); // päivitetään labelin ekan lapsen eli tekstin sisältö
    }

    
    }

}

window.addEventListener("load", function() {
    haeSarjatRadioButtoneiksi();
    tulostaJoukkueetJaJasenet();

    let button = document.getElementsByTagName("button")[0];
    button.addEventListener("click", tallennaJoukkue);
    
    haeLomakkeelleJasenInputit();
    
});


