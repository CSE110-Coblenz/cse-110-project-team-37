import Konva from "konva";
import type { Tile, TileSuccessors } from "../containers/Tile";
import { BoardLayout } from "../containers/BoardLayout";

/*
 * Class containing 
 */
export class BoardRenderer {

    // Size of each individual tile
    private readonly tileSize = 80;
    private readonly strokeWidth = 6; 
    private readonly tileOffset = this.tileSize + this.strokeWidth / 2 + 10;

    private readonly group : Konva.Group;
    private readonly width : number;
    private readonly height : number;

    private readonly boardLayout : BoardLayout;
    private renderedTileMap = new Map<Tile, {x: number, y: number}>;

    constructor(group: Konva.Group, width: number, heigth: number) {
        this.group = group;
        this.width = width;
        this.height = heigth;

        this.boardLayout = new BoardLayout(this.tileOffset);
    }

    /*
     * Draws all the Tiles.
     * @param startTile - origin tile to draw the board from
     */
    public drawBoard(startTile: Tile) {
        this.boardLayout.computePositions(startTile);
        this.boardLayout.getAllPositions()
            .forEach(({ x, y }, tile) => (
                this.drawTile(tile, x, y)
            ));
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
        this.renderedTileMap.set(tile, {x: dx, y: dy});

        // Selection of renders for different tiles types
        switch (tile.type.type) {
            case "end":
            this.drawEndTile(dx, dy);
            break;
            case "minigame":
            this.drawMinigameTile(dx, dy);
            break;
            default:
            this.drawNormalTile(dx, dy);
        }
    }

    /*
     * Renders End tile
     * @param dx, dy - origin of render
     */
    private drawEndTile(dx: number, dy: number) : void {
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
        this.group.add(elementBox);
    }

    /*
     * Renders Minigame tile
     * @param dx, dy - origin of render
     */
    private drawMinigameTile(dx: number, dy: number) : void {
        const elementBox = new Konva.Rect({
            x: this.width / 2 - this.tileSize / 2 + dx,
            y: this.height / 2 - this.tileSize / 2 + dy,
            width: this.tileSize,
            height: this.tileSize,
            fill: "gray",
            cornerRadius: 2,
            stroke: "black",
            strokeWidth: this.strokeWidth,
        });
        this.group.add(elementBox);
    }

    /*
     * Renders Normal tile
     * @param dx, dy - origin of render
     */
    private drawNormalTile(dx: number, dy: number) : void {
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
        this.group.add(elementBox);
    }

}