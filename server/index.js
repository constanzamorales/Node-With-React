const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

// Instead of importing with a const, we immediately call that authRoutes() function
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5050;
app.listen(PORT);
