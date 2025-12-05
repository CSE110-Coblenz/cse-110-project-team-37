import Konva from "konva";

/*
 * Util Button Builder class for a simple construction of Konva Group for buttons.
 * Each parameter has a default, but if needed you can manually specify each of the following
 * To create desidred variant.
 *
 * Icon svgs can be downloaded from https://lucide.dev/icons
 *
 * Usage Example:
 *
 * const myButton = ButtonFactory.construct()
 *      .pos(this.width * 0.5, this.height * 0.1)
 *      .text("Call Saul")
 *      .icon("/pause.svg") // pause.svg should be in the /public directory
 *      .onClick(() => console.log("calling..."))
 *      .build();
 *
 * Now just add myButton to your group and it's ready to use.
 */
export class ButtonFactory {
  private dx: number = 0;
  private dy: number = 0;
  private dw: number | null = null;
  private dh: number | null = null;
  private dtext: string | null = null;
  private dfont: number = 24;
  private dBBaseColor: string = "gray";
  private dBHoverColor: string = "black";
  private donClick: (() => void) | null = null;
  private dicon: string | null = null;
  private diconColor: string | null = null;
  private diconWidth: number = 24;
  private diconHeight: number = 24;
  private diconGap: number = 8;

  static construct(): ButtonFactory {
    return new ButtonFactory();
  }

  /*
   * Position of a button on the screen.
   */
  pos(x: number, y: number): this {
    this.dx = x;
    this.dy = y;
    return this;
  }

  /*
   * Background width.
   */
  width(w: number): this {
    this.dw = w;
    return this;
  }

  /*
   * Background height.
   */
  height(h: number): this {
    this.dh = h;
    return this;
  }

  /*
   * Text to be displayed as button title.
   */
  text(t: string): this {
    this.dtext = t;
    return this;
  }

  /*
   * Sets font size
   */
  fontSize(s: number): this {
    this.dfont = s;
    return this;
  }

  /*
   *  On click action to be exectuted.
   */
  onClick(handler: () => void): this {
    this.donClick = handler;
    return this;
  }

  /*
   *  Button background color.
   */
  backColor(color: string): this {
    this.dBBaseColor = color;
    return this;
  }

  /*
   *  Button background color on hover.
   */
  hoverColor(color: string): this {
    this.dBHoverColor = color;
    return this;
  }

  /*
   * SVG file path (e.g., "/icons/play.svg")
   */
  icon(path: string): this {
    this.dicon = path;
    return this;
  }

  /*
   * Icon color as CSS color value (e.g., "white", "#ffffff", "rgb(255,255,255)")
   */
  iconColor(color: string): this {
    this.diconColor = color;
    return this;
  }

  /*
   * Icon width in pixels (default: 24)
   */
  iconWidth(w: number): this {
    this.diconWidth = w;
    return this;
  }

  /*
   * Icon height in pixels (default: 24)
   */
  iconHeight(h: number): this {
    this.diconHeight = h;
    return this;
  }

  /*
   * Gap between icon and text in pixels (default: 8)
   */
  iconGap(gap: number): this {
    this.diconGap = gap;
    return this;
  }

