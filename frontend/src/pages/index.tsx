import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Chip } from "@heroui/react";
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

interface ProcessedImage {
  id: string;
  name: string;
  originalSize: string;
  processedSize: string;
  format: string;
  url: string;
  timestamp: Date;
}

export default function IndexPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [cropData, setCropData] = useState<{ area: Area; pixels: Area } | null>(null);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [outputQuality, setOutputQuality] = useState(90);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setShowCropEditor(true);
  }, []);

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCropData({ area: croppedArea, pixels: croppedAreaPixels });
  }, []);

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
          height: Math.round(cropData.pixels.height)
        }
      };

      // Call Wails backend API
      const resultPath = await WailsAPI.processImageFromBase64(base64Data, options);
      
      // Create processed image record
      const processedImage: ProcessedImage = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name.replace(/\.[^/.]+$/, "") + `_processed.${outputFormat}`,
        originalSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        processedSize: `${((selectedFile.size * 0.7) / 1024 / 1024).toFixed(2)} MB`, // Estimated
        format: outputFormat.toUpperCase(),
        url: resultPath,
        timestamp: new Date()
      };

      setProcessedImages(prev => [processedImage, ...prev]);
      setShowCropEditor(false);
      setSelectedFile(null);
      setImageSrc("");
      
      // Show success notification
      setToast({ message: "图片处理完成！", type: "success" });
      console.log("Image processed successfully:", resultPath);
    } catch (error) {
      console.error("Processing failed:", error);
      setToast({ 
        message: "图片处理失败: " + (error instanceof Error ? error.message : "未知错误"), 
        type: "error" 
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">拖拽图片到这里</h1>
          <p className="text-zinc-400">或点击选择要处理的图片文件</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drop Zone */}
          <div className="lg:col-span-2">
            <ImageDropZone 
              onImageSelect={handleImageSelect}
              className="h-full min-h-[400px]"
            />
          </div>

          {/* Stats & Recent */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-zinc-800/30 border border-zinc-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">处理统计</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm">今日处理</span>
                      <Chip color="primary" variant="flat" size="sm">
                        {processedImages.length}
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm">支持格式</span>
                      <Chip color="success" variant="flat" size="sm">
                        5
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm">节省空间</span>
                      <Chip color="warning" variant="flat" size="sm">
                        ~30%
                      </Chip>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Images */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-zinc-800/30 border border-zinc-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">最近处理</h3>
                  
                  {processedImages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🖼️</div>
                      <p className="text-zinc-400 text-sm">还没有处理过图片</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-auto">
                      <AnimatePresence>
                        {processedImages.map((image, index) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg border border-zinc-600/30 hover:border-emerald-500/30 transition-colors"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-zinc-900 font-bold text-xs">
                                {image.format}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {image.name}
                              </p>
                              <p className="text-zinc-400 text-xs">
                                {image.originalSize} → {image.processedSize}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Crop Editor Modal */}
        <AnimatePresence>
          {showCropEditor && (
            <ImageCropEditor
              imageSrc={imageSrc}
              onCropComplete={handleCropComplete}
              onFormatChange={handleFormatChange}
              onQualityChange={handleQualityChange}
              onProcess={handleProcess}
              onCancel={handleCancel}
              isProcessing={isProcessing}
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
      </div>
    </DefaultLayout>
  );
}
