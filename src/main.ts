import Konva from "konva";

// import "./style.css";

// const stage = new Konva.Stage({
//   container: "app",
//   width: window.innerWidth,
//   height: window.innerHeight,
// });

// const layer = new Konva.Layer();
// stage.add(layer);

// const circle = new Konva.Circle({
//   x: stage.width() / 2,
//   y: stage.height() / 2,
//   radius: 70,
//   fill: "red",
//   stroke: "black",
//   strokeWidth: 4,
// });

// layer.add(circle);

import type { ScreenSwitcher, Screen } from "./types.ts";
import { MainMenuScreenController } from "./screens/MainMenuScreen/MainMenuScreenController.ts";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen (Menu, Game, Results) has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */
class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	private mainMenuController: MainMenuScreenController;

	constructor(container: string) {
		// Initialize Konva stage (the main canvas)
		this.stage = new Konva.Stage({
			container,
			width: window.innerWidth,
			height: window.innerHeight,
		});

		// Create a layer (screens will be added to this layer)
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize all screen controllers
		// Each controller manages a Model, View, and handles user interactions
		this.mainMenuController = new MainMenuScreenController(this);

		// Add all screen groups to the layer
		// All screens exist simultaneously but only one is visible at a time
		this.layer.add(this.mainMenuController.getView().getGroup());

		// Draw the layer (render everything to the canvas)
		this.layer.draw();

		// Start with menu screen visible
		this.mainMenuController.getView().show();
	}

	/**
	 * Switch to a different screen
	 *
	 * This method implements screen management by:
	 * 1. Hiding all screens (setting their Groups to invisible)
	 * 2. Showing only the requested screen
	 *
	 * This pattern ensures only one screen is visible at a time.
	 */
	switchToScreen(screen: Screen): void {
		// Hide all screens first by setting their Groups to invisible
		this.mainMenuController.hide();
		// Show the requested screen based on the screen type
		switch (screen.type) {
			case "menu":
				this.mainMenuController.show();
				break;
		}
	}
}

// Initialize the application
new App("app");

