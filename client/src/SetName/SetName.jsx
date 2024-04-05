import React from 'react'
import './SetName.css';

const SetName = () => {
  return (
    <>
    <div className="full_page_name">
        <h1>Claim Your Space</h1>
        <span className='unlock'>Unlock Your Experience</span>
        <br />
        <span><input type="text" placeholder='Enter Name' className='setnameuser' /></span>
        <br />
        <span><input type="text" placeholder='Enter UserName' className='setnameuser'/></span>
        <br />
        <button id="setname">Let's Go!</button>
        
    </div>
    
    </>
  )
}

export default SetName
