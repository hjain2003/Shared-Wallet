import React, { useContext, useState } from "react";
import "./MainSection.css";

import money1 from "./money1.svg";
import money2 from "./money2.svg";
import WalletCard from "./WalletCard/WalletCard";
import { SharedContext } from "../context/SharedContext";

const MainSection = () => {
  const { connectWallet, accountBalance, currentAccount, createSharedWallet } = useContext(SharedContext);

  const shortenAddress = (address) => {
    if (address) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    return '';
  };

  const [isSharedWalletOpen, setIsSharedWalletOpen] = useState(false);
  const [btnText, setbtnText] = useState('Create');

  const [walletName, setWalletName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [borrowLimit, setBorrowLimit] = useState('');


  const openSharedWalletPopUp = () => {
    setIsSharedWalletOpen(true);
  }

  const closeSharedWalletCreateBox = () => {
    setIsSharedWalletOpen(false);
  }

  const handleCreateSharedWallet = async () => {
    try {
      setbtnText('Loading ...');
      const walletId = await createSharedWallet(goalAmount, borrowLimit, walletName);
      closeSharedWalletCreateBox();
      setbtnText('Create');
      window.alert(`Wallet created with ID : ${walletId}`)
    } catch (error) {
      setbtnText('Close');
      console.log(error);
    }


  }
  return (
    <>
      {isSharedWalletOpen && (
        <div className="shared_wallet_create">
          <h2 align="center">Create Shared Wallet</h2>
          <br />
          <label htmlFor="">Wallet Name</label>
          <input type="text" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
          <br />
          <label htmlFor="">Borrow Limit</label>
          <input type="number" value={borrowLimit} onChange={(e) => setBorrowLimit(e.target.value)} />
          <br />
          <label htmlFor="">Goal</label>
          <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
          <br />
          <div className="row_wallet">
            <button id="create" onClick={handleCreateSharedWallet}>{btnText}</button>
            &nbsp;&nbsp;&nbsp;
            <button id="cancel" onClick={closeSharedWalletCreateBox}>Cancel</button>
          </div>
        </div>
      )
      }
      <div className="main">
        <div className="main-grid">

          <div className="assets">
            <div className="ass1">
              <img src={money1} alt="logo" />
              <div className="money-text">
                <div className="money-head">Total Balance</div>
                <div className="money-value"><span className="grey">{accountBalance} ETH</span></div>
              </div>
            </div>
            <div className="ass2">
              <img src={money2} alt="logo" />
              <div className="money-text">
                <div className="money-head">Wallet Address</div>
                <div className="money-value"><span className="grey">{shortenAddress(currentAccount)}</span></div>
              </div>
            </div>
            <button id="create_wallet" onClick={openSharedWalletPopUp}>Create Shared Wallet</button>
          </div>

          <div className="shared-wallets-section">
            <div className="shared-head"> Your Shared Wallets</div>
            <div className="shared-wallets">
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
              <WalletCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainSection;
