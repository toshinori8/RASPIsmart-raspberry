const express = require("express");
const app = express();
const expbs = require("express-handlebars");
const path = require("path");
const routes = require("./routes/handlers");
var runCommand = require("child_process");
const ble = require("./ble_scan");


// Sending static files with Express
app.use(express.static("public"));

const hbs = expbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/mainLayout"),  // layouty 
  partialsDir: path.join(__dirname, "views/pieces"), // elementy 

  // create custom express handlebars helpers
  helpers: {
    calculation: function (value) {
      return value * 5;
    },

    list: function (value, options) {
      let out = "<ul>";
      for (let i = 0; i < value.length; i++) {
        out = out + "<li>" + options.fn(value[i]) + "</li>";
      }
      return out + "</ul>";
    },
  },
});

// Express Handlebars Configuration
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Configure Routes
app.use("/", routes);

app.get("/mqttON", function (req, res) {
  runCommand.exec("systemctl start mosquitto.service");
  res.send("systemctl start mosquitto.service");
});
app.get("/mqttOFF", function (req, res) {
  runCommand.exec("systemctl stop mosquitto.service");
  res.send("systemctl stop mosquitto.service");
});
app.get("/bleSTART", function (req, res) {
  ble.startScan();
  res.send("START ble scanner");
});
app.get("/bleSTOP", function (req, res) {
  ble.stopScan();
  res.send("STOP ble scanner");
});

app.listen(8080, () => {
  console.log("Server is starting at port ", 8080);
});
