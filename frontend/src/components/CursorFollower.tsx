"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CursorFollower() {
  const [active, setActive] = useState(false);
  
  const mouseX = useSpring(0, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="cursor-follower"
      style={{
        x: mouseX,
        y: mouseY,
      }}
      animate={{
        scale: active ? 2.5 : 1,
        backgroundColor: active ? "rgba(255, 114, 0, 0.4)" : "rgba(255, 255, 255, 0)",
      }}
    />
  );
}
