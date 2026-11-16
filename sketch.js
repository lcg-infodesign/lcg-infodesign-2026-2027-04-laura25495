let data;

let continenti = ["Africa", "Asia", "Europa", "America", "Oceania"];
let quantita = [0, 0, 0, 0, 0]; //nome dell'array che conta i fiumi
let colori = ["#222222", "#F4C430", "#31A354", "#E53935", "#2878E3"];

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // carico il dataset
  data = await loadTable("assets/rivers_world - Data.csv", ",", "header");

  // contoo i fiumi di ogni continente
  for (let i = 0; i < data.getRowCount(); i++) {

    let continente = data.getString(i, "continent"); //nel datatset c'è continent quindi gli dico che la mia variabile continente corrisponde a continent

    if (continente === "Africa") {
      quantita[0]++;
    } else if (continente === "Asia") {
      quantita[1]++;
    } else if (continente === "Europe") {
      quantita[2]++;
    } else if (continente === "North America" || continente === "South America") {
      quantita[3]++;
    } else if (continente === "Australia" || continente === "Oceania") {
      quantita[4]++;
    }
  }
}

function draw() {
  background("#F5F5F5");

  //titolo
noStroke();
fill("#222222");
textAlign(LEFT);

textStyle(BOLD);
textSize(36);
text("Rivers World", 60, 60);

//introduzione
textStyle(BOLD);
textSize(16);
text("100 fiumi del mondo, suddivisi in 5 aree continentali.", 60, 90);

//obiettivi di conoscenza
textStyle(BOLD);
textSize(14);
text("Obiettivi di conoscenza", 60, 140);

textStyle(NORMAL);
textSize(12);
text("Confrontare le caratteristiche dei fiumi del mondo", 60, 160);
text("e le relazioni tra area, portata, lunghezza e temperature.", 60, 180);

//come leggere i dati
textStyle(BOLD);
textSize(14);
text("Come leggere i dati", 60, 220);

textStyle(NORMAL);
textSize(12);
text("Ogni rettangolo rappresenta un fiume.", 60, 240);
text("I colori distinguono i continenti.", 60, 260);
text("Clicca su una colonna per esplorare i dati.", 60, 280);

//come leggere le visualizzazioni dei continenti
textStyle(BOLD);
textSize(14);
text("Area e portata", 60, 320);

textStyle(NORMAL);
textSize(12);
text("Ogni punto rappresenta un fiume.", 60, 340);
text("Asse X: area del bacino idrografico (km²).", 60, 360);
text("Asse Y: portata del fiume (m³/s).", 60, 380);

//lunghezza
textStyle(BOLD);
textSize(14);
text("Lunghezza", 60, 420);

textStyle(NORMAL);
textSize(12);
text("La barra colorata indica la lunghezza del fiume.", 60, 440);
text("La scala è uguale per tutti: da 0 a 7000 km.", 60, 460);


//temperature
textStyle(BOLD);
textSize(14);
text("Temperature", 60, 500);

textStyle(NORMAL);
textSize(12);
text("La linea colorata indica l'intervallo minimo-massimo.", 60, 520);
text("Il pallino nero rappresenta la temperatura media.", 60, 540);
text("La scala è uguale per tutti: da -10°C a 30°C.", 60, 560);

  noStroke();

  let margine = 650; //spazio tra il bordo del canvas e le colonne
  let margineDestro = 120;
  let larghezzaRettangolo = 45; //larghezza, altezza e distanza tra un rettangolino e l'altro dei glifi che rappresentano i fiumi
  let distanzaColonne = (width - margine - margineDestro - larghezzaRettangolo * 5) / 4; //larghezza di ogni colonna. larghezza del canvas meno il margine per 2 (sx e dx) meno la larghezza del rettangolo (che poi è la òlarghezza della colonna) per 5 (perchè sono 5 colonne) e diviso 4 perchè ho 4 spazi tra le 5 colonne. tutto questo per centrare il grafico nella pagina

  let altezzaRettangolo = 9;
  let distanza = 5;

  let baseY = height - 130; //coordinata verticale di base per disegnare le colonne dei fiumi che parte da 130px dal basso

  // ciclo per disegnare le colonne dei fiumi per ogni continente. variabile i per il numero di continenti
  for (let i = 0; i < 5; i++) {

    let x = margine + i * (larghezzaRettangolo + distanzaColonne); //gli diciamo che la coordinata x di ogni colonna parte dal margine e poi aggiunge la larghezza della colonna moltiplicata per il numero del continente (i)

    fill(colori[i]); 

    // ciclo per disegnare i rettangoli che rappresentano i fiumi. cambio nome della variabileper il numero di fiumi
    for (let j = 0; j < quantita[i]; j++) {

      let y = baseY - j * (altezzaRettangolo + distanza);

      rect(x, y, larghezzaRettangolo, altezzaRettangolo, 2);
    }

    // nome del continente sotto la colonna
    fill("#222222");
    textSize(18);
    textAlign(CENTER);
    text(continenti[i], x + larghezzaRettangolo / 2, baseY + 35);

    // numero dei fiumi sotto il nome del continente
    textSize(13);
    text(quantita[i] + " fiumi", x + larghezzaRettangolo / 2, baseY + 55);
  }

  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function mousePressed() { //funzione che mi permette di cliccare sulle colonne e andare alla pagina corrispondente

  //ripetiamo posizione delle colonne e rettangoli per capire se il mouse è sopra un rettangolo
  let margine = 650;
  let margineDestro = 120;
  let larghezzaRettangolo = 45;
  let distanzaColonne = (width - margine - margineDestro - larghezzaRettangolo * 5) / 4;

  let altezzaRettangolo = 9;
  let distanza = 5;

  let baseY = height - 130;

  let pagine = [ //associamo una pagina ad ogni continente
    "africa.html",
    "asia.html",
    "europa.html",
    "america.html",
    "oceania.html"
  ];

  //ciclo che controlla una alla volta le cinque colonne per capire su quale ho cliccato
  for (let i = 0; i < 5; i++) {

    let xInizio = margine + i * (larghezzaRettangolo + distanzaColonne); //coordinata x di inizio della colonna  
    let xFine = xInizio + larghezzaRettangolo;

    let yInizio = baseY - (quantita[i] - 1) * (altezzaRettangolo + distanza);
    let yFine = baseY + altezzaRettangolo;

    if (mouseX >= xInizio && mouseX <= xFine &&
        mouseY >= yInizio && mouseY <= yFine) {

      window.location.href = pagine[i];
    }
  }
}
