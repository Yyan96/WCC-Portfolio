

// Create connection to Node.JS Server
const socket = io();

let canvas;

let roll = 0;
let pitch = 0;
let yaw = 0;

function setup() {
  // canvas = createCanvas(windowWidth, windowHeight, WEBGL);
 
  //createEasyCam();

  createCanvas(windowWidth, windowHeight);
  background('#fbf8f3')
}

function draw() {
  let count = int(random(100, 350));
	let r = random(2, 20);
	let delta = sqrt(dist(pmouseX, pmouseY, roll, yaw)) * 5;

	noStroke();
	 {
		for (let i = 0; i < count; i++) {
      translate(windowWidth/2, windowHeight/2);
			fill(random(frameCount % 255 + yaw), random(100, 255), pitch, random(40,200));
			ellipse(roll + random(-delta, delta), yaw + random(-delta, delta), r);
			r *= 0.9;
		}
	}
}

//process the incoming OSC message and use them for our sketch
function unpackOSC(message){

  /*-------------

  This sketch is set up to work with the gryosc app on the apple store.
  Use either the gyro OR the rrate to see the two different behaviors
  TASK: 
  Change the gyro address to whatever OSC app you are using to send data via OSC
  ---------------*/

  //maps phone rotation directly 
  // if(message.address == "/gyrosc/gyro"){
  //   roll = message.args[0]; 
  //   pitch = message.args[1];
  //   yaw = message.args[2];
  // }

  //uses the rotation rate to keep rotating in a certain direction
  if(message.address == "/gyrosc/rrate"){
    // roll += map(message.args[0],-3,3,-0.1,0.1);
    // pitch += map(message.args[1],-3,3,-0.1,0.1);
    // yaw += map(message.args[2],-3,3,-0.1,0.1);

  
    roll = map(message.args[0],-3,3,-windowWidth,windowWidth);
    pitch = map(message.args[1],-3,3,255,100);
    yaw = map(message.args[2],-3,3,-windowHeight,windowHeight);
  }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);

});