import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

import etherMate from "./Logo.svg";
import dashboardLogo from "./dasboard.svg";
import chatbotLogo from "./Chatbot.svg";
import depositsLogo from "./deposits.svg";
import profileLogo from "./user.svg";
import Charity from "../Charity/Charity";

const Navbar = () => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);

  const handleItemClick = (path) => {
    setSelectedItem(path);
  };

  const handleCharityClick = () => {
    setSelectedItem("charity");
  };

  return (
    <div className="navbar">
      <div className="emlogo">
        <img src={etherMate} alt="Logo" />
      </div>

      <Link
        to="/dashboard"
        className="linkremove"
        onClick={() => handleItemClick("/dashboard")}
      >
        <div
          className={`nav-element ${
            selectedItem === "/dashboard" ? "active" : ""
          }`}
        >
          <img src={dashboardLogo} className="nav-logo" alt="Dashboard" />
          <div className="nav-topic">Dashboard</div>
        </div>
      </Link>

      <Link
        to="/chatbot"
        className="linkremove"
        onClick={() => handleItemClick("/chatbot")}
      >
        <div
          className={`nav-element ${
            selectedItem === "/chatbot" ? "active" : ""
          }`}
        >
          <img src={chatbotLogo} className="nav-logo" alt="Chatbot" />
          <div className="nav-topic">Chatbot</div>
        </div>
      </Link>

      <div
        className={`nav-element ${
          selectedItem === "charity" ? "active" : ""
        }`}
        onClick={handleCharityClick}
      >
        <img src={depositsLogo} className="nav-logo" alt="Deposits" />
        <div className="nav-topic">Charity</div>
      </div>

      <Link
        to="/split"
        className="linkremove"
        onClick={() => handleItemClick("/split")}
      >
        <div
          className={`nav-element ${
            selectedItem === "/split" ? "active" : ""
          }`}
        >
          <img src={profileLogo} className="nav-logo" alt="Profile" />
          <div className="nav-topic">Split</div>
        </div>
      </Link>

      {selectedItem === "charity" && <Charity sopen={true} onClose={() => setSelectedItem("")} />}
    </div>
  );
};

export default Navbar;
