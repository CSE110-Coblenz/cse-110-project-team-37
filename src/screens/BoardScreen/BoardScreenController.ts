import { ScreenController, type ScreenSwitcher } from "../../types.ts";

import { BoardScreenModel } from "./BoardScreenModel.ts";
import { BoardScreenView } from "./BoardScreenView.ts";
import { Player } from "./containers/Player.ts";

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
      () => this.handleMoveClick(),
      this.model,
    );
  }

  /*
   * Updates the position of a camera
   */
  public updateCameraPanning(mousePos: { x: number; y: number }) {
    this.view.boardRenderer.centerCameraOnPlayer(this.model.getPlayer().currentTile, mousePos);
  }

  private handlePauseClick(): void {
    // TODO Pause placeholder
  }

  private async handleDiceClick(): Promise<void> {
    this.model.roll();
    this.model.switchPhase();
    this.view.updateRollState(this.model.getRoll());
    this.view.updatePhaseState(this.model.getPhase());
  }

  private async handleMoveClick(): Promise<void> {
    const player: Player = this.model.getPlayer();

    while (this.model.getRoll() > 0) {
      player.move();
      this.model.deacrementRoll();
      this.view.updateRollState(this.model.getRoll());
      await this.view.updatePlayerPos(this.model.getPlayer());
    } 
    
    switch(player.getCurrentTile().getType().type) {
      case "end":
        this.screenSwitcher.switchToScreen({type: "end"});
        break;
      case "minigame1":
        this.screenSwitcher.switchToScreen({type: "minigame1"});
        break;
      case "minigame2":
        this.screenSwitcher.switchToScreen({type: "minigame2"});
        break;
      case "minigame3":
        this.screenSwitcher.switchToScreen({type: "game"});
        break;
      default:
        break;
    }
    this.model.switchPhase();

    this.view.updateRollState(this.model.getRoll());
    this.view.updatePhaseState(this.model.getPhase());
  }

  getView(): BoardScreenView {
    return this.view;
  }
}
