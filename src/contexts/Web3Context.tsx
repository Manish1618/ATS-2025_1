import React, { createContext, useContext, useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToPolygon: () => Promise<void>;
  tokenBalance: string;
  refreshTokenBalance: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Polygon Mainnet configuration
const POLYGON_NETWORK = {
  chainId: '0x89', // 137 in decimal
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

// Mock token contract address (replace with your deployed contract)
const TOKEN_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const ethereum = await detectEthereumProvider();
    if (ethereum && ethereum.selectedAddress) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);
      setAccount(ethereum.selectedAddress);
      setIsConnected(true);
      await refreshTokenBalance();
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const ethereum = await detectEthereumProvider();
      if (!ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setIsConnected(true);

      // Switch to Polygon network
      await switchToPolygon();
      await refreshTokenBalance();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setTokenBalance('0');
  };

  const switchToPolygon = async () => {
    const ethereum = await detectEthereumProvider();
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORK],
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
        }
      }
    }
  };

  const refreshTokenBalance = async () => {
    if (!provider || !account) return;

    try {
      // Mock token balance - replace with actual contract call
      const mockBalance = Math.floor(Math.random() * 1000);
      setTokenBalance(mockBalance.toString());
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const value = {
    account,
    provider,
    signer,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    tokenBalance,
    refreshTokenBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};