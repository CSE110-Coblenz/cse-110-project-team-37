import { ScreenController, type ScreenSwitcher } from "../../types.ts";

import { BoardScreenModel } from "./BoardScreenModel.ts";
import { BoardScreenView } from "./BoardScreenView.ts";

export class BoardScreenController extends ScreenController {
  private readonly model: BoardScreenModel;
  private readonly view: BoardScreenView;

  private readonly screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new BoardScreenModel();
    this.view = new BoardScreenView(
      () => this.handlePauseClick(),
      () => this.handleDiceClick(),
      this.model,
    );
  }

  private handlePauseClick(): void {
    // TODO Pause placeholder
  }

  private handleDiceClick(): void {
    // this.model.getPlayer().move();
    // this.view.updatePlayerPos(this.model.getPlayer());
    this.screenSwitcher.switchToScreen({ type: "game" });
  }

  getView(): BoardScreenView {
    return this.view;
  }
}
