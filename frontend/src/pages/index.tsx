import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Zap, Sparkles, Layers, Triangle, Circle, Square } from "lucide-react";

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
      <div className="flex flex-col justify-center items-center h-[calc(100vh-2rem)] p-4 relative overflow-hidden">
        {/* Floating Decoration Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { Icon: Zap, x: "15%", y: "20%", delay: 0 },
            { Icon: Sparkles, x: "85%", y: "25%", delay: 0.5 },
            { Icon: Layers, x: "10%", y: "70%", delay: 1 },
            { Icon: Triangle, x: "90%", y: "75%", delay: 1.5 },
            { Icon: Circle, x: "20%", y: "45%", delay: 2 },
            { Icon: Square, x: "80%", y: "55%", delay: 2.5 },
          ].map(({ Icon, x, y, delay }, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              className="absolute cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              style={{ left: x, top: y }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
              }}
              whileHover={{
                scale: 1.3,
                opacity: 0.9,
                transition: { duration: 0.2 },
              }}
              whileInView={{ opacity: 0.6, scale: 1 }}
            >
              <Icon
                className={`w-6 h-6 transition-colors duration-1000 ${
                  theme === "light"
                    ? "text-orange-300/40"
                    : "text-violet-400/30"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Geometric Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            className={`absolute top-8 right-16 w-24 h-24 rounded-full opacity-10 ${
              theme === "light"
                ? "bg-gradient-to-br from-orange-400 to-amber-500"
                : "bg-gradient-to-br from-violet-500 to-purple-600"
            }`}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            animate={{
              scale: [1, 0.8, 1],
              rotate: [0, -90, 0],
            }}
            className={`absolute bottom-16 left-12 w-20 h-20 opacity-10 ${
              theme === "light"
                ? "bg-gradient-to-tr from-amber-400 to-yellow-500"
                : "bg-gradient-to-tr from-indigo-500 to-blue-600"
            }`}
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="w-full h-full flex gap-4 justify-center items-start relative z-10 max-w-none">
          {/* Side Info Panel */}
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            className={`w-52 min-w-[180px] p-3 rounded-xl border transition-all duration-500 ${
              theme === "light"
                ? "bg-white/50 border-orange-200/50 backdrop-blur-sm"
                : "bg-zinc-900/50 border-zinc-700/50 backdrop-blur-sm"
            }`}
            initial={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="space-y-4">
              {/* Processing Stats */}
              <div>
                <h3
                  className={`text-sm font-medium mb-3 ${
                    theme === "light" ? "text-amber-800" : "text-zinc-300"
                  }`}
                >
                  处理统计
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "今日处理", value: "0", icon: Circle },
                    { label: "总计", value: "0", icon: Triangle },
                    { label: "节省空间", value: "0MB", icon: Layers },
                  ].map(({ label, value, icon: Icon }, index) => (
                    <motion.div
                      key={label}
                      animate={{ scale: [1, 1.02, 1] }}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        theme === "light" ? "bg-orange-50/50" : "bg-zinc-800/50"
                      }`}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`w-3 h-3 ${
                            theme === "light"
                              ? "text-orange-500"
                              : "text-violet-500"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            theme === "light"
                              ? "text-amber-700"
                              : "text-zinc-400"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          theme === "light" ? "text-amber-800" : "text-zinc-300"
                        }`}
                      >
                        {value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Files */}
              <div>
                <h3
                  className={`text-sm font-medium mb-3 ${
                    theme === "light" ? "text-amber-800" : "text-zinc-300"
                  }`}
                >
                  最近文件
                </h3>
                <div
                  className={`p-3 rounded-lg text-center ${
                    theme === "light" ? "bg-orange-50/50" : "bg-zinc-800/50"
                  }`}
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles
                      className={`w-6 h-6 mx-auto mb-2 ${
                        theme === "light"
                          ? "text-orange-400"
                          : "text-violet-400"
                      }`}
                    />
                  </motion.div>
                  <p
                    className={`text-xs ${
                      theme === "light" ? "text-amber-600" : "text-zinc-400"
                    }`}
                  >
                    暂无处理记录
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col justify-center items-center h-full">
            {/* Top Status Bar */}
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className={`w-full flex justify-between items-center p-3 rounded-xl mb-4 border transition-all duration-500 h-14 ${
                theme === "light"
                  ? "bg-white/60 border-orange-200/50 backdrop-blur-sm"
                  : "bg-zinc-900/60 border-zinc-700/50 backdrop-blur-sm"
              }`}
              initial={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  className={`w-2 h-2 rounded-full ${
                    theme === "light" ? "bg-orange-500" : "bg-violet-500"
                  }`}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span
                  className={`text-sm font-medium ${
                    theme === "light" ? "text-amber-800" : "text-zinc-300"
                  }`}
                >
                  图片处理模式
                </span>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div
                  className={`flex items-center gap-2 ${
                    theme === "light" ? "text-amber-600" : "text-zinc-400"
                  }`}
                >
                  <span>拖拽上传</span>
                  <kbd
                    className={`px-2 py-1 rounded border ${
                      theme === "light"
                        ? "bg-orange-100 border-orange-200 text-orange-700"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300"
                    }`}
                  >
                    Ctrl+O
                  </kbd>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    theme === "light" ? "text-amber-600" : "text-zinc-400"
                  }`}
                >
                  <span>快速处理</span>
                  <kbd
                    className={`px-2 py-1 rounded border ${
                      theme === "light"
                        ? "bg-orange-100 border-orange-200 text-orange-700"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300"
                    }`}
                  >
                    Ctrl+Enter
                  </kbd>
                </div>
              </div>
            </motion.div>

            {/* Main Drop Zone */}
            <motion.div
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <ImageDropZone
                className="w-full flex-1"
                onImageSelect={handleImageSelect}
              />
            </motion.div>

            {/* Quick Settings Panel */}
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className={`w-full p-3 rounded-xl border mt-3 transition-all duration-500 ${
                theme === "light"
                  ? "bg-white/40 border-orange-200/50 backdrop-blur-sm"
                  : "bg-zinc-900/40 border-zinc-700/50 backdrop-blur-sm"
              }`}
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3
                  className={`text-sm font-medium ${
                    theme === "light" ? "text-amber-800" : "text-zinc-300"
                  }`}
                >
                  快速设置
                </h3>
                <motion.div
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Square
                    className={`w-3 h-3 ${
                      theme === "light" ? "text-orange-400" : "text-violet-400"
                    }`}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <h4
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-amber-700" : "text-zinc-400"
                    }`}
                  >
                    输出格式
                  </h4>
                  <div className="flex gap-2">
                    {["JPEG", "PNG", "WEBP"].map((format) => (
                      <motion.button
                        key={format}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all duration-300 ${
                          theme === "light"
                            ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {format}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-amber-700" : "text-zinc-400"
                    }`}
                  >
                    质量预设
                  </h4>
                  <div className="flex gap-2">
                    {["高", "中", "快"].map((quality) => (
                      <motion.button
                        key={quality}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all duration-300 ${
                          theme === "light"
                            ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {quality}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
