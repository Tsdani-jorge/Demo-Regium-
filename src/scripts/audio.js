// Procedural Luxury Cabin Atmosphere Audio Synthesizer (Web Audio API)
// No dependencies, zero external mp3 requests, instant & reliable.

export class CabinAudio {
  constructor(toggleButton) {
    this.button = toggleButton;
    this.isPlaying = false;
    this.ctx = null;
    this.masterGain = null;
    this.oscillators = [];

    if (this.button) {
      this.button.addEventListener('click', () => this.toggle());
    }
  }

  initContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // 1. Sub-bass electric vehicle cabin hum (55Hz drone with lowpass filter)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const subFilter = this.ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(110, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start();
    this.oscillators.push(subOsc);

    // 2. Harmonic warm nocturnal chime drone (110Hz and 165Hz fifth)
    const chordOsc1 = this.ctx.createOscillator();
    chordOsc1.type = 'triangle';
    chordOsc1.frequency.setValueAtTime(110, this.ctx.currentTime);

    const chordOsc2 = this.ctx.createOscillator();
    chordOsc2.type = 'sine';
    chordOsc2.frequency.setValueAtTime(164.8, this.ctx.currentTime); // E3 fifth

    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    chordOsc1.connect(chordGain);
    chordOsc2.connect(chordGain);
    chordGain.connect(this.masterGain);

    chordOsc1.start();
    chordOsc2.start();
    this.oscillators.push(chordOsc1, chordOsc2);
  }

  toggle() {
    if (!this.ctx) {
      this.initContext();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      // Fade in smoothly
      this.masterGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.5);
      this.isPlaying = true;
      if (this.button) this.button.classList.add('audio-active');
    } else {
      // Fade out smoothly
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      this.isPlaying = false;
      if (this.button) this.button.classList.remove('audio-active');
    }
  }
}
