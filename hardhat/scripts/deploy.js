const { ethers } = require("hardhat")
const { BASE_URI, WHITELIST_CONTRACT_ADDRESS } = require("../helper-config")

async function main() {
    const cryptoDevFactory = await ethers.getContractFactory("CryptoDevs")
    const CryptoDev = await cryptoDevFactory.deploy(
        BASE_URI,
        WHITELIST_CONTRACT_ADDRESS
    )
    await CryptoDev.deployed()
    console.log(`Contract Deployed at : ${CryptoDev.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
