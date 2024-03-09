import React, { useContext } from 'react'
import { useNavigate } from 'react-router';
import Typewriter from "typewriter-effect";

import './Landing.css';
import EthLogo from './EthLogo.svg';
import { SharedContext } from '../context/SharedContext';

const Landing = () => {
    
    const navigate= useNavigate();
    const {connectWallet} = useContext(SharedContext);

    const handleConnect = async ()=>{
      await connectWallet();
      navigate('/dashboard');
    }

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
        <div className='connect-wallet' onClick={handleConnect}>
        <span className='land-button'>Connect with MetaMask</span>
        </div>
    </div>
  )
}

export default Landing