import React,{useContext, useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

import swexit from "./exit-icon.svg";
import swsettings from "./sw-settings.svg";
import vector1 from "./vector1.svg";
import vector2 from "./vector2.svg";
import vector3 from "./vector3.svg";
import vector4 from "./vector4.svg";
import vector5 from "./vector5.svg";

import "./SharedWallet.css";
import SettingsSW from './SettingsSW/SettingsSW';
import { SharedContext } from "../../../context/SharedContext";

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

const SharedWallet = ({ open, onClose, walletId, walletName, goalAmount, borrowLimit, walletBalance}) => {

  const [openSCard, setOpenSCard] = useState(false);
  const { getNumberOfParticipants } = useContext(SharedContext);
  const [numberOfParticipants, setNumberOfParticipants] = useState(0);
  const [isopenparticipants, setopenparticipants] = useState(false);

  const participantsData = [
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    { username: "User1", address: "0x1234...5678" },
    { username: "User2", address: "0xABCD...EFGH" },
    // Add more participant objects as needed
  ];


  useEffect(() => {
    const fetchNumberOfParticipants = async () => {
      try {
        const participantsBigNumber = await getNumberOfParticipants(walletId);
        const participants = participantsBigNumber.toNumber(); // Convert BigNumber to number
        console.log("Number of participants:", participants); // Log the value
        setNumberOfParticipants(participants);
      } catch (error) {
        console.error("Error fetching number of participants:", error);
      }
    };

    if (open) {
      fetchNumberOfParticipants();
    }
  }, [open, getNumberOfParticipants, walletId]);


  const convertWeiToEther = (weiValue) => {
    const etherValue = weiValue / 1e18;
    return etherValue.toFixed(2);
  };

  const decimalGoal = convertWeiToEther(goalAmount)/1e18;
  const decimalbl = convertWeiToEther(borrowLimit)/1e18;


  const handleOpenSLogoClick = () => {
    setOpenSCard(true);
    
  };

  function CardSClose() {
    setOpenSCard(false);
  }

  const openParticipants = ()=>{
    setopenparticipants(true);
    console.log("participant clicked");
  }

  const closeParticipants = ()=>{
    setopenparticipants(false);
    console.log("closed");
  }

  var unit = "ETHEREUM";
  if (!open) return null;
  
  return (
    <>
   {isopenparticipants &&  (<div className="participant_list">
    <button id="close_participants" onClick={closeParticipants}>Close</button>
    <h3>Participants of {walletName}</h3>
    <input type="text" placeholder="Search Participants" />
    <br />
    {participantsData.map((participant, index) => (
            <div key={index} className="participant-row">
              <span className="username">{participant.username}</span>
              <span className="address">{participant.address}</span>
            </div>
          ))}
    </div>
   )}
    <AnimatePresence>
    <div>
      <motion.div
        class="pro1"
        id="pro1"
        variants={pro1}
        initial="hidden"
        animate="visible"
      >
        <div className="swmain">
          <div className="swheader">
            <div className="swh1">{walletName}</div>
            <div className="swh2">{walletId}</div>
            <div className="setting-exit-btns">
              <div className="logo1" onClick={onClose}>
                <img src={swexit} alt="Exit shared wallet" />
              </div>
              <div className="logo2" onClick={handleOpenSLogoClick}>
                <img src={swsettings} alt="Open shared wallet settings" />
              </div>
            </div>
          </div>
          <div></div>

          <div className="swinfos">
          {/* card1 */}
            <div className="swinfo info1">
              <div className="swlogo-back">
                <img src={vector1} />
              </div>
              <div className="swvalue">{walletBalance} {unit}</div>
              <div className="swlogo">Balance</div>
            </div>
            {/* card2 */}
            <div className="swinfo info1">
              <div className="swlogo-back">
                <img src={vector2} />
              </div>
              <div className="swvalue">{decimalGoal} {unit}</div>
              <div className="swlogo">Goal</div>
            </div>
            {/* card3 */}
            <div className="swinfo info1">
              <div className="swlogo-back">
                <img src={vector3} />
              </div>
              <div className="swvalue">{decimalbl} {unit}</div>
              <div className="swlogo">Borrow Limit</div>
            </div>
            <div className="swibottom">
            {/* card4 */}
            <div className="swinfo info1 b1 members-card" onClick={openParticipants}>
              <div className="swlogo-back">
                <img src={vector4} />
              </div>
              <div className="swvalue">{numberOfParticipants}</div>
              <div className="swlogo">Participants</div>
            </div>
            {/* card5 */}
            <div className="swinfo info1 b2 trn-hist">
              <div className="swlogo-back">
                <img src={vector5} />
              </div>
              <div className="swvalue">Transaction</div>
              <div className="swlogo">History</div>
            </div>

            </div>
          </div>
          <div className="swbtn-btm">
            <div className="leave-wallet">Leave Wallet</div>
          </div>
        </div>
        <div >
        {openSCard && <SettingsSW sopen={openSCard} onClose={CardSClose} />}
        </div>
      </motion.div>
      </div>
    </AnimatePresence>
    </>
  );
};

export default SharedWallet;
