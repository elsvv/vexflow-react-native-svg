/**
 * Font download helper for VexFlow React Native.
 *
 * This module provides URLs and metadata for downloading VexFlow-compatible fonts
 * from official sources. Use these URLs to download fonts for your React Native app.
 *
 * The fonts are sourced from:
 * - Bravura: https://github.com/steinbergmedia/bravura (Steinberg)
 * - Petaluma: https://github.com/steinbergmedia/petaluma (Steinberg)
 * - Leland: https://github.com/MuseScoreFonts/Leland (MuseScore)
 * - Gonville: https://www.chiark.greenend.org.uk/~sgtatham/gonville/
 * - Academico: Bundled with VexFlow (text font paired with Bravura)
 *
 * All music fonts follow the SMuFL (Standard Music Font Layout) specification.
 */

/**
 * Font file information
 */
export interface FontFile {
    /** Font file name (e.g., 'Bravura.otf') */
    filename: string;
    /** Direct download URL */
    url: string;
    /** Font format */
    format: 'otf' | 'woff' | 'woff2' | 'ttf';
    /** Font type */
    type: 'music' | 'text';
}

/**
 * Font family information
 */
export interface FontFamily {
    /** Font family name */
    name: string;
    /** Description */
    description: string;
    /** License */
    license: string;
    /** License URL */
    licenseUrl: string;
    /** Source repository or website */
    source: string;
    /** Available font files */
    files: FontFile[];
    /** Metadata JSON URL (for SMuFL fonts) */
    metadataUrl?: string;
}

/**
 * All VexFlow-compatible fonts with download URLs.
 *
 * These are the official sources for fonts used by VexFlow.
 * The URLs point to raw files on GitHub or official CDNs.
 */
