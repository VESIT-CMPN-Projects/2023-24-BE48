const express = require("express")
const router = express.Router()
const { getDb } = require("./db")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    const { email, password, uname } = req.body
    if (!email || !password || !uname) {
        return res.status(400).json({ error: "Email ID, Username and Password is required" })
    }

    const db = getDb()
    const user = await db.collection("users").findOne({ email: email })
    if (user) {
        return res.status(400).json({ error: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = {
        email: email,
        password: hashedPassword,
        uname: uname,
        groups: []
    }
    await db.collection("users").insertOne(newUser)
    console.log("New user registered: ", email)

    req.session.user = newUser

    res.status(200).json({ message: "Registered successfully", user: newUser})
})

module.exports = router