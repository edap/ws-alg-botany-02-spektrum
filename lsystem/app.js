const PI = 3.1415926535
var angle = PI / 4;
var canvas_width = 800;
var canvas_height = 800;
var branch_length = 200;
var decrease_percent = 0.67;

// this sketch is an introduction to recursion
// https://en.wikipedia.org/wiki/Recursion_(computer_science)

var slider;
function setup(){
  // create a canvas with these dimensions
  createCanvas(canvas_width,canvas_height);
  slider = createSlider(0,PI*2,PI/4);
}
function draw(){
  // this is the color of the background
  // try to change it, look at the references
  // https://p5js.org/reference/#/p5/background
  background(51);
  // this is the line that draw each segment
  // try to change it https://p5js.org/reference/#/p5/stroke
  stroke(255);

  // this is the angle
  angle = slider.value();
  // move the "turtle" to the center of the screen
  translate(canvas_width/2,canvas_height);
  branch(branch_length);
}

function branch(len){
  // draw a line that start in (0,0) and ends in (0, -len)
  line(0,0,0,-len);
  translate(0,-len);
  if (len>4){
    push();
    rotate(angle);
    branch(len*decrease_percent);
    pop();
    push();
    rotate(-angle);
    branch(len*decrease_percent);
    pop();
  }
}