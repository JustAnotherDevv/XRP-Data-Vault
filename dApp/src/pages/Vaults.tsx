import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { LedgerContext } from "../contexts/LedgerProvider";
import Article from "../components/Article";

function Vaults() {
  const [userAddress, setUserAddress] = useState(
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  );
  const [payloadUuid, setPayloadUuid] = useState("");
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState("");
  const [openPayloadUrl, setOpenPayloadUrl] = useState("");
  const { xummInstance, account, chainId, connected, connect, disconnect } =
    useContext(LedgerContext);

  async function signInWithXumm() {
    const res = await connect();
  }

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <>
      <div className="min-w-screen bg-gray-900">
        <div className="flex flex-col items-center p-5">
          <p className="text-6xl font-bold my-64 text-gray-300">
            Your token-gated experience begins here
          </p>
          {!account ? (
            <button
              className="text-green-300 border border-green-300 rounded-xl px-5 py-2"
              onClick={signInWithXumm}
            >
              XUMM login
            </button>
          ) : (
            <Article />
          )}
        </div>
      </div>
    </>
  );
}

export default Vaults;
