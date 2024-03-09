import React, {useState, useEffect } from 'react'
import {ethers} from "ethers";
import { contractABI,contractAddress } from '../utils/constants.js';

export const SharedContext = React.createContext();

const {ethereum} = window;

const createEthereumContract=()=>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const SharedContract = new ethers.Contract(contractAddress,contractABI,signer);

    console.log({
        provider,
        signer,
        SharedContract
    })
    return SharedContract;
}

export const SharedProvider=({children})=>{

    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected=async()=>{
        if(!ethereum)
            alert("Please install Metamask!");
        
        const accounts= await ethereum.request({method : 'eth_accounts'});

        console.log(accounts);
    }

    const connectWallet=async()=>{
        try {
            if(!ethereum)
                alert("Please install Metamask!!");

            const accounts= await ethereum.request({method : 'eth_requestAccounts'});
            
            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }
            console.log(currentAccount);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
    },[currentAccount])

    return(
        <SharedContext.Provider value={{connectWallet}}>
            {children}
        </SharedContext.Provider>
    )
}
