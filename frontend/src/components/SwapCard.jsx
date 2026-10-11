import React, { useEffect, useState } from "react";
import { ArrowDown, RefreshCw, Settings2, Wallet, Check } from "lucide-react";
import confetti from "canvas-confetti";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { EthSvg, FbckSvg } from "@/components/ui/Icons";

const SwapCard = ({
  balance,
  fbckBal,
  ethPrice,
  fbckPrice,
  getTokenAmount,
  buyToken,
  address,
  connection,
  onTxSuccess,
}) => {
  const [inputEthValue, setInputEthValue] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBuying, setIsBuying] = useState(false)

  const effectiveEthPrice = ethPrice && Number(ethPrice) > 0 ? Number(ethPrice) : 2500;
  const effectiveFbckPrice = fbckPrice && Number(fbckPrice) > 0 ? Number(fbckPrice) : 3;
  const [liveRate, setLiveRate] = useState("833.3333");

  useEffect(() => {
    let isMounted = true;
    const fetchRate = async () => {
      if (getTokenAmount) {
        try {
          const rate1 = await getTokenAmount("1");
          if (isMounted && rate1 && Number(rate1) > 0) {
            setLiveRate(
              Number(rate1).toLocaleString("en-US", {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })
            );
            return;
          }
        } catch (e) {
          console.warn("Could not fetch 1 ETH rate:", e);
        }
      }

      if (effectiveEthPrice && effectiveFbckPrice) {
        const computed = (effectiveEthPrice / effectiveFbckPrice).toLocaleString("en-US", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        });
        if (isMounted) setLiveRate(computed);
      }
    };

    fetchRate();
    return () => {
      isMounted = false;
    };
  }, [getTokenAmount, effectiveEthPrice, effectiveFbckPrice]);

  useEffect(() => {
    let isMounted = true;
    const calculateTokenOutput = async () => {
      if (!inputEthValue || Number(inputEthValue) <= 0) {
        setTokenAmount("");
        return;
      }

      setIsCalculating(true);
      try {
        if (getTokenAmount) {
          const amt = await getTokenAmount(inputEthValue);
          if (isMounted && amt !== undefined && amt !== null) {
            setTokenAmount(amt);
            setIsCalculating(false);
            return;
          }
        }
        const computed = (Number(inputEthValue) * effectiveEthPrice) / effectiveFbckPrice;
        if (isMounted) {
          setTokenAmount(computed.toFixed(4));
        }
      } catch (err) {
        console.error("Error computing token amount:", err);
        const computed = (Number(inputEthValue) * effectiveEthPrice) / effectiveFbckPrice;
        if (isMounted) {
          setTokenAmount(computed.toFixed(4));
        }
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    };

    calculateTokenOutput();
    return () => {
      isMounted = false;
    };
  }, [inputEthValue, getTokenAmount, effectiveEthPrice, effectiveFbckPrice]);

  const handleMaxClick = () => {
    if (balance && Number(balance) > 0) {
      const maxEth = Math.max(0, Number(balance) - 0.005);
      setInputEthValue(maxEth > 0 ? maxEth.toFixed(4) : "0");
    } else {
      setInputEthValue("0.1");
    }
  };

  const handleBuy = async () => {
    if (!inputEthValue || Number(inputEthValue) <= 0) {
      alert("Please enter a valid ETH amount.");
      return;
    }

    if (!address) {
      if (connection) {
        connection();
      }
      return;
    }

    setIsBuying(true);
    try {
      let txResult = null;
      if (buyToken) {
        txResult = await buyToken(inputEthValue);
      }

      const realTxHash = txResult?.hash || txResult?.tx?.hash;

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#FF5500", "#FFA14A", "#FF7020", "#121316"],
      });

      if (onTxSuccess && realTxHash) {
        onTxSuccess({
          hash: `${realTxHash.slice(0, 6)}...${realTxHash.slice(-4)}`,
          fullHash: realTxHash,
          amountEth: inputEthValue,
          amountFbck: tokenAmount,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "Confirmed",
        });
      }
      setInputEthValue("");
      setTokenAmount("");
    } catch (err) {
      console.error("Buy failed:", err);
      if (
        err?.code === 4001 ||
        err?.code === "ACTION_REJECTED" ||
        err?.message?.includes("user rejected")
      ) {
        console.log("Transaction rejected by user in wallet.");
      } else {
        const errorMsg =
          err?.reason ||
          err?.info?.error?.message ||
          err?.shortMessage ||
          err?.message ||
          "Transaction execution failed on-chain.";
        alert(`Swap Failed: ${errorMsg}`);
      }
    } finally {
      setIsBuying(false);
    }
  };

  const formatUsd4Decimals = (val) => {
    if (!val || isNaN(val) || Number(val) <= 0) return "$0.0000";
    const num = Number(val);
    return (
      "$" +
      num.toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    );
  };

  const ethUsdEquivalent = inputEthValue
    ? formatUsd4Decimals(Number(inputEthValue) * effectiveEthPrice)
    : "$0.0000";

  const fbckUsdEquivalent = tokenAmount
    ? formatUsd4Decimals(Number(tokenAmount) * effectiveFbckPrice)
    : "$0.0000";

  return (
    <Card className="relative w-full max-w-md mx-auto overflow-hidden bg-[var(--bg-card)] border-[var(--border-main)] shadow-xl rounded-3xl backdrop-blur-xl transition-all">
      {/* Subtle border beam highlight in vibrant orange */}
      <BorderBeam size={280} duration={14} colorFrom="#FF5500" colorTo="#FFA666" />

      <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold tracking-tight text-[var(--text-main)]">
              Buy
            </CardTitle>
          </div>
        </div>

      </CardHeader>

      <CardContent className="space-y-2 pt-4 px-5">
        {/* You Pay Container */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-input)] p-3.5 transition-all focus-within:border-[#FF5500]/50">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span className="font-medium">You Pay</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span>Bal: {balance ? Number(balance).toFixed(4) : "0.0000"}</span>
              <button
                type="button"
                onClick={handleMaxClick}
                className="px-1.5 py-0.5 rounded-md bg-[#FF5500]/15 text-[#FF5500] hover:bg-[#FF5500]/25 font-bold uppercase transition cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0"
                value={inputEthValue}
                onChange={(e) => setInputEthValue(e.target.value)}
                className="h-11 border-0 bg-transparent p-0 text-3xl font-bold font-mono text-[var(--text-main)] placeholder:text-[var(--text-muted)]/30 focus-visible:ring-0"
              />
              <div className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
                ≈ {ethUsdEquivalent}
              </div>
            </div>

            {/* ETH Currency Pill */}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] px-3 py-2 shadow-xs hover:border-[#627EEA]/40 transition-colors">
              <EthSvg className="w-5 h-5 shrink-0" />
              <span className="font-bold text-xs font-mono text-[var(--text-main)]">ETH</span>
            </div>
          </div>
        </div>

        {/* Swap Direction Toggle */}
        <div className="relative flex justify-center -my-3 z-10">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white hover:bg-[#FF5500] hover:border-[#FF5500] shadow-xs transition-all duration-200 cursor-pointer"
            title="Direction"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* You Receive Container */}
        <div className="rounded-2xl border border-[var(--border-main)] bg-[var(--bg-input)] p-3.5 transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span className="font-medium">You Receive</span>
            <span className="font-mono text-[11px]">
              Bal: {fbckBal ? Number(fbckBal).toFixed(2) : "0.00"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                type="text"
                readOnly
                placeholder="0"
                value={isCalculating ? "..." : tokenAmount}
                className="h-11 border-0 bg-transparent p-0 text-3xl font-bold font-mono text-[#FF5500] placeholder:text-[var(--text-muted)]/30 focus-visible:ring-0"
              />
              <div className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
                ≈ {fbckUsdEquivalent}
              </div>
            </div>

            {/* FBCK Currency Pill */}
            <div className="flex items-center gap-2 rounded-xl border border-[#FF5500]/30 bg-[#FF5500]/10 px-3 py-2 shadow-xs hover:border-[#FF5500]/50 transition-colors">
              <FbckSvg className="w-5 h-5 shrink-0" />
              <span className="font-bold text-xs font-mono text-[#FF5500]">$FBCK</span>
            </div>
          </div>
        </div>

        {/* Compact Rate Bar */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-[11px] font-mono text-[var(--text-muted)] flex justify-between items-center">
          <span>Rate</span>
          <span className="font-semibold text-[var(--text-main)]">
            1 ETH = {liveRate} FBCK
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-5 px-5">
        {address ? (
          <button
            type="button"
            onClick={handleBuy}
            disabled={isBuying || isCalculating || !inputEthValue}
            className="group relative w-full overflow-hidden py-3.5 rounded-2xl bg-[#FF5500] hover:bg-[#E64D00] disabled:opacity-45 disabled:cursor-not-allowed text-white text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border-t border-white/20 shadow-[0_6px_22px_rgba(255,85,0,0.32)] hover:shadow-[0_8px_28px_rgba(255,85,0,0.42)] transition-all duration-200 active:scale-[0.985] cursor-pointer select-none"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            {isBuying ? (
              <span className="flex items-center gap-2 relative z-10">
                <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
              </span>
            ) : (
              <span className="relative z-10">Swap Tokens</span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={connection}
            className="group relative w-full overflow-hidden py-3.5 rounded-2xl bg-[#FF5500] hover:bg-[#E64D00] text-white text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border-t border-white/20 shadow-[0_6px_22px_rgba(255,85,0,0.32)] hover:shadow-[0_8px_28px_rgba(255,85,0,0.42)] transition-all duration-200 active:scale-[0.985] cursor-pointer select-none"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            <span className="flex items-center gap-2 relative z-10">
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </span>
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SwapCard;
