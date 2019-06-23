var serial; // variable to hold an instance of the serialport library
var portName = "COM4"; // fill in your serial port name here

var speedValue;
var directionRocket;
var joystickXValue;
var joystickYValue;
var rocketOneToggle;
var rocketTwoToggle;
var rocketThreeToggle;
var rocketOneButton;
var rocketTwoButton;
var rocketThreeButton;
var startButton;
var confirmButton;

var xPlayer;
var yPlayer;
var rotation;
var readyPlayer;
var firePlayer;
var pointsPlayer;
var bulletsPlayer;
var heartsPlayer;

var wins;
var gameState;

var fireLeftRocket;
var fireAnimLeftRocket;
var fireRightRocket;
var fireAnimRightRocket;
var fireCenterRocket;
var fireAnimCenterRocket;
var smoke;
var smokeAnim;

//the scene is twice the size of the canvas
var SCENE_W = 3500;
var SCENE_H = 6000;

function preload() {
  fontTitle = loadFont("assets/nasalization-rg.ttf");
  fontOther = loadFont("assets/nasalization-rg.ttf");

  fireAnimLeftRocket = loadAnimation(
    "assets/Feuer_links_1.png",
    "assets/Feuer_links_2.png"
  );

  fireAnimRightRocket = loadAnimation(
    "assets/Feuer_rechts_1.png",
    "assets/Feuer_rechts_2.png"
  );

  fireAnimCenterRocket = loadAnimation(
    "assets/Feuer_mitte_1.png",
    "assets/Feuer_mitte_2.png"
  );

  smokeAnim = loadAnimation(
    "assets/Rauch_vorne_1.png",
    "assets/Rauch_mitte_1.png",
    "assets/Rauch_hinten_1.png"
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on("list", printList); // set a callback function for the serialport list event
  serial.on("connected", serverConnected); // callback for connecting to the server
  serial.on("open", portOpen); // callback for the port opening
  serial.on("data", serialEvent); // callback for when new data arrives
  serial.on("error", serialError); // callback for errors
  serial.on("close", portClose); // callback for the port closing
  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port

  gameState = 0;
  wins = 5;

  world = createSprite(+960, -4290, SCENE_W, SCENE_H);
  worldImage = loadImage("assets/Background_maße.png");
  world.addImage(worldImage);

  //Player
  readyPlayer = false;
  player = createSprite(0, 0, 100, 450);
  Rocket = loadImage("assets/FullRocket.png");
  player.addImage(Rocket);
  player.rotation = 0;

  xPlayer = windowWidth / 2;
  yPlayer = windowHeight + 275;
  pointsPlayer = 0;
  bulletsPlayer = new Group();

  fireLeftRocket = new Group();
  fireRightRocket = new Group();
  fireCenterRocket = new Group();
  smoke = new Group();
}

function draw() {
  // GAME STATE 0 ----- START SCREEN ----- -----
  if (gameState == 0) {
    background("black");

    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    textFont(fontTitle);
    text(
      "Willkommen im Astronautenprogramm und zu deinem ersten Flug ins All. \n  Drücke Start um deine Reise ins All zu beginnen.",
      windowWidth / 2,
      windowHeight / 3
    );

    fill(255);
    textSize(15);
    textFont(fontOther);
    text("Instructions", windowWidth / 2, windowHeight / 2);

    textSize(15);
    text("- Use the joystick to move", windowWidth / 2, windowHeight / 1.8);
    text(
      "- Press the blue button to reload",
      windowWidth / 2,
      windowHeight / 1.7
    );
    text(
      "- Press the red button to reload",
      windowWidth / 2,
      windowHeight / 1.6
    );

    textSize(15);
    text(
      "To ready up, press the blue button.",
      windowWidth / 2,
      windowHeight / 1.4
    );

    //image(Rocket, windowWidth / 2, windowHeight / 2);

    if (pointsPlayer != 0) {
      pointsPlayer = 0;
      readyPlayer = false;
      // console.log(pointsPlayer);
    }

    if (readyPlayer) {
      text("Ready!", 120, windowHeight - 200);
      // console.log("readyPlayer");
    }

    if (confirmButton == 1) {
      readyPlayer = true;
      gameState = 1;
      // console.log(gameState);
    }
  }

  // GAME STATE 1 ----- GAME PLAY ----- -----
  if (gameState == 1) {
    background("red");
    drawSprites(world);

    drawSprites();
    camera.off();

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Um für deine erste Reise ins All gut vorbereitet zu sein, \n musst du genügend Sauerstoff und Treibstoff tanken. \n Da die Tragkraft begrenzt ist, darfst du nicht mehr als insgesamt 500kg mitnehmen. \n Bestätige, wenn du die Rakete fertig getankt hast. ",
      windowWidth / 2,
      windowHeight / 3
    );

    // Player 1 Location
    player.position.x = xPlayer;
    player.position.y = yPlayer;

    // Player Shooting @@@@@@@@@@@
    if (keyWentDown("c")) {
      console.log("1 shoot");
      var bulletPlayer = createSprite(
        player.position.x,
        player.position.y,
        10,
        10
      );
      bulletPlayer.setSpeed(10 + player.getSpeed(), player.rotation);
      bulletPlayer.life = 160;
      bulletPlayer.shapeColor = "black";
      bulletsPlayer.add(bulletPlayer);
    }

    if (yPlayer < -1920) {
      // constant downward speed
      // (i.e., gravity)
      player.addSpeed(0.25, 90);
    }

    if (speedValue > 1 && speedValue < 20) {
      fireLeftRocket = createSprite(xPlayer - 23, yPlayer + 209, 10, 10);
      fireLeftRocket.addAnimation("default", fireAnimLeftRocket);
      fireLeftRocket.life = 2;

      fireRightRocket = createSprite(xPlayer + 24, yPlayer + 210, 10, 10);
      fireRightRocket.addAnimation("default", fireAnimRightRocket);
      fireRightRocket.life = 2;

      fireCenterRocket = createSprite(xPlayer + 1, yPlayer + 216, 10, 10);
      fireCenterRocket.addAnimation("default", fireAnimCenterRocket);
      fireCenterRocket.life = 2;

      smoke = createSprite(xPlayer, yPlayer + 250, 10, 10);
      smoke.addAnimation("default", smokeAnim);
      smoke.life = 2;
    }
    // constant downward speed
    // (i.e., gravity)

    // Update Values
    updateValues();

    //set the camera position to the ghost position
    camera.position.x = player.velocity.x + windowWidth / 2;
    camera.position.y = player.velocity.y + windowHeight - 200;

    camera.zoom = 0.5;

    //map borders - Game Over
    if (player.velocity.x > 3500) {
      gameState = 2;
    }
    if (player.velocity.x < -3500) {
      gameState = 2;
    }
    if (player.velocity.y < -12000) {
      gameState = 2;
    }
  }

  // GAME STATE 2 ----- GAME OVER ----- -----

  if (gameState == 2) {
    background("black");

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Gut gemacht! Die Rakete ist nun betankt. Jetzt ist alles bereit. Nicht nervös werden, wir begleiten dich auf deiner Reise. \n Bist du bereit für dein größtes Abenteuer? Sehr gut, dann beginne nun mit der Starteinleitung. Viel Erfolg!",
      windowWidth / 2,
      windowHeight / 3
    );

    textFont(fontOther);
    textSize(200);

    fill("black");
    textSize(15);
    text(
      "To restart, press the blue button.",
      windowWidth / 4,
      windowHeight / 2 + 80
    );

    if (startButton == 1) {
      readyPlayer = false;
      gameState = 0;
    }
  }
  textAlign(LEFT);
  //ellipse(joystickXValue, joystickYValue, 50, 50); // draw the circle
  text("Joystick X: " + joystickXValue, 30, 30);
  text("Joystick Y: " + joystickYValue, 30, 45);
  text("Geschwindigkeit: " + speedValue, 30, 60);
  text("Triebwerk 1: " + rocketOneToggle, 30, 75);
  text("Triebwerk 2: " + rocketTwoToggle, 30, 90);
  text("Triebwerk 3: " + rocketThreeToggle, 30, 105);
  text("Button Triebwerk 1: " + rocketOneButton, 30, 120);
  text("Button Triebwerk 2: " + rocketTwoButton, 30, 135);
  text("Button Triebwerk 3: " + rocketThreeButton, 30, 150);
  text("Start: " + startButton, 30, 165);
  text("Bestätigen: " + confirmButton, 30, 180);
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  var inString = serial.readStringUntil("\r\n");
  //check to see that there's actually a string there:
  if (inString.length >= 0) {
    if (inString !== "hello") {
      var sensors = split(inString, ","); // split the string on the commas
      if (sensors.length >= 2) {
        // if there are three elements
        joystickYValue = map(sensors[0], 0, 1023, 0, width); // element 0 is the locH
        joystickXValue = map(sensors[1], 0, 1023, 0, height); // element 1 is the locV
        speedValue = map(sensors[2], 0, 1023, 0, 1023);
        rocketOneToggle = map(sensors[3], 0, 1, 0, 1);
        rocketTwoToggle = map(sensors[4], 0, 1, 0, 1);
        rocketThreeToggle = map(sensors[5], 0, 1, 0, 1);
        rocketOneButton = map(sensors[6], 0, 1, 0, 1);
        rocketTwoButton = map(sensors[7], 0, 1, 0, 1);
        rocketThreeButton = map(sensors[8], 0, 1, 0, 1);
        startButton = map(sensors[9], 0, 1, 0, 1);
        confirmButton = map(sensors[10], 0, 1, 0, 1);
      }
    }
    serial.write("x"); // send a byte requesting more serial data
  }
}

function updateValues() {
  // update sketch.js variables with sensor data
  console.log(player.rotation);

  // Rotation

  // Linke Ausrichtung
  if (joystickXValue < 400) {
    player.rotation -= 2;
  }

  // Rechte Ausrichtung
  if (joystickXValue > 600) {
    player.rotation += 2;
  }

  //Movement

  if (speedValue > 10) {
    player.addSpeed(speedValue / 10, player.rotation + 270);
  }
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function serverConnected() {
  console.log("connected to server.");
}

function portOpen() {
  console.log("the serial port opened.");
}

function serialError(err) {
  console.log("Something went wrong with the serial port. " + err);
}

function portClose() {
  console.log("The serial port closed.");
}
