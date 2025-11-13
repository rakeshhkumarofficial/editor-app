'use client';
import { ImageLayer, Layer, TextLayer } from '@/lib/types';
import React from 'react'
import { Image as KImage, Layer as KLayer, Text as KText, Stage } from 'react-konva';
import useImage from 'use-image';

type CanvasStageProps = {
    layers: Layer[];
};

const MainCanvas = ({ layers }: CanvasStageProps) => {
    return (
        <div>
            <Stage>
                {layers.map((layer, index) => {
                    if (layer.type === "text") {
                        const textLayer: TextLayer = layer as TextLayer;
                        return (
                            <KLayer key={textLayer.id}>
                                <KText 
                                    text={textLayer.text}
                                    fontSize={textLayer.fontSize} 
                                    fill={textLayer.fill} 
                                    x={layer.x}
                                    y={layer.y}
                                    visible={layer.isVisible}
                                    name={layer.name}
                                    />
                            </KLayer>
                        );
                    }

                    if (layer.type === "image") {
                        const imageLayer: ImageLayer = layer as ImageLayer;
                        const [image] = useImage(imageLayer.src);
                        if (!layer.isVisible) return null;
                        return (
                            <KLayer key={imageLayer.id}>
                                <KImage 
                                    image={image} 
                                    x={layer.x} 
                                    y={layer.y}
                                    visible={layer.isVisible}
                                    name={layer.name}
                                    />
                            </KLayer>
                        );
                    }
                    return null;
                })}
            </Stage>
        </div>
    )
}

export default MainCanvas