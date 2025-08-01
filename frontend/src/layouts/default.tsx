import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Scissors, FileImage, Settings, Minimize2 } from "lucide-react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ x: 0, opacity: 1 }}
        className="w-16 bg-zinc-900/90 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col"
        initial={{ x: -200, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* App Logo */}
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 border-b border-zinc-800/50"
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
        >
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Scissors className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          animate={{ y: 0, opacity: 1 }}
          className="flex-1 p-3 space-y-3"
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <NavItem active icon={FileImage} />
        </motion.nav>

        {/* Settings */}
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className="p-3 border-t border-zinc-800/50"
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <NavItem icon={Settings} />
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <motion.header
          animate={{ y: 0, opacity: 1 }}
          className="h-12 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-6"
          initial={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <motion.h1
              animate={{ x: 0, opacity: 1 }}
              className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              PicVerter
            </motion.h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
              size="sm"
              variant="light"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  active = false,
}: {
  icon: any;
  active?: boolean;
}) {
  return (
    <motion.div
      className={`w-10 h-10 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center ${
        active
          ? "bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />
    </motion.div>
  );
}
