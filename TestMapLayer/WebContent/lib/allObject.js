
var addPlayer = function(x,y,state){
	var a = state.add.spriter(x,y,"actors","actors_img","name");
	a.anchor.set(0.5,1);
	a.scale.set(0.5);
	a.smoothed=true;
	state.physics.arcade.enableBody(a);
	a.play("idle");
	
	//setBody
	a.body.bounce.y = 0;
	a.body.collideWorldBounds = true;
	a.body.drag.x = 600;
	
	//status
	a.control = true;
	a.timeStun = state.time.now;
	a.isDead = false;
	a.isAttack = false;
	a.isHit = false;
	a.maxHealth = 1000;
	a.health = a.maxHealth;
	a.atk = 50;
	a.speed = 300;
	a.canHit = true;
	a.face = 1;
	
	a.weapons = [];
	a.weapons[0] = "";
	a.weapons[1] = "Bat";
	a.hold = "Bat";
	
	//method
	a.getAtk = function(){
		var newAtk = a.atk;
		newAtk+=Math.ceil(Math.random()*10);
		if(Math.random()*1>0.8){
			newAtk*=2;
		}
		return newAtk;
	};
	
	a.myLeft = function(){
		if(a.isAttack) return;
		a.body.velocity.x = -a.speed;
	};
	a.myRight = function(){
		if(a.isAttack) return;
		a.body.velocity.x = a.speed;
	};
	a.myJump = function(){
		if(a.isAttack) return;
		a.body.velocity.y = -800;
	};
	
	a.myAttack = function(){
		if(a.isAttack) return;
		a.isAttack = true;
		state.time.events.repeat(500,1,function(){
			a.isAttack=false;
			a.play("idle"+a.hold);
		},this);
	};
	
	a.kill = function(){
		//a.destroy();
		a.isDead = true;
		a.control = false;
		a.play("dead");
		state.game.time.events.add(3000,function(){
				state.quitGame();
			},this);
	};
	
	a.myUpdateAnimation = function(){
		if(!a.control) return;
		if(a.body.velocity.x>0){
			a.scale.x = Math.abs(a.scale.x)*a.face;
		}else if(a.body.velocity.x<0){
			a.scale.x = -Math.abs(a.scale.x)*a.face;
		}
		if(a.isAttack){
			a.play("attack"+a.hold);
			return;
		}
		if(a.body.onFloor()){
			if(a.body.velocity.x!=0){
				a.play("run"+a.hold);
			}else{
				a.play("idle"+a.hold);
			}
		}else{
			a.play("jump"+a.hold);
		}
	};
	
	return a;
};
/*
var addPlayer = function(x,y,state){
	var a = state.add.sprite(x,y,"player");
	a.anchor.set(0.5,1);
	a.smoothed=true;
	state.physics.arcade.enableBody(a);
	
	a.animations.add("attack",mFrames("attack",3),12,false);
	a.animations.add("dead",mFrames("dead",12),12,false);
	a.animations.add("idle",mFrames("idle",9),12,true);
	a.animations.add("jump",mFrames("jump",6),12,false);
	a.animations.add("walk",mFrames("walk",9),12,true);
	
	
	a.play("idle");
	
	//setBody
	a.body.bounce.y = 0;
	a.body.collideWorldBounds = true;
	a.body.drag.x = 600;
	
	//status
	a.control = true;
	a.timeStun = state.time.now;
	a.isDead = false;
	a.isAttack = false;
	a.isHit = false;
	a.maxHealth = 1000;
	a.health = a.maxHealth;
	a.atk = 50;
	a.speed = 300;
	a.canHit = true;
	a.face = 1;
	
	a.weapons = [];
	a.weapons[0] = "";
	a.weapons[1] = "Bat";
	a.hold = a.weapons[1];
	
	//method
	a.getAtk = function(){
		var newAtk = a.atk;
		newAtk+=Math.ceil(Math.random()*10);
		if(Math.random()*1>0.8){
			newAtk*=2;
		}
		return newAtk;
	};
	
	a.myLeft = function(){
		if(a.isAttack) return;
		a.body.velocity.x = -a.speed;
	};
	a.myRight = function(){
		if(a.isAttack) return;
		a.body.velocity.x = a.speed;
	};
	a.myJump = function(){
		if(a.isAttack) return;
		a.body.velocity.y = -800;
	};
	
	a.myAttack = function(){
		if(a.isAttack) return;
		a.isAttack = true;
		state.time.events.repeat(500,1,function(){
			a.isAttack=false;
			a.play("idle");
		},this);
	};
	
	a.kill = function(){
		//a.destroy();
		a.isDead = true;
		a.control = false;
		a.play("dead");
		state.game.time.events.add(3000,function(){
				state.quitGame();
			},this);
	};
	console.log(a.body);
	a.myUpdateAnimation = function(){
		//a.body.setSize(a._frame.width,a._frame.height);
		//console.log(a.body);
		if(!a.control) return;
		if(a.body.velocity.x>0){
			a.scale.x = Math.abs(a.scale.x)*a.face;
		}else if(a.body.velocity.x<0){
			a.scale.x = -Math.abs(a.scale.x)*a.face;
		}
		if(a.isAttack){
			if(a.animations.currentAnim.name!="attack"){
				a.play("attack");
			}
			return;
		}
		if(a.body.onFloor()){
			if(a.body.velocity.x!=0){
				a.play("walk");
			}else{
				a.play("idle");
			}
		}else if(a.animations.currentAnim.name!="jump"){
			a.play("jump");
		}
	};
	
	return a;
};
*/
var addItem = function(x,y,state){
	var rng = Math.ceil(Math.random()*3);
	var a = state.add.sprite(x,y,"item"+rng);
	a.anchor.set(0.5,0);
	state.physics.arcade.enableBody(a);
	
	//set with world
	a.body.bounce.y = 0.3;
	a.body.collideWorldBounds = true;
	a.body.drag.x = 600;
	a.numHeal = 50;
	if(rng==1){
		a.numHeal = 200;
	}else if(rng==2){
		a.numHeal = 100;
	}else{
		a.numHeal = 300;
	}
	return a;
};

