// Defines an empty array circles to store all created circular objects.
let circles = [];

// Variable to store the static background
let bgGraphics;

// Defines a Circle class for creating and managing circular objects
class Circle {
  // Constructor that initializes the coordinates, size and type of the circle
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    // Add a growing property to control the animation
    this.growing = true;
  }

  // Method to draw the circle with multiple layers and patterns
  draw() {
    // Randomly generate an integer that determines the number of layers of the circle
    let numLayers = int(random(3, 6));
    // Loop through each layer
    for (let i = numLayers; i > 0; i--) {
      // Calculates the size of the current layer
      let size = (this.size / numLayers) * i;
      // Create gradient color
      let gradientColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numLayers);
      // Randomly decide whether to fill or stroke
      if (random() > 0.5) {
        fill(gradientColor);
        noStroke();
      } else {
        noFill();
        stroke(gradientColor);
        strokeWeight(2);
      }

      // Draw the circle of the current layer
      ellipse(this.x, this.y, size, size);
      // Draw the pattern of the current layer
      this.drawPattern(size);
    }
  }

  // Method to draw patterns within the circle
  drawPattern(diameter) {
    // A random integer is generated to determine the number of patterns
    let numPatterns = int(random(10, 20));
    // Draw each pattern in a loop
    for (let i = 0; i < numPatterns; i++) {
      // Calculate the Angle of the current pattern
      let angle = map(i, 0, numPatterns, 0, TWO_PI);
      // Calculate the X-coordinate of the current pattern
      let px = this.x + (diameter / 2) * cos(angle);
      // Calculate the Y-coordinate of the current pattern
      let py = this.y + (diameter / 2) * sin(angle);
      // Generate the color of the pattern
      let shapeColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numPatterns);
      // Set fill color
      fill(shapeColor);
      // Draw different patterns according to the type
      switch (this.type) {
        case 0:
          // Ellipse
          ellipse(px, py, diameter / 10, diameter / 10);
          break;
        case 1:
          // Rectangle
          rectMode(CENTER);
          rect(px, py, diameter / 10, diameter / 10);
          break;
        case 2:
          // Line
          stroke(shapeColor);
          line(this.x, this.y, px, py);
          noStroke();
          break;
        case 3:
          // Polygon
          drawPolygon(px, py, diameter / 20, 6);
          break;
      }
    }
  }

  // Update the circle size for animation
  update() {
    if (this.growing) {
      // Increase size if growing
      this.size += 0.5;
      // Check if size exceeds maximum
      if (this.size > 200) {
        // Stop growing
        this.growing = false;
      }
    } else {
      // Decrease size if not growing
      this.size -= 0.5;
      // Check if size falls below minimum
      if (this.size < 50) {
        // Start growing again
        this.growing = true;
      }
    }
  }
}

// Setup function for initial canvas setup and configuration
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // Set frame rate
  // This technique is from https://p5js.org/reference/#/p5/frameRate
  frameRate(15);
  // Create an off-screen graphics buffer
  bgGraphics = createGraphics(windowWidth, windowHeight);
  // Draw the background pattern once
  drawBackgroundPattern();
}

// Draw function to render the circles and background pattern
function draw() {
  // Draw the static background from the buffer
  image(bgGraphics, 0, 0);
  // Loop through each circle in the circles array
  for (let circle of circles) {
    // Update the circle's size
    circle.update();
    // Draw the circle
    circle.draw();
  }
}

// Defines the background pattern
function drawBackgroundPattern() {
  // Set background color for the buffer
  bgGraphics.background(20, 10, 0);
  // Define the number of background circles
  let bgCircles = 100;

  // Loop to draw the background circle
  for (let i = 0; i < bgCircles; i++) {
    // Ensure no stroke for background circles
    bgGraphics.noStroke();
    // Set random fill color
    bgGraphics.fill(randomWarmColor(50));
    // Draw background circle
    bgGraphics.ellipse(random(width), random(height), random(50, 150));
  }
}

// Create a circle that does not overlap
function createNonOverlappingCircle(maxSize) {
  // Number of initialization attempts
  let attempts = 0;
  // Number of maximum attempts
  let maxAttempts = 1000;

  // Try to create circles that do not overlap
  while (attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    // Create a new circle object
    let circle = new Circle(x, y, maxSize, int(random(4)));

    // Initialize the overlap
    let overlapping = false;
    // Check for overlaps with existing circles
    for (let c of circles) {
      // Calculate the distance from the center of the circle
      let d = dist(x, y, c.x, c.y);
      // Determine whether to overlap
      if (d < (c.size / 2 + circle.size / 2)) {
        // Set overlap flag if circles overlap
        overlapping = true;
        break;
      }
    }

    // If not, return a new circle
    if (!overlapping) {
      return circle;
    }

    // Increase the number of attempts
    attempts++;
  }

  // If a non-overlapping location cannot be found, null is returned
  return null;
}

// Draw polygon
// The principle of polygon generation is to establish the vertices and then connect the positions of each vertex to form a closed graph
// This technique is from https://p5js.org/reference/#/p5/beginShape
function drawPolygon(x, y, radius, npoints) {
  // Calculate the angle of each vertex
  let angle = TWO_PI / npoints;
  // Start drawing shapes
  beginShape();
  // Loop over each vertex
  for (let a = 0; a < TWO_PI; a += angle) {
    // X-coordinate of vertex
    let sx = x + cos(a) * radius;
    // Y-coordinate of vertex
    let sy = y + sin(a) * radius;
    // Add vertex to shape
    vertex(sx, sy);
  }
  // Finish drawing and closing the shape
  endShape(CLOSE);
}

// Generate random warm colors, alpha means the transparency level of a color(0-255)
// This technique is from https://p5js.org/reference/#/p5/alpha
function randomWarmColor(alpha) {
  // Define a set of warm colors
  let colors = [
    color(255, 102, 102, alpha),
    color(255, 178, 102, alpha),
    color(255, 255, 102, alpha),
    color(255, 153, 102, alpha),
    color(255, 204, 153, alpha)
  ];
  // Randomly return a warm color
  return colors[int(random(colors.length))];
}

// Add mouse interactions
function mousePressed() {
  // Random size for new circle
  let maxSize = random(100, 200);
  // Create a non-overlapping circle
  let newCircle = createNonOverlappingCircle(maxSize);
  if (newCircle) {
    // Add new circle to array
    circles.push(newCircle);
  }
}

// Add keyboard interactions
function keyPressed() {
  if (key === ' ') {
    // Clear circles when spacebar is pressed
    circles = [];
  }
}

// Function to handle window resize event
function windowResized() {
  // Resize canvas to new window dimensions
  resizeCanvas(windowWidth, windowHeight);
  // Recreate the off-screen graphics buffer with new dimensions
  bgGraphics = createGraphics(windowWidth, windowHeight);
  // Redraw the background pattern to fit new canvas size
  drawBackgroundPattern();
}
