-include .env

compile:; forge compile

clean:; forge clean

deploy:; forge script script/DeployTokenShop.s.sol --rpc-url $(SEPOLIA_RPC_URL) --account testaccount --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

unit:; forge test --match-path test/unit/TokenShopUnitTest.t.sol

fuzz:; forge test --match-path test/fuzz/TokenShopFuzzTest.t.sol

fork:; forge test --match-path test/fork/TokenShopForkTest.t.sol
