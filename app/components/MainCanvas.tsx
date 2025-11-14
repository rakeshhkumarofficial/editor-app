'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer as KLayer, Image as KImage, Text as KText, Transformer } from 'react-konva';
import { Layer, ImageLayer, TextLayer, PointerPosition } from '@/lib/types';
import Konva from 'konva';

type CanvasStageProps = {
    layers: Layer[];
    activeLayerId: string | null;
    setActiveLayerId: (id: string | null) => void;
    handleStageClick: (pointer: PointerPosition, stageSize: { width: number; height: number }) => void;
    setLayerProperty: (id: string, key: keyof Layer, value: any) => void;
};

const MainCanvas = ({ layers, activeLayerId, setActiveLayerId, handleStageClick, setLayerProperty }: CanvasStageProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [stageSize, setStageSize] = useState({ width: 800, height: 800 });
    const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

    const layerNodesRef = useRef<Record<string, Konva.Node>>({});
    const transformerRef = useRef<Transformer | any>(null);

    const handleLayerTransformEnd = useCallback((layer: Layer) => {
        const node = layerNodesRef.current[layer.id];
        if (!node) return;

        setLayerProperty(layer.id, 'x', node.x());
        setLayerProperty(layer.id, 'y', node.y());
        setLayerProperty(layer.id, 'scaleX', node.scaleX());
        setLayerProperty(layer.id, 'scaleY', node.scaleY());
        setLayerProperty(layer.id, 'rotation', node.rotation());
    }, [setLayerProperty]);

    useEffect(() => {
        setMounted(true);

        layers.forEach((layer) => {
            if (layer.type === 'image') {
                const img = new Image();
                img.src = (layer as ImageLayer).src;
                img.onload = () => setLoadedImages((prev) => ({ ...prev, [layer.id]: img }));
            }
        });

        const handleResize = () => {
            if (containerRef.current) {
                setStageSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [layers]);

    useEffect(() => {
        if (!activeLayerId || !transformerRef.current) return;

        const activeNode = layerNodesRef.current[activeLayerId];
        if (activeNode) {
            transformerRef.current.nodes([activeNode]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [activeLayerId, layers]);

    if (!mounted) return null;

    const onStageClick = (e: any) => {
        const stage = e.target.getStage();
        const clickedOnEmpty = e.target === stage;

        if (!clickedOnEmpty) {
            const clickedLayerId = e.target.attrs.id;
            if (clickedLayerId) setActiveLayerId(clickedLayerId);
            return;
        }

        const pointerPosition = stage.getPointerPosition();
        if (!pointerPosition) return;

        handleStageClick(pointerPosition, stageSize);
        setActiveLayerId(null);
    };

    return (
        <div className="flex items-center justify-center max-h-full border rounded-md bg-white" ref={containerRef}>
            <Stage width={stageSize.width} height={stageSize.height} onMouseDown={onStageClick}>
                <KLayer>
                    {layers.map((layer) => {
                        if (!layer.isVisible) return null;

                        if (layer.type === 'image') {
                            const imageLayer = layer as ImageLayer;
                            const img = loadedImages[layer.id];
                            if (!img) return null;

                            return (
                                <KImage
                                    key={imageLayer.id}
                                    id={imageLayer.id}
                                    image={img}
                                    x={imageLayer.x}
                                    y={imageLayer.y}
                                    scaleX={imageLayer.scaleX ?? 1}
                                    scaleY={imageLayer.scaleY ?? 1}
                                    rotation={imageLayer.rotation ?? 0}
                                    draggable
                                    onClick={() => setActiveLayerId(layer.id)}
                                    onDragEnd={() => handleLayerTransformEnd(imageLayer)}
                                    onTransformEnd={() => handleLayerTransformEnd(imageLayer)}
                                    ref={(node) => {
                                        if (node) layerNodesRef.current[layer.id] = node;
                                    }}
                                />
                            );
                        }

                        if (layer.type === 'text') {
                            const textLayer = layer as TextLayer;
                            return (
                                <KText
                                    key={textLayer.id}
                                    id={textLayer.id}
                                    text={textLayer.text}
                                    fontSize={textLayer.fontSize}
                                    fill={textLayer.fill}
                                    x={textLayer.x}
                                    y={textLayer.y}
                                    scaleX={textLayer.scaleX ?? 1}
                                    scaleY={textLayer.scaleY ?? 1}
                                    rotation={textLayer.rotation ?? 0}
                                    draggable
                                    onClick={() => setActiveLayerId(layer.id)}
                                    onDragEnd={() => handleLayerTransformEnd(textLayer)}
                                    onTransformEnd={() => handleLayerTransformEnd(textLayer)}
                                    ref={(node) => {
                                        if (node) layerNodesRef.current[layer.id] = node;
                                    }}
                                />
                            );
                        }

                        return null;
                    })}

                    {activeLayerId && <Transformer ref={transformerRef} />}
                </KLayer>
            </Stage>
        </div>
    );
};

export default MainCanvas;
