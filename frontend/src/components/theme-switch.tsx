import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import clsx from "clsx";
import { useTheme } from "next-themes";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const { Component, slots, isSelected, getBaseProps, getInputProps } =
    useSwitch({
      isSelected: theme === "light",
      onChange: () => setTheme(theme === "light" ? "dark" : "light"),
    });

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="w-8 h-8" />;

  return (
    <Component
      aria-label={isSelected ? "切换到深色模式" : "切换到浅色模式"}
      {...getBaseProps({
        className: clsx(
          "px-px transition-all duration-300 hover:scale-110 cursor-pointer group",
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <motion.div
        className={slots.wrapper({
          class: clsx(
            [
              "w-8 h-8",
              "bg-gradient-to-br",
              isSelected
                ? "from-warm-400 to-warm-600 text-warm-50"
                : "from-emerald-400 to-cyan-400 text-zinc-900",
              "rounded-xl",
              "flex items-center justify-center",
              "shadow-lg shadow-black/20 dark:shadow-black/40",
              "border border-white/20",
              "group-hover:shadow-xl group-hover:shadow-black/30",
              "transition-all duration-300",
              "group-data-[selected=true]:bg-transparent",
              "backdrop-blur-sm",
            ],
            classNames?.wrapper
          ),
        })}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSelected ? "sun" : "moon"}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
            initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            {isSelected ? (
              <SunFilledIcon size={18} />
            ) : (
              <MoonFilledIcon size={18} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Component>
  );
};
