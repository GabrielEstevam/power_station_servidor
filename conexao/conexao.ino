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

int relay[4] = {2, nullptr, nullptr, nullptr};
int turnRelay = LOW;
AsyncWebServer server(80);

const char* ssid = "GABRIELESTEVAM 4438";
const char* password = "0507/7iH";

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
  
    server.on("/activateRelay", HTTP_POST, [] (AsyncWebServerRequest *request) {
        int id_relay;
        if (request->hasParam("id_relay", true)) {
            id_relay = stoi(request->getParam("id_relay", true)->value());
            digitalWrite(relay[id_relay], LOW);

            request->send(200, "text/plain", "Activated relay");
        } else {
            request->send();
        }
        request->send(400, "text/plain", "Your request is missing parameters");
    });

    server.on("/deactivateRelay", HTTP_POST, [] (AsyncWebServerRequest *request) {
        int id_relay;
        if (request->hasParam("id_relay", true)) {
            id_relay = stoi(request->getParam("id_relay", true)->value());
            digitalWrite(relay[id_relay], HIGH);

            request->send(200, "text/plain", "Dectivated relay");
        } else {
            request->send();
        }
        request->send(400, "text/plain", "Your request is missing parameters");
    });

    server.onNotFound(notFound);

    server.begin();
}

void loop() {
}
