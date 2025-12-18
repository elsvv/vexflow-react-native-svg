import { describe, it, expect } from 'vitest';
import {
    VEXFLOW_FONT_SOURCES,
    RECOMMENDED_FONT_COMBINATIONS,
    getFontFiles,
    getMusicFontFiles,
    getTextFontFiles,
    getAvailableFontFamilies,
    getFontMetadataUrl,
    getAllFontUrls,
    getEssentialFonts,
    generateDownloadScript,
} from '../src/fontDownloader';

describe('fontDownloader', () => {
    describe('VEXFLOW_FONT_SOURCES', () => {
        it('should contain bravura font', () => {
            expect(VEXFLOW_FONT_SOURCES.bravura).toBeDefined();
            expect(VEXFLOW_FONT_SOURCES.bravura.name).toBe('Bravura');
            expect(VEXFLOW_FONT_SOURCES.bravura.files.length).toBeGreaterThan(0);
        });

        it('should contain academico font', () => {
            expect(VEXFLOW_FONT_SOURCES.academico).toBeDefined();
            expect(VEXFLOW_FONT_SOURCES.academico.name).toBe('Academico');
        });

        it('should contain petaluma font', () => {
            expect(VEXFLOW_FONT_SOURCES.petaluma).toBeDefined();
            expect(VEXFLOW_FONT_SOURCES.petaluma.name).toBe('Petaluma');
        });

        it('should have valid URLs for all font files', () => {
            for (const [name, family] of Object.entries(VEXFLOW_FONT_SOURCES)) {
                for (const file of family.files) {
                    expect(file.url).toMatch(/^https?:\/\//);
                    expect(file.filename).toBeTruthy();
                    expect(['otf', 'woff', 'woff2', 'ttf']).toContain(file.format);
                    expect(['music', 'text']).toContain(file.type);
                }
            }
        });

        it('should have metadata URLs for SMuFL fonts', () => {
            expect(VEXFLOW_FONT_SOURCES.bravura.metadataUrl).toBeDefined();
            expect(VEXFLOW_FONT_SOURCES.bravura.metadataUrl).toMatch(/\.json$/);
            expect(VEXFLOW_FONT_SOURCES.petaluma.metadataUrl).toBeDefined();
        });
    });

    describe('RECOMMENDED_FONT_COMBINATIONS', () => {
        it('should have at least one combination', () => {
            expect(RECOMMENDED_FONT_COMBINATIONS.length).toBeGreaterThan(0);
        });

        it('should have Bravura + Academico as first combination', () => {
            const first = RECOMMENDED_FONT_COMBINATIONS[0];
            expect(first.musicFont).toBe('bravura');
            expect(first.textFont).toBe('academico');
        });

        it('should reference valid font families', () => {
            const availableFamilies = getAvailableFontFamilies();
            for (const combo of RECOMMENDED_FONT_COMBINATIONS) {
                expect(availableFamilies).toContain(combo.musicFont);
            }
        });
    });

    describe('getFontFiles', () => {
        it('should return files for bravura', () => {
            const files = getFontFiles('bravura');
            expect(files.length).toBeGreaterThan(0);
        });

        it('should be case-insensitive', () => {
            const files1 = getFontFiles('Bravura');
            const files2 = getFontFiles('BRAVURA');
            const files3 = getFontFiles('bravura');
            expect(files1).toEqual(files2);
            expect(files2).toEqual(files3);
        });

        it('should return empty array for unknown font', () => {
            const files = getFontFiles('unknown-font');
            expect(files).toEqual([]);
        });
    });

    describe('getMusicFontFiles', () => {
        it('should return only music font files', () => {
            const files = getMusicFontFiles('bravura');
            expect(files.length).toBeGreaterThan(0);
            for (const file of files) {
                expect(file.type).toBe('music');
            }
        });
    });

    describe('getTextFontFiles', () => {
        it('should return only text font files', () => {
            const files = getTextFontFiles('bravura');
            for (const file of files) {
                expect(file.type).toBe('text');
            }
        });

        it('should return text files for academico', () => {
            const files = getTextFontFiles('academico');
            expect(files.length).toBeGreaterThan(0);
        });
    });

    describe('getAvailableFontFamilies', () => {
        it('should return array of font family names', () => {
            const families = getAvailableFontFamilies();
            expect(Array.isArray(families)).toBe(true);
            expect(families).toContain('bravura');
            expect(families).toContain('academico');
            expect(families).toContain('petaluma');
        });
    });

    describe('getFontMetadataUrl', () => {
        it('should return metadata URL for bravura', () => {
            const url = getFontMetadataUrl('bravura');
            expect(url).toBeDefined();
            expect(url).toMatch(/bravura_metadata\.json/);
        });

        it('should return undefined for fonts without metadata', () => {
            const url = getFontMetadataUrl('gonville');
            expect(url).toBeUndefined();
        });
    });

    describe('getAllFontUrls', () => {
        it('should return flat list of all font files', () => {
            const allUrls = getAllFontUrls();
            expect(allUrls.length).toBeGreaterThan(0);

            for (const item of allUrls) {
                expect(item.family).toBeTruthy();
                expect(item.file).toBeDefined();
                expect(item.file.url).toMatch(/^https?:\/\//);
            }
        });
    });

    describe('getEssentialFonts', () => {
        it('should return bravura and academico fonts', () => {
            const essential = getEssentialFonts();
            const families = essential.map((e) => e.family);

            expect(families).toContain('bravura');
            expect(families).toContain('academico');
        });

        it('should not include optional fonts', () => {
            const essential = getEssentialFonts();
            const families = essential.map((e) => e.family);

            expect(families).not.toContain('petaluma');
            expect(families).not.toContain('leland');
        });
    });

    describe('generateDownloadScript', () => {
        it('should generate valid JavaScript', () => {
            const script = generateDownloadScript('./fonts');
            expect(script).toContain('#!/usr/bin/env node');
            expect(script).toContain('const fs = require');
            expect(script).toContain('const https = require');
        });

        it('should include font URLs', () => {
            const script = generateDownloadScript('./fonts');
            expect(script).toContain('Bravura.otf');
            expect(script).toContain('githubusercontent.com');
        });

        it('should use provided output directory', () => {
            const script = generateDownloadScript('./custom/path');
            expect(script).toContain('./custom/path');
        });
    });
});
