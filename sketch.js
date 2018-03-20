var A;
var B;
var velA;
var chargeA;

var P = 10;
var B = 5;
var Q = 1;
var M = 1;

var bounds = 10;
var stageBorder = 50;
var r = 15;

var trail = Array(Array(32));

var stopped = true;
var finished = false;

var vSlider;
var bSlider;
var start;
var reset;
var charge;
var newButton;

function startPressed() {
    stopped = !stopped;
    finished = false;

    if (stopped) {
        start.elt.innerHTML = "Start";
    } else if (!stopped) {
        start.elt.innerHTML = "Pause";
    }
}

function resetPressed() {
    finished = false;
    velA = createVector(0, 10);
    stopped = true;
    trail = [];
    d = 0;
    a = createVector(width/2, height/2);
    start.elt.innerHTML = "Start";
}

function changeCharge() {
    var item = sel.value();
    if (item == '+1') {
        Q = 1;
    } else if (item == "-1") {
        Q = -1;
    } else {
        Q = 0;
    }
}

function newPressed() {
    setup();
    finished = false;
}

function setup() {
    var cnv = createCanvas(640, 480);
    cnv.parent('holder')

    M += random(0, 1)

    if (!finished) {
        vSlider = createSlider(1, 20, 1, 0.01);
        vSlider.position(10, 10);
        vSlider.style('width', '120px');
    
        bSlider = createSlider(1, 20, 1, 0.01);
        bSlider.position(150, 10);
        bSlider.style('width', '120px');
    }

    sel = createSelect();
    sel.position(290, 10);
    sel.style('width', '60px');
    sel.style('height', '20px');
    sel.option('+1');
    sel.option('0');
    sel.option('-1');
    sel.changed(changeCharge);

    start = createButton("Start");
    start.style('width', '60px');
    start.style('height', '20px');
    start.position(360, 10);
    start.mousePressed(startPressed);

    reset = createButton("Reset");
    reset.style('width', '60px');
    reset.style('height', '20px');
    reset.position(430, 10);
    reset.mousePressed(resetPressed);

    newButton = createButton("New");
    newButton.style('width', '60px');
    newButton.style('height', '20px');
    newButton.position(500, 10);
    newButton.mousePressed(newPressed);

    // A is the acting particle (red)
    // B is the stationary particle (blue)
    a = createVector(width/2, height/2);
    b = createVector(random(stageBorder, width - stageBorder), random(stageBorder, height - stageBorder));
    velA = createVector(0, 10);

    Path = createVector(width/2, height/2);
    velPath = createVector(0, 10);

    strokeWeight(2)
}

function draw() {
    background(0);
    noStroke();
    
    P = vSlider.value();
    B = bSlider.value();

    fill(114, 219, 255);
    textSize(12)
    text('Velocity = ' + vSlider.value(), 10, 50);
    text('Flux Density = ' + bSlider.value(), 150, 50);
    text('Charge', 290, 50);

    text('The Woodroffe School', 10, height - 10)
    trail.push([a.x, a.y]);

    for (var i = 0; i < trail.length; i++) {
        fill(114, 219, 255);
        ellipse(trail[i][0], trail[i][1], 5, 5);
    }

    fill(255, 0, 0);
    ellipse(a.x, a.y, r * M, r * M);

    fill(114, 219, 255);
    ellipse(b.x, b.y, r * M, r * M);

    if (finished) {
        textSize(32);
        text('Congratulations!', width/2 - 120, height/2);
        stopped = true;
    }
    
    if (!stopped) {
        updateParticle();
    } else {
        stroke(255, 0, 0);
        
        var c = a.copy();
        var velP = velA.copy();

        for (var i = 0; i < 10; i++) {
            c.x += velP.x;
            c.y -= velP.y;

            var dA = ((B * Q) / P);
            velP.rotate(radians(dA));

            point(c.x, c.y, 5, 5);
        }
    }
}

function updateParticle() {
    a.x += velA.x;
    a.y -= velA.y;

    var dA = ((B * Q) / P);

    velA.rotate(radians(dA));

    if (a.x < 0 || a.x > width || a.y < 0 || a.y > height) {
        resetPressed();
    }
    
    if (abs(a.x - b.x) < bounds && abs(a.y - b.y) < bounds) {
        finished = true;
    }
}