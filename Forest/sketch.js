// Fractal Tree Drawing
// 20221127 Yu Yan
// Reference:https://thecodingtrain.com/challenges/14-fractal-trees-recursive
//https://www.youtube.com/watch?v=Eq1EDuVk_Fk
// https://editor.p5js.org/joemcalister/sketches/6v-N3urTT 
//https://editor.p5js.org/joemcalister/sketches/uRxbhCjqb 

let d;//rotate angle
let div = 24;//Number of symmetrical patels；
let sym = 360/div;

function setup(){
  createCanvas(800, 400);
  background(220);
  frameRate(7);
}

function draw(){
   drawFlower();
   drawTree();
  
  if(frameCount % 4 == 0){
     drawFog();
     }// only draw the fog evey 16 frames
}

// fog is a slightly opaque rectangle over the entire window
function drawFog(){
  push();
  noStroke();
  fill(220,20); 
  rect(0,0,800,400);
  pop();
}

//draw symmetrical flower
function drawFlower(){
   d = map(mouseX, 0, width, 0, 90);
  //let pSize = random(20,60);
  let pSize = map(mouseY, 0, height, 10, 50);
  
  push();
  for(let j = 0; j < 3; j++){
    translate(random(width), random(height/2));//Draw flowers in random positions
  }
  // translate(width/2, height/2);// draw flower in the centre and change the petals with the mouse
    for(let i = 0; i< 360; i+=sym){
    push();
    rotate(i);
    petal(pSize);
    pop();
   }
  pop();
}

// same recusive function as in Tree.pde
function petal(size){
 let newSize =size + random(20,30)*noise(d);
  // set stroke weight
  stroke(120,random(100,200),150);
  strokeWeight(size * 0.03);
  line(0,0,0, size);
  
  translate(0, size);
  if(size > 30){
  push();
  rotate(d);
  petal(size*0.7);
  pop();
 
  push();
  rotate(-d);
  petal(size*0.7);
  pop();
  }
}
// a 'wrapper' function that makes a single, random tree
function drawTree(){
  let bLen = random(12,80);
  let bAng = -PI* 0.5;
  
  push();
  stroke(0,10);
  translate(random(width),random(height,4*height/5));
  branch(bLen,bAng);// initial length and facing up
  pop();
}

// same recusive function as in Tree.pde, only using random numbers
function branch(len,theta){
  push();
  rotate(theta);// rotate to the angle provided
  strokeWeight(sqrt(len)*0.5);
  line(0,0,len,0);// draw one branch
  translate(len,0);// and move to its edge
  
  if(len > 4.0){// stop condition
    let newAng = random(PI/6);// create new angle
    let newLen = len * random(0.4,0.8);// create new length
    branch(len * random(0.4,0.9),newAng);// right branch
    branch(len * random(0.4,0.9),-newAng);// left branch
  }else{
    //draw leaves
    noStroke();
    fill(100,120,200,100);
    ellipse(0,0,8,4);
    push();
    stroke(255,150);
    strokeWeight(1);
    line(0,0,4,0);
    pop();
  }
  pop();
  
}
