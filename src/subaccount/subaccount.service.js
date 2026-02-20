require("dotenv").config();

const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY;

const PINATA_UPLOAD_URL =
  "https://api.pinata.cloud/pinning/pinJSONToIPFS";

/*
========================================
SIMULATED DB 
========================================
*/
let subaccountMappingDB = [];


function encryptData(data, key) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decryptData(encryptedData, key) {
  const parts = encryptedData.split(":");

  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

/*
========================================
PINATA UPLOAD
========================================
*/

async function uploadToPinata(jsonData) {
  try {
    const response = await axios.post(
      PINATA_UPLOAD_URL,
      {
        pinataContent: jsonData,
      },
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.IpfsHash;

  } catch (error) {
    console.error(
      "Pinata Upload Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to upload to IPFS");
  }
}

/*
========================================
PINATA FETCH 
========================================
*/

async function fetchFromGateway(cid) {
  try {
    const url = `${PINATA_GATEWAY}/ipfs/${cid}`;

    const response = await axios.get(url);

    return response.data;

  } catch (error) {
    console.error("Gateway Fetch Error:", error.message);
    throw new Error("Failed to fetch from IPFS Gateway");
  }
}

/*
========================================
CREATE SUBACCOUNT
========================================
*/

async function createSubaccount(mainAccountId, subData) {

  const subAccountId = uuidv4();

  const encryptionKey = crypto.randomBytes(32).toString("hex");

  const payload = {
    subAccountId,
    mainAccountId,
    ...subData,
    createdAt: new Date(),
  };

  const encryptedPayload = encryptData(
    JSON.stringify(payload),
    encryptionKey
  );

  const cid = await uploadToPinata({
    encryptedData: encryptedPayload,
  });

  const mapping = {
    subAccountId,
    mainAccountId,
    cid,
    encryptionKey, //sensitive
    keyHash: crypto
      .createHash("sha256")
      .update(encryptionKey)
      .digest("hex"),
    createdAt: new Date(),
  };

  subaccountMappingDB.push(mapping);

  return {
    subAccountId,
    cid,
  };
}


async function listSubaccounts(mainAccountId) {
  return subaccountMappingDB.filter(
    (s) => s.mainAccountId === mainAccountId
  );
}


async function getSubaccount(mainAccountId, subAccountId) {

  const mapping = subaccountMappingDB.find(
    (s) =>
      s.subAccountId === subAccountId &&
      s.mainAccountId === mainAccountId
  );

  if (!mapping) throw new Error("Subaccount not found");

  const ipfsData = await fetchFromGateway(mapping.cid);

  const decrypted = decryptData(
    ipfsData.encryptedData,
    mapping.encryptionKey
  );

  return JSON.parse(decrypted);
}



async function deleteSubaccount(mainAccountId, subAccountId) {

  const index = subaccountMappingDB.findIndex(
    (s) =>
      s.subAccountId === subAccountId &&
      s.mainAccountId === mainAccountId
  );

  if (index === -1) throw new Error("Subaccount not found");

  subaccountMappingDB.splice(index, 1);

  return { message: "Subaccount deleted" };
}


module.exports = {
  createSubaccount,
  listSubaccounts,
  getSubaccount,
  deleteSubaccount,
};
