/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  RiVolumeUpLine,
  RiFileCopyLine,
  RiRefreshLine,
  RiUser5Line,
  RiUserStarLine,
  RiUserSettingsLine,
} from "react-icons/ri";
import { motion } from "framer-motion";

const difficultyMap = {
  kid: "Kid-friendly",
  beginner: "Beginner",
  expert: "Expert",
};

export default function App() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("kid");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleExplain = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/explain", {
        topic,
        level: difficulty,
      });
      setOutput(res.data.explanation);
    } catch {
      setOutput("⚠️ Something went wrong.");
    }
    setLoading(false);
  };

  const speak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utter = new SpeechSynthesisUtterance(output);
      utter.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
      setIsSpeaking(true);
      toast.success("Speaking...");
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const downloadPDF = () => {
    if (!output) return toast.error("Nothing to download");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("Helvetica");
    doc.setFontSize(14);
    doc.text(`Topic: ${topic}`, 10, 20);
    doc.text(`Difficulty: ${difficultyMap[difficulty]}`, 10, 30);

    const splitText = doc.splitTextToSize(output, 180);
    doc.text(splitText, 10, 50);

    doc.save("explanation.pdf");
    toast.success("Downloaded as PDF");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-purple-200 p-4 sm:p-6 flex flex-col items-center font-inter">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-6 text-center">
          Explain Like I'm 5
        </h1>

        <input
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDifficulty("kid")}
            className={`px-4 py-2 hover:cursor-pointer rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
              difficulty === "kid"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 hover:bg-purple-200 text-purple-800"
            }`}
          >
            <RiUser5Line /> Kid-friendly
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDifficulty("beginner")}
            className={`px-4 hover:cursor-pointer py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
              difficulty === "beginner"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 hover:bg-purple-200 text-purple-800"
            }`}
          >
            <RiUserStarLine /> Beginner
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDifficulty("expert")}
            className={`px-4 py-2 hover:cursor-pointer rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
              difficulty === "expert"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 hover:bg-purple-200 text-purple-800"
            }`}
          >
            <RiUserSettingsLine /> Expert
          </motion.button>
        </div>

        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplain}
            className="bg-indigo-600 hover:cursor-pointer hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md"
          >
            {loading ? "Loading..." : "Explain it!"}
          </motion.button>
        </div>

        {output.trim() !== "" && (
          <>
            <div className="bg-gray-50 rounded-2xl shadow-inner p-6 mt-4 border overflow-x-auto">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">
                Explanation
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap break-words">
                {output}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyText}
                className="bg-green-200 hover:bg-green-300 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <RiFileCopyLine size={16} /> Copy
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={speak}
                className="bg-yellow-200 hover:bg-yellow-300 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <RiVolumeUpLine size={16} /> {isSpeaking ? "Stop" : "Speak"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExplain}
                className="bg-blue-200 hover:bg-blue-300 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <RiRefreshLine size={16} /> Regenerate
              </motion.button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-10">
          Created by:{" "}
          <span className="font-semibold text-purple-700">Aman</span>
        </p>
      </div>
    </div>
  );
}
