let canvas = document.querySelector("#canvasJeu");
let ctx= canvas.getContext("2d");

let lc;
let hc;
let vx=10;
let vy=10;
let skinJoueur=new Image();
let project=new Image();
let nbBG;
let tableauJoueurs=[];
let tableauProj=[];
let tableauTir=[];
let hp;
let rect1Height = 50;
let rect1Width = 100;
let rect1X = 700;
let rect1Y = 10;
let width;
let height;

let test=0;
var loadedAssets;
var joueur1;
var mousepos = { x: 0, y: 0 };
var inputStates = {};
let xj1=0;
let yj1=0;
let xj2=0;
let yj2=0;
let anglej1;
let anglej2;
var assetsToLoadURLs = {
    background1: { url: 'assets/dj.jpg' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
    background2: { url: "assets/FLA09ACroppedB-735x556.jpg" },
    background3: { url: "assets/P1150025-735x556.jpg" },
    skin1: { url: "assets/307237.jpg" },
    proj1: { url: 'assets/fleche.png' },
    proj2: { url: 'assets/laser.png' },
	musique_accueil: {url : 'assets/musique_accueil.mp3', buffer: true, loop: true, volume: 0.6}
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


function changeValeurBG(val) {   

  let span = document.querySelector("#val");
  span.innerHTML = val;
  nbBG=val;
  
}

class Bullet {
    constructor(joueur1) {
        this.x = joueur1.x;
        this.y = joueur1.y;
        this.angle = joueur1.angle;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(0, 0, 10, 2);
        ctx.restore();
    }

  
    move(maxX, maxY) {
        this.x -= 10 * Math.cos(this.angle);
        this.y -= 10 * Math.sin(this.angle);
    }
}

class Joueur {
  constructor(x, y, angle, vitesse, vie, tempsMinEntreTirsEnMillisecondes,couleur) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.v = vitesse;
    this.vie = vie;
    this.bullets = [];
	this.couleur=couleur;
    // cadenceTir en millisecondes = temps min entre tirs
    this.delayMinBetweenBullets = tempsMinEntreTirsEnMillisecondes;
  }
  
  draw(ctx,couleur) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.translate(-10, -10);
    ctx.fillStyle=couleur;
    // corps
    ctx.fillRect(0, 0, 20, 20);
    // canon
    //ctx.fillRect(-10, 9, 10, 2);
    
    ctx.restore();
    
    this.drawBullets(ctx);

  }
  
  drawBullets(ctx) {
    for(let i = 0; i < this.bullets.length; i++) {
      let b = this.bullets[i];
      b.draw(ctx);
      b.move(); 
      if ((b.x < 0) || (b.y < 0) || (b.x > lc) || (b.y > hc))
            this.removeBullet(b)

    }
  }
  /*
  move(mousepos) {
        // 2) On dÃ©place la balle 
    let dx = this.x - mousepos.x;
    let dy = this.y - mousepos.y;
    this.angle = Math.atan2(dy, dx);
    
    if (distance(this.x, this.y, mousepos.x, mousepos.y) >= 10) {
        //ball.v = 0;
        this.x -= this.v * Math.cos(this.angle);
        this.y -= this.v * Math.sin(this.angle);
    }
  }
  */
   move(x,y,angle) {
        // 2) On dÃ©place la balle 
    this.x += x;
    this.y += y;
    this.angle = angle;
    /*
    if (distance(this.x, this.y, mousepos.x, mousepos.y) >= 100) {
        //ball.v = 0;
        this.x -= this.v * Math.cos(this.angle);
        this.y -= this.v * Math.sin(this.angle);
    }*/
  }
   addBullet(time) {
     // si le temps écoulé depuis le dernier tir est > temps max alors on tire
     var tempEcoule=0;
     
     if(this.lastBulletTime !== undefined) {
       tempEcoule = time - this.lastBulletTime;
       //console.log("temps écoulé = " + tempEcoule);
     }
     
     if((this.lastBulletTime === undefined) || (tempEcoule> this.delayMinBetweenBullets)) {
        this.bullets.push(new Bullet(this));
        // on mémorise le dernier temps.
        this.lastBulletTime = time;
     }
   }

   removeBullet(bullet) {
        let position = this.bullets.indexOf(bullet);
        this.bullets.splice(position, 1);
    }
}

