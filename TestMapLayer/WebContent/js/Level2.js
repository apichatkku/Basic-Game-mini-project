/**
 * Level2 state.
 */
function Level2() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level2.prototype = proto;

Level2.prototype.preload = function() {
	this.stage.backgroundColor = "#ace";
	this.bgGroup = this.add.group();
	
	this.attackAudio = this.add.audio("attackAudio",0.5,false);
	this.attackAudio.allowMultiple=true;
	this.ahh = this.add.audio("ahh",0.5,false);
	this.ahh.allowMultiple=true;
	
	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.gravity.y = 1800;
	
	this.map = this.add.tilemap("map2");
	this.map.addTilesetImage("tile_sheet");
	
	this.map_layer1 = this.map.createLayer("Tile Layer 1");
	this.map_layer1.resizeWorld();
	
	//bg
	this.bg1 = this.add.tileSprite(0,this.world.height-64*3*0.5-60,this.world.width*2,64*3,"wall1");
	this.bg1.scale.set(0.5);
	this.bg2 = this.add.tileSprite(0,this.world.height-379*0.5-60,this.world.width/0.5,379,"tree2");
	this.bg2.scale.set(0.5);
	this.bg3 = this.add.tileSprite(0,this.world.height-384*0.7-60,this.world.width/0.7,384,"tree1");
	this.bg3.scale.set(0.7);
	this.bg4 = this.add.tileSprite(0,this.world.height-379*0.9-60,this.world.width/0.9,379,"tree2");
	this.bg4.scale.set(0.9);
	this.bgGroup.add(this.bg1);
	this.bgGroup.add(this.bg1);
	this.bgGroup.add(this.bg2);
	this.bgGroup.add(this.bg3);
	this.bgGroup.add(this.bg4);
	
	this.map_layer2 = this.map.createLayer("Tile Layer 2");
	
	this.map_border = this.map.createLayer("Border");
	//this.map_border.debug = true;
	this.physics.arcade.enableBody(this.map_border);
	this.map_border.visible = false;
	
	this.enemies = this.add.group();
	this.itemGroup = this.add.group();
	this.actors = this.add.group();
	this.gates = this.add.group();
	
	var numItem = Math.ceil(Math.random()*10);
	for(var i=0;i<numItem;i++){
		var item = addItem(Math.ceil(Math.random()*this.world.width),10,this);
		this.itemGroup.add(item);
	}
};

//get parametor
Level2.prototype.init = function(pPlayer){
	this.tmpPlayer = pPlayer;
};

