"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MiniKit, VerifyCommandInput, VerificationLevel } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      console.error("World App not installed");
      return;
    }

    const verifyPayload: VerifyCommandInput = {
      action: "verify",
      verification_level: VerificationLevel.Orb,
    };

    try {
      console.log("Starting verification...");
      const response = await MiniKit.commandsAsync.verify(verifyPayload);
      console.log("Verification response:", response);

      if (!response || !response.finalPayload) {
        console.error("Invalid response from World App");
        return;
      }

      const { finalPayload } = response;
      if (finalPayload.status === "error") {
        console.error("Error payload", finalPayload);
        return;
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: "verify",
        }),
      });

      const verifyResponseJson = await verifyResponse.json();
      if (verifyResponseJson.status === 200) {
        console.log("Verification success!");
        router.push("/quiz");
      } else {
        console.error("Backend verification failed:", verifyResponseJson);
      }
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleDemoMode = () => {
    router.push("/quiz");
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">Welcome to AICurate</h1>
        <p className="text-center text-gray-600">
          Join our community of AI app reviewers and earn rewards
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Choose your username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            onClick={handleVerify}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Verify with World ID
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Or</span>
            </div>
          </div>

          <button
            onClick={handleDemoMode}
            className="w-full px-4 py-2 text-gray-700 bg-white border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Demo Mode: Skip Verification
          </button>
        </div>
      </motion.div>
    </div>
  );
} 