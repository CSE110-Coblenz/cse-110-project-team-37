import { ScreenController } from "../../types.ts";

import { BoardScreenView } from "./BoardScreenView.ts";


export class BoardScreenController extends ScreenController {
    private readonly view: BoardScreenView;

    constructor() {
        super();
        this.view = new BoardScreenView();
    }

    getView(): BoardScreenView {
        return this.view;
    }
    
}