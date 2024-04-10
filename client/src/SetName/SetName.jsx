import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router";
import './SetName.css';
import { SharedContext } from "../context/SharedContext";

const SetName = () => {

  const { mapNameAndUsernameToWalletId } = useContext(SharedContext);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading,setLoadingtext] = useState("Let's Go!");
  const navigate = useNavigate();


  const handleSetName = async () => {
    setLoadingtext("Loading ...");
    // Check if both name and username are filled
    if (name.trim() !== '' && username.trim() !== '') {
      await mapNameAndUsernameToWalletId(name, username);
      setLoadingtext('Lets Go!');
      navigate('/dashboard');
    } else {
      alert('Please fill in both name and username fields');
    }
  };

  return (
    <>
    <div className="full_page_name">
        <h1>Claim Your Space</h1>
        <span className='unlock'>Unlock Your Experience</span>
        <br />
        <span><input type="text" placeholder='Enter Name' className='setnameuser' value={name} onChange={(e) => setName(e.target.value)} /></span>
        <br />
        <span><input type="text" placeholder='Enter UserName' className='setnameuser' value={username} onChange={(e) => setUsername(e.target.value)}/></span>
        <br />
        <button id="setname" onClick={handleSetName}>{loading}</button>
        
    </div>
    
    </>
  )
}

export default SetName
