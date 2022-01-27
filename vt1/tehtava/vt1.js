"use strict";
//@ts-check 
// Joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// Joukkueen leimaamat rastit ovat viitteitä data.rastit-taulukossa lueteltuihin rasteihin
// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 

console.log(data);
console.dir(data);

var testiJoukkueenSarja = data.sarjat[2];

var testiJoukkue = { 
    "nimi": "Mallijoukkue",
    "jasenet": [
      "Lammi Tohtonen",
      "Matti Meikäläinen"
    ],
    "leimaustapa": [0,2],
    "rastit": [],
    "sarja": testiJoukkueenSarja,
    "id": 99999
};

lisaaJoukkue(data, testiJoukkue, testiJoukkueenSarja);
muutaSarjanNimi(data, "8h", "10h");


log();
tulostaJoukkueet(data);
log();
tulostaRastit(data);
log();
log("----------");
log("Taso 3");
log("----------");
log();
poistaJoukkue(data, "Vara 1");
poistaJoukkue(data, "Vara 2");
poistaJoukkue(data, "Vapaat");
let vaihdettavaRastiJoukkue = etsiJoukkue(data, "Dynamic Duo");
let uusiRasti = haeRastiKoodilla(data, 32);
vaihdaLeimattuRasti(vaihdettavaRastiJoukkue, 73, uusiRasti);
haeJoukkueetJaPisteet(data);
log();
log("----------");
log("TASO 5");
log("----------");
log();
tulostaTaso5(data);








//funktio joukkeiden tulostamiseen, parametrina funktio saa datan, josta joukkueet haetaan
function tulostaJoukkueet(data) {
    var joukkueet = data.joukkueet;
    var listaJoukkueidenNimista = [];

    for (let i = 0; i<joukkueet.length; i++ ) {
        listaJoukkueidenNimista.push(joukkueet[i].nimi.trim() + ' ' + joukkueet[i].sarja.nimi.trim());
    }
    listaJoukkueidenNimista.sort(function (a, b) {
        var eka = a.toLowerCase().trim();
        var toka = b.toLowerCase().trim();
        if (eka < toka) {
            return -1;
        }
        if (eka > toka) {
            return 1;
        }
        return 0;
    });

    for (let joukkue of listaJoukkueidenNimista){
        log(joukkue.trim());
    }
}

//joukkueen lisäämiseen tarkoitettu funktio, tarkistaa aluksi onko sarja hyväksyttävä ja tuleeko funktiolle
//tarpeeksi parametreja
function lisaaJoukkue(data, joukkue, sarja) {
    if (data == null) {
        return;
    }
    if (joukkue == null) {
        return;
    }
    if (sarja == null) {
        return;
    }
    
    for (let i = 0; i<data.sarjat.length; i++) {
        if (sarja === data.sarjat[i]) {
            data.joukkueet.push(joukkue);
            return;
        }
    }
}

//funktio, joka muuttaa sarjan nimen
function muutaSarjanNimi (data, vanhanimi, uusinimi) {
    for (let i = 0; i<data.sarjat.length; i++) {
        if (data.sarjat[i].nimi == vanhanimi) {
            data.sarjat[i].nimi = uusinimi;
        }
    }
}

//funktio rastien tulostamiseen, rastien koodit haetaan taulukkoon ja ne tulostetaan samalle riville,
//vain kokonaisluvulla alkavat rastikoodit hyväksytään.
function tulostaRastit(data) {
    var rastit = [];
    for (let i = 0; i<data.rastit.length; i++) {
        if (!isNaN(data.rastit[i].koodi.charAt(0))){
        rastit.push(data.rastit[i].koodi);
    }

    }
    rastit.sort();
    log(rastit.join(';') + ';');
}

//funktio, joka poistaa joukkueen tietorakenteesta hyödyntäen splice-metodia
//poisto hoidetaan nimen perusteella
function poistaJoukkue(data, poistettava) {
    for (let i = 0; data.joukkueet.length; i++) {
        if (poistettava == data.joukkueet[i].nimi) {
            data.joukkueet.splice(i,1);
            return;
        }
    }
}

