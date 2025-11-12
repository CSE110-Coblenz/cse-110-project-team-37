import Konva from "konva";

/**
 * Configuration options for creating a timer
 */
export type TimerConfig = {
  // position
  x: number;
  y: number;

  // defalts to 0
  initialTime?: number;

  /** Font size for the timer text (optional, defaults to 24) */
  // defaults to 24
  fontSize?: number;

  // defaults to white
  textColor?: string;

  // defaults to semi-transparent black
  backgroundColor?: string;

  // padding around the text, defaults to 10
  padding?: number;

  // defaults to 5
  borderRadius?: number;

  // Callback function called every second with current time
  onTick?: (elapsedSeconds: number) => void;

  // Callback function called when timer stops
  onStop?: (finalTime: number) => void;
};

/**
 * Timer component that can be added to any screen
 * Provides methods to start, pause, resume, stop, and reset the timer
 */
export class Timer {
  private readonly group: Konva.Group;
  private readonly background: Konva.Rect;
  private readonly timeText: Konva.Text;

  private elapsedSeconds: number = 0;
  private isRunning: boolean = false;
  private intervalId: number | null = null;

  private readonly config: Required<TimerConfig>;

  constructor(config: TimerConfig) {
    // Set defaults for optional config values
    this.config = {
      initialTime: 0,
      fontSize: 24,
      textColor: "white",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: 10,
      borderRadius: 5,
      onTick: () => {},
      onStop: () => {},
      ...config,
    };

    this.elapsedSeconds = this.config.initialTime;

    // Create the visual components
    this.group = new Konva.Group({
      x: this.config.x,
      y: this.config.y,
    });

    // Create background rectangle
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      fill: this.config.backgroundColor,
      cornerRadius: this.config.borderRadius,
      stroke: "black",
      strokeWidth: 1,
    });

    // Create time text
    this.timeText = new Konva.Text({
      x: this.config.padding,
      y: this.config.padding,
      text: this.formatTime(this.elapsedSeconds),
      fontSize: this.config.fontSize,
      fontFamily: "Arial",
      fill: this.config.textColor,
    });

    // Size background to fit text
    this.updateBackgroundSize();

    this.group.add(this.background);
    this.group.add(this.timeText);
  }

  /**
   * Formats seconds into MM:SS format
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Updates the background size to fit the text with padding
   */
  private updateBackgroundSize(): void {
    const textWidth = this.timeText.width();
    const textHeight = this.timeText.height();
    this.background.width(textWidth + this.config.padding * 2);
    this.background.height(textHeight + this.config.padding * 2);
  }

  /**
   * Updates the displayed time
   */
  private updateDisplay(): void {
    this.timeText.text(this.formatTime(this.elapsedSeconds));
    this.updateBackgroundSize();
    this.group.getLayer()?.batchDraw();
  }

  /**
   * Tick function called every second when timer is running
   */
  private tick(): void {
    this.elapsedSeconds++;
    this.updateDisplay();
    this.config.onTick(this.elapsedSeconds);
  }

  /**
   * Starts the timer from the current elapsed time
   * If already running, this has no effect
   */
  public start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  /**
   * Pauses the timer, keeping the current elapsed time
   * Can be resumed with resume() or start()
   */
  public pause(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Resumes the timer from where it was paused
   * Alias for start() - both work the same way
   */
  public resume(): void {
    this.start();
  }

  /**
   * Stops the timer and calls the onStop callback
   * Does not reset the elapsed time
   */
  public stop(): void {
    this.pause();
    this.config.onStop(this.elapsedSeconds);
  }

  /**
   * Resets the timer to the initial time without stopping it
   * If you want to reset and stop, call stop() first
   */
  public reset(): void {
    this.elapsedSeconds = this.config.initialTime;
    this.updateDisplay();
  }

  public getElapsedTime(): number {
    return this.elapsedSeconds;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public setPosition(x: number, y: number): void {
    this.group.position({ x, y });
    this.group.getLayer()?.batchDraw();
  }

  public show(): void {
    this.group.visible(true);
    this.group.getLayer()?.batchDraw();
  }

  public hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.batchDraw();
  }

  public getGroup(): Konva.Group {
    return this.group;
  }

  public destroy(): void {
    this.stop();
    this.group.destroy();
  }
}

/**
 * Hook to create a timer
 *
 * Usage:
 * ```typescript
 * const timer = useTimer({
 *   x: 100,
 *   y: 50,
 *   onTick: (seconds) => console.log(`Elapsed: ${seconds}s`),
 * });
 *
 * // Add to your view
 * this.viewGroup.add(timer.getGroup());
 *
 * // Control the timer
 * timer.start();
 * timer.pause();
 * timer.resume();
 * ```
 */
export function useTimer(config: TimerConfig): Timer {
  return new Timer(config);
}
