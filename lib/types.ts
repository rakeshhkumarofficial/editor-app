export type Layer = {
    id: string,
    name: string,
    isVisible: boolean,
    x: number,
    y: number,
    type: 'image' | 'text',
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
}

export type ImageLayer = Layer & {
    type: 'image';
    src: string
}

export type TextLayer = Layer & {
    type: 'text';
    text: string,
    fontSize: number,
    fill: string
}

export type PointerPosition = { x: number; y: number };