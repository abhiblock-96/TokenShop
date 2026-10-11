import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

const Connection = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it first.");
    return null;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Request account access
    const account = await provider.send("eth_requestAccounts", []);
    const walletAddress = account[0];

    // Check & switch to Sepolia network if not already on it
    try {
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: "Sepolia Test Network",
                  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
        }
      }
    } catch (netErr) {
      console.warn("Network verification notice:", netErr);
    }

    // Refresh provider and get signer
    const activeProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await activeProvider.getSigner();

    return [activeProvider, signer, walletAddress];
  } catch (error) {
    console.error("Connection error:", error);
    if (error.code === 4001) {
      alert("Connection request was rejected in your wallet.");
    }
    return null;
  }
};

export default Connection;
