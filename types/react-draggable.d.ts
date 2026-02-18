declare module 'react-draggable' {
    import * as React from 'react';

    export interface DraggableProps {
        axis?: 'both' | 'x' | 'y' | 'none';
        handle?: string;
        defaultPosition?: { x: number; y: number };
        position?: { x: number; y: number };
        bounds?: string | { left?: number; top?: number; right?: number; bottom?: number } | HTMLElement;
        grid?: [number, number];
        scale?: number;
        onStart?: (e: any, data: any) => void | false;
        onDrag?: (e: any, data: any) => void | false;
        onStop?: (e: any, data: any) => void | false;
        disabled?: boolean;
        cancel?: string;
        onMouseDown?: (e: MouseEvent) => void;
        children?: React.ReactNode;
    }

    export default class Draggable extends React.Component<DraggableProps> { }
}
