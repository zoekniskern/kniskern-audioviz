//IIFE
"use strict";

//GLOBALS

var canvas;
var ctx;

var radiusVal = 30;

//test drawings
function draw(data){
    
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
    
    //console.log("draw ran");
    window.addEventListener('resize',resize, false);
    window.addEventListener('orientationchange',resize, false);
    
} //end of drawing

//Helper function
function makeColor(red, green, blue, alpha){
    var color='rgba('+red+','+green+','+blue+ ','+alpha+')';
    return color;
}

//Full Screen function
//crossbrowser compatibility
function requestFullscreen(element){
    if(element.requestFullscreen){
        element.requestFullscreen();
    } else if(element.mozRequestFullscreen){
        element.mozRequestFullscreen();
    } else if(element.mozRequestFullScreen){
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen){
        element.webkitRequestFullscreen();
    }
    
    //nothing happens if it WebAudio isn't supported
}