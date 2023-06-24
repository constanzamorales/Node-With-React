const express = require("express");
require("./services/passport");

const app = express();

// Instead of importing with a const, we immediately call that authRoutes() function
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5050;
app.listen(PORT);
