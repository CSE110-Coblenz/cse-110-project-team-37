import Konva from "konva";

import type { View } from "../../types.ts";

import { Fraction } from "../../models/Fraction.ts";

/**
 * Minigame1ScreenView
 * - Big pizza image on center-left (no orange crust fill)
 * - Buttons on the right with image slice thumbnails next to each option
 * - Back to Menu + Reset Pizza, fraction arithmetic
 * - Tracks number of pizzas completed
 */
export class Minigame1ScreenView implements View {
  private readonly group: Konva.Group = new Konva.Group({ visible: true });
  private readonly pizzaGroup: Konva.Group = new Konva.Group();
  private readonly uiGroup: Konva.Group = new Konva.Group();

  private readonly width = window.innerWidth;
  private readonly height = window.innerHeight;

  // Big pizza position/size
  private readonly pizzaCenter = { x: this.width * 0.32, y: this.height * 0.58 };
  private readonly pizzaRadius = Math.min(480, Math.min(this.width, this.height) * 0.45);

  // Image assets
  private pizzaHTMLImage: HTMLImageElement | null = null;
  private basePizzaImageNode: Konva.Image | null = null;
  private readonly PIZZA_SRC = "/whole-pizza.png"; // served from /public

  // Game state
  private current: Fraction = new Fraction(0, 1);
  private readonly epsilon = new Fraction(1, 1000);

  // Fraction helpers
  private fractionZero(): Fraction {
    return new Fraction(0, 1);
  }

  private fractionOne(): Fraction {
    return new Fraction(1, 1);
  }

  private isGreaterThan(a: Fraction, b: Fraction): boolean {
    return a.numerator * b.denominator > b.numerator * a.denominator;
  }

  private isCloseTo(a: Fraction, b: Fraction, epsilon: Fraction): boolean {
    return Math.abs(a.toDecimal() - b.toDecimal()) <= epsilon.toDecimal();
  }

  private clampMinZero(x: Fraction): Fraction {
    if (this.isGreaterThan(x, this.fractionZero())) {
      return x;
    }
    return this.fractionZero();
  }

  // UI refs
  private sumText!: Konva.Text;
  private statusText!: Konva.Text;

  // Pizza completion tracking
  private pizzasCompleted = 0;
  private pizzasCompletedText!: Konva.Text;

  private readonly onBack?: () => void;

  constructor(onBack?: () => void) {
    this.onBack = onBack;

    // Order: background (root) -> pizzaGroup -> uiGroup
    this.group.add(this.pizzaGroup);
    this.group.add(this.uiGroup);

    this.drawBackground();

    this.loadPizzaTexture().then(
      () => {
        this.drawPizzaBaseWithImage();
        this.drawHUD();
        this.drawButtons([
          new Fraction(1, 4),
          new Fraction(1, 8),
          new Fraction(1, 2),
          new Fraction(1, 3),
          new Fraction(1, 6),
          new Fraction(1, 12),
          new Fraction(1, 24),
        ]);
        this.group.getLayer()?.draw();
      },
      () => console.error("We are coocked"),
    );
  }

  // View interface
  getGroup(): Konva.Group {
    return this.group;
  }
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  private handleBack() {
    // Reset pizza state
    this.resetGame();

    // Reset pizzas completed counter
    this.pizzasCompleted = 0;
    if (this.pizzasCompletedText) {
      this.pizzasCompletedText.text(`Pizzas completed: ${this.pizzasCompleted}`);
    }

    // Invoke callback to actually go back to the menu
    this.onBack?.();
  }

