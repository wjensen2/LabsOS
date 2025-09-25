"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Boxes = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(80).fill(1); // Increased to cover more area
  const cols = new Array(80).fill(1); // Increased to cover more area
  const colors = [
    "rgb(125, 211, 252)", // sky-300
    "rgb(248, 113, 113)", // red-300
    "rgb(134, 239, 172)", // green-300
    "rgb(253, 224, 71)",  // yellow-300
    "rgb(147, 197, 253)", // blue-300
    "rgb(196, 181, 253)", // purple-300
    "rgb(244, 114, 182)", // pink-300
    "rgb(165, 180, 252)", // indigo-300
    "rgb(221, 214, 254)", // violet-300
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(1.5) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/2 top-1/2 flex w-screen h-screen z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8  border-l  border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              initial={{ backgroundColor: "transparent" }}
              whileHover={{
                backgroundColor: getRandomColor(),
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              onHoverStart={() => console.log("Hover started!")} // Debug log
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-700 relative cursor-pointer hover:z-10"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-6 -top-3 -left-3 text-slate-700 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};