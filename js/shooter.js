let canvas = document.querySelector("#canvasJeu");
let ctx= canvas.getContext("2d");

let lc;
let hc;
let vx=10;
let vy=10;
let project=new Image(); //pour la génération de projectiles (non utilisées dans cette version)
let nbBG; //'numéro' du background
let hp;
let rect1Height,rect2Height; //hauteur de la barre de vie
let rect1Width, rect2Width;  //largeur de la barre de vie
let rect1X, rect2X; //position X de la barre de vie
let rect1Y, rect2Y; //position Y de la barre de vie

var loadedAssets; //pour le chargement des assets
let combat; //boolean pour contrôler si le combat est lancé
var inputStates = {}; //pour contrôler les entrées clavier
let xj1=0; //pour contrôler le déplacement en x (voir fonction move)
let yj1=0;//pour contrôler le déplacement en y (voir fonction move)
let xj2=0;//pour contrôler le déplacement en x (voir fonction move)
let yj2=0;//pour contrôler le déplacement en y (voir fonction move)

let anglej1; //angle des joueurs
let anglej2;

var assetsToLoadURLs = {
    background1: { url: 'assets/background_jeu_1.jpg' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
    background2: { url: "assets/background_jeu_2.jpg" },
    background3: { url: "assets/background_jeu_3.jpg" },
    skin1: { url: "assets/307237.jpg" },
    proj1: { url: 'assets/fleche.png' },
    proj2: { url: 'assets/laser.png' },
	musique_accueil: {url : 'assets/musique_accueil.mp3', buffer: true, loop: true, volume: 0.6},
	start_battle: { url: 'assets/battle_start.mp3', buffer:true, loop:false, volume:1.0},
	laser_son: { url: 'assets/laser_son.mp3', buffer:true, loop:false, volume:0.1},
	combat_1: { url: 'assets/combat_1.mp3', buffer:true, loop:true, volume:0.6},
	combat_2: { url: 'assets/combat_2.mp3', buffer:true, loop:true, volume:0.6},
	combat_3: { url: 'assets/combat_3.mp3', buffer:true, loop:true, volume:0.6},
	combat_4: { url: 'assets/combat_4.mp3', buffer:true, loop:true, volume:0.6},
	combat_5: { url: 'assets/combat_5.mp3', buffer:true, loop:true, volume:0.6}	
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


function changeValeurBG(val) {   //prendre la valeur sélectionnée dans le input range

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
  constructor(x, y, angle, vitesse, vie, tempsMinEntreTirsEnMillisecondes,couleur,height,width) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.v = vitesse;
    this.vie = vie;
    this.bullets = [];
    this.height = height;
    this.width = width;
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
    ctx.fillRect(0, 0, this.height, this.width);
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

   move(x,y,angle) {
    this.x += x;
    this.y += y;
    this.angle = angle;
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
  lc = canvas.width;
  hc = canvas.height;
  
  genererInterface();
  
 //on crée les joueurs
   joueur1 = new Joueur(100, 100, 4.75, 2, 100,200,"blue",20,20);
  joueur2 = new Joueur(700, 100, 4.75, 2, 100,200,"green",20,20);
  
  //avec ces event listeners on regarde quelle touche est appuyée
  window.addEventListener('keydown', function(evt) {
    if(event.keyCode==32){ //barre d'espace
      inputStates.SPACE = true;
      this.console.log("tir");
    }
  });
  
  window.addEventListener('keydown', function(evt) {
  if(event.keyCode==65){ //le A
    inputStates.A = true;
    this.console.log("tir");
  }
});

  window.addEventListener('keyup', function(evt) { //quand on relâche une touche
      inputStates.SPACE = false;
      inputStates.A = false;
  });
  
    window.addEventListener('keydown', function (event) { 
    switch (event.keyCode) {
      case 37: //flèche gauche
            xj1=-20;//gauche
            anglej1=0;
            break;
      case 38: //flèche haut
            yj1=-20;//haut
            anglej1 = 1.55;
             break;
      case 39: //flèche droite
            xj1=20; //droite
            anglej1= 3.15;
            break;
      case 40: //flèche base
            yj1=20; //bas
            anglej1 = 4.70;
            break;
      case 81: //le Q
            xj2=-20;//gauche
            anglej2=0;
            break;
      case 90: //le Z
            yj2=-20;//haut
            anglej2 = 1.55;
            break;
      case 68: //le D
            xj2=20; //droite
            anglej2 = 3.15;
            break;
      case 83: //le S
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
   
   var btn=document.createElement("button"); //on crée le bouton pour commencer la partie
	btn.innerHTML=texteBtn;
	btn.setAttribute("id","btnStart");
	myDiv.appendChild(btn);
	
	btn.addEventListener("click",function() { //dès qu'on clique sur le bouton
	combat=true;
	initStatsJoueur();
	
	document.getElementById("perso1").style.visibility="hidden"; //on cache les éléments permettant de changer le nom et la vie
	document.getElementById("perso2").style.visibility="hidden";
	
	assetsCharges.musique_accueil.stop();
	assetsCharges.start_battle.play();
	
	alert(joueur1.nom+" vs "+joueur2.nom+", c'est parti!");
	btn.disabled=true; //on désactive le bouton de commencement de partie, maintenant qu'elle a commencé
	joueur1.x=lc/2; //on positionne 'correctement' les joueurs
	joueur1.y=hc/7;
	
	joueur2.x=lc/2;
	joueur2.y=hc-hc/7;
	});

}

function initStatsJoueur()
{
	if(document.getElementById("nomj1").value!="") joueur1.nom=document.getElementById("nomj1").value;
	else joueur1.nom="Joueur 1";
	
	if(document.getElementById("nomj2").value!="") joueur2.nom=document.getElementById("nomj2").value;
	else joueur2.nom="Joueur 2";
	
	if(isNaN(document.getElementById("viej1").value) || document.getElementById("viej1").value=="")joueur1.vie=100;
	else joueur1.vie=document.getElementById("viej1").value;
	
	if(isNaN(document.getElementById("viej2").value) || document.getElementById("viej1").value=="")joueur2.vie=100;
	else joueur2.vie=document.getElementById("viej2").value;
}

let musiqueActuelle; //va contenir l'id d'une balise 'option' de la liste de musiques

function choixMusique()
{ 
	let liste=document.getElementById("liste");
	let val=liste.options[liste.selectedIndex].value; //on prend l'id de chaque balise 'option' de la liste
	liste.style.visibility="initial";
	
	if(val!=musiqueActuelle)
	{ musiqueActuelle=val;
	switch(val) //on contrôle l'id de la balise option sélectionnée
	{
		case "ost1": stopMusique(); assetsCharges.combat_1.play(); break;
		case "ost2": stopMusique(); assetsCharges.combat_2.play(); break;
		case "ost3": stopMusique(); assetsCharges.combat_3.play(); break;
		case "ost4": stopMusique(); assetsCharges.combat_4.play(); break;
		case "ost5": stopMusique(); assetsCharges.combat_5.play(); break;
		default: stopMusique(); break;
	}
	
	}
}

function stopMusique() //on stoppe toutes les musiques
{
	assetsCharges.combat_1.stop();
	assetsCharges.combat_2.stop();
	assetsCharges.combat_3.stop();
	assetsCharges.combat_4.stop();
	assetsCharges.combat_5.stop();
}

function genererListeSkins()
{
		
var myDiv = document.getElementById("modifSkin");

//Create array of options to be added
var array = ["1","2","3"];
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
		case '3': joueur1.couleur="orange"; break;
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
		case '1': joueur2.couleur="green"; break;
		case '2': joueur2.couleur="purple"; break;
		case '3': joueur2.couleur="brown"; break;
	}
	
});
	
}


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

  // Barre de vie du joueur 1 plus de 100 pv (vert)
  if (joueur1.vie>100) {
    color1 = 'orange';
  }
  
  // Barre de vie du joueur 1 plus de 60 pv (vert)
  if (joueur1.vie<=100 &&joueur1.vie>60) {
    color1 = 'green';
  }
  // Barre de vie du joueur 1 entre 30 pv et 60 pv (jaune)
  if (joueur1.vie<=60 && joueur1.vie>30) {
    color1 = 'yellow';
  }
  // Barre de vie du joueur 1 moins de 30 pv (rouge)
  if (joueur1.vie<=30) {
    color1 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color1;

  // Création de la barre de vie du joueur 1
  ctx.fillRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.restore();

ctx.save();

  /*-------JOUEUR--2-------*/
  if (joueur2.vie>100) {
    color2 = 'orange';
  }
  
  // Barre de vie du joueur 2 plus de 60 pv (vert)
  if (joueur2.vie<=100 &&joueur2.vie>60) {

    color2 = 'green';
  }
  
  // Barre de vie du joueur 2 entre 30 pv et 60 pv (jaune)
  if (joueur2.vie<=60 && joueur2.vie>30) {

    color2 = 'yellow';
  }
  // Barre de vie du joueur 2 moins de 30 pv (rouge)
  if (joueur2.vie<=30) {

    color2 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color2;

  // Création de la barre de vie du joueur 2
  ctx.fillRect(rect2X,rect2Y,rect2Width,rect2Height);
  ctx.restore();
}


function anime() {
	if(combat==true) choixMusique();

  wallCollision(joueur1);
  wallCollision(joueur2);
  characterCollision(joueur1,joueur2);
  projectileCollisions(joueur1,joueur2);
  projectileCollisions(joueur2,joueur1);
  vainqueur(joueur1,joueur2);
  
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
	
  // 3) On dessine et on déplace les persos avec leur barre de vie
 joueur1.draw(ctx,joueur1.couleur);
 joueur2.draw(ctx,joueur2.couleur);

 joueur1.move(xj1,yj1,anglej1);
 joueur2.move(xj2,yj2,anglej2);
  xj1=0;
  yj1=0;
  xj2=0;
  yj2=0;
 afficherBarresVie();
 
  // 4) on regarde si on appuie sur une touche
if(inputStates.SPACE) {
  joueur1.addBullet(Date.now()); 
  assetsCharges.laser_son.play();
}
if(inputStates.A) {
  joueur2.addBullet(Date.now());
  assetsCharges.laser_son.play();
}
 
  //afficherProj(); //afficher un projectile à un endroit aléatoire
  
  //on demande au browser de rappeler la fonction
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

  //sert à tracer les contours des joueurs 
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
  //on compare la position des deux joueurs 
  if (joueur1.x < joueur2.x + joueur2.width &&
    joueur1.x + joueur1.width > joueur2.x &&
    joueur1.y < joueur2.y + joueur2.height &&
    joueur1.height + joueur1.y > joueur2.y) {
      //on affiche un rectangle rouge transparent
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "red";
      ctx.fillRect(joueur1.x-10,joueur1.y-10,joueur1.width+20,joueur1.height+20);
      ctx.fillRect(joueur2.x-10,joueur2.y-10,joueur2.width+20,joueur2.height+20);
      ctx.globalAlpha = 1.0;
      console.log("col");
 }

  ctx.restore();
}
/* gère les collisions entre projectiles et joueurs*/
function projectileCollisions(joueur1,joueur2){
  //console.log(joueur2.bullets.length);
  //on parcours la liste des projectiles du joueurs
  for(i=0;i<joueur1.bullets.length;i++){
    //et on compare la position du joueur ennemi avec la position du projectile 
    if(joueur2.x < joueur1.bullets[i].x + joueur2.width && 
      joueur2.x + joueur2.width > joueur1.bullets[i].x &&
      joueur2.y < joueur1.bullets[i].y + joueur2.height &&
      joueur2.y + joueur2.height > joueur1.bullets[i].y){
        //si on touche le joueur ennemi on supprime le projectile
        joueur1.bullets.splice(i, 1);
        //et on décrémente la vie du joueur ennemi
        //on affiche un carré rouge transparent de degats
        joueur2.vie-=30;
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "red";
        ctx.fillRect(joueur1.x-10,joueur1.y-10,joueur1.width+20,joueur1.height+20);
        ctx.fillRect(joueur2.x-10,joueur2.y-10,joueur2.width+20,joueur2.height+20);
        ctx.globalAlpha = 1.0;
      }
  }
}

function vainqueur(joueur1,joueur2) // on regarde si une des barres de vie est arrivé à 0
{
  if(joueur1.vie<=0 && combat==true){
    alert(joueur1.nom+" a gagné");  combat=false; resetJeu();
  }
  if(joueur2.vie<=0 && combat==true){
    alert(joueur2.nom+" a gagné"); combat=false; resetJeu();
  }
} 

function resetJeu() //on réinitialise le jeu tout comme il était au premier chargement de page
{
	joueur1.x=100;
	joueur1.y=100;
	joueur1.vie=100;
	
	joueur2.x=700;
	joueur2.y=100;
	joueur2.vie=100;
	
	//on refait apparaitre les éléments pour modifier nom et vie
	document.getElementById("perso1").style.visibility="initial"; 
	document.getElementById("perso2").style.visibility="initial";

	//on fait disparaitre la liste de musiques
	let listeMusiques=document.getElementById("liste");
	listeMusiques.style.visibility="hidden";
	//on refait apparaitre le bouton de début de partie
	let btn=document.getElementById("btnStart");
	btn.disabled=false;
	
	stopMusique();
	
	assetsCharges.musique_accueil.play();
}
