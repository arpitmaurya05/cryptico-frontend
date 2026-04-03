import React, { useContext } from "react";
import Loader from "./Loader";
import { DetailsContext } from "../Context/DetailsContext";

const Home = () => {
  const {
    connectWallet,
    account,
    handleChange,
    handleSubmit,
    isLoading,
    disconnectWallet,
  } = useContext(DetailsContext);

  return (
    <div className="main_container">
      <div className="section_container">
        
        {/* LEFT SECTION */}
        <div className="leftSection">
          <h1>Execute swift and secure digital asset transactions through CryptoX</h1>
          <p>Fast and effortless sending and receiving, with added security</p>

          {/* FIXED BUTTON LOGIC */}
          {account ? (
            <button onClick={disconnectWallet} className="dbtn">
              Disconnect Wallet
            </button>
          ) : (
            <button onClick={connectWallet} className="dbtn">
              Connect Wallet
            </button>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="rightSection">
          <div className="inputBox">
            
            {account && <a>{account}</a>}

            <input
              type="text"
              placeholder="Receiver's address"
              name="receiverAddress"
              onChange={handleChange}
            />

            <input
              type="number"
              placeholder="Enter the amount"
              name="amount"
              step="0.0001"
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Enter your message"
              name="message"
              onChange={handleChange}
            />

            <hr />

            {isLoading ? (
              <Loader />
            ) : (
              <button className="btn send-btn" onClick={handleSubmit}>
                Send Eth
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;