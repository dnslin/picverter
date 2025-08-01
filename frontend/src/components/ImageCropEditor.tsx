import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Slider, Select, SelectItem } from "@heroui/react";
import Cropper from "react-easy-crop";

// Type definitions for react-easy-crop
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface ImageCropEditorProps {
  imageSrc: string;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onFormatChange: (format: string) => void;
  onQualityChange: (quality: number) => void;
  onProcess: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const supportedFormats = [
  { key: "jpeg", label: "JPEG" },
  { key: "png", label: "PNG" },
  { key: "webp", label: "WebP" },
  { key: "gif", label: "GIF" },
  { key: "bmp", label: "BMP" },
];

const aspectRatios = [
  { key: "free", label: "自由裁剪", value: null },
  { key: "1:1", label: "1:1 正方形", value: 1 },
  { key: "4:3", label: "4:3 标准", value: 4/3 },
  { key: "16:9", label: "16:9 宽屏", value: 16/9 },
  { key: "3:2", label: "3:2 经典", value: 3/2 },
];

export default function ImageCropEditor({
  imageSrc,
  onCropComplete,
  onFormatChange,
  onQualityChange,
  onProcess,
  onCancel,
  isProcessing = false
}: ImageCropEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);

  const handleFormatChange = useCallback((keys: any) => {
    const selectedFormat = Array.from(keys)[0] as string;
    setFormat(selectedFormat);
    onFormatChange(selectedFormat);
  }, [onFormatChange]);

  const handleQualityChange = useCallback((value: number | number[]) => {
    const qualityValue = Array.isArray(value) ? value[0] : value;
    setQuality(qualityValue);
    onQualityChange(qualityValue);
  }, [onQualityChange]);

  const handleAspectChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const selected = aspectRatios.find(ratio => ratio.key === selectedKey);
    setAspect(selected?.value || null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl h-full max-h-[90vh] flex gap-4">
        {/* Main crop area */}
        <Card className="flex-1 bg-zinc-900/90 border border-zinc-700">
          <div className="h-full relative">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect || undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              style={{
                containerStyle: {
                  borderRadius: '8px',
                  backgroundColor: '#18181b'
                }
              }}
            />
          </div>
        </Card>

        {/* Control Panel */}
        <Card className="w-80 bg-zinc-900/90 border border-zinc-700 flex flex-col">
          <div className="p-6 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-white mb-2">图片裁剪</h2>
            <p className="text-zinc-400 text-sm">调整裁剪区域和输出设置</p>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Zoom Control */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                缩放: {Math.round(zoom * 100)}%
              </label>
              <Slider
                aria-label="Zoom"
                step={0.1}
                maxValue={3}
                minValue={1}
                value={zoom}
                onChange={(value) => setZoom(Array.isArray(value) ? value[0] : value)}
                className="w-full"
                color="primary"
                size="sm"
              />
            </motion.div>

            {/* Aspect Ratio */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                长宽比
              </label>
              <Select 
                placeholder="选择长宽比"
                onSelectionChange={handleAspectChange}
                defaultSelectedKeys={["free"]}
                size="sm"
                variant="bordered"
                classNames={{
                  trigger: "bg-zinc-800 border-zinc-600 text-white",
                  content: "bg-zinc-800 border-zinc-600",
                }}
              >
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio.key} value={ratio.key} className="text-white">
                    {ratio.label}
                  </SelectItem>
                ))}
              </Select>
            </motion.div>

            {/* Output Format */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                输出格式
              </label>
              <Select 
                placeholder="选择格式"
                onSelectionChange={handleFormatChange}
                defaultSelectedKeys={["jpeg"]}
                size="sm"
                variant="bordered"
                classNames={{
                  trigger: "bg-zinc-800 border-zinc-600 text-white",
                  content: "bg-zinc-800 border-zinc-600",
                }}
              >
                {supportedFormats.map((fmt) => (
                  <SelectItem key={fmt.key} value={fmt.key} className="text-white">
                    {fmt.label}
                  </SelectItem>
                ))}
              </Select>
            </motion.div>

            {/* Quality Control - only for JPEG/WebP */}
            <AnimatePresence>
              {(format === "jpeg" || format === "webp") && (
                <motion.div
                  initial={{ y: 20, opacity: 0, height: 0 }}
                  animate={{ y: 0, opacity: 1, height: "auto" }}
                  exit={{ y: -20, opacity: 0, height: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    图片质量: {quality}%
                  </label>
                  <Slider
                    aria-label="Quality"
                    step={1}
                    maxValue={100}
                    minValue={1}
                    value={quality}
                    onChange={handleQualityChange}
                    className="w-full"
                    color="success"
                    size="sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
              <h4 className="text-sm font-medium text-zinc-300 mb-2">输出预览</h4>
              <div className="space-y-1 text-xs text-zinc-400">
                <div>格式: {format.toUpperCase()}</div>
                {(format === "jpeg" || format === "webp") && (
                  <div>质量: {quality}%</div>
                )}
                <div>缩放: {Math.round(zoom * 100)}%</div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-zinc-700 flex gap-3">
            <Button
              variant="ghost"
              onPress={onCancel}
              className="flex-1 text-zinc-400 hover:text-white"
              disabled={isProcessing}
            >
              取消
            </Button>
            <Button
              color="primary"
              onPress={onProcess}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium"
              isLoading={isProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? "处理中..." : "确认裁剪"}
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}