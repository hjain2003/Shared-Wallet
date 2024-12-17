import React,{useContext, useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import './WalletCard.css';
import SharedWallet from './SharedWallet/SharedWallet';
import { ethers } from "ethers";
import openlogo from './fluent_open-20-regular.svg';
import { SharedContext } from '../../context/SharedContext';

const pro1 = {
  hidden: {
    y: '100px',
    opacity: 0,
  },
  visible: {
    y: '200px',
    opacity: 1,
    transition: { delay: 0.0 },
  },
};

const WalletCard = ({ wallet }) => {
  const {addFundsToSharedWallet, withdrawFromSharedWallet } = useContext(SharedContext);
  const [openCard, setOpenCard] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [lendPopupVisible, setLendPopupVisible] = useState(false);
  const [borrowPopupVisible, setBorrowPopupVisible] = useState(false);

  //deposit
  const [depositAmount, setDepositAmount] = useState('');
  const [deptxt, setdeptxt] = useState('Deposit');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [withdrawBtnText, setWithdrawBtnText] = useState('Withdraw');


  const CardClose = () => {
    setOpenCard(false);
    setOverlayVisible(false);
  };

  const handleOpenLogoClick = () => {
    setOpenCard(true);
    setOverlayVisible(true);
  };

  const handleBorrowClick = () => {
    setBorrowPopupVisible(true);
    setOverlayVisible(true);
  };

  const handleLendClick = () => {
    setLendPopupVisible(true);
    setOverlayVisible(true);
  };

  const closeBorrowBox = () => {
    setBorrowPopupVisible(false);
    setOverlayVisible(false);
  }

  const closeLendBox = () => {
    setLendPopupVisible(false);
    setOverlayVisible(false);
  }

  const handleDeposit = async () => {
    console.log("clickedddd");
    if (depositAmount) {
      setdeptxt('Depositing ...');
      // Trigger the add funds functionality from SharedContext
      await addFundsToSharedWallet(decimalWalletId, depositAmount);
      console.log(depositAmount);
      setDepositAmount(''); // Clear the input field
      setdeptxt('Deposit');
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount) {
      setWithdrawBtnText('Withdrawing ...');
      console.log(withdrawAmount);
      // Trigger the withdraw functionality from SharedContext
      await withdrawFromSharedWallet(decimalWalletId, withdrawAmount, withdrawDescription);
      setWithdrawAmount(''); // Clear the input field
      setWithdrawDescription(''); // Clear the description input
      setWithdrawBtnText('Withdraw');
    }
  };


  const hexWalletId = wallet.walletId.toHexString();
  const decimalWalletId = parseInt(hexWalletId, 16).toString();

  return (
    <div>

      {overlayVisible && <div className="overlay"></div>}
      <div className='wallet-card'>
        <div className='wallet-card-top'>
          <div className='wallet-id'>{wallet.walletName}</div>
          <div className='open-logo' onClick={handleOpenLogoClick}>
            <img src={openlogo} className='o-logo' alt='Open Logo' />
          </div>
        </div>
        <div className='sw-info'><b>{decimalWalletId}</b></div>
        <div className='sw-info'></div>
        <div className='card-bottom'>
          <div className='borrow-btn' onClick={handleBorrowClick}>Withdraw</div>
          <div className='lend-btn' onClick={handleLendClick}>Deposit</div>
        </div>
      </div>
      <div>
        <div className='pop-up'>
          {lendPopupVisible && 
            <AnimatePresence>
            <div>
              <motion.div
                class="pro1"
                id="pro1"
                variants={pro1}
                initial="hidden"
                animate="visible"
              >
                <div className="shared_wallet_create lend_info">
                  Enter the amount you want to deposit:
                  <input type="number" value= {depositAmount} onChange={(e) => setDepositAmount(e.target.value)} ></input>
                  <div className="row-btns-br-len">
                  <button className="lend-confirm" onClick={handleDeposit}>Deposit</button>
                  <button id="cancel-box" onClick={closeLendBox}>Cancel</button>
                   </div>
                </div>
                </motion.div>
              </div>
            </AnimatePresence>
            }
          {borrowPopupVisible && 
                <AnimatePresence>
                <div>
                  <motion.div
                    class="pro1"
                    id="pro1"
                    variants={pro1}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="shared_wallet_create borrow_info">
                    Enter the amount you want to withdraw:
                    <input type="number" value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(e.target.value)}  />
                    <br />
                    Enter description:
                    <input type="text" value={withdrawDescription} 
                      onChange={(e) => setWithdrawDescription(e.target.value)} />
                    <div className="row-btns-br-len">
                    <button className="lend-confirm" onClick={handleWithdraw}>{withdrawBtnText}</button>
                    <button id="cancel-box" onClick={closeBorrowBox}>Cancel</button>

                    </div>
                    </div>
                    </motion.div>
                  </div>
                </AnimatePresence>
          }
        </div>
      </div>
      <div>
        <SharedWallet open={openCard} onClose={CardClose} walletId={decimalWalletId} walletName={wallet.walletName} goalAmount={wallet.goalAmount} walletBalance ={wallet.walletBalance/1e18} borrowLimit={wallet.borrowLimit} />
      </div>
    </div>
  );
};

export default WalletCard;
