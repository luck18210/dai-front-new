import { useEffect, useState } from "react";
import { GoFileDirectoryFill } from "react-icons/go";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { useConnection } from "../../context/connected_context";
import truncateMiddle from "../../utils/truncate_text";

const ConnectWalletBox = ({
  onClick,
  referralCode,
  disabled,
}: {
  onClick: () => void;
  referralCode: string;
  disabled: boolean;
}) => {
  const { connectedWallet } = useConnection();

  const [text, setText] = useState<string>(
    referralCode ? referralCode : "Auto filled when enter the URL"
  );

  return (
    <GradientBox>
      <div className="flex flex-col gap-0 w-[100%] pb-2 justify-center items-center z-10 font-btn">
        <h1 className="font-[500] text-[20px] md:text-[28px] lg:text-[34px] text-white">
          Sign In
        </h1>
      </div>

      <div className="flex flex-col gap-0 items-start w-[100%] z-10 md:gap-2">
        <h2 className="text-white text-[16px] mb-2">
          Referral code
        </h2>
        <p className="w-[100%] p-4 bg-[#1F2937] text-[14px] font-[400] text-[#888888] rounded-lg  font-btn">
          {text}
        </p>
      </div>
      <div className="flex w-[100%] max-xs:flex-wrap max-xs:gap-2 px-2 py-2 justify-between items-center bg-[#1F2937] rounded-lg z-10 font-btn">
        <div className="flex items-center gap-2">
          <GoFileDirectoryFill className="text-[22px] text-[#30B0C7]" />
          <p className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[16px] font-[400] text-[#FFFFFF] font-btn whitespace-nowrap">
            {connectedWallet
              ? truncateMiddle(connectedWallet, 17, 8)
              : "Wallet not connected"}
          </p>
        </div>
        <Button
          disabled={disabled}
          onClick={onClick}
          className="max-xs:w-[100%] max-xs:text-[12px] max-md:text-[14px] max-md:h-[38px] max-md:w-[120px]"
          text="Connect Wallet"
        />
      </div>
    </GradientBox>
  );
};

export default ConnectWalletBox;
