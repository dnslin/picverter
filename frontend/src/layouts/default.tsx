import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import {
  Image as ImageIcon,
  FolderOpen,
  Ruler,
  RotateCw,
  Sparkles,
  Palette,
} from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";
import Logo from "@/components/Logo";
import SimpleTextAnimate from "@/components/SimpleTextAnimate";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [animationKey, setAnimationKey] = useState(0);

  // 定时触发动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 5000); // 每5秒触发一次动画

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative flex h-screen overflow-hidden transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
      }`}
    >
      {/* Sidebar */}
      <motion.aside
        animate={{ x: 0, opacity: 1 }}
        className={`w-64 backdrop-blur-sm border-r flex flex-col transition-colors duration-500 ${
          theme === "light"
            ? "bg-white/95 border-gray-200/60"
            : "bg-gray-800/50 border-gray-700/50"
        }`}
        initial={{ x: -200, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* App Title */}
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className={`p-6 border-b transition-colors duration-500 ${
            theme === "light" ? "border-gray-200/60" : "border-gray-700/50"
          }`}
          initial={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <Logo animated={true} size="md" />
            <h1>
              <SimpleTextAnimate
                animationKey={animationKey}
                className="text-xl font-bold"
                style={{
                  color: theme === "light" ? "#d97706" : "#60a5fa",
                  transition: "color 0.3s ease",
                }}
              >
                PicVerter
              </SimpleTextAnimate>
            </h1>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          animate={{ y: 0, opacity: 1 }}
          className="flex-1 p-4 space-y-2"
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <NavItem
            active
            icon={<ImageIcon className="w-5 h-5" />}
            label="图片处理"
          />
          <NavItem icon={<FolderOpen className="w-5 h-5" />} label="批量处理" />
        </motion.nav>

        {/* Common Functions */}
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className={`p-4 border-t transition-colors duration-500 ${
            theme === "light" ? "border-gray-200/60" : "border-gray-700/50"
          }`}
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div
            className={`text-xs mb-3 font-medium tracking-wide transition-colors duration-500 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            常用功能
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ToolButton icon={<Ruler className="w-5 h-5" />} label="格式转换" />
            <ToolButton icon={<RotateCw className="w-5 h-5" />} label="旋转" />
            <ToolButton icon={<Sparkles className="w-5 h-5" />} label="调色" />
            <ToolButton icon={<Palette className="w-5 h-5" />} label="滤镜" />
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <motion.header
          animate={{ y: 0, opacity: 1 }}
          className={`h-14 backdrop-blur-sm border-b flex items-center justify-between px-6 transition-colors duration-500 ${
            theme === "light"
              ? "bg-white/70 border-gray-200/60"
              : "bg-gray-800/30 border-gray-700/50"
          }`}
          initial={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`text-sm transition-colors duration-500 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              快速开始
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Button
              isIconOnly
              className={`transition-colors duration-500 ${
                theme === "light"
                  ? "text-gray-600 hover:text-amber-600"
                  : "text-gray-400 hover:text-blue-400"
              }`}
              variant="ghost"
            >
              ⚙️
            </Button>
          </div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <motion.div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ${
        active
          ? theme === "light"
            ? "bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-700 border border-amber-400/40"
            : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
          : theme === "light"
            ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
      }`}
      whileHover={{ x: 4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center justify-center">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </motion.div>
  );
}

function ToolButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const { theme } = useTheme();

  return (
    <motion.div
      className={`flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
        theme === "light"
          ? "bg-gray-50/60 hover:bg-gray-100/80 border-gray-200/40 hover:border-amber-400/50"
          : "bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/30 hover:border-blue-500/30"
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex items-center justify-center">{icon}</span>
      <span
        className={`text-xs transition-colors duration-300 ${
          theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
