import React,{useContext, useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MainSection.css";
import { FaPlus } from 'react-icons/fa';
import money1 from "./money1.svg";
import money2 from "./money2.svg";
import WalletCard from "./WalletCard/WalletCard";
import { SharedContext } from "../context/SharedContext";

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

const MainSection = () => {
  const { connectWallet, accountBalance, currentAccount, createSharedWallet, getAllSharedWallets, getSharedWalletsForUser, getSharedWalletsNotForUser, getRequestedSharedWallets, getContractBalance } = useContext(SharedContext);

  const shortenAddress = (address) => {
    if (address) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    return '';
  };

  const [isSharedWalletOpen, setIsSharedWalletOpen] = useState(false);
  const [btnText, setbtnText] = useState('Create');

  const [walletName, setWalletName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [borrowLimit, setBorrowLimit] = useState('');
  const [sharedWallets, setSharedWallets] = useState([]);
  const [currentWalletType, setCurrentWalletType] = useState("all");


  const openSharedWalletPopUp = () => {
    setIsSharedWalletOpen(true);
  }

  const closeSharedWalletCreateBox = () => {
    setIsSharedWalletOpen(false);
  }

  const handleCreateSharedWallet = async () => {
    try {
      setbtnText('Loading ...');
      const walletId = await createSharedWallet(goalAmount, borrowLimit, walletName);
      closeSharedWalletCreateBox();
      setbtnText('Create');
      window.alert(`Wallet created with ID : ${walletId}`)
    } catch (error) {
      setbtnText('Close');
      console.log(error);
    }

  }

  const fetchSharedWallets = async () => {
    const wallets = await getAllSharedWallets();
    const cb = await getContractBalance();
    console.log(cb);
    setSharedWallets(wallets);
  }

  const fetchMyWallets = async () => {
    try {
      const wallets = await getSharedWalletsForUser();
      setSharedWallets(wallets);
      setCurrentWalletType("my_wallets");
    } catch (error) {
      console.error("Error fetching my wallets:", error);
    }
  };

  const fetchNotMyWallets = async () => {
    try {
      const wallets = await getSharedWalletsNotForUser();
      setSharedWallets(wallets);
      setCurrentWalletType("not_my_wallets");
    } catch (error) {
      console.error("Error fetching not my wallets:", error);
    }
  };

  const fetchRequestedWallets = async () => {
    try {
      const wallets = await getRequestedSharedWallets();
      setSharedWallets(wallets);
      setCurrentWalletType("requested_wallets");
    } catch (error) {
      console.error("Error fetching requested wallets:", error);
    }
  };

  const fetchAllWallets = async () => {
    try {
      const wallets = await getAllSharedWallets();
      setSharedWallets(wallets);
      setCurrentWalletType("all");
    } catch (error) {
      console.error("Error fetching all wallets:", error);
    }
  };
  
  
  useEffect(() => {
    fetchSharedWallets();

  }, [currentAccount]);

  return (
    <>
      {isSharedWalletOpen && (
        <AnimatePresence>
    <div>
      <motion.div
        class="pro1"
        id="pro1"
        variants={pro1}
        initial="hidden"
        animate="visible"
      >
        <div className="shared_wallet_create">
          <div align="center" className="csw-head">Create Shared Wallet</div>
          <br />
          <label htmlFor="">Wallet Name</label>
          <input type="text" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
          <br />
          <label htmlFor="">Borrow Limit</label>
          <input type="number" value={borrowLimit} onChange={(e) => setBorrowLimit(e.target.value)} />
          <br />
          <label htmlFor="">Goal</label>
          <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
          <br />
          <div className="row_wallet">
            <button id="create" onClick={handleCreateSharedWallet}>{btnText}</button>
            &nbsp;&nbsp;&nbsp;
            <button id="cancel" onClick={closeSharedWalletCreateBox}>Cancel</button>
          </div>
        </div>
        </motion.div>
      </div>
    </AnimatePresence>
      )
      }
      <div className="main">
        <div className="main-grid">

          <div className="assets">
            <div className="ass1">
              <img src={money1} alt="logo" />
              <div className="money-text">
                <div className="money-head">Total Balance</div>
                <div className="money-value"><span className="grey">{accountBalance} ETH</span></div>
              </div>
            </div>
            <div className="ass2">
              <img src={money2} alt="logo" />
              <div className="money-text">
                <div className="money-head">Wallet Address</div>
                <div className="money-value"><span className="grey">{shortenAddress(currentAccount)}</span></div>
              </div>
            </div>
            <div div className="add-SW">
              <button id="create_wallet" onClick={openSharedWalletPopUp}>Create Shared Wallet &nbsp;<span className="plus-icon"><FaPlus /></span> </button>
              {/* <div className="cc-create-sw">Create Your Shared Wallet</div> */}
            </div>
          </div>

          <div className="shared-wallets-section">
            <div className="shared-head"> Available Shared Wallets</div>
            <div className="main_sec_row_btns">
            <button id="my_wallets" className={`mainsec_btns ${currentWalletType === "my_wallets" ? 'selected' : ''}`}  onClick={fetchMyWallets}>My Wallets</button>
            <button id="not_my_wallets" className={`mainsec_btns ${currentWalletType === "not_my_wallets" ? 'selected' : ''}`}  onClick={fetchNotMyWallets}>Not My Wallets</button>
            <button id="request_wallets" className={`mainsec_btns ${currentWalletType === "requested_wallets" ? 'selected' : ''}`}  onClick={fetchRequestedWallets}>Requested Wallets</button>
            <button id="all_wallets" className={`mainsec_btns ${currentWalletType === "all" ? '' : ''}`} onClick={fetchAllWallets}>Remove Filters</button>
            </div>    
            <div className="shared-wallets">
              {sharedWallets.map(wallet => (
                console.log(wallet.walletId),
                <WalletCard key={wallet.walletId} walid={wallet.walletId} wallet={wallet} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainSection;
