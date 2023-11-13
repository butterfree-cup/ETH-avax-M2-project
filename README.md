# ETH+AVAX Project: Function Frontend

## Description
This ExtraSimple ATM application demonstrates showing the values, which are yielded from the functions in a simple smart contract, on the frontend. The contract includes features that interact with an Ethereum wallet browser extension. For this project, MetaMask wallet was used for testing and running the program.

## Feature Overview
This application includes the following key components:

1. **Withdraw**:
   - Accepts a number input for the amount to withdraw
   - Triggers a MetaMask notification for the withdrawal transaction

2. **Deposit**:
   - Accepts a number input for the amount to deposit
   - Triggers a MetaMask notification for the deposit transaction

3. **Display Contract Address**:
   - Displays the address of the smart contract

4. **Change Contract Owner**:
   - Accepts an input for the new contract owner
   - Opens a MetaMask notification for the ownership change

5. **Calculate Factorial**:
   - Accepts a number input below 21
   - Displays the factorial of the input

## Deployment
After cloning the github, do the following instructions.

1. In the initial terminal, run the command: npm i.
2. Open two additional terminals within your project directory.
3. In the second terminal, execute: npx hardhat node.
4. In the third terminal, run: npx hardhat run --network localhost scripts/deploy.js.
5. Return to the first terminal and type: npm run dev.

After this, the project will be running on your localhost, which is usually http://localhost:3000/.

