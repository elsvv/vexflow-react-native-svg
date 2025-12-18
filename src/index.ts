/**
 * @vexflow/react-native-svg
 *
 * React Native SVG rendering backend for VexFlow.
 * Render music notation in React Native apps using react-native-svg.
 */

export { ReactNativeSVGContext } from './ReactNativeSVGContext';
export { VexFlowScore, useVexFlowContext } from './VexFlowScore';
export {
  setVexFlowFonts,
  getVexFlowFonts,
  getAvailableMusicFonts,
  getAvailableTextFonts,
  parseFontString,
  VEXFLOW_FONTS,
  DEFAULT_MUSIC_FONT,
  DEFAULT_TEXT_FONT,
  FONT_SETUP_INFO,
} from './fonts';
export type { FontConfig } from './fonts';
export type {
  SVGAttributes,
  SVGElementNode,
  ContextState,
  ReactNativeSVGContextOptions,
  VexFlowScoreProps,
  InteractiveProps,
  SVGPressHandler,
  ElementInfo,
} from './types';
