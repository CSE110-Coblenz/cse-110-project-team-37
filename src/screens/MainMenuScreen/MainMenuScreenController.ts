/**
 * WILL BE COPYING IDEAS AND LAYOUTS FROM LAB
 * AND BUILDING UPON IT
 */
import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MainMenuScreenView } from "./MainMenuScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MainMenuScreenController extends ScreenController {
	private view: MainMenuScreenView;
	private screenSwitcher: ScreenSwitcher;
	private difficulty: string = "EASY";

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new MainMenuScreenView(() => this.handleStartClick(), 
		() => this.handleHelpClick(),
		(level:string) => this.handleDifficultySelect(level));
	}

	/**
	 * Handle start button click
	 */
	private handleStartClick(): void {
		// once start is pressed, switch to game screen
		this.screenSwitcher.switchToScreen({type: "game"});
	}

	private handleHelpClick(): void{
		// once help is clicked, send user to learn more 
		this.screenSwitcher.switchToScreen({type: "help"});
	}

    private handleDifficultySelect(level: string): void {
        this.difficulty = level;
        this.view.updateDifficultyDisplay(level);
    }
    
    public getDifficulty(): string {
        return this.difficulty;
    }

	/**
	 * Get the view
	 */
	getView(): MainMenuScreenView {
		return this.view;
	}
}
