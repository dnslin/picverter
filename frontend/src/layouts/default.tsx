import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-64 bg-zinc-800/50 backdrop-blur-sm border-r border-zinc-700/50 flex flex-col"
      >
        {/* App Title */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 border-b border-zinc-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">📷</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              PicVerter
            </h1>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.nav 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 p-4 space-y-2"
        >
          <NavItem icon="🖼️" label="图片处理" active />
          <NavItem icon="📁" label="批量处理" />
        </motion.nav>

        {/* Common Functions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-4 border-t border-zinc-700/50"
        >
          <div className="text-xs text-zinc-400 mb-3 font-medium tracking-wide">常用功能</div>
          <div className="grid grid-cols-2 gap-2">
            <ToolButton icon="📐" label="格式转换" />
            <ToolButton icon="🔄" label="旋转" />
            <ToolButton icon="✨" label="调色" />
            <ToolButton icon="🎨" label="滤镜" />
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-14 bg-zinc-800/30 backdrop-blur-sm border-b border-zinc-700/50 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">快速开始</div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Button 
              isIconOnly 
              variant="ghost" 
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              ⚙️
            </Button>
          </div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ x: 4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </motion.div>
  );
}

function ToolButton({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1 p-3 bg-zinc-700/30 hover:bg-zinc-700/50 rounded-lg cursor-pointer transition-all duration-200 border border-zinc-600/30 hover:border-emerald-500/30"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs text-zinc-400">{label}</span>
    </motion.div>
  );
}
