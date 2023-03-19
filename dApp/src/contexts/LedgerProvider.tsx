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
    console.log(xummInstance);
    await xummInstance.authorize();
    setConnected(true);
    await xummInstance.user.account.then((a) => {
      setAccount(a ?? "");
      console.log(xummInstance);
      setXummInstance(xummInstance);
      return xummInstance;
    });
    return xummInstance;
  };

  const disconnect = async () => {
    xummInstance.logout();
    setAccount(null);
    setChainId(null);
    setConnected(false);
  };

  const getData = async () => {
    console.log(xummInstance);
    return xummInstance;
  };

  useEffect(() => {
    (async () => {
      const xumm = new Xumm("5dd3d912-ed57-4477-8a2d-db6fb7e3d241");
      await xumm.on("ready", async () => {
        console.log(xummInstance);
        await setXummInstance(xumm);
        console.log("Ready (e.g. hide loading state of page)");
      });
    })();
  }, []);

  useEffect(() => {
    if (!initialized && xummInstance) {
      (async () => {
        console.log(xummInstance);
        setInitialized(true);

        const connectedAcc = await xummInstance.user.account.then((a) => {
          return a;
        });

        if (connectedAcc.length != 0) connect();
      })();
    }
  }, [xummInstance]);

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
