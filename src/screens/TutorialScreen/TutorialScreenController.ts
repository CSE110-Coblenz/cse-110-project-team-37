import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import { ScreenController } from "../../types.ts";

import { TutorialModel } from "./TutorialScreenModel.ts";
import { TutorialScreenView } from "./TutorialScreenView.ts";

import type { ScreenSwitcher } from "../../types.ts";

/**
 * TutorialScreenController - Coordinates game logic for View
 */
export class TutorialScreenController extends ScreenController {
  private readonly view: TutorialScreenView;
  private readonly model: TutorialModel;
  private readonly screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.model = new TutorialModel();
    this.screenSwitcher = screenSwitcher;

    this.view = new TutorialScreenView(STAGE_WIDTH, STAGE_HEIGHT, {
      onClose: () => this.handleClose(),
      onAdvance: () => this.handleAdvance(),
    });
  }

  private handleClose(): void {
    const prev = this.screenSwitcher.getTutorialPrevious();
    this.screenSwitcher.switchToScreen({ type: prev ?? "menu" });
  }

  private handleAdvance(): void {
    if (this.view.isTyping()) {
      this.view.finishTyping();
      return;
    }
    const next = this.model.advance();
    if (next) {
      this.view.startTyping(next);
    } else {
      const prev = this.screenSwitcher.getTutorialPrevious();
      this.screenSwitcher.switchToScreen({ type: prev ?? "menu" });
    }
  }

  private startFirstLine(): void {
    this.model.reset();
    const line = this.model.getCurrentLine();
    if (line) {
      this.view.startTyping(line);
    }
  }

  override show(): void {
    this.view.getGroup().visible(true);
    this.startFirstLine();
  }

  override hide(): void {
    this.view.getGroup().visible(false);
  }

  /**
   * Get the view group
   */
  getView(): TutorialScreenView {
    return this.view;
  }
}