  /*
   * Constructs and returns the finihsed button group.
   */
  build(): Konva.Group {
    const button = new Konva.Group();

    const buttonText = this.dtext
      ? new Konva.Text({
          text: this.dtext,
          fontSize: this.dfont,
          fontFamily: "Arial",
          fill: "white",
          align: "center",
        })
      : null;

    // Calculate dimensions including icon if present
    const textWidth = buttonText?.width() ?? 0;
    const textHeight = buttonText?.height() ?? 0;
    let totalWidth = this.dw ?? textWidth + 20;
    let totalHeight = this.dh ?? textHeight + 20;

    if (this.dicon) {
      if (textWidth > 0) {
        // Icon + text
        if (this.dw === null) {
          totalWidth = textWidth + this.diconWidth + this.diconGap + 20;
        }
        if (this.dh === null) {
          totalHeight = Math.max(textHeight, this.diconHeight) + 20;
        }
      } else {
        // Icon only
        if (this.dw === null) {
          totalWidth = this.diconWidth + 20;
        }
        if (this.dh === null) {
          totalHeight = this.diconHeight + 20;
        }
      }
    }

    const buttonBack = new Konva.Rect({
      width: totalWidth,
      height: totalHeight,
      fill: this.dBBaseColor,
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 2,
    });

    buttonBack.offsetX(buttonBack.width() / 2);
    buttonBack.offsetY(buttonBack.height() / 2);

    button.position({ x: this.dx, y: this.dy });
    button.add(buttonBack);

    // Add icon and text based on position
    if (this.dicon) {
      this.addIconAndText(button, buttonText, totalWidth);
    } else if (buttonText) {
      buttonText.offsetX(buttonText.width() / 2);
      buttonText.offsetY(buttonText.height() / 2);
      button.add(buttonText);
    }

    if (this.donClick) {
      button.on("click", this.donClick);
    }

    button.on("mouseenter", () => {
      buttonBack.fill(this.dBHoverColor);
      buttonBack.getLayer()?.batchDraw();
    });

    button.on("mouseleave", () => {
      buttonBack.fill(this.dBBaseColor);
      buttonBack.getLayer()?.batchDraw();
    });

    button.setAttr("isButton", true);
    button.listening(true);
    buttonBack.listening(true);
    if (buttonText) buttonText.listening(true);
    return button;
  }

  /*
   * Private helper to add icon and text to button with proper positioning
   */
  private addIconAndText(
    button: Konva.Group,
    buttonText: Konva.Text | null,
    _totalWidth: number,
  ): void {
    if (!this.dicon) {
      // Fallback to text only if no icon
      if (buttonText) {
        buttonText.offsetX(buttonText.width() / 2);
        buttonText.offsetY(buttonText.height() / 2);
        button.add(buttonText);
      }
      return;
    }

    const image = new Image();
    image.onload = () => {
      const iconImage = new Konva.Image({
        image,
        width: this.diconWidth,
        height: this.diconHeight,
      });

      // Apply color filter if specified
      if (this.diconColor) {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw original image
          ctx.drawImage(image, 0, 0);

          // Get image data and recolor strokes
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Parse the color
          const color = this.diconColor;
          let r = 255;
          let g = 255;
          let b = 255;

          if (color.startsWith("#")) {
            const hex = color.slice(1);
            r = Number.parseInt(hex.slice(0, 2), 16);
            g = Number.parseInt(hex.slice(2, 4), 16);
            b = Number.parseInt(hex.slice(4, 6), 16);
          } else if (color.startsWith("rgb")) {
            const match = color.match(/\d+/g);
            if (match) {
              r = Number.parseInt(match[0]);
              g = Number.parseInt(match[1]);
              b = Number.parseInt(match[2]);
            }
          }

          // Recolor non-transparent pixels to the specified color
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 128) {
              // If alpha > 128, recolor this pixel
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
            }
          }

          ctx.putImageData(imageData, 0, 0);
          iconImage.image(canvas);
        }
      }

      // Auto-determine position: left if text present, centered if icon-only
      const textWidth = buttonText?.width() ?? 0;
      const hasText = buttonText && textWidth > 0;

      if (hasText) {
        // Icon to the left of text
        const totalContentWidth = this.diconWidth + this.diconGap + textWidth;
        const startX = -totalContentWidth / 2;

        iconImage.offsetX(this.diconWidth / 2);
        iconImage.offsetY(this.diconHeight / 2);
        iconImage.x(startX + this.diconWidth / 2);
        iconImage.y(0);

        buttonText.offsetX(buttonText.width() / 2);
        buttonText.offsetY(buttonText.height() / 2);
        buttonText.x(startX + this.diconWidth + this.diconGap + textWidth / 2);
        buttonText.y(0);
      } else {
        // Icon centered (no text)
        iconImage.offsetX(this.diconWidth / 2);
        iconImage.offsetY(this.diconHeight / 2);
        iconImage.x(0);
        iconImage.y(0);
      }

      button.add(iconImage);
      if (buttonText) {
        button.add(buttonText);
      }
      button.getLayer()?.batchDraw();
    };

    image.onerror = () => {
      // Fallback to text only if image fails to load
      if (buttonText) {
        buttonText.offsetX(buttonText.width() / 2);
        buttonText.offsetY(buttonText.height() / 2);
        button.add(buttonText);
      }
      button.getLayer()?.batchDraw();
    };

    image.src = this.dicon;
  }
}
