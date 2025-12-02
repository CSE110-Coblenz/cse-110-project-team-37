import { Tile, type TileSuccessors, type TileType } from "../containers/Tile";

/*
 * Class containing Generator for the BoardScreenModel
 */
export class BoardGenerator {
  private readonly minigameChance: number;
  private readonly branchChance: number;

  constructor(minigameChance: number, branchChance: number) {
    this.minigameChance = minigameChance;
    this.branchChance = branchChance;
  }

  public generateLineBoard(n: number): {start: Tile, minigame: Tile} {
    const endTile = new Tile(`t_end`, { type: "end" }, { north: null, east: null, south: null });
    let firstMinigame = endTile;
    let next = endTile;

    for (let i = n - 1; i >= 1; i--) {
      const isMinigame = Math.random() < this.minigameChance;

      let type: TileType = { type: "normal" };

      if (isMinigame) {
        switch (Math.floor(Math.random() * 3)) {
          case 1:
            type = { type: "minigame1" };
            break;
          case 2:
            type = { type: "minigame2" };
            break;
          case 3:
            type = { type: "minigame3" };
            break;
          default:
            type = { type: "minigame3" };
            break;
        }
      }

      const successors: TileSuccessors = { north: null, east: null, south: null };

      const randBranch = Math.random();
      if (randBranch < this.branchChance) {
        successors.north = next;
      } else if (randBranch > 1 - this.branchChance) {
        successors.south = next;
      } else {
        successors.east = next;
      }

      const tile = new Tile(`t_${i}`, type, successors);
      next = tile;

      if (isMinigame) {
        firstMinigame = next;
      }
    }

    return {start: next, minigame: firstMinigame};
  }
}
