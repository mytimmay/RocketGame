var serial; // variable to hold an instance of the serialport library
var portName = "COM4"; // fill in your serial port name here

var speedValue;
var directionRocket;
var joystickButtonValue;
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

var wins;
var gameState;
var GamePlayState;

var Treibstoff;
var Sauerstoff;
var Traglast;
var Tower;
var TowerBridge;

var TriebwerkLinks;
var TriebwerkRechts;
var TriebwerkMitte;

var TriebwerkLinks;
var TriebwerkRechts;
var TriebwerkMitte;

var TriebwerkLinksValue = false;
var TriebwerkRechtsValue = false;
var TriebwerkMitteValue = false;

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
  //Font
  fontTitle = loadFont("assets/font/lucida-console.ttf");
  fontOther = loadFont("assets/font/nasalization-rg.ttf");

  //Title Images
  Title_background = loadImage("assets/Title_Background.png");
  TitleImage = loadImage("assets/Title.png");
  astronautImage = loadImage("assets/Astronaut.png");

  //Interface-Text Images
  TitleTextImage = loadImage("assets/Interface_Text/Text_Title.png");
  TankTextImage = loadImage("assets/Interface_Text/Text_Tank.png");
  SpeedTextImage = loadImage("assets/Interface_Text/Speed.png");
  TankImage = loadImage("assets/Interface_Text/Tank.png");
  AbdockenTextImage = loadImage(
    "assets/Interface_Text/Text_Haltevorrichtung.png"
  );
  SchubTextImage = loadImage("assets/Interface_Text/Text_Schub.png");
  StartTextImage = loadImage("assets/Interface_Text/Text_Start.png");
  ToggleTextImage = loadImage("assets/Interface_Text/Text_Toggle.png");

  //Button Images
  Button_StartImage = loadImage("assets/Buttons/Button_Start.png");
  Button_ConfirmImage = loadImage("assets/Buttons/Button_Confirm.png");
  Button_RocketImage = loadImage("assets/Buttons/Button_Rocket.png");
  Button_SpeedImage = loadImage("assets/Buttons/Button_Speed.png");
  Button_ToggleImage = loadImage("assets/Buttons/Button_Toggle.png");
  Button_JoystickImage = loadImage("assets/Buttons/Joystick.png");

  //World Image
  worldImage = loadImage("assets/Final_Background_maße.jpg");

  //Player Image
  /*
  Rocket = loadAnimation(
    "assets/Rocket_Full.png",
    "assets/Rocket_Left.png",
    "assets/Rocket_Left_Right.png",
    "assets/FullRocket.png"
  );
  */
  Rocket = loadImage("assets/FullRocket.png");

  Rocket.looping = false;
  TriebwerkLinksImage = loadImage("assets/Triebwerk_links.png");
  TriebwerkRechtsImage = loadImage("assets/Triebwerk_rechts.png");
  TriebwerkMitteImage = loadImage("assets/Triebwerk_mitte.png");

  //Tower Image
  TowerImage = loadImage("assets/Tower.png");
  TowerBridgeImage = loadImage("assets/TowerBridge.png");

  //Animation
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

  //Set beginning Level to Titel with 0
  //or Choose other Levels
  //GameStates: Title, GamePlay, GameOver
  //GamePlayStates: Fuel, Abdocken, Schub, Toggle
  gameState = "GamePlay";
  GamePlayState = "Toggle";

  Sauerstoff = createSprite(windowWidth - 320, windowHeight - 185, 50, 50);
  Sauerstoff.shapeColor = color(27, 153, 56);

  Treibstoff = createSprite(windowWidth - 185, windowHeight - 185, 50, 50);
  Treibstoff.shapeColor = color(179, 56, 56);

  Tower = createSprite(windowWidth / 2 + 145, windowHeight - 42);
  Tower.addImage(TowerImage);
  TowerBridge = createSprite(windowWidth / 2 + 55, windowHeight - 135);
  TowerBridge.addImage(TowerBridgeImage);

  //World GameState 1
  world = createSprite(1000, -1550, SCENE_W, SCENE_H);
  world.addImage(worldImage);

  //Player
  readyPlayer = false;
  player = createSprite(0, 0, 100, 450);
  player.addImage(Rocket);
  player.rotation = 0;

  xPlayer = windowWidth / 2;
  yPlayer = windowHeight - 35;
  pointsPlayer = 0;

  TriebwerkLinks = createSprite(xPlayer, yPlayer, 100, 450);
  TriebwerkLinks.addImage(TriebwerkLinksImage);
  TriebwerkRechts = createSprite(xPlayer, yPlayer, 100, 450);
  TriebwerkRechts.addImage(TriebwerkRechtsImage);
  TriebwerkMitte = createSprite(xPlayer, yPlayer, 100, 450);
  TriebwerkMitte.addImage(TriebwerkMitteImage);

  fireLeftRocket = new Group();
  fireRightRocket = new Group();
  fireCenterRocket = new Group();
  smoke = new Group();
}

