import Konva from "konva";

import type { View } from "../../types.ts";
import { BoardScreenModel } from "./BoardScreenModel.ts";
import type { Tile } from "./containers/Tile.ts";
import { BoardRenderer } from "./utils/BoardRenderer.ts";
import { BoardLayout } from "./containers/BoardLayout.ts";
import type { Player } from "./containers/Player.ts";

export class BoardScreenView implements View {

    private readonly width = window.innerWidth;
    private readonly height = window.innerHeight;

    // The whole screen group.
    private readonly viewGroup : Konva.Group;
    // Specifically tiles and player render group, good to keep separate for the future (aka camera).
    private readonly boardGroup : Konva.Group;

    private readonly boardRenderer : BoardRenderer;

    private readonly model : BoardScreenModel;
    private readonly onPauseClick : () => void;
    private readonly onDiceClick : () => void;

    constructor(
        onPauseClick: () => void,
        onDiceClick: () => void,
        model : BoardScreenModel) {

        this.viewGroup = new Konva.Group({ visible: true });
        this.boardGroup = new Konva.Group({ visible: true });

        this.viewGroup.add(this.boardGroup);

        this.boardRenderer = new BoardRenderer(this.boardGroup, this.width, this.height);

        this.model = model;
        this.onPauseClick = onPauseClick;
        this.onDiceClick = onDiceClick;

        // Setup the scene
        this.initializeBoard();
    }

    /*
     *Calls all main rendering functions.
     */
    private initializeBoard(): void {

        // Specify the start tile and origin of the board.
        this.boardRenderer.drawBoard(this.model.getStart());
        this.boardGroup.position({x: -400,y: 0})

        this.boardRenderer.drawPlayer(this.model.getPlayer());

        // Connect board render elements to a board group.
        this.boardRenderer.renderedTileMap
            .forEach(tile => (
                this.boardGroup.add(tile)
            ));

        this.boardGroup.add(this.boardRenderer.renderedPlayer);

        // UI buttons
        this.drawPauseButton();
        this.drawDiceButton();
    }

    // TODO Create a Button factory to avoid duplicates as this
    private drawPauseButton() : void {
            const pauseButtonGroup = new Konva.Group();
        
            const pauseButton = new Konva.Rect({
              x: this.width - 100,
              y: 100,
              width: 60,
              height: 60,
              fill: "gray",
              cornerRadius: 10,
              stroke: "black",
              strokeWidth: 2,
            });
        
            const pauseText = new Konva.Text({
              x: this.width - 100,
              y: 100,
              text: "P",
              fontSize: 24,
              fontFamily: "Arial",
              fill: "white",
              align: "center",
            });
        
            pauseButton.offsetX(pauseButton.width() / 2);
            pauseText.offsetX(pauseText.width() / 2);
            pauseButton.offsetY(pauseButton.height() / 2);
            pauseText.offsetY(pauseText.height() / 2);
            pauseButtonGroup.add(pauseButton);
            pauseButtonGroup.add(pauseText);
            pauseButtonGroup.on("click", this.onPauseClick);
            this.viewGroup.add(pauseButtonGroup);
    }

    // TODO Create a Button factory to avoid duplicates as this
    private drawDiceButton() : void {
            const diceButtonGroup = new Konva.Group();
        
            const diceButton = new Konva.Rect({
              x: this.width / 2,
              y: this.height - 100,
              width: 60,
              height: 60,
              fill: "gray",
              cornerRadius: 10,
              stroke: "black",
              strokeWidth: 2,
            });
        
            const diceText = new Konva.Text({
              x: this.width / 2,
              y: this.height -100,
              text: "D6",
              fontSize: 24,
              fontFamily: "Arial",
              fill: "white",
              align: "center",
            });
        
            diceButton.offsetX(diceButton.width() / 2);
            diceText.offsetX(diceText.width() / 2);
            diceButton.offsetY(diceButton.height() / 2);
            diceText.offsetY(diceText.height() / 2);
            diceButtonGroup.add(diceButton);
            diceButtonGroup.add(diceText);
            diceButtonGroup.on("click", this.onDiceClick);
            this.viewGroup.add(diceButtonGroup);
    }

    /*
     * Updates the position of a player
     * @param player - player object state
     */
    public updatePlayerPos(player : Player) {
        this.boardRenderer.updatePlayer(player.currentTile);
    }

    /*
     * Show the screens
     */
    show(): void {
        this.viewGroup.visible(true);
        this.viewGroup.getLayer()?.draw();
    }

    /*
     * Hide the screen
     */
    hide(): void {
        this.viewGroup.visible(false);
        this.viewGroup.getLayer()?.draw();
    }

    /*
     * Returns view group
     */
    getGroup(): Konva.Group {
        return this.viewGroup;
    }
    
}