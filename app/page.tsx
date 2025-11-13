'use client';
import ToolsPanel from "./components/ToolsPanel";
import MainCanvas from "./components/MainCanvas";
import LayersPanel from "./components/LayersPanel";
import { useState } from "react";
import { Layer } from "@/lib/types";

export default function Home() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="grid grid-cols-12 min-h-screen">
        <div className="col-span-2 border-r-1 border-zinc-800">
          <ToolsPanel/>
        </div>
        <div className="col-span-8">
          <MainCanvas layers={layers} />
        </div>
        <div className="col-span-2">
          <LayersPanel layers={layers} activeLayerId={activeLayerId} setActiveLayerId={setActiveLayerId} />
        </div>
      </div>
    </div>
  );
}