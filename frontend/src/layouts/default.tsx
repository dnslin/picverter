import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import {
  Camera,
  Image as ImageIcon,
  FolderOpen,
  Ruler,
  RotateCw,
  Sparkles,
  Palette,
} from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`relative flex h-screen overflow-hidden transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-amber-900"
          : "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
      }`}
    >
      {/* Sidebar */}
      <motion.aside
        animate={{ x: 0, opacity: 1 }}
        className={`w-64 backdrop-blur-sm border-r flex flex-col transition-colors duration-500 ${
          theme === "light"
            ? "bg-white/90 border-orange-200/60"
            : "bg-zinc-800/50 border-zinc-700/50"
        }`}
        initial={{ x: -200, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* App Title */}
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className={`p-6 border-b transition-colors duration-500 ${
            theme === "light" ? "border-orange-200/60" : "border-zinc-700/50"
          }`}
          initial={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${
                theme === "light"
                  ? "bg-gradient-to-br from-warm-400 to-warm-600"
                  : "bg-gradient-to-br from-emerald-400 to-cyan-400"
              }`}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -10, 10, 0],
                boxShadow:
                  theme === "light"
                    ? "0 8px 25px rgba(251, 146, 60, 0.4)"
                    : "0 8px 25px rgba(52, 211, 153, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Camera
                  className={`w-4 h-4 transition-colors duration-500 ${
                    theme === "light" ? "text-warm-50" : "text-zinc-900"
                  }`}
                />
              </motion.div>
            </motion.div>
            <h1
              className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                theme === "light"
                  ? "from-warm-600 to-warm-800"
                  : "from-emerald-400 to-cyan-400"
              }`}
            >
              PicVerter
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
            theme === "light" ? "border-orange-200/60" : "border-zinc-700/50"
          }`}
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div
            className={`text-xs mb-3 font-medium tracking-wide transition-colors duration-500 ${
              theme === "light" ? "text-warm-gray-600" : "text-zinc-400"
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
              ? "bg-white/70 border-orange-200/60"
              : "bg-zinc-800/30 border-zinc-700/50"
          }`}
          initial={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`text-sm transition-colors duration-500 ${
                theme === "light" ? "text-warm-gray-600" : "text-zinc-400"
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
                  ? "text-warm-gray-600 hover:text-warm-600"
                  : "text-zinc-400 hover:text-emerald-400"
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
            ? "bg-gradient-to-r from-warm-400/20 to-warm-600/20 text-warm-700 border border-warm-400/40"
            : "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30"
          : theme === "light"
            ? "text-warm-gray-600 hover:text-warm-gray-900 hover:bg-caramel-100/60"
            : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
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
          ? "bg-caramel-50/60 hover:bg-caramel-100/80 border-caramel-200/40 hover:border-warm-400/50"
          : "bg-zinc-700/30 hover:bg-zinc-700/50 border-zinc-600/30 hover:border-emerald-500/30"
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex items-center justify-center">{icon}</span>
      <span
        className={`text-xs transition-colors duration-300 ${
          theme === "light" ? "text-warm-gray-600" : "text-zinc-400"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
