const { ethers } = require("hardhat")
const { BASE_URI, WHITELIST_CONTRACT_ADDRESS } = require("../helper-config")

// contract address (goerli testnet) : 0x217f3aEAe122aC1bC7Ea63482e4d3FA52bb3Eb10

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
