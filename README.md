# XRP Data vault

# Project created during Unlocking the Potential of XRP Ledger hackathon

## Features

Data vault allows for storing and accessing wallet-permissioned files and documents.

## Potential use-cases

- Sharing wallet-to-wallet encrypted private files.
- Token-gated content for NFT collection holders.
- Resources shared only to DAO token holders.

## dApp

**ToDo**


## Backend

This is a Express.js server that provides a RESTful API to create and access XRPL data vaults. These vaults allow you to store data in a decentralized manner using the XRP Ledger.

### Prerequisites

- Node.js installed on your system
- An Infura account to upload data to the IPFS network
- An XRPL account to interact with the ledger

### Installation

- Clone this repository to your local machine

- Navigate to the repository directory in your terminal

- Install dependencies by running `npm install`

- Create a `.env` file in the root directory and add the following variables:

`INFURA_ID=<Infura project ID>`
`INFURA_SECRET=<Infura project secret>`
`SELECTED_NETWORK=<Selected XRP network RPC>` e.g. `wss://s.devnet.rippletest.net:51233`

Where `INFURA_ID` and `INFURA_SECRET` are your Infura project ID and secret, respectively.
`SELECTED_NETWORK` is the XRPL network you want to connect to.

- Start the server by running npm start


