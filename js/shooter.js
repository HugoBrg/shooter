let canvas = document.querySelector("#myCanvas");
let ctx= canvas.getContext("2d");

let lc;
let hc;
let vx=10;
let vy=10;
let skinJoueur=new Image();
let project=new Image();

let tableauJoueurs=[];
let tableauProj=[];
let tableauTir=[];
let hp;
let rect1Height = 50;
let rect1Width = 100;
let rect1X = 700;
let rect1Y = 10;

let test=0;
var loadedAssets;

var assetsToLoadURLs = {
    background1: { url: 'assets/dj.jpg' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
    background2: { url: "assets/FLA09ACroppedB-735x556.jpg" },
    background3: { url: "assets/P1150025-735x556.jpg" },
    skin1: { url: "assets/307237.jpg" },
    proj1: { url: 'assets/fleche.png' },
    proj2: { url: 'assets/laser.png' }
};

function loadAssets(callback) {
    // here we should load the sounds, the sprite sheets etc.
    // then at the end call the callback function           
    loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs, callback);
}

function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}

function loadAssetsUsingHowlerAndNoXhr(assetsToBeLoaded, callback) {
    var assetsLoaded = {};
    var loadedAssets = 0;
    var numberOfAssetsToLoad = 0;

    // define ifLoad function
    var ifLoad = function () {
        if (++loadedAssets >= numberOfAssetsToLoad) {
            callback(assetsLoaded);
        }
        console.log("Loaded asset " + loadedAssets);
    };

    // get num of assets to load
    for (var name in assetsToBeLoaded) {
        numberOfAssetsToLoad++;
    }

    console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (name in assetsToBeLoaded) {
        var url = assetsToBeLoaded[name].url;
        console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();
            assetsLoaded[name].onload = ifLoad;
            // will start async loading. 
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Howl({
                urls: [url],
                buffer: assetsToBeLoaded[name].buffer,
                loop: assetsToBeLoaded[name].loop,
                autoplay: false,
                volume: assetsToBeLoaded[name].volume,
                onload: function () {
                    if (++loadedAssets >= numberOfAssetsToLoad) {
                        callback(assetsLoaded);
                    }
                    console.log("Loaded asset " + loadedAssets);
                }
            }); // End of howler.js callback
        } // if
    } // for
} // function


function changeBg(val) {   

  let span = document.querySelector("#val");
  span.innerHTML = val;
  switch(val){ 
    case '1': 
     ctx.drawImage(assetsCharges.background1,0,0,canvas.width,canvas.height);
      break;
    case '2': 
      ctx.drawImage(assetsCharges.background2,0,0,canvas.width,canvas.height);
      break;
    case '3': 
      ctx.drawImage(assetsCharges.background3,0,0,canvas.width,canvas.height);
      break;
    default: 
      break;
    }
}


class Joueur{
  constructor(newX,newY, vie){
    this.x=newX;
    this.y=newY;
    this.vie=vie;
    this.height=assetsCharges.skin1.height/2;
    this.width=assetsCharges.skin1.width/2;
    console.log("skin.height : "+this.height+" skin width : "+this.width);
  }
    
  draw(ctx) {  
    ctx.drawImage(assetsCharges.skin1, this.x, this.y,assetsCharges.skin1.width/2, assetsCharges.skin1.height/2);
  }   
}

class Projectile {
  constructor(){ 
    this.x=Math.floor((Math.random() * lc) + 1);
    this.y=Math.floor((Math.random() * hc) + 1);
  }
    
  draw(ctx) { 
    ctx.drawImage(assetsCharges.proj2, this.x, this.y,100,150);
    }
  }

window.onload = function () {
  init(); 
}

function init()
{
	console.log("loading assets");
	 loadAssets(startShooter);
}

function startShooter(assetsReadyToBeUsed)
{ 
assetsCharges=assetsReadyToBeUsed;
console.log("on est entrés dans la fonction");
	 lc = canvas.width;
    hc = canvas.height;
  genererJoueurs();
  document.addEventListener('keydown', function (event) { 
    switch (event.keyCode) {
      case 37:
            tableauJoueurs[0].x-=vx;//gauche
            break;
      case 38:
            tableauJoueurs[0].y-=vy;//haut
              break;
        case 39:
                tableauJoueurs[0].x+=vx; //droite
                break;
        case 40:
                tableauJoueurs[0].y+=vy; //bas
                break;
            case 81:
                    tableauJoueurs[1].x-=vx;//gauche
            break;
            case 90:
            tableauJoueurs[1].y-=vy;//haut
              break;
        case 68:
                tableauJoueurs[1].x+=vx; //droite
                break;
        case 83:
                tableauJoueurs[1].y+=vy; //bas
                break;
            case 32:
                      console.log("Tir");
                     tirer();
                     break;
            
            
    }
  });
  this.setInterval(genererProj, 5000); //générer une image de projectile à un endroit aléatoire toutes les 2s
  // Pour animation à 60 im/s
  requestAnimationFrame(anime);
}


