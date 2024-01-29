import React from 'react'
import { useNavigate } from 'react-router';

import './Landing.css';
import EthLogo from './EthLogo.svg';

const Landing = () => {
    
    const navigate= useNavigate();

  return (
    <div className='landing-back'>
        <img src={EthLogo} alt="ethershare logo" className='es-logo'/>
        <div className='ES-name'>ETHERMATE</div>
        <div className='desc-es'>"Empowering Collaboration, Elevating Finances: Your Cryptocurrency Community Wallet for Seamless Sharing and Borrowing!"</div>
        <div className='connect-wallet' onClick={() => navigate('/dashboard')}>
        <span className='land-button'>Connect with MetaMask</span>
        </div>
    </div>
  )
}

export default Landing