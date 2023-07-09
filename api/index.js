const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const con = require("./database/appDatabase");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoute);

app.listen(process.env.PORT, () =>
  console.log(`this api is listening to port ${process.env.PORT}`)
);
