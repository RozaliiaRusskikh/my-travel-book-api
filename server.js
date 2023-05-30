//add dependencies
const cors = require("cors");
const express = require("express");
const app = express();

require("dotenv").config();
let { PORT, CLIENT_URL } = process.env;
PORT = PORT || 5050;

app.use(cors());

const postsRoutes = require("./routes/postsRoute");

//middleware
app.use(express.json());
app.use(express.static("./public/images"));

app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
