// app/page.js
'use client'

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [sentimentData, setSentimentData] = useState([]);
  const [chunkData, setChunkData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const text = await file.text();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSentimentData(data.sentimentData);
      setChunkData(data.chunkData);
    }
  };

  return (
    <main className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-100 to-indigo-200 text-gray-900'}`}>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center">Flow Me Raho Bro</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        <div className="mb-8 text-center">
          <label className={`py-2 px-4 rounded-lg cursor-pointer transition duration-300 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}>
            Upload .txt File
            <input type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        
        {sentimentData.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Raw Method</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#ccc"} />
                <XAxis dataKey="index" stroke={darkMode ? "#9CA3AF" : "#666"} />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#666"} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Line type="monotone" dataKey="sentiment" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chunkData.length > 0 && (
          <div>
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Percentage Based</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chunkData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#ccc"} />
                <XAxis dataKey="chunk" stroke={darkMode ? "#9CA3AF" : "#666"} />
                <YAxis stroke={darkMode ? "#9CA3AF" : "#666"} />
                <Tooltip content={<ChunkTooltip darkMode={darkMode} />} />
                <Line type="monotone" dataKey="sentiment" stroke="#82ca9d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </main>
  );
}

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-4 rounded shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-200'}`}>
        <p className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{`Sentence ${label + 1}`}</p>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{`Sentiment: ${payload[0].value.toFixed(2)}`}</p>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{payload[0].payload.text}</p>
      </div>
    );
  }
  return null;
};

const ChunkTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-4 rounded shadow-md max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-200'}`}>
        <p className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{`Chunk ${label}`}</p>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{`Average Sentiment: ${payload[0].value.toFixed(2)}`}</p>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{payload[0].payload.text}</p>
      </div>
    );
  }
  return null;
};