function draw() {
  // GAME STATE 0 ----- START SCREEN ----- -----
  if (gameState == "Title") {
    var Title = createSprite(windowWidth / 2, 300, 857, 461);
    Title.addImage(TitleImage);

    var TitleText = createSprite(windowWidth / 2, windowHeight - 250);
    TitleText.addImage(TitleTextImage);

    var Astronaut = createSprite(windowWidth - 200, windowHeight / 2);
    Astronaut.addImage(astronautImage);

    var Button_Start = createSprite(windowWidth / 2 - 250, windowHeight - 165);
    Button_Start.addImage(Button_StartImage);

    background(Title_background);

    drawSprite(Title);
    drawSprite(TitleText);
    drawSprite(Astronaut);
    drawSprite(Button_Start);

    fill(255);
    textSize(28);
    textLeading(45);
    textAlign(CENTER, CENTER);
    textFont(fontTitle);
    text(
      "Willkommen im Astronautenprogramm \nund zu deinem ersten Flug ins All.",
      windowWidth / 2,
      windowHeight - 330
    );
    textAlign(LEFT);
    text(
      "Drücke Start um deine \nReise ins All zu beginnen.",
      windowWidth / 2 - 150,
      windowHeight - 170
    );

    // NEXT LEVEL
    if (confirmButton == 1) {
      readyPlayer = true;
      gameState = "GamePlay";
      GamePlayState = "Fuel";
    }
  }

  // GAME STATE 1 ----- GAME PLAY ----- -----
  if (gameState == "GamePlay") {
    background("red");
    camera.zoom = 1;

    drawSprite(world);

    drawSprite(TowerBridge);
    drawSprite(Tower);
    drawSprite(player);
    drawSprite(TriebwerkLinks);
    drawSprite(TriebwerkRechts);
    drawSprite(TriebwerkMitte);
    camera.off();

    var Tank = createSprite(windowWidth - 250, windowHeight - 350);
    Tank.addImage(TankImage);
    var Speed = createSprite(windowWidth - 250, windowHeight - 700);
    Speed.addImage(SpeedTextImage);

    drawSprite(Tank);
    drawSprite(Speed);
    drawSprite(Sauerstoff);
    drawSprite(Treibstoff);

    fill(255);
    textSize(15);
    text(
      "Geschwindigkeit: " + speedValue + " m/s²",
      windowWidth - 385,
      windowHeight - 700
    );
    text("Treibstoff", windowWidth - 365, windowHeight - 130);
    text("Sauerstoff", windowWidth - 230, windowHeight - 130);
    text(
      "Aktuelle Traglast: " + Traglast + " Tonnen",
      windowWidth - 390,
      windowHeight / 2 - 20
    );
    text(
      "Max. Traglast: 1500 Tonnen",
      windowWidth - 390,
      windowHeight / 2 + 10
    );

    if (GamePlayState == "Fuel") {
      var TankText = createSprite(300, windowHeight / 2 - 50);
      TankText.addImage(TankTextImage);

      var Button_Joystick = createSprite(135, windowHeight / 2 + 10);
      Button_Joystick.addImage(Button_JoystickImage);

      var Button_Confirm = createSprite(135, windowHeight / 2 + 135);
      Button_Confirm.addImage(Button_ConfirmImage);

      drawSprite(TankText);
      drawSprite(Button_Joystick);
      drawSprite(Button_Confirm);

      //Update Treibstoff/Sauerstoff
      if (startButton == 1) {
        updateTreibstoff();
      }
      if (confirmButton == 1) {
        updateSauerstoff();
      }

      fill(255);
      textAlign(LEFT);
      textSize(20);
      textLeading(30);
      textFont(fontTitle);

      text(
        "Um für deine erste Reise ins All \ngut vorbereitet zu sein, musst du \ngenug Sauerstoff und Treibstoff \ntanken. Da die Traglast begrenzt \nist, darfst du das Gewicht von \n1500 Tonnen nicht überschreiten.",
        105,
        280
      );

      text(
        "Halte die blaue oder grüne \nTaste gedrückt und bewege \nden Joystick nach oben \noder unten um die Mengen \neinzustellen. Bestätige \ndeine Eingabe mit Druck \nauf den Joystick!",
        200,
        530
      );

      //NEXT LEVEL
      if (joystickButtonValue == 0) {
        GamePlayState = "Abdocken";
      }
    }

    if (GamePlayState == "Abdocken") {
      var AbdockenText = createSprite(300, windowHeight / 2 - 110);
      AbdockenText.addImage(AbdockenTextImage);

      var Button_Confirm = createSprite(145, windowHeight / 2);
      Button_Confirm.addImage(Button_ConfirmImage);

      drawSprite(AbdockenText);
      drawSprite(Button_Confirm);

      fill(255);
      textAlign(LEFT);
      textSize(20);
      textLeading(30);
      textFont(fontTitle);

      text(
        "Gut gemacht! Die Rakete ist nun \nbetankt. Jetzt ist alles bereit. \nNicht nervös werden, wir beglei-\nten dich auf deiner Reise. \nBist du bereit für dein bisher \ngrößtest Abenteuer? ",
        105,
        280
      );

      text(
        "Halte die Bestätigen-\nTaste gedrückt um die \nHaltevorrichtung ein-\nzufahren. Viel Erfolg!",
        220,
        500
      );

      //NEXT LEVEL
      if (startButton == 1) {
        if (TowerBridge.position.x < 1095) {
          TowerBridge.position.x++;
        }
        if (TowerBridge.position.x == 1095) {
          GamePlayState = "Schub";
        }
      }
    }

    if (GamePlayState == "Schub") {
      var SchubText = createSprite(300, windowHeight / 2 - 110);
      SchubText.addImage(SchubTextImage);

      var Button_Speed = createSprite(145, windowHeight / 2 - 30);
      Button_Speed.addImage(Button_SpeedImage);

      drawSprite(SchubText);
      drawSprite(Button_Speed);

      fill(255);
      textAlign(LEFT);
      textSize(20);
      textLeading(30);
      textFont(fontTitle);

      text("Super! Alle Maschinen sind nun \nbereit und startklar!", 105, 320);

      text("Baue Schub auf um zu \nStarten.", 230, 500);

      //NEXT LEVEL
      if (startButton == 1) {
        GamePlayState = "Toggle";
      }

      updateRocketPosition();
      updateTriebwerkLinksPosition();
      updateTriebwerkRechtsPosition();
      updateTriebwerkMittePosition();
    }

    if (GamePlayState == "Toggle") {
      var ToggleText = createSprite(300, windowHeight / 2 - 110);
      ToggleText.addImage(ToggleTextImage);

      var Button_Rocket = createSprite(135, windowHeight / 2 + 30);
      Button_Rocket.addImage(Button_RocketImage);
      var Button_Toggle = createSprite(135, windowHeight / 2 - 110);
      Button_Toggle.addImage(Button_ToggleImage);

      drawSprite(ToggleText);
      drawSprite(Button_Rocket);
      drawSprite(Button_Toggle);

      fill(255);
      textAlign(LEFT);
      textSize(20);
      textLeading(30);
      textFont(fontTitle);

      text(
        "Toller Start! Wir haben 1500m\nüberstiegen. Nun musst du die\nTriebwerke abwerfen.",
        110,
        250
      );

      text(
        "Entsichere zunächst die\nTriebwerke mithilfe\nder Kippschalter.\n\nDie Triebwerke sind nun\nzum Abwerfen bereit.\nAbwurf mit den roten\nKnöpfen bestätigen.",
        210,
        410
      );

      //NEXT LEVEL
      if (confirmButton == 1) {
        GamePlayState = "Schub";
      }

      updateRocketPosition();
      if (rocketOneButton != 1 && rocketOneToggle != 1) {
        updateTriebwerkLinksPosition();
      } else {
        updateTriebwerkLinksFall();
      }
      if (rocketTwoButton != 1 && rocketTwoToggle != 1) {
        updateTriebwerkRechtsPosition();
      } else {
        updateTriebwerkRechtsFall();
      }
      if (rocketThreeButton != 1 && rocketThreeToggle != 1) {
        updateTriebwerkMittePosition();
      } else {
        updateTriebwerkMitteFall();
      }
    }

    // Player Location
    player.position.x = xPlayer;
    player.position.y = yPlayer;

    TriebwerkLinks.position.x = player.position.x;
    TriebwerkLinks.position.y = player.position.y;
    TriebwerkRechts.position.x = player.position.x;
    TriebwerkRechts.position.y = player.position.y;
    TriebwerkMitte.position.x = player.position.x;
    TriebwerkMitte.position.y = player.position.y;

    // constant downward speed
    // (i.e., gravity)
    if (yPlayer < -1920) {
      //player.addSpeed(0.25, 90);
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

    // Update Values
    updateTraglast();

    //set the camera position to the ghost position
    camera.position.x = player.velocity.x + windowWidth / 2;
    camera.position.y = player.velocity.y + windowHeight - 200;

    //map borders - Game Over
    if (player.velocity.x > 1500) {
      gameState = "GameOver";
    }
    if (player.velocity.x < -1500) {
      gameState = "GameOver";
    }
    if (player.velocity.y < -5800) {
      gameState = "GameOver";
    }
  }

  // GAME STATE 2 ----- GAME OVER ----- -----

  if (gameState == "GameOver") {
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
  textSize(15);
  textFont(fontOther);
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
  text("JoystickButton: " + joystickButtonValue, 30, 195);
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
        joystickButtonValue = map(sensors[11], 0, 1, 0, 1);
      }
    }
    serial.write("x"); // send a byte requesting more serial data
  }
}

