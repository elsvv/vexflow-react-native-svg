/**
 * React Native SVG rendering context for VexFlow.
 *
 * This context implements the VexFlow RenderContext interface and builds
 * a virtual SVG element tree that can be rendered using react-native-svg.
 */

import { RenderContext, TextMeasure, FontInfo, Font, VexFlow } from 'vexflow';
import type { SVGAttributes, ContextState, SVGElementNode, ReactNativeSVGContextOptions } from './types';

// Map SVG attribute names to react-native-svg prop names
const PROP_MAP: Record<string, string> = {
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-style': 'fontStyle',
  'stroke-width': 'strokeWidth',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-linecap': 'strokeLinecap',
  'pointer-events': 'pointerEvents',
  class: 'className',
};

// Attributes to ignore for specific element types
const ATTRIBUTES_TO_IGNORE: Record<string, Record<string, boolean>> = {
  path: {
    x: true,
    y: true,
    width: true,
    height: true,
    'font-family': true,
    'font-weight': true,
    'font-style': true,
    'font-size': true,
  },
  rect: {
    'font-family': true,
    'font-weight': true,
    'font-style': true,
    'font-size': true,
  },
  text: {
    width: true,
    height: true,
  },
};

const TWO_PI = 2 * Math.PI;

/**
 * Normalize an angle to [0, 2π)
 */
function normalizeAngle(angle: number): number {
  angle = angle % TWO_PI;
  if (angle < 0) {
    angle += TWO_PI;
  }
  return angle;
}

/**
 * Add VexFlow prefix to class/id names
 */
function prefix(name: string): string {
  return `vf-${name}`;
}

/**
 * ReactNativeSVGContext provides a rendering context for VexFlow that outputs
 * react-native-svg compatible elements instead of DOM SVG elements.
 */
export class ReactNativeSVGContext extends RenderContext {
  // Virtual SVG element tree
  private svg: SVGElementNode;
  private parent: SVGElementNode;
  private groups: SVGElementNode[];
  private groupAttributes: SVGAttributes[];

  // Dimensions
  private _width: number;
  private _height: number;

  // Drawing state
  private path: string = '';
  private pen: { x: number; y: number } = { x: NaN, y: NaN };
  private attributes: SVGAttributes;
  private state: SVGAttributes;
  private stateStack: ContextState[] = [];
  private precision: number;
  private backgroundFillStyle: string = 'white';
  private fontCSSString: string = '';
  private nextElementKey: number = 1;

  // Element registry for interactivity
  private elementRegistry: Map<string, SVGElementNode> = new Map();
  private classRegistry: Map<string, SVGElementNode[]> = new Map();

