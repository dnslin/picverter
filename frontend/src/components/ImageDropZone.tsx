import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/react";
import { useTheme } from "next-themes";
import { ImagePlus, Upload, Sparkles } from "lucide-react";

interface ImageDropZoneProps {
  onImageSelect: (file: File) => void;

  className?: string;
}

export default function ImageDropZone({
  onImageSelect,

  className = "",
}: ImageDropZoneProps) {
  const { theme } = useTheme();

  const [isDragOver, setIsDragOver] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);

      const imageFile = files.find(file => file.type.startsWith("image/"));

      if (imageFile) {
        onImageSelect(imageFile);
      }
    },

    [onImageSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },

    [onImageSelect]
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={`relative h-full min-h-[320px] cursor-pointer transition-all duration-500 border-2 border-dashed overflow-hidden backdrop-blur-xl ${
          isDragOver
            ? theme === "light"
              ? "border-orange-400 bg-orange-500/10 shadow-2xl shadow-orange-500/20"
              : "border-violet-400 bg-violet-500/10 shadow-2xl shadow-violet-500/20"
            : theme === "light"
              ? "border-orange-300/60 bg-white/40 hover:border-orange-400 hover:bg-orange-50/60"
              : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60"
        }`}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          type="file"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center justify-center h-full p-8 text-center relative">
          <AnimatePresence mode="wait">
            {isDragOver ? (
              <motion.div
                key="drag-over"
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
                exit={{ scale: 0.8, opacity: 0 }}
                initial={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-colors duration-500 ${
                    theme === "light"
                      ? "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 shadow-orange-500/30"
                      : "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-violet-500/30"
                  }`}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </motion.div>

                <h3
                  className={`text-xl font-semibold mb-3 transition-colors duration-500 ${
                    theme === "light" ? "text-orange-600" : "text-violet-400"
                  }`}
                >
                  释放以上传图片
                </h3>

                <p
                  className={`text-sm transition-colors duration-500 ${
                    theme === "light" ? "text-amber-700" : "text-zinc-300"
                  }`}
                >
                  支持 JPEG, PNG, GIF, BMP 格式
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
                exit={{ scale: 0.8, opacity: 0 }}
                initial={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={
                    isHovered
                      ? {
                          scale: 1.1,

                          y: -10,

                          rotateY: 15,

                          rotateX: 5,
                        }
                      : {
                          scale: 1,

                          y: 0,

                          rotateY: 0,

                          rotateX: 0,
                        }
                  }
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border shadow-xl relative transition-colors duration-500 ${
                    theme === "light"
                      ? "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200"
                      : "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700"
                  }`}
                  style={{ perspective: 1000 }}
                  transition={{
                    duration: 0.5,

                    ease: "easeOut",

                    type: "spring",

                    stiffness: 100,
                  }}
                >
                  <motion.div
                    animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <ImagePlus
                      className={`w-8 h-8 transition-colors duration-500 ${
                        theme === "light" ? "text-orange-600" : "text-zinc-400"
                      }`}
                    />
                  </motion.div>

                  {/* Floating dots when hovered */}

                  {isHovered &&
                    [...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          opacity: [0, 1, 0],

                          scale: [0, 1, 0],

                          x: Math.cos((i * 90 * Math.PI) / 180) * 30,

                          y: Math.sin((i * 90 * Math.PI) / 180) * 30,
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-violet-400 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{
                          duration: 1.5,

                          repeat: Infinity,

                          delay: i * 0.1,
                        }}
                      />
                    ))}
                </motion.div>

                <h3
                  className={`text-xl font-semibold mb-3 transition-colors duration-500 ${
                    theme === "light" ? "text-amber-900" : "text-white"
                  }`}
                >
                  拖拽图片到这里
                </h3>

                <p
                  className={`text-sm mb-6 transition-colors duration-500 ${
                    theme === "light" ? "text-amber-700" : "text-zinc-400"
                  }`}
                >
                  或点击选择要处理的图片文件
                </p>

                <div
                  className={`flex items-center gap-4 text-xs transition-colors duration-500 ${
                    theme === "light" ? "text-amber-600" : "text-zinc-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />

                    <span>支持格式</span>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full border transition-colors duration-500 ${
                        theme === "light"
                          ? "bg-orange-100/80 border-orange-200 text-orange-700"
                          : "bg-zinc-800/50 border-zinc-700 text-zinc-300"
                      }`}
                    >
                      JPEG
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full border transition-colors duration-500 ${
                        theme === "light"
                          ? "bg-orange-100/80 border-orange-200 text-orange-700"
                          : "bg-zinc-800/50 border-zinc-700 text-zinc-300"
                      }`}
                    >
                      PNG
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full border transition-colors duration-500 ${
                        theme === "light"
                          ? "bg-orange-100/80 border-orange-200 text-orange-700"
                          : "bg-zinc-800/50 border-zinc-700 text-zinc-300"
                      }`}
                    >
                      GIF
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full border transition-colors duration-500 ${
                        theme === "light"
                          ? "bg-orange-100/80 border-orange-200 text-orange-700"
                          : "bg-zinc-800/50 border-zinc-700 text-zinc-300"
                      }`}
                    >
                      BMP
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated background particles */}

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: Math.random() * 500,

                  y: Math.random() * 400,

                  opacity: [0, 0.7, 0],

                  scale: [0.5, 1.5, 0.5],
                }}
                className="absolute w-1 h-1 bg-violet-400/20 rounded-full"
                initial={{
                  x: Math.random() * 500,

                  y: Math.random() * 400,

                  opacity: 0,
                }}
                transition={{
                  duration: 4 + Math.random() * 3,

                  repeat: Infinity,

                  ease: "easeInOut",

                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
