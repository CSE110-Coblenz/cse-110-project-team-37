// screens/PauseScreen/PauseScreenView.ts
import Konva from "konva";

import { ButtonFactory } from "../../util/ButtonFactory.ts";

import type { View } from "../../types.ts";

export class PauseScreenView implements View {
  private readonly onResume: () => void;
  private readonly onHelp: () => void;
  private readonly onQuit: () => void;

  private readonly group: Konva.Group;

  constructor(onResume: () => void, onHelp: () => void, onQuit: () => void) {
    this.onResume = onResume;
    this.onHelp = onHelp;
    this.onQuit = onQuit;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.group = new Konva.Group({
      visible: false,
      listening: true,
    });

    // ---------- Dim overlay ----------
    const overlay = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill: "black",
      opacity: 0.35,
    });
    this.group.add(overlay);

    // ---------- Popup panel ----------
    const panelWidth = Math.min(420, width * 0.5); // narrower
    const panelHeight = Math.min(330, height * 0.55);

    const panelX = width / 2 - panelWidth / 2;
    const panelY = height / 2 - panelHeight / 2;

    const panel = new Konva.Rect({
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight,
      fill: "#222",
      cornerRadius: 18,
      stroke: "white",
      strokeWidth: 2,
      shadowBlur: 15,
      shadowOffset: { x: 0, y: 4 },
      shadowOpacity: 0.5,
    });
    this.group.add(panel);

    // ---------- Title ----------
    const title = new Konva.Text({
      text: "Paused",
      fontSize: 44, // bigger
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });

    // Horizontal centering
    title.offsetX(title.width() / 2);

    // Slightly higher placement
    title.x(panelX + panelWidth / 2);
    title.y(panelY + 40);

    this.group.add(title);

    // ---------- Buttons ----------
    const buttons = [
      { label: "Resume", handler: this.onResume },
      { label: "Help", handler: this.onHelp },
      { label: "Quit to Menu", handler: this.onQuit },
    ];

    const buttonWidth = Math.min(240, panelWidth * 0.6); // narrower buttons
    const buttonHeight = 45;

    // Perfect spacing beneath title
    const startY = title.y() + 90;

    const spacing = 16;
    const centerX = panelX + panelWidth / 2;

    buttons.forEach((btn, index) => {
      const y = startY + index * (buttonHeight + spacing);

      const button = ButtonFactory.construct()
        .pos(centerX, y)
        .width(buttonWidth)
        .height(buttonHeight)
        .text(btn.label)
        .fontSize(20)
        .backColor("#777") // nicer shade
        .hoverColor("#555")
        .onClick(btn.handler)
        .build();

      this.group.add(button);
    });
  }

  show(): void {
    this.group.visible(true);
    this.group.moveToTop();
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}