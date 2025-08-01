import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
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
      icon: CheckCircle,
      border: "border-emerald-400",
      color: "text-emerald-100",
    },
    error: {
      bg: "bg-red-500/90",
      icon: XCircle,
      border: "border-red-400",
      color: "text-red-100",
    },
    info: {
      bg: "bg-violet-500/90",
      icon: Info,
      border: "border-violet-400",
      color: "text-violet-100",
    },
  };

  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${config.bg} ${config.border} ${config.color}`}
          exit={{ opacity: 0, y: -50, scale: 0.9, rotate: 5 }}
          initial={{ opacity: 0, y: -50, scale: 0.9, rotate: -5 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <config.icon className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">{message}</span>
            <motion.button
              className="ml-2 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
