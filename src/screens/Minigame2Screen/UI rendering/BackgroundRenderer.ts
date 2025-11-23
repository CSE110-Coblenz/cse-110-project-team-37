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
   * @returns Konva.Group containing the background AND stars
   */
  public static createBackground(): Konva.Group {
    const group = new Konva.Group();

    // --- BACKGROUND RECT ---
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#0A0A20",
      listening: false,
    });

    group.add(background);

    // --- STARS ---
    const stars = BackgroundRenderer.createStars(200, STAGE_WIDTH, STAGE_HEIGHT);
    stars.forEach((s) => group.add(s));

    return group;
  }

  /**
   * Generate random stars
   */
  private static createStars(count: number, width: number, height: number): Konva.Circle[] {
    const stars: Konva.Circle[] = [];

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1; // 1px–3px
      const opacity = Math.random() * 0.7 + 0.3;

      const star = new Konva.Circle({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: size,
        fill: "white",
        opacity,
        listening: false,
      });

      stars.push(star);
    }

    return stars;
  }
}
