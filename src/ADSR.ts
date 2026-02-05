//  Converted from ADSR.cpp & ADRS.h
//  Original was created by Nigel Redmon on 12/18/12.
//  EarLevel Engineering: earlevel.com
//  Copyright 2012 Nigel Redmon
//  http://www.earlevel.com/main/2013/06/01/envelope-generators/
//  Adapted for Typescript to use deltaTime for Visual Elements from Processing Code by Bart Bralski (2014)
//  https://sourceforge.net/p/processingplayground/code/HEAD/tree/deflemask/ADSR.pde
import { ASDR_CURVE, AdsrConfig } from './config.js';
import { clamp } from './utils.js';

export enum AdsrState {
  IDLE = 'IDLE',
  ATTACK = 'ATTACK',
  DECAY = 'DECAY',
  SUSTAIN = 'SUSTAIN',
  RELEASE = 'RELEASE',
}

//curve exp (small values) to linear (high values)
//curves are in for attack out for releasae

export class ADSR {
  protected state: AdsrState;
  protected output: number;

  // Time constants (in seconds)
  protected attackTime: number;
  protected decayTime: number;
  protected releaseTime: number;

  protected sustainLevel: number;

  // These are the "Target" coefficients for 1 second of time
  protected attackCoef: number;
  protected decayCoef: number;
  protected releaseCoef: number;

  protected attackBase: number;
  protected decayBase: number;
  protected releaseBase: number;

  protected targetRatioA: number;
  protected targetRatioDR: number;

  constructor(
    config: AdsrConfig = {
      attack: 0.01, // Seconds triggert after gate on (note on)
      decay: 0.0, // Seconds
      sustain: 1.0, // 1.0 hold when note on, Level 0.0-1.0
      release: 0.5, // Seconds triggert after gate off (note off)
      curve: undefined, //undefined use target ratios below
    },
  ) {
    this.state = AdsrState.IDLE;
    this.output = 0.0;

    // this.targetRatioA = targetRatioA;
    // this.targetRatioDR = targetRatioDR;
    this.targetRatioA = config.curve ?? ASDR_CURVE.DEFAULT; // ASDR_CURVE.DEFAULT, //shape rise to 1.0
    this.targetRatioDR = config.curve ?? ASDR_CURVE.SNAPPY; // ASDR_CURVE.SNAPPY //shape fallback to 0.0
    this.sustainLevel = config.sustain;

    // Initialize coefficients
    this.attackCoef = 0;
    this.decayCoef = 0;
    this.releaseCoef = 0;
    this.attackBase = 0;
    this.decayBase = 0;
    this.releaseBase = 0;
    this.attackTime = 0;
    this.decayTime = 0;
    this.releaseTime = 0;
    this.releaseBase = 0;

    this.reset();
    this.setAttackTime(config.attack);
    this.setDecayTime(config.decay);
    this.setSustainLevel(config.sustain);
    this.setReleaseTime(config.release);
  }

  public process(deltaTime: number): number {
    // If deltaTime is 0 or huge (lag spike), clamp it to avoid math errors
    if (deltaTime <= 0) return this.output;

    // We calculate the coefficient for THIS specific frame duration.
    // Standard formula for frame-independent decay:
    // factor = BaseFactor ^ deltaTime

    let currentCoef = 0;
    let currentBase = 0;

    switch (this.state) {
      case AdsrState.IDLE:
        return 0;

      case AdsrState.ATTACK:
        // Adjust coef based on how much time passed this frame
        currentCoef = Math.pow(this.attackCoef, deltaTime);
        currentBase = (1.0 + this.targetRatioA) * (1.0 - currentCoef);

        this.output = currentBase + this.output * currentCoef;

        if (this.output >= 1.0) {
          this.output = 1.0;
          this.state = AdsrState.DECAY;
        }
        break;

      case AdsrState.DECAY:
        currentCoef = Math.pow(this.decayCoef, deltaTime);
        currentBase = (this.sustainLevel - this.targetRatioDR) * (1.0 - currentCoef);

        this.output = currentBase + this.output * currentCoef;

        if (this.output <= this.sustainLevel) {
          this.output = this.sustainLevel;
          this.state = AdsrState.SUSTAIN;
        }
        break;

      case AdsrState.SUSTAIN:
        return this.sustainLevel;

      case AdsrState.RELEASE:
        currentCoef = Math.pow(this.releaseCoef, deltaTime);
        currentBase = -this.targetRatioDR * (1.0 - currentCoef);

        this.output = currentBase + this.output * currentCoef;

        if (this.output <= 0.0) {
          this.output = 0.0;
          this.state = AdsrState.IDLE;
        }
        break;
    }
    return this.output;
  }

  public getOutput(): number {
    return this.output;
  }

  public getState(): AdsrState {
    return this.state;
  }

  public gate(gate: boolean | number): void {
    // Determine if gate is open (non-zero or true)
    const isGateOpen = typeof gate === 'number' ? gate !== 0 : gate;

    if (isGateOpen) {
      this.state = AdsrState.ATTACK;
    } else if (this.state !== AdsrState.IDLE) {
      this.state = AdsrState.RELEASE;
    }
  }

  public setAttackTime(seconds: number): void {
    this.attackTime = seconds;
    this.attackCoef = this.calcCoef(seconds, this.targetRatioA);
  }

  public setDecayTime(seconds: number): void {
    seconds = clamp(seconds, 0.0, 1.0);
    this.decayTime = seconds;
    this.decayCoef = this.calcCoef(seconds, this.targetRatioDR);
  }

  public setReleaseTime(seconds: number): void {
    this.releaseTime = seconds;
    this.releaseCoef = this.calcCoef(seconds, this.targetRatioDR);
  }

  public setSustainLevel(level: number): void {
    this.sustainLevel = level;
    // Decay base needs recalculating if sustain changes
    // But since we calculate Base dynamically in process(), we just update coefs if needed
    // Actually, strictly speaking, Base depends on Coef.
    // In this DeltaTime version, we calculate Base inside Process, so just setting level is enough.
  }

  // Calculate the "Per Second" coefficient
  protected calcCoef(rateInSeconds: number, targetRatio: number): number {
    // Prevent divide by zero
    if (rateInSeconds <= 0) return 0;

    // This calculates the factor for 1.0 second of time
    return Math.exp(-Math.log((1.0 + targetRatio) / targetRatio) / rateInSeconds);
  }

  public reset(): void {
    this.state = AdsrState.IDLE;
    this.output = 0.0;
  }
}
