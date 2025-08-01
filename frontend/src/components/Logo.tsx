import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

export default function Logo({
  size = "md",
  className = "",
  animated = true,
}: LogoProps) {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const logoVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      rotate: -10,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -2, 2, 0],
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        rotate: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 0px ${theme === "light" ? "rgba(245, 158, 11, 0)" : "rgba(14, 165, 233, 0)"}`,
        `0 0 20px ${theme === "light" ? "rgba(245, 158, 11, 0.3)" : "rgba(14, 165, 233, 0.3)"}`,
        `0 0 0px ${theme === "light" ? "rgba(245, 158, 11, 0)" : "rgba(14, 165, 233, 0)"}`,
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate={animated ? "animate" : undefined}
      className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}
      initial={animated ? "initial" : undefined}
      variants={animated ? logoVariants : undefined}
      whileHover={animated ? "hover" : undefined}
      whileTap={animated ? "tap" : undefined}
    >
      {/* 发光效果背景 */}
      <motion.div
        animate={animated ? "animate" : undefined}
        className="absolute inset-0 rounded-lg"
        variants={animated ? glowVariants : undefined}
      />

      {/* Logo SVG */}
      <motion.div
        className="relative z-10 w-full h-full"
        style={{
          filter:
            theme === "dark"
              ? "brightness(1.1) saturate(1.2)"
              : "brightness(0.95)",
        }}
      >
        <svg
          baseProfile="basic"
          className="w-full h-full"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="33.025" cy="61" opacity=".3" rx="23" ry="3" />
          <path
            d="M51.002,51.005h-36c-3.314,0-6-2.686-6-6v-25c0-3.314,2.686-6,6-6h36c3.314,0,6,2.686,6,6v25	C57.002,48.319,54.316,51.005,51.002,51.005z"
            fill="#37d0ee"
          />
          <path
            d="M24,19.005c2.761,0,5-2.238,5-5c0,0,0,0,0,0H15.002c-3.314,0-6,2.686-6,6V37 c0,0,0,0,0,0c2.761,0,5-2.238,5-5V20.005c0-0.552,0.449-1,1-1H24z"
            fill="#fff"
            opacity=".3"
          />
          <path
            d="M57.002,45.005V28c-2.761,0-5,2.238-5,5v11.058c0,1.075-0.872,1.947-1.947,1.947H36 c-2.761,0-5,2.239-5,5v0h20.002C54.316,51.005,57.002,48.319,57.002,45.005z"
            opacity=".15"
          />
          <path
            d="M12.502,25.5v-5.495c0-1.379,1.122-2.5,2.5-2.5H17.5"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="3"
          />
          <path
            d="M39.627,33.164L30,46h20c1.648,0,2.589-1.882,1.6-3.2l-7.227-9.636	C43.187,31.582,40.813,31.582,39.627,33.164z"
            fill="#9c34c2"
          />
          <path
            d="M24.915,28.127L15.447,42.33C14.401,43.899,15.525,46,17.411,46H41L29.085,28.127	C28.093,26.639,25.907,26.639,24.915,28.127z"
            fill="#ffa1ac"
          />
          <circle cx="39.5" cy="24.5" fill="#fff" r="3.5" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