export const VEXFLOW_FONT_SOURCES: Record<string, FontFamily> = {
    // ========== MUSIC FONTS (SMuFL) ==========

    bravura: {
        name: 'Bravura',
        description:
            'Reference font for SMuFL. Developed by Steinberg for Dorico notation software.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/steinbergmedia/bravura/blob/master/LICENSE.txt',
        source: 'https://github.com/steinbergmedia/bravura',
        metadataUrl:
            'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/bravura_metadata.json',
        files: [
            {
                filename: 'Bravura.otf',
                url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/Bravura.otf',
                format: 'otf',
                type: 'music',
            },
            {
                filename: 'BravuraText.otf',
                url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/BravuraText.otf',
                format: 'otf',
                type: 'text',
            },
            {
                filename: 'Bravura.woff',
                url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/woff/Bravura.woff',
                format: 'woff',
                type: 'music',
            },
            {
                filename: 'BravuraText.woff',
                url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/woff/BravuraText.woff',
                format: 'woff',
                type: 'text',
            },
        ],
    },

    petaluma: {
        name: 'Petaluma',
        description:
            'Handwritten-style SMuFL font. Developed by Steinberg for a more informal look.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/steinbergmedia/petaluma/blob/master/LICENSE.txt',
        source: 'https://github.com/steinbergmedia/petaluma',
        metadataUrl:
            'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/petaluma_metadata.json',
        files: [
            {
                filename: 'Petaluma.otf',
                url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/otf/Petaluma.otf',
                format: 'otf',
                type: 'music',
            },
            {
                filename: 'PetalumaText.otf',
                url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/otf/PetalumaText.otf',
                format: 'otf',
                type: 'text',
            },
            {
                filename: 'PetalumaScript.otf',
                url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/otf/PetalumaScript.otf',
                format: 'otf',
                type: 'text',
            },
            {
                filename: 'Petaluma.woff',
                url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/woff/Petaluma.woff',
                format: 'woff',
                type: 'music',
            },
            {
                filename: 'PetalumaText.woff',
                url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/woff/PetalumaText.woff',
                format: 'woff',
                type: 'text',
            },
            {
                filename: 'PetalumaScript.woff',
                url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/woff/PetalumaScript.woff',
                format: 'woff',
                type: 'text',
            },
        ],
    },

    leland: {
        name: 'Leland',
        description: 'Default music font in MuseScore 3.6+. SMuFL-compliant.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/MuseScoreFonts/Leland/blob/main/LICENSE.txt',
        source: 'https://github.com/MuseScoreFonts/Leland',
        metadataUrl:
            'https://raw.githubusercontent.com/MuseScoreFonts/Leland/main/leland_metadata.json',
        files: [
            {
                filename: 'Leland.otf',
                url: 'https://raw.githubusercontent.com/MuseScoreFonts/Leland/main/Leland.otf',
                format: 'otf',
                type: 'music',
            },
            {
                filename: 'LelandText.otf',
                url: 'https://raw.githubusercontent.com/MuseScoreFonts/Leland/main/LelandText.otf',
                format: 'otf',
                type: 'text',
            },
        ],
    },

    gonville: {
        name: 'Gonville',
        description: 'Classic VexFlow font designed by Simon Tatham. Used by VexFlow since 2010.',
        license: 'MIT-style',
        licenseUrl: 'https://git.tartarus.org/?p=simon/gonville.git;a=blob_plain;f=LICENCE;hb=HEAD',
        source: 'https://www.chiark.greenend.org.uk/~sgtatham/gonville/',
        files: [
            {
                filename: 'Gonville.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/gonville/Gonville.otf',
                format: 'otf',
                type: 'music',
            },
        ],
    },

    gootville: {
        name: 'Gootville',
        description: 'SMuFL-compliant font from MuseScore community.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/MuseScoreFonts/Gootville/blob/main/LICENSE.txt',
        source: 'https://github.com/MuseScoreFonts/Gootville',
        files: [
            {
                filename: 'Gootville.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/gootville/Gootville.otf',
                format: 'otf',
                type: 'music',
            },
            {
                filename: 'GootvilleText.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/gootvilletext/GootvilleText.otf',
                format: 'otf',
                type: 'text',
            },
        ],
    },

    leipzig: {
        name: 'Leipzig',
        description: 'SMuFL font developed for Verovio. Clean, traditional engraving style.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/rism-digital/leipzig/blob/main/LICENSE.txt',
        source: 'https://github.com/rism-digital/leipzig',
        files: [
            {
                filename: 'Leipzig.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/leipzig/Leipzig.otf',
                format: 'otf',
                type: 'music',
            },
        ],
    },

    sebastian: {
        name: 'Sebastian',
        description: 'SMuFL-compliant music font.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/fkretlow/sebastian/blob/master/LICENSE',
        source: 'https://github.com/fkretlow/sebastian',
        files: [
            {
                filename: 'Sebastian.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/sebastian/Sebastian.otf',
                format: 'otf',
                type: 'music',
            },
            {
                filename: 'SebastianText.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/sebastiantext/SebastianText.otf',
                format: 'otf',
                type: 'text',
            },
        ],
    },

    // ========== TEXT FONTS ==========

    academico: {
        name: 'Academico',
        description: 'Text font designed to pair with Bravura. Based on Century Schoolbook.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/AcademicNotation/academico/blob/master/LICENSE',
        source: 'https://github.com/AcademicNotation/academico',
        files: [
            {
                filename: 'Academico.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/academico/Academico.otf',
                format: 'otf',
                type: 'text',
            },
        ],
    },

    edwin: {
        name: 'Edwin',
        description: 'Text font from MuseScore, designed to pair with Leland.',
        license: 'SIL Open Font License 1.1',
        licenseUrl: 'https://github.com/MuseScoreFonts/Edwin/blob/main/LICENSE.txt',
        source: 'https://github.com/MuseScoreFonts/Edwin',
        files: [
            {
                filename: 'Edwin-Roman.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/edwin/Edwin-Roman.otf',
                format: 'otf',
                type: 'text',
            },
            {
                filename: 'Edwin-Bold.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/edwin/Edwin-Bold.otf',
                format: 'otf',
                type: 'text',
            },
            {
                filename: 'Edwin-Italic.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/edwin/Edwin-Italic.otf',
                format: 'otf',
                type: 'text',
            },
            {
                filename: 'Edwin-BdIta.otf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/edwin/Edwin-BdIta.otf',
                format: 'otf',
                type: 'text',
            },
        ],
    },

    robotoslab: {
        name: 'Roboto Slab',
        description: 'Google font, good for modern notation styles.',
        license: 'Apache License 2.0',
        licenseUrl: 'https://fonts.google.com/specimen/Roboto+Slab/about',
        source: 'https://fonts.google.com/specimen/Roboto+Slab',
        files: [
            {
                filename: 'RobotoSlab-Regular.ttf',
                url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/robotoslab/RobotoSlab-Regular.ttf',
                format: 'ttf',
                type: 'text',
            },
        ],
    },
};

