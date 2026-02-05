# ADSR Envelope Generator

A TypeScript implementation of an ADSR (Attack, Decay, Sustain, Release) envelope generator with deltaTime support for frame-independent animation.

## Overview

This ADSR envelope generator is based on the original C++ implementation by Nigel Redmon (EarLevel Engineering) and adapted for TypeScript with deltaTime support for visual elements. It provides smooth, frame-rate independent envelope control suitable for audio synthesis, animation, and any time-based modulation needs.

## Features

- **Frame-independent**: Uses deltaTime for consistent behavior across different frame rates
- **Configurable curves**: Exponential to linear curve shapes for attack and decay/release
- **Preset library**: Common ADSR presets (punchy, snappy, pad, pluck, etc.)
- **TypeScript**: Fully typed for better IDE support and type safety
- **Lightweight**: Zero dependencies, minimal footprint

## Installation

```bash
npm install @your-username/adsr
```

## Usage

### Basic Example

```typescript
import { ADSR, AdsrState } from '@your-username/adsr';

// Create an ADSR envelope
const envelope = new ADSR({
  attack: 0.1, // 100ms attack
  decay: 0.2, // 200ms decay
  sustain: 0.7, // 70% sustain level
  release: 0.5, // 500ms release
});

// Trigger the envelope (note on)
envelope.gate(true);

// In your animation/audio loop
function update(deltaTime: number) {
  const value = envelope.process(deltaTime);
  // Use the envelope value (0.0 to 1.0)
  volume = value * maxVolume;
}

// Release the envelope (note off)
envelope.gate(false);
```

### Using Presets

```typescript
import { ADSR, ADSR_PRESETS } from '@your-username/adsr';

const pluckEnvelope = new ADSR(ADSR_PRESETS.pluck);
const padEnvelope = new ADSR(ADSR_PRESETS.pad);
```

### Custom Curves

```typescript
import { ADSR, ASDR_CURVE } from '@your-username/adsr';

const envelope = new ADSR({
  attack: 0.05,
  decay: 0.1,
  sustain: 0.6,
  release: 0.3,
  curve: ASDR_CURVE.SNAPPY, // More exponential curve
});
```

## API

### Constructor

```typescript
new ADSR(config?: AdsrConfig)
```

**AdsrConfig:**

- `attack: number` - Attack time in seconds
- `decay: number` - Decay time in seconds
- `sustain: number` - Sustain level (0.0 to 1.0)
- `release: number` - Release time in seconds
- `curve?: AdsrCurveType` - Optional curve type for attack and decay/release

### Methods

#### `process(deltaTime: number): number`

Process the envelope for the given time delta. Returns the current envelope value (0.0 to 1.0).

#### `gate(gate: boolean | number): void`

Trigger (true/1) or release (false/0) the envelope.

#### `getOutput(): number`

Get the current envelope output value.

#### `getState(): AdsrState`

Get the current envelope state (IDLE, ATTACK, DECAY, SUSTAIN, or RELEASE).

#### `setAttackTime(seconds: number): void`

Set the attack time.

#### `setDecayTime(seconds: number): void`

Set the decay time.

#### `setSustainLevel(level: number): void`

Set the sustain level (0.0 to 1.0).

#### `setReleaseTime(seconds: number): void`

Set the release time.

#### `reset(): void`

Reset the envelope to its idle state.

## Curve Types

Available curve types from `ASDR_CURVE`:

- `SNAPPY: 0.0001` - Very exponential
- `PUNCHY: 0.001` - Exponential
- `ROBOTIC: 0.1` - Moderately exponential
- `DEFAULT: 0.3` - Balanced
- `LINEAR: 100.0` - Nearly linear

## Presets

Available presets from `ADSR_PRESETS`:

- `default` - General purpose
- `punchy` - Fast attack/release for percussive sounds
- `snappy` - Very short, snappy envelope
- `pad` - Long release for ambient sounds
- `flash` - Quick flash effect
- `pluck` - Plucked string simulation
- `pulse` - Pulsing effect
- `mechanical` - Linear, robotic feel
- `smooth` - Smooth transitions

## Credits

- Original C++ implementation: Nigel Redmon (EarLevel Engineering)
  - http://www.earlevel.com/main/2013/06/01/envelope-generators/
- DeltaTime adaptation: Bart Bralski (2014)
  - https://sourceforge.net/p/processingplayground/code/HEAD/tree/deflemask/ADSR.pde
- TypeScript port: Bernhard Hoffmann

## License

MIT