class Tir {
  constructor(x, y, l, h, vx, couleur) {
    // on définit les propriétés qu'on veut avoir à la construction
    this.x = x;
    this.y = y;
    this.l = l;
    this.h = h;
    this.vx = vx;
    this.couleur = couleur;
  }
  
  draw(ctx) {
    ctx.fillStyle = this.couleur;
    ctx.fillRect(this.x, this.y, this.l, this.h);
  }
  
  move() {
    this.x += this.vx*1;
  }
  
  decrisToi() {
    return "Je suis une étoile de couleur : " + this.couleur;
  }
}

let tableauDesTirs = [];
let joueur;
  function tirer(n,joueur) {
    for(let i = 0; i < n; i++) {
      let x = tableauJoueurs[joueur].x; 
      let y  = tableauJoueurs[joueur].y+50;
      let l = 10;
      let h = 5;
      let vx = 10;
      let c = "white";
      let rect = new Tir(x, y, l, h, vx,c);   
      tableauDesTirs.push(rect);
    }
  }
  function dessinerLesTirs() {
    tableauDesTirs.forEach((joueur) => {
      joueur.draw(ctx);
    })
  }
  
  function deplacerLesTirs() {
    tableauDesTirs.forEach((joueur) => {
      joueur.move();
    });
  }
  
  function testeCollisionAvecMurs() {
    tableauDesTirs.forEach((joueur) => {
      if(((joueur.x+joueur.l) > lc) || (joueur.x < 0)) {
        //Supprime
      joueur.x = Math.random();
      joueur.y  = Math.random() *hc;
      }
  });
      
  }

function genererProj() { 
  let newproj=new Projectile();
  tableauProj.push(newproj);

}

function afficherProj() {  
  tableauProj.forEach((joueur) => {
    joueur.draw(ctx);
  }) 

}

function genererJoueurs() { 
  let j1=new Joueur(lc/2.5,100,10);
  let j2=new Joueur(lc/2.5,300,50); 
  tableauJoueurs.push(j1);
  tableauJoueurs.push(j2);  
}

function afficherJoueurs() {
  characterCollision(tableauJoueurs);
  tableauJoueurs.forEach((joueur) => {
    wallCollision(joueur,joueur.skin);
    joueur.draw(ctx);   

  })
}

