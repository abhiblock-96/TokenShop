import React, { useState } from "react";
import { Wallet, Copy, Check, LogOut, Sun, Moon, ArrowLeftRight, BookOpen, Layers, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({
  connection,
  address,
  theme,
  toggleTheme,
  activePage = "swap",
  setActivePage,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleNavClick = (id) => {
    if (id === "docs") {
      setActivePage("docs");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActivePage("swap");
      if (id === "specs") {
        setTimeout(() => {
          document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else if (id === "activity") {
        setTimeout(() => {
          document.getElementById("activity")?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { id: "swap", label: "Swap", icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
    { id: "specs", label: "Specs", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "activity", label: "Activity", icon: <Activity className="w-3.5 h-3.5" /> },
    { id: "docs", label: "Docs", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[var(--border-main)] bg-[var(--bg-main)]/90 backdrop-blur-xl transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.25)]">
      <div className="max-w-6xl mx-auto flex h-18 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo - Click returns to Swap */}
        <button
          onClick={() => handleNavClick("swap")}
          className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5500] text-white shadow-[0_2px_12px_rgba(255,85,0,0.35)]">
            <span className="font-mono text-base font-black">T</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[var(--text-main)]">
              Token<span className="text-[#FF5500]">Shop</span>
            </span>
          </div>
        </button>

        {/* Dynamic Navigation (Swap, Specs, Activity, Docs) */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-main)] text-xs font-semibold">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${(activePage === item.id) || (activePage === "swap" && item.id === "swap")
                  ? "bg-[var(--bg-card)] text-[#FF5500] shadow-xs font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Section: Status & Wallet */}
        <div className="flex items-center gap-2.5">
          {/* Testnet Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-main)] bg-[var(--bg-elevated)] text-[11px] font-mono text-[var(--text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sepolia</span>
          </div>

          {/* Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title="Toggle Theme"
              type="button"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#FF5500]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>
          )}

          {/* Wallet Actions */}
          {address ? (
            <div className="flex items-center gap-1 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-1 text-xs font-mono shadow-xs">
              <span className="px-2.5 py-1 font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {truncatedAddress}
              </span>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                title="Copy Address"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                onClick={connection}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                title="Disconnect"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              onClick={connection}
              size="sm"
              className="font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5" />
              Connect
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[var(--border-main)] bg-[var(--bg-card)]/90 px-2 py-1.5 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono ${activePage === item.id || (activePage === "swap" && item.id === "swap")
                ? "bg-[#FF5500]/15 text-[#FF5500] font-bold"
                : "text-[var(--text-muted)]"
              }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
