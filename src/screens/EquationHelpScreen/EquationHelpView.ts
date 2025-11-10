// getting needed imports
import Konva from "konva";

import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";

import type { View } from "../../types.ts";

// handler function type that will signal a click
type OnVideoSelect = (url: string) => void;

// videos to help teach (from Khan Academy)
export const HELP_TOPICS = [
  { operation: "+", title: "Adding Fractions", url: "https://www.youtube.com/watch?v=bcCLKACsYJ0" },
  {
    operation: "-",
    title: "Subtracting Fractions",
    url: "https://www.youtube.com/watch?v=2DPivVFCdqA",
  },
  {
    operation: "*",
    title: "Multiplying Fractions",
    url: "https://www.youtube.com/watch?v=x6xtezhuCZ4",
  },
  {
    operation: "/",
    title: "Dividing Fractions",
    url: "https://www.youtube.com/watch?v=f3ySpxX9oeM",
  },
];

// defining the view
export class EquationHelpScreenView implements View {
  private readonly group: Konva.Group;

  // defining HTML element so we can embed the YouTube videos
  private videoContainer: HTMLDivElement | null = null;
  // 🎯 FIX 1: New property to hold the separate, opaque layer for the Close button
  private closeLayer: Konva.Layer | null = null;

  // 🎯 FIX 2: Property to hold the Back button group for toggling visibility
  private backButtonGroup: Konva.Group | null = null;
  constructor(onVideoSelect: OnVideoSelect, onBackClick: () => void) {
    this.group = new Konva.Group({ visible: false });

    // creating buttons so user can select what they need help with
    this.createTitle();
    this.createHelpButtons(onVideoSelect);

    // back button to return to the screen
    this.createBackButton(onBackClick);
  }

  // title for the page
  private createTitle(): void {
    const title = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 8,
      text: "Fraction Help Topics",
      fontSize: 40,
      fontFamily: "Arial",
      fill: "black",
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);
  }

  // creating buttons
  private createHelpButtons(onVideoSelect: OnVideoSelect): void {
    const BUTTON_WIDTH = 280;
    const BUTTON_HEIGHT = 60;
    const GAP = 25;

    // calculating y poisitioning of each button
    const totalHeight = HELP_TOPICS.length * BUTTON_HEIGHT + (HELP_TOPICS.length - 1) * GAP;
    let currentY = (STAGE_HEIGHT - totalHeight) / 2 - 50;

    // creating group of buttons
    HELP_TOPICS.forEach((topic) => {
      const buttonGroup = new Konva.Group();

      const rect = new Konva.Rect({
        x: STAGE_WIDTH / 2 - BUTTON_WIDTH / 2,
        y: currentY,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        fill: "#F0F0F0",
        stroke: "darkgray",
        strokeWidth: 2,
        cornerRadius: 10,
      });

      // each button will let the user know what topic they will be learning about
      const text = new Konva.Text({
        x: STAGE_WIDTH / 2,
        y: currentY + 18,
        text: `${topic.title}`,
        fontSize: 24,
        fill: "black",
      });

      // offsetting text so that it is centered to the rectangle
      text.offsetX(text.width() / 2);

      buttonGroup.add(rect, text);
      this.group.add(buttonGroup);

      // attaching click handler
      buttonGroup.on("click", () => onVideoSelect(topic.url));

      currentY += BUTTON_HEIGHT + GAP;
    });
  }

  // creating back button so user can go back to teaching options
  private createBackButton(onBackClick: () => void): void {
    const buttonGroup = new Konva.Group();
    const yPos = STAGE_HEIGHT - 60;
    const width = 120;
    const height = 40;

    const rect = new Konva.Rect({
      x: STAGE_WIDTH / 2 - width / 2,
      y: yPos,
      width,
      height,
      fill: "#A0A0A0",
      stroke: "black",
      cornerRadius: 5,
    });

    const text = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: yPos + 10,
      text: "BACK",
      fontSize: 20,
      fill: "black",
    });
    text.offsetX(text.width() / 2);

    buttonGroup.add(rect, text);
    buttonGroup.on("click", onBackClick);
    this.group.add(buttonGroup);

    this.backButtonGroup = buttonGroup;
  }

  // embedding videos
  public showVideoEmbed(url: string): void {
    // Use embed URL format for IFRAME
    const videoUrl = url.replace("watch?v=", "embed/");

    const videoWidth = 800;
    const videoHeight = 450;
    const appContainer = document.getElementById("app");

    if (!appContainer) return;

    // dimming buttons in the background
    this.group.opacity(0.1);

    if (this.backButtonGroup) {
      this.backButtonGroup.visible(false);
    }

    this.group.getLayer()?.draw();

    // creating video container if it doesn't alredy exist
    if (!this.videoContainer) {
      this.videoContainer = document.createElement("div");
      this.videoContainer.id = "video-embed-container";
      this.videoContainer.style.position = "absolute";
      this.videoContainer.style.zIndex = "100";
      appContainer.appendChild(this.videoContainer);
    }

    // cetnering the video
    const left = (window.innerWidth - videoWidth) / 2;
    const top = (window.innerHeight - videoHeight) / 2;

    this.videoContainer.style.width = `${videoWidth}px`;
    this.videoContainer.style.height = `${videoHeight}px`;
    this.videoContainer.style.left = `${left}px`;
    this.videoContainer.style.top = `${top}px`;

    // using HTML to embed the video
    this.videoContainer.innerHTML = `
            <iframe 
                width="${videoWidth}" 
                height="${videoHeight}" 
                src="${videoUrl}?autoplay=1&rel=0" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen
            ></iframe>`;

    this.videoContainer.style.display = "block";

    // creating the close button
    this.createCloseButton();

    // Find the stage and add the new layer
    const stage = this.group.getStage();
    if (this.closeLayer && stage) {
      stage.add(this.closeLayer);
      this.closeLayer.draw();
    }
  }

  public hideVideoEmbed(): void {
    // 1. Hide the HTML element and stop the video playback
    if (this.videoContainer) {
      this.videoContainer.style.display = "none";
      this.videoContainer.innerHTML = "";
    }

    // 2. Remove the Konva close button
    if (this.closeLayer) {
      this.closeLayer.destroy();
      this.closeLayer = null;
    }

    // 3. Restore Konva opacity and redraw
    this.group.opacity(1);
    if (this.backButtonGroup) {
      this.backButtonGroup.visible(true);
    }
    this.group.getLayer()?.draw();
  }

  private createCloseButton(): void {
    if (this.closeLayer) return;

    const buttonGroup = new Konva.Group();
    const yPos = (window.innerHeight + 450) / 2 + 50; // Position below video center
    const width = 180;
    const height = 40;

    const rect = new Konva.Rect({
      x: STAGE_WIDTH / 2 - width / 2,
      y: yPos,
      width,
      height,
      fill: "#fd0404ff", // Red for stop/close
      stroke: "black",
      cornerRadius: 5,
    });

    const text = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: yPos + 10,
      text: "CLOSE VIDEO",
      fontSize: 18,
      fill: "black",
    });
    text.offsetX(text.width() / 2);

    buttonGroup.add(rect, text);

    // IMPORTANT: The handler must call the instance method
    buttonGroup.on("click", () => this.hideVideoEmbed());

    const newCloseLayer = new Konva.Layer();
    newCloseLayer.add(buttonGroup);
    this.closeLayer = newCloseLayer;
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.hideVideoEmbed(); // Ensure video is hidden when the screen is hidden
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
