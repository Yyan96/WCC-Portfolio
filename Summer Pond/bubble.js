let palette = [
  "#1c7e9f",
  "#0072ab",
  "#003f88",
  "#22406a",
  "#fefbf6",
  "#5cbcb9",
  "#e6cf7a",
  "#bf3b53",
];

class Bubble {
  constructor(x, y) {
    this.pos = createVector(random(windowWidth), random(windowHeight));
    this.prev = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.size = random(5, 10);
    this.angle = random(TAU);
    this.targetAngle = atan2(
      this.pos.y - this.prev.y,
      this.pos.x - this.prev.x
    );

    let c1 = random(palette);
    this.color = c1;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle += (this.targetAngle - this.angle) * 0.05;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(255, 248, 222, 20);
    for (const side of [-1, 1]) {
      push();
      rotate(PI + PI / 2 + side * PI * 0.1);
      ellipse(0, -15, this.size, this.size * 4);
      pop();
    }
    pop();
    
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);

    this.prev.x = this.pos.x;
    this.prev.y = this.pos.y;
    this.angle += (this.targetAngle - this.angle) * 0.05;
  }

  attracted(target) {
    // var dir = target - this.pos
    var force = p5.Vector.sub(target, this.pos);
    var d = force.mag();
    d = constrain(d, 1, 25);
    var G = 50;
    var strength = G / (d * d);
    force.setMag(strength);
    if (d < 20) {
      force.mult(-10);
    }
    this.acc.add(force);
  }

  checkEdges() {
    if (this.pos.x > windowWidth) {
      this.pos.x = 0;
      this.pos.copy.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = windowWidth;
      this.pos.copy.x = windowWidth;
    }
    if (this.pos.y > windowHeight) {
      this.pos.y = 0;
      this.pos.copy.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = windowHeight;
      this.pos.copy.y = windowHeight;
    }
  }
}
