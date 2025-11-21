//------------------------------------------
//            Initial Imports
//------------------------------------------

// importing Konva, as this is the view, so this is where front end design will occur
import Konva from "konva";

// values needed so that our x and y coordinates for position are in terms of the entire screen
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import { ButtonFactory } from "../../util/ButtonFactory.ts";

// important models that we will need for the function of the game
import type { Fraction } from "../../models/Fraction.ts";
import type { View } from "../../types.ts";
import type { SpaceRescueModel } from "./SpaceRescueModel";

// define a handler for when a fraction is clicked
type OnFractionClick = (fraction: Fraction) => void;

//------------------------------------------
//              View Class
//------------------------------------------
export class SpaceRescueView implements View {
  // READONLY member variablse
  // defining our group that will display everything
  private readonly group: Konva.Group;

  // THIS IS ESSENTIAL FOR DISPLAYING FRACTIONS PROPERLY
  // each fraction will get its own group to make displaying easier
  private readonly fractionNodes: Map<Fraction, Konva.Group> = new Map();
  private readonly messageText: Konva.Text;
  private readonly gameElementsGroup: Konva.Group;
  private readonly onFractionClick: OnFractionClick;

  // permeable member variables
  // this is just a placeholder where text will change
  private promptText!: Konva.Text;
  // will be using asteroid png's (drew idea from lab)
  private asteroidImage: Konva.Image | null = null;
  private dialogueGroup: Konva.Group | null = null;

  //------------------------------------------
  //              Constructor
  //------------------------------------------
  constructor(model: SpaceRescueModel, onFractionClick: OnFractionClick) {
    // creating new group
    this.group = new Konva.Group({ visible: false });

    // creating group that will contain all visual aspects of the game being played
    // WHY? well, we have a dialogue popup, so when that appears, we don't want to be able to see the asteroids
    // we want this to appear only once the user is ready and presses "start mission"
    this.gameElementsGroup = new Konva.Group({ visible: false });

    this.onFractionClick = onFractionClick;
    // function that creates the background
    this.createBackground();

    this.group.add(this.gameElementsGroup);
    // defining text box. we will fill this depending on certain scenarios
    this.messageText = new Konva.Text({
      visible: false,
    });
    this.group.add(this.messageText);

    // function that creates a prompt
    // why do we need this? to fill the messageText we just defined above
    this.createPrompt();

    // importing image: idea from lab with the lemon
    Konva.Image.fromURL("/asteroid.png", (image) => {
      // assigning member variable the image we loaded
      this.asteroidImage = image;

      // call a function that creates multiple and deals with clicking
      // similar to lemon implementation from lab
      this.createAsteroids(model.asteroids, onFractionClick);

      // draw the layer now that the asteroids have been created
      this.group.getLayer()?.draw();
    });
  }

