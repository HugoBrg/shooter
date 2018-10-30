let canvas = document.querySelector("#myCanvas");
let ctx= canvas.getContext("2d");

let lc;
let hc;
let skinJoueur=new Image();
let project=new Image();

let tableauJoueurs=[];
let tableauProj=[];
let hp;
let rect1Height = 50;
let rect1Width = 100;
let rect1X = 700;
let rect1Y = 10;



function changeBg(val)
{   let span = document.querySelector("#val");
  span.innerHTML = val;
  switch(val)
    { case '1': canvas.style.background='url url(https://s3-eu-west-1.amazonaws.com/friday-ad/uploads/image/16639301_16639400/dj-for-hire-london-m25-mobile-disco-with-pa-system-birthdays-office-parties-christmas-events-16639337-2_800X600.jpg?cdc151883cf63ea9)'; break;
      case '2': canvas.style.background='url(https://wallpapercave.com/wp/XbmNalC.jpg)'; break;
      case '3': canvas.style.background='url(http://www.linuxcmd.org/lcshow/small/23/239344_dbz-gohan-wallpaper.jpg)'; break;
      default: break;
    }
}


class Joueur
  {
    constructor(newX,newY, Skin, vie)
    {
      this.x=newX;
      this.y=newY;
      this.skin=Skin;
      this.vie=vie;
    }
    
    draw(ctx,skinPlayer)
    {  skinJoueur.src=skinPlayer;
      largImage=150; //largeur nécessaire pour que l'image générée rende bien
     hautImage=100; //pareil pour la hauteur
      ctx.drawImage(skinJoueur, 0, 0, 420, 225, this.x,this.y,largImage,hautImage);

      
    }
    
  }

class Projectile
  {
    constructor(Img)
    { this.x=Math.floor((Math.random() * lc) + 1);
      this.img=Img;
      this.y=Math.floor((Math.random() * hc) + 1);
    }
    
    draw(ctx,lien)
    { project.src=lien;
      ctx.drawImage(project, 0, 0, 420, 225, this.x,this.y,100,300);
    }
    
  }

window.onload = function () {
    // Appelé quand la page est prête et a chargé
    // toutes ses ressources (images, vidéos etc.)
    console.log("pret")
    lc = canvas.width;
    hc = canvas.height;
genererJoueurs();
  
    this.setInterval(genererProj, 2000);
    // Pour animation à 60 im/s
    requestAnimationFrame(anime);
}

/*function changerSkin()
{
  j1.skin="https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg";
}*/


function genererProj()
{ 
  let newproj=new Projectile("http://benoit.montorsi.free.fr/fleche.png");
  tableauProj.push(newproj);
  afficherProj();
}

function afficherProj()
{
  
 tableauProj.forEach((r) => {
    r.draw(ctx,r.img);
  })

  
}

function genererJoueurs()
{ 
    let j1=new Joueur(lc/2.5,100,"https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg",100);
  let j2=new Joueur(lc/2.5,300,"https://myanimelist.cdn-dena.com/images/characters/3/307237.jpg",100);
  
    tableauJoueurs.push(j1);
    tableauJoueurs.push(j2);
   
}

function afficherJoueurs()
{
   tableauJoueurs.forEach((r) => {
    r.draw(ctx,r.skin);
  })
}

function afficherBarresVie()
{ rect1Height = 50;
 rect1Width = lc*0.7;
 rect1X = lc/8;
 rect1Y = hc/99;
 
 rect2Height = 50;
 rect2Width = lc*0.7;
 rect2X = lc/8;
 rect2Y = hc*0.9;
 ctx.font = "20pt Cambria";
  
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.fillStyle = 'blue';
 
  
  ctx.fillRect(rect1X,rect1Y,rect1Width,rect1Height);
  ctx.fillRect(rect2X,rect2Y,rect2Width,rect2Height);
  ctx.fillText(tableauJoueurs[0].vie,rect1X+(rect1Width),rect1Y+(rect1Height));
  ctx.fillText(tableauJoueurs[1].vie,rect2X+(rect2Width),rect2Y+(rect2Height));
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
