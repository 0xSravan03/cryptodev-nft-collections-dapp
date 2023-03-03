"use client";

import Image from 'next/image';
import styles from './page.module.css';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const web3ModalRef = useRef(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    console.log('Connecting Wallet...');
    try {
      const web3ModalInstance = await web3ModalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(web3ModalInstance);
      setWalletConnected(true);
      const signer = provider.getSigner();
      console.log('Wallet Connected.')
      // const CryptoDevs = new ethers.Contract("", "", signer);
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

  const handleClick = () => {
    connectWallet();
  }

  return (
    <main className={styles.main}>
      <h1>CryptoDevs</h1>
      <button className={styles.button} onClick={handleClick}>
        {walletConnected ? <span>Mint</span> : <span>Connect</span>}
      </button>
    </main>
  );
}
