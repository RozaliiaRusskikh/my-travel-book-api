//add dependencies
const express = require("express");
const app = express();

const cors = require("cors");

require("dotenv").config({path: "./.env"});
let { CLIENT_URL, PORT } = process.env;
PORT = PORT || 5050;

const postsRoutes = require("./routes/postsRoute");

//middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use(express.static("./public/images"));

app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
