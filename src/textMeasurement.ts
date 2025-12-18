/**
 * Text measurement utilities for React Native.
 *
 * VexFlow uses canvas.getContext('2d').measureText() for text measurement,
 * which doesn't exist in React Native. This module provides a mock canvas
 * that approximates text measurements based on font metrics.
 */

import { Element as VexFlowElement } from 'vexflow';

/**
 * Font metrics for common VexFlow fonts.
 * These are approximate values based on typical font characteristics.
 */
const FONT_METRICS: Record<
    string,
    {
        avgCharWidth: number; // Average character width as ratio of font size
        ascent: number; // Ascent as ratio of font size
        descent: number; // Descent as ratio of font size
    }
> = {
    // Music fonts (SMuFL) - these have very different metrics
    bravura: { avgCharWidth: 1.0, ascent: 0.8, descent: 0.2 },
    petaluma: { avgCharWidth: 1.0, ascent: 0.8, descent: 0.2 },
    gonville: { avgCharWidth: 1.0, ascent: 0.8, descent: 0.2 },
    leland: { avgCharWidth: 1.0, ascent: 0.8, descent: 0.2 },

    // Text fonts
    academico: { avgCharWidth: 0.55, ascent: 0.8, descent: 0.2 },
    arial: { avgCharWidth: 0.52, ascent: 0.76, descent: 0.24 },
    'times new roman': { avgCharWidth: 0.48, ascent: 0.78, descent: 0.22 },
    serif: { avgCharWidth: 0.5, ascent: 0.78, descent: 0.22 },
    'sans-serif': { avgCharWidth: 0.52, ascent: 0.76, descent: 0.24 },

    // Default fallback
    default: { avgCharWidth: 0.55, ascent: 0.8, descent: 0.2 },
};

/**
 * Get font metrics for a given font family.
 */
function getFontMetrics(fontFamily: string) {
    const normalizedFamily = fontFamily.toLowerCase().split(',')[0].trim();
    return FONT_METRICS[normalizedFamily] ?? FONT_METRICS['default'];
}

/**
 * Parse font size from CSS font string or font-size value.
 */
function parseFontSize(font: string): number {
    // Try to extract size from CSS font shorthand or font-size
    const match = font.match(/(\d+(?:\.\d+)?)\s*(px|pt|em)?/i);
    if (match) {
        const size = parseFloat(match[1]);
        const unit = (match[2] ?? 'pt').toLowerCase();

        switch (unit) {
            case 'px':
                return size;
            case 'pt':
                return size * 1.333; // 1pt ≈ 1.333px
            case 'em':
                return size * 16; // Assume 16px base
            default:
                return size;
        }
    }
    return 10; // Default fallback
}

/**
 * Parse font family from CSS font string.
 */
function parseFontFamily(font: string): string {
    // CSS font shorthand: [style] [variant] [weight] [size]/[line-height] family
    // Try to extract family (last part after size)
    const parts = font.split(/\s+/);

    // Look for the part after size (which contains px, pt, em, etc.)
    for (let i = 0; i < parts.length; i++) {
        if (/\d+(px|pt|em)/i.test(parts[i])) {
            // Everything after this is the font family
            return (
                parts
                    .slice(i + 1)
                    .join(' ')
                    .replace(/["']/g, '') || 'serif'
            );
        }
    }

    // If no size found, assume it's just a font family
    return font.replace(/["']/g, '') || 'serif';
}

/**
 * TextMetrics interface matching what VexFlow expects from measureText.
 */
interface MockTextMetrics {
    width: number;
    actualBoundingBoxLeft: number;
    actualBoundingBoxRight: number;
    actualBoundingBoxAscent: number;
    actualBoundingBoxDescent: number;
    fontBoundingBoxAscent: number;
    fontBoundingBoxDescent: number;
    alphabeticBaseline: number;
    emHeightAscent: number;
    emHeightDescent: number;
}

/**
 * Mock 2D context that provides text measurement.
 */
class MockCanvasContext {
    font: string = '10pt serif';

    measureText(text: string): MockTextMetrics {
        const fontSize = parseFontSize(this.font);
        const fontFamily = parseFontFamily(this.font);
        const metrics = getFontMetrics(fontFamily);

        const width = text.length * fontSize * metrics.avgCharWidth;
        const ascent = fontSize * metrics.ascent;
        const descent = fontSize * metrics.descent;

        return {
            width,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: width,
            actualBoundingBoxAscent: ascent,
            actualBoundingBoxDescent: descent,
            fontBoundingBoxAscent: ascent,
            fontBoundingBoxDescent: descent,
            alphabeticBaseline: 0,
            emHeightAscent: ascent,
            emHeightDescent: descent,
        };
    }
}

/**
 * Mock canvas that provides a 2D context for text measurement.
 */
class MockCanvas {
    private context = new MockCanvasContext();

    getContext(contextId: string): MockCanvasContext | null {
        if (contextId === '2d') {
            return this.context;
        }
        return null;
    }
}

// Store our mock canvas instance
let mockCanvasInstance: MockCanvas | null = null;

/**
 * Initialize VexFlow text measurement for React Native.
 *
 * This function MUST be called before rendering any VexFlow content.
 * It sets up a mock canvas that VexFlow uses for measuring text dimensions.
 *
 * @example
 * ```tsx
 * import { initializeTextMeasurement } from '@vexflow/react-native-svg';
 *
 * // Call once at app startup, before any VexFlow rendering
 * initializeTextMeasurement();
 *
 * // Or in a component
 * function App() {
 *   useEffect(() => {
 *     initializeTextMeasurement();
 *   }, []);
 *
 *   return <MyScore />;
 * }
 * ```
 */
export function initializeTextMeasurement(): void {
    if (!mockCanvasInstance) {
        mockCanvasInstance = new MockCanvas();
    }

    // Always set the mock canvas - VexFlow may have been imported before us
    // and created its own canvas, so we need to override it
    // TypeScript doesn't know about this static method, so we need to cast
    (VexFlowElement as any).setTextMeasurementCanvas(mockCanvasInstance as any);
}

/**
 * Check if text measurement has been initialized.
 */
export function isTextMeasurementInitialized(): boolean {
    return mockCanvasInstance !== null;
}

/**
 * Reset text measurement initialization state.
 * Useful for testing or re-initialization.
 */
export function resetTextMeasurement(): void {
    mockCanvasInstance = null;
}
