export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.heartbeatOscillator = null;
    this.heartbeatGain = null;
    this.lfo = null;
    this.baseRate = 1; // 1 Hz = 60 BPM
    this.isPlaying = false;
  }

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a synthesized heartbeat sound using an oscillator and LFO
    this.heartbeatGain = this.ctx.createGain();
    this.heartbeatGain.gain.value = 0;
    this.heartbeatGain.connect(this.ctx.destination);

    this.heartbeatOscillator = this.ctx.createOscillator();
    this.heartbeatOscillator.type = 'sine';
    this.heartbeatOscillator.frequency.value = 50; // Low frequency for bass thump

    // LFO to modulate the gain to create a pulse effect
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'square';
    this.lfo.frequency.value = this.baseRate; // Start at 60 BPM (1 pulse/sec)

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 1; // Depth of pulse
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.heartbeatGain.gain);

    this.heartbeatOscillator.connect(this.heartbeatGain);
    
    this.heartbeatOscillator.start();
    this.lfo.start();
    this.isPlaying = true;
  }

  // Speed factor normally between 1 (resting) and 3 (high intensity)
  updateHeartbeat(speedFactor, volumeFactor) {
    if (!this.ctx || !this.isPlaying) return;
    
    // Smoothly transition the LFO frequency (heartbeat speed)
    const targetFreq = this.baseRate * speedFactor;
    this.lfo.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);

    // Smoothly transition volume
    this.heartbeatGain.gain.setTargetAtTime(volumeFactor * 0.8, this.ctx.currentTime, 0.5);
  }

  stop() {
    if (this.heartbeatGain) {
     this.heartbeatGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
    }
  }

  playThud() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export const audioEngine = new AudioEngine();
