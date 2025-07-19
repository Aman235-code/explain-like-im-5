/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  Volume2,
  Clipboard,
  RefreshCcw,
  Baby,
  BookOpen,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";

const difficultyMap = {
  kid: { icon: <Baby size={16} />, label: "Kid-friendly" },
  beginner: { icon: <BookOpen size={16} />, label: "Beginner" },
  expert: { icon: <Brain size={16} />, label: "Expert" },
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
      toast("Speaking...");
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-6 flex flex-col items-center font-inter">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl"
      >
        <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">
          Explain Like I'm 5{" "}
          <Brain size={32} className="inline ml-2 text-purple-700" />
        </h1>

        <input
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        />

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {Object.entries(difficultyMap).map(([key, { icon, label }]) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              key={key}
              onClick={() => setDifficulty(key)}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                difficulty === key
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-800"
              }`}
            >
              {icon} {label}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={handleExplain}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md cursor-pointer"
          >
            {loading ? "Loading..." : "Explain it!"}
          </motion.button>
        </div>

        {output.trim() !== "" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 rounded-2xl shadow-inner p-6 mt-4 border"
            >
              <h2 className="text-xl font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <BookOpen size={20} /> Explanation:
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap">{output}</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyText}
                className="bg-green-200 hover:bg-green-300 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
              >
                <Clipboard size={16} /> Copy
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={speak}
                className="bg-blue-200 hover:bg-blue-300 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
              >
                <Volume2 size={16} /> {isSpeaking ? "Stop" : "Speak"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExplain}
                className="bg-yellow-200 hover:bg-yellow-300 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
              >
                <RefreshCcw size={16} /> Regenerate
              </motion.button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-10">
          Created by:{" "}
          <span className="font-semibold text-purple-700">Aman</span>
        </p>
      </motion.div>
    </div>
  );
}
