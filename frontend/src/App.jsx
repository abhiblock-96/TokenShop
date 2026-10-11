import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Connection from "@/components/Connection";
import Interaction from "@/components/Interaction";
import HeroSection from "@/components/HeroSection";
import TokenomicsSection from "@/components/TokenomicsSection";
import LiveTransactionsSection from "@/components/LiveTransactionsSection";
import Footer from "@/components/Footer";
import DocsPage from "@/components/pages/DocsPage";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [activePage, setActivePage] = useState("swap");
  const [state, setState] = useState({
    provider: null,
    signer: null,
    address: null,
  });

  const [recentTxs, setRecentTxs] = useState([]);

  // Load persisted recent transactions when address is set
  useEffect(() => {
    if (state.address) {
      try {
        const stored = localStorage.getItem(`recentTxs_${state.address.toLowerCase()}`);
        if (stored) {
          setRecentTxs(JSON.parse(stored));
        }
      } catch (err) {
        console.warn("Could not retrieve stored transactions:", err);
      }
    } else {
      setRecentTxs([]);
    }
  }, [state.address]);

  // Listen for MetaMask account changes and network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setState({ provider: null, signer: null, address: null });
        setRecentTxs([]);
      } else {
        const { ethers } = await import("ethers");
        const activeProvider = new ethers.BrowserProvider(window.ethereum);
        const activeSigner = await activeProvider.getSigner();
        setState({
          provider: activeProvider,
          signer: activeSigner,
          address: accounts[0],
        });
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleConnect = async () => {
    if (state.address) {
      setState({
        provider: null,
        signer: null,
        address: null,
      });
      setRecentTxs([]);
    } else {
      try {
        const result = await Connection();
        if (result && result.length === 3) {
          const [provider, signer, walletAddress] = result;
          setState({
            provider,
            signer,
            address: walletAddress,
          });
        }
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    }
  };

  const handleTxSuccess = (newTx) => {
    setRecentTxs((prev) => {
      const updated = [
        newTx,
        ...prev.filter(
          (t) => (t.fullHash || t.hash).toLowerCase() !== (newTx.fullHash || newTx.hash).toLowerCase()
        ),
      ];
      if (state.address) {
        try {
          localStorage.setItem(`recentTxs_${state.address.toLowerCase()}`, JSON.stringify(updated));
        } catch (storageErr) {
          console.warn("Could not persist transaction:", storageErr);
        }
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col selection:bg-[#FF5500]/20 selection:text-[#FF5500] transition-colors">
      <Navbar
        connection={handleConnect}
        address={state.address}
        theme={theme}
        toggleTheme={toggleTheme}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 pt-28 md:pt-18">
        {activePage === "swap" && (
          <>
            <HeroSection ethPrice="2500" fbckPrice="3">
              <Interaction
                state={state}
                connection={handleConnect}
                onTxSuccess={handleTxSuccess}
              />
            </HeroSection>

            <TokenomicsSection />

            <LiveTransactionsSection
              address={state.address}
              provider={state.provider}
              connection={handleConnect}
              recentTxs={recentTxs}
            />
          </>
        )}

        {activePage === "docs" && <DocsPage />}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default App;
