import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
    connectors: [
        injected() // e.g. MetaMask
    ],
    transports: {
        // Replace with your Besu RPC endpoint
        424242: http('https://rpc.dimikog.org/rpc/'), // change 1337 to your chainId if different
    },
});