const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDb } = require("./db.js");

router.post("/getGroupsList", async (req, res) => {
    const groupName = req.body.groupName;
    try {
        const db = getDb();
        const groups = await db
            .collection("groups")
            .find({ name: groupName })
            .sort({ name: 1 })
            .toArray();

        if (groups.length === 0) {
            res.status(200).json({ message: "No groups found" });
            return;
        }
        res.status(200).json({ groups: groups });
    } catch (err) {
        res.status(500).json({ error: err });
    }

    router.post("/sendRequest", async (req, res) => {
        try {
            const groupId = req.body.groupId;
            const db = getDb();

            const collection = await db
                .collection("groups")
                .findOne({ _id: new ObjectId(groupId) });
            if (collection === null) {
                throw new Error("Group with this id not found!");
            }
            const user = req.session.user;
            const userId = user._id;
            const userName = user.uname;
            const userEmail = user.email;
            const adminId = collection.admin;

            const request = {
                adminId: adminId,
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                groupId: groupId,
                groupName: collection.name,
            };

            await db.collection("joinrequests").insertOne(request);

            res.status(200).json({ message: "Request sent successfully" });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    });
});

router.get("/getRequests", async (req, res) => {
    try {
        const db = getDb();
        const user = req.session.user;
        const userId = user._id;
        const requests = await db
            .collection("joinrequests")
            .find({ adminId: new ObjectId(userId) })
            .toArray();

        if (requests.length === 0) {
            res.status(200).json({ message: "No requests found" });
            return;
        }
        res.status(200).json({ requests: requests });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post("/acceptRequest", async (req, res) => {
    try {
        const db = getDb();
        const requestId = new ObjectId(req.body.requestId);
        const groupId = new ObjectId(req.body.groupId);
        const userId = new ObjectId(req.body.userId);

        const user = await db.collection("users").findOne({ _id: userId });
        if (user === null) {
            throw new Error("User with this id not found!");
        }

        const userGroups = user.groups;
        userGroups.push(groupId);

        await db.collection("users").updateOne({ _id: userId }, { $set: { groups: userGroups } });

        const group = await db.collection("groups").findOne({ _id: groupId });
        if (group === null) {
            throw new Error("Group with this id not found!");
        }

        const members = group.members;
        members.push(userId);

        await db.collection("groups").updateOne({ _id: groupId }, { $set: { members: members } });

        await db.collection("joinrequests").deleteOne({ _id: requestId });

        res.status(200).json({ message: "Request accepted successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post("/createGroup", async (req, res) => {
    try {
        const db = getDb();
        const user = req.session.user;
        const userId = new ObjectId(user._id);
        const groupName = req.body.groupName;

        const group = {
            name: groupName,
            admin: userId,
            members: [userId],
        };

        // Creating the group
        const result = await db.collection("groups").insertOne(group);

        // Adding the group to the user's groups
        const userGroups = user.groups;
        userGroups.push(new ObjectId(result.insertedId));

        await db.collection("users").updateOne({ _id: userId }, { $set: { groups: userGroups } });

        res.status(200).json({ message: "Group created successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
