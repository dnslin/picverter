import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

import DefaultLayout from "@/layouts/default";
import ImageDropZone from "@/components/ImageDropZone";
import ImageCropEditor from "@/components/ImageCropEditor";
import Toast from "@/components/Toast";
import { WailsAPI, fileToBase64, ProcessOptions } from "@/utils/wails";

// Type definitions for react-easy-crop
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function IndexPage() {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cropData, setCropData] = useState<{ area: Area; pixels: Area } | null>(
    null,
  );
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [outputQuality, setOutputQuality] = useState(90);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);

    setImageSrc(url);
    setShowCropEditor(true);
  }, []);

  const handleCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCropData({ area: croppedArea, pixels: croppedAreaPixels });
    },
    [],
  );

  const handleFormatChange = useCallback((format: string) => {
    setOutputFormat(format);
  }, []);

  const handleQualityChange = useCallback((quality: number) => {
    setOutputQuality(quality);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile || !cropData) return;

    setIsProcessing(true);

    try {
      // Convert file to base64 for processing
      const base64Data = await fileToBase64(selectedFile);

      // Prepare processing options
      const options: ProcessOptions = {
        format: outputFormat,
        quality: outputQuality,
        crop: {
          x: Math.round(cropData.pixels.x),
          y: Math.round(cropData.pixels.y),
          width: Math.round(cropData.pixels.width),
          height: Math.round(cropData.pixels.height),
        },
      };

      // Call Wails backend API
      await WailsAPI.processImageFromBase64(base64Data, options);
      setShowCropEditor(false);
      setSelectedFile(null);
      setImageSrc("");

      // Show success notification
      setToast({ message: "图片处理完成！", type: "success" });
    } catch (error) {
      setToast({
        message:
          "图片处理失败: " +
          (error instanceof Error ? error.message : "未知错误"),
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, cropData, outputFormat, outputQuality]);

  const handleCancel = useCallback(() => {
    setShowCropEditor(false);
    setSelectedFile(null);
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc("");
  }, [imageSrc]);

  return (
    <DefaultLayout>
      <div className="flex flex-col justify-center min-h-full p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header with creative animation */}
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
            initial={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              animate={{ scale: 1 }}
              className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4 transition-all duration-500 ${
                theme === "light"
                  ? "from-orange-600 via-amber-600 to-yellow-600"
                  : "from-violet-400 via-purple-400 to-indigo-400"
              }`}
              initial={{ scale: 0.9 }}
              transition={{
                duration: 1,
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
            >
              轻松裁剪，完美转换
            </motion.h1>
            <motion.p
              animate={{ y: 0, opacity: 1 }}
              className={`text-lg max-w-2xl mx-auto transition-colors duration-500 ${
                theme === "light" ? "text-amber-700" : "text-zinc-400"
              }`}
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              专业级图片处理工具，支持智能裁剪、格式转换、质量优化
            </motion.p>
          </motion.div>

          {/* Main Drop Zone */}
          <motion.div
            animate={{ y: 0, opacity: 1, scale: 1 }}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <ImageDropZone
              className="w-full"
              onImageSelect={handleImageSelect}
            />
          </motion.div>

          {/* Quick Info */}
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className={`mt-8 flex justify-center items-center gap-8 text-sm transition-colors duration-500 ${
              theme === "light" ? "text-amber-600" : "text-zinc-500"
            }`}
            initial={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                  theme === "light" ? "bg-orange-500" : "bg-violet-500"
                }`}
              />
              <span>高质量处理</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                  theme === "light" ? "bg-amber-500" : "bg-indigo-500"
                }`}
              />
              <span>多格式支持</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                  theme === "light" ? "bg-yellow-500" : "bg-purple-500"
                }`}
              />
              <span>桌面级体验</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Crop Editor Modal */}
      <AnimatePresence>
        {showCropEditor && (
          <ImageCropEditor
            imageSrc={imageSrc}
            isProcessing={isProcessing}
            onCancel={handleCancel}
            onCropComplete={handleCropComplete}
            onFormatChange={handleFormatChange}
            onProcess={handleProcess}
            onQualityChange={handleQualityChange}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </DefaultLayout>
  );
}
