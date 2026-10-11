import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, ArrowUpRight, Cpu } from "lucide-react";
import { FbckSvg, ChainlinkSvg } from "@/components/ui/Icons";

const TokenomicsSection = () => {
  const specs = [
    {
      id: "oracle",
      title: "Chainlink Oracles",
      subtitle: "Decentralized Price Aggregator",
      description:
        "Direct on-chain queries to Chainlink's Sepolia ETH/USD aggregator. Provides tamper-proof market pricing with 8-decimal precision and sub-second settlement.",
      badge: "AggregatorV3",
      metric: "8 Decimals",
      icon: <ChainlinkSvg className="w-6 h-6 text-[#375BD2]" />,
      accent: "from-[#375BD2]/20 to-[#375BD2]/5",
      borderHover: "hover:border-[#375BD2]/60",
      glowColor: "rgba(55,91,210,0.18)",
      tags: ["0x694A...306", "Real-Time", "Zero MEV"],
    },
    {
      id: "atomic",
      title: "Atomic Minting",
      subtitle: "1-Block Guaranteed Delivery",
      description:
        "Single-transaction execution. Your ETH is deposited and FBCK tokens are minted into your wallet within the exact same block. Formula: (ETH × Price) ÷ $3.00.",
      badge: "Instant Finality",
      metric: "0% Slippage",
      icon: <Zap className="w-6 h-6 text-[#FF5500]" />,
      accent: "from-[#FF5500]/20 to-[#FF5500]/5",
      borderHover: "hover:border-[#FF5500]/60",
      glowColor: "rgba(255,85,0,0.22)",
      tags: ["Deterministic", "No Sandwich", "Atomic"],
    },
    {
      id: "security",
      title: "Audited Invariants",
      subtitle: "OpenZeppelin Standard",
      description:
        "Constructed on OpenZeppelin ERC-20 with strict role-based access control. The TokenShop contract holds exclusive MINTER_ROLE privileges with Foundry test suites.",
      badge: "Audited",
      metric: "100% Invariant",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      accent: "from-emerald-500/20 to-emerald-500/5",
      borderHover: "hover:border-emerald-500/60",
      glowColor: "rgba(16,185,129,0.18)",
      tags: ["AccessControl", "Non-Custodial", "Foundry"],
    },
    {
      id: "valuation",
      title: "Protocol Peg: $3.00",
      subtitle: "Immutable Valuation Model",
      description:
        "Protected from AMM impermanent loss and sudden liquidity pool dumps. The token price is enforced at bytecode level through TOKEN_PRICE_USD constant.",
      badge: "$3.00 USD",
      metric: "Immutable",
      icon: <FbckSvg className="w-6 h-6" />,
      accent: "from-[#FF5500]/20 to-[#FFA14A]/5",
      borderHover: "hover:border-[#FF5500]/60",
      glowColor: "rgba(255,85,0,0.22)",
      tags: ["18 Decimals", "Burnable", "No LP Drain"],
    },
  ];

  // Framer motion variants for the scroll-trigger pop out animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 55,
      scale: 0.88,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 18,
        mass: 0.85,
      },
    },
  };

  return (
    <section id="specs" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header with smooth entrance */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="text-center space-y-3 mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-main)] bg-[var(--bg-card)]/90 backdrop-blur-md text-xs font-mono font-semibold text-[var(--text-muted)] shadow-xs">
          <span className="h-2 w-2 rounded-full bg-[#FF5500] animate-pulse" />
          <span>Protocol Architecture & Specifications</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-main)] font-sans">
          Engineered for <span className="text-[#FF5500]">Certainty</span>
        </h2>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[var(--text-muted)] font-mono leading-relaxed">
          Every swap is calculated on-chain through decentralized Chainlink feeds and verified ERC-20 minting.
        </p>
      </motion.div>

      {/* ALL FOUR CARDS POPPING OUT ONE AFTER ANOTHER ON SCROLL */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {specs.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{
              y: -10,
              scale: 1.025,
              transition: { type: "spring", stiffness: 380, damping: 22 },
            }}
            className={`group relative flex flex-col justify-between rounded-3xl p-7 bg-[var(--bg-card)] border border-[var(--border-main)] ${item.borderHover} shadow-md hover:shadow-2xl transition-all duration-300 backdrop-blur-xl cursor-default overflow-hidden min-h-[340px]`}
          >
            {/* Ambient Background Gradient Glow on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`}
            />

            {/* Top Accent Flare */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5500]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Card Content Top */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-main)] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="flex flex-col items-end gap-1 font-mono">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[#FF5500]">
                    {item.metric}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)] font-sans tracking-tight group-hover:text-[#FF5500] transition-colors">
                  {item.title}
                </h3>
                <h4 className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                  {item.subtitle}
                </h4>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans pt-1">
                {item.description}
              </p>
            </div>

            {/* Bottom Tech Specification Tags */}
            <div className="relative z-10 pt-5 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-1.5">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="w-6 h-6 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TokenomicsSection;
