//IIFE
(function(){
    "use strict";
    
    //GLOBALS
    
    var canvas;
    var ctx;
    var radiusVal = 30;
    
    //Init function will call itself because of IIFE
    function init(){
        //get canvas
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");
        
        canvasArea = document.getElementById('canvasArea')
        
        resize();
        
        draw();
    }
    
    //test drawings
    function draw(){
        
        window.addEventListener('resize',resize, false);
        window.addEventListener('orientationchange',resize, false);
        
        //circle
        ctx.beginPath();
        ctx.fillStyle = "red";//makeColor(255,111,111,.34 - percent/3.0);
        ctx.arc(canvas.width/2, canvas.height/2, radiusVal,0,2*Math.PI,false);
        ctx.fill();
        ctx.closePath();
        
        
        //points on a circle //https://stackoverflow.com/questions/24273990/calculating-evenly-spaced-points-on-the-perimeter-of-a-circle
        var totalPoints = 10;
        var centX = canvas.width/2;
        var centY = canvas.height/2;
        var rad = 70;
        var x;
        var y;
        
        for(var i=1;i<=totalPoints;i++){
            drawPoints(100,i,totalPoints);
            drawLines();
            drawPerpLines();
        }
        
        function drawPoints(r,currentPoint,totalPoints){
            var theta = ((Math.PI*2)/totalPoints);
            var angle = (theta*currentPoint);
            
            x = (rad * Math.cos(angle) + centX);
            y = (rad * Math.sin(angle) + centY);
            
            ctx.fillStyle = "blue";
            var sSiz = 5;
            ctx.fillRect(x-sSiz/2,y-sSiz/2,sSiz,sSiz);
        }
        
        function drawLines(){
            ctx.beginPath();
            ctx.moveTo(centX,centY);
            ctx.lineTo(x,y);
            ctx.strokeStyle = "yellow";
            ctx.stroke();
        }
        
        function drawPerpLines(){
            var vX = x - centX;
            var vY = y - centY;
            
            var oX = centX + (vX - vY)/2 ;
            var oY = centY + (vX + vY)/2 ;
            
            ctx.beginPath();
            ctx.moveTo(oX,oY);
            ctx.lineTo(oX + vY,oY - vX);
            ctx.strokeStyle = "green";
            ctx.stroke();
        }      
        
        function longPerp(e){
            var bord = canvas.getBoundingClientRect();
            var x1 = canvas.width *.5;
            var y1 = canvas.height;
            var x2 = e.clientX - bord.left;
            var x2 = e.clientY - bord.top;
            var f = 0;
            var x,y;
        }
        
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
    
    window.addEventListener("load",init);
}());