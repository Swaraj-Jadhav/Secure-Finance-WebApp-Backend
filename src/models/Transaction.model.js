const mongoose = require("mongoose");
const crypto = require("crypto");

const transactionSchema = new mongoose.Schema(
  {
    txHash: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(20).toString("hex"),
    },

    mainAccountId: {
      type: String,
      required: true,
    },

    fromSubAccountId: {
      type: String,
      required: true,
    },

    toSubAccountId: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },

    blockchainTxHash: {
      type: String, // optional for future smart contract integration
    },

    metadataCid: {
      type: String, // optional: store transaction metadata on IPFS
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);