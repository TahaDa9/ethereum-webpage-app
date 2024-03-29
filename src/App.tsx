
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const web3 = new Web3('https://mainnet.infura.io/v3/759e4fcbf9b7449f854586fb65f43184');

function App() {
  const [lastBlockNumber, setLastBlockNumber] = useState<bigint | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const fetchLastBlockNumber = async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      setLastBlockNumber(blockNumber);
    };

    fetchLastBlockNumber();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleGetBalance = async () => {
    if (!address) return;

    const contractABI = [
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    const usdtContract = new web3.eth.Contract(contractABI, contractAddress);
    const balance = await usdtContract.methods.balanceOf(address).call<string>();
    setUsdtBalance(balance)
  };

  return (
    <div>
      <h1>Ethereum Webpage</h1>
      <p>Last Block Number: {lastBlockNumber?.toString()}</p>
      <div>
        <input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={handleAddressChange}
        />
        <button onClick={handleGetBalance}>Get USDT Balance</button>
      </div>
      {usdtBalance && <p>USDT Balance: {usdtBalance?.toString()}</p>}
    </div>
  );
}

export default App;
