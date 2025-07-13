# 🎮 Smart Contract Puzzles

This project consists of educational puzzles designed to develop skills in reading and analyzing smart contracts. Each puzzle teaches different Solidity concepts and security vulnerabilities.

## 🎯 Objective

Each Game contract contains a boolean variable called `isWon`:

```solidity
bool public isWon;
```

**Goal:** Set this `isWon` variable to `true` - but without modifying the contract code, only by editing the test files!

## 🚀 Setup

```bash
# Clone the project
git clone <repo-url>
cd Contract-Puzzles

# Install dependencies
npm install

# Run all tests
npx hardhat test

# Run a single test file
npx hardhat test test/game1Test.js
```

## 📚 Puzzle Solutions

### Game 1: Basic Function Calls

**Topic:** Basic function calls and sequencing

**Contract Analysis:**

- `unlock()` function sets `unlocked` variable to `true`
- `win()` function only works if `unlocked` is true

**Solution:**

```javascript
await game.unlock(); // First unlock
await game.win(); // Then win
```

### Game 2: Mappings and Multiple Calls

**Topic:** Mapping structure and multiple function calls

**Contract Analysis:**

- `switches` mapping holds specific keys
- `win()` function expects 3 specific keys to be on: 20, 47, 212

**Solution:**

```javascript
await game.switchOn(20);
await game.switchOn(47);
await game.switchOn(212);
await game.win();
```

### Game 3: Address Balances and Comparisons

**Topic:** Address balances and comparison operators

**Contract Analysis:**

- `balances` mapping holds ETH balances of addresses
- `win()` function expects mathematical relationship between 3 addresses: `addr2 > addr1 > addr3 > 0`

**Solution:**

```javascript
const signer1 = ethers.provider.getSigner(0);
const signer2 = ethers.provider.getSigner(1);
const signer3 = ethers.provider.getSigner(2);

const addr1 = await signer1.getAddress();
const addr2 = await signer2.getAddress();
const addr3 = await signer3.getAddress();

await game.connect(signer3).buy({ value: "1" }); // addr3 = 1 wei
await game.connect(signer1).buy({ value: "2" }); // addr1 = 2 wei
await game.connect(signer2).buy({ value: "3" }); // addr2 = 3 wei

await game.win(addr1, addr2, addr3);
```

### Game 4: Nested Mappings

**Topic:** Nested mapping structures

**Contract Analysis:**

- `nested` mapping: `address => mapping(address => bool)`
- `write(x)` function: `nested[x][msg.sender] = true`
- `win(y)` function: checks `nested[msg.sender][y]`

**Solution:**

```javascript
const signer = ethers.provider.getSigner(0);
const signerAddress = await signer.getAddress();

await game.write(signerAddress); // nested[signerAddress][signerAddress] = true
await game.win(signerAddress); // checks nested[signerAddress][signerAddress]
```

### Game 5: Address Comparison and Brute Force

**Topic:** Address comparison and threshold bypass

**Contract Analysis:**

- `threshold` address: `0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf`
- `win()` function: checks `msg.sender < threshold`

**Solution:**

```javascript
const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
let winner;

// Generate random wallets and find one smaller than threshold
for (let i = 0; i < 100; i++) {
  const randomWallet = ethers.Wallet.createRandom();
  if (randomWallet.address.toLowerCase() < threshold.toLowerCase()) {
    winner = randomWallet.connect(ethers.provider);
    break;
  }
}

await game.connect(winner).win();
```

## 📖 What We Learned

1. **Function Sequencing:** Calling functions in the correct order
2. **Mapping Manipulation:** How to manipulate mapping structures
3. **Multi-signer Operations:** Working with multiple signers
4. **Address Comparisons:** Address comparisons and lexicographic ordering
5. **Nested Data Structures:** How nested data structures work
6. **Brute Force Techniques:** Finding addresses that satisfy certain conditions

## 🔧 Debugging Tips

```javascript
// Check contract state
console.log("isWon:", await game.isWon());

// Compare addresses
console.log("Address:", await signer.getAddress());

// Use Hardhat console.log
// In contract: import "hardhat/console.sol";
// In function: console.log("Debug info:", value);
```

## 🧪 Test Strategies

1. **Individual puzzle tests:** `npx hardhat test test/game1Test.js`
2. **Run all tests:** `npx hardhat test`
3. **Verbose output:** `npx hardhat test --verbose`
4. **Gas reporting:** To see gas usage in test results

## 🎓 Conclusion

These puzzles are perfect for learning smart contract security and the depths of Solidity. Each puzzle simulates situations you might encounter in real-world scenarios.
