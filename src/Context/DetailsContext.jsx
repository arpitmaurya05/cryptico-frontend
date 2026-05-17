import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/Contract";

export const DetailsContext = createContext();

const API_URL = "http://localhost:8000";

const DetailsProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [Data, setData] = useState({
    receiverAddress: "",
    amount: "",
    message: "",
  });

  // ── Get smart contract instance ──
  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Fetch transactions from smart contract ──
  const getTransactionHistory = async () => {
    try {
      if (!window.ethereum) return;
      const contract = await getContract();
      const txs = await contract.getTransactions();
      setTransactions(txs);
    } catch (err) {
      console.log("TRANSACTION FETCH ERROR:", err.message);
    }
  };

  // ── Fetch transactions from backend (Alchemy) ──
  const getTransactionHistoryFromBackend = async () => {
    try {
const token = localStorage.getItem("token");
      if (!token) return; // ✅ skip if not logged in

      const res = await fetch(`${API_URL}/api/wallet/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
         Authorization: `Bearer ${token}`, // ✅ always send token
        },
      });

      if (!res.ok) {
  const text = await res.text();
  setError(text);
  return;
}
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.log("BACKEND TRANSACTIONS ERROR:", err.message);
    }
  };

  // ── Save wallet to backend ──
  const saveWalletToAccount = async (walletAddress) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`${API_URL}/api/auth/save-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress }),
      });
    } catch (err) {
      console.log("Failed to save wallet:", err.message);
    }
  };

  // ── Load wallet from backend ──
  const loadWalletFromAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/auth/get-wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return; // ✅ don't try to parse error as JSON

      const data = await res.json();

      if (data.walletAddress && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const match = accounts.find(
          (a) => a.toLowerCase() === data.walletAddress.toLowerCase()
        );
        if (match) {
          setAccount(match);
          await getTransactionHistory();
        }
      }
    } catch (err) {
      console.log("Failed to load wallet:", err.message);
    }
  };

  // ── Send ETH via smart contract ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { receiverAddress, amount, message } = Data;

    if (!receiverAddress || !amount || !message) {
      alert("Please fill all the fields");
      return;
    }
    if (!account) {
      alert("Please connect your wallet");
      return;
    }
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    try {
      const contract = await getContract();
      const parsedAmount = ethers.parseEther(amount);

      // Step 1 — Send the ETH
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: account,
          to: receiverAddress,
          value: ethers.toBeHex(parsedAmount),
        }],
      });

      // Step 2 — Record on smart contract
      const tx = await contract.sendEth(receiverAddress, parsedAmount, message);
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      await getTransactionHistory();
    } catch (err) {
      setIsLoading(false);
      console.log("SEND ERROR:", err.message);
    }
  };

  // ── Connect MetaMask ──
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      await saveWalletToAccount(accounts[0]);
      await getTransactionHistory();
    } catch (err) {
      console.log("CONNECT ERROR:", err.message);
    }
  };

  // ── Disconnect wallet ──
  const disconnectWallet = async () => {
    setAccount("");
    setTransactions([]);
    setData({ receiverAddress: "", amount: "", message: "" });
    await saveWalletToAccount("");
  };

  // ── Clear wallet (on logout) ──
  const clearWallet = () => {
    setAccount("");
    setTransactions([]);
    setData({ receiverAddress: "", amount: "", message: "" });
  };

  // ── On mount ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && window.ethereum) {
      loadWalletFromAccount();
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          getTransactionHistory();
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

  return (
    <DetailsContext.Provider value={{
      connectWallet,
      disconnectWallet,
      clearWallet,
      account,
      handleChange,
      handleSubmit,
      isLoading,
      transactions,
      getTransactionHistory,
      getTransactionHistoryFromBackend,
    }}>
      {children}
    </DetailsContext.Provider>
  );
};

export default DetailsProvider;