  constructor(options: ReactNativeSVGContextOptions = {}) {
    super();

    this._width = options.width ?? 500;
    this._height = options.height ?? 200;
    this.precision = Math.pow(10, VexFlow.RENDER_PRECISION_PLACES);

    // Default font attributes
    const defaultFontAttributes: SVGAttributes = {
      'font-family': 'Bravura, Academico, serif',
      'font-size': '10pt',
      'font-weight': 'normal',
      'font-style': 'normal',
    };

    this.state = {
      scaleX: 1,
      scaleY: 1,
      ...defaultFontAttributes,
    };

    this.attributes = {
      'stroke-width': 1.0,
      'stroke-dasharray': 'none',
      fill: 'black',
      stroke: 'black',
      ...defaultFontAttributes,
    };

    // Create root SVG element
    this.svg = this.createElement('svg');
    this.svg.props.width = this._width;
    this.svg.props.height = this._height;
    this.svg.props.pointerEvents = 'box-none';

    this.parent = this.svg;
    this.groups = [this.svg];
    this.groupAttributes = [{ ...this.attributes }];
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  /**
   * Get the element registry for accessing rendered elements by ID.
   */
  getElementRegistry(): Map<string, SVGElementNode> {
    return this.elementRegistry;
  }

  /**
   * Get elements by class name.
   */
  getElementsByClassName(className: string): SVGElementNode[] {
    return this.classRegistry.get(prefix(className)) ?? [];
  }

  /**
   * Get the root SVG element node.
   */
  getSVG(): SVGElementNode {
    return this.svg;
  }

  private round(n: number): number {
    return Math.round(n * this.precision) / this.precision;
  }

  private createElement(type: SVGElementNode['type']): SVGElementNode {
    return {
      type,
      props: { key: this.nextElementKey++ },
      children: [],
    };
  }

  private applyAttributes(element: SVGElementNode, attributes: SVGAttributes): void {
    const attrNamesToIgnore = ATTRIBUTES_TO_IGNORE[element.type] ?? {};

    for (const attrName in attributes) {
      if (attrNamesToIgnore[attrName]) continue;

      const value = attributes[attrName];
      if (value === undefined || value === null) continue;

      // Skip if same as parent group attribute
      const groupAttrs = this.groupAttributes[this.groupAttributes.length - 1];
      if (groupAttrs && value === groupAttrs[attrName]) continue;

      // Map attribute name to React Native SVG prop name
      const propName = PROP_MAP[attrName] ?? attrName;
      (element.props as any)[propName] = value;
    }
  }

  private addElement(element: SVGElementNode): void {
    this.parent.children.push(element);

    // Register element if it has an ID
    if (element.id) {
      this.elementRegistry.set(element.id, element);
    }

    // Register by class name
    if (element.className) {
      const existing = this.classRegistry.get(element.className) ?? [];
      existing.push(element);
      this.classRegistry.set(element.className, existing);
    }
  }

  // ============== RenderContext Implementation ==============

  clear(): void {
    this.svg.children = [];
    this.elementRegistry.clear();
    this.classRegistry.clear();
  }

  setFillStyle(style: string): this {
    this.attributes.fill = style;
    return this;
  }

  setBackgroundFillStyle(style: string): this {
    this.backgroundFillStyle = style;
    return this;
  }

  setStrokeStyle(style: string): this {
    this.attributes.stroke = style;
    return this;
  }

  setShadowColor(color: string): this {
    // Shadow not directly supported in react-native-svg
    // Could implement with filter/defs if needed
    return this;
  }

  setShadowBlur(blur: number): this {
    // Shadow not directly supported in react-native-svg
    return this;
  }

  setLineWidth(width: number): this {
    this.attributes['stroke-width'] = width;
    return this;
  }

  setLineCap(capType: CanvasLineCap): this {
    this.attributes['stroke-linecap'] = capType;
    return this;
  }

  setLineDash(lineDash: number[]): this {
    if (Array.isArray(lineDash)) {
      this.attributes['stroke-dasharray'] = lineDash.join(',');
    }
    return this;
  }

  scale(x: number, y: number): this {
    this.state.scaleX = (this.state.scaleX as number) * x;
    this.state.scaleY = (this.state.scaleY as number) * y;

    const visibleWidth = this._width / (this.state.scaleX as number);
    const visibleHeight = this._height / (this.state.scaleY as number);
    this.setViewBox(0, 0, visibleWidth, visibleHeight);

    return this;
  }

  setViewBox(x: number, y: number, width: number, height: number): void {
    this.svg.props.viewBox = `${x} ${y} ${width} ${height}`;
  }

  resize(width: number, height: number): this {
    this._width = width;
    this._height = height;
    this.svg.props.width = width;
    this.svg.props.height = height;
    this.scale(this.state.scaleX as number, this.state.scaleY as number);
    return this;
  }

  rect(x: number, y: number, width: number, height: number, attributes?: SVGAttributes): this {
    if (height < 0) {
      y += height;
      height *= -1;
    }

    const rect = this.createElement('rect');
    const defaultAttrs: SVGAttributes = {
      fill: 'none',
      'stroke-width': this.attributes['stroke-width'],
      stroke: 'black',
    };

    const finalAttrs = { ...defaultAttrs, ...attributes };
    rect.props.x = this.round(x);
    rect.props.y = this.round(y);
    rect.props.width = this.round(width);
    rect.props.height = this.round(height);

    this.applyAttributes(rect, finalAttrs);
    this.addElement(rect);
    return this;
  }

  fillRect(x: number, y: number, width: number, height: number): this {
    return this.rect(x, y, width, height, { fill: this.attributes.fill, stroke: 'none' });
  }

  pointerRect(x: number, y: number, width: number, height: number): this {
    return this.rect(x, y, width, height, { opacity: 0, 'pointer-events': 'auto' } as any);
  }

  clearRect(x: number, y: number, width: number, height: number): this {
    return this.rect(x, y, width, height, { fill: this.backgroundFillStyle, stroke: 'none' });
  }

  beginPath(): this {
    this.path = '';
    this.pen.x = NaN;
    this.pen.y = NaN;
    return this;
  }

  moveTo(x: number, y: number): this {
    x = this.round(x);
    y = this.round(y);
    this.path += `M${x} ${y}`;
    this.pen.x = x;
    this.pen.y = y;
    return this;
  }

  lineTo(x: number, y: number): this {
    x = this.round(x);
    y = this.round(y);
    this.path += `L${x} ${y}`;
    this.pen.x = x;
    this.pen.y = y;
    return this;
  }

  bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this {
    x = this.round(x);
    y = this.round(y);
    x1 = this.round(x1);
    y1 = this.round(y1);
    x2 = this.round(x2);
    y2 = this.round(y2);
    this.path += `C${x1} ${y1},${x2} ${y2},${x} ${y}`;
    this.pen.x = x;
    this.pen.y = y;
    return this;
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number): this {
    x = this.round(x);
    y = this.round(y);
    x1 = this.round(x1);
    y1 = this.round(y1);
    this.path += `Q${x1} ${y1},${x} ${y}`;
    this.pen.x = x;
    this.pen.y = y;
    return this;
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise: boolean): this {
    let x0 = x + radius * Math.cos(startAngle);
    let y0 = y + radius * Math.sin(startAngle);
    x0 = this.round(x0);
    y0 = this.round(y0);

    const tmpStartTest = normalizeAngle(startAngle);
    const tmpEndTest = normalizeAngle(endAngle);

    if (
      (!counterclockwise && endAngle - startAngle >= TWO_PI) ||
      (counterclockwise && startAngle - endAngle >= TWO_PI) ||
      tmpStartTest === tmpEndTest
    ) {
      // Full circle - need two arcs
      let x1 = x + radius * Math.cos(startAngle + Math.PI);
      let y1 = y + radius * Math.sin(startAngle + Math.PI);
      x1 = this.round(x1);
      y1 = this.round(y1);
      radius = this.round(radius);
      this.path += `M${x0} ${y0} A${radius} ${radius} 0 0 0 ${x1} ${y1} `;
      this.path += `A${radius} ${radius} 0 0 0 ${x0} ${y0}`;
      this.pen.x = x0;
      this.pen.y = y0;
    } else {
      let x1 = x + radius * Math.cos(endAngle);
      let y1 = y + radius * Math.sin(endAngle);

      const normalizedStart = tmpStartTest;
      const normalizedEnd = tmpEndTest;
      let large: boolean;

      if (Math.abs(normalizedEnd - normalizedStart) < Math.PI) {
        large = counterclockwise;
      } else {
        large = !counterclockwise;
      }
      if (normalizedStart > normalizedEnd) {
        large = !large;
      }

      const sweep = !counterclockwise;

      x1 = this.round(x1);
      y1 = this.round(y1);
      radius = this.round(radius);
      this.path += `M${x0} ${y0} A${radius} ${radius} 0 ${+large} ${+sweep} ${x1} ${y1}`;
      this.pen.x = x1;
      this.pen.y = y1;
    }
    return this;
  }

  closePath(): this {
    this.path += 'Z';
    return this;
  }

  fill(attributes?: SVGAttributes): this {
    const pathElement = this.createElement('path');

    if (attributes === undefined) {
      attributes = { ...this.attributes, stroke: 'none' };
    }

    attributes.d = this.path;
    this.applyAttributes(pathElement, attributes);
    this.addElement(pathElement);
    return this;
  }

  stroke(): this {
    const pathElement = this.createElement('path');
    const attributes: SVGAttributes = {
      ...this.attributes,
      fill: 'none',
      d: this.path,
    };

    this.applyAttributes(pathElement, attributes);
    this.addElement(pathElement);
    return this;
  }

  fillText(text: string, x: number, y: number): this {
    if (!text || text.length === 0) {
      return this;
    }

    x = this.round(x);
    y = this.round(y);

    const textElement = this.createElement('text');
    textElement.textContent = text;
    textElement.props.x = x;
    textElement.props.y = y;

    const attributes: SVGAttributes = {
      ...this.attributes,
      stroke: 'none',
    };

    this.applyAttributes(textElement, attributes);
    this.addElement(textElement);
    return this;
  }

  save(): this {
    this.stateStack.push({
      state: { ...this.state },
      attributes: { ...this.attributes },
    });
    return this;
  }

  restore(): this {
    const saved = this.stateStack.pop();
    if (saved) {
      this.state = { ...saved.state };
      this.attributes = { ...saved.attributes };
    }
    return this;
  }

  openGroup(cls?: string, id?: string): SVGElementNode {
    const group = this.createElement('g');

    if (cls) {
      group.className = prefix(cls);
      group.props.className = prefix(cls);
    }
    if (id) {
      group.id = prefix(id);
      group.props.id = prefix(id);
    }

    this.groups.push(group);
    this.parent.children.push(group);
    this.parent = group;

    this.applyAttributes(group, this.attributes);
    this.groupAttributes.push({ ...this.groupAttributes[this.groupAttributes.length - 1], ...this.attributes });

    // Register group
    if (group.id) {
      this.elementRegistry.set(group.id, group);
    }
    if (group.className) {
      const existing = this.classRegistry.get(group.className) ?? [];
      existing.push(group);
      this.classRegistry.set(group.className, existing);
    }

    return group;
  }

  closeGroup(): void {
    this.groups.pop();
    this.groupAttributes.pop();
    this.parent = this.groups[this.groups.length - 1];
  }

  openRotation(angleDegrees: number, x: number, y: number): void {
    const group = this.openGroup();
    group.props.transform = `translate(${x},${y}) rotate(${angleDegrees}) translate(-${x},-${y})`;
  }

  closeRotation(): void {
    this.closeGroup();
  }

  add(child: SVGElementNode): void {
    this.parent.children.push(child);
  }

  measureText(text: string): TextMeasure {
    // In React Native, we can't directly measure text without rendering.
    // We provide a reasonable estimate based on font size.
    // For accurate measurement, the consumer should use a text measuring library.
    const fontSize = parseFloat(String(this.attributes['font-size'] ?? '10'));
    const avgCharWidth = fontSize * 0.6; // Rough estimate
    const width = text.length * avgCharWidth;
    const height = fontSize * 1.2;

    return {
      x: 0,
      y: -fontSize,
      width,
      height,
    };
  }

  set fillStyle(style: string | CanvasGradient | CanvasPattern) {
    this.setFillStyle(style as string);
  }

  get fillStyle(): string | CanvasGradient | CanvasPattern {
    return this.attributes.fill as string;
  }

  set strokeStyle(style: string | CanvasGradient | CanvasPattern) {
    this.setStrokeStyle(style as string);
  }

  get strokeStyle(): string | CanvasGradient | CanvasPattern {
    return this.attributes.stroke as string;
  }

  setFont(f?: string | FontInfo, size?: string | number, weight?: string | number, style?: string): this {
    const fontInfo = Font.validate(f, size, weight, style);
    this.fontCSSString = Font.toCSSString(fontInfo);

    const fontAttributes: SVGAttributes = {
      'font-family': fontInfo.family,
      'font-size': fontInfo.size,
      'font-weight': String(fontInfo.weight),
      'font-style': fontInfo.style,
    };

    this.attributes = { ...this.attributes, ...fontAttributes };
    this.state = { ...this.state, ...fontAttributes };
    return this;
  }

  getFont(): string {
    return this.fontCSSString;
  }
}
