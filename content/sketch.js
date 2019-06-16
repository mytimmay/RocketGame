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

var spr;

function setup() {
  createCanvas(900, 900);
  spr = createSprite(width / 2, height / 2, 40, 40);
  spr.shapeColor = color(255);
  spr.rotateToDirection = true;
  spr.maxSpeed = 2;
  spr.friction = 0.99;

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on("list", printList); // set a callback function for the serialport list event
  serial.on("connected", serverConnected); // callback for connecting to the server
  serial.on("open", portOpen); // callback for the port opening
  serial.on("data", serialEvent); // callback for when new data arrives
  serial.on("error", serialError); // callback for errors
  serial.on("close", portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

function draw() {
  background(50);
  fill(255);
  noStroke();

  textAlign(CENTER, CENTER);
  text(
    "Willkommen im Astronautenprogramm und zu deinem ersten Flug ins All. \n  Drücke Start um deine Reise ins All zu beginnen.",
    width / 2,
    height * 0.67
  );

  spr.velocity.x = (joystickXValue - spr.position.x) * 0.2;
  spr.velocity.y = (joystickYValue - spr.position.y) * 0.2;

  joystickControl();
  if (joystickControl) {
    spr.attractionPoint(0.5, joystickXValue, joystickYValue);
  }
  drawSprites();

  textAlign(LEFT);
  ellipse(joystickXValue, joystickYValue, 50, 50); // draw the circle
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

function joystickControl() {
  if (joystickXValue >= 500) {
    spr.setSpeed(1.5, 0);
  } else if (speedValue <= 1) {
    spr.setSpeed(1.5, 90);
  } else if (joystickXValue <= 400) {
    spr.setSpeed(1.5, 180);
  } else if (speedValue >= 1) {
    spr.setSpeed(1.5, 270);
  } else if (speedValue == 0) {
    spr.setSpeed(0, 0);
  }
  return false;
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

function serialError(err) {
  console.log("Something went wrong with the serial port. " + err);
}

function portClose() {
  console.log("The serial port closed.");
}
