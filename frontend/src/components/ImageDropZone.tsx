import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/react";

interface ImageDropZoneProps {
  onImageSelect: (file: File) => void;
  className?: string;
}

export default function ImageDropZone({ onImageSelect, className = "" }: ImageDropZoneProps) {
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageSelect(imageFile);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative min-h-[320px] cursor-pointer transition-all duration-300 border-2 border-dashed overflow-hidden ${
          isDragOver 
            ? 'border-emerald-400 bg-emerald-500/10' 
            : 'border-zinc-600 bg-zinc-800/30 hover:border-zinc-500'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AnimatePresence mode="wait">
            {isDragOver ? (
              <motion.div
                key="drag-over"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mb-4"
                >
                  <span className="text-2xl">📷</span>
                </motion.div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">释放以上传图片</h3>
                <p className="text-zinc-300 text-sm">支持 JPEG, PNG, WebP, GIF, BMP 格式</p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-16 h-16 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-full flex items-center justify-center mb-4 border border-zinc-500"
                >
                  <span className="text-2xl">📷</span>
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">拖拽图片到这里</h3>
                <p className="text-zinc-400 text-sm mb-4">或点击选择要处理的图片文件</p>
                
                <div className="flex flex-wrap justify-center gap-2 text-xs text-zinc-500">
                  <span className="px-2 py-1 bg-zinc-700/50 rounded">JPEG</span>
                  <span className="px-2 py-1 bg-zinc-700/50 rounded">PNG</span>
                  <span className="px-2 py-1 bg-zinc-700/50 rounded">WebP</span>
                  <span className="px-2 py-1 bg-zinc-700/50 rounded">GIF</span>
                  <span className="px-2 py-1 bg-zinc-700/50 rounded">BMP</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
                initial={{ x: Math.random() * 400, y: Math.random() * 300, opacity: 0 }}
                animate={{ 
                  x: Math.random() * 400, 
                  y: Math.random() * 300, 
                  opacity: [0, 1, 0] 
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}