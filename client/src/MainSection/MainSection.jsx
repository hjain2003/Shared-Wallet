import React from "react";
import "./MainSection.css";

import money1 from "./money1.svg";
import money2 from "./money2.svg";
import WalletCard from "./WalletCard/WalletCard";

const MainSection = () => {
  return (
    <div className="main">
      <div className="main-grid">

        <div className="assets">
          <div className="ass1">
            <img src={money1} alt="logo"/>
            <div className="money-text">
              <div className="money-head">Total Assets</div>
              <div className="money-value">$50,000</div>
            </div>
          </div>
          <div className="ass2">
            <img src={money2} alt="logo"/>
            <div className="money-text">
              <div className="money-head">Total Deposits</div>
              <div className="money-value">$50,000</div>
            </div>
          </div>
        </div>

        <div className="shared-wallets-section">
          <div className="shared-head"> Your Shared Wallets</div>
          <div className="shared-wallets">
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
            <WalletCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
