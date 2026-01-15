import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onLaunch }) {
  const [dots, setDots] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const [showText, setShowText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animate dots appearing
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length < 20) {
          return [...prev, prev.length];
        }
        clearInterval(dotInterval);
        return prev;
      });
    }, 100);

    // Show box after dots
    setTimeout(() => setShowBox(true), 2200);
    
    // Show text after box
    setTimeout(() => setShowText(true), 2800);
    
    // Start progress bar
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setShowButton(true), 400);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
    }, 3500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1758270703402-f09584bc2912?q=80&w=1631&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Animated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 animate-pulse"></div>

      {/* Particle Effect */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Dots Container with Glow */}
        <div className="relative w-80 h-40 mb-12">
          {dots.map((dot, index) => (
            <div
              key={index}
              className="absolute rounded-full"
              style={{
                left: `${(index % 5) * 20}%`,
                top: `${Math.floor(index / 5) * 25}%`,
                animation: `dotAppear 0.6s ease-out ${index * 0.08}s forwards`,
                opacity: 0
              }}
            >
              <div className="w-5 h-5 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Box with Text and Glow Effect */}
        <div
          className={`relative transition-all duration-1000 ease-out ${
            showBox ? 'w-96 h-40 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-50'
          } bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-12 overflow-hidden shadow-2xl`}
          style={{
            boxShadow: showBox ? '0 0 60px rgba(34, 197, 94, 0.6)' : 'none'
          }}
        >
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-green-400/50 animate-pulse"></div>
          
          {showText && (
            <div className="relative">
              <h1 
                className="text-6xl font-bold text-white tracking-wider"
                style={{
                  animation: 'slideIn 0.8s ease-out forwards, glow 2s ease-in-out infinite',
                  textShadow: '0 0 20px rgba(255,255,255,0.5)'
                }}
              >
                DevLearn
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Progress Bar with Enhanced Styling */}
        <div className="w-96 mb-10">
          <div className="relative w-full bg-gray-800/60 backdrop-blur-md rounded-full h-6 overflow-hidden border border-green-500/30 shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 transition-all duration-300 flex items-center justify-center relative"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <span className="relative z-10 text-sm font-bold text-white drop-shadow-lg">{progress}%</span>
            </div>
          </div>
          <p className="text-center text-green-400 text-sm mt-3 font-medium animate-pulse">{progress === 100 ? 'System Initialized' : 'Initializing System...'}</p>
        </div>

        {/* Launch Button with Enhanced Animation */}
        {showButton && (
          <button
            onClick={onLaunch}
            className="relative px-12 py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-2xl font-bold rounded-xl transition-all duration-300 transform hover:scale-110 shadow-2xl overflow-hidden group"
            style={{
              animation: 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
              boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)'
            }}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center gap-3">
              Launch DevLearn
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes dotAppear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(360deg);
          }
        }
        
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 30px rgba(34, 197, 94, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(34, 197, 94, 0.8);
          }
        }
        
        @keyframes popIn {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.15) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