var addEnemy1 = function(ename,x,y,state){
	var a = state.add.sprite(x,y,"enemy"+ename);
	
	a.anchor.set(0.5,1);
	a.smoothed=true;
	state.physics.arcade.enableBody(a);
	
	//setBody
	a.body.bounce.y = 0;
	a.body.collideWorldBounds = true;
	a.body.drag.x = 600;
	
	//status
	a.isAttack = false;
	a.isDead = false;
	a.isHit = false;
	a.maxHealth = 200;
	a.health = a.maxHealth;
	a.speed = 100;
	a.atk = 50;
	a.face = -1;
	
	//setting
	if(ename=="1"){
		a.animations.add("idle",mFrames("idle",12),12,true);
		a.animations.add("walk",mFrames("walk",12),12,true);
		a.animations.add("dead",mFrames("dead",10),12,false);
		a.animations.add("hit",mFrames("hit",7),12,false);
		a.animations.add("attack",mFrames("attack",12),12,false);
		a.face = 1;
		a.atk = 50;
		a.speed = 120;
	}else if(ename=="2"){
		a.animations.add("idle",mFrames("idle",12),12,true);
		a.animations.add("walk",mFrames("walk",12),12,true);
		a.animations.add("dead",mFrames("dead",12),12,false);
		a.animations.add("hit",mFrames("dead",5),10,false);
		a.animations.add("attack",mFrames("attack",12),12,false);
		a.atk = 80;
		a.speed = 200;
	}else if(ename=="3"){
		a.animations.add("idle",mFrames("idle",12),12,true);
		a.animations.add("walk",mFrames("walk",12),12,true);
		a.animations.add("dead",mFrames("dead",12),12,false);
		a.animations.add("hit",mFrames("hit",12),12,false);
		a.animations.add("attack",mFrames("attack",12),12,false);
		a.atk = 150;
	}else if(ename=="4"){
		a.animations.add("idle",mFrames("idle",2),5,true);
		a.animations.add("walk",mFrames("walk",2),8,true);
		a.animations.add("dead",mFrames("die",2),12,false);
		a.animations.add("hit",mFrames("die",1),1,false);
		a.animations.add("attack",mFrames("attack",16),12,false);
		a.scale.set(0.6);
		a.atk = 80;
	}
	a.play("idle");
	
	a.getAtk = function(){
		var newAtk = a.atk;
		newAtk+=Math.ceil(Math.random()*10);
		return newAtk;
	};
	a.kill = function(){
		this.game.KILL ++;
		state.scoreText.text = "Kill : "+this.game.KILL;
		a.play("dead");
		a.isDead = true;
		state.time.events.add(1000,function(){
			a.destroy();
			//สุ่มเกิดมอนใหม่
			var tmpLoc = Math.floor(Math.random()*state.spawnLocation.length);
			var rngEnemy = Math.ceil(Math.random()*4);
			var e = addEnemy1(rngEnemy,state.spawnLocation[tmpLoc].x,state.spawnLocation[tmpLoc].y,state);
			state.enemies.add(e);
		},this);
	};
	
	//method
	/*a.myLeft = function(){
		if(a.isAttack) return;
		a.body.velocity.x = -a.speed;
	};
	a.myRight = function(){
		if(a.isAttack) return;
		a.body.velocity.x = a.speed;
	};
	a.myJump = function(){
		if(a.isAttack) return;
		a.body.velocity.y = -800;
	};*/
	
	a.myAttack = function(){
		if(a.isAttack) return;
		a.isAttack = true;
		state.time.events.repeat(1000,1,function(){
			if(a.isDead) return;
			a.isAttack=false;
			a.play("idle");
		},this);
	};
	
	a.myUpdateAnimation = function(){
		if(a.isDead){
			return;
		}
		if(a.isHit){
			a.play("hit");
			return;
		}
		if(a.isAttack){
			a.play("attack");
			return;
		}
		if(a.body.velocity.x>0){
			a.scale.x = Math.abs(a.scale.x)*a.face;
		}else if(a.body.velocity.x<0){
			a.scale.x = -Math.abs(a.scale.x)*a.face;
		}
		if(a.body.velocity.x!=0){
			a.play("walk");
		}else{
			a.play("idle");
		}
	};
	return a;
};

function mFrames(key,n){
	var f=[ ];
	for(var i=1;i<=n;i++){
		var kf = key +" (" + i +")";
		f.push(kf);
	}
	return f;
}