export type Layer = {
    id: string,
    name: string,
    isVisible: boolean,
    x: number,
    y: number,
    type: 'image' | 'text'
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