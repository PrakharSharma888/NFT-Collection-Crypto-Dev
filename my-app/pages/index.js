import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { NFT_ABI, NFT_ADDRESS } from '../constrants/index';

import { useEffect, useState, useRef} from 'react';
import { Contract, ethers, utils } from 'ethers'
import Web3Modal from 'web3modal'
export default function Home() {

  const web3ModalRef = useRef()
  const[walletConnected, setWalletConnected] = useState(false)
  const[PresaleStarted, setPresaleStarted] = useState(false)
  const[presaleEnded, setPresaleEnded] = useState(false) 
  const[numTokenMinted, setNumTokenMinted] = useState("")
  const[isOwner, setIsOwner] = useState(false)
  const[loading, setLoading] = useState(false)

  const connectWallet = async() => {
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    }
    catch(error){
      console.log(error)
    }
  }

  const getOwner = async () => {
    const signer = await getProviderOrSigner(true)

    const contractConnecter = new Contract(
      NFT_ADDRESS,
      NFT_ABI,
      signer
    )
    const owner = await contractConnecter.owner()
    const currentAddress = await signer.getAddress()

    if(owner.toLowerCase() == currentAddress.toLowerCase()){
      setIsOwner(true);
    }
  }

  const getNumMintedTokens = async () => {
    try {
      const provider = await getProviderOrSigner()

      const contractConnecter = new Contract(
        NFT_ADDRESS,
        NFT_ABI,
        provider
      );

    const numOfTokenIds = await contractConnecter.tokenId()
    setNumTokenMinted(numOfTokenIds.toString())

    } catch (error) {
      console.log(error)
    }
    
  }

  const presaleMint = async () => {
    try {
      setLoading(true)
      const signer = await getProviderOrSigner(true)

      const contractConnecter = new Contract(
        NFT_ADDRESS,
        NFT_ABI,
        signer
      )

      console.log("Presaleeee",await contractConnecter.presaleStarted())
      console.log("Presaleeee",await contractConnecter.presaleStarted())
      const txn = await contractConnecter.presaleMint({
        value : utils.parseEther('0.01'),
      })
      await txn.wait()
      window.alert("You have successfully minted a CryptoDev");
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const mint = async () => {
    try {
      setLoading(true)
      const signer = await getProviderOrSigner(true)

      const contractConnecter = new Contract(
        NFT_ADDRESS,
        NFT_ABI,
        signer
      )

      const txn = await contractConnecter.mint({
        value : utils.parseEther('0.01')
      })
      await txn.wait()
      window.alert("You have successfully minted a CryptoDev")

    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const startPresale = async () => {
    try {
      setLoading(true)
      const signer = await getProviderOrSigner(true)

      const contractConnecter = new Contract(
        NFT_ADDRESS,
        NFT_ABI,
        signer
      )

      const txn = contractConnecter.presaleStared()
      await txn.wait()
      setPresaleStarted(true)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const checkIfPresaleEnded = async () => {
    try {
      console.log("hellooo")
      const provider = await getProviderOrSigner()
      const contractConnecter = new Contract(
        NFT_ADDRESS,
        NFT_ABI,
        provider
      );

      const presaleEndedTime = await contractConnecter.presaleEnded()
      const nowTime = Date.now() / 1000;

      const isPresaleEnded = presaleEndedTime.lt(Math.floor(nowTime))
      console.log(isPresaleEnded)
      setPresaleEnded(isPresaleEnded)
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfPresaleStarted = async () => {

    try{
      const provider = await getProviderOrSigner()

      const contractConnecter = new Contract(
        NFT_ADDRESS,
        NFT_ABI,
        provider
      );
      const isPresaleStarted = await contractConnecter.presaleStarted()
      setPresaleStarted(isPresaleStarted)
      return isPresaleStarted
      }
    catch(error){
      console.log(error)
      return false
    }
  }

  const getProviderOrSigner = async (needSigner = false) =>{
    
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider)

    const { chainId } = await web3Provider.getNetwork()
    console.log(chainId)
    if(chainId !== 4){
      window.alert("Please Switch to rinkeby!");
      throw new Error("Incorrect Network!");
    }
    if(needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  const onPageLoad = async () => {
    await connectWallet();
    await getOwner()
    const _isPresaleStarted = await checkIfPresaleStarted()
    console.log(_isPresaleStarted)
    if(_isPresaleStarted){
      await checkIfPresaleEnded()
    }
    await getNumMintedTokens();

    setInterval(async ()=>{
      await getNumMintedTokens();
    }, 3*1000)

    setInterval(async() => {
      const _isPresaleStarted = await checkIfPresaleStarted();
      if(_isPresaleStarted){
        await checkIfPresaleEnded()
      }
    }, 3*1000);
  }

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false
      });
      onPageLoad()
    }
  }, [])
   
  function renderBody(){
    if(!walletConnected){
      return(
          <button className={styles.button}>
            Connect to wallet!
          </button>
      )
    }

    if(loading){
      return (
        <h1 className={styles.loading}>Loadingg</h1>
      )
    }

    if(isOwner && !PresaleStarted){
      return (
        <button className={styles.button} onClick={startPresale}>
          Start Presale Now
        </button>
      )
    }
    if(!PresaleStarted){
      return(
        <div>
          <div className={styles.description}>The Presale hasent started yet!</div>
        </div>
      )
    }
    if(PresaleStarted && !presaleEnded){
      console.log("Presale : ", PresaleStarted, "Presale Ended :", presaleEnded)
      return(
        <div>
          <div className={styles.description}>You can mint "CryptoDevs", if you are a part of the Whitelist Presale mint !</div>
          <button className={styles.button} onClick={presaleMint}>
              Presale Mint ! 🚀
          </button>
        </div>
      )
    }
    if(presaleEnded){
      return(
        <div>
          <div className={styles.description}>You can mint "CryptoDevs" now in public mint if remains any !</div>
          <button className={styles.button} onClick={mint}>
              Public Mint! 😮
          </button>
        </div>
      )
    }
  }




  return (
    <div>
      <Head>
        <title>Prakhar</title>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to CryptoDevs NFT</h1>
          <div className={styles.description}>This is the collection for developers in Web3</div>
          
          <div className={styles.description}>
            A total of {numTokenMinted}/20 has been minted already! 
          </div>

          {renderBody()}
        </div>
        <img src='/cat.png' className={styles.image} />
      </div>
    </div>
  );
}
