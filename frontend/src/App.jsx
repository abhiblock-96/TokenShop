import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Connection from "./components/Connection";
import Interaction from "./components/Interaction";

const App = () => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    address: null,
  });

  const handleConnect = async () => {
    if (state.address) {
      setState({
        provider: null,
        signer: null,
        address: null,
      });
    } else {
      const [provider, signer, walletAddress] = await Connection();

      setState({
        provider,
        signer,
        address: walletAddress,
      });
    }
  };

  return (
    <div>
      <Navbar connection={handleConnect} address={state.address} />

      <Interaction state={state} />
    </div>
  );
};

export default App;
