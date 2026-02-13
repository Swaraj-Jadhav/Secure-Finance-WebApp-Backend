const accountService = require("./account.service");

const DEMO_USER_ID = "user_123"; // Simulated logged in user

const getProfile = (req, res) => {
  try {
    const profile = accountService.getProfile(DEMO_USER_ID);

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAccount = (req, res) => {
  try {
    const updated = accountService.updateAccount(
      DEMO_USER_ID,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBalance = (req, res) => {
  const balance = accountService.getBalance();
  res.json(balance);
};

const deactivateAccount = (req, res) => {
  const result = accountService.deactivateAccount();
  res.json(result);
};

module.exports = {
  getProfile,
  getBalance,
  updateAccount,
  deactivateAccount,
};
