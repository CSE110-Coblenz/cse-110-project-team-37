/* eslint-disable ts/unbound-method */

import Konva from "konva";

import { DiceService } from "../services/DiceService.ts";

export type DiceRendererOptions = {
  x: number;
  y: number;
  size: number;
  parent: Konva.Layer | Konva.Group;
};

export class DiceRenderer {
  private readonly group: Konva.Group;
  private readonly faceRect: Konva.Rect;
  private readonly pips: Konva.Circle[];

  constructor(options: DiceRendererOptions) {
    const { x, y, size, parent } = options;

    this.group = new Konva.Group({
      x,
      y,
    });

    this.faceRect = new Konva.Rect({
      x: -size / 2,
      y: -size / 2,
      width: size,
      height: size,
      cornerRadius: size * 0.15,
      fill: "#ffffff",
      stroke: "black",
      strokeWidth: 2,
      shadowColor: "black",
      shadowBlur: 8,
      shadowOffset: { x: 4, y: 4 },
      shadowOpacity: 0.2,
    });

    this.pips = [];
    const pipRadius = size * 0.08;
    const offset = size * 0.22;

    const makePip = (px: number, py: number): Konva.Circle => {
      return new Konva.Circle({
        x: px,
        y: py,
        radius: pipRadius,
        fill: "black",
        visible: false,
      });
    };

    const center = makePip(0, 0);
    const topLeft = makePip(-offset, -offset);
    const topRight = makePip(offset, -offset);
    const midLeft = makePip(-offset, 0);
    const midRight = makePip(offset, 0);
    const bottomLeft = makePip(-offset, offset);
    const bottomRight = makePip(offset, offset);

    this.pips.push(center, topLeft, topRight, midLeft, midRight, bottomLeft, bottomRight);

    this.group.add(this.faceRect);
    this.pips.forEach((pip) => this.group.add(pip));

    parent.add(this.group);
    this.setFace(1);
  }

  /**
   * Get Konva group
   */
  getGroup = (): Konva.Group => {
    return this.group;
  };

  /**
   * Roll the dice with animation and return the rolled value
   */
  roll = (sides = 6): number => {
    const value = DiceService.rollDice(sides);

    this.group.to({
      rotation: 12,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 0.12,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        this.setFace(value);
        this.group.to({
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.12,
          easing: Konva.Easings.EaseInOut,
        });
      },
    });

    return value;
  };

  /**
   * Show a specific face value (1–6)
   */
  setFace = (value: number): void => {
    this.pips.forEach((pip) => pip.visible(false));

    const [center, topLeft, topRight, midLeft, midRight, bottomLeft, bottomRight] = this.pips;

    switch (value) {
      case 1:
        center.visible(true);
        break;
      case 2:
        topLeft.visible(true);
        bottomRight.visible(true);
        break;
      case 3:
        topLeft.visible(true);
        center.visible(true);
        bottomRight.visible(true);
        break;
      case 4:
        topLeft.visible(true);
        topRight.visible(true);
        bottomLeft.visible(true);
        bottomRight.visible(true);
        break;
      case 5:
        topLeft.visible(true);
        topRight.visible(true);
        center.visible(true);
        bottomLeft.visible(true);
        bottomRight.visible(true);
        break;
      case 6:
        topLeft.visible(true);
        topRight.visible(true);
        midLeft.visible(true);
        midRight.visible(true);
        bottomLeft.visible(true);
        bottomRight.visible(true);
        break;
      default:
        center.visible(true);
        break;
    }

    this.group.getLayer()?.batchDraw();
  };
}
