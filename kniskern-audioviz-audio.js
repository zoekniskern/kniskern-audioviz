//IIFE
(function(){
    "use strict";
    
    //GLOBALS
    var NUM_SAMPLES = 256;
    var SOUND_1 = 'media/Issues.mp3';
    var SOUND_2 = 'media/African Queen.mp3';
    var audioElement;
    var analyserNode;
    var delayAmount = 0;
    var delayNode;
    var canvas;
    var ctx;
    var radiusVal = .5;
    var invert = false;
    var tintRed = false;
    var noise = false;
    var lines = false;
    var wave = false;
    
    //Init function will call itself because of IIFE
    function init(){
        //get canvas
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");
        
        //reference <audio> element on page
        audioElement = document.querySelector('audio');
        
        //call helper function to get analyzer node
        analyserNode = createWebAudioContextWithAnalyserNode(audioElement);
        
        //get sound track <select> and Full Screen button working
        setupUI();
        
        //load and play default sounds into audio element
        playStream(audioElement, SOUND_1);
        
        //start animation loop
        update();
        
        resize();
    }
    
    //createWebAudtioContextWithAnalyzerNode function
    function createWebAudioContextWithAnalyserNode(audioElement){
        var audioCtx;
        var analyserNode;
        var sourceNode;
        
        
        //create new AudioContext;
        //use || for WebAudio crossbrower compatibility
        audioCtx = new (window.AudioContext || window.webkitAudioContext);
        
        //create analyzer node
        analyserNode = audioCtx.createAnalyser();
        
        //create DelayNode instance
        delayNode = audioCtx.createDelay();
        delayNode.delayTime.value = delayAmount;
        
        /*
        request NUM_SAMPLES - number of samples across the sound spectrum
        each sample contains # between 0-255 representing the amplitude of that frequency
        */
        //fft = Fast Fourier Transform
        analyserNode.fftSize = NUM_SAMPLES;
        
        //hook up the <audio> element to the analyserNode
        sourceNode = audioCtx.createMediaElementSource(audioElement);
        sourceNode.connect(analyserNode);
        
        //connect to destination
        //analyserNode.connect(audioCtx.destination);
        sourceNode.connect(audioCtx.destination);
        sourceNode.connect(delayNode);
        delayNode.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);
        return analyserNode;
    }
    
    //setupUI function
    function setupUI(){
        
        document.querySelector("#trackSelect").onchange = function(e){
            playStream(audioElement,e.target.value);
        };
        document.querySelector("#ReverbSlider").onchange = function(e){
            delayAmount = e.target.value;
            delayNode.delayTime.value = delayAmount;
        };
        document.querySelector("#RadiusSlider").onchange = function(e){
            radiusVal = e.target.value;
        };
        document.querySelector("#fsButton").onclick = function(){
            requestFullscreen(canvas);
        };
        
        //check boxes
        document.getElementById('redTint').onchange = function(e){
            if(e.target.checked){
                tintRed = true;
            }
            else{
                tintRed = false;
            }
            
            //setCheck(tintRed, e.target.value);
        }
        document.getElementById('invert').onchange = function(e){
            if(e.target.checked){
                invert = true;
            }
            else{
                invert = false;
            }
            
            //setCheck(tintRed, e.target.value);
        }
        document.getElementById('noise').onchange = function(e){
            if(e.target.checked){
                noise = true;
            }
            else{
                noise = false;
            }
            
            //setCheck(tintRed, e.target.value);
        }
        document.getElementById('lines').onchange = function(e){
            if(e.target.checked){
                lines = true;
            }
            else{
                lines = false;
            }
            
            //setCheck(tintRed, e.target.value);
        }
        
        document.getElementById('wave').onchange = function(e) {
            //form = e.target.checked;
            if (e.target.checked) {
                wave = true;
            }
            else {
                wave = false;
            }
        }
        
        // Get working later
        /*
        function setCheck(checkbox,target){
            console.log("target: " + target);
            if(target){
                checkbox = true;
            }
            else{
                checkbox = false;
            }
        }
        */
        
    }
    
    //playStream function
    function playStream(audioElement,path){
        audioElement.src = path;
        audioElement.play();
        audioElement.volume = 0.2;
        document.querySelector("#status").innerHTML = "Now playing: " + path;
    }
    
    //update function
    function update(){
        //calls update() method 1/60sec
        requestAnimationFrame(update);
        
        //Nyquist Theorem
        //array of 8-bit integers (0-255)
        var data = new Uint8Array(NUM_SAMPLES/2);
        var data2 = new Uint8Array(NUM_SAMPLES/2);
        
        //does not totally work
        if(wave){
            analyserNode.getByteTimeDomainData(data);
            //console.log('wave');
        } else {
            analyserNode.getByteFrequencyData(data);
            //console.log('freq');
        }
        //use frequency data inside array
        //analyserNode.getByteFrequencyData(data);
        /////////////or waveform data
        //analyzerNode.getByteTimeDomainData(data);
        
        //draw
        draw();
        ctx.clearRect(0,0,800,600);
        

        //drawing variables
        var barWidth = 3;
        var barSpacing = 3;
        var barHeight = 100;
        var topSpacing = 50;
        
        //data at specific number
        //console.dir(data[30]);
        
        //DRAWING LOOP PLIS
        //loop through the data and draw
        for(var i=0; i<data.length; i++){
            
            
            //redish circles
            var percent = data[i] / 256;
            var maxRadius = radiusVal*200;
            var circleRadius = percent * maxRadius;
            
            
            
            
            ctx.beginPath();
            ctx.fillStyle = makeColor(255,111,111,.34 - percent/3.0);
            ctx.arc(canvas.width/2, canvas.height/2, circleRadius,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            ctx.beginPath();
            ctx.fillStyle = "aqua";
            ctx.arc(canvas.width/2, canvas.height/2, circleRadius*3,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            ctx.beginPath();
            ctx.fillStyle = "#C0C0C0";
            ctx.arc(canvas.width/2, canvas.height/2, circleRadius*2.5,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            ctx.beginPath();
            ctx.fillStyle = "white"//"#D3D3D3";//makeColor(255,111,111,.34 - percent/3.0);
            ctx.arc(canvas.width/2, canvas.height/2, circleRadius,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            //blue circles
            ctx.beginPath();
            ctx.fillStyle = makeColor(0,0,150,.10-percent/10.0);
            ctx.arc(canvas.width/2,canvas.height/2,circleRadius*5,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            
            //draw line
            
            var lastX = 0;
            var lastY = canvas.height * 400;
            var newX;
            var newY;
            ctx.strokeStyle = 'light-blue';
            newX = i * 10;
            newY = 100 + 256 - data[i];
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(newX, newY);
            ctx.stroke();
            //ctx.closePath();
            lastY = newY;
            lastX = newX;
            
            var totalPoints = 15;
            var centX = canvas.width/2;
            var centY = canvas.height/2;
            var rad = circleRadius;
            var x,y;
            
            for(var h=1;h<=totalPoints;h++){
                percent = data[40] / 256;
                maxRadius = radiusVal*200;
                circleRadius = percent * maxRadius;
                rad = circleRadius;
                
                var theta = ((Math.PI*2)/totalPoints);
                var angle = (theta*h);
                var x = (rad*2 * Math.cos(angle) + centX);
                var y = (rad*2 * Math.sin(angle) + centY);
                
                ctx.lineWidth = .01;
                drawPoints(rad,h,totalPoints);
                //drawLines();
                drawPerpLines();
                longPerp();
            }
            
            function drawPoints(r,currentPoint,totalPoints){
                var theta = ((Math.PI*2)/totalPoints);
                var angle = (theta*currentPoint);
                
                x = (r * Math.cos(angle) + centX);
                y = (r * Math.sin(angle) + centY);
                
                ctx.fillStyle = "light-blue";
                var sSiz = 3;
                ctx.fillRect(x-sSiz/2,y-sSiz/2,sSiz,sSiz);
            }
            
            function drawLines(){
                ctx.lineWidth  = .05;
                ctx.beginPath();
                ctx.moveTo(centX,centY);
                ctx.lineTo(x,y);
                ctx.fillStyle = "green";
                //ctx.fillRect(x,y,3,3);
                ctx.strokeStyle = "black";
                ctx.stroke();
                
            }
            
            function drawPerpLines(){
                /*
                percent = data[30] / 256;
                maxRadius = radiusVal*200;
                circleRadius = percent * maxRadius;
                rad = circleRadius;
                */
                ctx.save()
                ctx.lineWidth = .05;
                var vX = x - centX;
                var vY = y - centY;
                
                var oX = centX + (vX - vY)/2 ;
                var oY = centY + (vX + vY)/2 ;
                
                var sSiz = 5;
                ctx.fillStyle = "black";
                //ctx.fillRect(vX-sSiz/2,vY-sSiz/2,sSiz,sSiz);
                ctx.fillStyle = "blue";
                //ctx.fillRect(oX-sSiz/2,oY-sSiz/2,sSiz,sSiz)
                
                ctx.beginPath();
                ctx.moveTo(oX,oY);
                ctx.lineTo(oX + vY,oY - vX);
                ctx.strokeStyle = "white";
                ctx.stroke();
                
                //attempt to rotate
                /*
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(10)*Math.PI/180
                */
                
                ctx.restore()
            }      
            
            //http://jsfiddle.net/n2gqw8of/91/
            function longPerp(){
                
                percent = data[i] / 256;
                maxRadius = radiusVal*200;
                circleRadius = percent * maxRadius;
                rad = circleRadius;
                ctx.strokeStyle = 'gray';
                ctx.lineWidth   = .05;
                
                ctx.beginPath();
        
                // Calculate perpendicular offset
                var ax = centX;
                var ay = centY;
                var bx = x;
                var by = y;
                
                var dx = ax - bx;
                var dy = ay - by;
                
                var dist = Math.sqrt(dx * dx + dy * dy);
                
                var offset = 20 * dist;
                
                var normX = dx / dist;
                var normY = dy / dist;
                
                var xPerp = offset * normX;
                var yPerp = offset * normY;
                
                // Create perpendicular points
                
                var cx = ax + yPerp;
                var cy = ay - xPerp;
                var dx = ax - yPerp;
                var dy = ay + xPerp;
                
                var ex = bx - yPerp;
                var ey = by + xPerp;
                //ctx.fillStyle = "lightcyan";
                var sSiz = 3;
                ctx.fillRect(ex-sSiz/2,ey-sSiz/2,sSiz,sSiz);
                
                var fx = bx + yPerp;
                var fy = by - xPerp;
                
                // Draw perpendicular lines
                
                /*
                ctx.moveTo(cx, cy);
                ctx.lineTo(dx, dy);
                ctx.stroke();
                */
                
                ctx.moveTo(ex, ey);
                ctx.lineTo(fx, fy);
                ctx.stroke();
            }
            
            
        } //end of drawing loop
        
        manipulatePixels();
    }//end of update
    
    function manipulatePixels(){
            //get rgba pixel data with ImageData()
            var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
            //imagedata is 8-bit type array
            //values: 0-255
            //4 values per pixel: 4xcan.height, 4xcan.wid
            var data = imageData.data;
            var length = data.length;
            var width = imageData.width;
            
            //go through each pixel
            //step by 4 for manipulate 1 pixel per iteration
            //data[i]istheredvalue
            //data[i+1]isthegreenvalue
            //data[i+2]isthebluevalue
            //data[i+3]isthealphavalue
            for(var i=0;i<length;i+=4){
                //increase red
                if(tintRed){
                    data[i] = data[i]+100;
                }
                if(invert){
                    var red = data[i];
                    var green = data[i+1];
                    var blue = data[i+2];
                    
                    data[i] = 255 - red;
                    data[i+1] = 255 - green;
                    data[i+2] = 255 - blue;
                }
                if(noise && Math.random()<.10){
                    //gray noise
                    data[i] = data[i+1] = data[i+2] = 128;
                    
                    //white noise
                    //data[i] = data[i+1] = data[i+2] = 255;
                    
                    //black noise
                    //data[i] = data[i+1] = data[i+2] = 0;
                }
                if(lines){
                    var row = Math.floor(i/4/width);
                    if(row%50==0){
                        //this row
                        data[i] = data[i+1] = data [i+2] = data[i+3] = 255;
                        
                        //next row
                        data[i+(width*4)] = data[i+(width*4)+1] = data [i+(width*4)+2] = data[i+(width*4)+3] = 255;
                        }
                }
            }
            //put modified data back on canvas
            ctx.putImageData(imageData,0,0);
        }
    
    //Helper function
function makeColor(red, green, blue, alpha){
    var color='rgba('+red+','+green+','+blue+ ','+alpha+')';
    return color;
}
    
    window.addEventListener("load",init);
}());