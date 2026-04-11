import React, { useContext } from "react";
import Loader from "./Loader";
import { DetailsContext } from "../Context/DetailsContext";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'

const Home = () => {
  // ✅ All hooks must be INSIDE the component
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const {
    handleChange,
    handleSubmit,
    isLoading,
  } = useContext(DetailsContext);

  return (
    <div className="main_container">
      <div className="section_container">

        {/* LEFT SECTION */}
        <div className="leftSection">
          <h1>Execute swift and secure digital asset transactions through CryptoX</h1>
          <p>Fast and effortless sending and receiving, with added security</p>

          {isConnected ? (
            <button className="btn dbtn" onClick={() => disconnect()}>
              Disconnect Wallet
            </button>
          ) : (
            <button className="btn connect-btn" onClick={() => open()}>
              Connect Wallet
            </button>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="rightSection">
          <div className="inputBox">

            {address && <a>{address.slice(0,6)}...{address.slice(-4)}</a>}

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