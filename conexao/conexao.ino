//
// A simple server implementation showing how to:
//  * serve static messages
//  * read GET and POST parameters
//  * handle missing pages / 404s
//

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

int relay = 2;
int turnRelay = LOW;
AsyncWebServer server(80);

const char* ssid = "GABRIELESTEVAM 4438";
const char* password = "0507/7iH";

const char* PARAM_MESSAGE = "message";

void notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Not found");
}

void setup() {

    pinMode(relay, OUTPUT);
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    if (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.printf("WiFi Failed!\n");
        return;
    }

    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    server.on("/activate", HTTP_GET, [](AsyncWebServerRequest *request){
        digitalWrite(relay, HIGH);
        request->send(200, "text/plain", "activated");
    });

    server.on("/deactivate", HTTP_GET, [](AsyncWebServerRequest *request){
        digitalWrite(relay, LOW);
        request->send(200, "text/plain", "deactivated");
    });

    server.onNotFound(notFound);

    server.begin();
}

void loop() {
}
