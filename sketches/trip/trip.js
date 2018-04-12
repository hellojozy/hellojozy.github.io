/* Variable sketch: Circles */
// var tileCount = 10;
let circleAlpha = 130;
let circleColor;
let size = 1;
/* end sketch: Circles */

/* Variable sketch: Particles */
let orbs = [];
/* end sketch: Particles */

/* Variable sketch: Waves */

// ------ mesh ------
let tileCount;

// ------ noise ------
let noiseXRange;
let noiseYRange;

// ------ mesh coloring ------
let midColor;
let topColor;
let bottomColor;
let strokeColor;
let threshold;

/* end of sketch: Waves */

/* Variable control sketches */
var mode = 0;
var times = [180, 250, 420];
var timesIndex = 0;


function toggleSong(){
  console.log('toggleSong', song.isPlaying());
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}

function preload(){
  song = loadSound('assets/ride.mp3');
}


function setup() {
  createCanvas(1140,480, WEBGL);
  background(40);
  button = createButton('PLAY');
  button.position(620, 570);
  button.mousePressed(toggleSong);
  song.loop();
  fft = new p5.FFT();

/* start of sketch: Waves*/
   // ------ mesh ------
  tileCount = 40;
  zScale = 150;

  // ------ noise ------
  noiseXRange = 10;
  noiseYRange = 15;

  // ------ mesh coloring ------
  topColor = color(255,255,0);
  midColor = color(0,255,255);
  bottomColor = color(0, 0, 0);
  noStroke();
  threshold = 0.50;

  // ------ mouse interaction ------
  offsetX = 0;
  offsetY = 0;
  clickX = 0;
  clickY = 0;
/* end of sketch: Waves */

/* start of sketch: Circles */
  thickness = 1;

/* end of sketch: Circles */

/* start of sketch: Particles */
  for (var i = 0; i < 100; i++) {
    orbs[i] = new DrawOrbs();
  }
/* end of sketch: Particles */

}

let spectrum;
let lvlsflicker;

function update() {
  spectrum = fft.analyze();
  lvlsflicker = fft.getEnergy(2000);
}


function draw() {

  /* first take care of updates */
  update();

  /* then draw*/
  push();
  if(mode === 0) {
    background(40);
    drawParticles();
  } else if(mode === 1) {
    background(40);
    drawCircles();
  } else if(mode === 2) {
    drawFlicker();
    drawCircles();
    drawParticles();
  } else if(mode === 3) {
    drawWaves();
  }

  pop();

}


function keyPressed() {
  switch(key) {
    case('1'): mode = 0; break;
    case('2'): mode = 1; break;
    case('3'): mode = 2; break;
    case('4'): mode = 3; break;
  }
}

/* start draw sketch: Waves */

function drawWaves() {
  background(40);
  noStroke();

  // ------ set view ------
  push();

  if (keyIsDown(RIGHT_ARROW)) {
  noiseXRange += 1;
  }
  // ------ mesh noise ------
  else if (keyIsDown(LEFT_ARROW)) {
  noiseXRange -= 1;
  }
  else if (keyIsDown(UP_ARROW)){
  noiseYRange += 1;
  }
  else if (keyIsDown(DOWN_ARROW)){
  noiseYRange -= 1;
  }

  var noiseYMax = 0;
  var tileSizeY = height / tileCount;

  push();
  translate(offsetX, offsetY);

  for (var meshY = 0; meshY <= tileCount; meshY++) {
    beginShape(TRIANGLE_STRIP);
    for (var meshX = 0; meshX <= tileCount; meshX++) {

      var x = map(meshX, 0, tileCount, -width/2, width/2);
      var y = map(meshY, 0, tileCount, -height/2, height/2);

      var noiseX = map(meshX, 0, tileCount, 0, noiseXRange);
      var noiseY = map(meshY, 0, tileCount, 0, noiseYRange);
      var z = noise(noiseX, noiseY);

      noiseYMax = max(noiseYMax, z);
      var interColor;
      var amount;
      if (z <= threshold) {
        amount = map(z, 0, threshold, 0.15, 1);
        interColor = lerpColor(bottomColor, midColor, amount);
      }
      else {
        amount = map(z, threshold, noiseYMax, 0, 1);
        interColor = lerpColor(midColor, topColor, amount);
      }
      fill(random(400), random(300), 190);
      vertex(x, y, z*zScale);

    }
    endShape();
  }
  pop();
  pop();

}

/*end draw sketch: Waves */

/* start draw sketch: Flicker */
function drawFlicker(){

  if (lvlsflicker > 100){
    background(random(255));
  } else {
    background(40);
  }
}
/* end sketch: Flicker*/

/* start draw sketch: Circles */
function drawCircles() {
  push();
  translate(-width/2, -height/2);
  stroke(random(400), random(300), 190);
  strokeWeight(thickness);
  fill (64,64,64);

  if (keyIsDown(UP_ARROW)) {
  thickness += 0.2;
  }
  else if (keyIsDown(DOWN_ARROW)) {
  thickness -= 0.2;
  }

  let num = 5;
  translate(width/num * 0.5, height/num * 0.5);
  for (var gridY = 0; gridY < num; gridY++) {
    for (var gridX = 0; gridX < num; gridX++) {

      var posX = width / num * gridX;
      var posY = height / num * gridY;

      var shiftX = random(-1,mouseX) / 300;
      var shiftY = random(-1,10) / num;
      push();
      translate(posX + shiftX, posY + shiftY);
      // plane(size, size);
      sphere(size, 4, 4);
      pop();
    }

  }
  pop();

  /* increase size and make decisions */
  size += 0.5;
  if (size > 45) {
    size = 1;
  }
}

/* end draw sketch: Circles */

/* start draw sketch: Particles */
function drawParticles() {
    //   Orb (ellipse) figures that trail, used a for loop to run the code frequently.
    for (var i = 0; i < orbs.length; i++) {
//     Incorporated methods such as move and display for the orbs to move at a constant while being displayed in various colors.
    orbs[i].move();
    orbs[i].display();
  }

  if (lvlsflicker) {
    strokeWeight(4);
    stroke(random(255), random(20), 100);
    fill(0);
    push();
    translate(random(width), random(height));
    sphere(random(100), 5, 5);
    pop();
  }

}

// DrawOrbs function with assigned properties by using the word "this." and the variable following afterwards.
function DrawOrbs() {
  this.x = random(0, width);
  this.y = random(0, height);
  this.display = function() {
//   Prefered to use a stroke instead of a fill here since there is enough noise with both the moving orbs and the mouse.
  fill(random(400), random(300), 190);
  noStroke();
  push();
  translate(this.x, this.y);
  sphere(20, 10, 10);
  pop();
}
//   Again incorporating the use of assigned properties to make the orbs move back and forth and cling to each other. This creates the appearance of them spinning out of control for its x and y axis.
this.move = function() {
    this.x = this.x + random(-10, 10);
    this.y = this.y + random(-5, 5);
}

/* end sketch: Particles */


}
