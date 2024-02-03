import React, { useState } from 'react';
import './WalletCard.css';
import SharedWallet from './SharedWallet/SharedWallet';
import openlogo from './fluent_open-20-regular.svg';

const WalletCard = () => {
  const [openCard, setOpenCard] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  function CardClose(){
    setOpenCard(false);
    setOverlayVisible(false);
}

  const handleOpenLogoClick = () => {
    setOpenCard(true);
    setOverlayVisible(true);
  };

  return (
    <div>
      {overlayVisible && <div className="overlay"></div>}
      <div className='wallet-card'>
      <div className='wallet-card-top'>
        <div className='wallet-id'>Shared Wallet ID</div>
        <div className='open-logo' onClick={handleOpenLogoClick}>
          <img src={openlogo} className='o-logo' alt='Open Logo' />
        </div>
      </div>
      <div className='sw-info'>Wallet Name</div>
      <div className='sw-info'>Wallet Balance: 8 ETH</div>
      <div className='card-bottom'>
        <div className='borrow-btn'>Borrow</div>
        <div className='lend-btn'>Lend</div>
      </div>
      </div>
      <div>
      <div className='pop-up'>
      <SharedWallet open={openCard} onClose={CardClose}/>
      </div>
      </div>    
    </div>
  );
};

export default WalletCard;
