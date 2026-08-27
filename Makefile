-include .env

compile:; forge compile

deploy:; forge script script/DeployTokenShop.s.sol --rpc-url $(SEPOLIA_RPC_URL) --account testaccount --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)