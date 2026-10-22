// Web Audio API Ambient Sound Synthesizer
// Clean, zero-external-dependency, offline-ready ambient audio generator

type AmbientMode = "rain" | "lofi" | "clock" | "off";

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentMode: AmbientMode = "off";
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public stop() {
    this.currentMode = "off";
    this.activeNodes.forEach((item) => {
      if (typeof item === "number") {
        clearInterval(item);
      } else {
        try {
          if ("stop" in item && typeof (item as AudioScheduledSourceNode).stop === "function") {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.activeNodes = [];
  }

  public play(mode: AmbientMode) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentMode === mode) {
      this.stop();
      return;
    }

    this.stop();
    this.currentMode = mode;

    if (mode === "rain") {
      this.startRain();
    } else if (mode === "lofi") {
      this.startLoFiPad();
    } else if (mode === "clock") {
      this.startClock();
    }
  }

  public getMode(): AmbientMode {
    return this.currentMode;
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle dorm window rain filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);
  }

  private startLoFiPad() {
    if (!this.ctx || !this.masterGain) return;

    // Peaceful ambient chord frequencies: C3, G3, D#4, A#4
    const freqs = [130.81, 196.0, 311.13, 466.16];
    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      // subtle detune for warm analog feel
      osc.frequency.setValueAtTime(f + (idx * 0.4 - 0.6), this.ctx.currentTime);
      osc.connect(filter);
      osc.start();
      this.activeNodes.push(osc);
    });

    filter.connect(padGain);
    padGain.connect(this.masterGain);
    this.activeNodes.push(filter, padGain);
  }

  private startClock() {
    if (!this.ctx || !this.masterGain) return;

    const playTick = () => {
      if (!this.ctx || !this.masterGain || this.currentMode !== "clock") return;
      try {
        const osc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.03);

        tickGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

        osc.connect(tickGain);
        tickGain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch {
        // ignore
      }
    };

    playTick();
    const intervalId = window.setInterval(playTick, 1000);
    this.activeNodes.push(intervalId);
  }

  public playGentleChime() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528Hz healing tone
      osc.frequency.exponentialRampToValueAtTime(1056, this.ctx.currentTime + 0.3);

      chimeGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    } catch {
      // ignore
    }
  }
}

export const audioEngine =
  typeof window !== "undefined" ? new AmbientAudioEngine() : ({} as AmbientAudioEngine);
