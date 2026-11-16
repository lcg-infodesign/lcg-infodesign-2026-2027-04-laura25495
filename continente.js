let data;
let fiumi = []; //creo array che conterrà le posizioni nel CSV dei fiumi appartenenti al continente selezionato

async function setup() {
  //createCanvas(windowWidth, windowHeight); perchè l'elenco dei fiume è lungo e non ci sta tutto in un pagina
  createCanvas(windowWidth, 2800);

// carico il dataset
  data = await loadTable("assets/rivers_world - Data.csv", ",", "header");

  //ciclo for che conta tutte le righe del csv
  for (let i = 0; i < data.getRowCount(); i++) {

    let continente = data.getString(i, "continent"); //qua gli dico di leggere il valore nella colonna continent e salvarlo nella variabile continente

    if (continente === continenteScelto) { //se il continente letto dal csv è uguale a quello scelto nella pagina html allora aggiungi quel fiume all'array
      fiumi.push(i); //push ti salva il numero della riga in cui si trova il dato non tutti i dati del fiume
    }

    //raggruppo nord e sud america
    if (continenteScelto === "America" &&
        (continente === "North America" || continente === "South America")) {
      fiumi.push(i);
    }

    //raggruppo australia e oceania
    if (continenteScelto === "Oceania" && continente === "Australia") {
      fiumi.push(i);
    }
  }
}


