let palette1 = [
  "#a4c9cc",
  "#5491b9",
  "#296fab",
  "#006cd87",
  "#6caf7a",
];

function Particle() {
  this.pos = createVector(random(windowWidth), random(windowHeight));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 2;
  let c = random(palette1);
  this.color = c;

  this.prevPos = this.pos.copy();

  this.follow = function (vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  };

  this.update = function () {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.show = function () {
    stroke(c);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    this.updatePrev();
  };

  this.updatePrev = function () {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };
  this.edges = function () {
    if (this.pos.x > windowWidth) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = windowWidth;
      this.updatePrev();
    }
    if (this.pos.y > windowHeight) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = windowHeight;
      this.updatePrev();
    }
  };
}
