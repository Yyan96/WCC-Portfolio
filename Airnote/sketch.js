/**
 * Paint My Melody
 * 2023.04.19
 *
 * Refer: [1]https://editor.p5js.org/pixelfelt/sketches/oS5CwSbM1
 * [2]https://handsfreejs.netlify.app/ref/model/hands.html#with-defaults
 *[3]https://www.youtube.com/watch?v=MEYdsoZua7E&t=188s
 *[4]https://editor.p5js.org/Omnis/sketches/4f6R4-Tn9
 *
 * ----------
 *
 * How it works: Point both hands at the camera and touch the thumbs to the tips of the other fingers (same hand)to trigger the notes
 * - Keys
 * f            : Fullscreen
 * s            : Save images
 * - Buttons
 * Start Webcam            : Turn on the camera
 * Stop Webcam             : Turn off the camera
 */

// This will contain all of our watercolours
let waterCol = [];

// Water wave particles
const waves = [];
let scale, theme, graphics, themeWidth;

let bgm;
let songs = [];
let song, ra, pa;
let a = 0;

// This is like pmouseX and pmouseY...but for every finger [pointer, middle, ring, pinky]
let prevPointer = [
  // Left hand
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
  // Right hand
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
];
// Landmark indexes for fingertips [pointer, middle, ring, pinky]...these are the same for both hands
let fingertips = [8, 12, 16, 20];

function setup() {
  sketch = createCanvas(windowWidth, 640);
  background("#2d3263");

  //move our canvas inside this HTML element
  sketch.parent("sketch-container");
  addGUI();

  //Background texture
  paperTexture();

  // Default background articles
  drawWaves();

  // Default bgm volume
  bgm.loop();
  bgm.amp(0.1);

  // Colors for each fingertip
  colorMap = [
    // Left fingertips
    [color(245, 176, 38), color(224, 238, 235), color(0, 143, 151), color(115, 96, 152)],
    // Right fingertips
    [color(255, 65, 10), color(208, 171, 186), color(251, 241, 169), color(255, 191, 255)]
  ];
  
  // #1 Turn on some models (hand tracking) and the show debugger
  // @see https://handsfree.js.org/#quickstart-workflow
  handsfree = new Handsfree({
    showDebug: true, // Comment this out to hide the default webcam feed with landmarks
    hands: true,
    hands: {
      enabled: true,
      // The maximum number of hands to detect [0 - 4]
      maxNumHands: 2,

      // Minimum confidence [0 - 1] for a hand to be considered detected
      // Higher values are more robust at the expense of higher latency
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    },
  });
  handsfree.enablePlugins("browser");
  handsfree.plugin.pinchScroll.disable();
}

function preload() {
  songs[0] = loadSound("d3.mp3");
  bgm = loadSound("bgmmm.mp3");
}

function draw() {
  // Influence wave particle
  a++;
  a = a % 50;

  // Particle movement
  for (const p of waves) p.update();
  for (const p of waves) p.draw();
  image(graphics, 0, 0);

  // Draw watercolours and notes
  waterPaint();
  drawHands();
}

function waterPaint() {
  const hands = handsfree.data?.hands

  // Paint with fingers
  if (hands?.pinchState) {
    // Loop through each hand
    hands.pinchState.forEach((hand, handIndex) => {
      // Loop through each finger
      hand.forEach((state, finger) => {
        if (hands.landmarks?.[handIndex]?.[fingertips[finger]]) {
          
          // Landmarks are in percentage, so lets scale up
          let x = sketch.width - hands.landmarks[handIndex][fingertips[finger]].x * sketch.width
          let y = hands.landmarks[handIndex][fingertips[finger]].y * sketch.height

          // Start line on the spot that we pinched
          if (state === 'start') {
            prevPointer[handIndex][finger] = {x, y}
            waterCol.push([
              prevPointer[handIndex][finger].x,
              prevPointer[handIndex][finger].y,
              x,
              y,
              colorMap[handIndex][finger]
            ]);
            // Notes, rate is reversed to the X
            ra = map(prevPointer[handIndex][finger].x, 0.1, height, 0.5, 1.3);
            pa = map(prevPointer[handIndex][finger].x, 0.1, width, -1, 1);
            song = songs[0];
            song.rate(ra);
            song.pan(pa);
            song.amp(1);
            song.play();
          }

          // Set the last position
          prevPointer[handIndex][finger] = {x, y};          
        }
      })
    })  
  } 

  // // Clear everything if the left [0] pinky [3] is pinched
  // if (hands?.pinchState && hands.pinchState[0][3] === 'released') {
  //   waterCol = [];
  // }
  
  // Draw Paint
  waterCol.forEach(p => {
    //fill(p[4]);
    fill( p[4].levels[0] + random(-25, 25), p[4].levels[1] + random(-25, 25), p[4].levels[2] + random(-25, 25), 6);
    for (i = 0; i < 3; i++) {
      push();
      translate(p[0], p[1]);
      rotate(random(PI * 2));
      beginShape();
      for (m = 0; m < PI * 2; m += 1) {
        r = random(20, 50);
        let x = cos(m) * r;
        let y = sin(m) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    }
  });
}

function drawWaves() {
  // Give random colours to particles
  scale = random(8e2, 2e3);
  theme = random([
    {
      colors: [
        "#eee2c0",
        "#a2eef2",
        "#0058b5",
        "#0e98d5",
        "#535cbe",
        "#527ca8",
      ],
    },
  ]);
  for (let i = 0; i < 200; i++) waves.push(new Wave());

  // Output
  graphics = createGraphics(width, height);
  graphics.noStroke();
}

function drawHands() {
  const hands = handsfree.data?.hands;

  // Bail if we don't have anything to draw
  if (!hands?.landmarks) return;

  // Draw keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      // Set color
      // @see https://handsfree.js.org/ref/model/hands.html#data
      if (colorMap[handIndex]) {
        switch (landmarkIndex) {
          case 8:
            fill(colorMap[handIndex][0]);
            break;
          case 12:
            fill(colorMap[handIndex][1]);
            break;
          case 16:
            fill(colorMap[handIndex][2]);
            break;
          case 20:
            fill(colorMap[handIndex][3]);
            break;
        }
      }
    });
  });
}

function paperTexture() {
  noFill();
  stroke(255, 6);
  textureNum = (width * height) / 60;
  for (i = 0; i < textureNum; i++) {
    stroke(random(100, 150), random(100, 150), random(100, 150), 6);
    x = random(-width * 0.2, width * 1.2);
    y = random(-height * 0.2, height * 1.2);
    push();
    translate(x, y);
    strokeWeight(random(2, 5));
    point(0, 0);
    strokeWeight(1);
    rotate(random(PI * 2));
    curve(
      random(60, 220),
      0,
      0,
      random(-50, 50),
      random(-50, 50),
      random(60, 120),
      random(60, 120),
      random(60, 220)
    );
    pop();
  }
}

function addGUI() {
  // started-loading-and-stopped-states
  buttonStart = createButton('Start Webcam')
  buttonStart.class('handsfree-show-when-stopped')
  buttonStart.class('handsfree-hide-when-loading')
  buttonStart.mousePressed(() => handsfree.start())

  // Create a "loading..." button
  buttonLoading = createButton('...loading...')
  buttonLoading.class('handsfree-show-when-loading')

  // Create a stop button
  buttonStop = createButton('Stop Webcam')
  buttonStop.class('handsfree-show-when-started')
  buttonStop.mousePressed(() => handsfree.stop())

  //style
  buttonStart.addClass("button");
  buttonStop.addClass("button");
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("myMP", "jpg");
  }

  if (key === "f") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
