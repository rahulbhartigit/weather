const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "express server" });
});

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather"
    );
    const result = response.data;
    // console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});
const API = process.env.API;
app.post("/submit", async (req, res) => {
  try {
    console.log(req.body);
    const userData = req.body.userData;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${userData}&appid=${API}&units=metric`
    );

    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    let currentMinute = currentDate.getMinutes();
    let time =
      currentHour + ":" + (currentMinute < 10 ? "0" : "") + currentMinute;

    if (currentHour < 12) {
      message = "Good Morning";
      meridian = "AM";
    } else if (currentHour > 12 || currentHour < 5) {
      message = "Good Afternoon";
      meridian = "PM";
    } else {
      message = "Good Evening";
      meridian = "PM";
    }
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

    const result = response.data;
    // console.log(result);
    res.render("result.ejs", {
      tempData: Math.floor(result.main.temp),
      city: result.name,
      currentDate: formattedDate,
      message: message,
      time: time,
      meridian: meridian,
      humidity: result.main.humidity,
      wind: result.wind.speed,
      description: result.weather[0].description,
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: `There is no such city in this world please enter a correct one.`,
    });
  }
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
