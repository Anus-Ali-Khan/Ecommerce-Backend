require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const verifyJWT = require("./middlewares/verifyJWT");
const PORT = process.env.PORT || 3500;

//Connect to Mongo DB
connectDB();

app.use(credentials);

app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser());

//auth routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));

//product routes
app.use("/products", verifyJWT, require("./routes/api/productRoutes"));

//user routes
app.use("/user", verifyJWT, require("./routes/api/userRoutes"));

//bid routes
app.use("/bid", verifyJWT, require("./routes/api/bidRoutes"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
