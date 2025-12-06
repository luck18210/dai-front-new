import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConnectionContextType {
  connected: boolean;
  setIsConnected: (value: boolean) => void;
  connectedWallet: string;
  setConnectedWallet: (value: string) => void;
  connectedChainId: number;
  setConnectedChainId: (value: number) => void;
  user: any;
  setUser: (value: any) => void;
  referralCode: any;
  setReferralCode: (value: string) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setIsConnected] = useState<boolean>(false);
  const [connectedWallet, setConnectedWallet] = useState<string>("");
  const [connectedChainId, setConnectedChainId] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string>("");

  return (
    <ConnectionContext.Provider
      value={{
        connected,
        setIsConnected,
        connectedWallet,
        setConnectedWallet,
        connectedChainId,
        setConnectedChainId,
        user,
        setUser,
        referralCode,
        setReferralCode,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
