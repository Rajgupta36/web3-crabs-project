import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const Signup = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [signature, setSignature] = useState<string | null>(null);

    useEffect(() => {
        // Load from localStorage if available
        const storedAddress = localStorage.getItem('walletAddress');
        const storedSignature = localStorage.getItem('walletSignature');
        if (storedAddress) setWalletAddress(storedAddress);
        if (storedSignature) setSignature(storedSignature);
    }, []);

    const signUpWithWallet = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const web3 = new Web3(connection);

            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            setWalletAddress(userAddress);
            localStorage.setItem('walletAddress', userAddress);

            const message = `Sign this message to complete signup: ${Date.now()}`;
            const userSignature = await web3.eth.personal.sign(message, userAddress, '');
            setSignature(userSignature);
            localStorage.setItem('walletSignature', userSignature);

            // 🔐 Optional: Send to backend
            // await fetch('/api/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ wallet: userAddress, signature: userSignature })
            // });

            console.log('Signed up with wallet:', userAddress);
        } catch (err) {
            console.error('Signup failed:', err);
        }
    };

    const disconnectWallet = () => {
        setWalletAddress(null);
        setSignature(null);
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletSignature');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Connect Your Wallet</h2>
                {walletAddress ? (
                    <div className="text-center space-y-4 animate-fadeIn">
                        <p className="text-lg text-gray-200">
                            ✅ Wallet Connected: <span className="font-mono text-green-400">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                        </p>
                        {signature && (
                            <p className="text-sm text-green-400 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Message Signed
                            </p>
                        )}
                        <button
                            onClick={disconnectWallet}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200"
                        >
                            Disconnect Wallet
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={signUpWithWallet}
                            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Sign Up with Wallet
                        </button>
                        <p className="mt-4 text-sm text-gray-400">Connect securely using MetaMask or another Web3 wallet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
