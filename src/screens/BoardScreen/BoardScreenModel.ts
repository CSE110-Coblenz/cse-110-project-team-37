import { Player } from "./containers/Player";
import { BoardGenerator } from "./utils/BoardGenerator";

import type { Tile } from "./containers/Tile";
import { DiceService } from "../../services/DiceService";

export type BoardPhase = "roll" | "move";

export class BoardScreenModel {
  private readonly player: Player;
  private readonly startingTile: Tile;

  private phase: BoardPhase;
  private pendingRoll: number;

  /*
   * Constructor for class and board generation.
   */
  constructor() {
    const boardGen = new BoardGenerator(0.2, 0.05);

    this.startingTile = boardGen.generateLineBoard(40);
    this.player = new Player("playboy", this.startingTile);

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
   * Deacteses pending roll value by 1
   */
  deacrementRoll() {
    this.pendingRoll -= 1;
  }

  /*
   * Returns
   */
  getPlayer(): Player {
    return this.player;
  }

  /*
   * Returns the starting tile, origin of board render and player position.
   */
  getStart(): Tile {
    return this.startingTile;
  }
}
