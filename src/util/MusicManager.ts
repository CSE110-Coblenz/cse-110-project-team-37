export class MusicManager {
  private readonly audio: HTMLAudioElement;

  constructor(src: string) {
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.5;

    // Try muted autoplay first
    this.audio.muted = true;
    this.audio
      .play()
      .then(() => {
        // After autoplay is granted, unmute
        setTimeout(() => {
          this.audio.muted = false;
        }, 150);
      })
      .catch(() => {
        // As fallback: wait for first user interaction
        const resume = () => {
          this.audio.muted = false;
          this.audio.play().catch(() => {});
          window.removeEventListener("click", resume);
          window.removeEventListener("keydown", resume);
        };
        window.addEventListener("click", resume);
        window.addEventListener("keydown", resume);
      });
  }
}
