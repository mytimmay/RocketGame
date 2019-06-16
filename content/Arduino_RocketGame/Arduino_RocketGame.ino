#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);


const int rocketOneTogglePin = 9;
const int rocketOneLedGreenPin = 8;
const int rocketOneLedRedPin = 7;
const int rocketOneButtonPin = 28;

const int rocketTwoTogglePin = 22;
const int rocketTwoLedGreenPin = 26;
const int rocketTwoLedRedPin = 24;
const int rocketTwoButtonPin = 30;

const int rocketThreeTogglePin = 23;
const int rocketThreeLedGreenPin = 27;
const int rocketThreeLedRedPin = 25;
const int rocketThreeButtonPin = 29;

const int startButtonPin = 31;
const int confirmButtonPin = 33;

int joystickXValue;
int joystickYValue;
int speedValue;
int speedLimited;
int rocketOneToggle;
int rocketTwoToggle;
int rocketThreeToggle;
int rocketOneButton;
int rocketTwoButton;
int rocketThreeButton;
int startButton;
int confirmButton;


void setup() {

  //lcd screen size
  lcd.begin(16, 2);
  
  //Joystick
  pinMode(6, INPUT); // Joystickbutton
  digitalWrite(6, HIGH); // Joystickbutton
  
  pinMode(rocketOneTogglePin, INPUT); // ButtonValue
  pinMode(rocketOneLedGreenPin, OUTPUT); // LED Green
  pinMode(rocketOneLedRedPin, OUTPUT); // LED RED
  pinMode(rocketOneButtonPin, INPUT); // ButtonValue

  pinMode(rocketTwoTogglePin, INPUT); // ButtonValue
  pinMode(rocketTwoLedGreenPin, OUTPUT); // LED Green
  pinMode(rocketTwoLedRedPin, OUTPUT); // LED RED
  pinMode(rocketTwoButtonPin, INPUT); // ButtonValue

  pinMode(rocketThreeTogglePin, INPUT); // ButtonValue
  pinMode(rocketThreeLedGreenPin, OUTPUT); // LED Green
  pinMode(rocketThreeLedRedPin, OUTPUT); // LED RED
  pinMode(rocketThreeButtonPin, INPUT); // ButtonValue

  pinMode(startButtonPin, INPUT); // ButtonValue
  pinMode(confirmButtonPin, INPUT); // ButtonValue

  
  //Data exhange rate
  Serial.begin(9600);
  while (Serial.available() <= 0) {
    Serial.println("hello"); // send a starting message
    delay(300);              // wait 1/3 second
  }
}

void loop() {


 if (Serial.available() > 0) {
    // read the incoming byte:
    int inByte = Serial.read();
    // read the sensor:
    joystickXValue = analogRead(A2);
    // print the results:
    Serial.print(joystickXValue);
    Serial.print(",");
 
    // read the sensor:
    joystickYValue = analogRead(A3);
    // print the results:
    Serial.print(joystickYValue);
    Serial.print(",");
 
    // read the sensor:
    speedValue = analogRead(A0);
    speedLimited = map(speedValue, 0, 1000, 0, 200);
    // print the results:
    Serial.print(speedLimited);
    Serial.print(",");

    // read the sensor:
    rocketOneToggle = digitalRead(rocketOneTogglePin);
    // print the results:
    Serial.print(rocketOneToggle);
    Serial.print(",");
    
        // read the sensor:
    rocketTwoToggle = digitalRead(rocketTwoTogglePin);
    // print the results:
    Serial.print(rocketTwoToggle);
    Serial.print(",");
    
        // read the sensor:
    rocketThreeToggle = digitalRead(rocketThreeTogglePin);
    // print the results:
    Serial.print(rocketThreeToggle);
    Serial.print(",");

        // read the sensor:
    rocketOneButton = digitalRead(rocketOneButtonPin);
    // print the results:
    Serial.print(rocketOneButton);
    Serial.print(",");
    
        // read the sensor:
    rocketTwoButton = digitalRead(rocketTwoButtonPin);
    // print the results:
    Serial.print(rocketTwoButton);
    Serial.print(",");
    
        // read the sensor:
    rocketThreeButton = digitalRead(rocketThreeButtonPin);
    // print the results:
    Serial.print(rocketThreeButton);
    Serial.print(",");

            // read the sensor:
    startButton = digitalRead(startButtonPin);
    // print the results:
    Serial.print(startButton);
    Serial.print(",");
    
        // read the sensor:
    confirmButton = digitalRead(confirmButtonPin);
    // print the results:
    Serial.println(confirmButton);
  }

   
  //Send data to LCD
  lcd.print("Geschwindigkeit:"),
  lcd.setCursor(0, 1);
  lcd.print(speedLimited),
  lcd.print(" km/h");
  lcd.println("          ");
  lcd.setCursor(0, 0);


   
if (rocketOneToggle == LOW){
  digitalWrite(rocketOneLedRedPin, HIGH);
  digitalWrite(rocketOneLedGreenPin, LOW);
  } else{
    digitalWrite(rocketOneLedRedPin, LOW);
    digitalWrite(rocketOneLedGreenPin, HIGH);
    }

    if (rocketTwoToggle == LOW){
  digitalWrite(rocketTwoLedRedPin, HIGH);
  digitalWrite(rocketTwoLedGreenPin, LOW);
  } else{
    digitalWrite(rocketTwoLedRedPin, LOW);
    digitalWrite(rocketTwoLedGreenPin, HIGH);
    }

    if (rocketThreeToggle == LOW){
  digitalWrite(rocketThreeLedRedPin, HIGH);
  digitalWrite(rocketThreeLedGreenPin, LOW);
  } else{
    digitalWrite(rocketThreeLedRedPin, LOW);
    digitalWrite(rocketThreeLedGreenPin, HIGH);
    }

}
