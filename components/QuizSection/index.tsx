"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";

const questions = [
  {
    question: "What interests you the most?",
    options: ["AI & Tech", "Gaming", "Art & Design", "Business", "Education"]
  },
  {
    question: "Which part of the world do you live in?",
    options: ["North America", "Europe", "Asia", "Africa", "South America", "Oceania"]
  },
  {
    question: "What do you use AI Apps for?",
    options: ["Work", "Personal Projects", "Entertainment", "Learning", "Business"]
  },
  {
    question: "What social media platform do you use the most?",
    options: ["Twitter/X", "Instagram", "LinkedIn", "TikTok", "YouTube"]
  },
  {
    question: "What's your relationship with AI?",
    options: [
      "I am Gen Z and I breathe AI",
      "I am a millennial and I embrace AI",
      "I am a boomer but I am open to AI",
      "I am skeptical but willing to learn",
      "I am not comfortable with AI"
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
                Your avatar evolves with you. It is like an instant polaroid of who you are right now. So smile and get started now to get your first reward.
              </p>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {option}
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