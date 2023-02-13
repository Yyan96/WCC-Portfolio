//TURN OFF AUTO-REFRESH NOW !!!
//From: https://api.openaq.org
//reference:[1] https://www.youtube.com/watch?v=5-ptp9tRApM&t=228s
//[2]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString

/*Shanghai,China*/

let airData;
let loading = true;
let url =
  "https://api.openaq.org/v2/measurements?location_id=7743&parameter=pm25&date_from=2023-02-11T00:00:00Z&date_to=2023-02-12T00:00:00Z&limit=1000";

let colX, colY;

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
   
    drawData(airData.results.value);
  }
}

function drawData() {
  
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(80);
  text("Feb.11  PM 2.5 " + airData.results[0].location, 300, 50);
  
  noStroke();
  
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
  
  let colWidth = width / airData.results.length;
  let colHeight = height / 1.15 - colWidth * 2;
 
  for (let i = 0; i < airData.results.length; i++) {
    let item = airData.results[i];
    colX = map(i, 0, airData.results.length, colWidth, width); //map range includes the space on either side
    colY = map(item.value, minPM, maxPM, colWidth, colHeight); //inverse mapping because our origin in p5 is in the top left

    let b = map(item.value, minPM, maxPM, 0, 255);
    fill(120, 140, b, 150);

    for (let j = 0; j < airData.results.length; j++) {
      colX = map(j, 0, airData.results.length, colWidth, width);
      ellipse(colX, colY, random(colY * 0.1));
    }
  noLoop();
  }
}
