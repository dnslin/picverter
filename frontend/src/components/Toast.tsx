import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: "bg-emerald-500/90",
      icon: "✅",
      border: "border-emerald-400"
    },
    error: {
      bg: "bg-red-500/90",
      icon: "❌", 
      border: "border-red-400"
    },
    info: {
      bg: "bg-blue-500/90",
      icon: "ℹ️",
      border: "border-blue-400"
    }
  };

  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${config.bg} ${config.border} text-white`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{config.icon}</span>
            <span className="font-medium">{message}</span>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-2 text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}