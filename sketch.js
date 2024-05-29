let circles = [];
let bgGraphics; // Variable to store the static background

//Defines a Circle class for creating and managing circular objects
class Circle {
  //Constructor that initializes the coordinates, size and type of the circle.
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.growing = true; // Add a growing property to control the animation
  }

  draw() {
    //Randomly generate an integer that determines the number of layers of the circle
    let numLayers = int(random(3, 6));
    //Loop through each layer
    for (let i = numLayers; i > 0; i--) {
      //Calculates the size of the current layer
      let size = (this.size / numLayers) * i;
      //create gradient color
      let gradientColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numLayers);
      //Randomly decide whether to fill or stroke
      if (random() > 0.5) {
        fill(gradientColor);
        noStroke();
      } else {
        noFill();
        stroke(gradientColor);
        strokeWeight(2);
      }
      //Draw the circle of the current layer
      ellipse(this.x, this.y, size, size);
      //Draw the pattern of the current layer
      this.drawPattern(size);
    }
  }

  drawPattern(diameter) {
    //A random integer is generated to determine the number of patterns
    let numPatterns = int(random(10, 20));
    //Draw each pattern in a loop
    for (let i = 0; i < numPatterns; i++) {
      //Calculate the Angle of the current pattern
      let angle = map(i, 0, numPatterns, 0, TWO_PI);
      //Calculate the X-coordinate of the current pattern
      let px = this.x + (diameter / 2) * cos(angle);
      //Calculate the Y-coordinate of the current pattern
      let py = this.y + (diameter / 2) * sin(angle);
      //Generate the color of the pattern
      let shapeColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numPatterns);
      //Set fill color
      fill(shapeColor);
      //Draw different patterns according to the type
      switch (this.type) {
        case 0:
          //Ellipse
          ellipse(px, py, diameter / 10, diameter / 10);
          break;
        case 1:
          //Rectangle
          rectMode(CENTER);
          rect(px, py, diameter / 10, diameter / 10);
          break;
        case 2:
          //Line
          stroke(shapeColor);
          line(this.x, this.y, px, py);
          noStroke();
          break;
        case 3:
          //Polygon
          drawPolygon(px, py, diameter / 20, 6);
          break;
      }
    }
  }

  // Update the circle size for animation
  update() {
    if (this.growing) {
      this.size += 0.5; // Reduce the growth rate
      if (this.size > 200) {
        this.growing = false;
      }
    } else {
      this.size -= 0.5; // Reduce the shrink rate
      if (this.size < 50) {
        this.growing = true;
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  frameRate(15); // Set a lower frame rate for slower animation
  bgGraphics = createGraphics(windowWidth, windowHeight); // Create an off-screen graphics buffer
  drawBackgroundPattern(); // Draw the background pattern once
}

function draw() {
  image(bgGraphics, 0, 0); // Draw the static background from the buffer
  for (let circle of circles) {
    circle.update();
    circle.draw();
  }
}

// Defines the background pattern
function drawBackgroundPattern() {
  bgGraphics.background(20, 10, 0);
  let bgCircles = 100;
  for (let i = 0; i < bgCircles; i++) {
    bgGraphics.noStroke(); // Ensure no stroke for background circles
    bgGraphics.fill(randomWarmColor(50));
    bgGraphics.ellipse(random(width), random(height), random(50, 150));
  }
}

// Create a circle that does not overlap
function createNonOverlappingCircle(maxSize) {
  let attempts = 0;
  let maxAttempts = 1000;

  while (attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    let circle = new Circle(x, y, maxSize, int(random(4)));

    let overlapping = false;
    for (let c of circles) {
      let d = dist(x, y, c.x, c.y);
      if (d < (c.size / 2 + circle.size / 2)) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      return circle;
    }

    attempts++;
  }

  return null;
}

// Draw polygon
function drawPolygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Generate random warm colors
function randomWarmColor(alpha) {
  let colors = [
    color(255, 102, 102, alpha),
    color(255, 178, 102, alpha),
    color(255, 255, 102, alpha),
    color(255, 153, 102, alpha),
    color(255, 204, 153, alpha)
  ];
  return colors[int(random(colors.length))];
}

// Add event listener for mouse and keyboard interactions
function mousePressed() {
  let maxSize = random(100, 200);
  let newCircle = createNonOverlappingCircle(maxSize);
  if (newCircle) {
    circles.push(newCircle);
  }
}

function keyPressed() {
  if (key === ' ') {
    circles = []; // Clear circles when spacebar is pressed
  }
}