/**
 * WILL BE COPYING IDEAS AND LAYOUTS FROM LAB
 * AND BUILDING UPON IT
 */
import Konva from "konva";
import type { View } from "../../types.ts";


/**
 * MenuScreenView - renders the main menu screen (the one upon opening the app)
 */
export class MainMenuScreenView implements View {
	// making the group that will comprise the entire main menu
	private group: Konva.Group;

	// defining a list of difficulties user can select from
	private difficultyNodes: Konva.Text[] = [];

	// the constructor for our main menu view object. we define three functions
	constructor(onStartClick: () => void,
				onHelpClick: () => void, 
				onDifficultySelect: (level:string) => void) {

		// initializing the group
		this.group = new Konva.Group({ visible: true });

		// placing things based on the window width and height. sort of works like vh in css
		const width = window.innerWidth;
		const height = window.innerHeight;

	
		//-----------------------------Title Section-------------------------------------------------------------------
		// title text
		const title = new Konva.Text({
			// centering the text on the x-axis, and having it pretty high up on the y axis
			x: width / 2,
			y: height / 5,
			
			// what the title says and how it looks like
			text: "Fraction Mania",
			fontSize: 90,
			fontFamily: "Arial",
			fill: "gray",
			stroke: "black",
			strokeWidth: 3,
			align: "center",
			fontStyle: "bold",
		});

		// center the text using offsetX
		title.offsetX(title.width() / 2);
		
		// adding title to group so it can be displayed
		this.group.add(title);
	


		//-----------------------------Difficulty Bar Section-------------------------------------------------------------------
		// defining values that are necessary for the difficulty selector
		const difficulties = ['EASY', 'MEDIUM', 'HARD'];

		// creating a group that displays difficulties
		const difficultyGroup = new Konva.Group({
			// placing selector in the middle, right above the start button
    		x: width / 2, 
    		y: 2.5 * (height / 5),
		});

		// creating the level labels
		let currentX = 0;

		// spacing between each option
		const spacing = 40; 

		difficulties.forEach((level, index) => {
    		const difficultyOptions = new Konva.Text({
				// displaying the level of difficulty
        		text: level,

				// appearance of the text, aligns with what we already have
        		fontSize: 30,
        		fontFamily: "Arial",
        		
				// easy is automatically selected. selected option will be bolded
				fill: index === 0 ? 'black' : 'gray',
        		fontStyle: index === 0 ? 'bold' : 'normal',
        		opacity: index === 0 ? 1 : 0.6,

				// categorizing the selected option 
        		name: 'difficulty-option',
        		id: level.toLowerCase(), 
    		});

    		// positioning
    		difficultyOptions.x(currentX);

  			// spacing the options by predetermined spacing
    		currentX += difficultyOptions.width() + spacing;
    
			// defining what happens when each option is clicked
			difficultyOptions.on('click', () => {
   	     		// calling event handler
        		onDifficultySelect(level); 
    		});
    
    		// storing the options and adding to the group for display
    		this.difficultyNodes.push(difficultyOptions);
   			difficultyGroup.add(difficultyOptions);
		});

		// centering the text
		difficultyGroup.offsetX(currentX / 2);

		// adding difficulty group to be displayed
		this.group.add(difficultyGroup);


		//-----------------------------Start Button-------------------------------------------------------------------
		// initializing new group for a button, as it requires a shape and text
		const startButtonGroup = new Konva.Group();

		// the shape of the button is a rectangle
		const startButton = new Konva.Rect({
			// keeping button centered, but at 3/4 of the page
			x: width / 2,
			y: 3 * (height / 5) + 20,

			// dimensions and appearance of the button
			width: 200,
			height: 60,
			fill: "gray",
			cornerRadius: 10,
			stroke: "black",
			strokeWidth: 2,
		});

		// what will belong inside the button
		const startText = new Konva.Text({
			x: width / 2,
			y: 3 * (height/5) + 38,
			text: "START GAME",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});

		// adding button to group so it can be displayed
		startButton.offsetX(startButton.width() / 2);
		startText.offsetX(startText.width() / 2);
		startButtonGroup.add(startButton);
		startButtonGroup.add(startText);
		startButtonGroup.on("click", onStartClick);
		this.group.add(startButtonGroup);


		//-----------------------------Help Button-------------------------------------------------------------------
		// initializing new group for a button, as it requires a shape and text
		const helpButtonGroup = new Konva.Group();

		// the shape of the button is a rectangle
		const helpButton = new Konva.Rect({
			// keeping button centered, but at 3/4 of the page
			x: width / 2,
			y: 4 * (height / 5),

			// dimensions and appearance of the button
			width: 200,
			height: 60,
			fill: "gray",
			cornerRadius: 10,
			stroke: "black",
			strokeWidth: 2,
		});

		// what will belong inside the button
		const helpText = new Konva.Text({
			x: width / 2,
			y: 4 * (height / 5) + 18,
			text: "HELP",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});

		// adding button to group so it can be displayed
		helpButton.offsetX(helpButton.width() / 2);
		helpText.offsetX(helpText.width() / 2);
		helpButtonGroup.add(helpButton);
		helpButtonGroup.add(helpText);
		helpButtonGroup.on("click", onHelpClick);
		this.group.add(helpButtonGroup);	
	}


    /**
     * Updates the visual style of the difficulty selector.
     * This method is called by the MainMenuScreenController after a selection is made.
     */
    public updateDifficultyDisplay(selectedLevel: string): void {
        this.difficultyNodes.forEach(node => {
            const level = node.text();
            
            if (level === selectedLevel) {
                // Style selected option (bold and full opacity)
                node.fontStyle('bold');
                node.fill("black");
                node.opacity(1);
            } else {
                // Style unselected options (normal and faded)
                node.fontStyle('normal');
                node.fill("gray");
                node.opacity(0.6);
            }
        });
        
        // Redraw the layer to show the new style
        this.group.getLayer()?.draw(); 
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
