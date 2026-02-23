const secrets = require('secrets.js-grempe'); 
const { reconstructHash } = require('../utils/sss');
const { fetchFromIPFS, pinJSONToIPFS } = require('../utils/pinata');

const recoverAccount = async (req, res) => {
    try {
        const { cids, walletAddress } = req.body;

        if (!cids || cids.length < 3) {
            return res.status(400).json({ error: "Need at least 3 valid CIDs to initiate recovery" });
        }

        const sharePromises = cids.slice(0, 3).map(cid => fetchFromIPFS(cid));
        const fetchedData = await Promise.all(sharePromises);
        const oldShares = fetchedData.map(data => data.share);

     
        const originalHash = reconstructHash(oldShares);

        
        const newShares = secrets.share(originalHash, 5, 3); 

        const newCidPromises = newShares.map(share => 
            pinJSONToIPFS({ pinataContent: { share, walletAddress } })
        );
        const newCids = await Promise.all(newCidPromises);

        res.status(200).json({
            message: "Account recovered. Discard your old CIDs and save these new ones.",
            newCids: newCids
        });
    } catch (error) {
        res.status(500).json({ error: "Recovery failed", details: error.message });
    }
};

module.exports = recoverAccount;