function updateTraglast() {
  Traglast = Treibstoff.height * 3 + Sauerstoff.height * 3;
}

function updateTreibstoff() {
  if (joystickYValue > 1200) {
    if (Treibstoff.height < 350) {
      if (Traglast <= 1494) {
        Treibstoff.height += 2;
        Treibstoff.position.y -= 1;
      }
    }
  }
  if (joystickYValue < 800) {
    if (Treibstoff.height > 20) {
      Treibstoff.height -= 2;
      Treibstoff.position.y += 1;
    }
  }
}

function updateSauerstoff() {
  if (joystickYValue > 1200) {
    if (Sauerstoff.height < 350) {
      if (Traglast <= 1494) {
        Sauerstoff.height += 2;
        Sauerstoff.position.y -= 1;
      }
    }
  }
  if (joystickYValue < 800) {
    if (Sauerstoff.height > 20) {
      Sauerstoff.height -= 2;
      Sauerstoff.position.y += 1;
    }
  }
}

function updateRocketPosition() {
  // Rotation
  // Linke Ausrichtung
  if (joystickXValue < 400) {
    player.rotation -= 0.5;
  }
  // Rechte Ausrichtung
  if (joystickXValue > 650) {
    player.rotation += 0.5;
  }
  //Movement
  if (speedValue > 10) {
    player.addSpeed(speedValue / 50, player.rotation + 270);
  }
}

