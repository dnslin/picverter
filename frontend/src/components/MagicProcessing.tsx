import { motion } from "framer-motion";
import { Wand2, Sparkles, Image as ImageIcon } from "lucide-react";

interface MagicProcessingProps {
  isVisible: boolean;
}

export default function MagicProcessing({ isVisible }: MagicProcessingProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Main processing circle */}
        <motion.div
          animate={{ rotate: 360 }}
          className="w-32 h-32 rounded-full border-4 border-violet-500/30 border-t-violet-500 flex items-center justify-center"
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center"
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ImageIcon className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Magic sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 80,
              y: Math.sin((i * 30 * Math.PI) / 180) * 80,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
          </motion.div>
        ))}

        {/* Magic wand */}
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-100, 100, -100],
            rotate: [-45, 135, -45],
          }}
          className="absolute top-0 left-0 text-yellow-400"
          initial={{ x: -100, y: -100, rotate: -45 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Wand2 className="w-8 h-8" />
          {/* Magic trail */}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Processing text */}
        <motion.div
          animate={{ y: 60, opacity: 1 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-8 text-center"
          initial={{ y: 60, opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h3
            animate={{ opacity: [0.5, 1, 0.5] }}
            className="text-xl font-semibold text-white mb-2"
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            魔法处理中...
          </motion.h3>
          <div className="flex items-center justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                className="w-2 h-2 bg-violet-400 rounded-full"
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
