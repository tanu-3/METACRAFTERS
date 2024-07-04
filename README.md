
# Contract with frontend
In this,we have created 3 functions i.e, getBalance(),deposit(),withdraw() for getting balance,how to deposit and how to withdrawn these are shown by frontend.

## Description

Basically the things done is that I have made a js file and in that I have given many things to make it more attractive and very important and uses for getting balance , depositing the money and withdrawing it.Given it colurs and make it more convient for users to see and use.Made changes in index.js file so that it can look more attractive.

## Getting Started

### Installing
1.Open Vs code.

2.copy the whole folder and upload it on Vs code.

3.Then run the pages in which index.js file is there.

4.then follow all the steps in executing program.

### Executing program

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/
```javascript
The given code is of what given in video
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
```
The changes I made is in index.js
```javascript
The changes I made is in index.js
import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;
  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }
  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }
  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  }
  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }
  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(2);
      await tx.wait()
      getBalance();
    }
  }
  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(2);
      await tx.wait()
      getBalance();
    }
  }
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: 'blue', 
        color: 'white', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
        transition: 'background-color 0.3s', 
      }}>Please install Metamask in order to use this ATM.</p>
    }
    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: 'blue', 
        color: 'white', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
        transition: 'background-color 0.3s', 
      }}>Please connect your Metamask wallet</button>
    }
    if (balance == undefined) {
      getBalance();
    }
    return (
      <div>
       <p style={{ fontWeight: 'bold', color: 'blue' }}>Your Account: {account}</p>
       <p style={{ fontStyle: 'italic', color: 'black' }}>Your Balance: {balance}</p>

        <button style= {{background:'green', color:'white',
           padding: '10px 20px',
           margin: '10px',
           borderRadius: '5px',
           cursor: 'pointer',
           transition: 'opacity 0.3s ease',
        }} onClick={deposit}>Deposit 2 ETH</button>

        <button style={{background:'red',color:'white',
           padding: '10px 20px',
           margin: '10px',
           backgroundColor: 'red',
           color: 'white',
           border: 'none',
           borderRadius: '5px',
           cursor: 'pointer',
           transition: 'opacity 0.3s ease',
        }} onClick={withdraw}>Withdraw 2 ETH</button>
      </div>
    )
  }
  useEffect(() => {getWallet();}, []);
  return (
    <main className="container">
      <header>
        <h1> Welcome to the Metacrafters ATM!</h1>
        </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          align-items:center ;
          background-color:pink;
          font-family:arial;
          height:100vh;
          padding:20px;
        }
          .header{
          marginbottom:20px;}

          .img{
          maxwidth: 50px;
          marginbottom:5px;}

          header h1{
          color:Violet;}

          .connectAccount{
           padding: 10px 20px,
           margin: 10px,
           backgroundColor: red,
           color: white,
           border: none,
           borderRadius: 5px,
           cursor: pointer,
          }
      `}
      </style>
    </main>
  )
}

```


## Authors

TANU PAL

@tanu

## License

This project is licensed under the [META] License - see the LICENSE.md file for details