//etsii rakenteesta rastin parametrina annetun rastikoodin avulla
//palauttaa null, jos koodilla ei löydy rastia
function haeRastiKoodilla(data, rastinKoodi) {
    for (let i = 0; i<data.rastit.length; i++) {
        if (data.rastit[i].koodi == rastinKoodi) {
            return data.rastit[i];
        }
    }
    return null;
}

//etsii joukkueen tietorakenteesta nimen perusteella
//palauttaa null, jos joukkuetta ei löydy
//löytäessään palauttaa joukkue-objektin
function etsiJoukkue(data, etsittavaJoukkue) {
    for (let i = 0; i<data.joukkueet.length; i++) {
        if (etsittavaJoukkue == data.joukkueet[i].nimi.trim()) {
            return data.joukkueet[i];
        }
    }
    return null;
}


//funktio vaihtaa jo leimatun rastin toiseksi 
function vaihdaLeimattuRasti(joukkue, rastiIdx, uusirasti, aika) {
    if (joukkue == null) {
        return;
    }
    if (rastiIdx >= joukkue.rastit.length) {
        return;
    }
    var asetettavaAika = aika;
    if (aika == null) {
        asetettavaAika = joukkue.rastit[rastiIdx].aika;
    }

    for (let i = 0; i<data.rastit.length; i++) {
        if (data.rastit[i] == uusirasti) {
            break;
        }
        
    }

    joukkue.rastit[rastiIdx].aika = asetettavaAika;
    joukkue.rastit[rastiIdx].rasti = uusirasti;
}

/*
 * apufunktio tarkistamaan, onko käytävä rasti hyväksyttävä, eli sisältää kaiken tarvittavan tiedon.
 * @param {object} - rasti, jota tutkitaan
 * @return - totuusarvo, true -> jos data on hyvää, muuten false
*/
function tarkistaOnkoRastiHyvaaDataa(joukkueenRasti) {
    if (joukkueenRasti == undefined) {
        return false;
    }
    if (joukkueenRasti.koodi == undefined) {
        return false;
    }

    return true;
}

//funktio, joka hakee joukkueen pisteet
function haePisteet(data, joukkue) {
    var rastitKaymatta = Array.from(data.rastit);
    var yhteispisteet = 0;
    var indeksiViimeisimmalleLahtoLeimaukselle;
    //jos joukkueella ei ole rasteja käytynä ollenkaan, palautetaan yhteispisteiksi 0
    if (joukkue.rastit.length == 0) {
        return 0;
    }

    //etsitään viimeisen lähtöleimauksen indeksi
    for (let i = 0; i < joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == undefined) {
            continue;
        }
        if (joukkue.rastit[i].rasti.koodi == "LAHTO") {
            indeksiViimeisimmalleLahtoLeimaukselle = i;
        }
    }

    //viimeisestä lähtöleimauksesta eteenpäin aletaan iteroimaan rasteja yksi kerrallaan, vain oikeat rastit hyväksytään
    for (let i = indeksiViimeisimmalleLahtoLeimaukselle+1; i<joukkue.rastit.length; i++) {
        if (!tarkistaOnkoRastiHyvaaDataa(joukkue.rastit[i].rasti)) {
            continue;
        }
        let rastikoodi = joukkue.rastit[i].rasti.koodi;
        if ( rastikoodi == "MAALI") {
            return yhteispisteet;
        }
        for (let j = 0; j < rastitKaymatta.length; j++) {
            if (rastikoodi == rastitKaymatta[j].koodi) {
                yhteispisteet += parseInt(rastikoodi.charAt(0));
                rastitKaymatta.splice(j,1);
                break;
            }
            
        }
    }

    return yhteispisteet;

}

//funktio joka hoitaa joukkueen nimen ja pisteet taulukkoon, josta ne voi tulostaa
function haeJoukkueetJaPisteet(data) {
    var pistetaulukko = []; 
    for (let i = 0; i < data.joukkueet.length; i++) {
        let joukkueenNimi = data.joukkueet[i].nimi.trim();
        let pisteet = haePisteet(data, data.joukkueet[i]);
        let uusiObjekti = {
            nimi: joukkueenNimi,
            pisteet: pisteet
        };
        pistetaulukko.push(uusiObjekti);
    }

    pistetaulukko.sort(function (a,b) {
        if (b.pisteet - a.pisteet == 0) {
            var nimi1 = a.nimi.toLowerCase();
            var nimi2 = b.nimi.toLowerCase();
            if (nimi1 < nimi2) {
                return -1;
            }
            if (nimi1 > nimi2) {
                return 1;
            }
            return 0;
        }
        return b.pisteet - a.pisteet;
    });

    for (let i = 0; i<pistetaulukko.length; i++) {
        log(pistetaulukko[i].nimi + " (" + pistetaulukko[i].pisteet + " p)");
    }
    
}

