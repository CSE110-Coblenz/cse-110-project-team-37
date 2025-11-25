import Konva from "konva";
import { FONT_FAMILY, TypingSpeedms } from "../../constants.ts";
import type { View } from "../../types.ts";

type TutorialCallbacks = {
  onClose: () => void;
  onAdvance: () => void;
};

export class TutorialScreenView implements View {
  private readonly root: Konva.Group;
  private readonly title: Konva.Text;
  private readonly text: Konva.Text;
  private readonly buttonGroup: Konva.Group;
  private readonly btnRect: Konva.Rect;
  private readonly btnText: Konva.Text;

  private fullText = "";
  private currentCharIndex = 0;
  private typingTimerId: number | null = null;

  constructor(stageWidth: number, stageHeight: number, callbacks: TutorialCallbacks) {
    this.root = new Konva.Group({ visible: false });

    this.title = new Konva.Text({
      text: "HOW TO PLAY",
      fontFamily: FONT_FAMILY,
      fontSize: 48,
      fontStyle: "bold",
      align: "center",
      x: 0,
      width: stageWidth,
      y: stageHeight / 2 - 200,
    });

    this.text = new Konva.Text({
      text: "",
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      align: "center",
      x: 0,
      width: stageWidth,
      y: stageHeight / 2 - 50,
    });

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

    this.buttonGroup = new Konva.Group({ listening: true });
    this.buttonGroup.add(this.btnRect);
    this.buttonGroup.add(this.btnText);

    this.root.add(this.title);
    this.root.add(this.text);
    this.root.add(this.buttonGroup);

    this.buttonGroup.on("click tap", callbacks.onClose);

    this.root.on("click tap", (evt) => {
      if (evt.target === this.btnRect || evt.target === this.btnText) return;
      callbacks.onAdvance();
    });
  }

  show(): void {
    this.root.visible(true);
  }

  hide(): void {
    this.root.visible(false);
    this.stopTyping();
  }

  getGroup(): Konva.Group {
    return this.root;
  }

  startTyping(line: string): void {
    this.stopTyping();

    this.fullText = line;
    this.currentCharIndex = 0;
    this.text.text("");

    const speedMs = TypingSpeedms;

    this.typingTimerId = window.setInterval(() => {
      if (this.currentCharIndex >= this.fullText.length) {
        this.stopTyping();
        return;
      }

      this.currentCharIndex++;
      this.text.text(this.fullText.slice(0, this.currentCharIndex));
      this.root.getLayer()?.batchDraw();
    }, speedMs);
  }

  finishTyping(): void {
    if (this.typingTimerId !== null) {
      this.stopTyping();
      this.text.text(this.fullText);
      this.root.getLayer()?.batchDraw();
    }
  }

  isTyping(): boolean {
    return this.typingTimerId !== null;
  }

  private stopTyping(): void {
    if (this.typingTimerId !== null) {
      window.clearInterval(this.typingTimerId);
      this.typingTimerId = null;
    }
  }
}
