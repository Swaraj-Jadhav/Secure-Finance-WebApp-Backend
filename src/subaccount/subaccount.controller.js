const subaccountService = require("./subaccount.service");


const DEMO_USER_ID = "user_123";   // Simulated logged in user 

const createSubaccount = async (req, res) => {
  try {
    const result = await subaccountService.createSubaccount(
      DEMO_USER_ID,
      req.body
    );

    res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const listSubaccounts = async (req, res) => {
  try {
    const result = await subaccountService.listSubaccounts(DEMO_USER_ID);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubaccount = async (req, res) => {
  try {
    const result = await subaccountService.getSubaccount(
      DEMO_USER_ID,
      req.params.id
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSubaccount = async (req, res) => {
  try {
    const result = await subaccountService.deleteSubaccount(
      DEMO_USER_ID,
      req.params.id
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubaccount,
  listSubaccounts,
  getSubaccount,
  deleteSubaccount,
};
