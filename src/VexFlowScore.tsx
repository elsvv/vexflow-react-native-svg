/**
 * VexFlowScore - A React Native component for rendering VexFlow music notation.
 *
 * This component provides a declarative way to render VexFlow scores in React Native
 * using react-native-svg, with full support for interactivity.
 */

import React, { useMemo, useCallback, ReactElement } from 'react';
import { GestureResponderEvent } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { ReactNativeSVGContext } from './ReactNativeSVGContext';
import type { SVGElementNode, VexFlowScoreProps, SVGAttributes, InteractiveProps } from './types';

/**
 * Convert SVGElementNode tree to React Native SVG elements.
 */
function renderElementTree(
  node: SVGElementNode,
  elementStyles?: Record<string, Partial<SVGAttributes>>,
  classStyles?: Record<string, Partial<SVGAttributes>>,
  onElementPress?: (elementId: string | undefined, className: string | undefined, event: GestureResponderEvent) => void
): ReactElement {
  // Apply style overrides
  let props = { ...node.props };

  // Apply class-based styles
  if (classStyles && node.className) {
    const classStyle = classStyles[node.className];
    if (classStyle) {
      props = { ...props, ...convertAttributesToProps(classStyle) };
    }
  }

  // Apply ID-based styles (higher priority)
  if (elementStyles && node.id) {
    const idStyle = elementStyles[node.id];
    if (idStyle) {
      props = { ...props, ...convertAttributesToProps(idStyle) };
    }
  }

  // Add press handler if provided
  if (onElementPress && (node.id || node.className)) {
    props.onPress = (event: GestureResponderEvent) => {
      onElementPress(node.id, node.className, event);
    };
  }

  // Render children recursively
  const children = node.children.map((child) => renderElementTree(child, elementStyles, classStyles, onElementPress));

  switch (node.type) {
    case 'svg':
      return React.createElement(Svg, props, children);
    case 'g':
      return React.createElement(G, props, children);
    case 'path':
      return React.createElement(Path, props, children);
    case 'rect':
      return React.createElement(Rect, props, children);
    case 'text':
      return React.createElement(SvgText, props, node.textContent);
    default:
      return React.createElement(G, props, children);
  }
}

/**
 * Convert SVG attribute names to react-native-svg prop names.
 */
function convertAttributesToProps(attrs: Partial<SVGAttributes>): Record<string, any> {
  const propMap: Record<string, string> = {
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-weight': 'fontWeight',
    'font-style': 'fontStyle',
    'stroke-width': 'strokeWidth',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-linecap': 'strokeLinecap',
    'pointer-events': 'pointerEvents',
  };

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(attrs)) {
    const propName = propMap[key] ?? key;
    result[propName] = value;
  }
  return result;
}

/**
 * VexFlowScore component renders VexFlow music notation using react-native-svg.
 *
 * @example
 * ```tsx
 * import { VexFlowScore } from '@vexflow/react-native-svg';
 * import { Stave, StaveNote, Formatter } from 'vexflow';
 *
 * function MyScore() {
 *   const handleDraw = (context) => {
 *     const stave = new Stave(10, 40, 400);
 *     stave.addClef('treble').addTimeSignature('4/4');
 *     stave.setContext(context).draw();
 *
 *     const notes = [
 *       new StaveNote({ keys: ['c/4'], duration: 'q' }),
 *       new StaveNote({ keys: ['d/4'], duration: 'q' }),
 *       new StaveNote({ keys: ['e/4'], duration: 'q' }),
 *       new StaveNote({ keys: ['f/4'], duration: 'q' }),
 *     ];
 *
 *     Formatter.FormatAndDraw(context, stave, notes);
 *   };
 *
 *   return (
 *     <VexFlowScore
 *       width={450}
 *       height={200}
 *       onDraw={handleDraw}
 *       onElementPress={(id, cls, e) => console.log('Pressed:', id, cls)}
 *     />
 *   );
 * }
 * ```
 */
export function VexFlowScore({
  width,
  height,
  onDraw,
  onElementPress,
  elementStyles,
  classStyles,
  ...svgProps
}: VexFlowScoreProps): ReactElement {
  // Create context and render the score
  const svgTree = useMemo(() => {
    const context = new ReactNativeSVGContext({ width, height });
    onDraw(context);
    return context.getSVG();
  }, [width, height, onDraw]);

  // Convert the virtual SVG tree to React elements
  const element = useMemo(() => {
    return renderElementTree(svgTree, elementStyles, classStyles, onElementPress);
  }, [svgTree, elementStyles, classStyles, onElementPress]);

  return element;
}

/**
 * Hook to create and manage a ReactNativeSVGContext.
 * Useful when you need more control over the rendering process.
 *
 * @example
 * ```tsx
 * function MyCustomScore() {
 *   const { context, render, clear } = useVexFlowContext(400, 200);
 *
 *   useEffect(() => {
 *     // Draw something
 *     const stave = new Stave(10, 40, 380);
 *     stave.setContext(context).draw();
 *   }, [context]);
 *
 *   return render();
 * }
 * ```
 */
export function useVexFlowContext(
  width: number,
  height: number,
  options?: {
    elementStyles?: Record<string, Partial<SVGAttributes>>;
    classStyles?: Record<string, Partial<SVGAttributes>>;
    onElementPress?: (
      elementId: string | undefined,
      className: string | undefined,
      event: GestureResponderEvent
    ) => void;
  }
) {
  const context = useMemo(() => {
    return new ReactNativeSVGContext({ width, height });
  }, [width, height]);

  const clear = useCallback(() => {
    context.clear();
  }, [context]);

  const render = useCallback(() => {
    const svgTree = context.getSVG();
    return renderElementTree(svgTree, options?.elementStyles, options?.classStyles, options?.onElementPress);
  }, [context, options?.elementStyles, options?.classStyles, options?.onElementPress]);

  const getElementById = useCallback(
    (id: string) => {
      return context.getElementRegistry().get(id);
    },
    [context]
  );

  const getElementsByClassName = useCallback(
    (className: string) => {
      return context.getElementsByClassName(className);
    },
    [context]
  );

  return {
    context,
    render,
    clear,
    getElementById,
    getElementsByClassName,
  };
}
