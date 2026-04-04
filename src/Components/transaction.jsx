import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { DetailsContext } from '../Context/DetailsContext'

function Transaction() {
  const { transactions } = useContext(DetailsContext);

  return (
    <div className="transaction-header">
      <h1>
       
        <span>All transactions</span>
      </h1>

      <div className="transaction-table">
        {/* ✅ Scroll wrapper for mobile */}
        <div className="table-scroll-wrapper">
          <table className="table-fill">
            <thead>
              <tr>
                <th className="text-left">Sender</th>
                <th className="text-left">Receiver</th>
                <th className="text-left">Message</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="text-left">
                      {tx.sender
                        ? `${tx.sender.slice(0, 6)}...${tx.sender.slice(-4)}`
                        : "N/A"}
                    </td>
                    <td className="text-left">
                      {tx.receiver
                        ? `${tx.receiver.slice(0, 6)}...${tx.receiver.slice(-4)}`
                        : "N/A"}
                    </td>
                    <td className="text-left">{tx.message || "—"}</td>
                    <td className="text-left">
                      {tx.amount
                        ? ethers.formatEther(tx.amount.toString())
                        : "0"}{" "}ETH
                    </td>
                    <td className="text-left">
                      {tx.timestamp
                        ? new Date(Number(tx.timestamp) * 1000).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="tx-empty-cell" colSpan="5">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transaction
