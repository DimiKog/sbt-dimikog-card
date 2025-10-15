import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { WagmiProvider, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { injected } from 'wagmi/connectors';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const besuChain = {
  id: 424242, // Replace with your actual Besu chain ID
  name: 'BesuEduNet',
  network: 'besu',
  nativeCurrency: {
    name: 'EDU-D',
    symbol: 'EDU-D',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.dimikog.org/rpc/'],
    },
    public: {
      http: ['https://rpc.dimikog.org/rpc/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockexplorer.dimikog.org/',
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [besuChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === besuChain.id) {
          return { http: 'https://rpc.dimikog.org/rpc/' };
        }
        return null;
      },
    }),
    publicProvider(),
  ]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [injected()],
  publicClient,
});

createWeb3Modal({
  wagmiConfig,
  projectId: 'festival-card-demo', // Replace with your real WalletConnect project ID if needed
  chains,
  themeMode: 'dark',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <App />
    </WagmiProvider>
  </React.StrictMode>
);