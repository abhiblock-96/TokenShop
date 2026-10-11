import React from "react";
import { motion } from "framer-motion";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { EthSvg, FbckSvg, ChainlinkSvg, ShieldNodeSvg, PulseRingSvg } from "@/components/ui/Icons";
import { Zap, ShieldCheck, ArrowRight, Activity, Sparkles, CheckCircle2 } from "lucide-react";

const HeroSection = ({ children, ethPrice, fbckPrice }) => {
  const currentEthPrice = ethPrice ? Number(ethPrice) : 2500;
  const currentFbckPrice = fbckPrice ? Number(fbckPrice) : 3;

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] w-full flex items-center justify-center overflow-hidden bg-[var(--bg-main)] elite-aura-bg py-10 lg:py-16">
      {/* Background Subtle Geometric Grid */}
      <RetroGrid angle={65} />

      {/* Ambient Radial Spotlight (Asymmetric right-side glow behind swap card) */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,85,0,0.09)_0%,transparent_70%)] pointer-events-none blur-3xl -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Two-Column Split Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Value Proposition & Live Telemetry (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Top Live Protocol Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-main)] bg-[var(--bg-card)]/90 backdrop-blur-md text-xs font-mono font-medium text-[var(--text-muted)] shadow-xs">
              <PulseRingSvg className="w-3.5 h-3.5" />
              <span className="text-[var(--text-main)] font-semibold">Sepolia Testnet</span>
              <span className="text-[var(--border-main)]">•</span>
              <div className="flex items-center gap-1.5 text-[#375BD2]">
                <ChainlinkSvg className="w-3.5 h-3.5" />
                <span className="font-semibold text-xs">Chainlink Oracles</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-main)] font-sans leading-[1.1]">
                Zero-Slippage DEX. <br />
                <span className="text-[#FF5500]">Oracle Powered.</span>
              </h1>
              <p className="max-w-xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-medium">
                Exchange Ethereum for $FBCK with transparent mathematical execution. 
                Real-time price feeds straight from Chainlink decentralized aggregators.
              </p>
            </div>

            {/* Protocol Architecture Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)]/70 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] font-mono">
                  <Zap className="w-4 h-4 text-[#FF5500]" />
                  <span>Atomic Delivery</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                  Tokens calculated and transferred directly to your address in 1 block.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)]/70 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Zero Frontrunning</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                  Fixed oracle pricing eliminates MEV and sandwich attack risks.
                </p>
              </div>
            </div>

            {/* Live Telemetry Ticker Ribbon */}
            <div className="p-4 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)]/90 backdrop-blur-md shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--border-subtle)] pb-2 text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FF5500]" />
                  Live Market Telemetry
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aggregator Synchronized
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[11px] text-[var(--text-muted)]">ETH Index</span>
                  <div className="text-base font-extrabold text-[var(--text-main)] mt-0.5 flex items-center gap-1">
                    $<NumberTicker value={currentEthPrice} decimalPlaces={2} />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[var(--text-muted)]">FBCK Target</span>
                  <div className="text-base font-extrabold text-[#FF5500] mt-0.5">
                    $<NumberTicker value={currentFbckPrice} decimalPlaces={2} />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[var(--text-muted)]">Audit Grade</span>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Foundry
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Interactive Swap Card Hub (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            {/* Main Interactive Slot */}
            <div id="swap" className="w-full relative z-20">
              {children}
            </div>

            {/* Minimal Sub-card Trust Strip */}
            <div className="mt-3 flex items-center justify-between w-full max-w-md px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified ERC-20
              </span>
              <span>
                1 ETH = {(currentEthPrice / currentFbckPrice).toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} FBCK
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
