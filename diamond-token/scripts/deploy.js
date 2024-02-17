const hre = require("hardhat");

async function main() {
  const DiamondToken = await hre.ethers.getContractFactory("DiamondToken");
  const diamondToken = await DiamondToken.deploy(100000000, 50);

  await diamondToken.waitForDeployment();

  console.log("Diamond Token deployed successfully to: ", await diamondToken.getAddress())
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
