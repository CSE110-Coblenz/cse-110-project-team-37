import { DiceService } from "../../services/DiceService";

import { Player } from "./containers/Player";
import { BoardGenerator } from "./utils/BoardGenerator";

import type { GameState } from "../../models/GameState";
import type { Tile } from "./containers/Tile";

export type BoardPhase = "roll" | "move";

export class BoardScreenModel {
  private readonly gameState: GameState;

  private readonly player: Player;
  private readonly monster: Player;
  private readonly startingTile: Tile;
  private readonly minigameTile: Tile;
  private phase: BoardPhase;
  private pendingRoll: number;

  /*
   * Constructor for class and board generation.
   */
  constructor(gameState: GameState) {
    this.gameState = gameState;
    const boardGen = new BoardGenerator(0.3, 0.08);

    const genData = boardGen.generateLineBoard(40);
    this.startingTile = genData.start;
    this.minigameTile = genData.minigame;
    this.player = new Player("playboy", this.startingTile);
    this.monster = new Player("jefry", this.startingTile);

    this.phase = "roll";
    this.pendingRoll = 0;
  }

  /*
   * Changes current state
   */
  setPhase(phase: BoardPhase) {
    this.phase = phase;
  }

  /*
   * Roll a d6 dice.
   */
  roll() {
    this.pendingRoll = DiceService.rollDice(6);
  }

  /*
   * Get current pending roll value
   */
  getRoll(): number {
    return this.pendingRoll;
  }

  /*
   * Get current phase
   */
  getPhase(): BoardPhase {
    return this.phase;
  }

  /*
   * Deacteses roll value by 1
   */
  deacrementRoll() {
    if (this.gameState.getBonus() > 0) {
      this.gameState.addBonus(-1);
    } else {
      this.pendingRoll -= 1;
    }
  }

  /*
   * Returns player
   */
  getPlayer(): Player {
    return this.player;
  }

  /*
   * Returns monster
   */
  getMonster(): Player {
    return this.monster;
  }

  /*
   * Returns the starting tile, origin of board render and player position.
   */
  getStart(): Tile {
    return this.startingTile;
  }

  /*
   * Returns the first encountered Minigame Tile.
   */
  getFirstMinigame(): Tile {
    return this.minigameTile;
  }
}
