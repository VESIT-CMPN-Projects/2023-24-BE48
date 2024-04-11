const { MongoClient } = require("mongodb");

let db;

module.exports = {
  connectToDb: async (cb) => {
    try {
      const connection = await MongoClient.connect(
        "mongodb://localhost:27017/BE_users"
      );
      db = connection.db();
      cb();
    } catch (error) {
      console.log("Error while connecting to Database!!");
      cb(error);
    }
  },
  getDb: () => {
    if (!db) {
        throw Error("Database not found!!")
    }
    return db
  },
};
