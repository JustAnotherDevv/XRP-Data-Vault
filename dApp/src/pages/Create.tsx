import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { LedgerContext } from "../contexts/LedgerProvider";
import Article from "../components/Article";

function Create() {
  const [userAddress, setUserAddress] = useState(
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  );
  const [payloadUuid, setPayloadUuid] = useState("");
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState("");
  const [openPayloadUrl, setOpenPayloadUrl] = useState("");
  const { xummInstance, account, chainId, connected, connect, disconnect } =
    useContext(LedgerContext);
  const [formValues, setFormValues] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      name,
      account,
      requiresWhietelist,
      requiresNft,
      whitelistedAdresses,
      markdownText,
    } = formValues;

    const response = await fetch("/api/addVault", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        account,
        requiresWhietelist,
        requiresNft,
        whitelistedAdresses,
        markdownText,
      }),
    });

    // console.log(
    //   JSON.stringify({
    //     name,
    //     account,
    //     requiresWhietelist,
    //     requiresNft,
    //     whitelistedAdresses,
    //     markdownText,
    //   })
    // );

    if (response.ok) {
      console.log(response);
      // handle successful response
    } else {
      console.log(response);
      // handle error response
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

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
          <p className="text-6xl font-bold mt-64 mb-16 text-gray-300">
            Create new vault
          </p>
          {!account ? (
            <button
              className="text-green-300 border border-green-300 rounded-xl px-5 py-2"
              onClick={signInWithXumm}
            >
              XUMM login
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="py-6 px-20 rounded-lg bg-gray-800"
            >
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="account"
                >
                  Account
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="account"
                  type="text"
                  placeholder="Enter account"
                  name="account"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="requiresWhietelist"
                >
                  Required whitelist
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="requiresWhietelist"
                  type="text"
                  placeholder="Enter requiresWhietelist"
                  name="requiresWhietelist"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="requiresNft"
                >
                  Required NFT
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="requiresNft"
                  type="text"
                  placeholder="Enter requiresNft"
                  name="requiresNft"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="whitelistedAdresses"
                >
                  Whitelisted adresses
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="whitelistedAdresses"
                  type="text"
                  placeholder="Enter whitelisted adresses"
                  name="whitelistedAdresses"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 font-bold mb-2"
                  htmlFor="markdownText"
                >
                  Markdown text
                </label>
                <input
                  className="bg-gray-900 shadow appearance-none rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  id="markdownText"
                  type="text"
                  placeholder="Enter markdown text"
                  name="markdownText"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="center content-center self-center text-center bg-green-400 hover:bg-green-500 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Create;
