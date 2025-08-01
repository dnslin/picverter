import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SimpleTextAnimateProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  animationKey?: number;
  delay?: number;
  duration?: number;
}

export default function SimpleTextAnimate({
  children,
  className = "",
  style,
  animationKey = 0,
  delay = 0,
  duration = 0.8,
}: SimpleTextAnimateProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (animationKey > 0) {
      setIsAnimating(true);

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 动画结束后重置状态
      timeoutRef.current = setTimeout(
        () => {
          setIsAnimating(false);
        },
        (duration + delay) * 1000
      );
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [animationKey, duration, delay]);

  const characters = children.split("");

  return (
    <span className={className} style={style}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}-${animationKey}`}
          animate={isAnimating ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          className="inline-block"
          initial={
            isAnimating ? { opacity: 0, filter: "blur(10px)", y: 20 } : false
          }
          transition={{
            duration: duration * 0.3,
            delay: delay + index * 0.05,
            ease: "easeOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
