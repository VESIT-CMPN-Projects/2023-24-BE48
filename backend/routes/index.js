const express = require("express");
const router = express.Router();

const loginRoute = require("./login");
const registerRoute = require("./register");
const logoutRoute = require("./logout");
const eventsRoute = require("./events");
const chatUtilsRoute = require("./chatUtils");
const groupsRoute = require("./groups");

router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/logout", logoutRoute);
router.use("/events", eventsRoute);
router.use("/chat", chatUtilsRoute);
router.use("/groups", groupsRoute);

module.exports = router;