  // ---------------- Assets ----------------
  private async loadPizzaTexture(): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.pizzaHTMLImage = img;
        resolve();
      };
      img.onerror = (e) => reject(e);
      img.src = this.PIZZA_SRC;
    });
  }

  // ---------------- Drawing ----------------
  private drawBackground() {
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      fill: "#f8fafc",
    });
    this.group.add(bg);
    bg.moveToBottom();
  }

  private drawPizzaBaseWithImage() {
    if (!this.pizzaHTMLImage) return;

    // Subtle plate only (remove orange crust fill)
    const plate = new Konva.Circle({
      x: this.pizzaCenter.x,
      y: this.pizzaCenter.y,
      radius: this.pizzaRadius + 18,
      fill: "#e5e7eb",
      opacity: 0.3,
    });

    // Full pizza image (dim base so added slices pop)
    const d = this.pizzaRadius * 2 - 36; // inner diameter
    const x = this.pizzaCenter.x - d / 2;
    const y = this.pizzaCenter.y - d / 2;

    this.basePizzaImageNode = new Konva.Image({
      image: this.pizzaHTMLImage,
      x,
      y,
      width: d,
      height: d,
      opacity: 0.25,
    });

    this.pizzaGroup.add(plate, this.basePizzaImageNode);
  }

  private drawHUD() {
    // Back button (top-left)
    const backBtn = this.makeButton({
      x: 24,
      y: 24,
      w: 180,
      h: 44,
      label: "Back to Menu",
      onClick: () => this.handleBack(),
    });

    // Right column anchor
    const colCenterX = this.width * 0.68;
    const colW = 420;
    const colX = colCenterX - colW / 2;

    const title = new Konva.Text({
      x: colX,
      y: 80,
      width: colW,
      text: "Make a whole pizza",
      fontSize: 34,
      fontStyle: "bold",
      fontFamily: "Arial",
      fill: "#0f172a",
      align: "center",
    });

    this.sumText = new Konva.Text({
      x: colX,
      y: 130,
      width: colW,
      text: `Current: 0/1`,
      fontSize: 22,
      fontFamily: "Arial",
      fill: "#0f172a",
      align: "center",
    });

    this.statusText = new Konva.Text({
      x: colX,
      y: 160,
      width: colW,
      text: "Click a fraction to add a slice",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#334155",
      align: "center",
    });

    const resetBtn = new Konva.Group({ x: colCenterX - 130, y: 190 });
    const resetRect = new Konva.Rect({
      width: 260,
      height: 44,
      cornerRadius: 12,
      fill: "#ffffff",
      stroke: "#94a3b8",
      strokeWidth: 2,
      shadowColor: "black",
      shadowOpacity: 0.08,
      shadowBlur: 8,
      shadowOffset: { x: 0, y: 2 },
    });
    const resetTxt = new Konva.Text({
      x: 0,
      y: 0,
      width: 260,
      height: 44,
      align: "center",
      verticalAlign: "middle",
      text: "Reset Pizza",
      fontSize: 22,
      fontFamily: "Arial",
      fill: "#0f172a",
    });
    resetBtn.add(resetRect, resetTxt);
    resetBtn.on("mouseenter", () => {
      resetRect.fill("#f1f5f9");
      const stage = resetBtn.getStage();
      if (stage) stage.container().style.cursor = "pointer";
      this.group.getLayer()?.batchDraw();
    });
    resetBtn.on("mouseleave", () => {
      resetRect.fill("#ffffff");
      const stage = resetBtn.getStage();
      if (stage) stage.container().style.cursor = "default";
      this.group.getLayer()?.batchDraw();
    });
    resetBtn.on("click", () => this.resetGame());

    // Pizzas completed counter above main pizza
    const counterWidth = 260;
    const counterY = this.pizzaCenter.y - this.pizzaRadius - 40;
    const iconSize = 32;

    // Small pizza image icon to the left of the text
    let pizzaIcon: Konva.Image | Konva.Circle;
    if (this.pizzaHTMLImage) {
      pizzaIcon = new Konva.Image({
        image: this.pizzaHTMLImage,
        x: this.pizzaCenter.x - counterWidth / 2,
        y: counterY - iconSize / 2,
        width: iconSize,
        height: iconSize,
      });
    } else {
      pizzaIcon = new Konva.Circle({
        x: this.pizzaCenter.x - counterWidth / 2 + iconSize / 2,
        y: counterY,
        radius: iconSize / 2,
        fill: "#fde68a",
        stroke: "#b91c1c",
        strokeWidth: 2,
      });
    }

    this.pizzasCompletedText = new Konva.Text({
      x: this.pizzaCenter.x - counterWidth / 2 + iconSize + 8,
      y: counterY - 10,
      width: counterWidth - iconSize - 8,
      text: `Pizzas completed: ${this.pizzasCompleted}`,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#0f172a",
      align: "left",
    });

    this.uiGroup.add(
      backBtn,
      title,
      this.sumText,
      this.statusText,
      pizzaIcon,
      this.pizzasCompletedText,
      resetBtn,
    );
  }

  private drawButtons(fracs: Fraction[]) {
    // Right column (under reset), centered
    const colCenterX = this.width * 0.68;
    const w = 280;
    const h = 56;
    const gap = 16;
    const startX = colCenterX - w / 2;
    const startY = 250;

    fracs.forEach((r, i) => {
      const y = startY + i * (h + gap);

      const btn = this.makeButton({
        x: startX,
        y,
        w,
        h,
        label: r.toString(),
        onClick: () => this.tryAdd(r),
      });

      // Image slice thumbnail to the LEFT of the button
      const thumbRadius = 28;
      const thumb = this.makeSliceThumbnail(
        r,
        { x: startX - (thumbRadius * 2 + 18), y: y + (h - thumbRadius * 2) / 2 },
        thumbRadius,
      );

      this.uiGroup.add(thumb, btn);
    });
  }

  private makeSliceThumbnail(
    r: Fraction,
    pos: { x: number; y: number },
    radius: number,
  ): Konva.Group {
    const g = new Konva.Group({ x: pos.x, y: pos.y, width: radius * 2, height: radius * 2 });

    // Clip a small wedge from the pizza image
    const start = -Math.PI / 2;
    const end = start + r.toDecimal() * Math.PI * 2;

    g.clipFunc((ctx) => {
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, start, end, false);
      ctx.closePath();
    });

    if (this.pizzaHTMLImage) {
      const img = new Konva.Image({
        image: this.pizzaHTMLImage,
        x: 0,
        y: 0,
        width: radius * 2,
        height: radius * 2,
      });
      g.add(img);
    } else {
      // Fallback if image not ready (rare)
      g.add(
        new Konva.Circle({
          x: radius,
          y: radius,
          radius,
          fill: "#fde68a",
          stroke: "#b91c1c",
          strokeWidth: 2,
        }),
      );
    }

    return g;
  }

  private makeButton(opts: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    onClick: () => void;
  }): Konva.Group {
    const g = new Konva.Group({ x: opts.x, y: opts.y });

    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: opts.w,
      height: opts.h,
      cornerRadius: 14,
      fill: "#ffffff",
      stroke: "#cbd5f5",
      strokeWidth: 2,
      shadowColor: "black",
      shadowOpacity: 0.08,
      shadowBlur: 10,
      shadowOffset: { x: 0, y: 3 },
    });

    const label = new Konva.Text({
      x: 0,
      y: 0,
      width: opts.w,
      height: opts.h,
      text: opts.label,
      fontSize: 22,
      fontFamily: "Arial",
      fill: "#0f172a",
      align: "center",
      verticalAlign: "middle",
    });

    g.add(rect, label);

    g.on("mouseenter", () => {
      rect.fill("#eff6ff");
      const stage = g.getStage();
      if (stage) stage.container().style.cursor = "pointer";
      this.group.getLayer()?.batchDraw();
    });
    g.on("mouseleave", () => {
      rect.fill("#ffffff");
      const stage = g.getStage();
      if (stage) stage.container().style.cursor = "default";
      this.group.getLayer()?.batchDraw();
    });
    g.on("click touchstart", opts.onClick);

    return g;
  }

  // ---------------- Game logic ----------------
  private resetGame() {
    this.current = this.fractionZero();
    this.sumText.text(`Current: 0/1`);
    this.statusText.text("Click a fraction to add a slice");

    // Remove previous wedges
    this.pizzaGroup
      .getChildren((n) => n.getAttr("data-wedge") === true)
      .forEach((n) => n.destroy());
    this.group.getLayer()?.draw();
  }

  private tryAdd(r: Fraction) {
    const next = this.current.add(r);

    // Prevent going over a full pizza (1 + epsilon)
    if (this.isGreaterThan(next, this.fractionOne().add(this.epsilon))) {
      this.statusText.text("That would overflow the pizza. Try a smaller slice.");
      this.group.getLayer()?.batchDraw();
      return;
    }

    this.addImageSlice(r);
    this.current = next;
    this.sumText.text(`Current: ${this.current.toString()}`);

    // Check if we're effectively at 1 (within epsilon)
    if (this.isCloseTo(this.current, this.fractionOne(), this.epsilon)) {
      this.current = this.fractionOne();
      this.sumText.text("Current: 1/1");
      this.statusText.text("Perfect! Pizza completed!");

      // Increment pizzas completed counter and update HUD
      this.pizzasCompleted += 1;
      this.pizzasCompletedText.text(`Pizzas completed: ${this.pizzasCompleted}`);

      // Brief green glow + auto reset for next pizza
      this.flashPizzaSuccess();
    } else {
      const remainingRaw = this.fractionOne().subtract(this.current);
      const remaining = this.clampMinZero(remainingRaw);
      this.statusText.text(`Added ${r.toString()}. Remaining: ${remaining.toString()}`);
    }

    this.group.getLayer()?.batchDraw();
  }

  private flashPizzaSuccess() {
    // Create a green "glow" ring around the big pizza
    const glow = new Konva.Circle({
      x: this.pizzaCenter.x,
      y: this.pizzaCenter.y,
      radius: this.pizzaRadius + 24,
      stroke: "#22c55e",
      strokeWidth: 14,
      shadowColor: "#22c55e",
      shadowBlur: 32,
      shadowOpacity: 0.9,
      opacity: 0.9,
      listening: false,
    });

    this.pizzaGroup.add(glow);
    this.group.getLayer()?.batchDraw();

    // Fade the glow out over 0.5s
    const tween = new Konva.Tween({
      node: glow,
      duration: 0.5,
      opacity: 0,
      onFinish: () => {
        glow.destroy();
      },
    });
    tween.play();

    // After 0.5s, start a fresh pizza automatically
    window.setTimeout(() => {
      this.resetGame();
    }, 500);
  }

  private addImageSlice(r: Fraction) {
    if (!this.pizzaHTMLImage) return;

    const filled = this.current.toDecimal();
    const add = r.toDecimal();
    const start = -Math.PI / 2 + filled * Math.PI * 2;
    const end = start + add * Math.PI * 2;

    const d = this.pizzaRadius * 2 - 36;
    const g = new Konva.Group({ x: this.pizzaCenter.x - d / 2, y: this.pizzaCenter.y - d / 2 });

    g.clipFunc((ctx) => {
      ctx.beginPath();
      ctx.moveTo(d / 2, d / 2);
      ctx.arc(d / 2, d / 2, d / 2, start, end, false);
      ctx.closePath();
    });

    g.add(new Konva.Image({ image: this.pizzaHTMLImage, x: 0, y: 0, width: d, height: d }));
    g.setAttr("data-wedge", true);
    this.pizzaGroup.add(g);
  }
}

export default Minigame1ScreenView;