//apufunktio laskemaan etäisyyttä
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  //apufunktion apufunktio
  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

//funktio selvittämään joukkueen kokonaisuudessa kuljetun matkan
function joukkueenKuljettuMatka(data, joukkue) {
    var rastitKaymatta = Array.from(data.rastit);
    var kuljettuMatka = 0;
    var verrattavaRasti = [];
    
    //jos joukkueella ei ole ollenkaan rasteja käytynä, ei myöskään ole kuljettu yhtään minnekään
    if (joukkue.rastit.length == 0) {
        return 0;
    }

    /*etsitään aluksi viimeisin lähtöleimaus, jotta tiedetään, mistä aloittaa kuljetun matkan mittaaminen
     * lisäksi talletetaan lähtö-rastin koordinaatit verrattavaRasti-muuttujaan
     */
    var indeksiViimeisimmalleLahtoLeimaukselle;
    
    for (let i = 0; i < joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == undefined) {
            continue;
        }
        if (joukkue.rastit[i].rasti.koodi == "LAHTO") {
            indeksiViimeisimmalleLahtoLeimaukselle = i;
            let lon = joukkue.rastit[i].rasti.lon;
            let lat = joukkue.rastit[i].rasti.lat;
            verrattavaRasti.push(lat);
            verrattavaRasti.push(lon);
        }
    }

    for (let i = indeksiViimeisimmalleLahtoLeimaukselle+1; i<joukkue.rastit.length; i++) {
        if (!tarkistaOnkoRastiHyvaaDataa(joukkue.rastit[i].rasti)) {
            continue;
        }
        
        let rastikoodi = joukkue.rastit[i].rasti.koodi;
        if ( rastikoodi == "MAALI") {
            kuljettuMatka += getDistanceFromLatLonInKm(verrattavaRasti[0], verrattavaRasti[1], joukkue.rastit[i].rasti.lat, joukkue.rastit[i].rasti.lon); 
            return Math.round(kuljettuMatka);
        }
        
        if (joukkue.rastit[i].rasti.lon == undefined || joukkue.rastit[i].rasti.lat == undefined) {
            continue;
        }

        for (let j = 0; j < rastitKaymatta.length; j++) {
            if (rastikoodi == rastitKaymatta[j].koodi) {
                let nykyinenLon = rastitKaymatta[j].lon;
                let nykyinenLat = rastitKaymatta[j].lat;

                let etaisyysEdellisesta = getDistanceFromLatLonInKm(verrattavaRasti[0], verrattavaRasti[1], nykyinenLat, nykyinenLon);
                kuljettuMatka += etaisyysEdellisesta;

                verrattavaRasti.splice(0, 1, nykyinenLat);
                verrattavaRasti.splice(1, 1, nykyinenLon);
                rastitKaymatta.splice(j,1);
                break;
            }
        }
        
        
        
    }
    
    return Math.round(kuljettuMatka);

}

