import React, { useState } from "react";
import "./CharityCard.css";

const CharityCard = ({ name, description, walletId, onDonate }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [extrades, setextrades] = useState(false);

  const truncateWalletId = (id) => {
    if (!id) return "";
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  const handleDonate = () => {
    setIsPopupOpen(true);
  };

  const handleSubmit = () => {
    if (donationAmount && parseFloat(donationAmount) > 0) {
      onDonate(walletId, donationAmount);
      setIsPopupOpen(false);
      setDonationAmount("");
    } else {
      alert("Enter a valid donation amount.");
    }
  };

  const extra_desc=()=>{
    setextrades(true);
  }
  const closeextradesbox=()=>{
    setextrades(false);
  }

  return (
    <>
      {isPopupOpen && (
        <div className="popup_donate">
          <h3>Donate to {name}</h3>
          <input
            type="number"
            value={donationAmount}
            placeholder="Enter amount in ETH"
            onChange={(e) => setDonationAmount(e.target.value)}
          />
          <br />
          <span>
            <button onClick={handleSubmit}>Submit</button> &nbsp;&nbsp;&nbsp;
            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </span>
        </div>
      )}
      <div className="char-card">
        <div className="charity-id">{truncateWalletId(walletId)}</div>
        <div className="charity-name" onClick={extra_desc}>{name}</div>
        <br/>
        <div className="donate-charity" onClick={handleDonate}>
          Donate
        </div>
      </div>
      {extrades && 
          <div className="extradiv">
            {description}
            <br/><br/>
            <button id="close_extra_des" onClick={closeextradesbox}>Close</button>
          </div>
        }
         
    </>
  );
};

export default CharityCard;
