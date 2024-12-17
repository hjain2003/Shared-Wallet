import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import swexit from "./exit-icon.svg";
import swsettings from "./sw-settings.svg";
import vector1 from "./vector1.svg";
import vector2 from "./vector2.svg";
import vector3 from "./vector3.svg";
import vector4 from "./vector4.svg";
import vector5 from "./vector5.svg";

import "./SharedWallet.css";
import SettingsSW from "./SettingsSW/SettingsSW";
import { SharedContext } from "../../../context/SharedContext";

const pro1 = {
  hidden: {
    y: "100px",
    opacity: 0,
  },
  visible: {
    y: "200px",
    opacity: 1,
    transition: { delay: 0.0 },
  },
};

const SharedWallet = ({ open, onClose, walletId, walletName, goalAmount, borrowLimit, walletBalance }) => {
  const { requestToJoinWallet, getParticipantRequests, acceptParticipant, getWalletTransactions } = useContext(SharedContext);

  const [openSCard, setOpenSCard] = useState(false);
  const { getNumberOfParticipants, getParticipantsWithAddresses } = useContext(SharedContext);
  const [numberOfParticipants, setNumberOfParticipants] = useState(0);
  const [isopenparticipants, setopenparticipants] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [isRequestBoxOpen, setRequestBox] = useState(false);
  const[istransboxopen,setTransBoxOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

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

  const decimalGoal = convertWeiToEther(goalAmount) / 1e18;
  const decimalbl = convertWeiToEther(borrowLimit) / 1e18;

  const handleOpenSLogoClick = () => {
    setOpenSCard(true);
  };

  function CardSClose() {
    setOpenSCard(false);
  }

  const openParticipants = async () => {
    setopenparticipants(true);
    try {
      const participants = await getParticipantsWithAddresses(walletId);
      setParticipantsData(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const closeParticipants = () => {
    setopenparticipants(false);
    console.log("closed");
  };

  const setRequestBoxOpen = async () => {
    setRequestBox(true);
    try {
      const requests = await getParticipantRequests(walletId);
      setRequestsData(requests);
    } catch (error) {
      console.error("Error fetching participant requests:", error);
    }
  };

  const setRequestBoxClose = () => {
    setRequestBox(false);
  };

  const handleRequestToJoin = async () => {
    try {
      await requestToJoinWallet(walletId);
    } catch (error) {
      console.error("Error requesting to join wallet:", error);
    }
  };

  const toggleTransactionsBox =async()=>{
    setTransBoxOpen(true);
    try {
      const transactions = await getWalletTransactions(walletId);
      setTransactions(transactions.reverse());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  const closeTransBox =()=>{
    setTransBoxOpen(false);
  }

  var unit = "ETHEREUM";
  if (!open) return null;

  return (
    <>
      {/* PARTICIPANTS */}
      {isopenparticipants && (
        <div className="participant_list">
          <button id="close_participants" onClick={closeParticipants}>
            Close
          </button>
          <h3>Participants of {walletName}</h3>
          <input type="text" placeholder="Search Participants" />
          <br />
          {participantsData.map((participant, index) => (
            <div key={index} className="participant-row">
              <span className="username">{participant.username}</span>
              <span className="address">{`${participant.address.substring(0, 8)}...${participant.address.substring(
                participant.address.length - 4
              )}`}</span>
            </div>
          ))}
        </div>
      )}

      {/* REQUESTS */}
      {isRequestBoxOpen && (
        <div className="participant_list" id="part_requests">
          <button id="close_participants" onClick={setRequestBoxClose}>
            Close
          </button>
          <h3>Requests for {walletName}</h3>
          <input type="text" placeholder="Search Requests" />
          <br />
          {requestsData && requestsData.length > 0 ? (
            requestsData.map((requests, index) => (
              <div key={index} className="participant-row">
                <span className="username">{requests.username}</span>
                <span className="address">
                  {requests.address
                    ? `${requests.address.substring(0, 8)}...${requests.address.substring(requests.address.length - 4)}`
                    : "Address not available"}
                </span>

                <button
                  id="accept"
                  onClick={async () => {
                    try {
                      const success = await acceptParticipant(walletId, requests.address);
                    } catch (error) {
                      console.error(`Error accepting participant ${requests.address}:`, error);
                    }
                  }}
                >
                  Accept
                </button>
                <button id="reject">Reject</button>
              </div>
            ))
          ) : (
            <div>No requests found.</div>
          )}
        </div>
      )}

      {/* TRANSACTION HISTORY */}
{istransboxopen && (
  <div id="transactions">
    <button id="close_trans_box" onClick={closeTransBox}>Close</button>
    <b>Transaction History for <u>{walletName}</u></b>
    <br />
    <b>(WalletID: {walletId})</b>
    

    {/* Table for Transaction History */}
    <div className="transaction-table">
      <div className="table-header">
        <div className="table-column"><b>Sender</b></div>
        <div className="table-column"><b>Receiver</b></div>
        <div className="table-column"><b>Amount</b></div>
        <div className="table-column"><b>Description</b></div>
        <div className="table-column"><b>Timestamp</b></div>
      </div>

      {/* Display transaction rows */}
      {transactions && transactions.length > 0 ? (
        transactions.reverse().map((transaction, index) => (
          <div key={index} className="table-row">
            <div className="table-column">{transaction.sender}</div>
            <div className="table-column">{transaction.receiver}</div>
            <div className="table-column">{transaction.amount} {unit}</div>
            <div className="table-column">{transaction.description}</div>
            <div className="table-column">{transaction.timestamp}</div>
          </div>
        ))
      ) : (
        <div>No transactions found.</div>
      )}
    </div>
  </div>
)}

      <AnimatePresence>
        <div>
          <motion.div class="pro1" id="pro1" variants={pro1} initial="hidden" animate="visible">
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
                  <div className="swvalue">
                    {walletBalance} {unit}
                  </div>
                  <div className="swlogo">Balance</div>
                </div>
                {/* card2 */}
                <div className="swinfo info1">
                  <div className="swlogo-back">
                    <img src={vector2} />
                  </div>
                  <div className="swvalue">
                    {decimalGoal} {unit}
                  </div>
                  <div className="swlogo">Goal</div>
                </div>
                {/* card3 */}
                <div className="swinfo info1">
                  <div className="swlogo-back">
                    <img src={vector3} />
                  </div>
                  <div className="swvalue">
                    {decimalbl} {unit}
                  </div>
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
                    <div className="swvalue" onClick={toggleTransactionsBox}>Transaction</div>
                    <div className="swlogo">History</div>
                  </div>
                </div>
              </div>
              <div className="swbtn-btm">
                <button className="leave-wallet" onClick={handleRequestToJoin}>
                  Request To Join
                </button>
                <button className="leave-wallet" onClick={setRequestBoxOpen}>
                  See Requests
                </button>
              </div>
            </div>
            <div>{openSCard && <SettingsSW sopen={openSCard} onClose={CardSClose} />}</div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default SharedWallet;
