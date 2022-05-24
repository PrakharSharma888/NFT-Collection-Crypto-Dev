const hre = require("hardhat");
const {METADATA_URL,WHITELIST_CONTRACT_ADDRESS} = require('../constrants');

async function main() {

  const metaData = METADATA_URL;
  const whiteListAddress = WHITELIST_CONTRACT_ADDRESS;

  const CD = await hre.ethers.getContractFactory("CryptoDevs");
  const cd = await CD.deploy(
    metaData,
    whiteListAddress
  );

  await cd.deployed();

  console.log("CryptoDevs deployed to:", cd.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
