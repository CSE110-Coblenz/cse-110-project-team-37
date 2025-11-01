import Konva from "konva";
import type { Tile, TileSuccessors } from "../containers/Tile";

export class BoardRenderer {

    private readonly group : Konva.Group;
    private readonly width : number;
    private readonly height : number;
    private renderedTiles = new Set<Tile>;

    constructor(group: Konva.Group, width: number, heigth: number) {
        this.group = group;
        this.width = width;
        this.height = heigth;
    }
    /*
    Draws the Tile at specified coordinates:
    @param tile - tile to be rendered
    @param dx, dy - relative coordinates to render the tile from.
    */
    public drawTile(tile: Tile, dx: number, dy: number): void {
        // Size of each individual tile
        const tileSize = 80;
        const strokeWidth = 6; 

        if (this.renderedTiles.has(tile)) {
            return;
        }
        this.renderedTiles.add(tile);
        
        let strokeColor: string;
        switch (tile.type.type) {
            case "end":
            strokeColor = "red";
            break;
            case "minigame":
            strokeColor = "blue";
            break;
            default:
            strokeColor = "black";
        }

        const elementBox = new Konva.Rect({
            x: this.width / 2 - tileSize / 2 + dx,
            y: this.height / 2 - tileSize / 2 + dy,
            width: tileSize,
            height: tileSize,
            fill: "white",
            cornerRadius: 2,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
        });
    
        this.group.add(elementBox);
        const directionOffsets: Record<keyof TileSuccessors, [number, number]> = {
            north: [0, -(tileSize+strokeWidth/2)],
            east: [+(tileSize+strokeWidth/2), 0],
            south: [0, +(tileSize+strokeWidth/2)],
        };

        for (const dir of Object.keys(tile.nextTile) as (keyof TileSuccessors)[]) {
            const next = tile.nextTile[dir];
            if (!next) continue;

            const [dxOffset, dyOffset] = directionOffsets[dir];

            this.drawTile(next, dx + dxOffset, dy + dyOffset);
        }
    }


}