import Konva from "konva";

import type { View } from "../../types.ts";

/**
 * TutorialScreenView - Renders the game UI using Konva
 */
export class TutorialScreenView implements View {
  private readonly root: Konva.Group;
  private readonly title: Konva.Text;
  private readonly text: Konva.Text;
  private readonly buttonGroup: Konva.Group;
  private readonly btnRect: Konva.Rect;
  private readonly btnText: Konva.Text;

  constructor(
	stageWidth: number,
	stageHeight: number,
	onReturn: () => void,
) {
    this.root = new Konva.Group({ visible: false });

    // Game Over
    this.title = new Konva.Text({
      text: "HOW TO PLAY",
      fontSize: 48,
      fontStyle: "bold",
      align: "center",
      x: 0,
      width: stageWidth,
      y: stageHeight / 2 - 200,
    });

    // Tutorial instructions
    this.text = new Konva.Text({
      text: "some instructions",
      fontSize: 20,
      align: "center",
      x: 0,
      width: stageWidth,
      y: stageHeight / 2 - 50,
    });

    // Close button
    const btnWidth = 260;
    const btnHeight = 48;
    const btnX = 10;
    const btnY = 10;

    this.btnRect = new Konva.Rect({
      x: btnX,
      y: btnY,
      width: btnWidth,
      height: btnHeight,
      cornerRadius: 8,
      strokeWidth: 1,
      stroke: "black",
      fillEnabled: false,
    });

    this.btnText = new Konva.Text({
      x: btnX,
      y: btnY + (btnHeight - 20) / 2,
      width: btnWidth,
      text: "CLOSE",
      fontSize: 20,
      align: "center",
    });

    this.buttonGroup = new Konva.Group({
      listening: true,
    });
    this.buttonGroup.add(this.btnRect);
    this.buttonGroup.add(this.btnText);

    this.root.add(this.title);
    this.root.add(this.text);
    this.root.add(this.buttonGroup);

    this.buttonGroup.on("click tap", onReturn);
  }

  /**
   * Show the screen
   */
  show(): void {
    this.root.visible(true);
    this.root.getLayer()?.draw();
  }

  /**
   * Hide the screen
   */
  hide(): void {
    this.root.visible(false);
    this.root.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.root;
  }
}
