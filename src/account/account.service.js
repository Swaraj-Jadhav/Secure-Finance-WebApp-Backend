const MainAccount = require("../models/Account.model");

const getProfile = async (userId) => {
  const account = await MainAccount.findOne({ userId });

  if (!account) {
    throw new Error("Account not found");
  }

  return {
    id: account.userId,
    name: account.name,
    email: account.email,
    walletAddress: account.walletAddress,
    createdAt: account.createdAt,
  };
};


const getBalance = async (userId) => {
  const account = await MainAccount.findOne({ userId });

  if (!account) {
    throw new Error("Account not found");
  }

  return {
    balance: account.balance,
  };
};


const updateAccount = async (userId, updateData) => {
  const account = await MainAccount.findOne({ userId });

  if (!account) {
    throw new Error("Account not found");
  }

  const allowedFields = ["name", "email"];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      account[field] = updateData[field];
    }
  });

  await account.save();

  return {
    message: "Account updated successfully",
    profile: {
      id: account.userId,
      name: account.name,
      email: account.email,
      walletAddress: account.walletAddress,
      createdAt: account.createdAt,
    },
  };
};


const deactivateAccount = async (userId) => {
  const account = await MainAccount.findOne({ userId });

  if (!account) {
    throw new Error("Account not found");
  }

  account.status = "deleted"; // soft delete
  account.isActive = false;

  await account.save();

  return {
    message: "Account deactivated successfully",
  };
};

module.exports = {
  getProfile,
  getBalance,
  updateAccount,
  deactivateAccount,
};