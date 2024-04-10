import React, { useContext, useEffect, useState } from "react";
import background from "./BG.png";
import notif from "./notification.svg";
import search from "./search.svg";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import RightNav from "../RightNav/RightNav";
import MainSection from "../MainSection/MainSection";
import { SharedContext } from "../context/SharedContext";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { connectWallet, currentAccount, getName, getUsername } =
    useContext(SharedContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically reconfigure if the wallet is disconnected
    if (!currentAccount) {
      connectWallet();
    }
  }, [currentAccount, connectWallet]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentAccount) {
          const fetchedName = await getName();
          const fetchedUsername = await getUsername();
          setName(fetchedName);
          setUsername(fetchedUsername);
          setLoading(false); // Data fetching complete, set loading to false
        }
      } catch (error) {
        console.error("Error fetching name and username:", error);
        setLoading(false); // Set loading to false to prevent infinite loop
      }
    };
    fetchData();
  }, [currentAccount, getName, getUsername]);

  if (!loading && (!name || !username)) {
    navigate("/setname");
  }

  return (
    <div
      className="full-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="grid">
        <Navbar name={name} />
        <div className="welcome-section">
          <div className="welcome">Welcome Back, {username}</div>
          <div className="search-notif">
            <div className="search">
              <div className="search-section">
                <img src={search} alt="search logo" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search"
                ></input>
              </div>
            </div>
            <div className="notif">
              <img src={notif} className="notif-logo" alt="notification-logo" />
            </div>
          </div>
          <div className="userinfo">
            {/* <button className='reconfigure' onClick={connectWallet}>Reconfigure</button> */}
          </div>
        </div>
      </div>
      <div className="grid2">
        <MainSection className="midSection" />
        <RightNav />
      </div>
    </div>
  );
};

export default Dashboard;
