class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    translate(this.x, this.y);
    fill(211, 229, 239, 150);
    for (let i = 0; i < 10; i++) {
      ellipse(0, 18, 10, 30);
      rotate(PI/5);
    }
  }
}