function draw() {
  background("#F5F5F5");

  //colore continente 
let coloreContinente = "#222222";

if (continenteScelto === "Africa") {
  coloreContinente = "#222222";
}
else if (continenteScelto === "Asia") {
  coloreContinente = "#F4C430";
}
else if (continenteScelto === "Europe") {
  coloreContinente = "#31A354";
}
else if (continenteScelto === "America") {
  coloreContinente = "#E53935";
}
else if (continenteScelto === "Oceania") {
  coloreContinente = "#2878E3";
}


 //nome del continente e numero di fiumi
  textSize(40);
  text(continenteScelto, 60, 100);

  textSize(18);
  text(fiumi.length + " fiumi", 60, 135);

  //posizione in cui mettere il grafico nella pagina (asse x e y)
  let xInizio = 120;
  let xFine = width - 80;

  let yInizio = 200;
  let yFine = 550;

  //prendiamo i valori massimi del csv di area e portata, ma li calcolcolo per contiente perchè hanno scale troppo diverse tra loro e la rappresentazione non viene bene se li metto tutti insieme. Quindi per ogni continente calcolo il massimo e lo uso per la funzione map che trasforma i valori in coordinate del grafico
  let areaMax = 0; //partiamo da 0 e scorriamo tutti i fiumi del continente selezionato per trovare il massimo
  let portataMax = 0;

  for (let i = 0; i < fiumi.length; i++) {

  let area = data.getNum(fiumi[i], "area");
  let portata = data.getNum(fiumi[i], "discharge");

  if (area > areaMax) {
    areaMax = area;
  }

  if (portata > portataMax) {
    portataMax = portata;
  }
}

areaMax = areaMax * 1.1;
portataMax = portataMax * 1.1; //aumento del 10% il valore massimo per non far toccare i cerchi al bordo del grafico
  
  //caratteristiche degli assi
  stroke("#222222");
  strokeWeight(1);

  line(xInizio, yInizio, xInizio, yFine);
  line(xInizio, yFine, xFine, yFine);


  //valori sull asse x con ciclo for che disegna 5 linee verticali e scrive il valore corrispondente sotto
for (let i = 0; i <= 4; i++) {

  let valore = areaMax / 4 * i; //qui il valore corrisponde al valore max dell area diviso 4 perchè le colonne sono 5 e gli spazi sono 4 per il valore massimo
  let x = map(valore, 0, areaMax, xInizio, xFine); //map trasforma il valore in una coordinata

  stroke("#222222");
  line(x, yFine, x, yFine + 5);

  noStroke();
  fill("#222222");
  textSize(12);
  textAlign(CENTER);
  text(round(valore), x, yFine + 20);
}


  //valori sull asse y con ciclo for che disegna 5 linee orizzontali e scrive il valore corrispondente sotto
  for (let i = 0; i <= 4; i++) {

  let valore = portataMax / 4 * i;
  let y = map(valore, 0, portataMax, yFine, yInizio);

  stroke("#222222");
  line(xInizio - 5, y, xInizio, y);

  noStroke();
  fill("#222222");
  textSize(12);
  textAlign(RIGHT);
  text(round(valore), xInizio - 12, y + 4);
}

textAlign(LEFT);


  //nomi degli assi
  noStroke();
  fill("#222222");
  textSize(16);

  textStyle(BOLD);
  textAlign(RIGHT);
  text("Area del bacino idrografico (km²)", xFine, yFine + 40);
  textAlign(LEFT);
  text("Portata del fiume (m³/s)", xInizio, yInizio - 20);

    let nomeHover = "";
    let distanzaMinima = 10;
  //cerchio per ogni fiume
  for (let i = 0; i < fiumi.length; i++) { //conta soltanto i fiumi selezionati per il continente

    let area = data.getNum(fiumi[i], "area"); //qui gli dico di leggere il valore nella colonna area e salvarlo nella variabile area
    let portata = data.getNum(fiumi[i], "discharge"); //qui gli dico di leggere il valore nella colonna discharge e salvarlo nella variabile portata
    let nome = data.getString(fiumi[i], "name");
    //leggi l'area e la portata del fiume poi si calcola dove devono trovarsi sul grafico e si disegna un cerchio nella posizione calcolata
    let x = map(area, 0, areaMax, xInizio, xFine); //funzione map che prendere il valore dell area o della portata e lo trasforma in una cordinata
    let y = map(portata, 0, portataMax, yFine, yInizio);

    noStroke();
    fill(coloreContinente);
    circle(x, y, 10);


  //controllo la distanza tra il mouse e il pallino
let distanza = dist(mouseX, mouseY, x, y);

if (distanza < distanzaMinima) {
  distanzaMinima = distanza;
  nomeHover = nome;
}
}
  //mostro soltanto il nome del fiume più vicino al mouse altrimenti si accavallano i nomi e non si capisce niente
if (nomeHover !== "") {

  noStroke();
  fill("#222222");
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT);

  text(nomeHover, mouseX + 15, mouseY - 15);
}


  //parte due. mettere elenco dei fiumi di quel continente con nome e numero di affluenti. Per fare questo creo un ciclo for che legge tutti i fiumi del continente selezionato e scrive il nome e il numero di affluenti. Creo variabili per la posizione in cui scrivere e la distanza tra le righe
  let inizioElenco = 700;
  let distanzaRighe = 90;

  //trovo la larghezza del nome più lungo del continente così da allineare tutti i nomi a sinistra e le barre della lunghezza a destra. Creo una variabile che salva la larghezza massima del nome dei fiumi e poi creo un ciclo for che legge tutti i fiumi del continente selezionato e calcola la larghezza del nome di ogni fiume e se è più grande della larghezza massima allora la salva come nuova larghezza massima
let nomeMax = 0;

textSize(14);
textStyle(BOLD);

for (let i = 0; i < fiumi.length; i++) {

  let nome = data.getString(fiumi[i], "name");
  let larghezzaNome = textWidth(nome);

  if (larghezzaNome > nomeMax) {
    nomeMax = larghezzaNome;
  }
}
textStyle(NORMAL);

//posizioni delle colonne
let xBarra = 60 + nomeMax + 80;
let larghezzaMax = 300;

let xTemperatura = xBarra + larghezzaMax + 100;
let larghezzaMaxTemperatura = 300;

//titoli delle tre colonne
textSize(24);
textStyle(NORMAL);
fill("#222222");

textAlign(LEFT);