function updateTriebwerkLinksPosition() {
  // Rotation
  // Linke Ausrichtung
  if (joystickXValue < 400) {
    TriebwerkLinks.rotation -= 0.5;
  }
  // Rechte Ausrichtung
  if (joystickXValue > 650) {
    TriebwerkLinks.rotation += 0.5;
  }
  //Movement
  if (speedValue > 10) {
    TriebwerkLinks.addSpeed(speedValue / 50, player.rotation + 270);
  }
}

function updateTriebwerkLinksFall() {
  // Rotation
  // Linke Ausrichtung
  if (rocketOneToggle && rocketOneButton == 1) {
    TriebwerkLinks.rotation -= 0.5;
    //Movement
    TriebwerkLinks.addSpeed(-0.5, player.rotation + 270);
  }
}

function updateTriebwerkRechtsPosition() {
  // Rotation
  // Linke Ausrichtung
  if (joystickXValue < 400) {
    TriebwerkRechts.rotation -= 0.5;
  }
  // Rechte Ausrichtung
  if (joystickXValue > 650) {
    TriebwerkRechts.rotation += 0.5;
  }
  //Movement
  if (speedValue > 10) {
    TriebwerkRechts.addSpeed(speedValue / 50, player.rotation + 270);
  }
}

function updateTriebwerkRechtsFall() {
  // Rotation
  // Linke Ausrichtung
  if (rocketTwoToggle == 1 && rocketTwoButton == 1) {
    TriebwerkRechts.rotation += 0.5;
    //Movement
    TriebwerkRechts.addSpeed(-0.5, player.rotation + 270);
  }
}

function updateTriebwerkMittePosition() {
  // Rotation
  // Linke Ausrichtung
  if (joystickXValue < 400) {
    TriebwerkMitte.rotation -= 0.5;
  }
  // Rechte Ausrichtung
  if (joystickXValue > 650) {
    TriebwerkMitte.rotation += 0.5;
  }
  //Movement
  if (speedValue > 10) {
    TriebwerkMitte.addSpeed(speedValue / 50, player.rotation + 270);
  }
}

function updateTriebwerkMitteFall() {
  // Rotation
  // Linke Ausrichtung
  if (rocketThreeToggle == 1 && rocketThreeButton == 1) {
    TriebwerkMitte.rotation -= 0.5;
    //Movement
    TriebwerkMitte.addSpeed(-0.5, player.rotation + 270);
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
