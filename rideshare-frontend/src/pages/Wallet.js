import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Wallet() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async () => {
    const res = await fetch(
      `http://localhost:8080/users/wallet?userId=${user.id}`
    );
    const data = await res.json();
    setBalance(data.balance);
  };

  const fetchTransactions = async () => {
    const res = await fetch(
      `http://localhost:8080/users/transactions?userId=${user.id}`
    );
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const addMoney = async (customAmount) => {
    const finalAmount = customAmount || amount;

    if (!finalAmount || finalAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    await fetch("http://localhost:8080/wallet/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        amount: Number(finalAmount)
      })
    });

    alert("Money added");

    setAmount("");
    fetchWallet();
    fetchTransactions();
  };

  const isCredit = (t) => t.toUser?.id === user.id;

  return (
    <>
      <Navbar />

      <div className="container">
        <h2 style={{ fontSize: "32px", marginBottom: 20 }}>Wallet</h2>

        {/* 💰 BALANCE CARD */}
        <div
        className="card"
        style={{
            textAlign: "center",
            background: "#000",
            color: "#fff",
            maxWidth: "300px",
            margin: "0 auto",
            padding: "20px"
        }}
        >
          <h3>Available Balance</h3>
          <h1 style={{ fontSize: 32, marginTop: 10 }}>₹{balance}</h1>
        </div>

        {/* ➕ ADD MONEY */}
        <div className="card">
          <h3>Add Money</h3>

          <input
            className="input"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* 🔥 QUICK BUTTONS */}
          <div style={{ marginTop: 10 }}>
            <button onClick={() => addMoney(100)}>₹100</button>
            <button onClick={() => addMoney(500)} style={{ marginLeft: 10 }}>
              ₹500
            </button>
            <button onClick={() => addMoney(1000)} style={{ marginLeft: 10 }}>
              ₹1000
            </button>
          </div>

          <button
            className="button"
            style={{ marginTop: 10 }}
            onClick={() => addMoney()}
          >
            Add Money
          </button>
        </div>

        {/* 📜 TRANSACTIONS */}
        <div className="card">
          <h3>Transaction History</h3>

          {transactions.length === 0 && <p>No transactions yet</p>}

          {transactions.map((t) => (
            <div
              key={t.id}
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                background: "#f9f9f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <p style={{ margin: 0 }}>
                {isCredit(t) ? "Received" : "Paid"} ({t.type})
                </p>

                <p style={{ fontSize: 12, color: "#666" }}>
                {new Date(t.createdAt).toLocaleString()}
                </p>

                {t.ride && (
                  <p style={{ fontSize: 12 }}>Ride ID: {t.ride.id}</p>
                )}
              </div>

              <h4
                style={{
                  color: isCredit(t) ? "green" : "red"
                }}
              >
                {isCredit(t) ? "+" : "-"} ₹{t.amount}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Wallet;