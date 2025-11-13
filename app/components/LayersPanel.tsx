'use client';
import { Layer } from '@/lib/types';
import React from 'react'

type LayersPanelProps = {
  layers: Layer[];
  activeLayerId: string | null;
  setActiveLayerId: (id: string) => void;
};

const LayersPanel = ({ layers, activeLayerId, setActiveLayerId }: LayersPanelProps) => {
  return (
    <div className='px-4 py-2'>
            <h3 className='text-xl text-center mb-2'>Layers</h3>
            <div className='flex flex-col gap-3 border-t-1 border-zinc-800 pt-3'>
                {
                    layers.map((layer)=>(
                        <div>
                            <span>{layer.name}</span>
                            <input type='checkbox' checked={layer.isVisible}></input>
                        </div>
                    ))
                }
            </div>
        </div>
  )
}

export default LayersPanel