/**
 * GameOver state.
 */
function GameOver() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
GameOver.prototype = proto;

GameOver.prototype.preload = function() {
	this.stage.backgroundColor = "#000";
	this.world.width = this.game.width;
	this.world.height = this.game.height;
};

GameOver.prototype.create = function() {
	this.bg = this.add.image(0,0,"gameoverImg");
	this.bg.width = this.game.width;
	this.bg.height = this.game.height;
	this.input.onDown.add(this.startMenu, this);
};

GameOver.prototype.startMenu = function() {
	this.game.state.start("Menu");
};