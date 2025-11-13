'use client';
import { useEffect, useRef, useState } from 'react';
import { Stage, Layer as KLayer, Image as KImage, Text as KText } from 'react-konva';
import { Layer, ImageLayer, TextLayer, PointerPosition } from '@/lib/types';

type CanvasStageProps = {
    layers: Layer[];
    activeLayerId: string | null;
    setActiveLayerId: (id: string | null) => void;
    handleStageClick: (pointerPosition: PointerPosition) => void;
};

const MainCanvas = ({ layers, activeLayerId, setActiveLayerId, handleStageClick }: CanvasStageProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [stageSize, setStageSize] = useState({ width: 800, height: 800 });

    const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

    useEffect(() => {
        setMounted(true);

        const images: Record<string, HTMLImageElement> = {};

        layers.forEach((layer) => {
            if (layer.type === 'image') {
                const img = new Image();
                img.src = (layer as ImageLayer).src;
                img.onload = () => {
                    setLoadedImages((prev) => ({ ...prev, [layer.id]: img }));
                };
                images[layer.id] = img;
            }
        });

        function updateSize() {
            if (containerRef.current) {
                setStageSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [layers]);

    if (!mounted) return null;

    const onStageClick = (e: any) => {
        const clicked = e.target === e.target.getStage();
        if (clicked) {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            if (pointerPosition) handleStageClick(pointerPosition);
            setActiveLayerId(null);
        }
    };

    return (
        <div
            className="flex items-center justify-center max-h-full border rounded-md bg-white"
            ref={containerRef}
        >
            <Stage width={stageSize.width} height={stageSize.height} onMouseDown={onStageClick} className="max-h-full">
                <KLayer>
                    {layers.map((layer) => {
                        if (!layer.isVisible) return null;

                        if (layer.type === 'image') {
                            const imageLayer = layer as ImageLayer;
                            const img = loadedImages[layer.id];
                            if (!img) return null;

                            const scale = Math.min(
                                (stageSize.width * 0.8) / img.width,
                                (stageSize.height * 0.8) / img.height
                            );

                            const x = (stageSize.width - img.width * scale) / 2;
                            const y = (stageSize.height - img.height * scale) / 2;

                            return (
                                <KImage
                                    key={imageLayer.id}
                                    image={img}
                                    x={x}
                                    y={y}
                                    scaleX={scale}
                                    scaleY={scale}
                                    rotation={imageLayer.rotation ?? 0}
                                    draggable
                                    onClick={() => setActiveLayerId(layer.id)}
                                />
                            );
                        }

                        if (layer.type === 'text') {
                            const textLayer = layer as TextLayer;
                            return (
                                <KText
                                    key={textLayer.id}
                                    text={textLayer.text}
                                    fontSize={textLayer.fontSize}
                                    fill={textLayer.fill}
                                    x={textLayer.x}
                                    y={textLayer.y}
                                    rotation={textLayer.rotation ?? 0}
                                    scaleX={textLayer.scaleX ?? 1}
                                    scaleY={textLayer.scaleY ?? 1}
                                    draggable
                                    onClick={() => setActiveLayerId(layer.id)}
                                />
                            );
                        }

                        return null;
                    })}
                </KLayer>
            </Stage>
        </div>
    );
};

export default MainCanvas;
