#!/usr/bin/env node
/**
 * VexFlow Font Downloader
 *
 * Downloads all fonts needed for VexFlow rendering in React Native.
 *
 * Usage:
 *   node scripts/download-fonts.js [output-dir]
 *   bun scripts/download-fonts.js [output-dir]
 *
 * Default output directory: ./assets/fonts
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_DIR = process.argv[2] || './assets/fonts';

/**
 * All VexFlow-compatible fonts with download URLs.
 * Sources:
 * - Bravura: https://github.com/steinbergmedia/bravura
 * - Petaluma: https://github.com/steinbergmedia/petaluma
 * - Leland: https://github.com/MuseScoreFonts/Leland
 * - Others: https://github.com/vexflow/vexflow-fonts
 */
const FONTS = [
    // ========== BRAVURA (Default VexFlow music font) ==========
    {
        family: 'bravura',
        filename: 'Bravura.otf',
        url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/Bravura.otf',
        type: 'music',
        required: true,
    },
    {
        family: 'bravura',
        filename: 'BravuraText.otf',
        url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/otf/BravuraText.otf',
        type: 'text',
        required: false,
    },

    // ========== ACADEMICO (Default VexFlow text font) ==========
    {
        family: 'academico',
        filename: 'Academico.otf',
        url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/academico/Academico.otf',
        type: 'text',
        required: true,
    },

    // ========== PETALUMA (Handwritten style) ==========
    {
        family: 'petaluma',
        filename: 'Petaluma.otf',
        url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/otf/Petaluma.otf',
        type: 'music',
        required: false,
    },
    {
        family: 'petaluma',
        filename: 'PetalumaText.otf',
        url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/otf/PetalumaText.otf',
        type: 'text',
        required: false,
    },
    {
        family: 'petaluma',
        filename: 'PetalumaScript.otf',
        url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/otf/PetalumaScript.otf',
        type: 'text',
        required: false,
    },

    // ========== LELAND (MuseScore default) ==========
    {
        family: 'leland',
        filename: 'Leland.otf',
        url: 'https://raw.githubusercontent.com/MuseScoreFonts/Leland/main/Leland.otf',
        type: 'music',
        required: false,
    },
    {
        family: 'leland',
        filename: 'LelandText.otf',
        url: 'https://raw.githubusercontent.com/MuseScoreFonts/Leland/main/LelandText.otf',
        type: 'text',
        required: false,
    },

    // ========== GONVILLE (Classic VexFlow font) ==========
    {
        family: 'gonville',
        filename: 'Gonville.otf',
        url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/gonville/Gonville.otf',
        type: 'music',
        required: false,
    },

    // ========== GOOTVILLE ==========
    {
        family: 'gootville',
        filename: 'Gootville.otf',
        url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/gootville/Gootville.otf',
        type: 'music',
        required: false,
    },

    // ========== LEIPZIG ==========
    {
        family: 'leipzig',
        filename: 'Leipzig.otf',
        url: 'https://raw.githubusercontent.com/vexflow/vexflow-fonts/main/leipzig/Leipzig.otf',
        type: 'music',
        required: false,
    },
];

/**
 * Font metadata files (contain glyph bounding boxes and advance widths)
 */
const METADATA = [
    {
        family: 'bravura',
        filename: 'bravura_metadata.json',
        url: 'https://raw.githubusercontent.com/steinbergmedia/bravura/master/redist/bravura_metadata.json',
        required: true,
    },
    {
        family: 'petaluma',
        filename: 'petaluma_metadata.json',
        url: 'https://raw.githubusercontent.com/steinbergmedia/petaluma/master/redist/petaluma_metadata.json',
        required: false,
    },
    {
        family: 'leland',
        filename: 'leland_metadata.json',
        url: 'https://raw.githubusercontent.com/MuseScoreFonts/Leland/main/leland_metadata.json',
        required: false,
    },
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, (response) => {
            // Follow redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlinkSync(dest);
                download(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        });

        request.on('error', (err) => {
            file.close();
            fs.unlink(dest, () => {}); // Delete partial file
            reject(err);
        });

        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function main() {
    const args = process.argv.slice(2);
    const onlyRequired = args.includes('--required') || args.includes('-r');
    const includeMetadata = !args.includes('--no-metadata');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║           VexFlow Font Downloader                          ║');
    console.log('║           for React Native                                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`Output directory: ${path.resolve(OUTPUT_DIR)}`);
    console.log(`Mode: ${onlyRequired ? 'Required fonts only' : 'All fonts'}`);
    console.log('');

    ensureDir(OUTPUT_DIR);

    const fontsToDownload = onlyRequired ? FONTS.filter((f) => f.required) : FONTS;
    const metadataToDownload = includeMetadata
        ? onlyRequired
            ? METADATA.filter((m) => m.required)
            : METADATA
        : [];

    let successCount = 0;
    let failCount = 0;

    // Download fonts
    console.log('📦 Downloading fonts...');
    console.log('');

    for (const font of fontsToDownload) {
        const familyDir = path.join(OUTPUT_DIR, font.family);
        ensureDir(familyDir);

        const dest = path.join(familyDir, font.filename);
        const label = `${font.family}/${font.filename}`;

        process.stdout.write(`  ⏳ ${label}...`);

        try {
            await download(font.url, dest);
            const stats = fs.statSync(dest);
            const sizeKB = (stats.size / 1024).toFixed(1);
            console.log(`\r  ✅ ${label} (${sizeKB} KB)`);
            successCount++;
        } catch (err) {
            console.log(`\r  ❌ ${label} - ${err.message}`);
            failCount++;
        }
    }

    // Download metadata
    if (metadataToDownload.length > 0) {
        console.log('');
        console.log('📋 Downloading font metadata...');
        console.log('');

        for (const meta of metadataToDownload) {
            const familyDir = path.join(OUTPUT_DIR, meta.family);
            ensureDir(familyDir);

            const dest = path.join(familyDir, meta.filename);
            const label = `${meta.family}/${meta.filename}`;

            process.stdout.write(`  ⏳ ${label}...`);

            try {
                await download(meta.url, dest);
                const stats = fs.statSync(dest);
                const sizeKB = (stats.size / 1024).toFixed(1);
                console.log(`\r  ✅ ${label} (${sizeKB} KB)`);
                successCount++;
            } catch (err) {
                console.log(`\r  ❌ ${label} - ${err.message}`);
                failCount++;
            }
        }
    }

    // Summary
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`✅ Downloaded: ${successCount} files`);
    if (failCount > 0) {
        console.log(`❌ Failed: ${failCount} files`);
    }
    console.log('');

    // Usage instructions
    console.log('📱 Next steps for React Native:');
    console.log('');
    console.log('   For Expo:');
    console.log('   1. Install expo-font: npx expo install expo-font');
    console.log('   2. Load fonts in your app:');
    console.log('');
    console.log("      import { useFonts } from 'expo-font';");
    console.log('');
    console.log('      const [fontsLoaded] = useFonts({');
    console.log(`        'Bravura': require('${OUTPUT_DIR}/bravura/Bravura.otf'),`);
    console.log(`        'Academico': require('${OUTPUT_DIR}/academico/Academico.otf'),`);
    console.log('      });');
    console.log('');
    console.log('   For bare React Native:');
    console.log('   1. Add fonts to react-native.config.js:');
    console.log('');
    console.log('      module.exports = {');
    console.log('        assets: ["./assets/fonts"],');
    console.log('      };');
    console.log('');
    console.log('   2. Run: npx react-native-asset');
    console.log('');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
