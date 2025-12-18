import { describe, it, expect, beforeEach } from 'vitest';
import {
    initializeTextMeasurement,
    isTextMeasurementInitialized,
    resetTextMeasurement,
} from '../src/textMeasurement';
import { Element as VexFlowElement } from 'vexflow';

describe('textMeasurement', () => {
    beforeEach(() => {
        resetTextMeasurement();
    });

    describe('initializeTextMeasurement', () => {
        it('should initialize text measurement', () => {
            expect(isTextMeasurementInitialized()).toBe(false);
            initializeTextMeasurement();
            expect(isTextMeasurementInitialized()).toBe(true);
        });

        it('should be idempotent - calling multiple times has no effect', () => {
            initializeTextMeasurement();
            initializeTextMeasurement();
            initializeTextMeasurement();
            expect(isTextMeasurementInitialized()).toBe(true);
        });

        it('should set a mock canvas on VexFlow Element', () => {
            initializeTextMeasurement();

            // Access the static method to get the canvas
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            expect(canvas).toBeDefined();
            expect(typeof canvas.getContext).toBe('function');
        });

        it('should provide a 2d context with measureText', () => {
            initializeTextMeasurement();

            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            expect(ctx).toBeDefined();
            expect(typeof ctx.measureText).toBe('function');
        });
    });

    describe('mock canvas context', () => {
        beforeEach(() => {
            initializeTextMeasurement();
        });

        it('should measure text and return width', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            ctx.font = '12pt Arial';
            const metrics = ctx.measureText('Hello');

            expect(metrics.width).toBeGreaterThan(0);
            expect(typeof metrics.width).toBe('number');
        });

        it('should return proper TextMetrics interface', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            ctx.font = '10pt serif';
            const metrics = ctx.measureText('Test');

            expect(metrics).toHaveProperty('width');
            expect(metrics).toHaveProperty('actualBoundingBoxAscent');
            expect(metrics).toHaveProperty('actualBoundingBoxDescent');
            expect(metrics).toHaveProperty('actualBoundingBoxLeft');
            expect(metrics).toHaveProperty('actualBoundingBoxRight');
            expect(metrics).toHaveProperty('fontBoundingBoxAscent');
            expect(metrics).toHaveProperty('fontBoundingBoxDescent');
        });

        it('should scale measurements with font size', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            ctx.font = '10pt Arial';
            const metrics10 = ctx.measureText('Test');

            ctx.font = '20pt Arial';
            const metrics20 = ctx.measureText('Test');

            // 20pt should be roughly 2x wider than 10pt
            expect(metrics20.width).toBeGreaterThan(metrics10.width);
            expect(metrics20.width / metrics10.width).toBeCloseTo(2, 0);
        });

        it('should handle px units', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            ctx.font = '16px Arial';
            const metrics = ctx.measureText('Test');

            expect(metrics.width).toBeGreaterThan(0);
        });

        it('should return null for non-2d context', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('webgl');

            expect(ctx).toBeNull();
        });

        it('should handle empty text', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            ctx.font = '12pt Arial';
            const metrics = ctx.measureText('');

            expect(metrics.width).toBe(0);
        });

        it('should handle different font families', () => {
            const canvas = (VexFlowElement as any).getTextMeasurementCanvas();
            const ctx = canvas.getContext('2d');

            ctx.font = '12pt Bravura';
            const bravuraMetrics = ctx.measureText('Test');

            ctx.font = '12pt Arial';
            const arialMetrics = ctx.measureText('Test');

            // Both should return valid measurements
            expect(bravuraMetrics.width).toBeGreaterThan(0);
            expect(arialMetrics.width).toBeGreaterThan(0);
        });
    });

    describe('resetTextMeasurement', () => {
        it('should reset initialization state', () => {
            initializeTextMeasurement();
            expect(isTextMeasurementInitialized()).toBe(true);

            resetTextMeasurement();
            expect(isTextMeasurementInitialized()).toBe(false);
        });
    });
});
