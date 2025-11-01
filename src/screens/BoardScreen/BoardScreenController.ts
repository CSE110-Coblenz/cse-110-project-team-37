import { ScreenController } from "../../types.ts";
import { BoardScreenModel } from "./BoardScreenModel.ts";

import { BoardScreenView } from "./BoardScreenView.ts";


export class BoardScreenController extends ScreenController {

    private readonly model: BoardScreenModel;
    private readonly view: BoardScreenView;

    constructor() {
        super();
        this.model = new BoardScreenModel();
        this.view = new BoardScreenView(this.model);
    }

    getView(): BoardScreenView {
        return this.view;
    }
    
}