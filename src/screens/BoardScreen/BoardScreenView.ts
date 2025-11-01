import Konva from "konva";

import type { View } from "../../types.ts";
import { BoardScreenModel } from "./BoardScreenModel.ts";
import type { Tile, TileSuccessors } from "./containers/util/Tile.ts";

export class BoardScreenView implements View {

    private readonly width = window.innerWidth;
    private readonly height = window.innerHeight;

    private readonly group: Konva.Group;

    private readonly model : BoardScreenModel;

    private renderedTiles = new Set<Tile>;

    constructor(model : BoardScreenModel) {
        // initializing the group
        this.group = new Konva.Group({ visible: true });
        this.model = model;

        this.initializeBoard();
    }

    private initializeBoard(): void {
        var tileIterator : Tile = this.model.getStart();

        this.drawTile(tileIterator, 0, 0);
    }

    private drawTile(tile: Tile, dx: number, dy: number): void {
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

    /**
    * Show the screens)
    */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /**
    * Hide the screen
    */
    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
    
}