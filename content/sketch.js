var serial; // variable to hold an instance of the serialport library
var portName = "COM4"; // fill in your serial port name here

var speedValue;
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
var rotationPlayer;
var readyPlayer;
var firePlayer;
var pointsPlayer;
var bulletsPlayer;
var heartsPlayer;

var wins;
var gameState;

function preload() {
  fontTitle = loadFont("assets/spaceage.ttf");
  fontOther = loadFont("assets/spaceage.ttf");
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

  //Player
  readyPlayer = false;
  player = createSprite(400, 200, 50, 50);
  Rocket = loadImage("assets/FullRocket.png");
  player.addImage(Rocket);
  xPlayer = windowWidth / 2;
  yPlayer = windowHeight / 2;
  pointsPlayer = 0;
  bulletsPlayer = new Group();
}

function draw() {
  // GAME STATE 0 ----- START SCREEN ----- -----
  if (gameState == 0) {
    background("black");

    fill(255);
    textSize(20);
    textFont(fontTitle);
    text(
      "Willkommen im Astronautenprogramm und zu deinem ersten Flug ins All. \n  Drücke Start um deine Reise ins All zu beginnen.",
      windowWidth / 10,
      70
    );

    fill(255);
    textSize(15);
    textFont(fontOther);
    text("Instructions", windowWidth / 2 - 90, 180);
    rect(windowWidth / 2 - 300, 190, 600, 1);

    textSize(15);
    text("- Use the joystick to move", windowWidth / 4, 220);
    text("- Press the blue button to reload", windowWidth / 4, 250);
    text("- Press the red button to reload", windowWidth / 4, 290);

    textSize(15);
    text(
      "To ready up, press the blue button.",
      windowWidth / 4,
      windowHeight / 2
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

    if (keyWentDown("c")) {
      readyPlayer = true;
      gameState = 1;
      // console.log(gameState);
    }
  }

  // GAME STATE 1 ----- GAME PLAY ----- -----
  if (gameState == 1) {
    background("black");

    fill(255);
    textSize(20);
    textFont(fontTitle);
    text(
      "Um für deine erste Reise ins All gut vorbereitet zu sein musst du genug Sauerstoff und Treibstoff tanken. Da die Mengen begrenzt sind darfst du nicht mehr als insgesamt 500kg mitnehmen. Bestätige, wenn du die Rakete fertig getankt hast. ",
      windowWidth / 10,
      70
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

    // Update Values
    drawSprites();
    updateValues();
  }

  // GAME STATE 2 ----- GAME OVER ----- -----

  if (gameState == 2) {
    background("black");

    fill(255);
    textSize(80);
    textFont(fontTitle);
    text(
      "Gut gemacht! Die Rakete ist nun betankt. Jetzt ist alles bereit. Nicht nervös werden, wir begleiten dich auf deiner Reise. Bist du bereit für dein größtes Abenteuer? Sehr gut, dann beginne nun mit der Starteinleitung. Viel Erfolg!",
      windowWidth / 10,
      70
    );

    textFont(fontOther);
    textSize(200);

    fill("black");
    textSize(40);
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
        joystickXValue = map(sensors[0], 0, 1023, 0, width); // element 0 is the locH
        joystickYValue = map(sensors[1], 0, 1023, 0, height); // element 1 is the locV
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
  //> 0
  // < 180
  // down 90
  // up 270
  //// Player
  // X1
  //left
  if (joystickXValue < 470) {
    if (xPlayer > 90) {
      xPlayer -= 3;

      // console.log(x1);
    }
    // player1.rotation -= 4;
  } //right
  if (joystickXValue > 530) {
    if (xPlayer < windowWidth / 2 - 45) {
      xPlayer += 3;
      // console.log(x1);
    }
    // player1.rotation += 4;
  }

  // Y1
  //down
  if (joystickYValue > 530) {
    if (yPlayer < windowHeight - 90) {
      yPlayer += 3;
      // console.log(y1);
      // player1.addSpeed(-.2, player1.rotation);
      // console.log(player1.rotation);
    }
  } //up
  if (joystickYValue < 470) {
    if (yPlayer > 140) {
      yPlayer -= 3;
      // console.log(y1);
      // player1.addSpeed(.2, player1.rotation);
    }
  }
  // Rotation 1
  //up
  if (joystickYValue < 470) {
    // check up greater than 470, less than 530 -> between 470 and 530
    if (joystickXValue > 470) {
      // check not left
      if (joystickXValue < 530) {
        //check not right
        player.rotation = 270;
      }
    }
  }
  //down
  if (joystickYValue > 530) {
    // check down greater than 470, less than 530 -> between 470 and 530
    if (joystickXValue > 470) {
      // check not left
      if (joystickXValue < 530) {
        //check not right
        player.rotation = 90;
      }
    }
  }
  //right
  if (joystickXValue > 530) {
    // check right
    if (joystickYValue < 530) {
      //check not down
      if (joystickYValue > 470) {
        //check not up
        player.rotation = 0;
      }
    }
  }
  //left
  if (joystickXValue < 470) {
    // check right
    if (joystickYValue < 530) {
      //check not down
      if (joystickYValue > 470) {
        //check not up
        player.rotation = 180;
      }
    }
  }
  //top right
  if (joystickYValue < 470) {
    //up
    if (joystickXValue > 530) {
      //right
      player.rotation = 315;
    }
  }
  //bottom right
  if (joystickYValue > 530) {
    //up
    if (joystickXValue > 530) {
      //right
      player.rotation = 45;
    }
  }
  //bottom left
  if (joystickYValue > 530) {
    //down
    if (joystickXValue < 470) {
      //left
      player.rotation = 135;
    }
  }
  //top left
  if (joystickYValue < 470) {
    //up
    if (joystickXValue < 470) {
      //left
      player.rotation = 225;
    }
  }
}
// rotation1 = map(sensorR1, 0, 1023, -90, 90);
// player1.rotation = rotation1;

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
