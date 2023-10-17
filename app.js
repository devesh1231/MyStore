require("dotenv").config();
const express = require("express");

const app = express();

const mongoose = require("mongoose");
const products = require("./constant/productsdata");
require("./db/conn");
const cookieParser = require("cookie-parser");

const Products = require("./models/productsSchema");

const DefaultData = require("./defaultdata");

const cors = require("cors");
const router = require("./routes/router");
const whitelist = ["http://localhost:3000" /** other domains if any */];
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(router);

const port = 8005;

app.listen(port, () => {
  console.log(`server is running on port number ${port}`);
});

DefaultData();
