import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Card from "./Card";

import shopArtifact from "../assets/Shop.json";
import tokenArtifact from "../assets/Token.json";

const Interaction = ({ state }) => {
  const { provider, signer, address } = state;

  const [userBalanceETH, setUserBalanceETH] = useState(null);
  const [userBalanceFBCK, setUserBalanceFBCK] = useState(null);

  const [ethPrice, setEthPrice] = useState(null);
  const [fbckPrice, setFbckPrice] = useState(null);

  const contractABI = shopArtifact.abi;
  const tokenABI = tokenArtifact.abi;

  const shopAddress = import.meta.env.VITE_SHOP_CONTRACT_ADDRESS;
  const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;

  const shopReadContract = provider
    ? new ethers.Contract(shopAddress, contractABI, provider)
    : null;

  const tokenReadContract = provider
    ? new ethers.Contract(tokenAddress, tokenABI, provider)
    : null;

  const shopWriteContract = signer
    ? new ethers.Contract(shopAddress, contractABI, signer)
    : null;

  useEffect(() => {
    if (!provider || !address) {
      setUserBalanceETH(null);
      setUserBalanceFBCK(null);

      return;
    }
  }, [provider, address]);

  const refreshBalances = async () => {
    if (!provider || !address || !tokenReadContract) {
      return;
    }

    try {
      const ethBalance = await provider.getBalance(address);

      setUserBalanceETH(ethers.formatEther(ethBalance));

      const fbckBalance = await tokenReadContract.balanceOf(address);

      const decimals = await shopReadContract.TOKEN_DECIMAL();

      setUserBalanceFBCK(ethers.formatUnits(fbckBalance, decimals));
    } catch (error) {
      alert("Error refreshing balances:", error);
    }
  };

  useEffect(() => {
    if (!provider || !address) {
      return;
    }

    refreshBalances();
  }, [provider, address]);

  useEffect(() => {
    if (!provider || !shopReadContract) {
      return;
    }

    const getEthPrice = async () => {
      try {
        const price = await shopReadContract.getChainlinkETHPrice();
        setEthPrice(price);
      } catch (error) {
        alert("Error fetching ETH price:", error);
      }
    };
    getEthPrice();
  }, [provider]);

  useEffect(() => {
    if (!provider || !shopReadContract) {
      return;
    }
    const getFbckPrice = async () => {
      try {
        const price = await shopReadContract.TOKEN_PRICE_USD();
        setFbckPrice(price);
      } catch (error) {
        alert("Error fetching FBCK price:", error);
      }
    };

    getFbckPrice();
  }, [provider]);

  const getTokenAmount = async (amount) => {
    if (!provider || !address || !shopReadContract || !amount) {
      return;
    }

    try {
      const amountInWei = ethers.parseEther(amount);

      const tokenAmount = await shopReadContract.amountToBuy(amountInWei);

      const tokenDecimals = await shopReadContract.TOKEN_DECIMAL();

      return ethers.formatUnits(tokenAmount, tokenDecimals);
    } catch (error) {
      console.error("Error calculating token amount:", error);

      return;
    }
  };

  const buyToken = async (amount) => {
    if (!signer || !address || !shopWriteContract || !amount) {
      return;
    }

    try {
      const amountInWei = ethers.parseEther(amount);

      const tx = await shopWriteContract.buyTokens({
        value: amountInWei,
      });

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      await refreshBalances();

      alert("Purchase successful!");
    } catch (error) {
      console.error("Buy transaction failed:", error);

      alert("Transaction failed or was rejected.");
    }
  };

  return (
    <Card
      balance={userBalanceETH}
      fbckBal={userBalanceFBCK}
      ethPrice={ethPrice}
      fbckPrice={fbckPrice}
      getTokenAmount={getTokenAmount}
      buyToken={buyToken}
    />
  );
};

export default Interaction;
