//add dependencies
const cors = require("cors");
const express = require("express");
const app = express();

require("dotenv").config();

let { PORT, CLIENT_URL } = process.env;
PORT = PORT || 5050;

const corsOptions = {
  origin: CLIENT_URL,
  // Allow Heroku proxy
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

const postsRoutes = require("./routes/postsRoute");

//middleware
app.use(express.json());
app.use(express.static("./public/images"));

app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
