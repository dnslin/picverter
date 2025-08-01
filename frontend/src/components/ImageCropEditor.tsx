import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Slider, Select, SelectItem } from "@heroui/react";
import Cropper from "react-easy-crop";
import { ZoomIn, Crop, Download, X, Grid3X3, Move } from "lucide-react";
import { useTheme } from "next-themes";

import MagicProcessing from "./MagicProcessing";

import { NumberTicker } from "@/components/magicui/number-ticker";

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

// 主题样式配置
const getThemeStyles = (theme: string | undefined) => {
  const isDark = theme === "dark";

  return {
    overlay: isDark
      ? "bg-black/90 backdrop-blur-xl"
      : "bg-white/95 backdrop-blur-xl",
    cropArea: isDark
      ? "bg-zinc-950/90 border-zinc-800/50"
      : "bg-white/95 border-gray-200/50",
    controlPanel: isDark
      ? "bg-zinc-950/90 border-zinc-800/50"
      : "bg-white/95 border-gray-200/50",
    text: {
      primary: isDark ? "text-white" : "text-gray-900",
      secondary: isDark ? "text-zinc-300" : "text-gray-600",
      muted: isDark ? "text-zinc-400" : "text-gray-500",
    },
    gradients: {
      primary: isDark
        ? "from-violet-500 via-purple-500 to-indigo-500"
        : "from-amber-500 via-orange-500 to-red-500",
      accent: isDark
        ? "from-violet-500 to-indigo-500"
        : "from-blue-500 to-indigo-500",
    },
    cropperStyle: {
      containerStyle: {
        borderRadius: "12px",
        backgroundColor: isDark ? "#0a0a0a" : "#f8fafc",
      },
      cropAreaStyle: {
        border: isDark ? "2px solid #8b5cf6" : "2px solid #3b82f6",
        borderRadius: "8px",
      },
    },
  };
};

