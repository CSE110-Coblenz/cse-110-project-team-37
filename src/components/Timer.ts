import Konva from "konva";

/**
 * Timer modes: 'countup' counts from initialTime upwards, 'countdown' counts from initialTime down to 0
 */
export type TimerMode = "countup" | "countdown";

/**
 * Configuration options for creating a timer
 */
export type TimerConfig = {
  // position
  x: number;
  y: number;

  // defaults to 0
  initialTime?: number;

  // Timer mode: 'countup' (default) or 'countdown'
  mode?: TimerMode;

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

  // Callback function called when countdown reaches 0 (countdown mode only)
  onCountdownComplete?: () => void;
};

/**
 * Timer component that can be added to any screen
 * Provides methods to start, pause, resume, stop, and reset the timer
 */
export class Timer {
  private readonly group: Konva.Group;
  private readonly background: Konva.Rect;
  private readonly timeText: Konva.Text;

  private currentTime: number = 0;
  private isRunning: boolean = false;
  private intervalId: number | null = null;

  private readonly config: Required<TimerConfig>;

  constructor(config: TimerConfig) {
    // Set defaults for optional config values
    this.config = {
      initialTime: 0,
      mode: "countup",
      fontSize: 24,
      textColor: "white",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: 10,
      borderRadius: 5,
      onTick: () => {},
      onStop: () => {},
      onCountdownComplete: () => {},
      ...config,
    };

    this.currentTime = this.config.initialTime;

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
      text: this.formatTime(this.currentTime),
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
    this.timeText.text(this.formatTime(this.currentTime));
    this.updateBackgroundSize();
    this.group.getLayer()?.batchDraw();
  }

  /**
   * Tick function called every second when timer is running
   */
  private tick(): void {
    if (this.config.mode === "countdown") {
      this.currentTime--;
      this.updateDisplay();
      this.config.onTick(this.currentTime);

      // Check if countdown has reached 0
      if (this.currentTime <= 0) {
        this.currentTime = 0;
        this.updateDisplay();
        this.pause();
        this.config.onCountdownComplete();
      }
    } else {
      // Countup mode
      this.currentTime++;
      this.updateDisplay();
      this.config.onTick(this.currentTime);
    }
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
    this.config.onStop(this.currentTime);
  }

  /**
   * Resets the timer to the initial time without stopping it
   * If you want to reset and stop, call stop() first
   */
  public reset(): void {
    this.currentTime = this.config.initialTime;
    this.updateDisplay();
  }

  /**
   * Gets the current time value
   * For countup mode: time elapsed since start
   * For countdown mode: time remaining
   */
  public getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * @deprecated Use getCurrentTime() instead for clearer intent
   */
  public getElapsedTime(): number {
    return this.currentTime;
  }

  /**
   * Gets the timer mode
   */
  public getMode(): TimerMode {
    return this.config.mode;
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
 * // Countup timer (default)
 * const countupTimer = useTimer({
 *   x: 100,
 *   y: 50,
 *   initialTime: 0,
 *   mode: 'countup', // optional, this is the default
 *   onTick: (seconds) => console.log(`Elapsed: ${seconds}s`),
 * });
 *
 * // Countdown timer
 * const countdownTimer = useTimer({
 *   x: 100,
 *   y: 100,
 *   initialTime: 60, // Start from 60 seconds
 *   mode: 'countdown',
 *   onTick: (seconds) => console.log(`Time remaining: ${seconds}s`),
 *   onCountdownComplete: () => console.log('Time\'s up!'),
 * });
 *
 * // Add to your view
 * this.viewGroup.add(countupTimer.getGroup());
 * this.viewGroup.add(countdownTimer.getGroup());
 *
 * // Control the timers
 * countupTimer.start();
 * countdownTimer.start();
 * timer.pause();
 * timer.resume();
 * ```
 */
export function useTimer(config: TimerConfig): Timer {
  return new Timer(config);
}
