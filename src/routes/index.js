const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const authController = require("../controllers/authController");
const recordController = require("../controllers/recordController");
const dashboardController = require("../controllers/dashboardController");

// Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// Records
router.get("/records", auth, authorize(["admin", "analyst"]), recordController.getRecords);
router.post("/records", auth, authorize(["admin", "analyst"]), recordController.createRecord);
router.patch("/records/:id", auth, authorize(["admin"]), recordController.updateRecord);
router.delete("/records/:id", auth, authorize(["admin"]), recordController.deleteRecord);

// Dashboard
router.get("/dashboard", auth, authorize(["admin", "analyst"]), dashboardController.summary);

module.exports = router;