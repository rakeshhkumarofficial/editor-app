'use client';
import React, { useState } from 'react'

type ToolsPanelProps = {
  activeTool: 'text' | 'image';
  setActiveTool: (tool: 'text' | 'image') => void;
};

const ToolsPanel = ({activeTool, setActiveTool} : ToolsPanelProps) => {

    return (
        <div className='px-4 py-2'>
            <h3 className='text-xl text-center mb-2'>Tools</h3>
            <div className='flex flex-col gap-3 border-t-1 border-white pt-3'>
                <button 
                    className={`w-full p-2 rounded-lg border transition-colors
                        ${activeTool === 'text' ? 'bg-rose-600 border-rose-600' : 'bg-stone-900 hover:bg-neutral-950'}`}
                    onClick={() => setActiveTool("text")}
                >
                    Text
                </button>
                <button 
                    className={`w-full p-2 rounded-lg border transition-colors
                        ${activeTool === 'image' ? 'bg-rose-600 border-rose-600' : 'bg-stone-900 hover:bg-neutral-950'}`}
                    onClick={() => setActiveTool("image")}
                >
                    Image
                </button>
            </div>
        </div>
    )
}

export default ToolsPanel