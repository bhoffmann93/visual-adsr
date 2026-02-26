# visual-adsr

A frame-independent ADSR envelope generator intended for animating visual elements. Think of it as a shaping function with — attack, decay, sustain, release — known from audio plugins and synths. Adapted for Delta Time from Nigel Redmon's envelope generator explained here: [Envelope generators—ADSR Part 1](https://www.earlevel.com/main/2013/06/01/envelope-generators/) & [Envelope generators—ADSR Part 2](https://www.earlevel.com/main/2013/06/02/envelope-generators-adsr-part-2/)

**[Live demo](https://bhoffmann93.github.io/visual-adsr/example/)**

```
value
 1.0 ┤         ╭─╮
     │        /   \
     │       /     ╲___________
 S   │      /                  ╲
 0.0 ┤_____/                    ╲___
      idle  A    D    sustain    R   idle
```

The envelope outputs a value between `0.0` and `1.0`. Use it as a multiplier, a lerp factor, or map it to whatever property you're animating.

## ToDo

– publish on npm

## Install

```bash
# GitHub (no registry required)
npm install github:bhoffmann93/visual-adsr

```

## Quick start

```typescript
import { ADSR } from 'visual-adsr';

const env = new ADSR({
  attack: 0.1, // seconds to reach peak
  decay: 0.2, // seconds to fall to sustain
  sustain: 0.6, // hold level (0–1) while triggered
  release: 0.8, // seconds to fall back to 0 after release
});

// Trigger on pointer down, release on pointer up
button.addEventListener('pointerdown', () => env.gate(true));
button.addEventListener('pointerup', () => env.gate(false));

let last = 0;
function frame(now: number) {
  const deltaTime = (now - last) / 1000; // seconds
  last = now;
  const value = env.process(deltaTime); // 0.0 → 1.0

  circle.style.transform = `scale(${1 + value * 2})`;
  circle.style.opacity = String(0.3 + value * 0.7);

  requestAnimationFrame(frame);
}

requestAnimationFrame((t) => {
  last = t;
  requestAnimationFrame(frame);
});
```

## API

### `new ADSR(config?)`

```typescript
const env = new ADSR({
  attack: 0.1, // seconds
  decay: 0.2, // seconds
  sustain: 0.7, // 0.0 – 1.0
  release: 0.5, // seconds
  curve: undefined, // optional — see Curves below
});
```

### Methods

| Method                        | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| `process(dt: number): number` | Advance the envelope by `dt` seconds. Returns current value `0–1`. |
| `gate(on: boolean \| number)` | `true` / `1` starts attack. `false` / `0` triggers release.        |
| `getOutput(): number`         | Current envelope value without advancing.                          |
| `getState(): AdsrState`       | `IDLE` · `ATTACK` · `DECAY` · `SUSTAIN` · `RELEASE`                |
| `setAttackTime(s)`            | Update attack duration in seconds.                                 |
| `setDecayTime(s)`             | Update decay duration in seconds.                                  |
| `setSustainLevel(n)`          | Update sustain level `0–1`.                                        |
| `setReleaseTime(s)`           | Update release duration in seconds.                                |
| `reset()`                     | Snap back to idle / zero output.                                   |

### Curves

The `curve` option controls the exponential character of the shape — how snappy or smooth the transitions feel.

```typescript
import { ADSR, ADSR_CURVE } from 'visual-adsr';

const env = new ADSR({
  attack: 0.05,
  decay: 0.3,
  sustain: 0.0,
  release: 0.2,
  curve: ADSR_CURVE.SNAPPY,
});
```

| Constant             | Value    | Feel               |
| -------------------- | -------- | ------------------ |
| `ADSR_CURVE.SNAPPY`  | `0.0001` | Sharp, percussive  |
| `ADSR_CURVE.PUNCHY`  | `0.001`  | Punchy, fast       |
| `ADSR_CURVE.ROBOTIC` | `0.1`    | Moderate           |
| `ADSR_CURVE.DEFAULT` | `0.3`    | Balanced (default) |
| `ADSR_CURVE.LINEAR`  | `100.0`  | Near-linear        |

### Presets

```typescript
import { ADSR, ADSR_PRESETS } from 'visual-adsr';

const env = new ADSR(ADSR_PRESETS.flash);
```

| Preset       | Character                         |
| ------------ | --------------------------------- |
| `default`    | General purpose                   |
| `punchy`     | Instant attack, fast release      |
| `snappy`     | Short pop                         |
| `pad`        | Slow, long release — fades gently |
| `flash`      | Quick flash, no sustain           |
| `pluck`      | Plucked feel                      |
| `pulse`      | Rises and falls with sustain      |
| `mechanical` | Linear, robotic                   |
| `smooth`     | Smooth in/out                     |

## Example: scale a circle on click

See [`example/index.html`](./example/index.html) for a live demo — adjust attack, decay, sustain, and release with sliders and hold a button to trigger the envelope. An envelope curve preview updates in real time.

To run locally:

```bash
npm run build
# then open example/index.html in a browser
```

- Anything that benefits from organic, attack/release timing instead of fixed tweens

## Credits

Based on the C++ envelope generator by Nigel Redmon (EarLevel Engineering):
[earlevel.com — Envelope generators ADSR Code](https://www.earlevel.com/main/2013/06/03/envelope-generators-adsr-code/)

With deltaTime adaptation inspired by Bart Bralski's Processing port (2012). [ADSR.pde](https://sourceforge.net/p/processingplayground/code/HEAD/tree/deflemask/ADSR.pde)

## License

See [LICENSE](./LICENSE)
