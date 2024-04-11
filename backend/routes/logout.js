const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (req.session) {
    // destroy the session
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Failed to logout." });
      } else {
        res.status(200).json({ message: "Logged out successfully" });
      }
    });
  } else {
    // no session to destroy
    res.status(200).json({ message: "No active session" });
  }
});

module.exports = router;
