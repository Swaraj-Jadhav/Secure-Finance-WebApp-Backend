const logout = (req, res) => {

    res.status(200).json({ 
        message: "Successfully logged out. Please clear tokens from client storage." 
    });
};

module.exports = logout;