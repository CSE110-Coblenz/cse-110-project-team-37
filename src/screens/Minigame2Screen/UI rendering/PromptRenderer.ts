// THIS FILE RENDERS THE TEXT THAT DISPLAYS ON THE SCREEN
import Konva from "konva";

// importing dimensions
import { STAGE_WIDTH } from "../../../constants";

export class PromptRenderer {
  /**
   * function that creates a new text block
   */
  public static create(): Konva.Text {
    const prompt = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 50,
      fontSize: 32,
      fill: "white",
    });
    // cenerting
    prompt.offsetX(prompt.width() / 2);
    return prompt;
  }
}
