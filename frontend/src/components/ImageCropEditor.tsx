import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Slider, Select, SelectItem } from "@heroui/react";
import Cropper from "react-easy-crop";
import { ZoomIn, Crop, Download, X } from "lucide-react";

import MagicProcessing from "./MagicProcessing";

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
  { key: "gif", label: "GIF" },
  { key: "bmp", label: "BMP" },
];

const aspectRatios = [
  { key: "free", label: "自由裁剪", value: null },
  { key: "1:1", label: "1:1 正方形", value: 1 },
  { key: "4:3", label: "4:3 标准", value: 4 / 3 },
  { key: "16:9", label: "16:9 宽屏", value: 16 / 9 },
  { key: "3:2", label: "3:2 经典", value: 3 / 2 },
];

export default function ImageCropEditor({
  imageSrc,
  onCropComplete,
  onFormatChange,
  onQualityChange,
  onProcess,
  onCancel,
  isProcessing = false,
}: ImageCropEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);

  const handleCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedArea, croppedAreaPixels);
    },
    [onCropComplete]
  );

  const handleFormatChange = useCallback(
    (keys: any) => {
      const selectedFormat = Array.from(keys)[0] as string;

      setFormat(selectedFormat);
      onFormatChange(selectedFormat);
    },
    [onFormatChange]
  );

  const handleQualityChange = useCallback(
    (value: number | number[]) => {
      const qualityValue = Array.isArray(value) ? value[0] : value;

      setQuality(qualityValue);
      onQualityChange(qualityValue);
    },
    [onQualityChange]
  );

  const handleAspectChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    const selected = aspectRatios.find(ratio => ratio.key === selectedKey);

    setAspect(selected?.value || null);
  }, []);

  return (
    <>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full max-w-7xl h-full max-h-[90vh] flex gap-6">
          {/* Main crop area */}
          <Card className="flex-1 bg-zinc-950/90 border border-zinc-800/50 backdrop-blur-xl shadow-2xl">
            <div className="h-full relative rounded-xl overflow-hidden">
              <Cropper
                aspect={aspect || undefined}
                crop={crop}
                image={imageSrc}
                style={{
                  containerStyle: {
                    borderRadius: "12px",
                    backgroundColor: "#0a0a0a",
                  },
                }}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </Card>

          {/* Control Panel */}
          <Card className="w-96 bg-zinc-950/90 border border-zinc-800/50 backdrop-blur-xl flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Crop className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">图片裁剪</h2>
                  <p className="text-zinc-400 text-sm">
                    调整裁剪区域和输出设置
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-auto">
              {/* Zoom Control */}
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ZoomIn className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-zinc-300">
                    缩放: {Math.round(zoom * 100)}%
                  </span>
                </div>
                <Slider
                  aria-label="Zoom"
                  className="w-full"
                  classNames={{
                    base: "max-w-md",
                    track: "bg-zinc-800",
                    filler: "bg-gradient-to-r from-violet-500 to-indigo-500",
                    thumb: "bg-white shadow-lg",
                  }}
                  color="secondary"
                  maxValue={3}
                  minValue={1}
                  size="sm"
                  step={0.1}
                  value={zoom}
                  onChange={value =>
                    setZoom(Array.isArray(value) ? value[0] : value)
                  }
                />
              </motion.div>

              {/* Aspect Ratio */}
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="block text-sm font-medium text-zinc-300 mb-3">
                  长宽比
                </span>
                <Select
                  classNames={{
                    trigger: "bg-zinc-800 border-zinc-600 text-white",
                    popoverContent: "bg-zinc-800 border-zinc-600",
                  }}
                  defaultSelectedKeys={["free"]}
                  placeholder="选择长宽比"
                  size="sm"
                  variant="bordered"
                  onSelectionChange={handleAspectChange}
                >
                  {aspectRatios.map(ratio => (
                    <SelectItem key={ratio.key} className="text-white">
                      {ratio.label}
                    </SelectItem>
                  ))}
                </Select>
              </motion.div>

              {/* Output Format */}
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="block text-sm font-medium text-zinc-300 mb-3">
                  输出格式
                </span>
                <Select
                  classNames={{
                    trigger: "bg-zinc-800 border-zinc-600 text-white",
                    popoverContent: "bg-zinc-800 border-zinc-600",
                  }}
                  defaultSelectedKeys={["jpeg"]}
                  placeholder="选择格式"
                  size="sm"
                  variant="bordered"
                  onSelectionChange={handleFormatChange}
                >
                  {supportedFormats.map(fmt => (
                    <SelectItem key={fmt.key} className="text-white">
                      {fmt.label}
                    </SelectItem>
                  ))}
                </Select>
              </motion.div>

              {/* Quality Control - only for JPEG/WebP */}
              <AnimatePresence>
                {(format === "jpeg" || format === "webp") && (
                  <motion.div
                    animate={{ y: 0, opacity: 1, height: "auto" }}
                    exit={{ y: -20, opacity: 0, height: 0 }}
                    initial={{ y: 20, opacity: 0, height: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                      图片质量: {quality}%
                    </label>
                    <Slider
                      aria-label="Quality"
                      className="w-full"
                      color="success"
                      maxValue={100}
                      minValue={1}
                      size="sm"
                      step={1}
                      value={quality}
                      onChange={handleQualityChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preview Info */}
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="text-sm font-medium text-zinc-300 mb-2">
                  输出预览
                </h4>
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
            <div className="p-6 border-t border-zinc-800/50 flex gap-3">
              <Button
                className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                disabled={isProcessing}
                startContent={<X className="w-4 h-4" />}
                variant="light"
                onPress={onCancel}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-violet-500/25"
                color="primary"
                disabled={isProcessing}
                isLoading={isProcessing}
                startContent={<Download className="w-4 h-4" />}
                onPress={onProcess}
              >
                {isProcessing ? "处理中..." : "确认裁剪"}
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Magic Processing Overlay */}
      <MagicProcessing isVisible={isProcessing} />
    </>
  );
}
