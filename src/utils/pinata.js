const axios = require('axios');

const pinJSONToIPFS = async (jsonData) => {
    try {
        const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', jsonData, {
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`, 
                'Content-Type': 'application/json'
            }
        });
        return res.data.IpfsHash; 
    } catch (error) {
        console.error("Pinata Pin Error:", error.response ? error.response.data : error.message);
        throw new Error('Failed to pin data to Pinata IPFS');
    }
};

const fetchFromIPFS = async (cid) => {
    try {
        const gateway = process.env.PINATA_GATEWAY; 
        const res = await axios.get(`${gateway}/ipfs/${cid}`);
        return res.data;
    } catch (error) {
        console.error(`IPFS Fetch Error for CID ${cid}:`, error.message);
        throw new Error('Failed to fetch data from IPFS');
    }
};

module.exports = { pinJSONToIPFS, fetchFromIPFS };