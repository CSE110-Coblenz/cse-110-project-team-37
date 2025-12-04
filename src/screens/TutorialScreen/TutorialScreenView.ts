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

  // NPC
  private readonly npcGroup: Konva.Group;
  private readonly npcBody: Konva.Circle;
  private readonly npcFace: Konva.Text;

  // Speech bubble
  private readonly bubbleGroup: Konva.Group;
  private readonly bubbleRect: Konva.Rect;
  private readonly text: Konva.Text;

  // Close button
  private readonly buttonGroup: Konva.Group;
  private readonly btnRect: Konva.Rect;
  private readonly btnText: Konva.Text;

  private fullText = "";
  private currentCharIndex = 0;
  private typingTimerId: number | null = null;

  constructor(stageWidth: number, stageHeight: number, callbacks: TutorialCallbacks) {
    this.root = new Konva.Group({ visible: false });

    // Title
    this.title = new Konva.Text({
      text: "HOW TO PLAY",
      fontFamily: FONT_FAMILY,
      fontSize: 75,
      fontStyle: "bold",
      align: "center",
      x: 0,
      width: stageWidth,
      y: stageHeight * 0.1,
    });

    // NPC
    const npcX = stageWidth * 0.18;
    const npcY = stageHeight * 0.5;
    const npcRadius = 60;

    this.npcBody = new Konva.Circle({
      x: npcX,
      y: npcY,
      radius: npcRadius,
      fill: "#FFD966",
      stroke: "black",
      strokeWidth: 2,
    });

    this.npcFace = new Konva.Text({
      x: npcX - npcRadius / 2,
      y: npcY - npcRadius / 2,
      width: npcRadius,
      text: ":)",
      fontSize: npcRadius,
      fontFamily: FONT_FAMILY,
    });

    this.npcGroup = new Konva.Group();
    this.npcGroup.add(this.npcBody);
    this.npcGroup.add(this.npcFace);

    // Speech bubble
    const bubbleWidth = stageWidth * 0.6;
    const bubbleHeight = stageHeight * 0.28;
    const bubbleX = stageWidth * 0.3;
    const bubbleY = stageHeight * 0.5;
    const bubblePadding = 16;

    this.bubbleRect = new Konva.Rect({
      x: bubbleX,
      y: bubbleY,
      width: bubbleWidth,
      height: bubbleHeight,
      fill: "white",
      stroke: "black",
      strokeWidth: 2,
      cornerRadius: 16,
      shadowBlur: 8,
      shadowOffset: { x: 4, y: 4 },
      shadowOpacity: 0.2,
    });

    this.text = new Konva.Text({
      text: "",
      fontSize: 50,
      fontFamily: FONT_FAMILY,
      align: "left",
      x: bubbleX + bubblePadding,
      width: bubbleWidth - bubblePadding * 2,
      y: bubbleY + bubblePadding,
      lineHeight: 1.4,
    });

    this.bubbleGroup = new Konva.Group();
    this.bubbleGroup.add(this.bubbleRect);
    this.bubbleGroup.add(this.text);

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

    this.buttonGroup = new Konva.Group({ listening: true });
    this.buttonGroup.add(this.btnRect);
    this.buttonGroup.add(this.btnText);

    // Assemble root group
    this.root.add(this.npcGroup);
    this.root.add(this.bubbleGroup);
    this.root.add(this.title);
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
