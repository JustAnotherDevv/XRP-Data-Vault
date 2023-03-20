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
  console.log(verifySignature(signature));
  //   console.log(verifySignature(signature, account));
  sessions.set(account, Date.now());
  return true;
};

const createDataVault = async (
  account,
  requiresWhietelist,
  requiresNft,
  whitelistedAdresses,
  ipfsData
) => {
  vaults.push({
    owner: account,
    whitelist: requiresWhietelist,
    whitelistedAdresses: whitelistedAdresses,
    requiresNft: requiresNft,
    data: ipfsData,
  });
  console.log(vaults);
  return true;
};

const getVaultData = async (account, vaultId) => {
  if (vaultId >= vaults.length)
    throw new Error("Can't get data for nonexisting vault!");
  return vaults[vaultId];
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

app.get("/api/addVault", (req, res) => {
  (async () => {
    try {
      const {
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        ipfsData,
      } = await req.query;
      console.log(
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        ipfsData
      );
      return res.send({
        result: await createDataVault(
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

module.exports = app;
