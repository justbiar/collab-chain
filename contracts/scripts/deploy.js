const { ethers, network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying ChainCard on ${network.name} from ${deployer.address}`);

  const ChainCard = await ethers.getContractFactory("ChainCard");
  // Aynı adres hem owner (setMinter çağırabilir) hem minter (mint çağırır) —
  // testnet için basitlik amacıyla tek anahtar; mainnet öncesi ayrılabilir.
  const contract = await ChainCard.deploy(deployer.address, deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`ChainCard deployed to: ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
