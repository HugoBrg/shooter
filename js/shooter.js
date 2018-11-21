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
//console.log("oui");


function changeBg(val) {   
  let span = document.querySelector("#val");
  span.innerHTML = val;
  switch(val){ 
    case '1': 
      canvas.style.background='url(https://s3-eu-west-1.amazonaws.com/friday-ad/uploads/image/16639301_16639400/dj-for-hire-london-m25-mobile-disco-with-pa-system-birthdays-office-parties-christmas-events-16639337-2_800X600.jpg?cdc151883cf63ea9)'; 
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
  // Appelé quand la page est prête et a chargé
  // toutes ses ressources (images, vidéos etc.)
  console.log("pret")
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
  this.setInterval(genererProj, 2000); //générer une image de projectile à un endroit aléatoire toutes les 2s
  // Pour animation à 60 im/s
  requestAnimationFrame(anime);
}

class Tir{
  constructor(Img){ 
    this.x=Math.floor((Math.random() * lc) + 1);
    this.img=Img;
    this.y=Math.floor((Math.random() * hc) + 1);
  }
    
  draw(ctx,lien){
    project.src=lien;
    ctx.drawImage(project, 0, 0, 420, 225, this.x,this.y,100,300);
  }    
}


/*function changerSkin()
{
  j1.skin="https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg";
}*/

function tirer(){
  let newtir=new Tir("https://www.casimages.com/i/18111410532990265.png.html");
  tableauTir.push(newtir);
  afficherTir();
}

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
  let j1=new Joueur(lc/2.5,100,"https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg",10);
  let j2=new Joueur(lc/2.5,300,"https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg",50); 
  tableauJoueurs.push(j1);
  tableauJoueurs.push(j2);  
}

function afficherJoueurs() {
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
  console.log("----------------------");
  console.log(tableauJoueurs[0].vie);
  // Barre de vie du joueur 1 plus de 60 pv (vert)
  if (tableauJoueurs[0].vie<=100 &&tableauJoueurs[0].vie>60) {
    console.log("vie verte joueur 1");
    color1 = 'green';
  }
  // Barre de vie du joueur 1 entre 30 pv et 60 pv (jaune)
  if (tableauJoueurs[0].vie<=60 && tableauJoueurs[0].vie>30) {
    console.log("vie jaune joueur1");
    color1 = 'yellow';
  }
  // Barre de vie du joueur 1 moins de 30 pv (rouge)
  if (tableauJoueurs[0].vie<=30) {
    console.log("vie rouge joueur1");
    color1 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color1;
  console.log(color1);
  // Création de la barre de vie du joueur 1
  ctx.fillRect(rect1X,rect1Y,rect1Width,rect1Height);
  console.log(tableauJoueurs[1].vie);
  /*-------JOUEUR--2-------*/
  // Barre de vie du joueur 2 plus de 60 pv (vert)
  if (tableauJoueurs[1].vie<=100 &&tableauJoueurs[1].vie>60) {
    console.log("vie verte joueur2");
    color2 = 'green';
  }
  
  // Barre de vie du joueur 2 entre 30 pv et 60 pv (jaune)
  if (tableauJoueurs[1].vie<=60 && tableauJoueurs[1].vie>30) {
    console.log("vie jaune joueur2");
    color2 = 'yellow';
  }
  // Barre de vie du joueur 2 moins de 30 pv (rouge)
  if (tableauJoueurs[1].vie<=30) {
    console.log("vie rouge joueur2");
    color2 = 'red';
  }
  // On ajoute la bonne couleur au contexte
  ctx.fillStyle = color2;
  console.log(color2);
  // Création de la barre de vie du joueur 2
  ctx.fillRect(rect2X,rect2Y,rect2Width,rect2Height);
  
}

function anime() {
  // 1 On efface le canvas
  ctx.clearRect(0, 0, lc, hc);

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
    console.log(lc);
    console.log(Math.round(skinJoueur.width/2));
    console.log(Math.round(r.x));
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
