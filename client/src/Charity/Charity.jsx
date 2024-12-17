// SettingsSW.js
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Charity.css";
import swexit from "./exit-icon.svg";
import CharityCard from "./CharityCard/CharityCard";
import search from "./search.svg";
import { SharedContext } from "../context/SharedContext";

const pro3 = {
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

const SettingsSW = ({ sopen, onClose }) => {
  const { createOrgCharity, getAllCharities, donateToCharity } = useContext(SharedContext);
  const [isBoxOpen, setboxopen] = useState(false);
  const [charityName, setCharityName] = useState("");
  const [charityDescription, setCharityDescription] = useState("");
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const fetchCharities = async () => {
      const allCharities = await getAllCharities();
      setCharities(allCharities);
    };
    fetchCharities();
  }, []);

  const handleCreateCharity = async () => {
    if (!charityName || !charityDescription) {
      alert("Please provide both name and description.");
      return;
    }

    await createOrgCharity(charityName, charityDescription);
    const updatedCharities = await getAllCharities();
    setCharities(updatedCharities);

    setCharityName("");
    setCharityDescription("");
    setboxopen(false);
  };

  const opencharitybox = () => {
    setboxopen(true);
  };
  const closecharitybox = () => {
    setboxopen(false);
  };
  // var unit = "ETHEREUM";
  if (!sopen) return null;
  return (
    <>
      {isBoxOpen && (
        <div className="charitybox">
          <h2 align="center">Create Organization</h2>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter display name"
            value={charityName}
            onChange={(e) => setCharityName(e.target.value)}
          />
          <br />
          <label>Description</label>
          <textarea
            placeholder="Enter some text"
            value={charityDescription}
            onChange={(e) => setCharityDescription(e.target.value)}
          ></textarea>
          <br />
          <span>
            <button id="create_charity_submit_btn" onClick={handleCreateCharity}>Submit</button> &nbsp;&nbsp;
            <button id="closecharityboxbtn" onClick={closecharitybox}>
              Close
            </button>
          </span>
        </div>
      )}
      <AnimatePresence>
        <motion.div class="pro3" id="pro3" variants={pro3} initial="hidden" animate="visible">
          <div className="swmain1">
            <div>
              <div className="swh5">
                DONATE
                <div className="search-section1">
                  <img src={search} alt="search logo" />
                  <input type="text" className="search-input1" placeholder="Search"></input>
                </div>
                <button id="create_charity" onClick={opencharitybox}>
                  Add your organization
                </button>
                <div className="logo5" onClick={onClose}>
                  <img src={swexit} alt="Exit shared wallet" />
                </div>
              </div>
            </div>

            <div>
              <div className="charity-header">
                <div className="cha-wallid">Wallet ID</div>
                <div className="cha-wallname">Charity Name</div>
                <div className="cha-walldonate">Donate</div>
              </div>
              <div className="charity-info">
              {charities.map((charity, index) => (
            <CharityCard
              key={index}
              name={charity.name}
              description={charity.description}
              walletId={charity.walletId}
              onDonate={donateToCharity}
            />
          ))}
              </div>
            </div>
          </div>
          <div></div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SettingsSW;