//funktio, joka palauttaa ajan, mikä joukkueelta kuluu lähtö- ja maalirastin välissä
function kaytettyAikaSuoritukseen(data, joukkue) {
    var lahtorastinLeimausAika;
    var maalirastinLeimausAika;
    var indeksiViimeisimmalleLahtoLeimaukselle;

    //jos joukkueella ei ole ollenkaan rasteja, ei aikaakaan ole kulunut suoritukseen
    if (joukkue.rastit.length == 0) {
        return '00:00:00';
    }

    for (let i = 0; i< joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == undefined) {
            continue;
        }
        if (joukkue.rastit[i].rasti.koodi == "LAHTO") {
            indeksiViimeisimmalleLahtoLeimaukselle = i;
        }
    }
    lahtorastinLeimausAika = joukkue.rastit[indeksiViimeisimmalleLahtoLeimaukselle].aika;

    for (let i = indeksiViimeisimmalleLahtoLeimaukselle+1; i < joukkue.rastit.length; i++) {
        if (!tarkistaOnkoRastiHyvaaDataa(joukkue.rastit[i].rasti)) {
            continue;
        }
        let rastikoodi = joukkue.rastit[i].rasti.koodi;
        if ( rastikoodi == "MAALI") {
            maalirastinLeimausAika = joukkue.rastit[i].aika;
            break;
        }
    }


    //tässä hieman omaperäinen kikkailu, jotta aikaero saadaan selville, käytännössä alkuaika ja loppuaika muutetaan sekunneiksi ja
    //lasketaan näiden välinen erotus. lopuksi palautetaan aika oikeassa ja nätissä muodossa.
    let dateTaulukossaLahto = lahtorastinLeimausAika.split(' ');
    let aikaAlussa = dateTaulukossaLahto[1];
    let aikaAlussaTaulukossa = aikaAlussa.split(':');
    let tunnitAlussa = parseInt(aikaAlussaTaulukossa[0]);
    let minuutitAlussa = parseInt(aikaAlussaTaulukossa[1]);
    let sekunnitAlussa = parseInt(aikaAlussaTaulukossa[2]);
    let aikaKokonaisuudessaanAlussaSekunneissa = (tunnitAlussa*3600) + (minuutitAlussa*60) + sekunnitAlussa;

    let dateTaulukossaMaali = maalirastinLeimausAika.split(' ');
    let aikaLopussa = dateTaulukossaMaali[1];
    let aikaLopussaTaulukossa = aikaLopussa.split(':');
    let tunnitLopussa = parseInt(aikaLopussaTaulukossa[0]);
    let minuutitLopussa = parseInt(aikaLopussaTaulukossa[1]);
    let sekunnitLopussa = parseInt(aikaLopussaTaulukossa[2]);
    let aikaKokonaisuudessaanLopussaSekunneissa = (tunnitLopussa*3600) + (minuutitLopussa*60) + sekunnitLopussa;

    let vastaus = aikaKokonaisuudessaanLopussaSekunneissa-aikaKokonaisuudessaanAlussaSekunneissa;
    let tunnit = parseInt(vastaus/3600);
    let minuutit = parseInt((vastaus-(tunnit*3600))/60);
    let sekunnit = vastaus-(tunnit*3600)-(minuutit*60);

    if (tunnit.toString().length == 1) {
        tunnit = "0" + tunnit; 
    }
    if (minuutit.toString().length == 1) {
        minuutit = "0" + minuutit; 
    }
    if (sekunnit.toString().length == 1) {
        sekunnit = "0" + sekunnit; 
    }
    
    return tunnit + ':' + minuutit + ':' + sekunnit;


}

/*funktio tulostaa tason 5 vaatimusten mukaiset asiat:
 * - joukkueen nimi
 * - joukkueen pisteet
 * - joukkueen kuljettu matka
 * - joukkueen käyttämä aika 
 */
 function tulostaTaso5(data) {
    var taulukko = [];
    for (let i = 0; i < data.joukkueet.length; i++) {
        let joukkueenNimi = data.joukkueet[i].nimi;
        let joukkueenPisteet = haePisteet(data, data.joukkueet[i]);
        let matkanPituus = joukkueenKuljettuMatka(data, data.joukkueet[i]);
        let joukkueenKayttamaAika = kaytettyAikaSuoritukseen(data, data.joukkueet[i]);

        let objektiTaulukkoon = {
            nimi: joukkueenNimi,
            pisteet: joukkueenPisteet,
            kuljettuMatka: matkanPituus,
            kaytettyAika: joukkueenKayttamaAika
        };
        taulukko.push(objektiTaulukkoon);

    }
    taulukko.sort(function (a, b) {
        return a.nimi.localeCompare(b.nimi);
    });

    taulukko.sort(function (a, b) {
        if(b.pisteet == a.pisteet) {
            return b.kaytettyAika.replace(':', '').replace(':', '') - a.kaytettyAika.replace(':', '').replace(':', '');
        }

        return b.pisteet - a.pisteet;
    });

    for (let i = 0; i<taulukko.length; i++) {
        log(taulukko[i].nimi.trim() + ', ' + taulukko[i].pisteet + ' p, ' + taulukko[i].kuljettuMatka + ' km, ' + taulukko[i].kaytettyAika);
    }

}