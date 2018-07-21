/**
 * Menu state.
 */
function Menu() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Menu.prototype = proto;

Menu.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
	this.stage.backgroundColor = "#000";
	this.world.width = this.game.width;
	this.world.height = this.game.height;
	this.game.KILL = 0;
};

Menu.prototype.create = function() {
	this.bg = this.add.image(0,0,"bg1");
	this.bg.width = this.game.width;
	this.bg.height = this.game.height;
	this.btn_start = this.add.button(this.game.width/2.,this.game.height/2,"tap-to-start");
	this.btn_start.anchor.set(0.5);
	this.btn_start.scale.set(1);
	
	this.btn_about = this.add.button(this.game.width/2.,this.game.height-200,"btnAboutme");
	this.btn_about.anchor.set(0.5);
	this.btn_about.scale.set(0.2);
	
	this.btn_start.onInputDown.add(this.startGame,this);
	this.btn_about.onInputDown.add(this.startAbout,this);
	
};

Menu.prototype.startGame = function() {
	this.game.state.start("Level");
};

Menu.prototype.startAbout = function() {
	this.game.state.start("About");
};