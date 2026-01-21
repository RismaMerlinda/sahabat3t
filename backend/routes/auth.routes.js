const express = require("express");
const router = express.Router();
const { registerSchool, loginSekolah } = require("../controllers/authController");

router.post("/register", registerSchool);
router.post("/login", loginSekolah);

module.exports = router;
