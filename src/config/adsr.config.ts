export interface AdsrConfig {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  curve?: AdsrCurveType;
}
export type AdsrCurveType = (typeof ASDR_CURVE)[keyof typeof ASDR_CURVE];

export const ASDR_CURVE = {
  SNAPPY: 0.0001,
  PUNCHY: 0.001,
  ROBOTIC: 0.1,
  DEFAULT: 0.3,
  LINEAR: 100.0,
} as const;

export const ADSR_PRESETS = {
  default: { attack: 0.01, decay: 0.0, sustain: 1.0, release: 0.5 },
  punchy: { attack: 0.0, decay: 0.0, sustain: 1.0, release: 0.1 },
  snappy: { attack: 0.0, decay: 0.1, sustain: 0.0, release: 0.1 },
  pad: { attack: 0.0, decay: 0.0, sustain: 1.0, release: 2.0 },
  flash: { attack: 0.01, decay: 0.2, sustain: 0.0, release: 0.1 },
  pluck: { attack: 0.0, decay: 0.05, sustain: 0.0, release: 0.1 },
  pulse: {
    attack: 0.25,
    decay: 0.25,
    sustain: 1.0,
    release: 0.25,
    curve: ASDR_CURVE.DEFAULT,
  },
  mechanical: {
    attack: 0.1,
    decay: 0.0,
    sustain: 1.0,
    release: 0.1,
    curve: ASDR_CURVE.LINEAR,
  },
  smooth: {
    attack: 0.1,
    decay: 0.0,
    sustain: 1.0,
    release: 0.1,
    curve: ASDR_CURVE.DEFAULT,
  },
} as const as Record<string, AdsrConfig>;
