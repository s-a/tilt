var config = {
    tolerance : .04,
    zoom : 80,
    scale : .2,
    refreshRate : 100
};


var setValue = function(parmName, value, control) {
    if (value) {
        config[parmName] = value;
    } else {
        value = config[parmName];
    };
    control.innerHTML = parmName + ":" + value;
};

var edit = function() {
    var parmName = this.id;
    var value = parseFloat(prompt("Please enter a value for \"" + parmName + "\"", config[parmName]));
    if (!isNaN(value)){
        setValue(parmName, value, this);
        if (console) {
            console.log(parmName, value)
            console.log(config);
        };
    }
    return false;
};

var get = function(id) {
    return document.getElementById(id);
};

var initEditButton = function(parmName) {
    var test = get(parmName);
    test.onclick = edit;
    test.className = "menu__item";
    setValue(parmName, null, test);
};



document.addEventListener('DOMContentLoaded',function() {
    initEditButton("tolerance");
    initEditButton("zoom");
    initEditButton("refreshRate");
    initEditButton("scale");
});


(function () {

   
    var color = {
        red:"#ff0101",
        green:"#49fb35"
    };
    var lineWidth = 4;

    document.write('<div id="itae-anchor"></div>');
    var anchor = document.getElementById('itae-anchor'),
        container = anchor.parentNode,
        viewport = document.createElement('div'),
        snd = document.getElementById('snd');
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(anchor);
    container.appendChild(viewport);
    var style = window.getComputedStyle(container, null);
    var currentColor = style.color;
    anchor.style.position = 'absolute';
    anchor.style.width = viewport.style.width = style.width;
    anchor.style.height = viewport.style.height = style.height;
    anchor.style.zIndex = 1;
    anchor.style.zIndex = 0;
    viewport.style.overflow = 'hidden';


    var width = viewport.clientWidth,
        height = viewport.clientHeight,
        pan = Math.round(width / 200),
        totalWidth = pan * 1000,
        zero = height / 2;
    var x, y = zero,
        deflection = 0,
        axesPrev = [],
        canvas, ctx;
    var freshCanvas = function () {
        var newCanvas = document.createElement('canvas');
        newCanvas.width = totalWidth;
        newCanvas.height = height;
        viewport.appendChild(newCanvas);
        viewport.scrollLeft = 0;
        ctx = newCanvas.getContext('2d');
        ctx.strokeStyle = currentColor;
        if (canvas) {
            ctx.drawImage(canvas, width - x, 0);
            viewport.removeChild(canvas);
        }
        canvas = newCanvas;
        x = width;
    };
    var scrollCanvas = function() {
        viewport.scrollLeft++;
        if (viewport.scrollLeft >= totalWidth - width) {
            freshCanvas();
        }
    };
    var drawTheLine = function () {

        ctx.beginPath();
        ctx.moveTo(x, y);
        x += pan;
        y = zero + (height * deflection / 25);
        deflection = (Math.random() * config.scale - .1);
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
        for (var i = 0; i < pan; i++) {
            setTimeout(scrollCanvas, i * config.refreshRate / pan);
        }
    };
    var tilt = function (axes) {
        //currentColor = style.color;
        if (axesPrev) {
            for (var i = 0; i < axes.length; i++) {
                var delta = axes[i] - axesPrev[i];
                if (Math.abs(delta) > Math.abs(deflection)) {
                    if (Math.abs(delta) > config.tolerance){
                        currentColor = 'red';
                        snd.play();
                    } else {
                        currentColor = 'green';
                    }
                    //document.title = deflection;
                    //
                    deflection = delta * config.zoom;
                    ctx.strokeStyle = currentColor;
                }
            }
        }
        axesPrev = axes;
    };
    freshCanvas();
    ctx.lineWidth = lineWidth;
    ctx.moveTo(0, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            tilt([event.beta, event.gamma]);
        }, true);
    } else if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function(event) {
            tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
        }, true);
    } else {
        window.addEventListener('MozOrientation', function(orientation) {
            tilt([orientation.x * 50, orientation.y * 50]);
        }, true);
    }
    setInterval(drawTheLine, config.refreshRate);
    setTimeout( function  (argument) {
     
    },1000)
})();
