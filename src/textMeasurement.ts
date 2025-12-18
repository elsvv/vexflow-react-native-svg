/**
 * Text measurement utilities for React Native.
 *
 * VexFlow uses canvas.getContext('2d').measureText() for text measurement,
 * which doesn't exist in React Native. This module provides a mock canvas
 * that uses pre-computed glyph metrics from Bravura font metadata for accurate
 * measurement of SMuFL music glyphs.
 */

import { Element as VexFlowElement } from 'vexflow';
import { SMUFL_GLYPH_ADVANCE_WIDTHS } from './smuflGlyphWidths';

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
        isMusicFont: boolean; // Whether this is a SMuFL music font
    }
> = {
    // Music fonts (SMuFL) - use glyph-specific metrics
    bravura: { avgCharWidth: 0.25, ascent: 0.8, descent: 0.2, isMusicFont: true },
    petaluma: { avgCharWidth: 0.25, ascent: 0.8, descent: 0.2, isMusicFont: true },
    gonville: { avgCharWidth: 0.25, ascent: 0.8, descent: 0.2, isMusicFont: true },
    leland: { avgCharWidth: 0.25, ascent: 0.8, descent: 0.2, isMusicFont: true },

    // Text fonts
    academico: { avgCharWidth: 0.55, ascent: 0.8, descent: 0.2, isMusicFont: false },
    arial: { avgCharWidth: 0.52, ascent: 0.76, descent: 0.24, isMusicFont: false },
    'times new roman': { avgCharWidth: 0.48, ascent: 0.78, descent: 0.22, isMusicFont: false },
    serif: { avgCharWidth: 0.5, ascent: 0.78, descent: 0.22, isMusicFont: false },
    'sans-serif': { avgCharWidth: 0.52, ascent: 0.76, descent: 0.24, isMusicFont: false },

    // Default fallback
    default: { avgCharWidth: 0.55, ascent: 0.8, descent: 0.2, isMusicFont: false },
};

/**
 * Check if a character is in the SMuFL Private Use Area (U+E000-U+F8FF).
 */
function isSmuflGlyph(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0xe000 && code <= 0xf8ff;
}

/**
 * Get the advance width for a SMuFL glyph character.
 * Returns the width in staff spaces (1 em = 4 staff spaces in SMuFL).
 * Returns undefined if the glyph is not found in the lookup table.
 */
function getSmuflGlyphWidth(char: string): number | undefined {
    return SMUFL_GLYPH_ADVANCE_WIDTHS[char];
}

/**
 * Get font metrics for a given font family.
 */
function getFontMetrics(fontFamily: string) {
    const normalizedFamily = fontFamily.toLowerCase().split(',')[0].trim();
    return FONT_METRICS[normalizedFamily] ?? FONT_METRICS['default'];
}

/**
 * Check if a font family is a music font (SMuFL-compliant).
 */
function isMusicFont(fontFamily: string): boolean {
    const metrics = getFontMetrics(fontFamily);
    return metrics.isMusicFont;
}

/**
 * Measure text width using SMuFL glyph metrics for music fonts.
 * For SMuFL fonts, each glyph has a specific advance width in staff spaces.
 * The conversion is: width_in_pixels = advance_width * (font_size / 4)
 * This is because in SMuFL, 1 em = 4 staff spaces.
 */
function measureSmuflText(text: string, fontSizeInPixels: number): number {
    let totalWidth = 0;

    for (const char of text) {
        if (isSmuflGlyph(char)) {
            const glyphWidth = getSmuflGlyphWidth(char);
            if (glyphWidth !== undefined) {
                // Convert from staff spaces to pixels
                // In SMuFL: 1 em = 4 staff spaces, so width = advance * (fontSize / 4)
                totalWidth += glyphWidth * (fontSizeInPixels / 4);
            } else {
                // Fallback for unknown SMuFL glyphs - use average width
                totalWidth += 0.25 * fontSizeInPixels;
            }
        } else {
            // Non-SMuFL character - use text font metrics
            totalWidth += 0.55 * fontSizeInPixels;
        }
    }

    return totalWidth;
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

        let width: number;

        // Check if this is a music font and text contains SMuFL glyphs
        if (metrics.isMusicFont && text.length > 0 && isSmuflGlyph(text[0])) {
            // Use precise SMuFL glyph measurements
            width = measureSmuflText(text, fontSize);
        } else {
            // Use character count approximation for text fonts
            width = text.length * fontSize * metrics.avgCharWidth;
        }

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
