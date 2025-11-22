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

  // permeable member variables
  // this is just a placeholder where text will change
  private promptText!: Konva.Text;
  // will be using asteroid png's (drew idea from lab)
  private asteroidImage: Konva.Image | null = null;
  private dialogueGroup: Konva.Group | null = null;
  private endPopupGroup: Konva.Group | null = null;
  private timerShip: Konva.Image | null = null;
  private timerTween: Konva.Tween | null = null;

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

    // function that creates the background
    this.createBackground();

    // adding game elements to the group
    // ORDER MATTERS. important to do background first, then game
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

    Konva.Image.fromURL("/spaceship.png", (image) => {
      this.timerShip = image;
      this.timerShip.width(120);
      this.timerShip.height(60);
      this.timerShip.y(20); // top of the screen
      this.timerShip.x(0); // start at left

      this.gameElementsGroup.add(this.timerShip);
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

  private onTimerEnd!: () => void;

  public setTimerEndHandler(handler: () => void) {
    this.onTimerEnd = handler;
  }

  private setupTimerTween() {
    if (!this.timerShip) return;

    this.timerTween = new Konva.Tween({
      node: this.timerShip,
      x: STAGE_WIDTH - 150, // stops near the right side
      duration: 12, // 12-second timer
      onFinish: () => this.onTimerEnd(),
    });
  }

  public startTimer(): void {
    if (!this.timerTween) {
      this.setupTimerTween();
    }
    this.timerTween?.play();
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
    if (!this.asteroidImage) return;

    const center = STAGE_WIDTH / 2;
    const ASTEROID_SIZE = 250;

    fractions.forEach((fraction, index) => {
      const x = center + (Math.random() - 0.5) * 1200;
      const y = STAGE_HEIGHT / 5.5 + index * 160; // spread out more vertically

      const asteroidGroup = new Konva.Group({ x, y });
      const asteroidImageSource = this.asteroidImage as Konva.Image;

      const rock = asteroidImageSource.clone({
        width: ASTEROID_SIZE,
        height: ASTEROID_SIZE,
        offsetX: ASTEROID_SIZE / 2,
        offsetY: ASTEROID_SIZE / 2,
      }) as Konva.Image;

      const text = new Konva.Text({
        x: 0,
        y: -10,
        text: fraction.toString(),
        fontSize: 32,
        fill: "black",
      });
      text.offsetX(text.width() / 2);

      asteroidGroup.add(rock, text);

      asteroidGroup.on("click", () => {
        this.runClickAnimation(asteroidGroup);
        onFractionClick(fraction);
      });

      asteroidGroup.on("mouseenter", () => {
        document.body.style.cursor = "pointer";
        new Konva.Tween({
          node: asteroidGroup,
          scaleX: 1.12,
          scaleY: 1.12,
          duration: 0.15,
        }).play();
      });

      asteroidGroup.on("mouseleave", () => {
        document.body.style.cursor = "default";
        new Konva.Tween({
          node: asteroidGroup,
          scaleX: 1,
          scaleY: 1,
          duration: 0.15,
        }).play();
      });

      // store group for later lookup
      this.fractionNodes.set(fraction, asteroidGroup);

      // add asteroid to layer
      this.gameElementsGroup.add(asteroidGroup);

      // ⭐ ADD DRIFT + ROTATION ANIMATION HERE
      this.addDriftAnimation(asteroidGroup, rock);
    });
  }

  private addDriftAnimation(group: Konva.Group, rock: Konva.Image) {
    // gentle random drift
    const driftX = (Math.random() - 0.5) * 50;
    const driftY = (Math.random() - 0.5) * 50;

    new Konva.Tween({
      node: group,
      x: group.x() + driftX,
      y: group.y() + driftY,
      duration: 4 + Math.random() * 2,
      yoyo: true,
      repeat: Infinity,
    }).play();

    // slow rotation on the rock image itself
    new Konva.Tween({
      node: rock,
      rotation: 10 + Math.random() * 20,
      duration: 5 + Math.random() * 2,
      yoyo: true,
      repeat: Infinity,
    }).play();
  }

  private runClickAnimation(asteroidGroup: Konva.Group) {
    // pop up slightly
    new Konva.Tween({
      node: asteroidGroup,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 0.12,
      onFinish: () => {
        // return to normal size
        new Konva.Tween({
          node: asteroidGroup,
          scaleX: 1,
          scaleY: 1,
          duration: 0.12,
        }).play();
      },
    }).play();
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

  private showEndPopup(
    title: string,
    message: string,
    buttonText: string,
    onButtonClick: () => void,
    theme: "success" | "failure" = "failure",
  ): void {
    const W = 600;
    const H = 260;
    const X = STAGE_WIDTH / 2 - W / 2;
    const Y = STAGE_HEIGHT / 2 - H / 2;

    // 🟩 SUCCESS THEME
    const successColors = {
      bg: "#1e3320",
      stroke: "#55ff55",
      title: "#66ff66",
      button: "#00aa00",
      buttonHover: "#008800",
    };

    // 🟥 FAILURE THEME
    const failureColors = {
      bg: "#331a1a",
      stroke: "#ff5555",
      title: "#ff6666",
      button: "#cc0000",
      buttonHover: "#990000",
    };

    // pick theme colors
    const c = theme === "success" ? successColors : failureColors;

    this.gameElementsGroup.listening(false);

    const popup = new Konva.Group({
      x: X,
      y: Y,
      visible: true,
      listening: true,
    });

    const bgRect = new Konva.Rect({
      width: W,
      height: H,
      fill: c.bg,
      stroke: c.stroke,
      strokeWidth: 4,
      cornerRadius: 12,
    });

    const titleText = new Konva.Text({
      x: W / 2,
      y: 20,
      text: title,
      fontSize: 30,
      fill: c.title,
      align: "center",
    });
    titleText.offsetX(titleText.width() / 2);

    const bodyText = new Konva.Text({
      x: W / 2,
      y: 80,
      width: W - 40,
      text: message,
      fontSize: 20,
      fill: "white",
      align: "center",
    });
    bodyText.offsetX(bodyText.width() / 2);

    const button = ButtonFactory.construct()
      .pos(W / 2, H - 40)
      .text(buttonText)
      .width(200)
      .height(45)
      .fontSize(22)
      .backColor(c.button)
      .hoverColor(c.buttonHover)
      .onClick(onButtonClick)
      .build();

    popup.add(bgRect, titleText, bodyText, button);
    this.group.add(popup);
    this.endPopupGroup = popup;

    this.group.getLayer()?.draw();
  }

  public showFailurePopup(onReturn: () => void): void {
    this.showEndPopup(
      "Mission Failed!",
      "The ship ran out of time before you cleared the asteroids.",
      "Return to Game",
      onReturn,
      "failure",
    );
  }

  public showSuccessPopup(onReturn: () => void): void {
    this.showEndPopup(
      "Mission Success!",
      "You've cleared all asteroids! Excellent work, pilot!",
      "Return to Game",
      onReturn,
      "success",
    );
  }

  public hideEndPopup(): void {
    if (this.endPopupGroup) {
      this.endPopupGroup.destroy();
      this.endPopupGroup = null;
      this.gameElementsGroup.listening(true); // Re-enable game element listening
      this.group.getLayer()?.draw();
    }
  }

  public stopTimer() {
    this.timerTween?.pause();
  }

  public clearAndSetupNewRound(model: SpaceRescueModel, onFractionClick: OnFractionClick): void {
    // 1. Destroy all current asteroid groups from the display
    this.fractionNodes.forEach((nodeGroup) => nodeGroup.destroy());
    this.fractionNodes.clear(); // Clear the map reference

    // 2. Re-create the new asteroids based on the reset model
    // The createAsteroids logic handles the new click handler automatically
    this.createAsteroids(model.asteroids, onFractionClick);

    // 3. Reset the timer ship position and tween state
    if (this.timerShip) {
      this.timerShip.x(0);
      this.timerTween?.pause(); // ensure old tween is paused
      // Destroy the old tween to ensure duration/reset logic works if needed
      this.timerTween?.destroy();
      this.timerTween = null; // force re-creation of tween for duration reset
    }

    // 4. Update visuals (the prompt text) will be handled by the controller calling startGame

    // 5. Hide game elements and show dialogue (caller will handle this)
    this.gameElementsGroup.visible(false);

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
