# FomoShop — Frontend

A React-based frontend for **FomoShop**, a decentralized token purchasing application that allows users to connect their wallet, view ETH and FBCK balances, calculate the amount of FBCK tokens they can receive, and purchase FBCK tokens using ETH.

The frontend interacts directly with the deployed TokenShop and ERC-20 smart contracts using **ethers.js**.

## Features

* 🔗 Connect and disconnect an Ethereum wallet
* 💰 Display user's ETH balance
* 🪙 Display user's FBCK token balance
* 📊 Display ETH and FBCK token prices
* 🔄 Calculate FBCK tokens received for a given ETH amount
* 💸 Purchase FBCK tokens using ETH
* ⛓️ Direct interaction with Ethereum smart contracts
* ⚡ Transaction confirmation and balance refresh
* 📱 Responsive token-swap-style interface

## Tech Stack

* **React**
* **Vite**
* **JavaScript**
* **Tailwind CSS**
* **ethers.js v6**
* **MetaMask**
* **Ethereum / EVM**
* **Foundry contract artifacts**

## Architecture

```text
User
 │
 ▼
React Frontend
 │
 ├── Navbar
 │    └── Wallet Connection
 │
 ├── Interaction
 │    ├── Contract interaction
 │    ├── ETH balance
 │    ├── FBCK balance
 │    ├── Price data
 │    └── Token calculation
 │
 └── Card
      ├── ETH input
      ├── FBCK output
      └── Buy Token
              │
              ▼
        ethers.js
              │
              ▼
      Ethereum Network
          │         │
          ▼         ▼
     TokenShop    MyToken
      Contract     ERC-20
```

## Project Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── Connection.jsx
│   ├── Interaction.jsx
│   └── Card.jsx
│
├── App.jsx
├── index.css
└── main.jsx
```

## Smart Contracts

The frontend interacts with two deployed contracts:

### TokenShop

Responsible for:

* Accepting ETH from users
* Calculating the FBCK token amount
* Selling FBCK tokens
* Providing token pricing information
* Providing ETH price information

### MyToken

The ERC-20 token contract for FBCK.

The frontend uses it to retrieve the connected user's FBCK balance.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SHOP_CONTRACT_ADDRESS=your_token_shop_contract_address
VITE_TOKEN_CONTRACT_ADDRESS=your_token_contract_address
```

### Important

Do **not** commit your `.env` file to GitHub.

Only public contract addresses should be exposed through the frontend environment variables. Never put private keys, seed phrases, or other secrets in a Vite environment variable.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Run Locally

Start the Vite development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

Make sure MetaMask is installed and connected to the network where the TokenShop contracts are deployed.

## Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Wallet Flow

The frontend follows this basic wallet flow:

```text
Connect Wallet
      ↓
Request wallet access
      ↓
Get Provider
      ↓
Get Signer
      ↓
Get Wallet Address
      ↓
Load balances and contract data
```

The provider is used for blockchain read operations, while the signer is used when the user needs to authorize a transaction.

## Token Purchase Flow

```text
User enters ETH amount
          ↓
Frontend calls amountToBuy()
          ↓
FBCK amount is displayed
          ↓
User clicks Buy
          ↓
MetaMask transaction request
          ↓
TokenShop.buyTokens()
          ↓
Transaction confirmed
          ↓
Frontend refreshes balances
```

## Security Considerations

This frontend does not store or handle users' private keys.

Transactions are signed through the user's wallet, such as MetaMask.

However, users should always verify:

* The connected network
* The contract address
* The transaction amount
* The transaction recipient
* The smart-contract source before interacting with a deployed application

The frontend itself should not be considered a security boundary. Smart-contract security must be enforced at the contract level.

## Deployment

The frontend can be deployed using platforms such as **Vercel**.

For a Vite application:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

The required `VITE_*` environment variables must also be configured in the deployment platform.

## Future Improvements

Planned improvements include:

* Network detection and wrong-network warning
* Better transaction loading states
* Transaction error handling
* Transaction history
* Token approval/allowance information
* Improved responsive design
* Token and ETH price formatting
* Wallet/account change detection
* Integration with a blockchain explorer
* Improved accessibility

## Disclaimer

TokenShop is a learning and development project built for demonstrating decentralized application development and smart-contract interaction.

Use only testnet funds when interacting with a test deployment.

## Author

**Abhishek Maurya**

Blockchain Developer focused on:

* Solidity
* Foundry
* Smart Contract Development
* DeFi
* Smart Contract Security
* EVM Internals

