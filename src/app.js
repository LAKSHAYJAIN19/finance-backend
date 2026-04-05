const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://finance-frontend-nine-amber.vercel.app",
  credentials: true
}));
app.use(express.json());

// ✅ THIS LINE IS CRITICAL
app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("API Running");
});

module.exports = app;
