import { useCallback, useEffect, useState } from "react";
import GradientBox from "./shared/gradient_box";
import Button from "./shared/button";
import { useConnection } from "../context/connected_context";
import { USDT_contract } from "../config";
import { useLoadingContext } from "../context/LoadingContext";
import { toast } from "react-toastify";
import { findUser, transferBalance } from "../apis/backendAPI";
import {
  BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { waitForTransactionReceipt } from "wagmi/actions";

import { getBalance } from "../utils";
import { erc20Abi, parseUnits } from "viem";

const DepositBox = () => {
  const { user, setUser, connectedWallet, referralCode } = useConnection();
  const { loading, setLoading } = useLoadingContext();
  const [balance, setBalance] = useState<string>("");

  const [amount, setAmount] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  const changeAmount = (value: any) => {
    if (value === "") {
      setAmount("");
      return;
    }

    setAmount(value);
  };

  const handleSubmit = async () => {
    const to = toAddress as `0x${string}`;
    const amountInUnits = parseUnits(amount, 6);

    await writeContractAsync({
      address: USDT_contract,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, amountInUnits],
    });

    console.log("Tx hash:", hash);

    if (isConfirmed) {
      // save transaction in database also
      const response = await transferBalance(user.id, parseFloat(amount), toAddress);
      if (response.user) {
        setUser(response.user);
        setBalance(response.user.erc20Balance.toFixed(3));
      }

      toast.success("Successfully Deposited!");
    }
  };

  return (
    <GradientBox className="z-50 shadow-lg8">
      <p className="font-[400] text-[16px] text-white self-start">Deposit</p>

      <div className="flex w-[95%] self-center rounded-lg p-3 bg-[#1F2937]">
        <input
          type="text"
          name="address"
          autoFocus
          placeholder="Enter Address to Deposit"
          onChange={(e) => setToAddress(e.target.value)}
          value={toAddress}
          id="address"
          className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[100%] font-btn"
        />
      </div>
      <div className="flex w-[95%] self-center rounded-lg p-3 bg-[#1F2937]">
        <input
          type="number"
          name="amount"
          autoFocus
          placeholder="Enter Amount"
          onChange={(e) => changeAmount(e.target.value)}
          value={amount}
          id="amount"
          className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
        />
        <p
          className="font-medium text-[14px] text-[#32ADE6] flex items-center"
          onClick={() => changeAmount(balance)}
        >
          MAX
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        text="Deposit"
        className="!w-[100%] mt-4"
      />
    </GradientBox>
  );
};

export default DepositBox;
