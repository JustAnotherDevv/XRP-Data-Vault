import { useState, useEffect, useContext, useCallback } from "react";
import "./App.css";
import {
  Client,
  getBalanceChanges,
  rippleTimeToISOTime,
  rippleTimeToUnixTime,
} from "xrpl";
import Navbar from "./components/layout/Navbar";
import LedgerProvider from "./contexts/LedgerProvider.tsx";
import { LedgerContext } from "./contexts/LedgerProvider.tsx";
import Home from "./pages/Home";

async function getBatchAccountTx(address) {
  try {
    if (!address || address.length == 0)
      throw new Error(
        `You need to provide proper XRPL address to use this function`
      );
    const client = new Client("wss://xrplcluster.com");
    await client.connect();
    let txs = await client.request({
      method: "account_tx",
      account: address,
    });
    let accountTxs = txs.result.transactions;
    for (;;) {
      console.log(accountTxs.length);
      if (txs["result"]["marker"] === undefined) {
        break;
      } else {
        txs = await client.request({
          method: "account_tx",
          account: address,
          marker: txs["result"]["marker"],
        });
        accountTxs = accountTxs.concat(txs.result.transactions);
      }
    }
    client.disconnect();
    return accountTxs;
  } catch (error) {
    console.error(error);
    // return error;
    return [];
  }
}

function App() {
  const [userAddress, setUserAddress] = useState(
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  );
  const { xummInstance, account, chainId, connected } =
    useContext(LedgerContext);

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <>
      <LedgerProvider>
        <div className="min-w-screen h-screen bg-gray-900">
          <Navbar />
          <Home />
        </div>
      </LedgerProvider>
    </>
  );
}

export default App;
