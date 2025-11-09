import { ScreenController } from "../../types.ts";

import { EquationHelpScreenView } from "./EquationHelpView.ts";

import type { ScreenSwitcher } from "../../types.ts";

/**
 * HelpScreenController - Manages interactions and state for the help screen.
 */
export class EquationHelpScreenController extends ScreenController {
  // Properties are marked readonly as they are only set in the constructor.
  private readonly view: EquationHelpScreenView;
  private readonly screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    // Initialize the View and pass the two necessary handler functions.
    this.view = new EquationHelpScreenView(
      // Handler for when a specific video topic is clicked
      (url) => this.handleVideoSelect(url),
      // Handler for when the "BACK" button is clicked
      () => this.handleBackClick(),
    );
  }

  /**
   * Handles the selection of a video topic button.
   * Tells the view to display the embedded HTML video player.
   * @param url The YouTube URL of the video selected.
   */
  private handleVideoSelect(url: string): void {
    // The View handles creating, positioning, and displaying the HTML iframe.
    this.view.showVideoEmbed(url);
  }

  /**
   * Handles the click of the "BACK" or "CLOSE" button.
   * 1. Ensures the video player is hidden.
   * 2. Routes the user back to the main menu screen.
   */
  private handleBackClick(): void {
    // Before switching screens, ensure the video embed is completely cleared from the DOM.
    this.view.hideVideoEmbed();

    // Route back to the main menu screen.
    this.screenSwitcher.switchToScreen({ type: "menu" });
  }

  /**
   * Get the view (Required by ScreenController base class).
   */
  public getView(): EquationHelpScreenView {
    return this.view;
  }
}