/*
class Projectile {
  constructor(){ 
    this.x=Math.floor((Math.random() * lc) + 1);
    this.y=Math.floor((Math.random() * hc) + 1);
  }
    
  draw(ctx) { 
    ctx.drawImage(assetsCharges.proj2, this.x, this.y,100,150);
    }
  }
*/
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
  genererInterface();
	
  /*genererJoueurs();
  document.addEventListener('keydown', function (event) { 
    switch (event.keyCode) {
      case 37:
            joueur1.x-=vx;//gauche
            break;
      case 38:
            joueur1.y-=vy;//haut
              break;
        case 39:
                joueur1.x+=vx; //droite
                break;
        case 40:
                joueur1.y+=vy; //bas
                break;
            case 81:
                    joueur2.x-=vx;//gauche
            break;
            case 90:
            joueur2.y-=vy;//haut
              break;
        case 68:
                joueur2.x+=vx; //droite
                break;
        case 83:
                joueur2.y+=vy; //bas
                break;
            case 32:
                      console.log("Tir");
                     tirer();
                     break;
            
            
    }
  });*/
   joueur1 = new Joueur(100, 100, 4.75, 2, 100,"red");
  joueur2 = new Joueur(500, 100, 4.75, 2, 100,"green");
  window.addEventListener('keydown', function(evt) {
    if(event.keyCode==32){
      inputStates.SPACE = true;
      this.console.log("tir");
    }
  });
  
  window.addEventListener('keyup', function(evt) {
   // if(event.keyCode==32){
      inputStates.SPACE = false;
   // }
  });
  
    window.addEventListener('keydown', function (event) { 
    switch (event.keyCode) {
      case 37:
            console.log("gauche");
            xj1=-20;//gauche
            anglej1=0;
            break;
      case 38:
            console.log("haut");
            yj1=-20;//haut
            anglej1 = 1.55;
             break;
      case 39:
            console.log("droite");
            xj1=20; //droite
            anglej1= 3.15;
            break;
      case 40:
            console.log("bas");
            yj1=20; //bas
            anglej1 = 4.70;
            break;
      case 81:
            xj2=-20;//gauche
            anglej2=0;
            break;
      case 90:
            yj2=-20;//haut
            anglej2 = 1.55;
            break;
      case 68:
            xj2=20; //droite
            anglej2 = 3.15;
            break;
      case 83:
            yj2=20; //bas
            anglej2 = 4.70;
            break;            
    }
  });
  //this.setInterval(genererProj, 5000); //générer une image de projectile à un endroit aléatoire toutes les 2s
  // Pour animation à 60 im/s
  requestAnimationFrame(anime);
}

function genererInterface()
{ assetsCharges.musique_accueil.play();
	genererListeSkins();
	
	var myDiv = document.getElementById("startBtn");
   var texteBtn="𝕊ℍ𝕆𝕆𝕋𝔼ℝ 𝕊𝕋𝔸ℝ𝕋?";
   var btn=document.createElement("button");
	btn.innerHTML=texteBtn;
	myDiv.appendChild(btn);
	
	btn.addEventListener("click",function() {
		combat=true;
	assetsCharges.musique_accueil.stop();
	
});

}

function genererListeSkins()
{
		
var myDiv = document.getElementById("modifSkin");

//Create array of options to be added
var array = ["1","2"];
var paragraphe=document.createElement("p");
var texte = document.createTextNode("Choix du skin pour le joueur 1");
paragraphe.appendChild(texte);

//Create and append select list
var selectList = document.createElement("select");
selectList.id = "listeSkins";
myDiv.appendChild(paragraphe);
myDiv.appendChild(selectList);

//Create and append the options
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
}

selectList.addEventListener("click",function() {
	switch(selectList.value)
	{
		case '1': joueur1.couleur="blue"; break;
		case '2': joueur1.couleur="yellow"; break;
	}
	
});

//Create array of options to be added
var paragraphe=document.createElement("p");
var texte = document.createTextNode("Choix du skin pour le joueur 2");
paragraphe.appendChild(texte);

//Create and append select list
var selectList2 = document.createElement("select");
selectList2.id = "listeSkins";
myDiv.appendChild(paragraphe);
myDiv.appendChild(selectList2);

//Create and append the options
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList2.appendChild(option);
}

selectList2.addEventListener("click",function() {
	switch(selectList2.value)
	{
		case '1': joueur2.couleur="blue"; break;
		case '2': joueur2.couleur="yellow"; break;
	}
	
});
	
}

/*
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
*/

