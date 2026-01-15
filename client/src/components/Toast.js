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
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              backdrop-blur-lg rounded-lg p-4 shadow-2xl border min-w-[300px] max-w-md
              transform transition-all duration-300 animate-slideIn
              ${toast.type === 'success' ? 'bg-green-500/20 border-green-400/50 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-red-500/20 border-red-400/50 text-red-100' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-100' : ''}
              ${toast.type === 'info' ? 'bg-blue-500/20 border-blue-400/50 text-blue-100' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {toast.type === 'success' && '✓'}
                {toast.type === 'error' && '✕'}
                {toast.type === 'warning' && '⚠'}
                {toast.type === 'info' && 'ℹ'}
              </span>
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
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
