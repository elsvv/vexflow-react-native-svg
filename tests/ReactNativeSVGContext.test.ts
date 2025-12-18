/**
 * Tests for ReactNativeSVGContext
 *
 * These tests verify the core rendering logic without requiring
 * a full React Native environment.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ReactNativeSVGContext } from '../src/ReactNativeSVGContext';

describe('ReactNativeSVGContext', () => {
  let context: ReactNativeSVGContext;

  beforeEach(() => {
    context = new ReactNativeSVGContext({ width: 400, height: 200 });
  });

  describe('initialization', () => {
    it('should create context with correct dimensions', () => {
      expect(context.width).toBe(400);
      expect(context.height).toBe(200);
    });

    it('should create root SVG element', () => {
      const svg = context.getSVG();
      expect(svg.type).toBe('svg');
      expect(svg.props.width).toBe(400);
      expect(svg.props.height).toBe(200);
    });

    it('should use default dimensions when not provided', () => {
      const ctx = new ReactNativeSVGContext();
      expect(ctx.width).toBe(500);
      expect(ctx.height).toBe(200);
    });
  });

  describe('path drawing', () => {
    it('should build path with moveTo and lineTo', () => {
      context.beginPath();
      context.moveTo(10, 20);
      context.lineTo(100, 200);
      context.stroke();

      const svg = context.getSVG();
      const path = svg.children[0];

      expect(path.type).toBe('path');
      expect(path.props.d).toBe('M10 20L100 200');
    });

    it('should handle bezier curves', () => {
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(10, 20, 30, 40, 50, 60);
      context.fill();

      const svg = context.getSVG();
      const path = svg.children[0];

      expect(path.props.d).toContain('C10 20,30 40,50 60');
    });

    it('should handle quadratic curves', () => {
      context.beginPath();
      context.moveTo(0, 0);
      context.quadraticCurveTo(50, 50, 100, 0);
      context.stroke();

      const svg = context.getSVG();
      const path = svg.children[0];

      expect(path.props.d).toContain('Q50 50,100 0');
    });

    it('should close path with Z', () => {
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(100, 0);
      context.lineTo(100, 100);
      context.closePath();
      context.fill();

      const svg = context.getSVG();
      const path = svg.children[0];

      expect(path.props.d).toContain('Z');
    });
  });

  describe('rectangles', () => {
    it('should create filled rectangle', () => {
      context.setFillStyle('red');
      context.fillRect(10, 20, 100, 50);

      const svg = context.getSVG();
      const rect = svg.children[0];

      expect(rect.type).toBe('rect');
      expect(rect.props.x).toBe(10);
      expect(rect.props.y).toBe(20);
      expect(rect.props.width).toBe(100);
      expect(rect.props.height).toBe(50);
      expect(rect.props.fill).toBe('red');
    });

    it('should handle negative height by flipping', () => {
      context.fillRect(10, 100, 50, -30);

      const svg = context.getSVG();
      const rect = svg.children[0];

      expect(rect.props.y).toBe(70); // 100 + (-30) = 70
      expect(rect.props.height).toBe(30); // abs(-30) = 30
    });
  });

  describe('text', () => {
    it('should create text element', () => {
      context.fillText('Hello', 50, 100);

      const svg = context.getSVG();
      const text = svg.children[0];

      expect(text.type).toBe('text');
      expect(text.textContent).toBe('Hello');
      expect(text.props.x).toBe(50);
      expect(text.props.y).toBe(100);
    });

    it('should not create element for empty text', () => {
      context.fillText('', 50, 100);

      const svg = context.getSVG();
      expect(svg.children.length).toBe(0);
    });
  });

  describe('groups', () => {
    it('should create group with class', () => {
      const group = context.openGroup('stavenote');

      expect(group.type).toBe('g');
      expect(group.className).toBe('vf-stavenote');
    });

    it('should create group with id', () => {
      const group = context.openGroup('note', 'note-1');

      expect(group.id).toBe('vf-note-1');
    });

    it('should nest elements in group', () => {
      context.openGroup('test-group');
      context.fillRect(0, 0, 10, 10);
      context.closeGroup();

      const svg = context.getSVG();
      const group = svg.children[0];

      expect(group.type).toBe('g');
      expect(group.children.length).toBe(1);
      expect(group.children[0].type).toBe('rect');
    });

    it('should register group by id', () => {
      context.openGroup('note', 'my-note');
      context.closeGroup();

      const registry = context.getElementRegistry();
      expect(registry.has('vf-my-note')).toBe(true);
    });
  });

  describe('element registry', () => {
    it('should track elements by class name', () => {
      context.openGroup('stavenote');
      context.closeGroup();
      context.openGroup('stavenote');
      context.closeGroup();

      const notes = context.getElementsByClassName('stavenote');
      expect(notes.length).toBe(2);
    });
  });

  describe('styles', () => {
    it('should set fill style', () => {
      context.setFillStyle('blue');
      context.fillRect(0, 0, 10, 10);

      const svg = context.getSVG();
      expect(svg.children[0].props.fill).toBe('blue');
    });

    it('should set stroke style', () => {
      context.setStrokeStyle('green');
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(10, 10);
      context.stroke();

      const svg = context.getSVG();
      expect(svg.children[0].props.stroke).toBe('green');
    });

    it('should set line width', () => {
      context.setLineWidth(3);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(10, 10);
      context.stroke();

      const svg = context.getSVG();
      expect(svg.children[0].props.strokeWidth).toBe(3);
    });

    it('should set line dash', () => {
      context.setLineDash([5, 3]);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(10, 10);
      context.stroke();

      const svg = context.getSVG();
      expect(svg.children[0].props.strokeDasharray).toBe('5,3');
    });
  });

  describe('save/restore', () => {
    it('should save and restore state', () => {
      context.setFillStyle('red');
      context.save();
      context.setFillStyle('blue');
      context.fillRect(0, 0, 10, 10); // blue
      context.restore();
      context.fillRect(20, 0, 10, 10); // red

      const svg = context.getSVG();
      expect(svg.children[0].props.fill).toBe('blue');
      expect(svg.children[1].props.fill).toBe('red');
    });
  });

  describe('clear', () => {
    it('should remove all children', () => {
      context.fillRect(0, 0, 10, 10);
      context.fillRect(20, 0, 10, 10);
      expect(context.getSVG().children.length).toBe(2);

      context.clear();
      expect(context.getSVG().children.length).toBe(0);
    });

    it('should clear element registry', () => {
      context.openGroup('test', 'test-id');
      context.closeGroup();
      expect(context.getElementRegistry().size).toBe(1);

      context.clear();
      expect(context.getElementRegistry().size).toBe(0);
    });
  });

  describe('resize', () => {
    it('should update dimensions', () => {
      context.resize(800, 400);

      expect(context.width).toBe(800);
      expect(context.height).toBe(400);

      const svg = context.getSVG();
      expect(svg.props.width).toBe(800);
      expect(svg.props.height).toBe(400);
    });
  });

  describe('scale', () => {
    it('should set viewBox for scaling', () => {
      context.scale(2, 2);

      const svg = context.getSVG();
      expect(svg.props.viewBox).toBeDefined();
    });
  });

  describe('rotation', () => {
    it('should create group with transform for rotation', () => {
      context.openRotation(45, 100, 100);
      context.fillRect(90, 90, 20, 20);
      context.closeRotation();

      const svg = context.getSVG();
      const group = svg.children[0];

      expect(group.type).toBe('g');
      expect(group.props.transform).toContain('rotate(45)');
      expect(group.props.transform).toContain('translate(100,100)');
    });
  });

  describe('arc', () => {
    it('should draw arc path', () => {
      context.beginPath();
      context.arc(50, 50, 25, 0, Math.PI, false);
      context.stroke();

      const svg = context.getSVG();
      const path = svg.children[0];

      expect(path.props.d).toContain('A'); // SVG arc command
    });

    it('should handle full circle', () => {
      context.beginPath();
      context.arc(50, 50, 25, 0, Math.PI * 2, false);
      context.fill();

      const svg = context.getSVG();
      const path = svg.children[0];

      // Full circle needs two arc commands
      const arcCount = (path.props.d?.match(/A/g) || []).length;
      expect(arcCount).toBe(2);
    });
  });

  describe('font', () => {
    it('should set font properties', () => {
      context.setFont('Bravura', '12pt', 'bold', 'italic');
      context.fillText('Test', 0, 0);

      const svg = context.getSVG();
      const text = svg.children[0];

      expect(text.props.fontFamily).toBe('Bravura');
      expect(text.props.fontSize).toBe('12pt');
      expect(text.props.fontWeight).toBe('bold');
      expect(text.props.fontStyle).toBe('italic');
    });

    it('should get font string', () => {
      context.setFont('Arial', '14pt', 'normal', 'normal');
      const font = context.getFont();

      expect(font).toContain('Arial');
      expect(font).toContain('14pt');
    });
  });

  describe('fillStyle/strokeStyle getters/setters', () => {
    it('should work with fillStyle property', () => {
      context.fillStyle = 'purple';
      expect(context.fillStyle).toBe('purple');
    });

    it('should work with strokeStyle property', () => {
      context.strokeStyle = 'orange';
      expect(context.strokeStyle).toBe('orange');
    });
  });

  describe('measureText', () => {
    it('should return text measurements', () => {
      const measure = context.measureText('Hello');

      expect(measure).toHaveProperty('width');
      expect(measure).toHaveProperty('height');
      expect(measure).toHaveProperty('x');
      expect(measure).toHaveProperty('y');
      expect(measure.width).toBeGreaterThan(0);
    });
  });
});
