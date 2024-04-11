require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { initialize, disconnectGateway } = require("./routes/fabric_functions/fabricUtils.js");
const { connectToDb } = require("./routes/db.js");
let { getContract, getClients } = require("./routes/store.js");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const SECRET_KEY = process.env.SESSION_SECRET || "secret";
const IP_ADDRESS = process.env.IP_ADDRESS || "localhost";

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/api", require("./routes/index.js"));
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const UPDATE_MESSAGE_EVENT = "UpdateMessage";
const contractListener = async (event) => {
  if (event.eventName === UPDATE_MESSAGE_EVENT) {
    console.log(`\nContract listener: ${UPDATE_MESSAGE_EVENT} event received.`);

    // Iterate through connected clients and send events to each one
    const clients = getClients();
    clients.forEach((client) => {
      // Send event data. Needs to be in this format.
      client.write(`data: ${JSON.stringify(event)}\n\n`);
      console.log(`\n${UPDATE_MESSAGE_EVENT} event sent to client.`);
    });
  }
};

// Disconnect from the gateway and remove the contract listener
const disconnect = async () => {
  try {
    const contract = getContract();
    if (contract === null) {
      throw new Error("Contract not initialized!");
    }

    await contract.removeContractListener(contractListener);

    console.log("\nContract listener removed.");
    const res = await disconnectGateway();
    if (!res) {
      throw new Error("Failed to disconnect from gateway");
    }

    console.log("\nDisconnected from gateway.");
    res.status(200).json({ message: "Disconnected successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occured while disconnecting" });
  } finally {
    process.exit();
  }
};

// Handle Ctrl+C
process.on("SIGINT", disconnect);

// Handle kill
process.on("SIGTERM", disconnect);

connectToDb(async (err) => {
  if (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
  console.log("Connected to Database.");

  await initialize();

  const contract = getContract();

  if (contract) {
    await contract.addContractListener(contractListener);
    console.log("\nContract listener added.");
  }

  app.listen(PORT, IP_ADDRESS, async () => {
    console.log(`Example app listening on http://${IP_ADDRESS}:${PORT}`);
  });
});
