import type { GestureResponderEvent } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { ReactNativeSVGContext } from './ReactNativeSVGContext';

/**
 * Event handler type for interactive SVG elements in React Native.
 */
export type SVGPressHandler = (event: GestureResponderEvent) => void;

/**
 * Props that can be attached to SVG elements for interactivity.
 */
export interface InteractiveProps {
    onPress?: SVGPressHandler;
    onPressIn?: SVGPressHandler;
    onPressOut?: SVGPressHandler;
    onLongPress?: SVGPressHandler;
}

/**
 * Attributes that can be applied to SVG elements.
 */
export interface SVGAttributes {
    [key: string]: string | number | undefined;
    'font-family'?: string;
    'font-size'?: string | number;
    'font-style'?: string;
    'font-weight'?: string | number;
    fill?: string;
    stroke?: string;
    'stroke-width'?: number;
    'stroke-dasharray'?: string;
    'stroke-linecap'?: string;
    opacity?: string | number;
    transform?: string;
    d?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

/**
 * State for saving/restoring context state.
 */
export interface ContextState {
    state: SVGAttributes;
    attributes: SVGAttributes;
}

/**
 * Options for creating the ReactNativeSVGContext.
 */
export interface ReactNativeSVGContextOptions {
    width?: number;
    height?: number;
}

/**
 * Element info stored in the registry for interactivity.
 */
export interface ElementInfo {
    id: string;
    className?: string;
    groupId?: string;
    element: SVGElementNode;
}

/**
 * Base interface for SVG element nodes in the virtual tree.
 */
export interface SVGElementNode {
    type: 'svg' | 'g' | 'path' | 'rect' | 'text';
    props: SVGAttributes & InteractiveProps & { key: string | number };
    children: SVGElementNode[];
    textContent?: string;
    id?: string;
    className?: string;
}

/**
 * Props for the VexFlowScore component.
 */
export interface VexFlowScoreProps extends Omit<SvgProps, 'children'> {
    /**
     * Width of the score in pixels.
     */
    width: number;
    /**
     * Height of the score in pixels.
     */
    height: number;
    /**
     * Callback to draw the score. Receives the context to use for rendering.
     */
    onDraw: (context: ReactNativeSVGContext) => void;
    /**
     * Callback when an element is pressed. Provides the element ID and class.
     */
    onElementPress?: (
        elementId: string | undefined,
        className: string | undefined,
        event: GestureResponderEvent
    ) => void;
    /**
     * Custom style overrides for specific elements by ID.
     */
    elementStyles?: Record<string, Partial<SVGAttributes>>;
    /**
     * Custom style overrides for elements by class name.
     */
    classStyles?: Record<string, Partial<SVGAttributes>>;
}
