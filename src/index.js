const express = require("express");
const logger = require("morgan");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const { PORT } = require("./config");
const api = require("./routes/api");
const ui = require("./routes/ui")

const app = express();

//Express configuration
app.set("port", PORT || 3000);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
app.use(helmet.noCache());
app.use(helmet());

//Routes

app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug");

app.set("views", process.cwd() + "/src/views/pug");



app.use("/", ui());

app.use("/api", api());

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

// Error Handler

if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server Error");
  });
}

// Start Server

app.listen(app.get("port"), () => {
  console.log(
    `✓ App is running on port ${app.get("port")} in ${app.get("env")} mode`
  );
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app; //for testing
