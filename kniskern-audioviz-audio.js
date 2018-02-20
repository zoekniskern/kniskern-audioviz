//IIFE
(function(){
    "use strict";
    
    //GLOBALS
    var NUM_SAMPLES = 256;
    var SOUND_1 = 'media/Issues.mp3';
    var SOUND_2 = 'media/African Queen.mp3';
    var audioElement;
    var analyserNode;
    var canvas;
    var ctx;
    var radiusVal = .5;
    var invert = false;
    var tintRed = false;
    var noise = false;
    var lines = false;
    
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
        analyserNode.connect(audioCtx.destination);
        return analyserNode;
    }
    
    //setupUI function
    function setupUI(){
        document.querySelector("#trackSelect").onchange = function(e){
            playStream(audioElement,e.target.value);
        };
        document.querySelector("#RadiusSlider").onchange = function(e){
            radiusVal = e.target.value;
        };               document.querySelector("#fsButton").onclick = function(){
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
        
        //use frequency data inside array
        analyserNode.getByteFrequencyData(data);
        /////////////or waveform data
        /////analyzerNode.getByteTimeDomainData(data);
        
        //draw
        draw();
        
        //ctx.clearRect(0,0,800,600);
        //drawing variables
        var barWidth = 3;
        var barSpacing = 3;
        var barHeight = 100;
        var topSpacing = 50;
        
        //DRAWING LOOP PLIS
        //loop through the data and draw
        for(var i=0; i<data.length; i++){
            
            /*
            //drawing line
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(canvas.width/2, canvas.height/2);
            ctx.lineTo(i*(barWidth+barSpacing),topSpacing+256-data[i]);
            ctx.stroke();
            
            
            //drawing small circles
            topSpacing = 0;
            ctx.fillStyle = "gray";
            ctx.beginPath();
            ctx.arc(i*(barWidth+70),topSpacing+256-data[i],10,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            //higher amplitude = taller bar
            topSpacing = 30;
            ctx.fillStyle = 'rgba(0,255,0,0.6)';
            ctx.fillRect(i*(barWidth+barSpacing),topSpacing+200-data[i],barWidth,barHeight);
            //inverted bar graph
            ctx.fillRect(640-i*(barWidth+barSpacing),topSpacing+256-data[i]-20,barWidth,barHeight);
            */
            
            //redish circles
            var percent = data[i] / 256;
            var maxRadius = radiusVal*200;
            var circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = "red";//makeColor(255,111,111,.34 - percent/3.0);
            ctx.arc(canvas.width/2, canvas.height/2, circleRadius,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            
            
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
    
    window.addEventListener("load",init);
}());