/**
 * Recommended font combinations for VexFlow.
 * Each combination includes a music font and its paired text font.
 */
export const RECOMMENDED_FONT_COMBINATIONS = [
    {
        name: 'Bravura + Academico',
        description: 'Default VexFlow combination. Professional engraving style.',
        musicFont: 'bravura',
        textFont: 'academico',
    },
    {
        name: 'Petaluma + PetalumaText',
        description: 'Handwritten style. Great for jazz and informal scores.',
        musicFont: 'petaluma',
        textFont: 'petaluma', // Uses PetalumaText from the same family
    },
    {
        name: 'Leland + Edwin',
        description: 'MuseScore default. Clean, modern look.',
        musicFont: 'leland',
        textFont: 'edwin',
    },
    {
        name: 'Gonville',
        description: 'Classic VexFlow font. Lightweight, good for web.',
        musicFont: 'gonville',
        textFont: 'academico',
    },
];

/**
 * Get all font files for a specific font family.
 */
export function getFontFiles(fontName: string): FontFile[] {
    const family = VEXFLOW_FONT_SOURCES[fontName.toLowerCase()];
    return family?.files ?? [];
}

/**
 * Get only music font files for a specific font family.
 */
export function getMusicFontFiles(fontName: string): FontFile[] {
    return getFontFiles(fontName).filter((f) => f.type === 'music');
}

/**
 * Get only text font files for a specific font family.
 */
export function getTextFontFiles(fontName: string): FontFile[] {
    return getFontFiles(fontName).filter((f) => f.type === 'text');
}

/**
 * Get all available font family names.
 */
export function getAvailableFontFamilies(): string[] {
    return Object.keys(VEXFLOW_FONT_SOURCES);
}

/**
 * Get the metadata JSON URL for a SMuFL font (if available).
 * The metadata contains glyph bounding boxes and advance widths.
 */
export function getFontMetadataUrl(fontName: string): string | undefined {
    return VEXFLOW_FONT_SOURCES[fontName.toLowerCase()]?.metadataUrl;
}

/**
 * Get all font download URLs as a flat list.
 * Useful for batch downloading all fonts.
 */
export function getAllFontUrls(): Array<{ family: string; file: FontFile }> {
    const result: Array<{ family: string; file: FontFile }> = [];

    for (const [familyName, family] of Object.entries(VEXFLOW_FONT_SOURCES)) {
        for (const file of family.files) {
            result.push({ family: familyName, file });
        }
    }

    return result;
}

/**
 * Get the essential fonts needed for basic VexFlow rendering.
 * This is the minimum set of fonts required.
 */
export function getEssentialFonts(): Array<{ family: string; file: FontFile }> {
    const essentialFamilies = ['bravura', 'academico'];
    return getAllFontUrls().filter((item) => essentialFamilies.includes(item.family));
}

/**
 * Generate a download script for Node.js/Bun.
 * This creates a script that can be run to download all fonts.
 */
