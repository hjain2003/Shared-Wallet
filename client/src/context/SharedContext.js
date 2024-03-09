import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../utils/constants.js';

export const SharedContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const SharedContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        SharedContract
    })
    return SharedContract;
}

export const SharedProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState(0);

    const checkIfWalletIsConnected = async () => {
        if (!ethereum)
            alert("Please install Metamask!");

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        console.log(accounts);
    }

    const connectWallet = async () => {
        try {
            if (!ethereum)
                alert("Please install Metamask!!");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
            console.log(currentAccount);

        } catch (error) {
            console.log(error);
        }
    }

    const getAccountBalance = async () => {
        try {
            if (currentAccount) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const balance = await provider.getBalance(currentAccount);
                const formattedBalance = parseFloat(
                    ethers.utils.formatEther(balance)
                ).toFixed(4)
                setAccountBalance(formattedBalance);
            }
        } catch (error) {
            console.error('Error fetching account balance:', error);
        }
    };

    const createSharedWallet = async (goalAmount, borrowLimit, walletName) => {
        try {
            const SharedContract = createEthereumContract();
    
            const goalAmountWei = ethers.utils.parseEther(goalAmount.toString());
            const borrowLimitWei = ethers.utils.parseEther(borrowLimit.toString());
    
            const transaction = await SharedContract.createSharedWallet(goalAmountWei, borrowLimitWei, `${walletName}`);
            const receipt = await transaction.wait();

            const walletId = receipt.events[0].args.walletId.toNumber();
    
            console.log(`Shared wallet "${walletName}" created successfully!`);
    
            getAccountBalance();
            return walletId;

        } catch (error) {
            console.error('Error creating shared wallet:', error);
        }
    };
    

    useEffect(() => {
        checkIfWalletIsConnected();
        getAccountBalance();
    }, [currentAccount])

    return (
        <SharedContext.Provider value={{ connectWallet, accountBalance, currentAccount, createSharedWallet }}>
            {children}
        </SharedContext.Provider>
    )
}
