import React, { useState, useEffect } from "react";

function App() {
  const [health, setHealth] = useState<string>("Checking...");

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => setHealth(data.message))
      .catch(() => setHealth("Error connecting to server"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Crypto Trading App
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Server Status: {health}
        </p>
        <div className="text-green-600">
          ✅ Application is running successfully!
        </div>
      </div>
    </div>
  );
}

export default App;