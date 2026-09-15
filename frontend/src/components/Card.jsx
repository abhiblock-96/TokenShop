import React, { useEffect, useState } from "react";
import "../index.css";

const Card = ({
  balance,
  fbckBal,
  ethPrice,
  fbckPrice,
  getTokenAmount,
  buyToken,
}) => {
  const [inputEthValue, setInputEthValue] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  useEffect(() => {
    const setAmount = async () => {
      if (!inputEthValue) {
        setTokenAmount("");
        return;
      }

      const tokenAmt = await getTokenAmount(inputEthValue);

      if (tokenAmt !== undefined) {
        setTokenAmount(tokenAmt);
      }
    };

    setAmount();
  }, [inputEthValue, getTokenAmount]);

  const buyTokens = async () => {
    if (!inputEthValue) {
      alert("Enter ETH amount first");
      return;
    }

    await buyToken(inputEthValue);
  };

  return (
    <div className="w-110 absolute rounded-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#2B3038] bg-[#171A20] p-2 shadow-2xl">
      <div className="h-33.75 rounded-[20px] border border-[#343943] bg-[#20242B] p-4">
        <div className="mt-5 grid grid-cols-[1fr_110px] items-start">

          <div className="min-w-0">
            <input
              type="number"
              placeholder="0"
              value={inputEthValue}
              className="w-full bg-transparent text-[40px] font-medium text-[#F5F1EA] outline-none placeholder:text-[#555B65]"
              onChange={(e) => {
                setInputEthValue(e.target.value);
              }}
            />

            <div className="mt-2.5 text-sm text-[#777D87]">
              {ethPrice ? `$${ethPrice.toString().slice(0, 4)}` : "$0.00"}
            </div>
          </div>

          <div className="w-27.5">
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-[#3A404A] bg-[#292D35] px-4 py-2 text-sm font-semibold text-[#F5F1EA] transition hover:border-[#E0784F] hover:bg-[#30353E]">
              <span>$ETH</span>
            </button>

            <div className="mt-2.5 w-full text-right text-sm text-[#777D87]">
              {balance ? balance.slice(0, 7) : "0.00"}
            </div>
          </div>
        </div>
      </div>

      <button
        className="
          absolute left-1/2 top-1/1.5 z-10
          flex h-10 w-10
          -translate-x-1/2 -translate-y-1/2
          items-center justify-center
          rounded-full
          border-4 border-[#171A20]
          bg-[#292D35]
          text-lg text-[#F5F1EA]
          shadow-lg
          transition
          hover:bg-[#E0784F]
        "
      >
        ↓
      </button>

      <div className="mt-1 h-33.75 rounded-[20px] border border-[#343943] bg-[#20242B] p-4">
        <div className="mt-5 grid grid-cols-[1fr_110px] items-start">

          <div className="min-w-0">
            <input
              type="number"
              readOnly
              placeholder="0"
              value={tokenAmount}
              className="w-full bg-transparent text-[40px] font-medium text-[#F5F1EA] outline-none placeholder:text-[#555B65]"
            />

            <div className="mt-2.5 text-sm text-[#777D87]">
              {fbckPrice ? `$${fbckPrice.toString().slice(0, 1)}` : "$0.00"}
            </div>
          </div>

          <div className="w-27.5">
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-[#3A404A] bg-[#292D35] px-3 py-2 text-sm font-semibold text-[#F5F1EA] transition hover:border-[#E0784F] hover:bg-[#30353E]">
              <span>$FBCK</span>
            </button>

            <div className="mt-2.5 w-full text-right text-sm text-[#777D87]">
              {fbckBal ? fbckBal.slice(0, 7) : "0.00"}
            </div>
          </div>
        </div>
      </div>

      <button
        className="mt-1 h-13.75 w-full rounded-[20px] bg-[#E0784F] font-semibold text-white transition hover:bg-[#F08A60] active:scale-[0.99]"
        onClick={buyTokens}
      >
        Buy
      </button>
    </div>
  );
};

export default Card;
