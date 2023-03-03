const { ethers } = require("hardhat")
// contract address (goerli testnet) : 0x217f3aEAe122aC1bC7Ea63482e4d3FA52bb3Eb10

async function main() {
    const CryptoDev = await ethers.getContractAt(
        "CryptoDevs",
        "0x217f3aEAe122aC1bC7Ea63482e4d3FA52bb3Eb10"
    )

    const tx = await CryptoDev.startPreSale()
    await tx.wait(6)
    console.log("Started Presale..")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
