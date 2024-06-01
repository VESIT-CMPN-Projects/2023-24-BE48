/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const { getContract, setContract } = require("../store");
const path = require("path");

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require("./CAUtil");

const { buildCCPOrg, buildWallet } = require("./AppUtil");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "basic";
const orgUserId = process.env.ORG_USER_ID || "org1";

let gateway;

const initialize = async () => {
  const walletPath = path.join(__dirname, "wallet");

  try {
    const mspOrg = `${orgUserId}MSP`;
    const caHostName = `ca.${orgUserId}.example.com`;
    const affiliation = `${orgUserId}.department1`;

    const ccp = buildCCPOrg(orgUserId);

    const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg);
    await registerAndEnrollUser(caClient, wallet, mspOrg, orgUserId, affiliation);

    gateway = new Gateway();

    try {
      await gateway.connect(ccp, {
        wallet,
        identity: orgUserId,
        discovery: { enabled: true, asLocalhost: true },
      });

      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);
      setContract(contract);
      console.log("\nConnected to gateway.");
    } catch (error) {
      console.error(`\nCouldn't connect to Gateway: ${error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\nFAILED to run the application: ${error}`);
    process.exit(1);
  }
};

const queryAllAssets = async (groupId) => {
  try {
    const contract = getContract();
    if (contract === null) {
      throw new Error("Contract not initialized!");
    }

    let result = await contract.evaluateTransaction("GetAllAssets");
    result = JSON.parse(result.toString());
    result = result.filter((msg) => msg.Group === groupId);
    return { result };
  } catch (error) {
    return { error };
  }
};

const createAsset = async (senderId, groupId, text, isFile, fileName, fileHash, fileSize) => {
  try {
    const contract = getContract();
    if (contract === null) {
      throw new Error("Contract not initialized!");
    }

    const currTime = Date.now().toString();
    const message = await contract.submitTransaction(
      "CreateAsset",
      senderId,
      groupId,
      text,
      currTime,
      isFile,
      fileName,
      fileHash,
      fileSize
    );
    return { message: message.toString() };
  } catch (error) {
    return { error };
  }
};

const disconnectGateway = async () => {
  try {
    gateway.disconnect();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { initialize, queryAllAssets, createAsset, disconnectGateway };
