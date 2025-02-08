'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Star, Gift, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    title: "Welcome to\nAICurate",
    description: "Your trusted companion in discovering and reviewing AI tools",
    Icon: Bot,
    color: "bg-[#4285F4]",
    points: [
      "Find the best AI tools for your needs",
      "Join a community of AI enthusiasts"
    ]
  },
  {
    id: 2,
    title: "Review & Earn",
    description: "Share your experiences and earn rewards for quality reviews",
    Icon: Star,
    color: "bg-[#9747FF]",
    points: [
      "Write detailed AI app reviews",
      "Get rewarded for your contributions"
    ]
  },
  {
    id: 3,
    title: "Unlock Rewards",
    description: "Collect unique NFTs and rewards for your contributions",
    Icon: Gift,
    color: "bg-[#22C55E]",
    points: [
      "Earn exclusive NFT badges",
      "Level up your reviewer profile"
    ]
  }
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      router.push('/quiz');
    } else {
      setCurrentSlide(prev => prev + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const CurrentIcon = slides[currentSlide].Icon;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col px-6"
          >
            {/* Icon Container */}
            <div className={cn(
              "w-full aspect-square rounded-[32px] flex items-center justify-center mb-6 mt-6",
              slides[currentSlide].color
            )}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CurrentIcon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col flex-1">
              <h1 className="text-[32px] font-bold text-black leading-[1.2] whitespace-pre-line mb-3">
                {slides[currentSlide].title}
              </h1>

              <p className="text-[16px] text-[#1A1A1A]/70 mb-8">
                {slides[currentSlide].description}
              </p>

              <div className="space-y-4">
                {slides[currentSlide].points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3"
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      slides[currentSlide].color
                    )} />
                    <span className="text-[15px] text-[#1A1A1A]">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-8">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                currentSlide === index ? slides[index].color : "bg-[#E5E5E5]"
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className={cn(
            "w-full h-[48px] text-white rounded-xl font-medium flex items-center justify-center gap-2",
            slides[currentSlide].color
          )}
        >
          <span className="text-[15px]">{currentSlide === slides.length - 1 ? "Get Started" : "Next"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 