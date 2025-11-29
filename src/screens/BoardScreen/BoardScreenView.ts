import Konva from "konva";

import { ButtonFactory } from "../../util/ButtonFactory.ts";

import { BoardRenderer } from "./utils/BoardRenderer.ts";

import type { View } from "../../types.ts";
import type { BoardPhase, BoardScreenModel } from "./BoardScreenModel.ts";
import type { Player } from "./containers/Player.ts";
import type { Tile } from "./containers/Tile.ts";

export class BoardScreenView implements View {
  private readonly width = window.innerWidth;
  private readonly height = window.innerHeight;

  // The whole screen group.
  private readonly viewGroup: Konva.Group;
  // Specifically tiles and player render group, good to keep separate for the future (aka camera).
  private readonly boardGroup: Konva.Group;

  public readonly boardRenderer: BoardRenderer;

  private readonly model: BoardScreenModel;
  private readonly onPauseClick: () => void;
  private readonly onDiceClick: () => void;
  private readonly onMoveClick: () => void;

  private pauseButtonGroup: Konva.Group | null = null;
  private diceButtonGroup: Konva.Group | null = null;
  private moveButtonGroup: Konva.Group | null = null;
  private pendingRollTextGroup: Konva.Text | null = null;

  constructor(onPauseClick: () => void, onDiceClick: () => void, onMoveClick: () => void, model: BoardScreenModel) {
    this.viewGroup = new Konva.Group({ visible: true });
    this.boardGroup = new Konva.Group({ visible: true });

    this.viewGroup.add(this.boardGroup);

    this.boardRenderer = new BoardRenderer(this.boardGroup, this.width, this.height);

    this.model = model;
    this.onPauseClick = onPauseClick;
    this.onDiceClick = onDiceClick;
    this.onMoveClick = onMoveClick;

    // Setup the scene
    this.initializeBoard();
  }

  /*
   *Calls all main rendering functions.
   */
  private initializeBoard(): void {
    // Specify the start tile and origin of the board.
    this.boardRenderer.drawBoard(this.model.getStart());
    this.boardGroup.position({ x: -400, y: 0 });

    this.boardRenderer.drawPlayer(this.model.getPlayer());

    // Connect board render elements to a board group.
    this.boardRenderer.renderedTileMap.forEach((tile) => this.boardGroup.add(tile));

    this.boardGroup.add(this.boardRenderer.renderedPlayer);

    // UI buttons
    this.drawPauseButton();
    this.drawDiceButton();
    this.drawMoveButton();

    this.drawPendingRollText();

    this.diceButtonGroup?.show();
  }

  private drawPauseButton(): void {
    this.pauseButtonGroup = ButtonFactory.construct()
      .pos(this.width * 0.9, this.height * 0.1)
      .text("Pause")
      .onClick(this.onPauseClick)
      .build();
    this.viewGroup.add(this.pauseButtonGroup);
  }

  private drawDiceButton(): void {
    this.diceButtonGroup = ButtonFactory.construct()
      .pos(this.width * 0.5, this.height * 0.9)
      .width(200)
      .text("Roll Dice")
      .onClick(this.onDiceClick)
      .build();
    this.viewGroup.add(this.diceButtonGroup);

    this.diceButtonGroup.hide();
  }

  private drawMoveButton(): void {
    this.moveButtonGroup = ButtonFactory.construct()
      .pos(this.width * 0.5, this.height * 0.9)
      .width(200)
      .text("Move!")
      .onClick(this.onMoveClick)
      .build();
    this.viewGroup.add(this.moveButtonGroup);

    this.moveButtonGroup.hide();
  }

  private drawPendingRollText(): void {
    this.pendingRollTextGroup = new Konva.Text({
      x: this.width * 0.49,
      y: this.height * 0.8,
      text: "67",
      fontSize: 48,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    this.viewGroup.add(this.pendingRollTextGroup);

    this.pendingRollTextGroup.hide();
  }

  public updateRollState(pendingRoll: number) {
    this.pendingRollTextGroup?.setText("" + pendingRoll);
    pendingRoll == 0 ? this.pendingRollTextGroup?.hide() : this.pendingRollTextGroup?.show();
  }

  public updatePhaseState(phase: BoardPhase) {
    if (phase === "move") {
      this.diceButtonGroup?.hide();
      this.moveButtonGroup?.show();
    } else {
      this.diceButtonGroup?.show();
      this.moveButtonGroup?.hide();
    }
  }

  /*
   * Updates the position of a player
   * @param player - player object state
   */
  public updatePlayerPos(player: Player): Promise<void> {
    return this.boardRenderer.updatePlayer(player.currentTile);
  }

  /*
   * Changes the zoom on board
   */
  public updateCameraZoom(tile: Tile, factor: number, duration: number): Promise<void> {
    return this.boardRenderer.updateCameraZoom(tile, factor, duration);
  } 

  /*
   * Show the screens
   */
  show(): void {
    this.viewGroup.visible(true);
    this.viewGroup.getLayer()?.draw();
  }

  /*
   * Hide the screen
   */
  hide(): void {
    this.viewGroup.visible(false);
    this.viewGroup.getLayer()?.draw();
  }

  /*
   * Returns view group
   */
  getGroup(): Konva.Group {
    return this.viewGroup;
  }
}
