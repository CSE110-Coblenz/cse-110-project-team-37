import Konva from "konva";

import type { View } from "../../types.ts";

export class BoardScreenView implements View {

    private readonly width = window.innerWidth;
    private readonly height = window.innerHeight;

    private readonly group: Konva.Group;

    constructor() {
        // initializing the group
        this.group = new Konva.Group({ visible: true });

        this.initializeBoard();
    }

    private initializeBoard(): void {
        const TileBox = new Konva.Rect({
            x: this.width / 2 - 20,
            y: this.height / 2 -20,
            width: 40,
            height: 40,
            fill: "white",
            cornerRadius: 2,
            stroke: "black",
            strokeWidth: 4,
        });

        this.group.add(TileBox)
    }

    /**
    * Show the screen
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