text("Fiumi", 60, inizioElenco);
text("Lunghezza (km)", xBarra, inizioElenco);
text("Temperature (°C)", xTemperatura, inizioElenco);


  //scrivo il nome, il nome della foce eil numero di affluenti di ogni fiume
  for (let i = 0; i < fiumi.length; i++) {

    let nome = data.getString(fiumi[i], "name"); //cerca nella colonna name il nome del fiume e lo salva nella variabile nome
    let affluenti = data.getNum(fiumi[i], "tributaries"); //cerca nella colonna tributaries il numero di affluenti del fiume e lo salva nella variabile affluenti
    let foce = data.getString(fiumi[i], "outflow"); //cerca nella colonna outflow il nome della foce del fiume e lo salva nella variabile foce
    let y = inizioElenco + 50 + i * distanzaRighe;
    let lunghezza = data.getNum(fiumi[i], "length");
    let temperaturaMin = data.getNum(fiumi[i], "min_temp");
    let temperaturaMax = data.getNum(fiumi[i], "max_temp");
    let temperaturaMedia = data.getNum(fiumi[i], "avg_temp");

    textSize(14);
    textStyle(BOLD);
    text(nome, 60, y);
    textStyle(NORMAL);
    text("Affluenti: " + affluenti, 60, y + 20);
    text("Foce: " + foce, 60, y + 40);
  
    //barra orizzontale che rappresenta la lunghezza del fiume. La lunghezza massima di tutti i fiumi del mondo è 7000 km quindi uso questo valore per la funzione map che trasforma la lunghezza in una coordinata x
    //let xBarra = 60 + nomeMax + 100; //60 è il margine, nomeMax è la larghezza che occupa il nome più lungo e 40 è lo spazio tra il nome e la barra della lumghezza
    //let larghezzaMax = width * 0.18; elimino perchè altrimenti non riesco ad allineare i titoli alle colone
    let lunghezzaMax = 7000;

    let larghezzaBarra = map(lunghezza, 0, lunghezzaMax, 0, larghezzaMax); //trasforma la lunghezza in km in lumghezza px

    noStroke();
    //barra grigia: lunghezza massima di riferimento (7000 km)
    fill("#CCCCCC");
    rect(xBarra, y - 12, larghezzaMax, 12, 6);

    //barra colorata: lunghezza effettiva del fiume
    fill(coloreContinente);
    rect(xBarra, y - 12, larghezzaBarra, 12, 6);
    
    fill("#222222");
    textStyle(BOLD);
    textSize(12);
    text(lunghezza + " km", xBarra, y+20);

    //rappresento le temperature min max e media con una linea che va dalla temperatura minima a quella massima e un pallino che rappresenta la temperatura media. La temperatura massima di tutti i fiumi del mondo è 30°C quindi uso questo valore per la funzione map che trasforma la temperatura in una coordinata x
    //scala delle temperature uguale per tutti i fiumi
    let xTemperatura = xBarra + larghezzaMax + 100;
    let larghezzaMaxTemperatura = width * 0.16;

    let scalaMin = -20;
    let scalaMax = 30;

    //trasformo le temperature in coordinate x
    let xMin = map(temperaturaMin, scalaMin, scalaMax,
    xTemperatura, xTemperatura + larghezzaMaxTemperatura);

    let xMax = map(temperaturaMax, scalaMin, scalaMax,
    xTemperatura, xTemperatura + larghezzaMaxTemperatura);

    let xMedia = map(temperaturaMedia, scalaMin, scalaMax,
     xTemperatura, xTemperatura + larghezzaMaxTemperatura);

    //linea grigia: tutta la scala
    stroke("#CCCCCC");
    strokeWeight(12);
    strokeCap(ROUND);
    line(xTemperatura, y-6, xTemperatura + larghezzaMaxTemperatura, y-6);

    //linea colorata: intervallo minimo-massimo del fiume
    stroke(coloreContinente);
    strokeWeight(12);
    line(xMin, y-6, xMax, y-6);

    //pallino: temperatura media
    noStroke();
    fill("#222222");
    circle(xMedia, y-6, 15);

    //valore della temperatura media
    fill("#222222");
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER);

    text(temperaturaMedia + "°C", xMedia, y + 20);

    //valori delle temperature
    noStroke();
    fill("#222222");
    textSize(12);
    textStyle(NORMAL);

    textAlign(RIGHT);
    text(temperaturaMin + "°C", xMin - 10, y + 20);

    textAlign(LEFT);
    text(temperaturaMax + "°C", xMax + 10, y + 20); 
}

}


