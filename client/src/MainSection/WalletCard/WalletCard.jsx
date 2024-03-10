import React,{useContext, useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import './WalletCard.css';
import SharedWallet from './SharedWallet/SharedWallet';
import openlogo from './fluent_open-20-regular.svg';

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
  const [openCard, setOpenCard] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [lendPopupVisible, setLendPopupVisible] = useState(false);
  const [borrowPopupVisible, setBorrowPopupVisible] = useState(false);

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

  const hexWalletId = wallet.walletId.toHexString();
  const decimalWalletId = parseInt(hexWalletId, 16).toString();

  return (
    <div>
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
          <div className='borrow-btn' onClick={handleBorrowClick}>Borrow</div>
          <div className='lend-btn' onClick={handleLendClick}>Lend</div>
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
                  Enter the amount you want to lend:
                  <input type="number"></input>
                  <div className="row-btns-br-len">
                  <button className="lend-confirm">Lend</button>
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
                    Enter the amount you want to borrow:
                    <input type="number"></input>
                    <div className="row-btns-br-len">
                    <button className="lend-confirm">Borrow</button>
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
        <SharedWallet open={openCard} onClose={CardClose} walletId={decimalWalletId} walletName={wallet.walletName} goalAmount={wallet.goalAmount} borrowLimit={wallet.borrowLimit} />
      </div>
    </div>
  );
};

export default WalletCard;
