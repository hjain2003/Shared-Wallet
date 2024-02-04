import React from 'react'
import { useNavigate } from 'react-router';
import Typewriter from "typewriter-effect";

import './Landing.css';
import EthLogo from './EthLogo.svg';

const Landing = () => {
    
    const navigate= useNavigate();

  return (
    <div className='landing-back'>
        <img src={EthLogo} alt="ethershare logo" className='es-logo'/>
        <div className='ES-name'>ETHERMATE</div>
        <div className='desc-es'>
        <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("Empowering Collaboration, Elevating Finances!")
                  .pauseFor(0)
                  //  .deleteAll()
                  .start();
              }}
            />
          
          </div>
        <div className='connect-wallet' onClick={() => navigate('/dashboard')}>
        <span className='land-button'>Connect with MetaMask</span>
        </div>
    </div>
  )
}

export default Landing