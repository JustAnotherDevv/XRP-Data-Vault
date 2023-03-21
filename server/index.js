const express = require("express");
const xrpl = require("xrpl");
require("dotenv").config();
const fs = require("fs");
const verifySignature = require("verify-xrpl-signature").verifySignature;

const app = express();

const port = 4000;
app.listen(port, () => {
  console.log(`XRPL data vault server listening on port ${port}`);
});

let vaults = [];
let sessions = new Map();

const verifyUserSignature = async (account, signature) => {
  const verificationStatus = verifySignature(signature, account);
  console.log(verificationStatus);
  if (!verificationStatus.signatureValid)
    throw new Error("Incorrect signature.");
  if (verificationStatus.signedBy != account)
    throw new Error("Signature is from different account.");

  sessions.set(account, Date.now());
  return true;
};

/**
 * Checks for all NFTs owned by a particular address
 * @param {string} address - The wallet address to check
 * @param {string} [taxon] - An optional parameter used to filter the NFTs by taxon
 * @returns {object[]} - An array of NFTs owned by the given address. If no NFTs are found, returns an empty array
 */
const getBatchNFTokens = async (address, taxon) => {
  try {
    if (!address) throw new Error("Can't get NFTs without account address.");
    if ((await this.checkIfAccountExists(address)) == false)
      throw new Error(`Account from request was not found om XRPL`);
    const client = new xrpl.Client(process.env.SELECTED_NETWORK);
    await client.connect();
    let nfts = await client.request({
      method: "account_nfts",
      account: address,
    });
    let accountNfts = nfts.result.account_nfts;
    //console.log("Found ", accountNfts.length, " NFTs in account ", address);
    while (true) {
      if (nfts["result"]["marker"] === undefined) {
        break;
      } else {
        nfts = await client.request({
          method: "account_nfts",
          account: address,
          marker: nfts["result"]["marker"],
        });
        accountNfts = accountNfts.concat(nfts.result.account_nfts);
      }
    }
    client.disconnect();
    if (taxon) return accountNfts.filter((a) => a.NFTokenTaxon == taxon);
    return accountNfts;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const checkNftOwnership = async (account, owner) => {
  const accountNfts = await getBatchNFTokens(account);

  for (let i = 0; i != accountNfts.length; i++) {
    if (accountNfts[i].Issuer == owner) {
      return true;
    }
    if (i == accountNfts.length - 1) return false;
  }
};

const createDataVault = async (
  name,
  account,
  requiresWhietelist,
  requiresNft,
  whitelistedAdresses,
  ipfsData
) => {
  vaults.push({
    name: name,
    owner: account,
    whitelist: requiresWhietelist,
    whitelistedAdresses: whitelistedAdresses,
    requiresNft: requiresNft,
    data: ipfsData,
  });
  console.log(vaults);
  return true;
};

const getSessionStatus = async (account) => {
  const userSessionTime = sessions.get(account);
  const timeDifferece = Date.now() - userSessionTime;
  console.log(timeDifferece);
  if (timeDifferece > 600000) return false;
  return true;
};

const getVaultData = async (account, vaultId) => {
  const doesUserHaveSession = sessions.has(account);
  console.log(doesUserHaveSession);
  if (!doesUserHaveSession)
    throw new Error(
      "User have to authenticate before retrieving data from vault."
    );

  if (await !getSessionStatus(account))
    throw new Error("User session have expired.");

  if (
    vaults[vaultId].whitelist &&
    vaults[vaultId].whitelistedAdresses.indexOf(account) == -1
  )
    throw new Error("User is not whitelisted.");

  if (vaults[vaultId].requiresNft)
    if (!checkNftOwnership(account, vaults[vaultId].owner))
      throw new Error("User does not have required NFT.");

  if (vaultId >= vaults.length)
    throw new Error("Can't get data for nonexisting vault.");
  return vaults[vaultId];
};

const getPublicVaults = async () => {
  if (vaults.length <= 0) return false;

  const vaultsWithoutSecret = vaults.map((obj) => {
    const { data, ...rest } = obj;
    return rest;
  });

  console.log(vaultsWithoutSecret);

  return vaultsWithoutSecret;
};

/**
 * Uploads provided data to IPFS
 * @param {object} data - Metadata object
 * @returns {string} path - hash of file uploaded to IPFS
 */
const postToIPFS = async (data) => {
  const { create } = await import("ipfs-http-client");
  let ipfs;
  let path = "";
  try {
    const INFURA_DATA = process.env.INFURA_ID + ":" + process.env.INFURA_SECRET;
    const authorization =
      "Basic " + Buffer.from(INFURA_DATA, "utf8").toString("base64");
    ipfs = create({
      url: "https://infura-ipfs.io:5001/api/v0",
      headers: {
        authorization,
      },
    });
    const result = await ipfs.add(data);
    path = `https://ipfs.io/ipfs/${result.path}`;
    //path = `ipfs://${result.path}`;
  } catch (error) {
    console.error("IPFS error ", error);
    return error;
  }
  return path;
};

app.get("/api/login", (req, res) => {
  (async () => {
    try {
      const { account, signature } = await req.query;
      console.log(account, signature);
      return res.send({
        result: await verifyUserSignature(account, signature),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.get("/api/checkUserSession", (req, res) => {
  (async () => {
    try {
      const { account } = await req.query;
      console.log(account);

      return res.send({
        result: await getSessionStatus(account),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.get("/api/addVault", (req, res) => {
  (async () => {
    try {
      const {
        name,
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        markdownText,
      } = await req.query;
      console.log(
        name,
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        markdownText
      );

      const ipfsData = await postToIPFS(JSON.stringify(markdownText));

      return res.send({
        result: await createDataVault(
          name,
          account,
          requiresWhietelist,
          requiresNft,
          whitelistedAdresses,
          ipfsData
        ),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.get("/api/getVault", (req, res) => {
  (async () => {
    try {
      const { account, vaultId } = await req.query;
      console.log(account, vaultId);
      return res.send({
        result: await getVaultData(account, vaultId),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

app.get("/api/displayVaults", (req, res) => {
  (async () => {
    try {
      //   const { account, vaultId } = await req.query;
      return res.send({
        result: await getPublicVaults(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        Error: `${error}`,
      });
    }
  })();
});

module.exports = app;
