import Konva from "konva";

import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";

import type { Fraction } from "../../models/Fraction.ts";
import type { View } from "../../types.ts";

export class QuestionScreenView implements View {
  private readonly group: Konva.Group;
  private expressionText: Konva.Text | undefined;
  private readonly answerButtons: Konva.Group[] = [];
  private readonly answerTexts: Konva.Text[] = [];

  /**
   * constructs new QuestionScreenView
   */
  constructor(onAnswerClick: (index: number) => void, onHelpClick: () => void) {
    // initializes the main group (hidden by default)
    this.group = new Konva.Group({ visible: false });

    // creates view components
    this.createExpressionBox();
    this.createAnswerButtons(onAnswerClick);
    this.createHelpButton(onHelpClick);
  }

  /**
   * creates display box for the question
   */
  private createExpressionBox(): void {
    const box = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 200,
      y: STAGE_HEIGHT / 5 - 50,
      width: 400,
      height: 150,
      fill: "white",
      stroke: "black",
      strokeWidth: 2,
    });
    this.group.add(box);

    this.expressionText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 5,
      fontSize: 32,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });

    this.expressionText.offsetX(this.expressionText.width() / 2);
    this.group.add(this.expressionText);
  }

  /**
   * creates four answer choice buttons, each button displays a fraction and
   * triggers the onAnswerClick callback when clicked
   */
  private createAnswerButtons(onAnswerClick: (index: number) => void): void {
    const buttonWidth = 150;
    const buttonHeight = 100;
    const spacing = 20;

    // calculate starting X position to center all buttons
    const startX = (STAGE_WIDTH - (4 * buttonWidth + 3 * spacing)) / 2;
    const yPos = (STAGE_HEIGHT * 3) / 5;

    for (let i = 0; i < 4; i++) {
      const buttonGroup = new Konva.Group();

      const button = new Konva.Rect({
        x: startX + i * (buttonWidth + spacing),
        y: yPos,
        width: buttonWidth,
        height: buttonHeight,
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
      });
      buttonGroup.add(button);

      const answerText = new Konva.Text({
        x: startX + i * (buttonWidth + spacing) + buttonWidth / 2,
        y: yPos + buttonHeight / 2 - 10,
        text: "?/?",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "black",
        align: "center",
      });
      answerText.offsetX(answerText.width() / 2);
      buttonGroup.add(answerText);
      this.answerTexts.push(answerText);

      // attach click handler that calls the callback with this button's index
      buttonGroup.on("click", () => onAnswerClick(i));

      // store button group for later reference (feedback flashing)
      this.answerButtons.push(buttonGroup);
      this.group.add(buttonGroup);
    }
  }

  // creating a help button so that users can get a refresher as to how to solve certain equations
  // meant to teach users process, not give answers away
  private createHelpButton(onHelpClick: () => void): void {
    // determining dimensions for help button
    const HELP_BUTTON_WIDTH = 150;
    const HELP_BUTTON_HEIGHT = 70;
    const helpButtonGroup = new Konva.Group();

    // desigining the button
    const helpButton = new Konva.Rect({
      x: STAGE_WIDTH / 2 + HELP_BUTTON_WIDTH / 2,
      y: (STAGE_HEIGHT * 4) / 5,
      width: HELP_BUTTON_WIDTH,
      height: HELP_BUTTON_HEIGHT,
      fill: "#EEE",
      stroke: "black",
      cornerRadius: 5,
    });

    helpButton.offsetX(HELP_BUTTON_WIDTH);

    // text that goes inside the button
    const helpText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: (STAGE_HEIGHT * 4) / 5 + HELP_BUTTON_HEIGHT / 4,
      text: "HELP",
      fontSize: 36,
      fill: "black",
      align: "center",
    });
    helpText.offsetX(helpText.width() / 2);

    // adding button to the group
    helpButtonGroup.add(helpButton, helpText);

    // attaching handler
    helpButtonGroup.on("click", onHelpClick);

    this.group.add(helpButtonGroup);
  }

  /**
   * updates the displayed question
   */
  updateExpression(expression: string): void {
    if (this.expressionText) {
      this.expressionText.text(expression);
      // Re-center the text after updating (width may have changed)
      this.expressionText.offsetX(this.expressionText.width() / 2);
    }
  }

  /**
   * updates the answer choices
   */
  updateAnswerChoices(choices: Fraction[]): void {
    choices.forEach((choice, i) => {
      if (this.answerTexts[i]) {
        this.answerTexts[i].text(`${choice.numerator}/${choice.denominator}`);
        this.answerTexts[i].offsetX(this.answerTexts[i].width() / 2);
      }
    });
  }

  /**
   * flashes the answer choice green for correct answers or red for incorrect
   */
  flashFeedback(isCorrect: boolean, buttonIndex: number): void {
    const button = this.answerButtons[buttonIndex];
    const rect = button.findOne("Rect") as Konva.Rect;

    if (rect) {
      // save the original color
      const originalFill = rect.fill();
      // change to green or red
      rect.fill(isCorrect ? "lightgreen" : "lightcoral");
      rect.getLayer()?.draw();

      // restore original color after 500ms
      setTimeout(() => {
        rect.fill(originalFill);
        rect.getLayer()?.draw();
      }, 500);
    }
  }

  /**
   * makes question screen visible, required by the View interface
   */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  /**
   * hides the question screen, required by the View interface
   */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  /**
   * returns the konva group containing all view elements, equired by the View interface
   */
  getGroup(): Konva.Group {
    return this.group;
  }
}
