const mongoose = require("mongoose");

const subAccountMappingSchema = new mongoose.Schema(
  {
    mainAccountId: {
      type: String,
      required: true,
    },

    subAccountId: {
      type: String,
      required: true,
      unique: true,
    },

    currentCid: {
      type: String,
      required: true,
    },

    cidHistory: [
      {
        cid: String,
        updatedAt: Date,
      },
    ],

    encryptionKey: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SubAccountMapping",
  subAccountMappingSchema
);