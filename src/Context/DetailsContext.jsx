import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/Contract";

export const DetailsContext = createContext();

const DetailsProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [Data, setData] = useState({
    receiverAddress: "",
    amount: "",
    message: "",
  });

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    return transactionContract;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const getTransactionHistory = async () => {
    try {
      if (!window.ethereum) return;
      const transactionContract = await getContract();
      const transactions = await transactionContract.getTransactions();
      setTransactions(transactions);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Save wallet to backend linked to logged in user
  const saveWalletToAccount = async (walletAddress) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("http://localhost:5001/api/auth/save-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress }),
      });
    } catch (err) {
      console.log("Failed to save wallet:", err);
    }
  };

  // ✅ Load wallet from backend for logged in user
  const loadWalletFromAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/auth/get-wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.walletAddress) {
        // Check if MetaMask has this wallet connected
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const matchingAccount = accounts.find(
          (a) => a.toLowerCase() === data.walletAddress.toLowerCase()
        );

        if (matchingAccount) {
          setAccount(matchingAccount);
          await getTransactionHistory();
        } else {
          // Wallet saved but not connected in MetaMask — clear it
          setAccount("");
        }
      }
    } catch (err) {
      console.log("Failed to load wallet:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Data.receiverAddress || !Data.amount || !Data.message) {
      alert("Please fill all the fields");
      return;
    }
    if (!account) {
      alert("Please connect your wallet");
      return;
    }
    if (!window.ethereum) {
      alert("Install Metamask");
      return;
    }

    try {
      const { receiverAddress, amount, message } = Data;
      const transactionContract = await getContract();
      const parsedAmount = ethers.parseEther(amount);

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: account,
          to: receiverAddress,
          value: ethers.toBeHex(parsedAmount),
        }],
      });

      const transactionHash = await transactionContract.sendEth(
        receiverAddress,
        parsedAmount,
        message
      );

      setIsLoading(true);
      await transactionHash.wait();
      setIsLoading(false);
      await getTransactionHistory();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // ✅ Load wallet linked to logged in user
    const token = localStorage.getItem("token");
    if (token && window.ethereum) {
      loadWalletFromAccount();
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
          setTransactions([]);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Install Metamask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      await saveWalletToAccount(accounts[0]); // ✅ save to backend
      await getTransactionHistory();
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectWallet = async () => {
    setAccount("");
    setTransactions([]);
    setData({ receiverAddress: "", amount: "", message: "" });
    // ✅ Remove wallet from backend too
    await saveWalletToAccount("");
  };

  const clearWallet = () => {
    setAccount("");
    setTransactions([]);
    setData({ receiverAddress: "", amount: "", message: "" });
  };

  return (
    <DetailsContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        clearWallet,
        account,
        handleChange,
        handleSubmit,
        isLoading,
        transactions,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};

export default DetailsProvider;