import { useState } from "react";
import truncateMiddle from "../utils/truncate_text";
import GradientBox from "./shared/gradient_box";
import { IoCopySharp } from "react-icons/io5";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { useConnection } from "../context/connected_context";

const ReferralBox = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const { user } = useConnection();
  const referralLink = `${window.location.origin}?ref=${user?.referralCode}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <GradientBox>
      <p className="font-[400] text-[16px] text-white self-start">Your Referral Link</p>

      <div className="flex w-[100%] md:w-[95%] text-white items-center justify-between rounded-xl p-2 bg-[#1F2937] px-4">
        <p className="text-[14px] font-[400] w-[85%] truncate">
          {copied ? "Copied!" : truncateMiddle(referralLink, 40, 0)}
        </p>
        <button
          className="outline-none"
          onClick={() => copyToClipboard(referralLink)}
        >
          <IoCopySharp className="text-[24px] text-white" />
        </button>
      </div>

      <div className="flex w-[100%] text-white mt-4 items-center justify-between md:w-[95%] md:pb-4">
        <div className="flex flex-col gap-2 items-start">
          <p className="text-[16px] font-medium">or Scan QR Code</p>
          <div className="text-[#30B0C7] flex items-center gap-2">
            <RiLightbulbFlashLine className="text-[24px]" />
            <p className="font-normal text-[14px] ">Easy and Instant</p>
          </div>
        </div>
        <img
          src={`https://quickchart.io/chart?chs=500x500&cht=qr&chl=${referralLink}&choe=UTF-8`}
          alt="Your affiliate code"
          className="w-[126px] h-[126px]"
        />
      </div>
    </GradientBox>
  );
};

export default ReferralBox;
