const express = require("express");
const router = express.Router();
const { getDb } = require("./db.js");
const { ObjectId } = require("mongodb");
const { createAsset, queryAllAssets } = require("./fabric_functions/fabricUtils.js");
const multer = require("multer");
const upload = multer();
const FormData = require("form-data");
const fetch = require("node-fetch");

const IPFS_API_URL = process.env.IPFS_API_URL;

// Return all groups the user is a part of
router.get("/groups", async (req, res) => {
  const user = req.session.user;
  const updatedUser = await getDb()
    .collection("users")
    .findOne({ _id: new ObjectId(user._id) });

  if (!updatedUser) {
    res.status(500).json({ message: "Unable to retrieve user." });
    return;
  }

  const newUser = {
    _id: updatedUser._id,
    email: updatedUser.email,
    uname: updatedUser.uname,
    groups: updatedUser.groups,
  };

  req.session.user = newUser;

  try {
    let groupIds = updatedUser.groups.map((group) => new ObjectId(group));
    let groupNames = [];

    const db = getDb();

    const groups = await db
      .collection("groups")
      .find({ _id: { $in: groupIds } })
      .toArray();

    groups.forEach((group) => {
      groupNames.push(group.name);
    });

    res.status(200).json({ groupIds: groupIds, groupNames: groupNames });
  } catch (err) {
    res.status(500).json({ message: "Unable to retrieve groups." });
  }
});

// Get messages of a particular group
router.get("/groups/:id", async (req, res) => {
  const groupId = req.params.id;
  req.session.groupId = groupId;
  const result = await queryAllAssets(groupId);
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  const messages = result.result;
  res.status(200).json({ result: messages });
});

// To get group members of a particular group
router.get("/groupMembers", async (req, res) => {
  try {
    const db = getDb();
    const group = await db.collection("groups").findOne({ _id: req.session.groupId });
    const members = group.members;
    const memberIds = members.map((member) => new ObjectId(member));
    const adminId = group.admin;

    const users = await db
      .collection("users")
      .find({ _id: { $in: memberIds } })
      .toArray();

    const admin = users.find((user) => user._id === adminId);
    const adminName = admin.uname;

    const memberNames = users.filter((user) => user._id !== adminId).map((user) => user.uname);

    res.status(200).json({ memberNames: memberNames, adminName: adminName });
  } catch (err) {
    res.status(500).json({
      err: err.toString(),
      message: "Unable to retrieve group members.",
    });
  }
});

// Send a message
router.post("/sendMessage", async (req, res) => {
  const result = await createAsset(
    req.session.user._id,
    req.session.groupId,
    req.body.text,
    req.body.isFile,
    req.body.fileName,
    req.body.fileHash,
    req.body.fileSize
  );
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  const message = result.message;
  res.status(200).json({ message: message });
});

router.post("/senderName", async (req, res) => {
  try {
    const db = getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.body.senderId) });
    res.status(200).json({ senderName: user.uname });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while sending the message" });
  }
});

//Upload files to IPFS
router.post("/uploadFile", upload.single("file"), async (req, res) => {
  const formData = new FormData();
  formData.append("file", req.file.buffer, { filename: req.file.originalname });

  try {
    const response = await fetch(`${IPFS_API_URL}/api/v0/add`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Error adding file to IPFS" });
    }

    const result = await response.json();
    res.status(200).json({ fileHash: result.Hash });
  } catch (error) {
    console.error("Error adding file to IPFS:", error);
    res.status(500).json({ error: `Error adding file to IPFS ${error}` });
  }
});

//Download files from IPFS
router.post("/downloadFile", async (req, res) => {
  try {
    const response = await fetch(`${IPFS_API_URL}/api/v0/cat?arg=${req.body.fileHash}`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      return res.status(500).json({ error: "Error downloading file from IPFS" });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=${req.body.fileName}`);
    response.body.pipe(res);
  } catch (error) {
    console.error("Error downloading file from IPFS:", error);
    res.status(500).json({ error: "Error downloading file from IPFS" });
  }
});

module.exports = router;
