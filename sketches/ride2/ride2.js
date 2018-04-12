/* Variable sketch: Circles */
// var tileCount = 10;
let circleAlpha = 130;
let circleColor;
let size = 1;
/* end sketch: Circles */

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

/* start of sketch: Circles */
  thickness = 1;

/* end of sketch: Circles */
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
    drawCircles();
  pop();

}

/* start draw sketch: Circles */
function drawCircles() {
  push();
  background(40);
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
