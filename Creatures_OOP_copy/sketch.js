/**
 * KEYS
 *FEED          : feed food
 *slider        : change food colour
 *ADD           : add creature
 **/

//Main sketch below
// an array to store the creatures
let creatures = [];
let food = [];

// let button;
// let slider;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  for (let i = 0; i < 20; i++) {
    let c = new Creature(random(width), random(height));
    creatures.push(c);
  }

  addGUI();
}

function draw() {
  background(200);
  background(6, 67, 111, 210);

  // loop through all the creatrure and animate them each frame by accessing their update function
  for (let c of creatures) {
    c.update();

    if (food.length > 0) {
      if (c.moveToFood(food[food.length - 1].x, food[food.length - 1].y)) {
        //You will need to think about
        //a) managing food in the main sketch
        //b) keeping track of FED or FULL state in your creature class
        food.pop();

        console.log("Arrived");
      }
    }
  }

  updateFood();

  if (button.hasClass("inactive") && food.length == 0) {
    button.html("FEED");
    button.removeClass("inactive");
  }
}

function updateFood() {
  for (let i = food.length - 1; i >= 0; i--) {
    fill(207, slider.value(), 185);
    circle(food[i].x, food[i].y, food[i].d);
    food[i].y += 1;
    if (food[i].y > height) {
      food.splice(i, 1); //remove one from array at index i
    }
  }
}

function addGUI() {
  //add sliders
  slider = createSlider(0, 255, 0, 1);
  slider.addClass("slider");

  //Add the slider to the parent gui HTML element
  slider.parent("gui-container");

  //add a button
  button = createButton("FEED");
  button1 = createButton("ADD");

  button.addClass("button");
  button1.addClass("button");
  button1.position(140);

  //Add the play button to the parent gui HTML element
  button.parent("gui-container");
  button1.parent("gui-container");

  //Adding a mouse pressed event listener to the button
  //feed food
  button.mousePressed(handleButtonPress);
  //add creature
  button1.mousePressed(addCreature);
  button1.mouseReleased(stopAdding);
}

function handleButtonPress() {
  if (food.length == 0 && !button.hasClass("inactive")) {
    food.push({
      x: random(width),
      y: random(height / 2),
      d: random(5, 20),
    });
  }

  if (food.length > 0) {
    button.html("FEEDING");
    button.addClass("inactive");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addCreature() {
  creatures.push(new Creature(width / 2, height / 2));

  button1.html("ADDING");
  button1.addClass("inactive");
}

function stopAdding() {
  button1.html("ADD");
  button1.removeClass("inactive");
}
