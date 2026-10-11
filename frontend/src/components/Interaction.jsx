import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SwapCard from "./SwapCard";

import shopArtifact from "../assets/Shop.json";
import tokenArtifact from "../assets/Token.json";

const Interaction = ({ state, connection, onTxSuccess }) => {
  const { provider, signer, address } = state;

  const [userBalanceETH, setUserBalanceETH] = useState(null);
  const [userBalanceFBCK, setUserBalanceFBCK] = useState(null);

  const [ethPrice, setEthPrice] = useState(null);
  const [fbckPrice, setFbckPrice] = useState(null);

  const contractABI = shopArtifact.abi;
  const tokenABI = tokenArtifact.abi;

  const shopAddress =
    import.meta.env.VITE_SHOP_CONTRACT_ADDRESS ||
    "0xa4e89176baf2f1e10a9e586318ac9bdd6c49c1cd";
  const tokenAddress =
    import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS ||
    "0x5abcca16a58254245bc3afc4317fbdb1d0523e91";

  const shopReadContract =
    provider && shopAddress
      ? new ethers.Contract(shopAddress, contractABI, provider)
      : null;

  const tokenReadContract =
    provider && tokenAddress
      ? new ethers.Contract(tokenAddress, tokenABI, provider)
      : null;

  const shopWriteContract =
    signer && shopAddress
      ? new ethers.Contract(shopAddress, contractABI, signer)
      : null;

  useEffect(() => {
    if (!provider || !address) {
      setUserBalanceETH(null);
      setUserBalanceFBCK(null);
    }
  }, [provider, address]);

  const refreshBalances = async () => {
    if (!provider || !address) {
      return;
    }

    try {
      const ethBalance = await provider.getBalance(address);
      setUserBalanceETH(ethers.formatEther(ethBalance));

      if (tokenReadContract && shopReadContract) {
        try {
          const fbckBalance = await tokenReadContract.balanceOf(address);
          const decimals = await shopReadContract.TOKEN_DECIMAL();
          setUserBalanceFBCK(ethers.formatUnits(fbckBalance, decimals));
        } catch (tokErr) {
          console.warn("Could not query token balance directly:", tokErr);
        }
      }
    } catch (error) {
      console.warn("Could not refresh balances from contract:", error);
    }
  };

  useEffect(() => {
    if (!provider || !address) {
      return;
    }
    refreshBalances();
  }, [provider, address]);

  useEffect(() => {
    // If wallet provider is not connected yet, pre-load prices via public Sepolia RPC
    if (!provider && shopAddress) {
      const loadFallbackPrices = async () => {
        try {
          const publicProvider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
          const fallbackShop = new ethers.Contract(shopAddress, contractABI, publicProvider);
          const rawEthPrice = await fallbackShop.getChainlinkETHPrice();
          setEthPrice(ethers.formatUnits(rawEthPrice, 8));

          const rawFbckPrice = await fallbackShop.TOKEN_PRICE_USD();
          setFbckPrice(ethers.formatUnits(rawFbckPrice, 18));
        } catch (err) {
          console.warn("Public RPC price preview notice:", err);
        }
      };
      loadFallbackPrices();
    }
  }, [provider, shopAddress]);

  useEffect(() => {
    if (!provider || !shopReadContract) {
      return;
    }

    const getEthPrice = async () => {
      try {
        const rawPrice = await shopReadContract.getChainlinkETHPrice();
        // Chainlink ETH/USD aggregator returns price with 8 decimals
        const formatted = ethers.formatUnits(rawPrice, 8);
        setEthPrice(formatted);
      } catch (error) {
        console.warn("Notice: Using market price preview (ETH Chainlink feed offline):", error);
      }
    };
    getEthPrice();
  }, [provider, shopReadContract]);

  useEffect(() => {
    if (!provider || !shopReadContract) {
      return;
    }
    const getFbckPrice = async () => {
      try {
        const rawPrice = await shopReadContract.TOKEN_PRICE_USD();
        let decimals = 18;
        try {
          decimals = await shopReadContract.TOKEN_DECIMAL();
        } catch {
          decimals = 18;
        }
        // TOKEN_PRICE_USD has TOKEN_DECIMAL (18 decimals)
        const formatted = ethers.formatUnits(rawPrice, decimals);
        setFbckPrice(formatted);
      } catch (error) {
        console.warn("Notice: Using default FBCK USD rate preview:", error);
      }
    };

    getFbckPrice();
  }, [provider, shopReadContract]);

  const getTokenAmount = async (amount) => {
    if (!amount || Number(amount) <= 0) {
      return "";
    }

    if (!provider || !shopReadContract) {
      const rate = ethPrice && Number(ethPrice) > 0 ? Number(ethPrice) : 2500;
      const fbckRate = fbckPrice && Number(fbckPrice) > 0 ? Number(fbckPrice) : 3;
      return ((Number(amount) * rate) / fbckRate).toFixed(4);
    }

    try {
      const amountInWei = ethers.parseEther(amount.toString());
      const tokenAmount = await shopReadContract.amountToBuy(amountInWei);
      let tokenDecimals = 18;
      try {
        tokenDecimals = await shopReadContract.TOKEN_DECIMAL();
      } catch {
        tokenDecimals = 18;
      }

      const formatted = ethers.formatUnits(tokenAmount, tokenDecimals);
      return Number(formatted).toFixed(4);
    } catch (error) {
      console.warn("Error calculating token amount via contract, using fallback calculation:", error);
      const rate = ethPrice && Number(ethPrice) > 0 ? Number(ethPrice) : 2500;
      const fbckRate = fbckPrice && Number(fbckPrice) > 0 ? Number(fbckPrice) : 3;
      return ((Number(amount) * rate) / fbckRate).toFixed(4);
    }
  };

  const buyToken = async (amount) => {
    if (!amount || Number(amount) <= 0) {
      throw new Error("Invalid ETH amount entered.");
    }

    if (!window.ethereum) {
      throw new Error("MetaMask or compatible Web3 wallet not detected.");
    }

    // Ensure we are on Sepolia testnet
    try {
      const currentChain = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChain !== "0xaa36a7" && parseInt(currentChain, 16) !== 11155111) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError) {
          console.warn("Sepolia switch notice:", switchError);
        }
      }
    } catch (chainErr) {
      console.warn("Chain validation notice:", chainErr);
    }

    // Obtain the freshest active provider and signer
    const activeProvider = new ethers.BrowserProvider(window.ethereum);
    const activeSigner = await activeProvider.getSigner();

    if (!activeSigner) {
      throw new Error("Signer not available. Please connect your wallet.");
    }

    const shopWrite = new ethers.Contract(shopAddress, contractABI, activeSigner);
    const amountInWei = ethers.parseEther(amount.toString());

    let tx;
    try {
      tx = await shopWrite.buyTokens({
        value: amountInWei,
      });
    } catch (firstErr) {
      console.warn("Direct buyTokens failed or gas estimation tight, attempting with explicit gasLimit buffer:", firstErr);
      tx = await shopWrite.buyTokens({
        value: amountInWei,
        gasLimit: 350000n,
      });
    }

    console.log("Transaction successfully submitted:", tx.hash);
    const receipt = await tx.wait(1);
    console.log("Transaction confirmed on Sepolia:", receipt);

    await refreshBalances();

    return { tx, receipt, hash: tx.hash };
  };

  return (
    <SwapCard
      balance={userBalanceETH}
      fbckBal={userBalanceFBCK}
      ethPrice={ethPrice}
      fbckPrice={fbckPrice}
      getTokenAmount={getTokenAmount}
      buyToken={buyToken}
      address={address}
      connection={connection}
      onTxSuccess={onTxSuccess}
    />
  );
};

export default Interaction;