  //------------------------------------------
  //         Creating game background
  //------------------------------------------
  private createBackground(): void {
    // rectangle that is just the background
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      // space blue color
      fill: "#0A0A20",
    });
    this.group.add(rect);
  }

  //------------------------------------------
  // Creating prompt that lets users know the goal
  //------------------------------------------
  private createPrompt(): void {
    // defining prompt text (now it's all tying in together)
    this.promptText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 50,
      fontSize: 32,
      fill: "white",
      text: "Click the asteroids in order!",
    });
    // centering and adding to group to display
    this.promptText.offsetX(this.promptText.width() / 2);

    // adding to game elements because we do not want this to be seen when the dialogue pop up is showing
    this.gameElementsGroup.add(this.promptText);
  }

  //------------------------------------------
  //    Creating randomly located asteroids
  //------------------------------------------
  private createAsteroids(fractions: Fraction[], onFractionClick: OnFractionClick): void {
    // if there is no image, return because that would cause bad problems
    if (!this.asteroidImage) return;

    // defining constants for style of asteroids
    const center = STAGE_WIDTH / 2;
    const ASTEROID_SIZE = 150;

    // given list of fractions, go through each and do something with them
    fractions.forEach((fraction, index) => {
      // random positioning to simulate drifting
      const x = center + (Math.random() - 0.5) * 400;
      const y = STAGE_HEIGHT * 0.3 + index * 80;

      // creating a group of asteroids
      const asteroidGroup = new Konva.Group({ x, y });

      // type assertion. make sure that the image is a Konva image (to avoid linter issues)
      const asteroidImageSource = this.asteroidImage as Konva.Image;

      // this is where we create the rock (asteroid)
      const rock = asteroidImageSource.clone({
        width: ASTEROID_SIZE,
        height: ASTEROID_SIZE,
        // center the image
        offsetX: ASTEROID_SIZE / 2,
        offsetY: ASTEROID_SIZE / 2,
      }) as Konva.Image;

      // fraction that will go inside the asteroid
      const text = new Konva.Text({
        x: 0,
        y: -10,
        text: fraction.toString(),
        fontSize: 32,
        fill: "black",
      });

      // making sure the text is centered
      text.offsetX(text.width() / 2);

      // adding the rock and the text to the group together
      asteroidGroup.add(rock, text);

      // attaching the handler, as we want game logic to occur when clicking an asteroid
      asteroidGroup.on("click", () => onFractionClick(fraction));

      // stores the visually drawn asteroid group in a map
      this.fractionNodes.set(fraction, asteroidGroup);

      // adding asteroids to game elements because we don't want these to be seen
      this.gameElementsGroup.add(asteroidGroup);
    });
  }

  public createAsteroidsForGame(model: SpaceRescueModel): void {
    if (!this.asteroidImage) {
      console.warn("Asteroid image not loaded yet");
      return;
    }
    this.createAsteroids(model.asteroids, this.onFractionClick);
  }

  //------------------------------------------
  // Updating visuals depending on model updates
  //------------------------------------------
  public updateVisuals(model: SpaceRescueModel): void {
    // we will define an order randomly (ascending or descenging)
    // we will update the text according to which one is chosen
    const orderText =
      model.sortOrder === "ascending" ? "SMALLEST to LARGEST" : "LARGEST to SMALLEST";
    this.promptText.text(
      `Click the asteroids in order: ${orderText} (Next: #${model.getNextTargetIndex() + 1})`,
    );

    // centering the text
    this.promptText.offsetX(this.promptText.width() / 2);

    // visual feedback once asteroid is clicked
    this.fractionNodes.forEach((nodeGroup, fraction) => {
      // if the correct asteroid was clicked
      if (model.getTargetOrder().indexOf(fraction) < model.getNextTargetIndex()) {
        // dim the asteroid to signify success
        nodeGroup.opacity(0.3);
      } else {
        // do not change the asteroid
        nodeGroup.opacity(1.0);
      }
    });

    // redraw the layer
    this.group.getLayer()?.draw();
  }

  //------------------------------------------
  //           Displaying messages
  //------------------------------------------
  public displayMessage(message: string, duration: number = 2000): void {
    // defining message text to the desired message
    this.messageText.text(message);

    // centering the text
    this.messageText.offsetX(this.messageText.width() / 2);

    // make sure users can see the message
    this.messageText.visible(true);

    // redraw the layer
    this.group.getLayer()?.draw();

    // hide the message after the designated time
    setTimeout(() => {
      this.messageText.visible(false);
      this.group.getLayer()?.draw();
    }, duration);
  }

  //------------------------------------------
  //       Creating introductory pop-up
  //------------------------------------------
  public showIntroDialogue(onStart: () => void): void {
    // setting design parameters
    const W = 600;
    const H = 250;
    const X = STAGE_WIDTH / 2 - W / 2;
    const Y = STAGE_HEIGHT / 2 - H / 2;

    // creating dialogue group
    this.dialogueGroup = new Konva.Group({
      x: X,
      y: Y,
      visible: true,
      listening: true,
      opacity: 1.0,
    });

    // creating the 'pop-up' box
    const bgRect = new Konva.Rect({
      width: W,
      height: H,
      fill: "#333366",
      stroke: "#FFFFFF",
      strokeWidth: 4,
      cornerRadius: 10,
    });

    // defining the text
    const missionText = new Konva.Text({
      x: W / 2,
      y: 20,
      text: "MISSION: ASTEROID CLEARANCE",
      fontSize: 28,
      fill: "#FFD700",
      align: "center",
    });
    missionText.offsetX(missionText.width() / 2);

    // 3. Instruction Text
    const instructionText = new Konva.Text({
      x: W / 2,
      y: 80,
      // inserting funny intro message to grab the attention of young users
      text: "Mission control here! Your ship can’t move because a squad of fussy asteroids is hogging the space lanes. They claim they’ll let you pass only if you click them in the proper order. Humor them, clear the path, and save the mission before they start charging toll fees!",
      width: W - 40,
      fontSize: 20,
      fill: "white",
      align: "center",
    });

    // center the text
    instructionText.offsetX(instructionText.width() / 2);

    // using Mikita's wonderful button factory
    const startButton = ButtonFactory.construct()
      .pos(W / 2, H - 30)
      .text("BEGIN RESCUE")
      .backColor("#00CC00")
      .hoverColor("#009900")
      .width(180)
      .height(40)
      .fontSize(20)
      .onClick(onStart)
      .build();

    // adding the dialogue set up to the group
    this.dialogueGroup.add(bgRect, missionText, instructionText, startButton);
    this.group.add(this.dialogueGroup);
    this.group.getLayer()?.draw();
  }

  //------------------------------------------
  //       Hiding introductory pop-up
  //------------------------------------------
  public hideIntroDialogue(): void {
    // if pop up is active, destroy it
    if (this.dialogueGroup) {
      this.dialogueGroup.destroy();
      this.dialogueGroup = null;
      this.group.getLayer()?.draw();
    }

    // then, make the game elements visible
    this.gameElementsGroup.visible(true);
    // redraw the layer
    this.group.getLayer()?.draw();
  }

  // standard show, hide, and getGroup methods
  show() {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }
  hide() {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }
  getGroup() {
    return this.group;
  }
}
