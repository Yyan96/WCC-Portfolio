//TURN OFF AUTO-REFRESH NOW !!!
//From: https://api.openaq.org
//reference:[1] https://www.youtube.com/watch?v=5-ptp9tRApM&t=228s
//[2]: codeExample——https://learn.gold.ac.uk/course/view.php?id=24276#section-6

/*Shanghai,China*/

let airData;
let loading = true;
let url =
  "https://api.openaq.org/v2/measurements?location_id=7743&parameter=pm25&date_from=2023-02-11T00:00:00Z&date_to=2023-02-12T00:00:00Z&limit=1000";

let colX,colY;

function setup() {
  createCanvas(600, 600);

  //HAVE YOU TURNED OFF AUTO-REFRESH?

  // perform request
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Got data");
      console.log(data);
      //HAVE YOU TURNED OFF AUTO-REFRESH?

      airData = data;
      loading = false;
    })
    .catch(function (err) {
      console.log(`Something went wrong: ${err}`);
    });
}

function draw() {
  textAlign(CENTER);
  background(255);

  fill(0);

  if (loading) {
    // loading screen
    textSize(30);
    text("Loading...", 0, height / 2 - 25, width, 50);
  } else {
    //display using the simple line-graph code
    //HAVE YOU TURNED OFF AUTO-REFRESH?
    drawChar();
  }
}

function drawChar() {
  
  //value column
  // calculate min and max
  let maxPM = 0;
  let minPM = 0;
  for (let i = 0; i < airData.results.length; i++) {
    if (airData.results[i].value > maxPM) {
      maxPM = airData.results[i].value;
    }
    if (airData.results[i].value < minPM) {
      minPM = airData.results[i].value;
    }
  }

  let pmStep = 5;
  maxPM = Math.ceil(maxPM / pmStep) * pmStep; //always round up the max temp to the next step in chart
  minPM = Math.floor(minPM / pmStep) * pmStep; //always round down the min temp to the next step in chart

  let colWidth = width / (airData.results.length+2); //add 2 so there is space either side of the chart
  let colHeight = height / 1.15- colWidth * 2;

  // Display temp labels
  for (let PM = minPM; PM <= maxPM; PM += pmStep) {
    let pmY = map(PM, minPM, maxPM, colHeight, colWidth);

    fill(0);
    textAlign(RIGHT);
    push();
    translate(colWidth, pmY);
    textSize(10);
    text(PM, -10, 40);
    pop();
  }
 
  
  // time line
  for (let i = 0; i < airData.results.length; i++) {
    let item = airData.results[i];

    let TimeX = map(i, 0, airData.results.length, colWidth, width); //map range includes the space on either side

    let time = new Date(item.date.local);
    let timeString = time.toDateString().split(" "); //splits on space
    //console.log(timeString); //logs out array
    timeString.pop(); //discards the year because why not, you could add this to the chart title
    timeString = timeString.join(" "); // uses javascript array join functionatlity

    fill(0);
    textAlign(LEFT, BOTTOM);
    push();
    translate(TimeX, height/1.15);
    rotate(45);
    textSize(8);
    text(timeString, 10, 10);
    pop();
  }

  push();
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(80);
  text("Feb.11  PM 2.5 "+airData.results[0].location, 300, 50);
  pop();
  
  //draw PM column
  for (let i = 0; i < airData.results.length; i++) {
    let item = airData.results[i];

    colX = map(i, 0, airData.results.length, colWidth, width); //map range includes the space on either side
    colY = map(item.value, minPM, maxPM, colWidth, colHeight); //inverse mapping because our origin in p5 is in the top left
    rectMode(CORNER);
    let b = map(item.value, minPM, maxPM, 0, 255);
    fill(120, 140, b * 1.5, 150);
    noStroke();
    rect(colX, height / 1.15, 10, -colY);
   
  }
}
