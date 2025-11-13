'use client';
import { Layer } from '@/lib/types';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import React, { useCallback } from 'react'

type LayersPanelProps = {
    layers: Layer[];
    activeLayerId: string | null;
    setActiveLayerId: (id: string) => void;
    setLayerProperty: (id: string, key: keyof Layer, value: any) => void;
    setLayersOrder: (newLayers: Layer[]) => void;
};

const LayersPanel = ({ layers, activeLayerId, setActiveLayerId, setLayerProperty, setLayersOrder }: LayersPanelProps) => {

    const handleDrag = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination){
            return;
        }

        const reorderedLayers = [...layers];
        const [draggedLayer] = reorderedLayers.splice(source.index, 1);
        reorderedLayers.splice(destination.index, 0, draggedLayer);

        setLayersOrder(reorderedLayers);
    };

    return (
        <div className='px-4 py-2'>
            <h3 className='text-xl text-center mb-2'>Layers</h3>
            <DragDropContext onDragEnd={handleDrag}>
                <Droppable droppableId="layers">
                    {(droppableProvider) => (
                        <div className='flex flex-col gap-3 border-t-1 border-white pt-3'
                            ref={droppableProvider.innerRef} {...droppableProvider.droppableProps}>
                            {
                                layers.map((layer, index) => (
                                    <Draggable index={index} key={layer.id} draggableId={`${layer.id}`}>
                                        {(draggableProvider) => (
                                            <div
                                                onClick={() => setActiveLayerId(layer.id)}
                                                className={`w-full p-2 rounded-lg border transition-colors flex items-center justify-between
                                                ${activeLayerId === layer.id ? 'bg-[#00684A] border-[#0D2A35]' :
                                                        'bg-stone-900 hover:bg-neutral-950'}`}
                                                ref={draggableProvider.innerRef}
                                                {...draggableProvider.draggableProps}
                                                {...draggableProvider.dragHandleProps}>
                                                <span>{layer.name}</span>
                                                <input type='checkbox'
                                                    className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium"
                                                    checked={layer.isVisible}
                                                    onChange={(e) =>setLayerProperty(layer.id, 'isVisible', e.target.checked)}
                                                ></input>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default LayersPanel