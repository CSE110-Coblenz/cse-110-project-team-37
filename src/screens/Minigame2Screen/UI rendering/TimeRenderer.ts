// THIS FILE RENDERS THE TIME COMPONENT OF THE MINIGAME (SPACESHIP PROGRESS BAR)
import Konva from "konva";

// importing dimensions
import { STAGE_WIDTH } from "../../../constants.ts";

// creating a type that stores the image of the ship and the duration of the timer
type ShipTimerOptions = {
  timerShip: Konva.Image;
  duration: number;
};

/**
 * handles the visual ship animation (timer) and triggers the onFinish handler.
 */
export class ShipTimerRenderer {
  // spaceship image
  private readonly timerShip: Konva.Image;

  // animation
  private timerTween: Konva.Tween | null = null;

  // duration of animation (game)
  private readonly duration: number;

  // defines the member variables given options and defines starting position of the image
  constructor(options: ShipTimerOptions) {
    this.timerShip = options.timerShip;
    this.duration = options.duration;

    // initial position of the spaceship
    this.timerShip.x(0);
    this.timerShip.width(120);
    this.timerShip.height(60);
    this.timerShip.y(20);
  }

  /**
   * sets up the animation (spaceship flying across the screen)
   * @param onExpire handler that determines what happens when the timer expires
   */
  private setupTimerTween(onExpire: () => void): void {
    // destroy any possible existing animation to prevent bugs
    this.timerTween?.destroy();

    // defining new animation
    this.timerTween = new Konva.Tween({
      node: this.timerShip,
      x: STAGE_WIDTH - 150,
      duration: this.duration,
      onFinish: () => onExpire(),
    });
  }

  /**
   * starting the timer
   * @param onExpire defining what happens when timer expires
   */
  public start(onExpire: () => void): void {
    if (!this.timerTween) {
      // setup the animation
      this.setupTimerTween(onExpire);
    }
    // play the animation
    this.timerTween?.play();
  }

  /**
   * stopping the timer if needed
   */
  public stop(): void {
    this.timerTween?.pause();
  }

  /**
   *  reseting position of the ship and destroying the animation, in case we trigger it again
   */
  public reset(): void {
    this.stop();
    this.timerShip.x(0);
    this.timerTween?.destroy();
    this.timerTween = null;
    this.timerShip.getLayer()?.batchDraw();
  }

  public getNode(): Konva.Image {
    return this.timerShip;
  }
}
