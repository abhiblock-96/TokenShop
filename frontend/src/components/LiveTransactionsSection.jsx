import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle2, Wallet, RefreshCw, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ethers } from "ethers";

import shopArtifact from "../assets/Shop.json";
import tokenArtifact from "../assets/Token.json";

const LiveTransactionsSection = ({
  address,
  provider,
  connection,
  recentTxs = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contractTxs, setContractTxs] = useState([]);

  const shopAddress =
    import.meta.env.VITE_SHOP_CONTRACT_ADDRESS ||
    "0xa4e89176baf2f1e10a9e586318ac9bdd6c49c1cd";
  const tokenAddress =
    import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS ||
    "0x5abcca16a58254245bc3afc4317fbdb1d0523e91";

  const [localSavedTxs, setLocalSavedTxs] = useState([]);

  useEffect(() => {
    if (address) {
      try {
        const stored = localStorage.getItem(`recentTxs_${address.toLowerCase()}`);
        if (stored) {
          setLocalSavedTxs(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Could not read local transactions:", e);
      }
    } else {
      setLocalSavedTxs([]);
    }
  }, [address]);

  const fetchPurchases = useCallback(async () => {
    if (!provider || !address) {
      setContractTxs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const list = [];
      const currentBlock = await provider.getBlockNumber();

      const queryEventsSafely = async (contract, filter) => {
        try {
          return await contract.queryFilter(filter, Math.max(11686000, currentBlock - 45000), "latest");
        } catch (err) {
          console.warn("Wide range filter failed, falling back to 9999 blocks:", err);
          try {
            return await contract.queryFilter(filter, Math.max(0, currentBlock - 9999), "latest");
          } catch (innerErr) {
            console.warn("Recent range query failed:", innerErr);
            return [];
          }
        }
      };

      // 1. Query TokenShop events (MintSucceed or BuySuccessfull)
      if (shopAddress) {
        try {
          const shopContract = new ethers.Contract(shopAddress, shopArtifact.abi, provider);
          let events = [];

          if (shopContract.filters.MintSucceed) {
            try {
              const filter = shopContract.filters.MintSucceed(address);
              events = await queryEventsSafely(shopContract, filter);
            } catch (err) {
              console.warn("MintSucceed filter query notice:", err);
            }
          }

          if (events.length === 0 && shopContract.filters.BuySuccessfull) {
            try {
              const filter = shopContract.filters.BuySuccessfull(address);
              events = await queryEventsSafely(shopContract, filter);
            } catch (err) {
              console.warn("BuySuccessfull filter query notice:", err);
            }
          }

          for (const ev of events) {
            try {
              const rawAmount = ev.args[1] || ev.args.amount;
              const formattedFbck = ethers.formatUnits(rawAmount, 18);
              let ethSpent = "0.00";
              let formattedTime = "Confirmed";
              let blockTimestamp = 0;

              try {
                const tx = await provider.getTransaction(ev.transactionHash);
                if (tx && tx.value) {
                  ethSpent = ethers.formatEther(tx.value);
                }
              } catch (txErr) {
                console.warn("Could not query tx value:", txErr);
              }

              try {
                const block = await provider.getBlock(ev.blockNumber);
                if (block && block.timestamp) {
                  blockTimestamp = block.timestamp;
                  const date = new Date(block.timestamp * 1000);
                  formattedTime = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
                }
              } catch (blErr) {
                console.warn("Could not query block time:", blErr);
              }

              list.push({
                hash: `${ev.transactionHash.slice(0, 6)}...${ev.transactionHash.slice(-4)}`,
                fullHash: ev.transactionHash,
                amountEth: Number(ethSpent) > 0 ? Number(ethSpent).toFixed(4) : "0.00",
                amountFbck: Number(formattedFbck).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                time: formattedTime,
                timestamp: blockTimestamp,
                status: "Confirmed",
              });
            } catch (err) {
              console.warn("Event parsing notice:", err);
            }
          }
        } catch (err) {
          console.warn("Shop event query notice:", err);
        }
      }

      // 2. Query ERC20 Token contract for Transfer(0x0, address)
      if (list.length === 0 && tokenAddress) {
        try {
          const tokenContract = new ethers.Contract(tokenAddress, tokenArtifact.abi, provider);
          const filter = tokenContract.filters.Transfer(
            "0x0000000000000000000000000000000000000000",
            address
          );
          const tokenEvents = await queryEventsSafely(tokenContract, filter);

          for (const ev of tokenEvents) {
            try {
              const rawAmount = ev.args[2] || ev.args.value;
              const formattedFbck = ethers.formatUnits(rawAmount, 18);
              let ethSpent = "0.00";
              let formattedTime = "Confirmed";
              let blockTimestamp = 0;

              try {
                const tx = await provider.getTransaction(ev.transactionHash);
                if (tx && tx.value) {
                  ethSpent = ethers.formatEther(tx.value);
                }
              } catch (txErr) {
                console.warn("Could not query tx value:", txErr);
              }

              try {
                const block = await provider.getBlock(ev.blockNumber);
                if (block && block.timestamp) {
                  blockTimestamp = block.timestamp;
                  const date = new Date(block.timestamp * 1000);
                  formattedTime = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
                }
              } catch (blErr) {
                console.warn("Could not query block time:", blErr);
              }

              list.push({
                hash: `${ev.transactionHash.slice(0, 6)}...${ev.transactionHash.slice(-4)}`,
                fullHash: ev.transactionHash,
                amountEth: Number(ethSpent) > 0 ? Number(ethSpent).toFixed(4) : "0.00",
                amountFbck: Number(formattedFbck).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                time: formattedTime,
                timestamp: blockTimestamp,
                status: "Confirmed",
              });
            } catch (err) {
              console.warn("Token event parsing notice:", err);
            }
          }
        } catch (err) {
          console.warn("Token contract query notice:", err);
        }
      }

      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setContractTxs(list);
    } catch (err) {
      console.error("Error fetching purchase activity from contract:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [provider, address, shopAddress, tokenAddress]);

  useEffect(() => {
    if (address && provider) {
      fetchPurchases();
    } else {
      setContractTxs([]);
      setLoading(false);
    }
  }, [address, provider, fetchPurchases]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchPurchases();
  };

  // Merge recent in-session transactions + local storage cache + on-chain historical contract transactions
  const combinedTxs = [
    ...recentTxs,
    ...localSavedTxs,
    ...contractTxs,
  ]
    .map((tx) => ({
      ...tx,
      fullHash: tx.fullHash || tx.hash,
      hash:
        tx.hash && tx.hash.length > 14
          ? `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`
          : tx.hash,
      amountFbck: tx.amountFbck
        ? typeof tx.amountFbck === "number"
          ? tx.amountFbck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : tx.amountFbck
        : "0.00",
      time: tx.time || "Recent",
      status: tx.status || "Confirmed",
    }))
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            (t.fullHash || t.hash).toLowerCase() ===
            (item.fullHash || item.hash).toLowerCase()
        )
    );

  return (
    <section id="activity" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <Card className="rounded-3xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-md overflow-hidden backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border-subtle)] py-4 px-6">
            <div>
              <CardTitle className="text-lg font-bold text-[var(--text-main)] font-sans">
                Activity
              </CardTitle>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {address
                  ? `Purchase History for ${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Contract Purchase Activity"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {address ? (
                <>
                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    disabled={loading || refreshing}
                    className="p-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                    title="Refresh On-Chain Activity"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#FF5500]" : ""}`} />
                  </button>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>On-Chain Sync</span>
                  </div>
                </>
              ) : (
                <Badge variant="secondary" className="text-xs font-mono">
                  Wallet Required
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* STATE 1: Before Wallet Connection */}
            {!address && (
              <div className="py-14 px-6 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/25 flex items-center justify-center text-[#FF5500] shadow-sm">
                  <Wallet className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-base font-bold text-[var(--text-main)] font-sans">
                    Connect Wallet to View Activity
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                    Connect your Web3 wallet to inspect your on-chain transaction history and recent token purchases directly from the smart contract.
                  </p>
                </div>
                <Button
                  onClick={connection}
                  className="mt-1 font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md shadow-[#FF5500]/25"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </Button>
              </div>
            )}

            {/* STATE 2: Wallet Connected & Querying */}
            {address && loading && (
              <div className="py-12 px-6 text-center flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-6 h-6 text-[#FF5500] animate-spin" />
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  Querying on-chain purchase events from smart contract...
                </p>
              </div>
            )}

            {/* STATE 3: Wallet Connected & No Purchases Found */}
            {address && !loading && combinedTxs.length === 0 && (
              <div className="py-14 px-6 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-muted)]">
                  <Sparkles className="w-6 h-6 text-[#FF5500]" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-[var(--text-main)] font-sans">
                    No Purchase Activity Found
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Wallet <span className="font-mono font-semibold text-[var(--text-main)]">{address.slice(0, 6)}...{address.slice(-4)}</span> has no recorded $FBCK purchases yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("swap")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-bold font-mono text-[#FF5500] hover:underline cursor-pointer pt-1"
                >
                  Swap Tokens Now →
                </button>
              </div>
            )}

            {/* STATE 4: Wallet Connected & Purchases Displayed */}
            {address && !loading && combinedTxs.length > 0 && (
              <div className="divide-y divide-[var(--border-subtle)]">
                {combinedTxs.map((tx, idx) => (
                  <div
                    key={(tx.fullHash || tx.hash) + idx}
                    className="py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--text-main)]">
                        <span>{tx.amountEth} ETH</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF5500]" />
                        <span className="text-[#FF5500]">{tx.amountFbck} FBCK</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-muted)] self-end sm:self-center">
                      {tx.fullHash ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.fullHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#FF5500] transition-colors flex items-center gap-1 underline-offset-2 hover:underline"
                          title="View on Etherscan"
                        >
                          <span>{tx.hash}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span>{tx.hash}</span>
                      )}

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                        {tx.time}
                      </span>

                      <Badge variant="emerald" className="text-[10px] py-0 px-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{tx.status || "Confirmed"}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default LiveTransactionsSection;
