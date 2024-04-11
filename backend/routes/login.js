const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getDb } = require("./db.js");

const verifyUser = async (db, emailId, password) => {
  const collection = await db.collection("users").findOne({ email: emailId });
  if (collection === null) {
    throw new Error("Account with this email id not found!");
  }

  if (!(await bcrypt.compare(password, collection.password))) {
    throw new Error("Incorrect Password!");
  }

  return collection;
};

router.post("/", async (req, res) => {
  try {
    const emailId = req.body.username;
    const password = req.body.password;
    if (!emailId || !password) {
      return res.status(400).json({ error: "Email ID and Password is required" });
    }

    const db = getDb();

    const collection = await verifyUser(db, emailId, password);
    const user = {
      _id: collection._id,
      email: collection.email,
      uname: collection.uname,
      groups: collection.groups,
    };

    console.log("\nUser logged in: ", user.email);

    req.session.user = user;
    
    res.status(200).json({ message: "Logged in successfully", user: user });
  } catch (error) {
    console.log(error.toString());
    res.status(500).json({ error: error, message: error.message });
  }
});

module.exports = router;
