# vexflow-react-native-svg

React Native SVG rendering backend for VexFlow. Render music notation and guitar tablature in React Native apps using `react-native-svg`.

## Features

-   🎵 Full VexFlow rendering support in React Native
-   🎨 Interactive elements with press handlers
-   🎯 Style overrides for specific elements by ID or class
-   📦 Clean, declarative API with React hooks
-   🔧 Direct context access for advanced use cases

## Installation

```bash
npm install vexflow-react-native-svg vexflow react-native-svg
# or
bun add vexflow-react-native-svg vexflow react-native-svg
# or
yarn add vexflow-react-native-svg vexflow react-native-svg
```

Make sure you have `react-native-svg` properly linked in your project:

```bash
cd ios && pod install
```

## Quick Start

```tsx
import React from 'react';
import { View } from 'react-native';
import { VexFlowScore } from 'vexflow-react-native-svg';
import { Stave, StaveNote, Voice, Formatter } from 'vexflow';

export function SimpleScore() {
    const handleDraw = (context) => {
        // Create a stave
        const stave = new Stave(10, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        // Create notes
        const notes = [
            new StaveNote({ keys: ['c/4'], duration: 'q' }),
            new StaveNote({ keys: ['d/4'], duration: 'q' }),
            new StaveNote({ keys: ['e/4'], duration: 'q' }),
            new StaveNote({ keys: ['f/4'], duration: 'q' }),
        ];

        // Format and draw
        Formatter.FormatAndDraw(context, stave, notes);
    };

    return (
        <View style={{ flex: 1 }}>
            <VexFlowScore width={450} height={150} onDraw={handleDraw} />
        </View>
    );
}
```

## Interactive Elements

You can make elements interactive by handling press events:

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { VexFlowScore } from 'vexflow-react-native-svg';
import { Stave, StaveNote, Formatter } from 'vexflow';

export function InteractiveScore() {
    const [selectedNote, setSelectedNote] = useState<string | null>(null);

    const handleDraw = (context) => {
        const stave = new Stave(10, 40, 400);
        stave.addClef('treble');
        stave.setContext(context).draw();

        const notes = [
            new StaveNote({ keys: ['c/4'], duration: 'q' }),
            new StaveNote({ keys: ['e/4'], duration: 'q' }),
            new StaveNote({ keys: ['g/4'], duration: 'q' }),
            new StaveNote({ keys: ['c/5'], duration: 'q' }),
        ];

        // Each note gets a unique ID for targeting
        notes.forEach((note, i) => {
            note.setId(`note-${i}`);
        });

        Formatter.FormatAndDraw(context, stave, notes);
    };

    const handleElementPress = (elementId, className, event) => {
        console.log('Pressed element:', elementId, className);
        setSelectedNote(elementId);
    };

    // Highlight selected note
    const elementStyles = selectedNote
        ? {
              [selectedNote]: { fill: '#ff6b6b', stroke: '#ff6b6b' },
          }
        : {};

    return (
        <View>
            <VexFlowScore
                width={450}
                height={150}
                onDraw={handleDraw}
                onElementPress={handleElementPress}
                elementStyles={elementStyles}
            />
            <Text>Selected: {selectedNote || 'None'}</Text>
        </View>
    );
}
```

## Style Overrides

You can override styles for specific elements by ID or class name:

```tsx
<VexFlowScore
    width={450}
    height={150}
    onDraw={handleDraw}
    // Style specific elements by their ID
    elementStyles={{
        'vf-note-0': { fill: 'red' },
        'vf-note-1': { fill: 'blue' },
    }}
    // Style all elements of a certain class
    classStyles={{
        'vf-stavenote': { opacity: 0.8 },
        'vf-beam': { stroke: 'purple' },
    }}
/>
```

## Using the Hook for More Control

For advanced use cases, use the `useVexFlowContext` hook:

```tsx
import React, { useEffect } from 'react';
import { useVexFlowContext } from 'vexflow-react-native-svg';
import { Stave, StaveNote, Formatter } from 'vexflow';

export function AdvancedScore() {
    const { context, render, clear, getElementById, getElementsByClassName } = useVexFlowContext(
        450,
        150
    );

    useEffect(() => {
        // Clear previous drawing
        clear();

        // Draw the score
        const stave = new Stave(10, 40, 400);
        stave.addClef('treble');
        stave.setContext(context).draw();

        const notes = [
            new StaveNote({ keys: ['c/4'], duration: 'q' }),
            new StaveNote({ keys: ['d/4'], duration: 'q' }),
        ];

        Formatter.FormatAndDraw(context, stave, notes);

        // Access rendered elements
        const noteElements = getElementsByClassName('stavenote');
        console.log('Rendered notes:', noteElements.length);
    }, [context, clear, getElementsByClassName]);

    return render();
}
```

## Using ReactNativeSVGContext Directly

For full control, you can use the context directly:

```tsx
import React, { useMemo } from 'react';
import Svg, { G, Path, Rect, Text } from 'react-native-svg';
import { ReactNativeSVGContext } from 'vexflow-react-native-svg';
import { Stave } from 'vexflow';

