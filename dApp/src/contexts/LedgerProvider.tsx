import React, { createContext, useCallback, useEffect, useState } from "react";
import { Xumm } from "xumm";

export const LedgerContext = createContext({
  xummInstance: null,
  account: null,
  chainId: null,
  connected: false,
  connect: () => {},
  disconnect: () => {},
  getData: () => {},
});

const LedgerProvider = ({ children }) => {
  const [xummInstance, setXummInstance] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const connect = async () => {
    console.log("Logged in: ", xummInstance);
    setInitialized(true);
    await xummInstance.authorize();
    setConnected(true);
    await xummInstance.user.account.then((a) => {
      setAccount(a ?? "");
      console.log(xummInstance);
      setXummInstance(xummInstance);
    });
    getData();
    return xummInstance;
  };

  const disconnect = async () => {
    xummInstance.logout();
    setAccount(null);
    setChainId(null);
    setConnected(false);
  };

  const getData = async () => {
    const payload = await xummInstance.payload?.createAndSubscribe(
      {
        Account: account,
        TransactionType: "SignIn",
        Fee: "12",
        Sequence: 5,
        SetFlag: 5,
        MessageKey:
          "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      },
      (event) => {
        // Return if signed or not signed (rejected)
        console.log(JSON.stringify(event.data, null, 2));
        // Only return (websocket will live till non void)
        if (Object.keys(event.data).indexOf("signed") > -1) {
          return true;
        }
      }
    );

    console.log(`payload: `, payload);
    window.open(payload.created.next.always);

    return payload;
  };

  useEffect(() => {
    (async () => {
      const xumm = new Xumm("5dd3d912-ed57-4477-8a2d-db6fb7e3d241");
      await xumm.on("ready", async () => {
        // console.log(xummInstance);
        await setXummInstance(xumm);
        console.log("Ready (e.g. hide loading state of page)");
      });
    })();
  }, []);

  // useEffect(() => {
  //   console.log("initialized ", initialized);
  //   if (!initialized && xummInstance) {
  //     (async () => {
  //       console.log(xummInstance);
  //       const connectedAcc = xummInstance.user.account.then((a) => {
  //         console.log("a ", a);
  //         if (a.length != 0 && !initialized) {
  //           setInitialized(true);
  //           console.log("connecting");
  //           connect();
  //         }
  //         return a;
  //       });
  //     })();
  //   }
  // }, [xummInstance]);

  return (
    <LedgerContext.Provider
      value={{
        xummInstance,
        account,
        chainId,
        connected,
        connect,
        disconnect,
        getData,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export default LedgerProvider;
