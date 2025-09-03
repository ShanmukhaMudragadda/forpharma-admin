import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'success': return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'error': return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'warning': return <AlertTriangle {...iconProps} className="text-yellow-600" />;
      case 'info': return <Info {...iconProps} className="text-blue-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "fixed top-4 right-4 flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 z-50";
    const visibleStyles = isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";

    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    return `${baseStyles} ${visibleStyles} ${typeStyles[type]}`;
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