export function DirectContextUsage() {
    const svgContent = useMemo(() => {
        const context = new ReactNativeSVGContext({ width: 450, height: 150 });

        const stave = new Stave(10, 40, 400);
        stave.addClef('treble');
        stave.setContext(context).draw();

        // Get the SVG tree and render it yourself
        return context.getSVG();
    }, []);

    // Render the SVG tree manually...
    return (
        <Svg width={450} height={150}>
            {/* Custom rendering logic */}
        </Svg>
    );
}
```

## API Reference

### `VexFlowScore`

Main component for rendering VexFlow scores.

| Prop             | Type                                    | Description                      |
| ---------------- | --------------------------------------- | -------------------------------- |
| `width`          | `number`                                | Width of the score in pixels     |
| `height`         | `number`                                | Height of the score in pixels    |
| `onDraw`         | `(context) => void`                     | Callback to draw the score       |
| `onElementPress` | `(elementId, className, event) => void` | Handler for element press events |
| `elementStyles`  | `Record<string, SVGAttributes>`         | Style overrides by element ID    |
| `classStyles`    | `Record<string, SVGAttributes>`         | Style overrides by class name    |

### `useVexFlowContext(width, height, options?)`

Hook for creating and managing a VexFlow context.

Returns:

-   `context` - The `ReactNativeSVGContext` instance
-   `render()` - Function to render the current SVG tree
-   `clear()` - Function to clear the context
-   `getElementById(id)` - Get element by ID
-   `getElementsByClassName(className)` - Get elements by class name

### `ReactNativeSVGContext`

Low-level context class implementing VexFlow's `RenderContext` interface.

```ts
const context = new ReactNativeSVGContext({ width: 450, height: 150 });

// Use like any VexFlow context
stave.setContext(context).draw();

// Access the SVG tree
const svgTree = context.getSVG();

// Access elements by ID or class
const element = context.getElementRegistry().get('vf-note-0');
const notes = context.getElementsByClassName('stavenote');
```

## Font Setup

VexFlow uses SMuFL music fonts for rendering notation symbols. In React Native, fonts must be bundled with your app.

### Required Fonts

-   **Bravura** - Music notation symbols (default)
-   **Academico** - Text labels (default)

### Step 1: Download Fonts

Download from the VexFlow fonts CDN:

-   https://cdn.jsdelivr.net/npm/@vexflow-fonts/bravura/bravura.woff2
-   https://cdn.jsdelivr.net/npm/@vexflow-fonts/academico/academico.woff2

Or use OTF versions for React Native.

### Step 2: Add Fonts to Your Project

**For Expo:**

```json
// app.json
{
    "expo": {
        "plugins": [
            [
                "expo-font",
                {
                    "fonts": ["./assets/fonts/bravura.otf", "./assets/fonts/academico.otf"]
                }
            ]
        ]
    }
}
```

**For bare React Native:**

```js
// react-native.config.js
module.exports = {
    assets: ['./assets/fonts'],
};
```

Then run: `npx react-native-asset`

### Step 3: Load and Configure Fonts

```tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { setVexFlowFonts, VexFlowScore } from 'vexflow-react-native-svg';

export function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                Bravura: require('./assets/fonts/bravura.otf'),
                Academico: require('./assets/fonts/academico.otf'),
            });

            // Configure VexFlow to use loaded fonts
            setVexFlowFonts({
                musicFont: 'Bravura',
                textFont: 'Academico',
            });

            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return <ActivityIndicator />;
    }

    return <MyScore />;
}
```

### Available Fonts

```ts
import { getAvailableMusicFonts, getAvailableTextFonts } from 'vexflow-react-native-svg';

// Music fonts: Bravura, Gonville, Petaluma, Leland, etc.
console.log(getAvailableMusicFonts());

// Text fonts: Academico, Edwin, Roboto Slab, etc.
console.log(getAvailableTextFonts());
```

### Font Utilities API

```ts
import {
    setVexFlowFonts,
    getVexFlowFonts,
    getAvailableMusicFonts,
    getAvailableTextFonts,
    parseFontString,
    VEXFLOW_FONTS,
    DEFAULT_MUSIC_FONT,
    DEFAULT_TEXT_FONT,
} from 'vexflow-react-native-svg';

// Set fonts after loading
setVexFlowFonts({ musicFont: 'Petaluma', textFont: 'Petaluma Script' });

// Get current fonts
const fonts = getVexFlowFonts(); // ['Petaluma', 'Petaluma Script']

// Parse CSS font string (works without DOM)
const fontInfo = parseFontString('bold 12pt Arial');
// { family: 'Arial', size: '12pt', weight: 'bold', style: 'normal' }
```

## Limitations

-   **Text measurement**: React Native doesn't provide direct text measurement. The context uses estimates which may not be pixel-perfect for complex layouts.
-   **Shadows**: SVG filter-based shadows are not fully supported in react-native-svg.
-   **Fonts**: Music fonts must be bundled with your app (no dynamic loading from CDN).
-   **CSS font parsing**: `Font.fromCSSString()` uses DOM and won't work in RN. Use `parseFontString()` instead.

## Troubleshooting

### Notes appear as boxes/squares

Fonts are not loaded. Make sure you've completed the font setup steps above.

### Text appears in wrong font

Call `setVexFlowFonts()` after fonts are loaded but before rendering.

### Elements not responding to press

Make sure elements have IDs set via `note.setId('my-id')` and you're using `onElementPress` prop.

## License

MIT License
