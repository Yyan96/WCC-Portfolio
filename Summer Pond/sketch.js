// Under the Sea
//20230110 by Yu Yan

//refer:[1] "The Natur of Code" by Daniel Shiffman, 2012
// www.natureofcode.com--Example 1.11: Array of movers accelerating towards the mouse

//refer:[2] "Perlin Noise Flow Field" by Daniel Shiffman
//https://www.youtube.com/watch?v=BjoM9oKOAKY

//refer:[3] "Attraction / Repulsion" by Daniel Shiffman
//https://www.youtube.com/watch?v=OAcXnzRNiCY&t=2110s

/**
 * KEYS
 *f            : fullscreen
 *space        : new particle seed & position of the bubbles
 *c            : clear screen
 *s            : save png
 *mouse        : draw flower
 */
let palette2 = [
  "#e2f6f6",
  "#88ada6",
  "#dfd7c2",
  "#d4e5ef",
  "#fefbf6",
  "#afd7ec",
  "#e6cf7a",
];
let bubbles = [];
let attractors = [];
let num = 15; //number of bubbles(change later...)

let flowers = [];

let inc;
let scl;
let cols;
let rows;

let zoff;

let fr;

let particles = [];
let noiseScale = 0.01 / 2;
let waveNum = 3000; //the number of waves
let xoff = 0;
let f = 0.0;
let b = 0;

let flowField = [];

function setup() {
  createCanvas(600, 600);
  
  //initialize each particle(wave) in the array
  zoff = 0;
  scl = 10;
  inc = 0.1;
  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);
  fr = createP();

  for (let i = 0; i < waveNum; i++) {
    particles[i] = new Particle();
  }

  //initialize each bubble in the array
  for (let j = 0; j < num; j++) {
    bubbles[j] = new Bubble();
  }
}

function draw() {
  background(6, 67, 111, 50);
  blendMode(BLEND);

  // draw wave
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xoff += inc;
    }
    yoff += inc;
    zoff += 0.0002;
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].edges();
    particles[i].show();
    particles[i].follow(flowField);
  }
  particles.push(new Particle(random(windowWidth), random(windowHeight)));
  fr.html(floor(frameRate()) + " fps");

  // draw fixed bubble
  let xoff = 0;

  for (let i = 0; i < 1000; i += 20) {
    let a = 0;
    let j = noise(xoff, i) * windowWidth;
    let r = noise(i, j) * 90;
    
    fill(175, 215, 236, 30);
    noStroke();
    ellipse(j + a, i + a, r * sin(b));
    a += 1;
  }

  xoff += 0.01;
  b += 0.03;

  //draw bubbles(fish...)
  bubbles.push(new Bubble(random(windowWidth), random(windowHeight)));
  if (particles.length > 100) {
    particles.splice(0, 1);
  }

  for (let i = 0; i < num; i++) {
    var bubble = bubbles[i];
    for (let j = 0; j < attractors.length; j++) {
      bubble.attracted(attractors[j]);
    }
    bubble.update();
    bubble.checkEdges();
    bubble.display();
  }
  
  //draw flowers(attracting fish)
  for (let i = 0; i < attractors.length; i++) {
    // point(attractors[i].x, attractors[i].y);
    beginShape();
    noStroke();
    fill(211, 229, 239, 120);
    vertex(attractors[i].x, attractors[i].y);
    vertex(attractors[i].x+20, attractors[i].y);
    vertex(attractors[i].x+5, attractors[i].y+12);
    vertex(attractors[i].x+10, attractors[i].y-6);
    vertex(attractors[i].x+15, attractors[i].y+12);
    endShape(CLOSE);
  }
  
  for (let i = 0; i < flowers.length; i++){
    flowers[i].show();
  }
  
}

function mousePressed() {
  attractors.push(createVector(mouseX, mouseY));
  let a = new Flower(mouseX,mouseY);
  flowers[0] = a;
}

function keyPressed() {
  if (key == " ") {
    noiseSeed(millis());
  }

  if (key == "f") {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  if (key == "c") {
    clear();
  }

  if (key == "s") {
    saveCanvas("SeaFlowers", "png");
  }
}
