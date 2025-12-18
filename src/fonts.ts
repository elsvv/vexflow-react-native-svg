/**
 * Font utilities for React Native.
 *
 * VexFlow uses browser APIs (FontFace, document.fonts) for font loading which
 * don't exist in React Native. This module provides utilities to configure
 * fonts in a React Native environment.
 *
 * In React Native, fonts must be:
 * 1. Bundled with the app (in assets folder)
 * 2. Linked via react-native.config.js or expo app.json
 * 3. Loaded before rendering (using expo-font or react-native asset linking)
 */

import { VexFlow, Font } from 'vexflow';

/**
 * Font files information for VexFlow music fonts.
 * These are the fonts that VexFlow supports.
 */
export const VEXFLOW_FONTS = {
  // Music notation fonts (SMuFL)
  music: {
    Bravura: 'bravura/bravura.woff2',
    Gonville: 'gonville/gonville.woff2',
    Petaluma: 'petaluma/petaluma.woff2',
    Gootville: 'gootville/gootville.woff2',
    Leland: 'leland/leland.woff2',
    Leipzig: 'leipzig/leipzig.woff2',
    Sebastian: 'sebastian/sebastian.woff2',
    'Finale Ash': 'finaleash/finaleash.woff2',
    'Finale Broadway': 'finalebroadway/finalebroadway.woff2',
    'Finale Jazz': 'finalejazz/finalejazz.woff2',
    'Finale Maestro': 'finalemaestro/finalemaestro.woff2',
    MuseJazz: 'musejazz/musejazz.woff2',
    Nepomuk: 'nepomuk/nepomuk.woff2',
  },
  // Text fonts
  text: {
    Academico: 'academico/academico.woff2',
    Edwin: 'edwin/edwin-roman.woff2',
    'Roboto Slab': 'robotoslab/robotoslab-regular-400.woff2',
    'Bravura Text': 'bravuratext/bravuratext.woff2',
    'Petaluma Text': 'petalumatext/petalumatext.woff2',
    'Petaluma Script': 'petalumascript/petalumascript.woff2',
    'Gootville Text': 'gootvilletext/gootvilletext.woff2',
    'Leland Text': 'lelandtext/lelandtext.woff2',
    'Sebastian Text': 'sebastiantext/sebastiantext.woff2',
    'MuseJazz Text': 'musejazztext/musejazztext.woff2',
  },
} as const;

/**
 * Default font combination used by VexFlow.
 */
export const DEFAULT_MUSIC_FONT = 'Bravura';
export const DEFAULT_TEXT_FONT = 'Academico';

/**
 * Font configuration for React Native.
 * Use this to tell VexFlow which fonts to use.
 */
export interface FontConfig {
  /** Music notation font (e.g., 'Bravura', 'Petaluma') */
  musicFont: string;
  /** Text font (e.g., 'Academico', 'Petaluma Script') */
  textFont: string;
}

/**
 * Configure VexFlow to use specific fonts.
 * Call this after your fonts are loaded in React Native.
 *
 * @example
 * ```tsx
 * // In your app initialization (e.g., App.tsx)
 * import { useFonts } from 'expo-font';
 * import { setVexFlowFonts } from '@vexflow/react-native-svg';
 *
 * function App() {
 *   const [fontsLoaded] = useFonts({
 *     'Bravura': require('./assets/fonts/bravura.otf'),
 *     'Academico': require('./assets/fonts/academico.otf'),
 *   });
 *
 *   useEffect(() => {
 *     if (fontsLoaded) {
 *       setVexFlowFonts({ musicFont: 'Bravura', textFont: 'Academico' });
 *     }
 *   }, [fontsLoaded]);
 *
 *   if (!fontsLoaded) return null;
 *   return <MyScore />;
 * }
 * ```
 */
export function setVexFlowFonts(config: FontConfig): void {
  VexFlow.setFonts(config.musicFont, config.textFont);
}

/**
 * Get the currently configured VexFlow fonts.
 */
export function getVexFlowFonts(): string[] {
  return VexFlow.getFonts();
}

/**
 * Get the list of all available music notation fonts.
 */
export function getAvailableMusicFonts(): string[] {
  return Object.keys(VEXFLOW_FONTS.music);
}

/**
 * Get the list of all available text fonts.
 */
export function getAvailableTextFonts(): string[] {
  return Object.keys(VEXFLOW_FONTS.text);
}

/**
 * Parse a CSS font string without using DOM.
 * This is a replacement for Font.fromCSSString() which uses document.createElement.
 *
 * @param cssFontShorthand CSS font string (e.g., 'bold 12pt Arial')
 * @returns Parsed font info
 *
 * @example
 * ```ts
 * const font = parseFontString('italic bold 14pt "Times New Roman"');
 * // { family: 'Times New Roman', size: '14pt', weight: 'bold', style: 'italic' }
 * ```
 */
export function parseFontString(cssFontShorthand: string): {
  family: string;
  size: string;
  weight: string;
  style: string;
} {
  // Default values
  let family = 'Arial';
  let size = '10pt';
  let weight = 'normal';
  let style = 'normal';

  const trimmed = cssFontShorthand.trim();
  if (!trimmed) {
    return { family, size, weight, style };
  }

  // CSS font shorthand format: [style] [variant] [weight] [stretch] size[/line-height] family
  // We need to parse this carefully

  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (const char of trimmed) {
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      current += char;
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) {
    parts.push(current);
  }

  // Find size (contains pt, px, em, etc.)
  const sizeRegex = /^(\d+(?:\.\d+)?)(pt|px|em|%|rem|vh|vw)$/i;
  let sizeIndex = -1;

  for (let i = 0; i < parts.length; i++) {
    if (sizeRegex.test(parts[i])) {
      sizeIndex = i;
      size = parts[i];
      break;
    }
  }

  // Everything before size could be style/weight
  if (sizeIndex > 0) {
    for (let i = 0; i < sizeIndex; i++) {
      const part = parts[i].toLowerCase();
      if (part === 'italic' || part === 'oblique') {
        style = part;
      } else if (part === 'bold' || /^\d{3}$/.test(part)) {
        weight = parts[i];
      }
    }
  }

  // Everything after size is family
  if (sizeIndex >= 0 && sizeIndex < parts.length - 1) {
    family = parts
      .slice(sizeIndex + 1)
      .join(' ')
      .replace(/["']/g, '');
  }

  return { family, size, weight, style };
}

/**
 * Font requirements information for users setting up their React Native app.
 */
export const FONT_SETUP_INFO = `
React Native Font Setup for VexFlow
====================================

VexFlow requires music notation fonts (SMuFL fonts) to render properly.
In React Native, you must bundle these fonts with your app.

1. Download fonts from: https://cdn.jsdelivr.net/npm/@vexflow-fonts/

2. Add to your project:
   - For Expo: Add to assets/fonts/ and configure in app.json
   - For bare RN: Add to assets/fonts/ and link via react-native.config.js

3. Load fonts before rendering:

   // Using expo-font
   import { useFonts } from 'expo-font';
   
   const [loaded] = useFonts({
     'Bravura': require('./assets/fonts/bravura.otf'),
     'Academico': require('./assets/fonts/academico.otf'),
   });

4. Configure VexFlow:
   import { setVexFlowFonts } from '@vexflow/react-native-svg';
   
   setVexFlowFonts({ 
     musicFont: 'Bravura', 
     textFont: 'Academico' 
   });

Minimum required fonts:
- Bravura (music notation)
- Academico (text)

Optional fonts for different styles:
- Petaluma (handwritten look)
- Gonville (classic engraving)
- Leland (MuseScore style)
`;
