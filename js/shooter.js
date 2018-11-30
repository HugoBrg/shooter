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
        } /*else {
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
        } // if*/
    } // for
} // function


function changeBg(val) {   
  let span = document.querySelector("#val");
  span.innerHTML = val;
  switch(val){ 
    case '1': 
      canvas.style.background=loadedAssets.background1; 
      break;
    case '2': 
      canvas.style.background='url(https://wallpapercave.com/wp/XbmNalC.jpg)'; 
      break;
    case '3': 
      canvas.style.background='url(http://www.linuxcmd.org/lcshow/small/23/239344_dbz-gohan-wallpaper.jpg)'; 
      break;
    default: 
      break;
    }
}


class Joueur{
  constructor(newX,newY, Skin, vie){
    this.x=newX;
    this.y=newY;
    this.skin=Skin;
    this.vie=vie;
    skinJoueur.src=this.skin;
    console.log("skin.height : "+skinJoueur.height+" skin width : "+skinJoueur.width);
    this.height=Math.round(skinJoueur.height/2);
    this.width=Math.round(skinJoueur.width/2);
  }
    
  draw(ctx,skinPlayer) {  
    skinJoueur.src=skinPlayer;
    ctx.drawImage(skinJoueur, 0, 0,420, 225, this.x,this.y,Math.round(skinJoueur.height/2),Math.round(skinJoueur.width/2));
  }    
}

class Projectile {
  constructor(Img){ 
    this.x=Math.floor((Math.random() * lc) + 1);
    this.img=Img;
    this.y=Math.floor((Math.random() * hc) + 1);
  }
    
  draw(ctx,lien) { 
    project.src=lien;
    ctx.drawImage(project, this.x, this.y,100,150);
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
    tableauDesTirs.forEach((r) => {
      r.draw(ctx);
    })
  }
  
  function deplacerLesTirs() {
    tableauDesTirs.forEach((r) => {
      r.move();
    });
  }
  
  function testeCollisionAvecMurs() {
    tableauDesTirs.forEach((r) => {
      if(((r.x+r.l) > lc) || (r.x < 0)) {
        //Supprime
      r.x = Math.random();
      r.y  = Math.random() *hc;
      }
  });
      
  }
/*function changerSkin()
{
  j1.skin="https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg";
}*/



function genererProj() { 
  let newproj=new Projectile("http://benoit.montorsi.free.fr/fleche.png");
  tableauProj.push(newproj);
  afficherProj();
}

function afficherProj() {  
  tableauProj.forEach((r) => {
    r.draw(ctx,r.img);
  }) 

}

function genererJoueurs() { 
  let j1=new Joueur(lc/2.5,100,assetsCharges.skin1,10);
  let j2=new Joueur(lc/2.5,300,assetsCharges.skin1,50); 
  tableauJoueurs.push(j1);
  tableauJoueurs.push(j2);  
}

function afficherJoueurs() {
  characterCollision(tableauJoueurs);
  tableauJoueurs.forEach((r) => {
    wallCollision(r,r.skin);
    r.draw(ctx,r.skin);   

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

function wallCollision(r,skinPlayer){
  ctx.save();
  skinJoueur.src=skinPlayer;
  //(Math.round(r.x)+Math.round(skinJoueur.width/2))
  if(r.x > lc){
    //console.log(lc);
    //console.log(Math.round(skinJoueur.width/2));
    //console.log(Math.round(r.x));
    r.x=0;
  }
  else if(r.x < 0){
    r.x=lc;
  }
  else if(r.y > hc){
    r.y=0;
  }
  else if(r.y < 0){
    r.y=hc;
  }
  ctx.restore();
}

function characterCollision(tableauJoueurs){
  ctx.save();

  if((tableauJoueurs[0].y + tableauJoueurs[0].height) < (tableauJoueurs[1].y)){
    console.log("haut : "+tableauJoueurs[0].y+" + "+tableauJoueurs[0].height+" ("+(tableauJoueurs[0].y+tableauJoueurs[0].height)+") < "+tableauJoueurs[1].y);
  }
  
  if(tableauJoueurs[0].y > (tableauJoueurs[1].y + tableauJoueurs[1].height)){
    console.log("bas : "+tableauJoueurs[0].y+" > "+tableauJoueurs[1].y+" + "+tableauJoueurs[1].height+" ("+(tableauJoueurs[1].y+tableauJoueurs[1].height)+")");
  }
  
  if((tableauJoueurs[0].x + tableauJoueurs[0].width) < tableauJoueurs[1].x){
    console.log("gauche :"+tableauJoueurs[0].x+" + "+tableauJoueurs[0].width+" ("+(tableauJoueurs[0].x+tableauJoueurs[0].width)+") < "+tableauJoueurs[1].x);
  }

  if((tableauJoueurs[0].x > (tableauJoueurs[1].x + tableauJoueurs[1].width))){
    console.log("droite : "+tableauJoueurs[0].y+" > "+tableauJoueurs[1].y+" + "+tableauJoueurs[1].height+" ("+(tableauJoueurs[1].y+tableauJoueurs[1].height)+")");
  }
  ctx.restore();
}
