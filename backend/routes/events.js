const express = require("express");
const router = express.Router();
const { getClients, addClient, removeClient } = require("./store.js");

// Handle the SSE route
router.get("/:id", (req, res) => {
  console.log("\nNew client connected to event stream.", req.params.id);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Add the client's response object to the array when a new connection is established
  addClient(res);
  console.log(`\n${getClients().length} client(s) connected.`);

  // Remove the response object from the array when the connection is closed
  req.on("close", () => {
    removeClient(res);
    console.log(`\n${getClients().length} client(s) connected.`);
  });
});

module.exports = router;
