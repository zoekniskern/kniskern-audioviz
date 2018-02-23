//https://www.w3schools.com/howto/howto_js_sidenav.asp

function openNav(){
    //console.log("clicked nav");
    var menu = document.getElementById("controls");
    var closeme = document.getElementById("open");
    
    //console.log(menu.style.width);
    //sets properties
    menu.style.width = 40 + '%';
    menu.style.paddingLeft = 10 + 'px';
    
    closeme.style.display = 'none';
}

function closeNav(){
    var menu = document.getElementById("controls");
    var closeme = document.getElementById("open");
    
    menu.style.width = 0 + 'px';
    menu.style.paddingLeft = 0 + 'px';
    
    closeme.style.display = 'block';
    closeme.style.width = 3 + 'em';
}