import { Player } from "./containers/Player";
import { BoardGenerator } from "./utils/BoardGenerator";

import type { Tile } from "./containers/Tile";

export class BoardScreenModel {
  private readonly player: Player;
  private readonly startingTile: Tile;

  /*
   * Constructor for class and board generation.
   */
  constructor() {
    const boardGen = new BoardGenerator(0.2, 0.05);

    this.startingTile = boardGen.generateLineBoard(40);
    this.player = new Player("playboy", this.startingTile);
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
