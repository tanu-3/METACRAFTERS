import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [loading, setLoading] = useState(false);
  
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  useEffect(() => {
    const initializeWallet = async () => {
      if (window.ethereum) {
        setEthWallet(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        handleAccount(accounts);
      }
    };
    initializeWallet();
  }, []);

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
      getATMContract();
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }
    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const handleTransaction = async (action) => {
    if (atm) {
      setLoading(true);
      try {
        let tx;
        if (action === "deposit") {
          tx = await atm.deposit(2);
        } else if (action === "withdraw") {
          tx = await atm.withdraw(2);
        }
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Transaction failed", error);
      }
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!ethWallet) {
      return <p className="message">Please install MetaMask in order to use this ATM.</p>;
    }
    if (!account) {
      return (
        <button className="btn connect-btn" onClick={connectAccount}>
          Connect your MetaMask wallet
        </button>
      );
    }
    if (balance === undefined) {
      getBalance();
    }
    return (
      <div>
        <p className="account-info">Your Account: {account}</p>
        <p className="account-info">Your Balance: {balance} ETH</p>
        <button className="btn deposit-btn" onClick={() => handleTransaction("deposit")} disabled={loading}>
          {loading ? "Processing..." : "Deposit 2 ETH"}
        </button>
        <button className="btn withdraw-btn" onClick={() => handleTransaction("withdraw")} disabled={loading}>
          {loading ? "Processing..." : "Withdraw 2 ETH"}
        </button>
      </div>
    );
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {renderContent()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: #f5f5f5;
          font-family: Arial, sans-serif;
          height: 100vh;
          padding: 20px;
        }
        header h1 {
          color: #6a0dad;
          margin-bottom: 20px;
        }
        .message {
          padding: 10px 20px;
          font-size: 16px;
          background-color: blue;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s;
        }
        .btn {
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px;
          transition: background-color 0.3s ease;
        }
        .connect-btn {
          background-color: blue;
        }
        .deposit-btn {
          background-color: green;
        }
        .withdraw-btn {
          background-color: red;
        }
        .account-info {
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </main>
  );
}
