"use strict";
//@ts-check 

// Funktio piirtämään pöllö sivulle. Pöllö leikataan myös neljään osaan tässä.
function piirraPollo() {
    let kuva = document.getElementsByTagName("img")[0];
    
    let canvas1 = document.getElementById("pollo_vasenYla");
    let ctx = canvas1.getContext("2d");
    ctx.drawImage(kuva, 0, 0, 282, 276, 0, 0, 282, 276);
    

    let canvas2 = document.getElementById("pollo_oikeaYla");
    let ctx2 = canvas2.getContext("2d");
    ctx2.drawImage(kuva, 282, 0, 282, 276, 0, 0, 282, 276);

    let canvas3 = document.getElementById("pollo_vasenAla");
    let ctx3 = canvas3.getContext("2d");
    ctx3.drawImage(kuva, 0, 276, 282, 276, 0, 0, 282, 276);

    let canvas4 = document.getElementById("pollo_oikeaAla");
    let ctx4 = canvas4.getContext("2d");
    ctx4.drawImage(kuva, 282, 276, 282, 276, 0, 0, 282, 276);
}

// Funktio piirtämään sivulle halutun määrän palkkeja. Pienellä refaktoroinnilla, funktiolle voidaan vaikka kuljettaa
// parametrina haluttu määrä palkkeja
function piirraPalkit() {
    let delay = 0;
    let palkkienMaara = 10;

    for (let i = 0; i<palkkienMaara; i++) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let taustapalkki = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svg.appendChild(taustapalkki);
        
        //Svg-elementin muokkaus
        svg.setAttribute("class", "palkki");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
    
        //Lisätään viivettä lisää jokaisella kierroksella, jotta palkit tulevat linjakkain.
        svg.style.animationDelay = delay + 100 + "ms";
    
        //Asetetaan itse palkille vielä speksit kuntoon
        taustapalkki.setAttribute("width", "10%");
        taustapalkki.setAttribute("height", "100%");
        document.body.appendChild(svg);
    
        //Päivitetään viiveelle uusi arvo.
        delay = delay + 100;
    }
}


window.onload = function() {
    piirraPollo();
    piirraPalkit();
};
