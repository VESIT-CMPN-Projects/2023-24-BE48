/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class AssetTransfer extends Contract {
  async CreateAsset(ctx, senderId, groupId, text, currTime, isFile, fileName, fileHash, fileSize) {
    const textMessage = {
      ID: currTime,
      Sender: senderId,
      Group: groupId,
      Text: text,
      IsFile: isFile,
      FileName: fileName,
      FileHash: fileHash,
      FileSize: fileSize,
    };

    await ctx.stub.putState(currTime, Buffer.from(stringify(sortKeysRecursive(textMessage))));
    await ctx.stub.setEvent("UpdateMessage", Buffer.from('{"text": "New message added"}'));

    return JSON.stringify(textMessage);
  }

  async GetAllAssets(ctx) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = AssetTransfer;