export function generateDownloadScript(outputDir: string = './fonts'): string {
    const lines: string[] = [
        '#!/usr/bin/env node',
        '/**',
        ' * VexFlow Font Downloader',
        ' * Generated by @vexflow/react-native-svg',
        ' *',
        ' * Run with: node download-fonts.js',
        ' * Or with Bun: bun download-fonts.js',
        ' */',
        '',
        "const fs = require('fs');",
        "const path = require('path');",
        "const https = require('https');",
        "const http = require('http');",
        '',
        `const OUTPUT_DIR = '${outputDir}';`,
        '',
        'const FONTS = [',
    ];

    for (const { family, file } of getAllFontUrls()) {
        lines.push(`  { family: '${family}', filename: '${file.filename}', url: '${file.url}' },`);
    }

    lines.push('];');
    lines.push('');
    lines.push(`// Metadata files for SMuFL fonts`);
    lines.push('const METADATA = [');

    for (const [name, family] of Object.entries(VEXFLOW_FONT_SOURCES)) {
        if (family.metadataUrl) {
            lines.push(
                `  { family: '${name}', filename: '${name}_metadata.json', url: '${family.metadataUrl}' },`
            );
        }
    }

    lines.push('];');
    lines.push('');
    lines.push(`
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(\`Failed to download \${url}: \${response.statusCode}\`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log('Downloading VexFlow fonts...');
  console.log(\`Output directory: \${path.resolve(OUTPUT_DIR)}\`);
  console.log('');
  
  // Download fonts
  for (const font of FONTS) {
    const familyDir = path.join(OUTPUT_DIR, font.family);
    if (!fs.existsSync(familyDir)) {
      fs.mkdirSync(familyDir, { recursive: true });
    }
    
    const dest = path.join(familyDir, font.filename);
    console.log(\`Downloading \${font.family}/\${font.filename}...\`);
    
    try {
      await download(font.url, dest);
      console.log(\`  ✓ Saved to \${dest}\`);
    } catch (err) {
      console.error(\`  ✗ Failed: \${err.message}\`);
    }
  }
  
  // Download metadata
  console.log('');
  console.log('Downloading font metadata...');
  
  for (const meta of METADATA) {
    const familyDir = path.join(OUTPUT_DIR, meta.family);
    if (!fs.existsSync(familyDir)) {
      fs.mkdirSync(familyDir, { recursive: true });
    }
    
    const dest = path.join(familyDir, meta.filename);
    console.log(\`Downloading \${meta.family}/\${meta.filename}...\`);
    
    try {
      await download(meta.url, dest);
      console.log(\`  ✓ Saved to \${dest}\`);
    } catch (err) {
      console.error(\`  ✗ Failed: \${err.message}\`);
    }
  }
  
  console.log('');
  console.log('Done!');
  console.log('');
  console.log('To use these fonts in React Native:');
  console.log('1. Copy the font files to your assets folder');
  console.log('2. Link the fonts using react-native.config.js or expo-font');
  console.log('3. Load the fonts before rendering VexFlow content');
}

main().catch(console.error);
`);

    return lines.join('\n');
}

/**
 * Print font information to console.
 * Useful for debugging and documentation.
 */
export function printFontInfo(): void {
    console.log('VexFlow Font Sources');
    console.log('====================\n');

    for (const [name, family] of Object.entries(VEXFLOW_FONT_SOURCES)) {
        console.log(`${family.name}`);
        console.log(`  Description: ${family.description}`);
        console.log(`  License: ${family.license}`);
        console.log(`  Source: ${family.source}`);
        console.log(`  Files:`);
        for (const file of family.files) {
            console.log(`    - ${file.filename} (${file.format}, ${file.type})`);
        }
        if (family.metadataUrl) {
            console.log(`  Metadata: ${family.metadataUrl}`);
        }
        console.log('');
    }
}
