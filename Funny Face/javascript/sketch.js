let canvas;
let button;
let slider;

let displayState = 0;

let x = 100;
let y = 80;
let eyeX1 = 150;
let eyeX2 = 250;
let eyeY = 150;
let mouthY = 300;
let d = 0;
let mw = 10;
let brow = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  addGUI();
}

function draw() {
  background(109, 230, 230);
  
  noStroke();
  rectMode(CORNER);
  fill(110,207,229,80)
  rect(0,80,400,120);
  fill(119,185,244,80);
  rect(0,200,400,200);

  //clouds
  noStroke();
  fill(255, 150);
  rectMode(CORNER);
  rect(80, 80, 40);
  rect(60, 90, 20, 30);
  rect(120, 90, 20, 30);
  rect(140, 100, 20, 20);

  fill(255);
  rect(80 + x, 80 + y, 40);
  rect(60 + x, 90 + y, 20, 30);
  rect(120 + x, 90 + y, 20, 30);
  rect(140 + x, 100 + y, 20, 20);

  fill(255, 180);
  rect(80 + x, 80 + y, 40);
  rect(60 + x, 90 + y, 20, 30);
  rect(120 + x, 90 + y, 20, 30);
  rect(140 + x, 100 + y, 20, 20);

  fill(255, 220);
  rect(80, 80 + 3 * y, 40);
  rect(60, 90 + 3 * y, 20, 30);
  rect(120, 90 + 3 * y, 20, 30);
  rect(140, 100 + 3 * y, 20, 20);

  rect(80 + 3 * x, 80 + 2 * y, 40);
  rect(60 + 3 * x, 90 + 2 * y, 20, 30);
  rect(120 + 3 * x, 90 + 2 * y, 20, 30);
  rect(140 + 3 * x, 100 + 2 * y, 20, 20);

  fill(255);
  rect(80 + 3 * x, 80 - y / 2, 40);
  rect(60 + 3 * x, 90 - y / 2, 20, 30);
  rect(120 + 3 * x, 90 - y / 2, 20, 30);
  rect(140 + 3 * x, 100 - y / 2, 20, 20);

  //head
  fill(255, 100, slider.value(), 180);
  stroke(255, 180);
  strokeWeight(2);
  ellipseMode(CENTER);
  ellipse(200, 200, 250, 390);

  //cheek
  fill(245, 120, 170);
  noStroke();
  ellipse(80, 220, 40, 20);
  ellipse(330, 220, 40, 20);

  //eyes
  fill(0, 0, slider.value());
  stroke(255);
  strokeWeight(3);
  ellipse(eyeX1, eyeY, 30);
  ellipse(eyeX1 + 100, eyeY, 30);

  noFill();
  stroke(0);
  bezier(120, 100, 140, brow, 160, brow, 180, 100);
  bezier(220, 100, 240, brow, 260, brow, 280, 100);

  //nose
  fill(0);
  rectMode(CENTER);
  rect(200, 250, 20, 30, 10);

  //mouth

  d = dist(mouseX, mouseY, 200, 300);
  if (d < 30) {
    mw = d;
  } else {
    mw = mw;
  }
  ellipse(200, 300, 100, mw);

  if(displayState == 0){
    brow = 90;
    eyeX1 = 150;
    eyeX2 = 250;
  }else{
    brow = 100;
    eyeX1 = 250;
    eyeX2 = 350;
  }

}

function addGUI()
{
  //add a slider
  slider = createSlider(0, 255, 0, 1);
  slider.addClass("slider");
  //Add the slider to the parent gui HTML element
  slider.parent("gui-container");

  //add a button
  if(displayState == 0)
  {
      button = createButton("Left");
  }else if(displayState == 1){
      button = createButton("Right");
  }

  button.addClass("button");

  //Add the play button to the parent gui HTML element
  button.parent("gui-container");
  
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 

}

function handleButtonPress()
{
    
  if(displayState < 1)
  {
    displayState++;
  }else{
    displayState = 0;
  }

  if(displayState == 0)
  {
      button.html("Left");
  }else if(displayState == 1){
      button.html("Right");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}