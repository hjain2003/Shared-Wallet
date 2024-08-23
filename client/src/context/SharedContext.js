import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants.js";

export const SharedContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const SharedContract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log({
    provider,
    signer,
    SharedContract,
  });
  return SharedContract;
};

export const SharedProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);
  const [sharedWalletBalance, setSharedWalletBalance] = useState({});

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) alert("Please install Metamask!");

    const accounts = await ethereum.request({ method: "eth_accounts" });

    console.log(accounts);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) alert("Please install Metamask!!");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
      console.log(currentAccount);
    } catch (error) {
      console.log(error);
    }
  };

  const getAccountBalance = async () => {
    try {
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const balance = await provider.getBalance(currentAccount);
        const formattedBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
        setAccountBalance(formattedBalance);
      }
    } catch (error) {
      console.error("Error fetching account balance:", error);
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
      console.error("Error creating shared wallet:", error);
    }
  };

  const getAllSharedWallets = async () => {
    try {
      const SharedContract = createEthereumContract();
      const wallets = await SharedContract.getAllSharedWallets();

      return wallets;
    } catch (error) {
      console.error("Error fetching shared wallets:", error);
    }
  };

  const addFundsToSharedWallet = async (walletId, amount) => {
    try {
      const SharedContract = createEthereumContract();
      const check = ethers.utils.parseEther(amount.toString());
      console.log("deposit context : ", check);
      await SharedContract.addFundsToSharedWallet(walletId, {
        value: ethers.utils.parseEther(amount.toString()),
      });
      getAccountBalance(); // Refresh the account balance
      console.log(`Funds added to Shared Wallet ${walletId}: ${amount} ETH`);
    } catch (error) {
      console.error("Error adding funds to Shared Wallet:", error);
    }
  };

  const getContractBalance = async () => {
    try {
      const SharedContract = createEthereumContract();
      const balance = await SharedContract.provider.getBalance(SharedContract.address);
      console.log("Contract Balance:", ethers.utils.formatEther(balance));
      return balance;
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      return ethers.BigNumber.from(0); // Return 0 if there's an error
    }
  };

  const withdrawFromSharedWallet = async (walletId, amount, description) => {
    try {
      const SharedContract = createEthereumContract();
      const check = ethers.utils.parseEther(amount.toString());
      console.log("context reached", check);
      await SharedContract.withdrawFundsFromSharedWallet(walletId, { value: check }, description);
      getAccountBalance();
      console.log(`Successfully withdrew ${amount} ETH from Shared Wallet ${walletId}`);
    } catch (error) {
      console.error("Error withdrawing funds from Shared Wallet:", error);
    }
  };

  const getNumberOfParticipants = async (walletId) => {
    try {
      const SharedContract = createEthereumContract();
      const numberOfParticipants = await SharedContract.getNumberOfParticipants(walletId);
      return numberOfParticipants;
    } catch (error) {
      console.error("Error fetching number of participants:", error);
    }
  };

  const getName = async () => {
    try {
      const SharedContract = createEthereumContract();
      const name = await SharedContract.getName();
      return name;
    } catch (error) {
      console.error("Error fetching name:", error);
    }
  };

  const getUsername = async () => {
    try {
      const SharedContract = createEthereumContract();
      const username = await SharedContract.getUsername();
      return username;
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const mapNameAndUsernameToWalletId = async (name, username) => {
    try {
      const SharedContract = createEthereumContract();
      await SharedContract.mapNameAndUsernameToWalletId(name, username);
      console.log("Name and username mapped successfully!");
    } catch (error) {
      console.error("Error mapping name and username:", error);
    }
  };

  const getParticipantsWithAddresses = async (walletId) => {
    try {
      const SharedContract = createEthereumContract();
      const [walletAddresses, usernames] = await SharedContract.getParticipantsWithAddresses(walletId);

      const participantsData = walletAddresses.map((address, index) => ({
        username: usernames[index],
        address: address,
      }));

      return participantsData;
    } catch (error) {
      console.error("Error fetching participants with addresses:", error);
      return [];
    }
  };

  const requestToJoinWallet = async (walletId) => {
    try {
      const SharedContract = createEthereumContract();

      // Call the requestToJoin function in the smart contract
      const transaction = await SharedContract.requestToJoin(walletId);
      const receipt = await transaction.wait();

      console.log("Request to join wallet successful!");

      // Optionally, you can trigger some state update or fetch updated data after the request is successful
    } catch (error) {
      console.error("Error requesting to join wallet:", error);
    }
  };

  const getParticipantRequests = async (walletId) => {
    try {
      const SharedContract = createEthereumContract();
  
      // Fetch the participant requests (addresses and usernames) from the contract
      const [walletAddresses, usernames] = await SharedContract.getParticipantRequests(walletId);
  
      // Combine addresses and usernames into an array of objects
      const requestsData = walletAddresses.map((address, index) => ({
        username: usernames[index],
        address: address,
      }));
  
      return requestsData;
    } catch (error) {
      console.error("Error retrieving participant requests:", error);
      return [];
    }
  };
  

  useEffect(() => {
    checkIfWalletIsConnected();
    getAccountBalance();
  }, [currentAccount]);

  return (
    <SharedContext.Provider
      value={{
        connectWallet,
        accountBalance,
        currentAccount,
        createSharedWallet,
        getAllSharedWallets,
        addFundsToSharedWallet,
        withdrawFromSharedWallet,
        getNumberOfParticipants,
        getName,
        getUsername,
        mapNameAndUsernameToWalletId,
        getContractBalance,
        getParticipantsWithAddresses,
        requestToJoinWallet,
        getParticipantRequests,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};
