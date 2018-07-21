window.onload = function() {
	// Create your Phaser game and inject it into an auto-created canvas.
	// We did it in a window.onload event, but you can do it anywhere (requireJS
	// load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game(960, 540, Phaser.AUTO);
	
	game.KILL = 0;
	// Add the States your game has.
	game.state.add("Boot", Boot);
	game.state.add("Menu", Menu);
	game.state.add("Preload", Preload);
	game.state.add("Level", Level);
	game.state.add("Level2", Level2);
	game.state.add("GameOver", GameOver);
	game.state.add("About", About);

	// Now start the Boot state.
	game.state.start("Boot");
};
