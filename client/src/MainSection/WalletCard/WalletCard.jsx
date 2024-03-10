import React, { useContext, useState } from 'react';
import './WalletCard.css';
import SharedWallet from './SharedWallet/SharedWallet';
import { ethers } from "ethers";
import openlogo from './fluent_open-20-regular.svg';
import { SharedContext } from '../../context/SharedContext';

const WalletCard = ({ wallet, walid }) => {
  const { getSharedWalletBalance, addFundsToSharedWallet, withdrawFromSharedWallet } = useContext(SharedContext);
  const [openCard, setOpenCard] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);

  const [isDepositOpen, setisDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [deptxt, setdeptxt] = useState('Deposit');

  const [iswithdrawOpen, setisWithdrawOpen] = useState(false);
  const [withdrawAmt, setwithdrawAmt] = useState('');
  const [withdrawReason, setwithdrawReason] = useState('');
  const [withtxt, setwithtxt] = useState('Withdraw');


  const hexWalletId = wallet.walletId.toHexString();
  const decimalWalletId = parseInt(hexWalletId, 16).toString();


  function CardClose() {
    setOpenCard(false);
    setOverlayVisible(false);
  }

  const handleOpenLogoClick = () => {
    setOpenCard(true);
    setOverlayVisible(true);
  };


  const handleDeposit = async () => {
    if (depositAmount) {
      setdeptxt('Loading ...');
      // Trigger the add funds functionality from SharedContext
      await addFundsToSharedWallet(decimalWalletId, depositAmount);
      setDepositAmount(''); // Clear the input field
      setdeptxt('Deposit');
      setisDepositOpen(false);
    }
  };

  const openDepositBox = () => {
    setisDepositOpen(true);
  }

  const closedeposit = () => {
    setisDepositOpen(false);
  }

  const openWithdrawBox = () => {
    setisWithdrawOpen(true);
  }
  const closewithdrawBox = () => {
    setisWithdrawOpen(false);
  }

  const handleWithdraw = async () => {
    if (withdrawAmt && withdrawReason) {
      setwithtxt('Loading');
      console.log(withdrawAmt);
      // Trigger the withdraw funds functionality from SharedContext
      await withdrawFromSharedWallet(decimalWalletId, withdrawAmt * 1e18, withdrawReason);
      setwithdrawAmt(''); // Clear the input field
      setwithdrawReason(''); // Clear the input field
      setwithtxt('Withdraw');
      setisWithdrawOpen(false);
    }
  };


  return (
    <div>

      {isDepositOpen && (
        <div className="deposit_box">
          <h3 align="center">Deposit to {wallet.walletName}</h3>
          <label htmlFor="">Deposit Amount</label>
          <input type="text" placeholder='Amount to shared wallet' value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)} />
          <br />
          <div className="row_deposit">
            <button id="deposit" onClick={handleDeposit}>{deptxt}</button>
            &nbsp;&nbsp;&nbsp;
            <button id="cancel_wal" onClick={closedeposit}>Cancel</button>
          </div>
        </div>
      )}

      {iswithdrawOpen && (
        <div className="withdraw_box">
          <h3 align="center">Withdraw from {wallet.walletName}</h3>
          <label htmlFor="">Withdraw Amount</label>
          <input type="text" placeholder='Amount to be withdrawn' value={withdrawAmt} onChange={(e) => setwithdrawAmt(e.target.value)} />
          <br />
          <label htmlFor="">Withdrawl Reason</label>
          <textarea name="" id="" cols="30" rows="10" value={withdrawReason} onChange={(e) => setwithdrawReason(e.target.value)}></textarea>
          <br />
          <div className="row_deposit">
            <button id="withdraw" onClick={handleWithdraw}>{withtxt}</button>
            &nbsp;&nbsp;&nbsp;
            <button id="cancel_wal" onClick={closewithdrawBox}>Cancel</button>
          </div>
        </div>
      )}

      {overlayVisible && <div className="overlay"></div>}
      <div className='wallet-card'>
        <div className='wallet-card-top'>
          <div className='wallet-id'>{decimalWalletId}</div>
          <div className='open-logo' onClick={handleOpenLogoClick}>
            <img src={openlogo} className='o-logo' alt='Open Logo' />
          </div>
        </div>
        <div className='sw-info'><b>{wallet.walletName}</b></div>
        <div className='sw-info'></div>
        <div className='card-bottom'>
          <div className='borrow-btn' onClick={openWithdrawBox}>Withdraw</div>
          <div className='lend-btn' onClick={openDepositBox}>Deposit</div>
        </div>
      </div>
      <div>
        <div className='pop-up'>
          <SharedWallet open={openCard} onClose={CardClose} walletId={decimalWalletId} walletName={wallet.walletName} goalAmount={wallet.goalAmount} walletBalance={ethers.utils.formatEther(wallet.walletBalance.toString())}  borrowLimit={wallet.borrowLimit} />
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
