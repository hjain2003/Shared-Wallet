import React, { useContext } from "react";
import { useNavigate } from "react-router";
import Typewriter from "typewriter-effect";

import "./Landing.css";
import EthLogo from "./EthLogo.svg";
import { SharedContext } from "../context/SharedContext";

const Landing = () => {
  const navigate = useNavigate();
  const { connectWallet, getName, getUsername } = useContext(SharedContext);

  const handleConnect = async () => {
    await connectWallet();
    const name = await getName();
    const username = await getUsername();
    if (name && username) {
      // Name and username are set, navigate to dashboard
      navigate("/dashboard");
    } else {
      // Name or username is not set, navigate to setname
      navigate("/setname");
    }
  };

  return (
    <div className="landing-back">
      <img src={EthLogo} alt="ethershare logo" className="es-logo" />
      <br />
      <h1 className="animate-charcter">ETHERMATE</h1>

      <div className="desc-es">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Empowering Collaboration, Elevating Finances!")
              .pauseFor(0)
              //  .deleteAll()
              .start();
          }}
        />
      </div>
      <div className="connect-wallet" onClick={handleConnect}>
        <span className="land-button">Connect with MetaMask</span>
      </div>
    </div>
  );
};

export default Landing;
