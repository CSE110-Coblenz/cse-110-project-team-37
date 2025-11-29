import { ScreenController, type ScreenSwitcher } from "../../types.ts";

import { BoardScreenModel } from "./BoardScreenModel.ts";
import { BoardScreenView } from "./BoardScreenView.ts";
import { Player } from "./containers/Player.ts";
import type { Tile } from "./containers/Tile.ts";

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
    this.view.hideButtons();

    this.model.roll();
    this.model.setPhase("move");

    this.view.updateRollState(this.model.getRoll());
    await this.view.animateDiceJiggle(40);
    this.view.updateRollState(this.model.getRoll());
    this.view.updatePhaseState(this.model.getPhase());
  }

  private async handleMoveClick(): Promise<void> {
    this.view.hideButtons();

    const player: Player = this.model.getPlayer();

    while (this.model.getRoll() > 0) {
      player.move();
      this.model.deacrementRoll();
      this.view.updateRollState(this.model.getRoll());
      await this.view.updatePlayerPos(this.model.getPlayer());
    } 
    
    const cTile: Tile = player.getCurrentTile();

    switch(cTile.getType().type) {
      case "end":
        this.screenSwitcher.switchToScreen({type: "end"});
        break;
      case "minigame1":
        await this.view.updateBoardFade(0.0, 0.8);
        this.screenSwitcher.switchToScreen({type: "minigame1"});
        break;
      case "minigame2":
        await this.view.updateBoardFade(0.0, 0.8);
        this.screenSwitcher.switchToScreen({type: "minigame2"});
        break;
      case "minigame3":
        await this.view.updateBoardFade(0.0, 0.8);
        this.screenSwitcher.switchToScreen({type: "game"});
        break;
      default:
        break;
    }
    
    this.view.updateBoardFade(1.0, 0.0);

    this.model.setPhase("roll");

    this.view.updateRollState(this.model.getRoll());
    this.view.updatePhaseState(this.model.getPhase());
  }

  getView(): BoardScreenView {
    return this.view;
  }
}
