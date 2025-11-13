import Konva from "konva";

import type { View } from "../../types.ts";

/**
 * EndScreenView - Renders the game UI using Konva 
 */
export class EndScreenView implements View {
  private readonly root: Konva.Group;
  private readonly title: Konva.Text;
  private readonly buttonGroup: Konva.Group;
  private readonly btnRect: Konva.Rect;
  private readonly btnText: Konva.Text;

  private onReturn?: () => void;

  constructor(stageWidth: number, stageHeight: number) {
    this.root = new Konva.Group({ visible: false });

    // Game Over
    this.title = new Konva.Text({
      text: "GAME OVER",
      fontSize: 48,
      fontStyle: "bold",
      align: "center",
      x: 0,
      width: stageWidth,
      y: stageHeight / 2 - 100,
    });

    // Return main menu button
    const btnWidth = 260;
    const btnHeight = 48;
    const btnX = (stageWidth - btnWidth) / 2;
    const btnY = stageHeight / 2 - 20;

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
      text: "Return to Main Menu",
      fontSize: 20,
      align: "center",
    });

    this.buttonGroup = new Konva.Group({
      listening: true,
    });
    this.buttonGroup.add(this.btnRect);
    this.buttonGroup.add(this.btnText);

    this.root.add(this.title);
    this.root.add(this.buttonGroup);

    this.buttonGroup.on("click tap", () => {
      this.onReturn?.();
    });
  }

  /**
   * Allow controller to supply the click handler
   */
  setOnReturn(cb: () => void) {
    this.onReturn = cb;
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
