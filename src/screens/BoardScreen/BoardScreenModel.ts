import { Tile } from "./containers/util/Tile";

export class BoardScreenModel {

    private startingTile: Tile;

    constructor() {
        const c9 = new Tile("c9", {type: "end"}, {north: null, east: null, south: null});
        const c8 = new Tile("c8", {type: "normal"}, {north: null, east: c9, south: null});
        const c7 = new Tile("c7", {type: "normal"}, {north: null, east: c8, south: null});

        const b7 = new Tile("b7", {type: "minigame"}, {north: null, east: null, south: c7});
        const b6 = new Tile("b6", {type: "normal"}, {north: null, east: b7, south: null});
        const b5 = new Tile("b5", {type: "normal"}, {north: null, east: b6, south: null});
        const a5 = new Tile("a5", {type: "normal"}, {north: null, east: null, south: b5});
        const a4 = new Tile("a4", {type: "normal"}, {north: null, east: a5, south: null});
        const a3 = new Tile("a3", {type: "minigame"}, {north: null, east: a4, south: null});
        const b3 = new Tile("b3", {type: "normal"}, {north: a3, east: null, south: null});

        const d7 = new Tile("d7", {type: "normal"}, {north: c7, east: null, south: null});
        const d6 = new Tile("d6", {type: "normal"}, {north: null, east: d7, south: null});
        const d5 = new Tile("d5", {type: "normal"}, {north: null, east: d6, south: null});
        const d4 = new Tile("d4", {type: "normal"}, {north: null, east: d5, south: null});
        const d3 = new Tile("d3", {type: "normal"}, {north: null, east: d4, south: null});

        const c3 = new Tile("c3", {type: "normal"}, {north: b3, east: null, south: d3});
        const c2 = new Tile("c2", {type: "normal"}, {north: null, east: c3, south: null});
        const c1 = new Tile("c1", {type: "normal"}, {north: null, east: c2, south: null});
        
        this.startingTile = c1;
    }

    getStart() : Tile {
        return this.startingTile;
    }
}