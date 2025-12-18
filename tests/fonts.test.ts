/**
 * Tests for font utilities
 */

import { describe, it, expect } from 'vitest';
import {
  parseFontString,
  getAvailableMusicFonts,
  getAvailableTextFonts,
  VEXFLOW_FONTS,
  DEFAULT_MUSIC_FONT,
  DEFAULT_TEXT_FONT,
} from '../src/fonts';

describe('Font utilities', () => {
  describe('parseFontString', () => {
    it('should parse simple font string', () => {
      const result = parseFontString('12pt Arial');
      expect(result.size).toBe('12pt');
      expect(result.family).toBe('Arial');
      expect(result.weight).toBe('normal');
      expect(result.style).toBe('normal');
    });

    it('should parse bold font', () => {
      const result = parseFontString('bold 14pt Helvetica');
      expect(result.size).toBe('14pt');
      expect(result.family).toBe('Helvetica');
      expect(result.weight).toBe('bold');
      expect(result.style).toBe('normal');
    });

    it('should parse italic font', () => {
      const result = parseFontString('italic 10pt Georgia');
      expect(result.size).toBe('10pt');
      expect(result.family).toBe('Georgia');
      expect(result.weight).toBe('normal');
      expect(result.style).toBe('italic');
    });

    it('should parse bold italic font', () => {
      const result = parseFontString('italic bold 16pt Verdana');
      expect(result.size).toBe('16pt');
      expect(result.family).toBe('Verdana');
      expect(result.weight).toBe('bold');
      expect(result.style).toBe('italic');
    });

    it('should parse font with quoted family name', () => {
      const result = parseFontString('12pt "Times New Roman"');
      expect(result.size).toBe('12pt');
      expect(result.family).toBe('Times New Roman');
    });

    it('should parse font with single quoted family name', () => {
      const result = parseFontString("14px 'Comic Sans MS'");
      expect(result.size).toBe('14px');
      expect(result.family).toBe('Comic Sans MS');
    });

    it('should parse font with numeric weight', () => {
      const result = parseFontString('700 12pt Arial');
      expect(result.weight).toBe('700');
    });

    it('should handle different units', () => {
      expect(parseFontString('16px Arial').size).toBe('16px');
      expect(parseFontString('1em Arial').size).toBe('1em');
      expect(parseFontString('100% Arial').size).toBe('100%');
    });

    it('should return defaults for empty string', () => {
      const result = parseFontString('');
      expect(result.family).toBe('Arial');
      expect(result.size).toBe('10pt');
      expect(result.weight).toBe('normal');
      expect(result.style).toBe('normal');
    });

    it('should handle multi-word family without quotes', () => {
      const result = parseFontString('12pt Roboto Slab');
      expect(result.family).toBe('Roboto Slab');
    });
  });

  describe('VEXFLOW_FONTS', () => {
    it('should have music fonts', () => {
      expect(VEXFLOW_FONTS.music).toHaveProperty('Bravura');
      expect(VEXFLOW_FONTS.music).toHaveProperty('Petaluma');
      expect(VEXFLOW_FONTS.music).toHaveProperty('Gonville');
    });

    it('should have text fonts', () => {
      expect(VEXFLOW_FONTS.text).toHaveProperty('Academico');
      expect(VEXFLOW_FONTS.text).toHaveProperty('Edwin');
    });
  });

  describe('getAvailableMusicFonts', () => {
    it('should return list of music fonts', () => {
      const fonts = getAvailableMusicFonts();
      expect(fonts).toContain('Bravura');
      expect(fonts).toContain('Petaluma');
      expect(fonts.length).toBeGreaterThan(5);
    });
  });

  describe('getAvailableTextFonts', () => {
    it('should return list of text fonts', () => {
      const fonts = getAvailableTextFonts();
      expect(fonts).toContain('Academico');
      expect(fonts.length).toBeGreaterThan(3);
    });
  });

  describe('DEFAULT_MUSIC_FONT', () => {
    it('should be Bravura', () => {
      expect(DEFAULT_MUSIC_FONT).toBe('Bravura');
    });
  });

  describe('DEFAULT_TEXT_FONT', () => {
    it('should be Academico', () => {
      expect(DEFAULT_TEXT_FONT).toBe('Academico');
    });
  });
});
