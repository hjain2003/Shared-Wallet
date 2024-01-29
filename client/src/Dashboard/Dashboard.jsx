import React from 'react'

import background from './BG.png';
import notif from './notification.svg';
import search from './search.svg';

import './Dashboard.css';
import Navbar from '../Navbar/Navbar';
import RightNav from '../RightNav/RightNav';
import MainSection from '../MainSection/MainSection';
const Dashboard = () => {
  return (      
    <div className='full-page' style={{ backgroundImage: `url(${background})` }}>
    <div className='grid'>
        <Navbar />
        <div className='welcome-section'>
        <div className='welcome'>
            Welcome Back, WalletID
        </div>
        <div className='search-notif'>
        <div className='search'>
        <div className='search-section'>
            <img src={search} alt='search logo'/>
            <input type='text' className='search-input' placeholder='Search'></input>
        </div>
        </div>
        <div className='notif'>
            <img src={notif} className="notif-logo" alt="notification-logo" />
        </div>
        </div>
        <div className='userinfo'>
            Shreeya
            <img src={notif} className="notif-logo" alt="Profile" />
        </div>
        </div>
    </div>
    <div className='grid2'>
    <MainSection className='midSection' />
    <RightNav />
    </div>
    </div>
  )
}

export default Dashboard