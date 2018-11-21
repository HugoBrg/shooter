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

class Tir {
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

function tirer() {
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
  let j1=new Joueur(lc/2.5,100,"https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg",100);
  let j2=new Joueur(lc/2.5,300,"https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg",100); 
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
  rect1Height = 10;
	rect1Width = tableauJoueurs[0].vie;
	rect1X = tableauJoueurs[0].x;
	rect1Y = tableauJoueurs[0].y-15;
    
  
	rect2Height = 10;
	rect2Width = tableauJoueurs[1].vie;
	rect2X = tableauJoueurs[1].x;
	rect2Y = tableauJoueurs[1].y-15;
  
  ctx.strokeRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.strokeRect(rect2X,rect2Y,rect2Width,rect2Height);
    
  //console.log("----------------------");
  if (tableauJoueurs[0].vie<=60 && tableauJoueurs[0].vie>30) {
    //console.log("vie jaune joueur1");
    color1 = 'yellow';
  }
  if (tableauJoueurs[0].vie<=30) {
    //console.log("vie rouge joueur1");
    color1 = 'red';
  }
  if (tableauJoueurs[0].vie<=100 &&tableauJoueurs[0].vie>60) {
    //console.log("vie verte joueur 1");
    color1 = 'green';
  }
  ctx.fillStyle = color1;
  //console.log(color1);
  ctx.fillRect(rect1X,rect1Y,rect1Width,rect1Height);
  if (tableauJoueurs[1].vie<=60 && tableauJoueurs[0].vie>30) {
    //console.log("vie jaune joueur2");
    color2 = 'yellow';
  }
  if (tableauJoueurs[1].vie<=30) {
    //console.log("vie rouge joueur2");
    color2 = 'red';
  }
  if (tableauJoueurs[1].vie<=100 &&tableauJoueurs[0].vie>60) {
    //console.log("vie verte joueur2");
    color2 = 'green';
  }
  ctx.fillStyle = color2;
  //console.log(color2);
  ctx.fillRect(rect2X,rect2Y,rect2Width,rect2Height);  
}

function anime() {
  // 1 On efface le canvas
  ctx.clearRect(0, 0, lc, hc);

  // 2
  afficherBarresVie();
  afficherJoueurs();
  afficherProj();
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

  if(tableauJoueurs[0].x > (tableauJoueurs[1].x + tableauJoueurs[1].width)){
    console.log("droite : "+tableauJoueurs[0].y+" > "+tableauJoueurs[1].y+" + "+tableauJoueurs[1].height+" ("+(tableauJoueurs[1].y+tableauJoueurs[1].height)+")");
  }
  ctx.restore();
}