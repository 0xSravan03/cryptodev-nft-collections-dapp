"use client";

import Image from 'next/image';
import styles from './page.module.css';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { abi, contract_address } from "../contract/contract.json";

export default function Home() {
  const web3ModalRef = useRef(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0);


  const connectWallet = async () => {
    try {
      const web3ModalInstance = await web3ModalRef.current.connect(); // popup metamask
      const provider = new ethers.providers.Web3Provider(web3ModalInstance);
      setWalletConnected(true);
      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork()

      if (chainId != 5) {
        setWalletConnected(false);
        window.alert("Please Switch to the Goerli Network..");
        throw new Error("Incorrect Network");
      }
      const CryptoDevs = new ethers.Contract(contract_address, abi, signer); // returns contract
      return CryptoDevs;

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOptions: {},
      disableInjectedProvider: false
    });
  }, []);

  const handleClick = async () => {
    await connectWallet();
    const presaleStarted = await checkIfPresaleStarted();
    const presaleEnded = await checkIfPresaleEnded();
    await getOwner();
    await getTotalMinted();
  }

  const checkIfPresaleStarted = async () => {
    try {
      const contract = await connectWallet();
      const presaleStatus = await contract.isPreSaleStarted();
      setPresaleStarted(presaleStatus);
      console.log(presaleStatus);
    } catch (error) {
      console.error(error.message);
    }
  }

  const checkIfPresaleEnded = async () => {
    try {
      const contract = await connectWallet();
      const preSaleEnd = await contract.preSaleEnd();
      const hasEnded = preSaleEnd.lt(Math.floor(Date.now() / 1000)); //lt() used to compare values out of range
      console.log(hasEnded);
      setPresaleEnded(hasEnded);
      return hasEnded;
    } catch (error) {
      console.error(error.message);
    }
  }

  const getOwner = async () => {
    try {
      const contract = await connectWallet();
      const signerAddress = await contract.signer.getAddress(); // getting signer address from contract instance
      console.log(`Signer : ${signerAddress}`)
      const owner = await contract.owner(); // getting deployer address using owner() in the contract
      console.log(`Contract Deployer : ${owner}`);
    } catch (error) {
      console.error(error.message);
    }
  }

  const presaleMint = async () => {
    try {
      const contract = await connectWallet();
      const hasEnded = await checkIfPresaleEnded();
      const totalMint = await getTotalMinted();
      if (hasEnded && totalMint.gt(20)) {
        window.alert("Presale Ended");
        window.location.reload();
      } else {
        try {
          const tx = await contract.preSaleMint({value : ethers.utils.parseEther("0.001")});
          await tx.wait(3);
          window.alert("You have successfully Minted a NFT");
          window.location.reload();
        } catch (error) {
          window.alert("You are not Whitelisted");
          console.log(error.messgae);
        }

      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const publicMint = async () => {
    try {
      const contract = await connectWallet();
      const totalMint = await getTotalMinted();
      if (totalMint.gt(20)) {
        window.alert("Sold Out");
        window.location.reload();
      } else {
        const tx = await contract.mint({value : ethers.utils.parseEther("0.001")});
        await tx.wait(3);
        window.alert("You have successfully Minted a NFT");
        window.location.reload();
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const getTotalMinted = async () => {
    const contract = await connectWallet();
    const totalMint = await contract.tokenId();
    setTotalMinted(totalMint.toString());
    return totalMint;
  }

  return (
    <main className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
        <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
        </div>
        <div className={styles.description}>
            {totalMinted}/20 have been minted
        </div>
        <div className={styles.section}>      
          {
            walletConnected ? <span>Wallet Connected</span> : (<button className={styles.button} onClick={handleClick}>Connect Wallet</button>)
          }
        </div>

        <div className={styles.section}>
          {
          walletConnected ? (
            presaleStarted ? (presaleEnded  ? (<button className={styles.button} onClick={publicMint}>Public Mint</button>) : <button className={styles.button} onClick={presaleMint}>Presale Mint</button>) : <p>Sales has't Begun yet</p>) : null
          }
        </div>

        <footer className={styles.footer}>
          Made with &#10084; by Crypto Devs
        </footer>
      </div>
    </main>
  );
}