export default function ImageCropEditor({
  imageSrc,
  onCropComplete,
  onFormatChange,
  onQualityChange,
  onProcess,
  onCancel,
  isProcessing = false,
}: ImageCropEditorProps) {
  const { theme } = useTheme();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);

  const styles = getThemeStyles(theme);

  // 组件每次挂载时都重新初始化 - 解决重复选择相同图片的问题
  useEffect(() => {
    // 重置所有状态到初始值，确保裁剪框正确显示
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(null);
    setFormat("jpeg");
    setQuality(90);
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      } else if (event.key === "Enter" && !isProcessing) {
        onProcess();
      } else if (event.key === "+" || event.key === "=") {
        setZoom((prev) => Math.min(3, prev + 0.1));
      } else if (event.key === "-") {
        setZoom((prev) => Math.max(1, prev - 0.1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, onProcess, isProcessing]);

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
    const selected = aspectRatios.find((ratio) => ratio.key === selectedKey);

    setAspect(selected?.value || null);
  }, []);

  return (
    <>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed inset-0 ${styles.overlay} z-50 flex items-center justify-center p-4`}
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full h-full flex gap-4 max-w-none">
          {/* Main crop area */}
          <Card
            className={`flex-1 ${styles.cropArea} backdrop-blur-xl shadow-2xl min-w-0`}
          >
            <div className="h-full relative rounded-xl overflow-hidden">
              <Cropper
                aspect={aspect || undefined}
                crop={crop}
                image={imageSrc}
                restrictPosition={false}
                showGrid={true}
                style={styles.cropperStyle}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </Card>

          {/* Control Panel */}
          <Card
            className={`w-80 xl:w-96 ${styles.controlPanel} backdrop-blur-xl flex flex-col shadow-2xl`}
          >
            <div
              className={`p-4 xl:p-6 border-b ${theme === "dark" ? "border-zinc-800/50" : "border-gray-200/50"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${styles.gradients.primary} rounded-xl flex items-center justify-center`}
                >
                  <Crop className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${styles.text.primary}`}>
                    图片裁剪
                  </h2>
                  <p className={`${styles.text.muted} text-sm`}>
                    调整裁剪区域和输出设置
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 xl:p-6 space-y-4 xl:space-y-6 overflow-auto">
              {/* Zoom Control */}
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ZoomIn
                    className={`w-4 h-4 ${theme === "dark" ? "text-violet-400" : "text-blue-500"}`}
                  />
                  <span
                    className={`text-sm font-medium ${styles.text.secondary}`}
                  >
                    缩放: {Math.round(zoom * 100)}%
                  </span>
                </div>
                <Slider
                  aria-label="Zoom"
                  className="w-full"
                  classNames={{
                    base: "max-w-md",
                    track: theme === "dark" ? "bg-zinc-800" : "bg-gray-200",
                    filler: `bg-gradient-to-r ${styles.gradients.accent}`,
                    thumb: "bg-white shadow-lg",
                  }}
                  color="secondary"
                  maxValue={3}
                  minValue={1}
                  size="sm"
                  step={0.1}
                  value={zoom}
                  onChange={(value) =>
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
                <div className="flex items-center gap-2 mb-3">
                  <Grid3X3
                    className={`w-4 h-4 ${theme === "dark" ? "text-violet-400" : "text-blue-500"}`}
                  />
                  <span
                    className={`text-sm font-medium ${styles.text.secondary}`}
                  >
                    长宽比
                  </span>
                </div>
                <Select
                  aria-label="选择长宽比"
                  classNames={{
                    trigger:
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-600 text-white"
                        : "bg-white border-gray-300 text-gray-900",
                    popoverContent:
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-600"
                        : "bg-white border-gray-300",
                  }}
                  defaultSelectedKeys={["free"]}
                  placeholder="选择长宽比"
                  size="sm"
                  variant="bordered"
                  onSelectionChange={handleAspectChange}
                >
                  {aspectRatios.map((ratio) => (
                    <SelectItem
                      key={ratio.key}
                      className={
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }
                    >
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
                <div className="flex items-center gap-2 mb-3">
                  <Download
                    className={`w-4 h-4 ${theme === "dark" ? "text-violet-400" : "text-blue-500"}`}
                  />
                  <span
                    className={`text-sm font-medium ${styles.text.secondary}`}
                  >
                    输出格式
                  </span>
                </div>
                <Select
                  aria-label="选择输出格式"
                  classNames={{
                    trigger:
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-600 text-white"
                        : "bg-white border-gray-300 text-gray-900",
                    popoverContent:
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-600"
                        : "bg-white border-gray-300",
                  }}
                  defaultSelectedKeys={["jpeg"]}
                  placeholder="选择格式"
                  size="sm"
                  variant="bordered"
                  onSelectionChange={handleFormatChange}
                >
                  {supportedFormats.map((fmt) => (
                    <SelectItem
                      key={fmt.key}
                      className={
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }
                    >
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
                    <label
                      className={`block text-sm font-medium ${styles.text.secondary} mb-3`}
                    >
                      图片质量: {quality}%
                    </label>
                    <Slider
                      aria-label="Quality"
                      className="w-full"
                      classNames={{
                        track: theme === "dark" ? "bg-zinc-800" : "bg-gray-200",
                        filler:
                          theme === "dark"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-green-600 to-emerald-600",
                        thumb: "bg-white shadow-lg",
                      }}
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
                className={`p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-zinc-800/50 border-zinc-700"
                    : "bg-gray-50/50 border-gray-200"
                }`}
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4
                  className={`text-sm font-medium ${styles.text.secondary} mb-2`}
                >
                  输出预览
                </h4>
                <div className={`space-y-1 text-xs ${styles.text.muted}`}>
                  <div>格式: {format.toUpperCase()}</div>
                  {(format === "jpeg" || format === "webp") && (
                    <div className="flex items-center gap-1">
                      质量:{" "}
                      <NumberTicker
                        className={`${theme === "dark" ? "text-violet-400" : "text-blue-500"} font-medium`}
                        value={quality}
                      />
                      %
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    缩放:{" "}
                    <NumberTicker
                      className={`${theme === "dark" ? "text-indigo-400" : "text-indigo-600"} font-medium`}
                      value={Math.round(zoom * 100)}
                    />
                    %
                  </div>
                </div>
              </motion.div>

              {/* 快捷键提示 */}
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                className={`p-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-zinc-800/30 border-zinc-700/50"
                    : "bg-blue-50/50 border-blue-200/50"
                }`}
                initial={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Move
                    className={`w-3 h-3 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}
                  />
                  <span className={`text-xs font-medium ${styles.text.muted}`}>
                    快捷键
                  </span>
                </div>
                <div className={`space-y-1 text-xs ${styles.text.muted}`}>
                  <div>ESC: 取消 | Enter: 确认</div>
                  <div>+/-: 缩放调整</div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div
              className={`p-4 xl:p-6 border-t ${theme === "dark" ? "border-zinc-800/50" : "border-gray-200/50"} flex gap-3`}
            >
              <Button
                className={`flex-1 h-11 ${
                  theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300"
                } font-medium transition-all duration-200`}
                disabled={isProcessing}
                radius="sm"
                startContent={<X className="w-4 h-4" />}
                variant="bordered"
                onPress={onCancel}
              >
                取消
              </Button>
              <Button
                className={`flex-1 h-11 ${
                  theme === "dark"
                    ? "bg-sky-600 hover:bg-sky-700 text-white border border-sky-500"
                    : "bg-amber-500 hover:bg-amber-600 text-white border border-amber-400"
                } font-medium transition-all duration-200`}
                disabled={isProcessing}
                radius="sm"
                startContent={<Download className="w-4 h-4" />}
                variant="bordered"
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
