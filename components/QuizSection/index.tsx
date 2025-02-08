"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
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

  const handleContinue = () => {
    router.push("/dashboard");
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
              <p className="text-center text-gray-600">
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
                src="/nft-placeholder.png"
                alt="Your NFT"
                fill
                className="object-cover rounded-lg shadow-xl"
                sizes="(max-width: 300px) 100vw, 300px"
                priority
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                Minted!
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Congratulations! Your Avatar NFT is Ready
            </h2>
            <p className="text-gray-600">
              Your unique NFT has been minted and added to your collection.
            </p>
            <button
              onClick={handleContinue}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to Your Dashboard
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