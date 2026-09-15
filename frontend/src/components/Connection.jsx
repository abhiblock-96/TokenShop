import React from "react";
import { ethers } from "ethers";

const Connection = async () => {
  if (!window.ethereum) {
    alert("Metamask is not installed, Please install it first");
    return null;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const account = await provider.send("eth_requestAccounts", []);

    const walletAddress = account[0];

    const signer = await provider.getSigner();

    return [provider, signer, walletAddress];
  } catch (error) {
    alert("user denied request");
    return null;
  }
};

export default Connection;
