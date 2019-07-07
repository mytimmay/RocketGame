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

//Set LevelSize
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
  SchubabbauTextImage = loadImage("assets/Interface_Text/Text_Schubabbau.png");
  StartTextImage = loadImage("assets/Interface_Text/Text_Start.png");
  ToggleTextImage = loadImage("assets/Interface_Text/Text_Toggle.png");
  SpaceStationTextImage = loadImage(
    "assets/Interface_Text/Text_SpaceStation.png"
  );

  //Button Images
  Button_StartImage = loadImage("assets/Buttons/Button_Start.png");
  Button_ConfirmImage = loadImage("assets/Buttons/Button_Confirm.png");
  Button_RocketImage = loadImage("assets/Buttons/Button_Rocket.png");
  Button_SpeedImage = loadImage("assets/Buttons/Button_Speed.png");
  Button_ToggleImage = loadImage("assets/Buttons/Button_Toggle.png");
  Button_JoystickImage = loadImage("assets/Buttons/Joystick.png");

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
  gameState = "GamePlay";
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
  pointsPlayer = 0;

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
}

function draw() {
  // GAME STATE  ----- Title (StartScreen) ----- -----
  if (gameState == "Title") {
    var Title = createSprite(windowWidth / 2, 300, 857, 461);
    Title.addImage(TitleImage);

    var TitleText = createSprite(windowWidth / 2, windowHeight - 250);
    TitleText.addImage(TitleTextImage);

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
    background("red");
    camera.zoom = 1;

    var Scheinwerfer = createSprite(windowWidth / 2, windowHeight + 90);
    Scheinwerfer.addImage(ScheinwerferImage);

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
      if ((startButton == 0 && confirmButton == 0) || Traglast == 1500) {
        if (TankSound.isPlaying()) {
          TankSound.stop();
        }
      }

      if (!GroundControlSound.isPlaying()) {
        GroundControlSound.setVolume(0.1);
        GroundControlSound.play();
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

      textSize(15);
      textLeading(25);
      text(
        "Halte blau oder grün gedrückt und \nbewege den Joystick nach oben oder \nunten, um die Mengen einzustellen. \nBestätige deine Eingabe mit Druck \nauf den Joystick!",
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

      textSize(15);
      textLeading(25);
      text(
        "Halte grün gedrückt, um die \nHaltevorrichtung einzufahren.",
        220,
        500
      );

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
      var ToggleText = createSprite(300, windowHeight / 2 - 90);
      ToggleText.addImage(ToggleTextImage);

      var Button_Speed = createSprite(145, windowHeight / 2 - 50);
      Button_Speed.addImage(Button_SpeedImage);

      var Button_Joystick = createSprite(145, windowHeight / 2 + 55);
      Button_Joystick.addImage(Button_JoystickImage);

      drawSprite(ToggleText);
      drawSprite(Button_Speed);
      drawSprite(Button_Joystick);

      fill(255);
      textAlign(LEFT);
      textSize(20);
      textLeading(30);
      textFont(fontTitle);

      text(
        "Super! Du bist nun bereit und \nstartklar. Viel Glück! \nDer Countdown läuft ...",
        105,
        275
      );

      textSize(15);
      textLeading(25);
      text(
        "Baue Schub auf, um zu starten.\n\nSteuere die Rakete nach links \noder rechts.",
        230,
        480
      );

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
        "Toller Start! Du hast 1500 m\nüberstiegen. Nun musst du das\nlinke und rechte Triebwerk ab-\nwerfen. Achte darauf, dies\ngleichzeitig zu tun.",
        110,
        240
      );

      textSize(15);
      textLeading(25);
      text(
        "Entsichere zunächst die äußeren \nTriebwerke.\n\nDie Triebwerke sind nun zum Ab-\nwerfen bereit. Bestätige den \nAbwurf mit rot.",
        210,
        410
      );
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
        "Klasse! Die äußeren Triebwerke\nwurden erfolgreich abgeworfen.\nWiederhole den letzten Schritt\nmit dem mittleren Triebwerk.",
        110,
        250
      );

      textSize(15);
      textLeading(25);
      text(
        "Entsichere das letzte\nTriebwerk.\n\nDas Triebwerk ist nun zum Ab-\nwerfen bereit. Bestätige den \nAbwurf mit rot.",
        210,
        410
      );

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
      var SchubabbauText = createSprite(300, windowHeight / 2 - 110);
      SchubabbauText.addImage(ToggleTextImage);

      var Button_Speed = createSprite(160, windowHeight / 2);
      Button_Speed.addImage(Button_SpeedImage);

      drawSprite(SchubabbauText);
      drawSprite(Button_Speed);

      fill(255);
      textAlign(LEFT);
      textSize(20);
      textLeading(30);
      textFont(fontTitle);

      text(
        "Sehr gut gemacht! Du hast alle\nTriebwerke erfolgreich abge-\nworfen. Achte nun darauf, dass \ndeine Geschwindigkeit nicht mehr \nals circa 40 m/s² beträgt, sobald \ndu die Raumstation erreichst.",
        110,
        250
      );

      textSize(15);
      textLeading(25);
      text(
        "Baue Schub ab, um deine \nGeschwindigkeit zu reduzieren.",
        250,
        470
      );

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

    // constant downward speed
    // (i.e., gravity)
    updateGravitation();

    // Update Values
    updateTraglast();

    //set the camera position to the ghost position
    camera.position.x = player.velocity.x + windowWidth / 2;
    camera.position.y = player.velocity.y + windowHeight - 200;

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
    var TankText = createSprite(300, windowHeight / 2);
    TankText.addImage(TankTextImage);

    var Button_Joystick = createSprite(135, windowHeight / 2 + 70);
    Button_Joystick.addImage(Button_JoystickImage);

    var Button_Confirm = createSprite(135, windowHeight / 2 + 185);
    Button_Confirm.addImage(Button_ConfirmImage);

    background(Title_background);

    drawSprite(TankText);
    drawSprite(SpaceStationFrontal);
    drawSprite(Button_Confirm);
    drawSprite(Button_Joystick);
    drawSprite(Aimer);

    fill(255);
    textAlign(LEFT);
    textSize(20);
    textLeading(30);
    textFont(fontTitle);
    text(
      "Hallo?! ... Alles in Ordnung bei \ndir? Du hast den Kontakt zur Nasa \nverloren. Du musst die Steuerung \nübernehmen und manuell andocken. \nBist du bereit dafür? Schnell, \ndu driftest zu weit ab!",
      110,
      320
    );
    textAlign(LEFT);
    textSize(15);
    textLeading(25);
    text(
      "Steuere die Rakete so, dass du \ngenau auf die Andockstelle zu-\nhälst. Bestätige mit grün.",
      210,
      580
    );

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
    background("black");
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Deine Mission war bisher ein voller Erfolg. Du hast die Rakete ohne einen Kratzer an die Raumstation gebracht.\nIhr habt dringend benötigte Güter und Ersatzteile an die Station gebracht, diese\nkann Dank euch ihren Betrieb fortsetzen.",
      windowWidth / 2,
      windowHeight / 3
    );
  }

  // GAME STATE ----- GAME OVER ----- -----

  if (gameState == "GameOverBegrenzung") {
    camera.off();
    background("black");
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Du bist vom Kurs abgekommen. Da kann ja meine 90-jährige Oma besser Karten lesen!\nKauf dir ne Brille und versuch's nochmal!",
      windowWidth / 2,
      windowHeight / 3
    );

    textFont(fontOther);
    textSize(200);
  }

  if (gameState == "GameOverTreibstoff") {
    camera.off();
    background("black");
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Du wolltest wohl cool sein und ein bisschen durch die Gegen cruisen...\nHättest du mal besser mehr Treibstoff mitgenommen, denn jetzt treibst du antriebslos durch's All!",
      windowWidth / 2,
      windowHeight / 3
    );
  }

  if (gameState == "GameOverSauerstoff") {
    camera.off();
    background("black");
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Du wolltest wohl cool sein und ein bisschen durch die Gegen cruisen...\nHättest du mal besser mehr Sauerstoff mitgenommen, denn jetzt treibst du atemlos durch die Nacht!",
      windowWidth / 2,
      windowHeight / 3
    );
  }

  if (gameState == "GameOverCollide") {
    camera.off();
    background("black");
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textFont(fontTitle);
    text(
      "Du warst zu schnell unterwegs und hast die Raumstation gerammt. Das war schlecht... Ihr seid alle tot!",
      windowWidth / 2,
      windowHeight / 3
    );
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
  /*if (joystickXValue < 400) {
    Aimer.position.x -= 5;
  }
  // Rechte Ausrichtung
  if (joystickXValue > 650) {
    Aimer.position.x += 5;
  }
  if (joystickYValue > 800) {
    Aimer.position.y -= 5;
  }
  // Rechte Ausrichtung
  if (joystickYValue < 1250) {
    Aimer.position.y += 5;
  }
  */
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

function soundRocketStart() {}

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