function afficherBarresVie() {
  /*-------JOUEUR--1-------*/
  // Hauteur barre de vie joueur 1
  rect1Height = 10;
  // Largeur barre de vie joueur 1
  rect1Width = tableauJoueurs[0].vie;
  // Permet de créer un rectangle (barre de vie) qui suit le personnage avec la position du joueur 1
	rect1X = tableauJoueurs[0].x;
  rect1Y = tableauJoueurs[0].y-15;
  /*-------JOUEUR--2-------*/
  // Hauteur barre de vie joueur 2
  rect2Height = 10;
  // Largeur barre de vie joueur 2
  rect2Width = tableauJoueurs[1].vie;
  // Permet de créer un rectangle (barre de vie) qui suit le personnage avec la position du joueur 2
	rect2X = tableauJoueurs[1].x;
  rect2Y = tableauJoueurs[1].y-15;

  /*-------JOUEUR--1/2-------*/
  // Création de la bordure de la barre de vie des deux joueurs
  ctx.strokeRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.strokeRect(rect2X,rect2Y,rect2Width,rect2Height);

  /*-------JOUEUR--1-------*/
  //console.log("----------------------");
  //console.log(tableauJoueurs[0].vie);
  // Barre de vie du joueur 1 plus de 60 pv (vert)
  if (tableauJoueurs[0].vie<=100 &&tableauJoueurs[0].vie>60) {
    //console.log("vie verte joueur 1");
    color1 = 'green';
  }
  // Barre de vie du joueur 1 entre 30 pv et 60 pv (jaune)
  if (tableauJoueurs[0].vie<=60 && tableauJoueurs[0].vie>30) {
    //console.log("vie jaune joueur1");
    color1 = 'yellow';
  }
  // Barre de vie du joueur 1 moins de 30 pv (rouge)
  if (tableauJoueurs[0].vie<=30) {
    //console.log("vie rouge joueur1");
    color1 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color1;
  //console.log(color1);
  // Création de la barre de vie du joueur 1
  ctx.fillRect(rect1X,rect1Y,rect1Width,rect1Height);
  //console.log(tableauJoueurs[1].vie);

  /*-------JOUEUR--2-------*/
  // Barre de vie du joueur 2 plus de 60 pv (vert)
  if (tableauJoueurs[1].vie<=100 &&tableauJoueurs[1].vie>60) {
    //console.log("vie verte joueur2");
    color2 = 'green';
  }
  
  // Barre de vie du joueur 2 entre 30 pv et 60 pv (jaune)
  if (tableauJoueurs[1].vie<=60 && tableauJoueurs[1].vie>30) {
    //console.log("vie jaune joueur2");
    color2 = 'yellow';
  }
  // Barre de vie du joueur 2 moins de 30 pv (rouge)
  if (tableauJoueurs[1].vie<=30) {
    //console.log("vie rouge joueur2");
    color2 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color2;
  //console.log(color2);
  // Création de la barre de vie du joueur 2
  ctx.fillRect(rect2X,rect2Y,rect2Width,rect2Height);
  
}

function anime() {
  // 1 On efface le canvas
  ctx.clearRect(0, 0, lc, hc);

    // 2 On dessine
    dessinerLesTirs();

    // 3 On change l'état (position, couleur, taille etc.)
    deplacerLesTirs();
  
   // testeCollisionAvecMurs();
  // 2
  afficherBarresVie();
  afficherJoueurs();
  //afficherProj();
  // 3
  // 4 on demande au browser de rappeler la fonction
  // dans 1/60ème de seconde
  requestAnimationFrame(anime);
}

function wallCollision(joueur){
  ctx.save();
  if(joueur.x + joueur.width> lc){
    joueur.x=0;
  }
  else if(joueur.x < 0){
    joueur.x=lc-joueur.width;
  }
  else if(joueur.y + joueur.height > hc){
    joueur.y=0;
  }
  else if(joueur.y < 0){
    joueur.y=hc-joueur.height;
  }
  ctx.restore();
}

function characterCollision(tableauJoueurs){
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(tableauJoueurs[0].x,tableauJoueurs[0].y);
  ctx.lineTo(tableauJoueurs[0].x+tableauJoueurs[0].width,tableauJoueurs[0].y);
  ctx.lineTo(tableauJoueurs[0].x+tableauJoueurs[0].width,tableauJoueurs[0].y+tableauJoueurs[0].height);
  ctx.lineTo(tableauJoueurs[0].x,tableauJoueurs[0].y+tableauJoueurs[0].height);
  ctx.lineTo(tableauJoueurs[0].x,tableauJoueurs[0].y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(tableauJoueurs[1].x,tableauJoueurs[1].y);
  ctx.lineTo(tableauJoueurs[1].x+tableauJoueurs[1].width,tableauJoueurs[1].y);
  ctx.lineTo(tableauJoueurs[1].x+tableauJoueurs[1].width,tableauJoueurs[1].y+tableauJoueurs[1].height);
  ctx.lineTo(tableauJoueurs[1].x,tableauJoueurs[1].y+tableauJoueurs[1].height);
  ctx.lineTo(tableauJoueurs[1].x,tableauJoueurs[1].y);
  ctx.stroke();

  if (tableauJoueurs[0].x < tableauJoueurs[1].x + tableauJoueurs[1].width &&
    tableauJoueurs[0].x + tableauJoueurs[0].width > tableauJoueurs[1].x &&
    tableauJoueurs[0].y < tableauJoueurs[1].y + tableauJoueurs[1].height &&
    tableauJoueurs[0].height + tableauJoueurs[0].y > tableauJoueurs[1].y) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "red";
      ctx.fillRect(tableauJoueurs[0].x-10,tableauJoueurs[0].y-10,tableauJoueurs[0].width+20,tableauJoueurs[0].height+20);
      ctx.fillRect(tableauJoueurs[1].x-10,tableauJoueurs[1].y-10,tableauJoueurs[1].width+20,tableauJoueurs[1].height+20);
      ctx.globalAlpha = 1.0;
 }
  ctx.restore();
}
