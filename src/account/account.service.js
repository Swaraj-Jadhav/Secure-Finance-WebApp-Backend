let accountDB = {
  id: "user_123",
  name: "Swaraj",
  email: "swaraj@email.com",
  walletAddress: "0xABC123",
  isActive: true,
  createdAt: new Date(),
  balance: 10.5,
};

const getProfile = (userId) => {
  if (!accountDB || accountDB.id !== userId) {
    throw new Error("Account not found");
  }

  return {
    id: accountDB.id,
    name: accountDB.name,
    email: accountDB.email,
    walletAddress: accountDB.walletAddress,
    createdAt: accountDB.createdAt,
  };
};

const getBalance = () => {
  if (!accountDB || accountDB.id !== userId) {
    throw new Error("Account not found");
  }
  return {
    balance: accountDB.balance,
  };
};

const updateAccount = (userId, updateData) => {
  if (!accountDB || accountDB.id !== userId) {
    throw new Error("Account not found");
  }

  const allowedFields = ["name", "email"];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      accountDB[field] = updateData[field];
    }
  });

  return {
    message: "Account updated successfully",
    profile: getProfile(userId),
  };
};

const deactivateAccount = () => {
  return {
    message: "Account deactivated",
  };
};

module.exports = {
  getProfile,
  getBalance,
  updateAccount,
  deactivateAccount,
};
