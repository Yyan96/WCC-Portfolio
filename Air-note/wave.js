class Wave {
  constructor(x, y) {
    this.pos = new p5.Vector(
      x || random(-60, width + 60),
      y || random(-60, height + 60)
    );
    this.color = random(theme.colors);
    this.r = random(0.3, 1);

  }

  update() {
    const dir = noise(this.pos.x / scale, this.pos.y / scale) * TWO_PI * scale;
    
    push();
    this.pos.add(cos(dir) / 2 , sin(dir) / 2);
    pop();
    push();
    this.pos.add(cos(dir) / 2 , sin(dir) / 2 * a);
    pop();
    
    if (
      this.pos.x < -60 ||
      this.pos.x > width + 60 ||
      this.pos.y < -60 ||
      this.pos.y > height + 60
    )
      this.pos.set(random(-60, width + 60), random(-60, height + 60));
  }

  draw() {
    graphics.fill(this.color);
    graphics.circle(this.pos.x, this.pos.y, this.r);
  }
}
