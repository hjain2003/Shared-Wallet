import React, { useState } from 'react';
import './WalletCard.css';
import SharedWallet from './SharedWallet/SharedWallet';
import openlogo from './fluent_open-20-regular.svg';

const WalletCard = ({wallet, walid}) => {
  const [openCard, setOpenCard] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);

  function CardClose(){
    setOpenCard(false);
    setOverlayVisible(false);
}

  const handleOpenLogoClick = () => {
    setOpenCard(true);
    setOverlayVisible(true);
  };

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
        <div className='borrow-btn'>Borrow</div>
        <div className='lend-btn'>Lend</div>
      </div>
      </div>
      <div>
      <div className='pop-up'>
      <SharedWallet open={openCard} onClose={CardClose} walletId={decimalWalletId} walletName={wallet.walletName} goalAmount={wallet.goalAmount} borrowLimit={wallet.borrowLimit}/>
      </div>
      </div>    
    </div>
  );
};

export default WalletCard;
