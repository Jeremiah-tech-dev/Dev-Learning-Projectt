import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const success = (message) => showToast(message, 'success');
  const error = (message) => showToast(message, 'error');
  const info = (message) => showToast(message, 'info');
  const warning = (message) => showToast(message, 'warning');

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              backdrop-blur-lg rounded-lg p-6 shadow-2xl border min-w-[350px] max-w-md
              transform transition-all duration-300 animate-slideIn
              ${toast.type === 'success' ? 'bg-green-600/90 border-green-400 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-600/90 border-red-400 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-600/90 border-yellow-400 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-600/90 border-blue-400 text-white' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {toast.type === 'success' && '✓'}
                {toast.type === 'error' && '✕'}
                {toast.type === 'warning' && '⚠'}
                {toast.type === 'info' && 'ℹ'}
              </span>
              <p className="font-semibold text-lg">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
