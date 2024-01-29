import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import etherMate from "./Logo.svg";
import dashboardLogo from "./dasboard.svg";
import chatbotLogo from "./Chatbot.svg";
import depositsLogo from "./deposits.svg";
import profileLogo from "./user.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="emlogo">
        <img src={etherMate} alt="Logo" />
      </div>

      <Link to="/" className="linkremove">
        <div className="nav-element">
          <img src={dashboardLogo} className="nav-logo" alt="Dashboard" />
          <div className="nav-topic">Dashboard</div>
        </div>
      </Link>

      <Link to="/" className="linkremove">
        <div className="nav-element">
          <img src={chatbotLogo} className="nav-logo" alt="Chatbot" />
          <div className="nav-topic">Chatbot</div>
        </div>
      </Link>

      <Link to="/" className="linkremove">
        <div className="nav-element">
          <img src={depositsLogo} className="nav-logo" alt="Deposits" />
          <div className="nav-topic">Deposits</div>
        </div>
      </Link>

      <Link to="/" className="linkremove">
        <div className="nav-element">
          <img src={profileLogo} className="nav-logo" alt="Profile" />
          <div className="nav-topic">Profile</div>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