function afficherBarresVie() {
  /*-------JOUEUR--1-------*/
  ctx.save()
  // Hauteur barre de vie joueur 1
  rect1Height = 10;
  // Largeur barre de vie joueur 1
  rect1Width = joueur1.vie;
  // Permet de créer un rectangle (barre de vie) qui suit le personnage avec la position du joueur 1
	rect1X = joueur1.x-45;
  rect1Y = joueur1.y-25;
  /*-------JOUEUR--2-------*/
  // Hauteur barre de vie joueur 2
  rect2Height = 10;
  // Largeur barre de vie joueur 2
  rect2Width = joueur2.vie;
  // Permet de créer un rectangle (barre de vie) qui suit le personnage avec la position du joueur 2
	rect2X = joueur2.x-45;
  rect2Y = joueur2.y-25;

  /*-------JOUEUR--1/2-------*/
  // Création de la bordure de la barre de vie des deux joueurs
  ctx.strokeRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.strokeRect(rect2X,rect2Y,rect2Width,rect2Height);

  /*-------JOUEUR--1-------*/
  //console.log("----------------------");
  //console.log(joueur1.vie);
  // Barre de vie du joueur 1 plus de 60 pv (vert)
  if (joueur1.vie<=100 &&joueur1.vie>60) {
    //console.log("vie verte joueur 1");
    color1 = 'green';
  }
  // Barre de vie du joueur 1 entre 30 pv et 60 pv (jaune)
  if (joueur1.vie<=60 && joueur1.vie>30) {
    //console.log("vie jaune joueur1");
    color1 = 'yellow';
  }
  // Barre de vie du joueur 1 moins de 30 pv (rouge)
  if (joueur1.vie<=30) {
    //console.log("vie rouge joueur1");
    color1 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color1;
  //console.log(color1);
  // Création de la barre de vie du joueur 1
  ctx.fillRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.restore();
  //console.log(joueur2.vie);
ctx.save()
  /*-------JOUEUR--2-------*/
  // Barre de vie du joueur 2 plus de 60 pv (vert)
  if (joueur2.vie<=100 &&joueur2.vie>60) {
    //console.log("vie verte joueur2");
    color2 = 'green';
  }
  
  // Barre de vie du joueur 2 entre 30 pv et 60 pv (jaune)
  if (joueur2.vie<=60 && joueur2.vie>30) {
    //console.log("vie jaune joueur2");
    color2 = 'yellow';
  }
  // Barre de vie du joueur 2 moins de 30 pv (rouge)
  if (joueur2.vie<=30) {
    //console.log("vie rouge joueur2");
    color2 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color2;
  //console.log(color2);
  // Création de la barre de vie du joueur 2
  ctx.fillRect(rect2X,rect2Y,rect2Width,rect2Height);
  ctx.restore();
}
let angle=0;
function anime() {
  wallCollision(joueur1);
  characterCollision(joueur1,joueur2);
  // 1 On efface le canvas
  ctx.clearRect(0, 0, lc, hc);
	// 2 On regarde quel background on doit afficher
  switch(nbBG){ 
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
	
/*
    // 2 On dessine
    dessinerLesTirs();

    // 3 On change l'état (position, couleur, taille etc.)
    deplacerLesTirs();
  
   // testeCollisionAvecMurs();
  // 2*/
  // 2) On dessine et on déplace le char 1
 joueur1.draw(ctx);
 joueur2.draw(ctx);

 joueur1.move(xj1,yj1,anglej1);
 joueur2.move(xj2,yj2,anglej2);
  xj1=0;
  yj1=0;
  xj2=0;
  yj2=0;
 // char2.draw(ctx);
 //char2.move(mousepos);

if(inputStates.SPACE) {
  console.log("tirer");
  joueur1.addBullet(Date.now());
  joueur2.addBullet(Date.now()); 
}
  afficherBarresVie();
 // afficherJoueurs();
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

function characterCollision(joueur1,joueur2){
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(joueur1.x,joueur1.y);
  ctx.lineTo(joueur1.x+joueur1.width,joueur1.y);
  ctx.lineTo(joueur1.x+joueur1.width,joueur1.y+joueur1.height);
  ctx.lineTo(joueur1.x,joueur1.y+joueur1.height);
  ctx.lineTo(joueur1.x,joueur1.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(joueur2.x,joueur2.y);
  ctx.lineTo(joueur2.x+joueur2.width,joueur2.y);
  ctx.lineTo(joueur2.x+joueur2.width,joueur2.y+joueur2.height);
  ctx.lineTo(joueur2.x,joueur2.y+joueur2.height);
  ctx.lineTo(joueur2.x,joueur2.y);
  ctx.stroke();

  if (joueur1.x < joueur2.x + joueur2.width &&
    joueur1.x + joueur1.width > joueur2.x &&
    joueur1.y < joueur2.y + joueur2.height &&
    joueur1.height + joueur1.y > joueur2.y) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "red";
      ctx.fillRect(joueur1.x-10,joueur1.y-10,joueur1.width+20,joueur1.height+20);
      ctx.fillRect(joueur2.x-10,joueur2.y-10,joueur2.width+20,joueur2.height+20);
      ctx.globalAlpha = 1.0;
      console.log("col");
 }

  ctx.restore();
}
