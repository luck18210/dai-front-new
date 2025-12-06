import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useConnection } from "../../context/connected_context";
import truncateMiddle from "../../utils/truncate_text";

type Props = {};

const MobileNavBar = () => {
  const { connected, connectedWallet } = useConnection();
  const [copied, setCopied] = useState<boolean>(false);

  const [menu, setMenu] = useState<boolean>(false);
  const path = useLocation();

  useEffect(() => {
    setMenu(false);
    window.scrollTo({
      behavior: "instant",
      top: 0,
    });
  }, [path.pathname]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <nav className="w-[100%] fixed top-0 left-0 flex items-center justify-between px-3 py-6 z-40 backdrop-blur-lg font-btn">
      <Link to={"/"}>
        <img src="/images/MKC.svg" alt="MKC" className="w-[62px] h-[22px]" />
      </Link>
      <div className="absolute left-1/2 -translate-x-1/2">
        {connected ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-[16px] h-[16px] rounded-full bg-[#30B0C7]" />
              <p className="text-[16px] font-btn font-[400] text-[#FFFFFF]">
                Connected
              </p>
            </div>
            <div className="text-[12px] font-btn font-[400] text-white" onClick={() => copyToClipboard(connectedWallet)}>
              { copied ? 'Copied!' : truncateMiddle(connectedWallet, 20, 8)}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-[16px] h-[16px] rounded-full bg-[#FA574C]" />
            <p className="text-[16px] font-btn font-[400] text-[#FFFFFF]">
              Not connected
            </p>
          </div>
        )}
      </div>
      
    </nav>
  );
};

export default MobileNavBar;
