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

  const { Component, isSelected, getBaseProps, getInputProps } = useSwitch({
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
        className={clsx(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 border",
          theme === "light"
            ? "bg-gray-200 border-gray-300 hover:bg-gray-300"
            : "bg-gray-700 border-gray-600 hover:bg-gray-600"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSelected ? "sun" : "moon"}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            className={clsx(
              "transition-colors duration-300",
              isSelected ? "text-amber-500" : "text-blue-400"
            )}
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            {isSelected ? (
              <SunFilledIcon size={16} />
            ) : (
              <MoonFilledIcon size={16} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Component>
  );
};
