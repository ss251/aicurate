"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MiniKit } from '@worldcoin/minikit-js';
import { useSession, signIn } from 'next-auth/react';

const questions = [
  {
    question: "What interests you the most?",
    options: [
      { label: "AI & Tech", icon: "🤖" },
      { label: "Gaming", icon: "🎮" },
      { label: "Art & Design", icon: "🎨" },
      { label: "Business", icon: "💼" },
      { label: "Education", icon: "📚" }
    ]
  },
  {
    question: "Which part of the world do you live in?",
    options: [
      { label: "North America", icon: "🌎" },
      { label: "Europe", icon: "🌍" },
      { label: "Asia", icon: "🌏" },
      { label: "Africa", icon: "🌍" },
      { label: "South America", icon: "🌎" },
      { label: "Oceania", icon: "🌏" }
    ]
  },
  {
    question: "What do you use AI Apps for?",
    options: [
      { label: "Work", icon: "💼" },
      { label: "Personal Projects", icon: "🎯" },
      { label: "Entertainment", icon: "🎭" },
      { label: "Learning", icon: "📚" },
      { label: "Business", icon: "📊" }
    ]
  },
  {
    question: "What social media platform do you use the most?",
    options: [
      { label: "Twitter/X", icon: "🐦" },
      { label: "Instagram", icon: "📸" },
      { label: "LinkedIn", icon: "💼" },
      { label: "TikTok", icon: "🎵" },
      { label: "YouTube", icon: "🎥" }
    ]
  },
  {
    question: "What's your relationship with AI?",
    options: [
      { label: "I am Gen Z and I breathe AI", icon: "⚡" },
      { label: "I am a millennial and I embrace AI", icon: "🚀" },
      { label: "I am a boomer but I am open to AI", icon: "🌟" },
      { label: "I am skeptical but willing to learn", icon: "🤔" },
      { label: "I am not comfortable with AI", icon: "😅" }
    ]
  }
];

// Minimal ABI for ERC721 mint function
const NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address on World Chain Sepolia
const NFT_CONTRACT_ADDRESS = '0x761eDad8F522a153096110e0B88513BAbb19fCf4';

export function QuizSection() {
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const router = useRouter();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowReveal(true);
      }, 2000);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const connectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      if (!MiniKit.isInstalled()) {
        throw new Error('Please install World App to continue');
      }

      // First sign in with World ID
      await signIn('worldcoin', { callbackUrl: window.location.href });

      // Then connect wallet
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        statement: 'Connect your wallet to mint your NFT',
        expirationTime: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
      });

      if (finalPayload.status === 'error') {
        throw new Error('Failed to connect wallet');
      }

      return finalPayload.address;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleMintNFT = async () => {
    setIsMinting(true);
    setMintError(null);

    try {
      // Check if World App is installed
      if (!MiniKit.isInstalled()) {
        throw new Error('Please install World App to continue');
      }

      // Connect wallet if not connected
      if (!MiniKit.walletAddress) {
        await connectWallet();
      }

      // Send transaction to mint NFT
      const response = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'safeMint',
          args: [
            MiniKit.walletAddress as string,
            'ipfs://QmdStFxJS9SNNEvxAk4U8jiwsEbRoStffQJUDyghxvgcvj/0'
          ]
        }]
      });

      if (!response?.finalPayload || response.finalPayload.status === 'error') {
        throw new Error('Failed to mint NFT');
      }

      // Wait for transaction confirmation
      const transactionId = response.finalPayload.transaction_id;
      if (transactionId) {
        // You can add UI to show transaction status
        console.log('Transaction ID:', transactionId);
      }

      // Navigate to dashboard after successful mint
      router.push("/dashboard");
    } catch (error) {
      console.error('Minting error:', error);
      setMintError(error instanceof Error ? error.message : 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {!showReveal ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-white rounded-lg shadow-lg space-y-6"
          >
            <h1 className="text-3xl font-bold text-center text-gray-900">
              Create Your Avatar Profile
            </h1>
            {currentQuestion === 0 && (
            <p className="text-muted-foreground text-sm md:text-base">
              Your avatar grows and evolves with every step you take—it&apos;s a snapshot of who you are today. Dive in, answer a few fun questions, and unlock your first reward on this exciting journey!
            </p>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleAnswer(option.label)}
                    className="w-full p-4 text-left text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white rounded-lg shadow-lg text-center space-y-6"
          >
            <div className="relative w-full aspect-square max-w-[400px] mx-auto">
              <Image
                src="/madamenft2.jpg"
                alt="Your NFT"
                fill
                className="object-cover rounded-lg shadow-xl"
                sizes="(max-width: 300px) 100vw, 300px"
                priority
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                Ready to Mint!
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Congratulations! Your Avatar NFT is Ready
            </h2>
            <p className="text-gray-600">
              Your unique NFT is ready to be minted on World Chain. Click below to mint and add it to your collection.
            </p>
            {mintError && (
              <p className="text-sm text-red-600">{mintError}</p>
            )}
            <button
              onClick={isMinting ? undefined : handleMintNFT}
              disabled={isMinting}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isMinting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Minting...
                </span>
              ) : (
                'Mint NFT'
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={!showReveal}
          numberOfPieces={200}
        />
      )}
    </div>
  );
} 