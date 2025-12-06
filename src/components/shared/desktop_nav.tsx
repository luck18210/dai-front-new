import { useState } from "react";
import { Link } from "react-router-dom";

import { useConnection } from "../../context/connected_context";
import truncateMiddle from "../../utils/truncate_text";
import { useAccount, useConnect } from "wagmi";

type Props = {};

const DesktopNavBar = () => {
  const { connected, connectedWallet, setIsConnected, setConnectedWallet, setConnectedChainId } =
    useConnection();

  const { isConnected, address, chainId } = useAccount();
  const { connectors, connectAsync } = useConnect();

  const handleClick = async () => {
    try {
      // Connect to the selected wallet connector
      let connectedAddress: any;
      let connectedChainId: any;
      if (isConnected) {
        connectedAddress = address || "";
        connectedChainId = chainId || "";
      } else {
        const connectRes = await connectAsync({
          connector: connectors[0],
        });
        connectedAddress = connectRes.accounts[0];
        connectedChainId = connectRes.chainId;
      }

      setIsConnected(true);
      setConnectedWallet(connectedAddress || "");
      setConnectedChainId(connectedChainId);

    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <nav className="w-[100%] relative flex items-center justify-center px-8 py-6 z-40 backdrop-blur-lg box-border font-btn">
      <div className="w-[100%] flex items-center justify-between xl:max-w-[1258px] font-btn">
        <Link to={"/"}>
          <img src="/images/FullLogo.svg" alt="MKC" className="w-[141px] h-[54px]" />
        </Link>
        <>
          {connected ? (
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClick}
                  className="p-2 bg-white rounded-lg text-[14px] font-bold text-[#000]"
                >
                  {truncateMiddle(address || "", 14, 5)}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClick}
                className="p-2 bg-[#30B0C7] rounded-lg text-[14px] text-[#FFFFFF]"
              >
                Not connected
              </button>
            </div>
          )}
        </>
      </div>
    </nav>
  );
};

export default DesktopNavBar;
