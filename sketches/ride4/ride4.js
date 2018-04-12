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
  drawWaves();
  pop();

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