Level2.prototype.create = function() {
	
	this.spawnLocation = [];
	for(var x in this.map.objects.Object){
		var obj = this.map.objects.Object[x];
		if(obj.type=="player"){
			//this.player = this.addPlayer(obj.x,obj.y);
			this.player = addPlayer(obj.x,obj.y,this);
			this.actors.add(this.player);
			this.camera.follow(this.player,Phaser.Camera.FOLLOW_PLATFORMER);
			if(this.tmpPlayer!==undefined){
				console.log(55);
			}
		}else if(obj.type=="enemy"){
			var e = addEnemy1(obj.name,obj.x,obj.y,this);
			this.enemies.add(e);
			var spawnloc = {x:obj.x,y:obj.y};
			this.spawnLocation.push(spawnloc);
		}else if(obj.type=="goal"){
			console.log(55);
			var w = this.game.add.sprite(obj.x+32,obj.y, "warpSprite");
			w.width = 128;
			w.height = 128;
			w.anchor.set(0.5,1);
			w.name = obj.name;
			w.animations.add("all");
			w.play("all",12,true);
			this.physics.arcade.enableBody(w);
			this.gates.add(w);
		}
	}
	
	this.gates.forEachAlive(function(g){
		if(g.name=="go"&&this.comefromLevel2>this.mapNumber){
			this.player.x = g.x;
			this.player.y = g.y;
		}
	}, this);
	
	this.map_face = this.map.createLayer("Face");
	this.effectGroup = this.add.group();
	this.ui = this.add.group();
	this.ui.fixedToCamera = true;
	
	this.map.setLayer(this.map_border);
	this.map.setCollisionBetween(71,71,true,this.map_border);
	//ความหนาของกรอบtile mapที่จะชน
	this.physics.arcade.TILE_BIAS = 40;
	
	setTileCollision(this.map_border, [72], {
        top: true,
        bottom: false,
        left: false,
        right: false
    });
	
	this.maxHealbar = this.add.image(20,20,"hpbarSoftred",null,this.ui);
	this.maxHealbar.scale.set(0.8);
	this.maxHealbar.alpha = 0.8;
	this.healbar = this.add.image(20,20,"hpbarGreen",null,this.ui);
	this.healbar.scale.set(0.8);
	this.healbar.alpha = 0.8;
	this.healbar.w = this.healbar.width;
	this.healbar.resize = function(player){
		var w = this.w * (player.health / player.maxHealth);
		if (w < 0)
			w = 0;
		this.width = w;
	};
	if(this.tmpPlayer!==undefined){
		this.player.health = this.tmpPlayer.health;
		this.healbar.resize(this.player);
	}
	var style = { font: "48px Arial", fill: "White"};
	this.scoreText = this.add.text(this.game.width-20, 20,"Kill : "+this.game.KILL, style,this.ui);
	this.scoreText.anchor.set(1,0);
	this.scoreText.stroke = "yello";
	this.scoreText.strokeThickness = 5;
	
	this.createButton();
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Update!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
Level2.prototype.update = function() {
	this.bg1.x = this.camera.x*0.9;
	this.bg2.x = this.camera.x*0.8;
	this.bg3.x = 128+this.camera.x*0.6;
	this.bg4.x = 64+this.camera.x*0.4;
	
	this.physics.arcade.collide(this.actors,this.map_border);
	this.physics.arcade.collide(this.enemies,this.map_border);
	this.physics.arcade.collide(this.itemGroup,this.map_border);
	this.physics.arcade.collide(this.gates,this.map_border);
	if(this.player.isDead) return;
	
	this.enemies.forEachAlive(function(enemy){
		if(enemy.isHit||enemy.isAttack||enemy.isDead) return;
		if(this.math.distancePow(this.player.x,this.player.y,enemy.x,enemy.y)<400){
			this.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
			if(enemy.body.velocity.y<0){
				enemy.body.velocity.y = 0;
			}
		}
	},this);
	if(this.player.control){
		if(this.btn_right.isdown){
			this.player.myRight();
		}
		if(this.btn_left.isdown){
			this.player.myLeft();
		}
		if(this.btn_jump.isdown && this.player.body.onFloor()){
			this.player.myJump();
		}
		if(this.btn_attack.isdown&&!this.player.isAttack){
			this.player.myAttack();
			if(this.player.hold == "Bat"){
				this.attackAudio.play();
				this.enemies.forEachAlive(
						function(enemy){
							var tmpDamage = this.player.getAtk();
							if(enemy.isDead) return;
							var rec1 = this.player.getBounds();
							if(this.player.scale.x>0){
								rec1.x += 100;
							}else{
								rec1.x -= 100;
							}
							if(Phaser.Rectangle.intersects(rec1,enemy.getBounds())){
								enemy.isHit = true;
								enemy.damage(tmpDamage);
								this.addEffBlood(enemy.x,enemy.y-enemy.height,enemy.width);
								this.addDamageText(tmpDamage,enemy.x,enemy.y-enemy.height,"red");
								enemy.body.velocity.y = -400;
								if(this.player.scale.x<0){
									enemy.body.velocity.x=-400;
								}else{
									enemy.body.velocity.x=400;
								}
								this.time.events.add(1000,function(){
									if(enemy.isDead) return;
									enemy.isHit=false;
									enemy.play("idle");
								},this);
							}
						}
				,this);
			}
		}
	}else{
		if(this.player.timeStun<=this.time.now){
			this.player.control = true;
		}
	}
	
	this.physics.arcade.collide(this.player,this.gates,this.goMap,null,this);
	this.physics.arcade.collide(this.actors,this.itemGroup,this.pickItem,null,this);
	
	if(this.player.canHit){
		this.physics.arcade.collide(this.actors,this.enemies,this.playerCollideEnemies,null,this);
	}
	
	//add animation player
	this.player.myUpdateAnimation();
	
	this.enemies.forEachAlive(function(e){
		e.myUpdateAnimation();
	},this);
	
};
//######################################################################################################################

function setTileCollision(mapLayer, idxOrArray, dirs) {
	 
    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }
 
    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;
     
    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {
                 
                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;
                 
                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;
                 
            }
        }
    }
 
}


