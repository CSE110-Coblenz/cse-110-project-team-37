import Konva from "konva";

import { BoardLayout } from "../containers/BoardLayout";

import type { Player } from "../containers/Player";
import type { Tile } from "../containers/Tile";

/*
 * Class containing Render for the board.
 */
export class BoardRenderer {
  // Size of each individual tile
  private readonly tileSize = 120;
  private readonly strokeWidth = 10;
  private readonly tileOffset = this.tileSize + this.strokeWidth / 2 + 10;

  private readonly group: Konva.Group;
  private readonly width: number;
  private readonly height: number;

  private readonly boardLayout: BoardLayout;

  public readonly renderedTileMap = new Map<Tile, Konva.Group>();
  public readonly renderedPlayer = new Konva.Group();

  private cameraTween: Konva.Tween | null = null;

  constructor(group: Konva.Group, width: number, heigth: number) {
    this.group = group;
    this.width = width;
    this.height = heigth;

    this.boardLayout = new BoardLayout(this.tileOffset);
  }

  /*
   * Updates player position, based on the current tile
   * @param tile - players current tile
   */
  public updatePlayer(tile: Tile): Promise<void> {
    return new Promise((resolve) => {
      const playerPos = this.boardLayout.getPosition(tile) ?? { x: 0, y: 0 };

      const playerTween = new Konva.Tween({
        node: this.renderedPlayer,
        duration: 0.4,
        x: playerPos.x,
        y: playerPos.y,
        easing: Konva.Easings.EaseInOut.bind(Konva.Easings),
          onFinish: () => {
          playerTween.destroy();
          resolve();
        }
      });

      playerTween.play();
      this.centerCameraOnPlayer(tile, null);
    })
  }

  /*
   * Moves board layer to simulat camera movement.
   * @param tile - players current tile
   */
  public centerCameraOnPlayer(tile: Tile, mousePos: { x: number; y: number } | null) {
    const playerPos = this.boardLayout.getPosition(tile) ?? { x: 0, y: 0 };

    let panOffsetX = 0;
    let panOffsetY = 0;

    if (mousePos) {
      const offsetXNorm = (mousePos.x - this.width / 2) / (this.width / 2);
      const offsetYNorm = (mousePos.y - this.height / 2) / (this.height / 2);

      const maxPanOffset = 200;

      panOffsetX = offsetXNorm * maxPanOffset;
      panOffsetY = offsetYNorm * maxPanOffset;
    }

    const targetX = -playerPos.x - panOffsetX;
    const targetY = -playerPos.y - panOffsetY;

    if (this.cameraTween) {
      this.cameraTween.pause();
      this.cameraTween = null;
    }

    this.cameraTween = new Konva.Tween({
      node: this.group,
      duration: 0.5,
      x: targetX,
      y: targetY,
      easing: Konva.Easings.EaseInOut.bind(Konva.Easings),
    });

    this.cameraTween.play();
  }

  /*
   * Draws all the Tiles and player on it.
   * @param startTile - origin tile to draw the board from
   */
  public drawBoard(startTile: Tile) {
    this.boardLayout.computePositions(startTile);
    this.boardLayout.getAllPositions().forEach(({ x, y }, tile) => this.drawTile(tile, x, y));
  }

  /*
   * Draws a player on a board.
   * @param player - player object to be rendered
   */
  public drawPlayer(player: Player) {
    const pos = this.boardLayout.getPosition(player.currentTile);
    if (!pos) return;

    const elementBox = new Konva.Circle({
      x: this.width / 2 + pos.x,
      y: this.height / 2 + pos.y,
      width: this.tileSize,
      height: this.tileSize,
      fill: "yellow",
      cornerRadius: 2,
      stroke: "black",
      strokeWidth: this.strokeWidth,
    });

    this.renderedPlayer.add(elementBox);
  }

  /*
   * Draws the Tile at specified coordinates.
   * @param tile - tile to be rendered
   * @param dx, dy - relative coordinates to render the tile from.
   */
  private drawTile(tile: Tile, dx: number, dy: number): void {
    // Avoid redrawing the same tiles twice
    if (this.renderedTileMap.has(tile)) {
      return;
    }

    // Selection of renders for different tiles types
    switch (tile.type.type) {
      case "end":
        this.drawEndTile(tile, dx, dy);
        break;
      case "minigame1":
        this.drawMinigameTile(tile, dx, dy, "#F09090");
        break;
      case "minigame2":
        this.drawMinigameTile(tile, dx, dy, "#90F090");
        break;
      case "minigame3":
        this.drawMinigameTile(tile, dx, dy, "#9090F0");
        break;
      default:
        this.drawNormalTile(tile, dx, dy);
    }
  }

  /*
   * Renders End tile
   * @param tile - associated tile to render
   * @param dx, dy - origin of render
   */
  private drawEndTile(tile: Tile, dx: number, dy: number): void {
    const tileElement = new Konva.Group();
    const elementBox = new Konva.Rect({
      x: this.width / 2 - this.tileSize / 2 + dx,
      y: this.height / 2 - this.tileSize / 2 + dy,
      width: this.tileSize,
      height: this.tileSize,
      fill: "black",
      cornerRadius: 2,
      stroke: "black",
      strokeWidth: this.strokeWidth,
    });
    tileElement.add(elementBox);
    this.renderedTileMap.set(tile, tileElement);
  }

  /*
   * Renders Minigame tile
   * @param tile - associated tile to render
   * @param dx, dy - origin of render
   */
  private drawMinigameTile(tile: Tile, dx: number, dy: number, color: string): void {
    const tileElement = new Konva.Group();
    const elementBox = new Konva.Rect({
      x: this.width / 2 - this.tileSize / 2 + dx,
      y: this.height / 2 - this.tileSize / 2 + dy,
      width: this.tileSize,
      height: this.tileSize,
      fill: color,
      cornerRadius: 2,
      stroke: "black",
      strokeWidth: this.strokeWidth,
    });
    tileElement.add(elementBox);
    this.renderedTileMap.set(tile, tileElement);
  }

  /*
   * Renders Normal tile
   * @param tile - associated tile to render
   * @param dx, dy - origin of render
   */
  private drawNormalTile(tile: Tile, dx: number, dy: number): void {
    const tileElement = new Konva.Group();
    const elementBox = new Konva.Rect({
      x: this.width / 2 - this.tileSize / 2 + dx,
      y: this.height / 2 - this.tileSize / 2 + dy,
      width: this.tileSize,
      height: this.tileSize,
      fill: "white",
      cornerRadius: 2,
      stroke: "black",
      strokeWidth: this.strokeWidth,
    });
    tileElement.add(elementBox);
    this.renderedTileMap.set(tile, tileElement);
  }
}
