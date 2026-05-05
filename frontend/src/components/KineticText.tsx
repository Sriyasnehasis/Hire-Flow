import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";

export const KineticText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = async (target: string) => {
    setIsScrambling(true);
    let iterations = 0;
    
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split("").map((char, index) => {
          if (index < iterations) return target[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iterations >= target.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      iterations += 1/3;
    }, 30);
  };

  useEffect(() => {
    scramble(text);
  }, [text]);

  return (
    <motion.div 
      className="inline-block cursor-default"
      onMouseEnter={() => !isScrambling && scramble(text)}
    >
      {displayText}
    </motion.div>
  );
};

export const AdvantageCycle = () => {
    const words = ["ADVANTAGE", "EDGE", "INTEL", "ACCESS", "LEVERAGE"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative inline-block ml-4 text-outline-thin">
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};
