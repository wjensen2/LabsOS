"use client";
import React from "react";
import { Boxes } from "./ui/background-boxes";

export function BackgroundBoxes() {
  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      {/* Remove the mask overlay that was blocking interactions */}
      <Boxes />
    </div>
  );
}