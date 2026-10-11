import React from "react";

// Handcrafted luxury multi-facet Ethereum diamond SVG
export const EthSvg = ({ className = "w-5 h-5", ...props }) => (
  <svg
    viewBox="0 0 256 417"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M127.961 0L125.166 9.5V285.168L127.961 287.957L255.923 212.32L127.961 0Z"
      fill="#627EEA"
      fillOpacity="0.85"
    />
    <path
      d="M127.962 0L0 212.32L127.962 287.957V157.301V0Z"
      fill="#627EEA"
    />
    <path
      d="M127.961 312.187L126.386 314.106V413.784L127.961 416.732L256 236.586L127.961 312.187Z"
      fill="#627EEA"
      fillOpacity="0.85"
    />
    <path
      d="M127.962 416.732V312.187L0 236.586L127.962 416.732Z"
      fill="#627EEA"
    />
    <path
      d="M127.961 287.958L255.923 212.32L127.961 157.302V287.958Z"
      fill="#8A92B2"
    />
    <path
      d="M0 212.32L127.962 287.958V157.302L0 212.32Z"
      fill="#627EEA"
      fillOpacity="0.65"
    />
  </svg>
);

// Bespoke vibrant orange FBCK Token Emblem SVG
export const FbckSvg = ({ className = "w-5 h-5", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle
      cx="50"
      cy="50"
      r="48"
      fill="url(#fbckGrad)"
      stroke="#FF7A33"
      strokeWidth="2.5"
    />
    {/* Inner ring */}
    <circle
      cx="50"
      cy="50"
      r="38"
      stroke="#FFFFFF"
      strokeOpacity="0.25"
      strokeWidth="1.5"
      strokeDasharray="4 2"
    />
    {/* Geometric F glyph */}
    <path
      d="M36 28H64C66.2 28 68 29.8 68 32C68 34.2 66.2 36 64 36H44V46H60C62.2 46 64 47.8 64 50C64 52.2 62.2 54 60 54H44V72C44 74.2 42.2 76 40 76C37.8 76 36 74.2 36 72V28Z"
      fill="#FFFFFF"
    />
    <defs>
      <linearGradient id="fbckGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6A1A" />
        <stop offset="0.5" stopColor="#FF5500" />
        <stop offset="1" stopColor="#D94000" />
      </linearGradient>
    </defs>
  </svg>
);

// Chainlink Hexagon Network Node SVG
export const ChainlinkSvg = ({ className = "w-5 h-5", ...props }) => (
  <svg
    viewBox="0 0 100 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z"
      fill="#375BD2"
      fillOpacity="0.12"
      stroke="#375BD2"
      strokeWidth="7"
    />
    <path
      d="M50 25L71.6506 37.5V62.5L50 75L28.3494 62.5V37.5L50 25Z"
      fill="#375BD2"
    />
  </svg>
);

// Minimal Geometric Shield Check SVG
export const ShieldNodeSvg = ({ className = "w-5 h-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Minimal Pulse Ring SVG
export const PulseRingSvg = ({ className = "w-4 h-4", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="#FF5500" strokeWidth="1.5" strokeOpacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke="#FF5500" strokeWidth="2" />
    <circle cx="12" cy="12" r="2.5" fill="#FF5500" />
  </svg>
);
