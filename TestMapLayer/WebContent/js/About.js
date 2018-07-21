/**
 * About state.
 */
function About() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
About.prototype = proto;

About.prototype.create = function() {
	this.world.width = 960;
	this.world.height = 640;
	
	var text = this.add.text(460, this.world.height-550, "สมาชิก",
	{fill: 'white'});
	text.scale.set(0.7);
	//1
	var text = this.add.text(370, this.world.height-500, "1. นาย นวกร ขาวปลอด 573020382-1",
	{fill: 'white'});
	text.scale.set(0.57);
	//2
	var text = this.add.text(370, this.world.height-460, "2. นาย รัฐพล นาคดิลก 573021109-4",
	{fill: 'white'});
	text.scale.set(0.57);
	//3
	var text = this.add.text(370, this.world.height-420, "3. นาย วรพล ทนันไชย 573021112-5",
	{fill: 'white'});
	text.scale.set(0.57);
	//4
	var text = this.add.text(370, this.world.height-380, "4. นาย อดิศร อาจวิชัย 573021123-0",
	{fill: 'white'});
	text.scale.set(0.57);
	//5
	var text = this.add.text(370, this.world.height-340, "5. นาย อภิชาติ เหล่าวอ 573021124-8",
	{fill: 'white'});
	text.scale.set(0.57);
	var text = this.add.text(330, this.world.height-290, "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น",
	{fill: 'white'});
	text.scale.set(0.6);
	var sprite = this.add.sprite(this.world.height-475, this.world.width-480,"member1");
	sprite.anchor.set(0.5, 0.5);
	var sprite = this.add.sprite(this.world.height-325, this.world.width-480,"member2");
	sprite.anchor.set(0.5, 0.5);
	var sprite = this.add.sprite(this.world.height-175, this.world.width-480,"member3");
	sprite.anchor.set(0.5, 0.5);
	var sprite = this.add.sprite(this.world.height-25, this.world.width-480,"member4");
	sprite.anchor.set(0.5, 0.5);
	var sprite = this.add.sprite(this.world.height+125, this.world.width-480,"member5");
	sprite.anchor.set(0.5, 0.5);
	
	this.btn_menu = this.add.button(20,20,"btnBack");
	this.btn_menu.anchor.set(0);
	this.btn_menu.scale.set(0.18);
	
	this.btn_menu.onInputDown.add(this.startMenu,this);
	
};

About.prototype.startMenu = function() {
	this.game.state.start("Menu");
};
