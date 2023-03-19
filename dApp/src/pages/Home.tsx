import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { LedgerContext } from "../contexts/LedgerProvider";
import Article from "../components/Article";

function Home() {
  const [userAddress, setUserAddress] = useState(
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  );
  const [payloadUuid, setPayloadUuid] = useState("");
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState("");
  const [openPayloadUrl, setOpenPayloadUrl] = useState("");
  const { xummInstance, account, chainId, connected, connect, disconnect } =
    useContext(LedgerContext);

  const createPayload = async () => {
    // const payload = await xumm.payload?.createAndSubscribe(
    //   {
    //     TransactionType: "Payment",
    //     Destination: "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
    //     Account: account,
    //     Amount: String(1337),
    //   },
    //   (event) => {
    //     // Return if signed or not signed (rejected)
    //     setLastPayloadUpdate(JSON.stringify(event.data, null, 2));
    //     // Only return (websocket will live till non void)
    //     if (Object.keys(event.data).indexOf("signed") > -1) {
    //       return true;
    //     }
    //   }
    // );
    // if (payload) {
    //   setPayloadUuid(payload.created.uuid);
    //   if (xumm.runtime.xapp) {
    //     xumm.xapp?.openSignRequest(payload.created);
    //   } else {
    //     if (
    //       payload.created.pushed &&
    //       payload.created.next?.no_push_msg_received
    //     ) {
    //       setOpenPayloadUrl(payload.created.next.no_push_msg_received);
    //     } else {
    //       window.open(payload.created.next.always);
    //     }
    //   }
    // }
    // return payload;
  };

  async function signInWithXumm() {
    console.log(xummInstance);
    console.log(account);
  }

  useEffect(() => {
    (async () => {
      console.log(xummInstance);
      console.log(account);
    })();
  }, []);

  return (
    <>
      <div className="min-w-screen bg-gray-900">
        <div className="flex flex-col items-center p-5">
          <p className="text-6xl font-bold my-64 text-success text-gray-300">
            Your token-gated experience begins here
          </p>
          {!account ? (
            <button onClick={signInWithXumm}>Sign in</button>
          ) : (
            <Article />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
