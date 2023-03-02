const { ethers } = require("hardhat")

async function main() {
    const cryptoDevFactory = await ethers.getContractFactory("CryptoDevs")
    const CryptoDev = await cryptoDevFactory.deploy(
        "abc",
        "0xcEbEF944e2fbe18de222A22157E86AeB21507940"
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
