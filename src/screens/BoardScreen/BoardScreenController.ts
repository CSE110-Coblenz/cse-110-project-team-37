import { DiceService } from "../../services/DiceService.ts";
import { SleeperService } from "../../services/SleeperSerive.ts";
import { ScreenController, type ScreenSwitcher } from "../../types.ts";

import { BoardScreenModel } from "./BoardScreenModel.ts";
import { BoardScreenView } from "./BoardScreenView.ts";

import type { GameState } from "../../models/GameState.ts";
import type { Player } from "./containers/Player.ts";
import type { Tile } from "./containers/Tile.ts";

export class BoardScreenController extends ScreenController {
  private readonly model: BoardScreenModel;
  private readonly view: BoardScreenView;

  private readonly gameState: GameState;

  private readonly screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, gameState: GameState) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.gameState = gameState;
    this.model = new BoardScreenModel(gameState);
    this.view = new BoardScreenView(
      () => this.handlePauseClick(),
      async () => this.handleDiceClick(),
      async () => this.handleMoveClick(),
      this.model,
    );
  }

  /*
   * Updates the position of a camera
   */
  public async updateCameraPanning(mousePos: { x: number; y: number }) {
    await this.view.boardRenderer.centerCameraOnPlayer(
      this.model.getPlayer().currentTile,
      mousePos,
    );
  }

  private handlePauseClick(): void {
    // TODO Pause placeholder
  }

  private async handleDiceClick(): Promise<void> {
    this.view.hideButtons();

    this.model.roll();
    this.model.setPhase("move");

    this.view.updateRollState(this.model.getRoll(), this.gameState.getBonus());
    await this.view.animateDiceJiggle(40);
    this.view.updateRollState(this.model.getRoll(), this.gameState.getBonus());

    this.gameState.incrementTurn();
    await this.handleMonsterActions();
    await this.checkMonsterCatch();
    this.view.updatePhaseState(this.model.getPhase());
  }

  private async handleMoveClick(): Promise<void> {
    this.view.hideButtons();

    const player: Player = this.model.getPlayer();

    while (this.model.getRoll() > 0) {
      player.move();
      this.model.deacrementRoll();
      this.view.updateRollState(this.model.getRoll(), this.gameState.getBonus());

      /* eslint-disable-next-line no-await-in-loop */
      await this.view.updatePlayerPos(this.model.getPlayer());
    }

    const cTile: Tile = player.getCurrentTile();

    switch (cTile.getType().type) {
      case "end":
        this.screenSwitcher.switchToScreen({ type: "end" });
        break;
      case "minigame1":
        await this.view.updateBoardFade(0.0, 0.8);
        this.screenSwitcher.switchToScreen({ type: "minigame1" });
        break;
      case "minigame2":
        await this.view.updateBoardFade(0.0, 0.8);
        this.screenSwitcher.switchToScreen({ type: "minigame2" });
        break;
      case "minigame3":
        await this.view.updateBoardFade(0.0, 0.8);
        this.screenSwitcher.switchToScreen({ type: "game" });
        break;
      default:
        break;
    }

    await this.view.updateBoardFade(1.0, 0.0);

    this.model.setPhase("roll");

    this.view.updateRollState(this.model.getRoll(), this.gameState.getBonus());
    this.view.updatePhaseState(this.model.getPhase());
  }

  private async handleMonsterActions(): Promise<void> {
    if (this.gameState.getTurnCount() === 2) {
      this.view.hideButtons();
      this.view.showMonster();
      await Promise.resolve(
        this.view.boardRenderer.centerCameraOnPlayer(this.model.getMonster().currentTile, null),
      );
      await SleeperService.sleep(1500);
      await Promise.resolve(
        this.view.boardRenderer.centerCameraOnPlayer(this.model.getPlayer().currentTile, null),
      );
      this.view.updatePhaseState(this.model.getPhase());
    }

    if (this.gameState.getTurnCount() > 2) {
      for (let i = 0; i < DiceService.rollDice(6); i++) {
        this.model.getMonster().move();
      }

      await this.view.updateMonsterPos(this.model.getMonster());
    }
  }

  private async checkMonsterCatch(): Promise<void> {
    if (
      !this.model.getMonster().isAheadOf(this.model.getPlayer()) &&
      this.gameState.getTurnCount() > 2
    ) {
      this.view.hideButtons();
      await SleeperService.sleep(1500);
      this.screenSwitcher.switchToScreen({ type: "end" });
    }
  }

  getView(): BoardScreenView {
    return this.view;
  }
}
