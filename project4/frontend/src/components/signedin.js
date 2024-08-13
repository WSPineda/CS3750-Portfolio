import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignedIn() {
    const location = useLocation();
    const navigate = useNavigate();
    const { firstname, checking: initialChecking, saving: initialSaving, email } = location.state;

    const [checking, setChecking] = useState(initialChecking);
    const [saving, setSaving] = useState(initialSaving);
    const [amount, setAmount] = useState("");
    const [fromAccount, setFromAccount] = useState("checking");
    const [toAccount, setToAccount] = useState("saving");
    const [transactionType, setTransactionType] = useState("deposit");

    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleFromAccountChange = (e) => setFromAccount(e.target.value);
    const handleToAccountChange = (e) => setToAccount(e.target.value);
    const handleTransactionTypeChange = (e) => setTransactionType(e.target.value);

    const handleTransaction = async (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const endpoint = transactionType === "deposit" ? "/record/deposit" : "/record/withdraw";
        try {
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // Include credentials for session
                body: JSON.stringify({ email, accountType: fromAccount, amount: parsedAmount }),
            });

            const data = await response.json();
            
            if (response.ok) {
                if (fromAccount === "checking") {
                    setChecking((prev) => (transactionType === "deposit" ? prev + parsedAmount : prev - parsedAmount));
                } else if (fromAccount === "saving") {
                    setSaving((prev) => (transactionType === "deposit" ? prev + parsedAmount : prev - parsedAmount));
                }
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Error during transaction:", error);
            alert("An error occurred. Please try again.");
        }

        setAmount("");
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (fromAccount === toAccount) {
            alert("Source and destination accounts cannot be the same.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/record/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // Include credentials for session
                body: JSON.stringify({ email, fromAccount, toAccount, amount: parsedAmount }),
            });

            const data = await response.json();
            
            if (response.ok) {
                if (fromAccount === "checking" && toAccount === "saving") {
                    setChecking((prev) => prev - parsedAmount);
                    setSaving((prev) => prev + parsedAmount);
                } else if (fromAccount === "saving" && toAccount === "checking") {
                    setSaving((prev) => prev - parsedAmount);
                    setChecking((prev) => prev + parsedAmount);
                }
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Error during transfer:", error);
            alert("An error occurred. Please try again.");
        }

        setAmount("");
    };

    const handleLogoff = async () => {
        try {
            const response = await fetch("http://localhost:4000/session_delete", {
                method: "GET",
                credentials: 'include', // Include credentials for session
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(data.msg);
                navigate("/"); // Redirect to the main menu
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Error during logoff:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h1>Welcome, {firstname}!</h1>
            <div>
                <h2>Account Information</h2>
                <p>Checking Account: ${checking.toFixed(2)}</p>
                <p>Saving Account: ${saving.toFixed(2)}</p>
            </div>
            <div>
                <h2>Transaction</h2>
                <form onSubmit={handleTransaction}>
                    <div>
                        <label>
                            Amount:
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Account Type:
                            <select value={fromAccount} onChange={handleFromAccountChange}>
                                <option value="checking">Checking</option>
                                <option value="saving">Saving</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Transaction Type:
                            <select value={transactionType} onChange={handleTransactionTypeChange}>
                                <option value="deposit">Deposit</option>
                                <option value="withdraw">Withdraw</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <div>
                <h2>Transfer</h2>
                <form onSubmit={handleTransfer}>
                    <div>
                        <label>
                            Amount:
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            From Account Type:
                            <select value={fromAccount} onChange={handleFromAccountChange}>
                                <option value="checking">Checking</option>
                                <option value="saving">Saving</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            To Account Type:
                            <select value={toAccount} onChange={handleToAccountChange}>
                                <option value="checking">Checking</option>
                                <option value="saving">Saving</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <button type="submit">Transfer</button>
                    </div>
                </form>
            </div>
            <div>
                <button onClick={handleLogoff}>Log Off</button>
            </div>
        </div>
    );
}
