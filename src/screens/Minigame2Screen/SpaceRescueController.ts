// importing the screen controller
import { ScreenController } from "../../types.ts";

// we will be using the model and view for the minigame
// to follow the Model-View-Controller format
import { SpaceRescueModel } from "./SpaceRescueModel";
import { SpaceRescueView } from "./SpaceRescueView";

// this game requires clicking on fractions in a certain order, so we will need the fraction model we created
import type { Fraction } from "../../models/Fraction.ts";
// we will need the screenswitcher
import type { ScreenSwitcher } from "../../types.ts";

// class that represents the controller
export class SpaceRescueController extends ScreenController {
  // by nature of MVC, we will need the model and the view in order to get them to interact
  private readonly model: SpaceRescueModel;
  private readonly view: SpaceRescueView;

  // need the screenswitcher so that we can define interactions between various scenes
  private readonly screenSwitcher: ScreenSwitcher;

  private gameStarted: boolean = false;

  // defining our constructor, given a screen switcher object
  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    // initialize screen switcher object
    this.screenSwitcher = screenSwitcher;

    // initialize the model (starts the first round)
    this.model = new SpaceRescueModel();

    // initialize the view, passing the click handler
    this.view = new SpaceRescueView(this.model, (fraction) => this.handleFractionClick(fraction));

    this.view.showIntroDialogue(() => this.startGame());

    this.view.show();
  }

  private startGame(): void {
    this.view.hideIntroDialogue(); // Close the pop-up
    this.gameStarted = true; // Unpause the game state

    this.view.createAsteroidsForGame(this.model);
    // Now update the visuals to render the asteroids and the active prompt
    this.view.updateVisuals(this.model);
  }

  /**
   * Handles a click on any asteroid.
   */
  private handleFractionClick(clickedFraction: Fraction): void {
    if (!this.gameStarted) return;
    // given the fraction in the parameter, we will check if it is correct
    const isCorrect = this.model.checkClick(clickedFraction);

    // if so, update the visual (gray out asteroid)
    if (isCorrect) {
      this.view.updateVisuals(this.model);

      // if all have been clicked
      if (this.model.isRoundComplete()) {
        // display message letting user know that the level has been beat
        this.view.displayMessage("Path Cleared! Bonus earned.", 3000);
        this.screenSwitcher.switchToScreen({ type: "game", difficulty: "easy" });
      }
    } else {
      // if clicked on the wrong asteroid, let user know
      this.view.displayMessage("Incorrect order! Asteroid hit.", 2500);
      // For a simple implementation, you might reset the screen or lose a life.
      this.screenSwitcher.switchToScreen({ type: "menu" });
    }
  }

  // defining getView
  public getView(): SpaceRescueView {
    return this.view;
  }

  public show(): void {
    this.view.show();
  }

  public hide(): void {
    this.view.hide();
  }
}
