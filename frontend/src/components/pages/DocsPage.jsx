import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Code2, ShieldCheck, Terminal, BookOpen } from "lucide-react";
import { ChainlinkSvg, EthSvg, FbckSvg } from "@/components/ui/Icons";

export const DocsPage = () => {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyAddress = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contracts = [
    {
      name: "TokenShop DEX Contract",
      address: import.meta.env.VITE_SHOP_CONTRACT_ADDRESS || "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      desc: "Handles atomic ETH payments, Chainlink price queries, and token dispatch.",
      key: "shop",
    },
    {
      name: "FBCK ERC-20 Token Contract",
      address: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      desc: "Compliant OpenZeppelin ERC-20 asset with 18 decimals and fixed valuation peg.",
      key: "token",
    },
    {
      name: "Chainlink ETH/USD Aggregator",
      address: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      desc: "Sepolia Testnet official Chainlink aggregator for decentralized price feeds.",
      key: "oracle",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-main)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-main)] bg-[var(--bg-card)] text-xs font-mono font-medium text-[var(--text-muted)] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Developer Reference</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)] font-sans">
            Protocol Architecture & Docs
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Technical specifications, smart contract addresses, and deterministic pricing formulas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Foundry Verified
          </Badge>
        </div>
      </div>

      {/* Contract Registry */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text-main)] font-mono">
          Smart Contract Registry
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {contracts.map((c) => (
            <Card
              key={c.key}
              className="p-5 border-[var(--border-main)] bg-[var(--bg-card)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[var(--text-main)] font-mono">
                    {c.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-2 font-mono">
                    Sepolia
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{c.desc}</p>
                <div className="text-xs font-mono text-[#FF5500] font-semibold break-all pt-1">
                  {c.address}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyAddress(c.key, c.address)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-input)] hover:bg-[var(--bg-elevated)] text-xs font-mono text-[var(--text-main)] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === c.key ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Copy
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Formula Explanation */}
      <Card className="p-6 border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FF5500]" />
          <h2 className="text-base font-bold text-[var(--text-main)] font-mono">
            Deterministic Exchange Mechanics
          </h2>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          TokenShop avoids AMM impermanent loss and sandwich attacks by utilizing Chainlink Decentralized Data Feeds for pricing. The contract calculates the token exchange amount atomically in a single function call:
        </p>

        <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-main)] text-xs font-mono text-[var(--text-main)] space-y-2">
          <div className="text-[#FF5500] font-bold">
            // Mathematical Conversion Formula
          </div>
          <div className="text-sm">
            FBCK_Amount = (ETH_Amount_Wei * Chainlink_ETH_USD) / FBCK_USD_Peg
          </div>
          <div className="text-[11px] text-[var(--text-muted)] pt-1">
            • Chainlink_ETH_USD: Feed precision scaled to 18 decimals<br />
            • FBCK_USD_Peg: Fixed at 3.00 USD per token<br />
            • Execution: Atomic ERC-20 transfer within buyTokens()
          </div>
        </div>
      </Card>

      {/* Security Architecture */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 border-[var(--border-main)] bg-[var(--bg-card)] space-y-2">
          <div className="flex items-center gap-2 text-[#FF5500]">
            <Code2 className="w-4 h-4" />
            <h3 className="font-bold text-sm text-[var(--text-main)] font-mono">
              OpenZeppelin ERC-20
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Standardized implementation prevents token loss vulnerabilities, supports standard allowances, and provides native decimal compatibility with DEX routers.
          </p>
        </Card>

        <Card className="p-5 border-[var(--border-main)] bg-[var(--bg-card)] space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-bold text-sm text-[var(--text-main)] font-mono">
              Foundry Test Coverage
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            All invariant states, edge-case decimal normalizations, and reentrancy behaviors have been verified with Foundry unit test suites.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DocsPage;
