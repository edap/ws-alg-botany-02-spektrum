var n = 0;
var c = 3; // this is just a constant
var max_number_of_points = 1800;

var points = [];

var start = 0;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  colorMode(HSB);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  //rotate(n * 0.3);
  for (var i = 0; i < n; i++) {
    //  FORMULA
    // the angle is n * 137.5
    var a = i * 137.5;
    // the radius is the constant c * the square root of i
    var r = c * sqrt(i);

    // But in p5 js, processing, or three.js, the coordinate system
    // is in cartesian space. We have to use trigonometric functions
    // to convert the polar coordinates to the cartesian coordinates
    var x = r * cos(a);
    var y = r * sin(a);

    // var hu = sin(start + i * 0.5);
    // hu = map(hu, -1, 1, 0, 360);
    // fill(hu, 255, 255);
    // or
    //fill(a % 255, 255, 255);
    //fill(100,255,255); //Hue, Saturation, Brightness.

    //
    fill((a-r) % 255,255,255);
    noStroke();
    // TODO, check the p5 reference and draw another form
    ellipse(x, y, 4, 4);
  }
  if(i < max_number_of_points){
    n += 5;
    start += 5;
  }
}

// TODO
// try to change c
// add colors
