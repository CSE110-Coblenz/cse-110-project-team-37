import type { Tile } from "./Tile";

/*
 * BoardLayout is responsible for assigning 2D coordinates to tiles
 * based on their directional relationships.
 */
export class BoardLayout {
  private readonly positions = new Map<Tile, { x: number; y: number }>();
  private readonly step : number; // distance between tiles in pixels

  constructor(step: number) {
    this.step = step;
  }

  /*
   * Computes position of each tile relative to origin in pixels.
   * @param startTile - origin of traverse
   */
  public computePositions(startTile: Tile): void {
    this.positions.clear();
    this.traverse(startTile, 0, 0);
  }

  /*
   * DFS algorithm cycling through successors fo the tiles.
   * @param tile - origin tile
   * @param x, y - origin tile coordinates
   */
  private traverse(tile: Tile, x: number, y: number): void {
    if (this.positions.has(tile)) return;

    this.positions.set(tile, { x, y });

    // Recursively position successors
    if (tile.nextTile.east) this.traverse(tile.nextTile.east, x + this.step, y);
    if (tile.nextTile.north) this.traverse(tile.nextTile.north, x, y - this.step);
    if (tile.nextTile.south) this.traverse(tile.nextTile.south, x, y + this.step);
  }

  /*
   * Returns coordinate of a provided tile.
   * @param tile - tile to be found
   */
  getPosition(tile: Tile): { x: number; y: number } | undefined {
    return this.positions.get(tile);
  }

  /*
   *Returns a map of all tiles positions.
   */
  getAllPositions(): Map<Tile, { x: number; y: number }> {
    return this.positions;
  }
}