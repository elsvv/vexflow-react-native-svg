/**
 * SMuFL glyph advance widths from Bravura font metadata.
 *
 * These values are in "staff spaces" where 1 em = 4 staff spaces.
 * To convert to pixels: width_in_pixels = advance_width * (font_size_in_pixels / 4)
 *
 * Source: https://github.com/steinbergmedia/bravura/blob/master/redist/bravura_metadata.json
 *
 * This file contains advance widths for glyphs commonly used by VexFlow.
 * The map uses Unicode characters as keys (the actual glyph characters).
 */

/**
 * Map of SMuFL glyph characters to their advance widths in staff spaces.
 */
export const SMUFL_GLYPH_ADVANCE_WIDTHS: Record<string, number> = {
    // ========== ACCIDENTALS ==========
    // Standard accidentals (most commonly used)
    '\ue262': 0.996, // accidentalSharp
    '\ue260': 0.904, // accidentalFlat
    '\ue261': 0.672, // accidentalNatural
    '\ue263': 1.0, // accidentalDoubleSharp
    '\ue264': 1.652, // accidentalDoubleFlat
    '\ue26a': 1.268, // accidentalThreeQuarterTonesSharpStein (one and a half sharp)
    '\ue280': 0.908, // accidentalQuarterToneFlatStein (half flat)
    '\ue282': 0.716, // accidentalQuarterToneSharpStein (half sharp)

    // Accidental variants
    '\ue265': 1.652, // accidentalDoubleFlatJoinedStems
    '\ue266': 1.376, // accidentalLargeDoubleSharp
    '\ue267': 0.996, // accidentalSharpOneHorizontalStroke
    '\ue268': 0.996, // accidentalSharpReversed
    '\ue269': 2.076, // accidentalSharpSharp

    // Parentheses for accidentals
    '\ue26c': 0.564, // accidentalParensLeft
    '\ue26d': 0.564, // accidentalParensRight
    '\ue26e': 0.308, // accidentalBracketLeft
    '\ue26f': 0.308, // accidentalBracketRight

    // Microtonal accidentals
    '\ue270': 0.904, // accidentalFlatSmall (for key signatures)
    '\ue275': 1.044, // accidentalSharpSmall (for key signatures)
    '\ue272': 0.76, // accidentalNaturalSmall

    // ========== NOTEHEADS ==========
    // Standard noteheads
    '\ue0a0': 1.18, // noteheadDoubleWhole
    '\ue0a1': 1.18, // noteheadDoubleWholeSquare
    '\ue0a2': 1.18, // noteheadWhole
    '\ue0a3': 1.18, // noteheadHalf
    '\ue0a4': 1.18, // noteheadBlack (quarter note and smaller)

    // X noteheads
    '\ue0a9': 1.328, // noteheadXWhole
    '\ue0aa': 1.328, // noteheadXHalf
    '\ue0ab': 1.12, // noteheadXBlack

    // Diamond noteheads
    '\ue0d8': 1.128, // noteheadDiamondWhole
    '\ue0d9': 1.128, // noteheadDiamondHalf
    '\ue0db': 0.996, // noteheadDiamondBlack

    // Triangle noteheads
    '\ue0bc': 1.312, // noteheadTriangleUpWhole
    '\ue0bd': 1.312, // noteheadTriangleUpHalf
    '\ue0be': 1.12, // noteheadTriangleUpBlack

    // Slash noteheads (rhythmic notation)
    '\ue100': 1.688, // noteheadSlashWhiteWhole
    '\ue101': 1.688, // noteheadSlashWhiteHalf
    '\ue102': 1.552, // noteheadSlashHorizontalEnds
    '\ue103': 1.552, // noteheadSlashVerticalEnds

    // ========== CLEFS ==========
    '\ue050': 2.684, // gClef (treble clef)
    '\ue05c': 2.536, // cClef (alto/tenor clef)
    '\ue062': 2.756, // fClef (bass clef)
    '\ue06a': 1.14, // unpitchedPercussionClef1
    '\ue06b': 1.14, // unpitchedPercussionClef2
    '\ue06d': 1.636, // 6stringTabClef
    '\ue06e': 1.084, // 4stringTabClef

    // Clef change (small clefs)
    '\ue07a': 1.792, // gClefChange
    '\ue07b': 1.692, // cClefChange
    '\ue07c': 1.836, // fClefChange

    // ========== TIME SIGNATURES ==========
    '\ue080': 1.688, // timeSig0
    '\ue081': 1.084, // timeSig1
    '\ue082': 1.44, // timeSig2
    '\ue083': 1.356, // timeSig3
    '\ue084': 1.52, // timeSig4
    '\ue085': 1.356, // timeSig5
    '\ue086': 1.44, // timeSig6
    '\ue087': 1.316, // timeSig7
    '\ue088': 1.44, // timeSig8
    '\ue089': 1.44, // timeSig9
    '\ue08a': 2.0, // timeSigCommon (C)
    '\ue08b': 2.0, // timeSigCutCommon (cut C)
    '\ue08c': 1.0, // timeSigPlus
    '\ue08e': 0.752, // timeSigPlusSmall
    '\ue097': 1.64, // timeSigParensLeft
    '\ue098': 1.64, // timeSigParensRight

    // ========== RESTS ==========
    '\ue4e1': 2.352, // restMaxima
    '\ue4e2': 1.176, // restLonga
    '\ue4e3': 1.0, // restDoubleWhole
    '\ue4e4': 1.0, // restWhole
    '\ue4e5': 1.0, // restHalf
    '\ue4e6': 0.752, // restQuarter
    '\ue4e7': 1.0, // rest8th
    '\ue4e8': 1.112, // rest16th
    '\ue4e9': 1.352, // rest32nd
    '\ue4ea': 1.496, // rest64th
    '\ue4eb': 1.652, // rest128th
    '\ue4ec': 1.892, // rest256th
    '\ue4ed': 2.132, // rest512th
    '\ue4ee': 2.288, // rest1024th

    // ========== FLAGS ==========
    '\ue240': 0.796, // flag8thUp
    '\ue241': 1.0, // flag8thDown
    '\ue242': 0.796, // flag16thUp
    '\ue243': 1.0, // flag16thDown
    '\ue244': 0.896, // flag32ndUp
    '\ue245': 1.0, // flag32ndDown
    '\ue246': 0.896, // flag64thUp
    '\ue247': 1.0, // flag64thDown
    '\ue248': 0.896, // flag128thUp
    '\ue249': 1.0, // flag128thDown
    '\ue24a': 0.896, // flag256thUp
    '\ue24b': 1.0, // flag256thDown
    '\ue24c': 0.896, // flag512thUp
    '\ue24d': 1.0, // flag512thDown
    '\ue24e': 0.896, // flag1024thUp
    '\ue24f': 1.0, // flag1024thDown

    // Grace note flags
    '\ue250': 0.748, // flagGrace8thUp
    '\ue251': 1.08, // flagGrace8thDown
    '\ue252': 0.748, // flagGrace16thUp
    '\ue253': 1.08, // flagGrace16thDown
    '\ue254': 0.748, // flagGrace32ndUp
    '\ue255': 1.08, // flagGrace32ndDown

    // ========== ARTICULATIONS ==========
    '\ue4a0': 0.668, // articAccentAbove
    '\ue4a1': 0.668, // articAccentBelow
    '\ue4a2': 0.472, // articStaccatoAbove
    '\ue4a3': 0.472, // articStaccatoBelow
    '\ue4a4': 0.472, // articTenutoAbove
    '\ue4a5': 0.472, // articTenutoBelow
    '\ue4a6': 0.472, // articStaccatissimoAbove
    '\ue4a7': 0.472, // articStaccatissimoBelow
    '\ue4a8': 0.388, // articStaccatissimoWedgeAbove
    '\ue4a9': 0.388, // articStaccatissimoWedgeBelow
    '\ue4aa': 0.532, // articStaccatissimoStrokeAbove
    '\ue4ab': 0.532, // articStaccatissimoStrokeBelow
    '\ue4ac': 0.668, // articMarcatoAbove
    '\ue4ad': 0.668, // articMarcatoBelow
    '\ue4ae': 0.668, // articMarcatoStaccatoAbove
    '\ue4af': 0.668, // articMarcatoStaccatoBelow
    '\ue4b0': 0.668, // articAccentStaccatoAbove
    '\ue4b1': 0.668, // articAccentStaccatoBelow
    '\ue4b2': 0.472, // articTenutoStaccatoAbove
    '\ue4b3': 0.472, // articTenutoStaccatoBelow
    '\ue4b4': 0.472, // articTenutoAccentAbove
    '\ue4b5': 0.472, // articTenutoAccentBelow
    '\ue4b6': 0.668, // articStressAbove
    '\ue4b7': 0.668, // articStressBelow
    '\ue4b8': 0.668, // articUnstressAbove
    '\ue4b9': 0.668, // articUnstressBelow

    // ========== DYNAMICS ==========
    '\ue520': 1.164, // dynamicPiano (p)
    '\ue521': 1.236, // dynamicMezzo (m)
    '\ue522': 1.264, // dynamicForte (f)
    '\ue523': 1.168, // dynamicRinforzando (r)
    '\ue524': 0.936, // dynamicSforzando (s)
    '\ue525': 1.236, // dynamicZ (z)
    '\ue526': 0.868, // dynamicNiente (n)

    // ========== ORNAMENTS ==========
    '\ue560': 1.804, // ornamentTrill
    '\ue566': 1.384, // ornamentTurn
    '\ue567': 1.384, // ornamentTurnInverted
    '\ue568': 1.5, // ornamentTurnSlash
    '\ue569': 1.5, // ornamentTurnUp
    '\ue56c': 1.132, // ornamentMordent
    '\ue56d': 1.544, // ornamentMordentInverted (upper mordent / pralltriller)
    '\ue56e': 2.0, // ornamentTremblement
    '\ue587': 1.384, // ornamentShake3

    // ========== HOLDS AND PAUSES ==========
    '\ue4c0': 1.896, // fermataAbove
    '\ue4c1': 1.896, // fermataBelow
    '\ue4c2': 1.556, // fermataShortAbove
    '\ue4c3': 1.556, // fermataShortBelow
    '\ue4c4': 2.32, // fermataLongAbove
    '\ue4c5': 2.32, // fermataLongBelow
    '\ue4c6': 2.32, // fermataVeryLongAbove
    '\ue4c7': 2.32, // fermataVeryLongBelow
    '\ue4d1': 1.0, // breathMarkComma
    '\ue4d2': 0.768, // breathMarkTick
    '\ue4d3': 0.528, // breathMarkUpbow
    '\ue4d5': 1.24, // caesura
    '\ue4d6': 1.24, // caesuraThick

    // ========== REPEATS ==========
    '\ue040': 0.5, // repeatDot
    '\ue046': 1.624, // segno
    '\ue047': 1.808, // coda
    '\ue048': 2.572, // codaSquare

    // ========== BARLINES ==========
    '\ue030': 0.16, // barlineSingle
    '\ue031': 0.64, // barlineDouble
    '\ue032': 0.64, // barlineFinal

    // ========== DOTS ==========
    '\ue1e7': 0.4, // augmentationDot

    // ========== STEMS ==========
    '\ue210': 0.0, // stem

    // ========== TIES AND SLURS ==========
    '\ue1fd': 0.3, // tieShort
    '\ue1fe': 0.6, // tieMedium
    '\ue1ff': 0.9, // tieLong

    // ========== TUPLET NUMBERS ==========
    '\ue880': 0.708, // tuplet0
    '\ue881': 0.464, // tuplet1
    '\ue882': 0.616, // tuplet2
    '\ue883': 0.58, // tuplet3
    '\ue884': 0.652, // tuplet4
    '\ue885': 0.58, // tuplet5
    '\ue886': 0.616, // tuplet6
    '\ue887': 0.56, // tuplet7
    '\ue888': 0.616, // tuplet8
    '\ue889': 0.616, // tuplet9
    '\ue88a': 0.32, // tupletColon

    // ========== PEDAL MARKS ==========
    '\ue650': 2.856, // keyboardPedalPed
    '\ue655': 1.364, // keyboardPedalUp

    // ========== TREMOLOS ==========
    '\ue220': 0.952, // tremolo1
    '\ue221': 0.952, // tremolo2
    '\ue222': 0.952, // tremolo3
    '\ue223': 0.952, // tremolo4
    '\ue224': 0.952, // tremolo5
    '\ue225': 1.064, // tremoloDivisiDots2
    '\ue226': 1.56, // tremoloDivisiDots3
    '\ue227': 2.064, // tremoloDivisiDots4
    '\ue228': 2.56, // tremoloDivisiDots6

    // ========== STRING TECHNIQUES ==========
    '\ue610': 0.84, // stringsDownBow
    '\ue612': 0.752, // stringsUpBow
    '\ue614': 0.804, // stringsHarmonic

    // ========== BRASS TECHNIQUES ==========
    '\ue5e0': 1.056, // brassLiftShort
    '\ue5d0': 1.436, // brassMuteClosed (+ symbol)
    '\ue5d1': 1.224, // brassMuteOpen (o symbol)

    // ========== OCTAVE LINES ==========
    '\ue510': 1.424, // ottava (8va)
    '\ue511': 1.076, // ottavaAlta (8va alta)
    '\ue512': 1.176, // ottavaBassa (8vb)
    '\ue513': 2.272, // quindicesima (15ma)
    '\ue514': 1.924, // quindicesimaAlta
    '\ue515': 2.024, // quindicesimaBassa

    // ========== NOTEHEADS PARENTHESES ==========
    '\ue0f5': 0.38, // noteheadParenthesisLeft
    '\ue0f6': 0.38, // noteheadParenthesisRight
};
