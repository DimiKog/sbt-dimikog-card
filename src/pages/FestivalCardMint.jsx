import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CONTRACT_ADDRESS = '0xCb3fe4c1C2c618f6a75D324008eCb63c6Cb49408';
const CONTRACT_ABI = [
    'function mint() external',
    'function hasMinted(address) view returns (bool)'
];
const FAUCET_URL = 'https://faucet.dimikog.org';
const RPC_URL = 'https://rpc.dimikog.org/rpc/';

export default function FestivalCardMint() {
    const [address, setAddress] = useState('');
    const [minted, setMinted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [status, setStatus] = useState('');
    const [quizAnswered, setQuizAnswered] = useState(false);
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');

    const correctAnswers = {
        q1: 'C',
        q2: 'C',
    };

    async function connectWallet() {
        if (!window.ethereum) return alert('Install MetaMask!');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
    }

    async function checkMinted() {
        try {
            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const result = await contract.hasMinted(address);
            setMinted(result);
        } catch (err) {
            console.error('Error checking mint status:', err);
        }
    }

    async function requestFaucet() {
        try {
            setStatus('Requesting faucet...');
            const res = await fetch(`${FAUCET_URL}/${address}`);
            const data = await res.json();
            setStatus(data.message || 'Faucet funded');
        } catch (err) {
            setStatus('Faucet request failed');
            console.error(err);
        }
    }

    async function mintCard() {
        try {
            setLoading(true);
            setStatus('Sending mint transaction...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const tx = await contract.mint();
            await tx.wait();
            setTxHash(tx.hash);
            setStatus('Mint successful!');
            setMinted(true);
        } catch (err) {
            setStatus('Mint failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleQuizSubmit() {
        if (q1 === correctAnswers.q1 && q2 === correctAnswers.q2) {
            setQuizAnswered(true);
            setStatus('✅ Quiz passed! You can now mint your SBT.');
        } else {
            setStatus('❌ One or both answers are incorrect. Please try again.');
        }
    }

    useEffect(() => {
        if (address) checkMinted();
    }, [address]);

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-2xl">
                <CardContent>
                    <h1 className="text-2xl font-semibold mb-4">🧠 Festival Quiz & Mint</h1>

                    {!address ? (
                        <Button onClick={connectWallet}>Connect Wallet</Button>
                    ) : minted ? (
                        <p className="text-green-400">✅ You’ve already minted your Festival SBT!</p>
                    ) : (
                        <>
                            <p className="mb-4">Connected as: <code>{address}</code></p>

                            <div className="mb-6 space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">1️⃣ In the Proof of Escape DApp, where is your final score and progress record stored, making it transparent and immutable?</p>
                                    <div className="space-y-1">
                                        {['A', 'B', 'C', 'D'].map((option) => (
                                            <label key={option} className="block">
                                                <input
                                                    type="radio"
                                                    name="q1"
                                                    value={option}
                                                    checked={q1 === option}
                                                    onChange={(e) => setQ1(e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}. {['On the Quiz Creator\'s Private Server', 'In the Metamask Wallet on your local computer', 'On the PoE Smart Contract/Blockchain', 'In a centralized cloud storage service (e.g., AWS)'][['A', 'B', 'C', 'D'].indexOf(option)]}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2">2️⃣ When you submit an answer to PoE, what cryptographic "fingerprint" is submitted to verify it without revealing the answer?</p>
                                    <div className="space-y-1">
                                        {['A', 'B', 'C', 'D'].map((option) => (
                                            <label key={option} className="block">
                                                <input
                                                    type="radio"
                                                    name="q2"
                                                    value={option}
                                                    checked={q2 === option}
                                                    onChange={(e) => setQ2(e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}. {['An NFT', 'The EDU-D Token', 'A Keccak256 Hash', 'A QR Code'][['A', 'B', 'C', 'D'].indexOf(option)]}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={handleQuizSubmit} className="mt-2">Submit Answers</Button>
                            </div>

                            {quizAnswered && (
                                <>
                                    <Button onClick={requestFaucet} variant="secondary" className="mb-2">Get ETH from Faucet</Button>
                                    <Button onClick={mintCard} disabled={loading}>
                                        {loading ? 'Minting...' : 'Mint Festival SBT'}
                                    </Button>
                                </>
                            )}
                        </>
                    )}

                    {status && <p className="mt-4 text-sm text-yellow-400 whitespace-pre-line">{status}</p>}
                    {txHash && (
                        <p className="mt-2 text-sm">
                            View on Explorer:{' '}
                            <a href={`https://blockscout.dimikog.org/tx/${txHash}`} className="text-blue-400 underline" target="_blank">
                                {txHash.slice(0, 10)}...
                            </a>
                        </p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}