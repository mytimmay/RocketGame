var serial; // variable to hold an instance of the serialport library
var portName = "COM4"; // fill in your serial port name here

//Controll Values
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

//Player
var xPlayer;
var yPlayer;
var rotation;
var readyPlayer;
var TriebwerkLinks;
var TriebwerkRechts;
var TriebwerkMitte;

//GameStates
var wins;
var gameState;
var GamePlayState;

//Moving Images
var Astronaut;
var Aimer;
var Tower;
var TowerBridge;
var Treibstoff;
var Sauerstoff;
var Traglast;
var SpaceStation;
var SpaceStationFrontal;
var smoke;

//Text and Interfacefields
var Title;
var Scheinwerfer;
var Tank;
var Speed;
var TankText;
var AbdockenText;
var SchubText;
var ToggleText;
var ToggleMiddleText;
var SchubabbauText;
var SpaceStationText;

//Set LevelSize
var SCENE_W = 3500;
var SCENE_H = 6000;

function preload() {
  //Font
  fontTitle = loadFont("assets/font/lucida-console.ttf");

  //Title Images
  Title_background = loadImage("assets/Title_Background.png");
  TitleImage = loadImage("assets/GameOver_Win_Images/Startscreen.png");
  astronautImage = loadImage("assets/Astronaut.png");

  //Interface-Text Images
  TankTextImage = loadImage("assets/Interface_Text/Tank_Text.png");
  SpeedTextImage = loadImage("assets/Interface_Text/Speed.png");
  TankImage = loadImage("assets/Interface_Text/Tank.png");
  AbdockenTextImage = loadImage(
    "assets/Interface_Text/Haltevorrichtung_Text.png"
  );
  SchubTextImage = loadImage("assets/Interface_Text/Schub_Text.png");
  SchubabbauTextImage = loadImage("assets/Interface_Text/Schubabbau_Text.png");
  ToggleTextImage = loadImage("assets/Interface_Text/Toggle_Text.png");
  ToggleMiddleTextImage = loadImage(
    "assets/Interface_Text/ToggleMiddle_Text.png"
  );
  SpaceStationTextImage = loadImage(
    "assets/Interface_Text/SpaceStation_Text.png"
  );

  //World Image
  worldImage = loadImage("assets/Final_Background_maße.jpg");

  //Spacestation Image
  SpaceStationImage = loadImage("assets/SpaceStation.png");
  SpaceStationFrontalImage = loadImage("assets/SpaceStation_frontal.png");

  //Tower Image
  TowerImage = loadImage("assets/Tower.png");
  TowerBridgeImage = loadImage("assets/TowerBridge.png");

  //Scheinwerfer
  ScheinwerferImage = loadImage("assets/Scheinwerfer.png");

  //Aimer
  AimerImage = loadImage("assets/Aimer.png");

  //GameOver Images
  WinImage = loadImage("assets/GameOver_Win_Images/MissionComplete.png");
  GameOverDangerZoneImage = loadImage(
    "assets/GameOver_Win_Images/DangerZone_GameOver.png"
  );
  GameOverTreibstoffImage = loadImage(
    "assets/GameOver_Win_Images/Treibstoff_GameOver.png"
  );
  GameOverSauerstoffImage = loadImage(
    "assets/GameOver_Win_Images/Sauerstoff_GameOver.png"
  );
  GameOverCollissionImage = loadImage(
    "assets/GameOver_Win_Images/Kollision_GameOver.png"
  );

  //Sound
  soundFormats("mp3", "ogg");
  ThemeSong = loadSound("assets/Sound/ThemeSong.mp3");
  RocketSound = loadSound("assets/Sound/raketengeraeusche_1min.mp3");
  TankSound = loadSound("assets/Sound/auftanken_10sec.mp3");
  AbdockenSound = loadSound("assets/Sound/Abdocken_10sec.mp3");
  CountdownSound = loadSound("assets/Sound/countdown.mp3");
  GroundControlSound = loadSound("assets/Sound/GroundControl.mp3");
  ApplausSound = loadSound("assets/Sound/applaus_jubel.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ThemeSong.setVolume(0.2);
  ThemeSong.loop();

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
  //GameStates: Title, GamePlay, SpaceStation, Win, GameOverBegrenzung/Treibstoff/Sauerstoff/Collide
  //GamePlayStates: Fuel, Abdocken, Schub, Toggle, ToggleMiddle, Schubabbau.
  gameState = "Title";
  GamePlayState = "Fuel";

  //Astronaut
  Astronaut = createSprite(windowWidth - 200, windowHeight / 2);
  Astronaut.addImage(astronautImage);

  Sauerstoff = createSprite(windowWidth - 320, windowHeight - 185, 50, 50);
  Sauerstoff.shapeColor = color(60, 68, 149); //blau

  Treibstoff = createSprite(windowWidth - 192, windowHeight - 185, 50, 50);
  Treibstoff.shapeColor = color(27, 153, 56); //grün

  Tower = createSprite(windowWidth / 2 + 145, windowHeight - 42);
  Tower.addImage(TowerImage);
  TowerBridge = createSprite(windowWidth / 2 + 55, windowHeight - 135);
  TowerBridge.addImage(TowerBridgeImage);

  //World
  world = createSprite(1000, -1550, SCENE_W, SCENE_H);
  world.addImage(worldImage);

  //SpaceStation
  SpaceStation = createSprite(250, -3800);
  SpaceStation.addImage(SpaceStationImage);
  SpaceStation.setCollider("circle", 0, 0, 400);
  SpaceStationFrontal = createSprite(windowWidth / 2 + 200, windowHeight / 2);
  SpaceStationFrontal.addImage(SpaceStationFrontalImage);
  SpaceStationFrontal.setCollider("circle", 0, 0, 50);

  //Aimer
  Aimer = createSprite(windowWidth / 2, windowHeight / 2, 50, 50);
  Aimer.addImage(AimerImage);

  //Player
  readyPlayer = false;
  player = createSprite(0, 0, 100, 450);
  player.addAnimation("Stand", "assets/FullRocket.png");
  player.addAnimation(
    "Fire",
    "assets/FullRocket_Fire1.png",
    "assets/FullRocket_Fire2.png"
  );
  player.rotation = 0;

  xPlayer = windowWidth / 2;
  yPlayer = windowHeight - 20;

  TriebwerkLinks = createSprite(xPlayer, yPlayer, 100, 450);
  TriebwerkLinks.addAnimation("StandT1", "assets/Triebwerk_links.png");
  TriebwerkLinks.addAnimation(
    "FireT1",
    "assets/Triebwerk_links_Feuer1.png",
    "assets/Triebwerk_links_Feuer2.png"
  );
  TriebwerkRechts = createSprite(xPlayer, yPlayer, 100, 450);
  TriebwerkRechts.addAnimation("StandT2", "assets/Triebwerk_rechts.png");
  TriebwerkRechts.addAnimation(
    "FireT2",
    "assets/Triebwerk_rechts_Feuer1.png",
    "assets/Triebwerk_rechts_Feuer2.png"
  );
  TriebwerkMitte = createSprite(xPlayer, yPlayer, 100, 450);
  TriebwerkMitte.addAnimation("StandT3", "assets/Triebwerk_mitte.png");
  TriebwerkMitte.addAnimation(
    "FireT3",
    "assets/Triebwerk_mitte_Feuer1.png",
    "assets/Triebwerk_mitte_Feuer2.png"
  );

  smoke = createSprite(windowWidth / 2, windowHeight + 150);
  smoke.addAnimation(
    "Smoke",
    "assets/Rauch_vorne.png",
    "assets/Rauch_mitte.png",
    "assets/Rauch_hinten.png"
  );

  //Text and Interfacefields
  Title = createSprite(windowWidth / 2, windowHeight / 2, 857, 461);
  Title.addImage(TitleImage);
  Scheinwerfer = createSprite(windowWidth / 2, windowHeight + 90);
  Scheinwerfer.addImage(ScheinwerferImage);
  Tank = createSprite(windowWidth - 250, windowHeight - 350);
  Tank.addImage(TankImage);
  Speed = createSprite(windowWidth - 250, windowHeight - 700);
  Speed.addImage(SpeedTextImage);
  TankText = createSprite(300, windowHeight / 2);
  TankText.addImage(TankTextImage);
  AbdockenText = createSprite(300, windowHeight / 2);
  AbdockenText.addImage(AbdockenTextImage);
  SchubText = createSprite(300, windowHeight / 2);
  SchubText.addImage(SchubTextImage);
  ToggleText = createSprite(300, windowHeight / 2);
  ToggleText.addImage(ToggleTextImage);
  ToggleMiddleText = createSprite(300, windowHeight / 2);
  ToggleMiddleText.addImage(ToggleMiddleTextImage);
  SchubabbauText = createSprite(300, windowHeight / 2);
  SchubabbauText.addImage(SchubabbauTextImage);
  SpaceStationText = createSprite(300, windowHeight / 2);
  SpaceStationText.addImage(SpaceStationTextImage);
}

function draw() {
  // GAME STATE  ----- Title (StartScreen) ----- -----
  if (gameState == "Title") {
    camera.off();

    background(Title_background);

    drawSprite(Title);
    drawSprite(Astronaut);

    updateAstronautPosition();

    // NEXT LEVEL
    if (confirmButton == 1) {
      readyPlayer = true;
      gameState = "GamePlay";
      GamePlayState = "Fuel";
    }
  }

  // GAME STATE ----- GamePlay ----- -----
  if (gameState == "GamePlay") {
    background("black");
    camera.zoom = 1;

    drawSprite(world);
    drawSprite(TowerBridge);
    drawSprite(Tower);
    drawSprite(player);
    drawSprite(TriebwerkLinks);
    drawSprite(TriebwerkRechts);
    drawSprite(TriebwerkMitte);
    drawSprite(Scheinwerfer);
    drawSprite(SpaceStation);
    player.changeAnimation("Stand");
    TriebwerkLinks.changeAnimation("StandT1");
    TriebwerkRechts.changeAnimation("StandT2");
    TriebwerkMitte.changeAnimation("StandT3");

    //Smoke is placed here to avoid camera.on/off
    //Must be placed after player
    if (speedValue > 5 && GamePlayState == "Schub") {
      smoke.changeAnimation("Smoke");
      smoke.life = 2;
      drawSprite(smoke);
    }
    //Turn Camera off to place Text,Buttons... on the Screen
    camera.off();

    drawSprite(Tank);
    drawSprite(Speed);
    drawSprite(Sauerstoff);
    drawSprite(Treibstoff);

    //////Text and Interfacearea GamePlay
    fill(255);
    textSize(15);
    textFont(fontTitle);
    text(
      "Geschwindigkeit: " + speedValue + " m/s²",
      windowWidth - 385,
      windowHeight - 700
    );
    text("Sauerstoff", windowWidth - 365, windowHeight - 130);
    text("Treibstoff", windowWidth - 230, windowHeight - 130);
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
    /////

    if (GamePlayState == "Fuel") {
      drawSprite(TankText);

      //Update Treibstoff/Sauerstoff
      if (startButton == 1) {
        updateTreibstoff();
      }
      if (confirmButton == 1) {
        updateSauerstoff();
      }
      if ((startButton == 0 && confirmButton == 0) || Traglast == 1500) {
        if (TankSound.isPlaying()) {
          TankSound.stop();
        }
      }
      if (!GroundControlSound.isPlaying()) {
        GroundControlSound.setVolume(0.1);
        GroundControlSound.play();
      }
      //NEXT LEVEL
      if (joystickButtonValue == 0) {
        GamePlayState = "Abdocken";
      }
    }

    if (GamePlayState == "Abdocken") {
      drawSprite(AbdockenText);

      //NEXT LEVEL
      if (startButton == 1) {
        if (TowerBridge.position.x < 1095) {
          TowerBridge.position.x += 0.5;
          if (!AbdockenSound.isPlaying()) {
            AbdockenSound.play();
          }
        }
        if (TowerBridge.position.x == 1095) {
          GamePlayState = "Schub";
          if (AbdockenSound.isPlaying()) {
            AbdockenSound.stop();
            CountdownSound.setVolume(0.3);
            CountdownSound.play();
          }
        }
      }
    }

    if (GamePlayState == "Schub") {
      drawSprite(SchubText);

      if (speedValue > 1) {
        if (!RocketSound.isPlaying()) {
          RocketSound.setVolume(0.1);
          RocketSound.play();
        }
      }
      //NEXT LEVEL
      if (player.velocity.y < -1000) {
        GamePlayState = "Toggle";
      }
      if (speedValue > 20) {
        updateTreibstoffVerbrauch();
        updateSauerstoffVerbrauch();
      }

      updateRocketPosition();
      updateTriebwerkLinksPosition();
      updateTriebwerkRechtsPosition();
      updateTriebwerkMittePosition();
      updateAnimation();
    }

    if (GamePlayState == "Toggle") {
      drawSprite(ToggleText);

      updateTreibstoffVerbrauch();
      updateSauerstoffVerbrauch();
      updateGravitation();
      updateRocketPosition();
      updateAnimation();

      if (
        rocketOneButton == 1 &&
        rocketOneToggle == 1 &&
        rocketTwoButton == 1 &&
        rocketTwoToggle == 1
      ) {
        GamePlayState = "ToggleMiddle";
      } else {
        updateTriebwerkRechtsPosition();
        updateTriebwerkLinksPosition();
        updateTriebwerkMittePosition();
      }
    }

    if (GamePlayState == "ToggleMiddle") {
      drawSprite(ToggleMiddleText);

      updateTriebwerkLinksFall();
      updateTriebwerkRechtsFall();
      updateRocketPosition();
      updateGravitation();
      updateTreibstoffVerbrauch();
      updateSauerstoffVerbrauch();
      updateAnimation();
      if (rocketThreeButton == 1 && rocketThreeToggle == 1) {
        GamePlayState = "Schubabbau";
      } else {
        updateTriebwerkMittePosition();
      }
    }

    if (GamePlayState == "Schubabbau") {
      drawSprite(SchubabbauText);

      updateRocketPosition();
      updateTriebwerkMitteFall();
      updateTriebwerkLinksFall();
      updateTriebwerkRechtsFall();
      updateTreibstoffVerbrauch();
      updateSauerstoffVerbrauch();
      updateAnimation();

      if (speedValue <= 60) {
        if (player.collide(SpaceStation)) {
          gameState = "SpaceStation";
        }
      }
      if (speedValue >= 60) {
        if (player.collide(SpaceStation)) {
          gameState = "GameOverCollide";
        }
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

    //set the camera position to the ghost position
    camera.position.x = player.velocity.x + windowWidth / 2;
    camera.position.y = player.velocity.y + windowHeight - 200;

    // constant downward speed(gravity)
    updateGravitation();
    // Update Values
    updateTraglast();

    //map borders - Game Over
    if (player.velocity.x > 1500) {
      gameState = "GameOverBegrenzung";
    }
    if (player.velocity.x < -1500) {
      gameState = "GameOverBegrenzung";
    }
    if (player.velocity.y < -5800) {
      gameState = "GameOverBegrenzung";
    }
  }

  // GAME STATE ----- SpaceStation ----- -----
  if (gameState == "SpaceStation") {
    camera.off();
    background(Title_background);

    drawSprite(SpaceStationText);
    drawSprite(SpaceStationFrontal);
    drawSprite(Aimer);

    updateSpaceStationPosition();
    updateAimerPosition();
    // NEXT LEVEL
    if (Aimer.overlap(SpaceStationFrontal) && confirmButton == 1) {
      gameState = "Win";

      if (!ApplausSound.isPlaying()) {
        ApplausSound.setVolume(0.2);
        ApplausSound.play();
      }
    }
  }

  if (gameState == "Win") {
    camera.off();

    background(Title_background);

    var WinText = createSprite(windowWidth / 2, windowHeight / 2);
    WinText.addImage(WinImage);
    drawSprite(WinText);

    //Push Confirm to Reset
    GameOverReset();
  }

  // GAME STATE ----- GAME OVER ----- -----

  if (gameState == "GameOverBegrenzung") {
    camera.off();

    background(Title_background);

    var GameOverDangerZoneText = createSprite(
      windowWidth / 2,
      windowHeight / 2
    );
    GameOverDangerZoneText.addImage(GameOverDangerZoneImage);
    drawSprite(GameOverDangerZoneText);

    //Push Confirm to Reset
    GameOverReset();
  }

  if (gameState == "GameOverTreibstoff") {
    camera.off();

    background(Title_background);

    var GameOverTreibstoffText = createSprite(
      windowWidth / 2,
      windowHeight / 2
    );
    GameOverTreibstoffText.addImage(GameOverTreibstoffImage);
    drawSprite(GameOverTreibstoffText);

    //Push Confirm to Reset
    GameOverReset();
  }

  if (gameState == "GameOverSauerstoff") {
    camera.off();

    background(Title_background);

    var GameOverSauerstoffText = createSprite(
      windowWidth / 2,
      windowHeight / 2
    );
    GameOverSauerstoffText.addImage(GameOverSauerstoffImage);
    drawSprite(GameOverSauerstoffText);

    //Push Confirm to Reset
    GameOverReset();
  }

  if (gameState == "GameOverCollide") {
    camera.off();

    background(Title_background);

    var GameOverCollissionText = createSprite(
      windowWidth / 2,
      windowHeight / 2
    );
    GameOverCollissionText.addImage(GameOverCollissionImage);
    drawSprite(GameOverCollissionText);

    //Push Confirm to Reset
    GameOverReset();
  }

  /*
  //shows Values from Arduino on Screen
  textAlign(LEFT);
  textSize(15);
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
*/
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
  Traglast = round(Treibstoff.height * 3 + Sauerstoff.height * 3);
}

function updateTreibstoff() {
  if (joystickYValue > 1200) {
    if (Treibstoff.height < 350) {
      if (Traglast <= 1494) {
        Treibstoff.height += 2;
        Treibstoff.position.y -= 1;
        if (!TankSound.isPlaying()) {
          TankSound.setVolume(0.1);
          TankSound.play();
        }
      }
    }
  }
  if (joystickYValue < 800) {
    if (Treibstoff.height > 20) {
      Treibstoff.height -= 2;
      Treibstoff.position.y += 1;
      if (!TankSound.isPlaying()) {
        TankSound.setVolume(0.1);
        TankSound.play();
      }
    }
  }
}

function updateSauerstoff() {
  if (joystickYValue > 1200) {
    if (Sauerstoff.height < 350) {
      if (Traglast <= 1494) {
        Sauerstoff.height += 2;
        Sauerstoff.position.y -= 1;
        if (!TankSound.isPlaying()) {
          TankSound.setVolume(0.1);
          TankSound.play();
        }
      }
    }
  }
  if (joystickYValue < 800) {
    if (Sauerstoff.height > 20) {
      Sauerstoff.height -= 2;
      Sauerstoff.position.y += 1;
      if (!TankSound.isPlaying()) {
        TankSound.setVolume(0.1);
        TankSound.play();
      }
    }
  }
  if (joystickYValue > 800 && joystickYValue < 1200) {
    if (TankSound.isPlaying()) {
      TankSound.stop();
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
    player.addSpeed(speedValue / 35, player.rotation + 270);
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
    TriebwerkLinks.addSpeed(speedValue / 35, player.rotation + 270);
  }
}

function updateTriebwerkLinksFall() {
  // Rotation
  // Linke Ausrichtung
  TriebwerkLinks.rotation -= 0.5;
  //Movement
  TriebwerkLinks.addSpeed(-1.5, player.rotation + 270);
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
    TriebwerkRechts.addSpeed(speedValue / 35, player.rotation + 270);
  }
}

function updateTriebwerkRechtsFall() {
  // Rotation
  // Linke Ausrichtung
  TriebwerkRechts.rotation += 0.5;
  //Movement
  TriebwerkRechts.addSpeed(-1.5, player.rotation + 270);
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
    TriebwerkMitte.addSpeed(speedValue / 35, player.rotation + 270);
  }
}

function updateTriebwerkMitteFall() {
  // Rotation
  // Linke Ausrichtung
  TriebwerkMitte.rotation -= 0.5;
  //Movement
  TriebwerkMitte.addSpeed(-1.5, player.rotation + 270);
}

function updateSpaceStationPosition() {
  // Rotation
  SpaceStationFrontal.rotation -= 0.2;
  //Movement
  SpaceStationFrontal.addSpeed(0.0001, random(50));
}

function updateAstronautPosition() {
  // Rotation
  Astronaut.rotation -= 0.02;
  //Movement
  Astronaut.addSpeed(0.0001, 180);
}

function updateAimerPosition() {
  Aimer.position.x = joystickXValue * 2 - 200;
  Aimer.position.y = joystickYValue / 2;
}

function updateSauerstoffVerbrauch() {
  if (speedValue > 1) {
    Treibstoff.height -= 0.1;
    Treibstoff.position.y += 0.05;
  }

  if (Treibstoff.height <= 1) {
    gameState = "GameOverTreibstoff";
  }
  if (player.velocity.y <= -3000 && GamePlayState != "Schubabbau") {
    Treibstoff.height -= 1;
    Treibstoff.position.y += 0.5;
  }
}

function updateTreibstoffVerbrauch() {
  if (speedValue > 1) {
    Sauerstoff.height -= 0.1;
    Sauerstoff.position.y += 0.05;
  }
  if (Sauerstoff.height <= 1) {
    gameState = "GameOverSauerstoff";
  }
}

function updateGravitation() {
  if (speedValue <= 1) {
    if (player.velocity.y < 0) {
      player.addSpeed(0.25, 90);
      player.rotation -= 0.2;
      TriebwerkLinks.addSpeed(0.25, 90);
      TriebwerkLinks.rotation -= 0.2;
      TriebwerkRechts.addSpeed(0.25, 90);
      TriebwerkRechts.rotation -= 0.2;
      TriebwerkMitte.addSpeed(0.25, 90);
      TriebwerkMitte.rotation -= 0.2;
    }
  }
}

function updateAnimation() {
  if (speedValue > 5) {
    player.changeAnimation("Fire");
    TriebwerkLinks.changeAnimation("FireT1");
    TriebwerkRechts.changeAnimation("FireT2");
    TriebwerkMitte.changeAnimation("FireT3");
  }
}

function GameOverReset() {
  if (startButton == 1) {
    camera.on();
    gameState = "Title";
    GamePlayState = "Fuel";

    player.velocity.x = 0;
    player.velocity.y = 0;
    player.rotation = 0;

    TriebwerkLinks.velocity.x = 0;
    TriebwerkLinks.velocity.y = 0;
    TriebwerkRechts.velocity.x = 0;
    TriebwerkRechts.velocity.y = 0;
    TriebwerkMitte.velocity.x = 0;
    TriebwerkMitte.velocity.y = 0;
    TriebwerkLinks.rotation = 0;
    TriebwerkRechts.rotation = 0;
    TriebwerkMitte.rotation = 0;

    Treibstoff.height = 50;
    Sauerstoff.height = 50;
    Treibstoff.position.y = windowHeight - 185;
    Sauerstoff.position.y = windowHeight - 185;

    TowerBridge.position.x = windowWidth / 2 + 55;
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
