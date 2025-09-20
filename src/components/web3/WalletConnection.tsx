import React from 'react';
import { Wallet, ExternalLink, Zap } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';
import Button from '../ui/Button';
import Card from '../ui/Card';

const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    tokenBalance,
    refreshTokenBalance 
  } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Card variant="cyber" className="border-purple-500/30">
        <div className="text-center space-y-4">
          <div className="bg-purple-500/20 p-4 rounded-full w-fit mx-auto">
            <Wallet className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-4">
              Connect your MetaMask wallet to receive token rewards on Polygon network
            </p>
          </div>
          <Button
            variant="cyber"
            onClick={connectWallet}
            isLoading={isConnecting}
            className="w-full"
          >
            <Wallet className="h-5 w-5 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="cyber" className="border-green-500/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <Wallet className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 font-semibold">Wallet Connected</p>
              <p className="text-gray-400 text-sm">{formatAddress(account!)}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Token Balance</p>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                <span className="text-2xl font-bold text-cyan-400">{tokenBalance}</span>
                <span className="text-gray-400">TOKENS</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshTokenBalance}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Network: Polygon</span>
          <a
            href={`https://polygonscan.com/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
          >
            <span>View on Explorer</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
};

export default WalletConnection;