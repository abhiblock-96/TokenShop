import React from "react";
import { ShieldCheck, Code2 } from "lucide-react";

const Footer = ({ setActivePage }) => {
  const handleNav = (id) => {
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

  return (
    <footer className="border-t border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--text-muted)] py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <button
          onClick={() => handleNav("swap")}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF5500] text-white text-[11px] font-bold">
            T
          </div>
          <span className="font-bold text-[var(--text-main)] font-sans">
            Token<span className="text-[#FF5500]">Shop</span>
          </span>
          <span className="text-[var(--text-muted)] ml-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified On-Chain
          </span>
        </button>

        <div className="flex items-center gap-5">
          <button
            onClick={() => handleNav("swap")}
            className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            Swap
          </button>
          <button
            onClick={() => handleNav("specs")}
            className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            Specs
          </button>
          <button
            onClick={() => handleNav("activity")}
            className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            Activity
          </button>
          <button
            onClick={() => handleNav("docs")}
            className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            Docs
          </button>
          <a
            href="https://github.com/abhiblock-96/TokenShop"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FF5500] transition-colors flex items-center gap-1"
          >
            <Code2 className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
