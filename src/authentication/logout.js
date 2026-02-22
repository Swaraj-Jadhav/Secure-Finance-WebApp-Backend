const logout = (req, res) => {
    // In a stateless JWT architecture, the backend just confirms the action.
    // The frontend MUST delete the accessToken and refreshToken from memory/storage.
    res.status(200).json({ 
        message: "Successfully logged out. Please clear tokens from client storage." 
    });
};

module.exports = logout;