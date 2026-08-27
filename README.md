# TokenShop

A decentralized ERC-20 token shop that allows users to purchase **FomoBlock (FBCK)** tokens using ETH. The token amount is dynamically calculated using the current **ETH/USD price from Chainlink**.

Built with **Solidity, Foundry, OpenZeppelin, and Chainlink Price Feeds**, this project demonstrates practical smart-contract engineering, including ERC-20 implementation, role-based access control, oracle integration, ETH handling, automated testing, and deployment workflows.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.4-363636?style=flat-square\&logo=solidity)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Framework-Foundry-FFDB1C?style=flat-square)](https://book.getfoundry.sh/)
[![Chainlink](https://img.shields.io/badge/Oracle-Chainlink-375BD2?style=flat-square\&logo=chainlink)](https://chain.link/)
[![OpenZeppelin](https://img.shields.io/badge/Security-OpenZeppelin-4E5EE4?style=flat-square)](https://www.openzeppelin.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Overview

TokenShop implements an on-chain token purchasing mechanism where:

1. A user sends ETH to the `TokenShop` contract.
2. `TokenShop` retrieves the ETH/USD price from a Chainlink price feed.
3. The ETH value is converted into USD.
4. The corresponding FBCK token amount is calculated.
5. FBCK tokens are minted directly to the buyer.
6. The contract owner can withdraw the ETH accumulated by the shop.

The architecture separates the **ERC-20 token** from the **token sale mechanism**, while role-based access control restricts who can mint tokens.

---

## Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         │                     │
                         │      Sends ETH      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     TokenShop       │
                         │                     │
                         │  Receive ETH        │
                         │  Read ETH/USD       │
                         │  Calculate USD      │
                         │  Calculate FBCK     │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                ┌──────────────────┐   ┌──────────────────┐
                │ Chainlink Price  │   │     MyToken      │
                │      Feed        │   │   ERC-20 FBCK    │
                └──────────────────┘   └────────┬─────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │     User     │
                                         │  FBCK Tokens │
                                         └──────────────┘
```

---

## Smart Contract Flow

### Token Purchase

```text
User
 │
 │ Send ETH
 ▼
TokenShop
 │
 ├── Validate ETH amount
 │
 ├── Read Chainlink ETH/USD price
 │
 ├── Convert ETH → USD
 │
 ├── Calculate FBCK amount
 │
 └── Mint FBCK
        │
        ▼
      User
```

### ETH Withdrawal

```text
TokenShop
    │
    │ Owner calls withdraw()
    ▼
Check contract balance
    │
    ▼
Transfer ETH to owner
    │
    ├── Success → Complete
    │
    └── Failure → Revert
```

---

## Core Contracts

### `MyToken`

`MyToken` is the ERC-20 token used by the TokenShop.

| Property       | Value                        |
| -------------- | ---------------------------- |
| Name           | FomoBlock                    |
| Symbol         | FBCK                         |
| Standard       | ERC-20                       |
| Decimals       | 18                           |
| Access Control | OpenZeppelin `AccessControl` |
| Minting        | Restricted to `MINTER_ROLE`  |

The deployer receives `DEFAULT_ADMIN_ROLE`, which is responsible for managing roles.

Only accounts with `MINTER_ROLE` can mint FBCK tokens.

---

### `TokenShop`

`TokenShop` is the core token sale contract.

Responsibilities:

* Accept ETH from users.
* Retrieve the ETH/USD price from Chainlink.
* Convert ETH value into USD.
* Calculate the corresponding FBCK amount.
* Mint FBCK tokens to buyers.
* Allow the owner to withdraw collected ETH.

The contract uses OpenZeppelin's `Ownable` for administrative access control.

---

## Token Pricing Model

The FBCK token price is denominated in USD while users pay with ETH.

The conversion flow is:

```text
ETH sent
   │
   ▼
Chainlink ETH/USD Price
   │
   ▼
ETH value in USD
   │
   ▼
FBCK USD Price
   │
   ▼
FBCK amount
   │
   ▼
Mint tokens
```

Chainlink price feeds have their own decimal precision, so the price is normalized before being used in the token calculation.

This allows the shop to maintain a USD-denominated token price while accepting ETH payments.

---

## Access Control

Token minting is restricted through OpenZeppelin's `AccessControl`.

```text
DEFAULT_ADMIN_ROLE
        │
        │ manages roles
        ▼
   MINTER_ROLE
        │
        │ authorizes
        ▼
   MyToken.mint()
        │
        ▼
    FBCK Tokens
```

The `TokenShop` contract must be granted `MINTER_ROLE` before it can mint FBCK tokens for buyers.

This prevents arbitrary accounts from directly minting tokens.

---

## Security Considerations

The project demonstrates several important smart-contract security practices:

* **Role-based access control** for token minting.
* **Owner-only withdrawal** of collected ETH.
* **Custom errors** for gas-efficient revert handling.
* **Chainlink price-feed integration** instead of accepting a user-supplied exchange rate.
* **Zero-value validation** for token purchases.
* **Checked ETH transfers** with success verification.
* **Separation of token and sale-contract responsibilities**.

### Current Security Limitations

This is an educational and portfolio implementation and **has not been independently audited**.

Before production deployment, additional security controls should be considered:

* Chainlink stale-price validation.
* Chainlink round-completeness validation.
* Oracle heartbeat/deviation checks.
* Maximum purchase limits.
* Token issuance limits.
* Emergency pause functionality.
* Expanded fuzz and invariant testing.
* Independent smart-contract security audit.

---

## Testing

The project uses **Foundry** for Solidity-native testing.

The current test suite covers areas including:

* Contract ownership.
* Role configuration.
* Token-shop behavior.
* Token interactions.
* Access-control behavior.

### Run Tests

```bash
forge test
```

### Verbose Test Output

```bash
forge test -vvv
```

### Format Contracts

```bash
forge fmt
```

### Generate Gas Snapshot

```bash
forge snapshot
```

### Test Coverage

```bash
forge coverage
```

---

### Fork Testing Flow

```text
                    Ethereum Sepolia
                          │
                          │ Fork
                          ▼
                 ┌──────────────────┐
                 │  Local Foundry   │
                 │      Fork        │
                 └────────┬─────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       Chainlink Feed              TokenShop
       Real Contract               Contract
             │                         │
             └────────────┬────────────┘
                          ▼
                     Fork Tests
```

### Run Fork Tests

Configure the Sepolia RPC endpoint:

```text
SEPOLIA_RPC_URL=<your_sepolia_rpc_url>
```

Then run:

```bash
forge test --fork-url $SEPOLIA_RPC_URL -vvv
```

> Fork testing requires access to a Sepolia RPC endpoint.

---

## Project Structure

```text
TokenShop/
├── .github/
│   └── workflows/
│       └── test.yml
│
├── lib/
│   ├── chainlink-evm/
│   ├── forge-std/
│   └── openzeppelin-contracts/
│
├── script/
│   ├── DeployTokenShop.s.sol
│   └── HelperConfig.s.sol
│
├── src/
│   ├── MyToken.sol
│   └── TokenShop.sol
│
├── test/
│   ├── helper/
│   ├── mocks/
│   └── unit/
│       └── TokenShopUnitTest.t.sol
│
├── foundry.toml
├── foundry.lock
├── Makefile
└── README.md
```

---

## Tech Stack

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| **Solidity**       | Smart-contract development           |
| **Foundry**        | Development, testing and deployment  |
| **OpenZeppelin**   | ERC-20 and access-control primitives |
| **Chainlink**      | ETH/USD price oracle                 |
| **Forge**          | Solidity testing                     |
| **Anvil**          | Local EVM development                |
| **Cast**           | EVM interaction and contract tooling |
| **GitHub Actions** | Continuous integration               |

---

## Installation

### Prerequisites

* Git
* Foundry

Clone the repository:

```bash
git clone https://github.com/abhiblock-96/TokenShop.git
cd TokenShop
```

Install dependencies:

```bash
forge install
```

Build the project:

```bash
forge build
```

---

## Environment Configuration

For Sepolia deployment and fork testing, configure the required environment variables.

Example:

```text
SEPOLIA_RPC_URL=<your_sepolia_rpc_url>
ETHERSCAN_API_KEY=<your_etherscan_api_key>
```

Never commit:

* Private keys.
* API credentials.
* `.env` files.
* Other sensitive deployment secrets.

---

## Deployment

The repository provides deployment and network configuration scripts under `script/`.

The Makefile provides a Sepolia deployment workflow with contract verification.

```bash
make deploy
```

The deployment workflow uses:

* Sepolia RPC.
* Foundry scripting.
* Transaction broadcasting.
* Etherscan verification.

---

## Key Engineering Concepts

This project demonstrates practical Solidity and smart-contract engineering concepts:

* ERC-20 token implementation.
* OpenZeppelin `AccessControl`.
* OpenZeppelin `Ownable`.
* Role-based mint authorization.
* Custom Solidity errors.
* ETH handling through `receive()`.
* Chainlink price-feed integration.
* Oracle decimal normalization.
* On-chain ETH/USD conversion.
* Contract-to-contract interaction.
* Foundry unit testing.
* Fork testing.
* Deployment scripting.
* Network-specific configuration.
* GitHub Actions CI.
* Etherscan verification.

---

## Future Improvements

* [ ] Add Chainlink stale-price validation.
* [ ] Validate Chainlink round completeness.
* [ ] Add oracle heartbeat/deviation checks.
* [ ] Add purchase limits.
* [ ] Add token issuance limits.
* [ ] Add pause/unpause emergency functionality.
* [ ] Add events for purchases and withdrawals.
* [ ] Expand fuzz testing.
* [ ] Add invariant testing.
* [ ] Add deployment addresses and verified contract links.
* [ ] Add support for additional networks.
* [ ] Build a frontend interface.
* [ ] Perform an independent smart-contract security audit.

---

## Disclaimer

This project is intended for **educational and portfolio purposes**.

It has **not been independently audited** and should not be considered production-ready financial infrastructure without additional testing, security review, and appropriate risk controls.

---

## License

This project is licensed under the **MIT License**.

---

## Author

### Abhishek Maurya