Level2.prototype.createButton = function() {
	this.btn_left = this.add.button(20,this.game.height-130,"buttonRight");
	this.btn_left.anchor.set(1,0);
	this.btn_left.scale.x=-1;
	this.btn_left.alpha = 0.5;
	
	this.btn_right = this.add.button(170,this.game.height-130,"buttonRight");
	this.btn_right.alpha = 0.5;
	
	this.btn_jump = this.add.button(this.game.width-150*2,this.game.height-130,"buttonRight");
	this.btn_jump.anchor.set(1,0);
	this.btn_jump.angle=-90;
	this.btn_jump.alpha = 0.5;
	
	this.btn_attack = this.add.button(this.game.width-150,this.game.height-130*2,"buttonRight");
	this.btn_attack.anchor.set(0,1);
	this.btn_attack.angle=90;
	this.btn_attack.alpha = 0.5;
	
	this.btn_attack.isdown = false;
	this.btn_jump.isdown = false;
	this.btn_left.isdown = false;
	this.btn_right.isdown = false;
	
	this.ui.add(this.btn_left);
	this.ui.add(this.btn_right);
	this.ui.add(this.btn_jump);
	this.ui.add(this.btn_attack);
	
	this.btn_left.onInputDown.add(this.inputDown,this.btn_left);
	this.btn_left.onInputUp.add(this.inputUp,this.btn_left);
	this.btn_right.onInputDown.add(this.inputDown,this.btn_right);
	this.btn_right.onInputUp.add(this.inputUp,this.btn_right);
	this.btn_jump.onInputDown.add(this.inputDown,this.btn_jump);
	this.btn_jump.onInputUp.add(this.inputUp,this.btn_jump);
	
	// add keyboard event
	this.keys = this.input.keyboard.addKeys({
		"left" : Phaser.Keyboard.LEFT,
		"right" : Phaser.Keyboard.RIGHT,
		"jump" : Phaser.Keyboard.UP,
		"attack" : Phaser.Keyboard.SPACEBAR
	});
	
	this.keys.left.onDown.add(this.inputDown,this.btn_left);
	this.keys.left.onUp.add(this.inputUp,this.btn_left);
	this.keys.right.onDown.add(this.inputDown,this.btn_right);
	this.keys.right.onUp.add(this.inputUp,this.btn_right);
	this.keys.jump.onDown.add(this.inputDown,this.btn_jump);
	this.keys.jump.onUp.add(this.inputUp,this.btn_jump);
	this.keys.attack.onDown.add(this.inputDown,this.btn_attack);
	this.keys.attack.onUp.add(this.inputUp,this.btn_attack);
	
	var tw = this.add.tween(this.player);
	tw.to({},0,10000,true);
	tw.stop();
	
};

Level2.prototype.inputDown = function() {
	this.alpha = 0.8;
	this.isdown = true;
};

Level2.prototype.inputUp = function() {
	this.alpha = 0.5;
	this.isdown = false;
};

Level2.prototype.pickItem = function(player,item){
	player.heal(item.numHeal);
	this.healbar.resize(player);
	this.addHealText(item.numHeal,player.x,player.y-player.height,"green");
	item.kill();
};

Level2.prototype.playerCollideEnemies = function(player,enemy){
	if(enemy.isDead) return;
	player.canHit = false;
	enemy.myAttack();
	this.ahh.play();
	var tmpDamage = enemy.getAtk();
	player.damage(tmpDamage);
	this.addEffBlood(player.x,player.y-player.height,player.width);
	this.addDamageText(tmpDamage,player.x,player.y-player.height,"Blue");
	
	player.body.velocity.y = -500;
	if(player.scale.x<0){
		player.body.velocity.x=300;
	}else{
		player.body.velocity.x=-300;
	}
	
	this.healbar.resize(this.player);
	this.player.play("dead");
	this.player.control = false;
	this.player.timeStun = this.time.now+500;
	
	var twPlayer = this.add.tween(player);
	twPlayer.to({alpha:0.1},300, "Linear",true,0,5);
	twPlayer.onComplete.addOnce(function(){this.alpha=1;this.canHit=true;}, player);
	
};

Level2.prototype.addEffBlood = function(x,y,w){
	var exploBlood = this.add.sprite(x,y,"explosionBlood");
	exploBlood.anchor.set(0.5);
	exploBlood.width = w*1.5;
	exploBlood.height = w*1.5;
	exploBlood.animations.add("all").play(12,false,true);
	this.effectGroup.add(exploBlood);
};

Level2.prototype.addDamageText = function(damage,x,y,tcolor){
	var style = { font: "36px Arial", fill: "black"};
	var text = this.add.text(x, y,damage, style);
	text.anchor.set(0.5,0);
	text.stroke = tcolor;
	text.strokeThickness = 5;
	var dy = y-100;
    var twText = this.add.tween(text);
    twText.to({ y:dy }, 500, "Linear", true);
    twText.onComplete.addOnce(function(){
    	text.destroy();
    },this);
    this.effectGroup.add(text);
};

Level2.prototype.addHealText = function(damage,x,y,tcolor){
	var style = { font: "36px Arial", fill: "white"};
	var text = this.add.text(x, y,"Hp +"+damage, style);
	text.anchor.set(0.5,0);
	text.stroke = tcolor;
	text.strokeThickness = 5;
	var dy = y-100;
    var twText = this.add.tween(text);
    twText.to({ y:dy }, 500, "Linear", true);
    twText.onComplete.addOnce(function(){
    	text.destroy();
    },this);
    this.effectGroup.add(text);
};

/*
Level2.prototype.render = function(){
	this.game.debug.body(this.rec1);
	this.game.debug.body(this.player);
	this.enemies.forEachAlive(function(member){
		this.game.debug.body(member);
	},this);
};*/

Level2.prototype.goMap = function(player,gate){
	if(gate.name=="back"){
		this.game.state.start("Level",true,false,this.player);
	}
};

Level2.prototype.quitGame = function() {
	this.game.state.start("GameOver");
};