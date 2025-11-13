'use client';

import ToolsPanel from "./components/ToolsPanel";
import MainCanvas from "./components/MainCanvas";
import LayersPanel from "./components/LayersPanel";
import { useCallback, useState } from "react";
import { ImageLayer, Layer, PointerPosition, TextLayer } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'text' | 'image'>("text");

  const handleStageClick = useCallback(
  (pointerPosition: PointerPosition) => {
    if (!activeTool) return;

    const baseLayer = {
      id: uuidv4(),
      name: activeTool === 'text' ? 'Text' : 'Image',
      type: activeTool,
      isVisible: true,
      x: pointerPosition.x,
      y: pointerPosition.y,
    };

    const newLayer: Layer =
      activeTool === 'text'
        ? { ...baseLayer, text: 'New Text', fontSize: 24, fill: '#000' } as TextLayer
        : { ...baseLayer, src: '/flower.jpg' } as ImageLayer;

    setLayers((prevLayers) => [...prevLayers, newLayer]);
    setActiveLayerId(newLayer.id);
    
  }, [activeTool] );

  const setLayerProperty = useCallback((layerId: string, property: keyof Layer, value: any) => {
    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === layerId ? { ...layer, [property]: value } : layer
      ));
  }, []);

  const setLayersOrder = useCallback((newLayers: Layer[]) => {
    setLayers(newLayers);
  }, []);

  return (
    <div className="min-h-screen font-mono">
      <div className="grid grid-cols-12 min-h-screen bg-[#0E2C37]">
        <div className="col-span-2 border-r-1 border-white">
          <ToolsPanel activeTool={activeTool} setActiveTool={setActiveTool} />
        </div>
        <div className="col-span-8 flex flex-col items-center justify-center">
          <h3 className='text-xl text-center mb-2'>Canvas</h3>
          <div className="w-[90%] h-[90vh]">
            <MainCanvas
              layers={layers}
              activeLayerId={activeLayerId}
              setActiveLayerId={setActiveLayerId}
              handleStageClick={handleStageClick}
            />
          </div>
        </div>

        <div className="col-span-2 border-l-1 border-white overflow-y-auto max-h-screen">
          <LayersPanel layers={layers} activeLayerId={activeLayerId} setActiveLayerId={setActiveLayerId} setLayerProperty={setLayerProperty} setLayersOrder={setLayersOrder} />
        </div>
      </div>
    </div>
  );
}