const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

    // Helper function: bytes karşılaştırması
    function isAddressLower(address, threshold) {
      // Hex string'leri BigNumber'a çevir
      const addrBN = ethers.BigNumber.from(address);
      const thresholdBN = ethers.BigNumber.from(threshold);
      return addrBN.lt(thresholdBN);
    }

    let winner;

    // Önce mevcut signerları dene
    for (let i = 0; i < 20; i++) {
      try {
        const signer = ethers.provider.getSigner(i);
        const address = await signer.getAddress();

        if (isAddressLower(address, threshold)) {
          winner = signer;
          console.log(`Signer ${i} works! Address: ${address}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // Rastgele wallet'lar dene
    if (!winner) {
      console.log("Trying random wallets...");
      for (let i = 0; i < 1000; i++) {
        const randomWallet = ethers.Wallet.createRandom();
        const address = randomWallet.address;

        if (isAddressLower(address, threshold)) {
          // Wallet'a fon gönder (gas için)
          const [deployer] = await ethers.getSigners();
          await deployer.sendTransaction({
            to: address,
            value: ethers.utils.parseEther("0.1"),
          });

          winner = randomWallet.connect(ethers.provider);
          console.log(`Random wallet works! Address: ${address}`);
          break;
        }
      }
    }

    if (!winner) {
      throw new Error("No suitable signer found!");
    }

    await game.connect(winner).win();
    assert(await game.isWon(), "You did not win the game");
  });
});
