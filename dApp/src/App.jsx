import { useState, useEffect } from "react";
import "./App.css";
import {
  Client,
  getBalanceChanges,
  rippleTimeToISOTime,
  rippleTimeToUnixTime,
} from "xrpl";

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

  function truncateStr(str, n = 6) {
    if (!str) return "";
    return str.length > n
      ? str.substr(0, n - 1) +
          "..." +
          str.substr(str.length - n, str.length - 1)
      : str;
  }

  useEffect(() => {
    (async () => {
      console.log(await getBatchAccountTx(userAddress));
    })();
  }, []);

  return (
    <div className="min-w-screen">
      <div className="flex flex-col items-center p-5">
        <p className="text-6xl font-bold mt-12 mb-6 text-success">
          Unlocking XRP potential app
        </p>
      </div>
    </div>
  );
}

export default App;
