// THIS FILE WILL RENDER THE GAME'S BACKGROUND
import Konva from "konva";

// need these to define dimensions
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../../constants";

/**
 * class that creates the background for the game
 */
export class BackgroundRenderer {
  /**
   * creates background of game
   * @returns rectangle shape that wil becomes the background
   */
  public static createBackground(): Konva.Rect {
    return new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#0A0A20",
    });
  }
}
