//script to resize canvas

/*
https://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
*/
"use strict"

var canvasArea, canvasFull, widToH,nW,nH,nWidtoH;

function resize(){
    //get canvas area    
    canvasArea = document.getElementById('canvasArea')
    
    widToH = 5 / 3;
    nW = window.innerWidth;
    nH = window.innerHeight;
    nWidtoH = nW / nH;
    
    if(nWidtoH > widToH) {
        //window is too wide
        nW = nH * widToH;
        canvasArea.style.height = nH + 'px';
        canvasArea.style.width = nW + 'px';
    } else {
        //window is too tall
        nH = nW / widToH;
        canvasArea.style.width = nW + 'px';
        canvasArea.style.height = nH + 'px'; 
    }
    
    //adjust margin
    canvasArea.style.marginTop = (-nH / 2) + 'px';
    canvasArea.style.marginLeft = (-nW / 2) + 'px';
    
    //adjust font
    canvasArea.style.fontSize = 1 + 'em';
    
    canvasFull = document.getElementById('canvasArea');
    canvasFull.width = nW;
    canvasFull.height = nH;
}