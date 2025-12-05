export class SoundManager {
  private hoverSound: HTMLAudioElement;
  private clickSound: HTMLAudioElement;
  private successSound: HTMLAudioElement;
  private failureSound: HTMLAudioElement;

  constructor() {
    this.hoverSound = new Audio("/hover.mp3");
    this.clickSound = new Audio("/click.mp3");
    this.successSound = new Audio("/success.mp3");
    this.failureSound = new Audio("/fail.mp3");

    this.hoverSound.volume = 0.4;
    this.clickSound.volume = 0.6;
    this.successSound.volume = 0.8;
    this.failureSound.volume = 0.8;
  }

  playHover() {
    this.play(this.hoverSound);
  }

  playClick() {
    this.play(this.clickSound);
  }

  playSuccess() {
    this.play(this.successSound);
  }

  playFail() {
    this.play(this.failureSound);
  }

  private play(audio: HTMLAudioElement) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

export const soundManager = new SoundManager();
