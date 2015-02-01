angular.module("tap", [])

.controller("controller", function($timeout, $interval){
	var self = this;
	var timer = 500;
	var speed = 1000;
	var turn = 1; 
	var count = 0;
	var wait = speed * (turn+2);
	self.score = 0;
	self.tetra_choices = [];
	self.red_click = false;
	self.blue_click = false;
	self.green_click = false;
	self.yellow_click = false;
	self.play = true;
	self.player_turn = false;
	self.play_text = "Click To Play";
	self.message = ""; 
	self.classic_mode = false;
	self.tetra_mode = true;

	self.reset = function(){ 
		timer = 500;
		speed = 1000;
		turn = 1; 
		count = 0;
		wait = speed * (turn+2);
		self.score = 0;
		self.tetra_choices = [];
		self.red_click = false;
		self.blue_click = false;
		self.green_click = false;
		self.yellow_click = false;
		self.play = true;
		self.player_turn = false;
		self.play_text = "Click To Play";
		self.message = "";  
	}

	self.selectClassic = function(){
		self.classic_mode = true;
		self.tetra_mode = false;
	}
	self.selectTetra = function(){
		self.tetra_mode = true;
		self.classic_mode = false;
	}

	self.colorClicked = function(color){
		if(color == "green"){self.green_click = true;}
		else if(color == "red"){self.red_click = true;}
		else if(color == "blue"){self.blue_click = true;}
		else if(color == "yellow"){self.yellow_click = true;}
		else{}
		
		$timeout(function(){
			if(color == "green"){
				self.green_click = false;
			}else if(color == "red"){
				self.red_click = false;
			}else if(color == "blue"){
				self.blue_click = false;
			}else if(color == "yellow"){
				self.yellow_click = false;
			} else{}
		}, timer);

		if(self.player_turn == true){
			self.detectClicks(color);		
		}
	}

	self.clickedPlay = function(){ 
		self.play = false;
		$timeout(function() { 
			self.tetrasTurn();
		}, timer/2);
		
	}

	self.tetrasTurn = function(){
		self.player_turn = false;
		timer = speed/2;
		wait = speed * (turn+2); // waits for tetra to finish clicks
		self.message = "Tetra's Turn";
		//timeout function gives player some time before tetra starts
		$timeout(function(){
			if(self.classic_mode == true){self.classicMode();}
			else{self.tetraMode();}
		}, timer); 
		self.playersTurn();
	}	

	self.classicMode = function(){
		var i = 0;
		var stop = $interval(function(){
			if(i >= turn-1){$interval.cancel(stop);}
			if(self.tetra_choices.length == 0){self.tetraPicks();}
			else if(i < self.tetra_choices.length){
				self.colorClicked(self.tetra_choices[i]);
				i++;
			}else if(i >= self.tetra_choices.length){
				self.tetraPicks();
			}else{}
		}, speed);		
	}
	self.tetraMode = function(){
		var i = 0;
		var stop = $interval(function(){
			if(i >= turn-1){$interval.cancel(stop);}
			self.tetraPicks();
			i++;
		}, speed); 
	}

	self.tetraPicks = function(){
		var tetra_pick = Math.floor(Math.random()*4);
		if(tetra_pick == 0){
			self.colorClicked('green');
			self.tetra_choices.push('green');
		}else if(tetra_pick == 1){
			self.colorClicked('red');
			self.tetra_choices.push('red');
		}else if(tetra_pick == 2){
			self.colorClicked('blue');
			self.tetra_choices.push('blue');	
		}else if(tetra_pick == 3){
			self.colorClicked('yellow');
			self.tetra_choices.push('yellow');
		}else{self.message="Tetra Has An Error";}
	}

	self.detectClicks = function(color){
		//compares player choice and tetra's
		if(color == self.tetra_choices[count]){
			count++; //iterates through tetra's choices	
			self.winMessage();
			self.scoreCount();
			//check to see if player clears round
			if(count >= self.tetra_choices.length){
				count = 0;
				turn++;
				if(self.tetra_mode == true){self.tetra_choices = [];}
				$timeout(function(){
					speed -= 50;
					self.tetrasTurn();	
				}, 1000);
			}
			$timeout(function(){
				self.message = "Your Move";
			}, timer);
		}else{
			self.player_turn = false;
			self.gameOver(); //gameover when player chooses incorrectly
		}
	}
	
	self.playersTurn = function(){
		$timeout(function(){
			self.player_turn = true;
			self.message = "Your Move";
			console.log("player turn: "+self.player_turn);
			timer = 500;
		}, wait);
		
	}

	self.winMessage = function(){
		var random_text = Math.floor(Math.random()*4);
		if(random_text == 0 && count >= 1 && count < 4){self.message = "Correct!"}
		else if(random_text == 1 && count >= 1 && count < 4){self.message = "Easy!"}
		else if(random_text == 2 && count >= 1 && count < 4){self.message = "Yep!"}
		else if(random_text == 3 && count >= 1 && count < 4){self.message = "No Sweat!"}
		else if(random_text == 0 && count >= 4 && count < 7){self.message = "Right On!";}
		else if(random_text == 1 && count >= 4 && count < 7){self.message = "Keep Going!";}
		else if(random_text == 2 && count >= 4 && count < 7){self.message = "Nice!";}
		else if(random_text == 3 && count >= 4 && count < 7){self.message = "Good!";} 
		else if(random_text == 0 && count >= 7 && count < 10){self.message = "On Fire!";}
		else if(random_text == 1 && count >= 7 && count < 10){self.message = "You Got It!";}
		else if(random_text == 2 && count >= 7 && count < 10){self.message = "Awesome!";}
		else if(random_text == 3 && count >= 7 && count < 10){self.message = "Cool!";}
		else if(random_text == 0 && count >= 10 && count < 20){self.message="Unbelievable!"}
		else if(random_text == 1 && count >= 10 && count < 20){self.message="Amazing!"}
		else if(random_text == 2 && count >= 10 && count < 20){self.message="Wow!"}
		else if(random_text == 3 && count >= 10 && count < 20){self.message="You're Good!"}
		else if(random_text == 2 && count >= 15 && count < 20){self.message="Are You Cheating?"}
		else if(random_text == 3 && count >= 15 && count < 20){self.message="Impossible!"}
		else if(count >= 20){self.message="You Are God!"}
		else{self.message = "Correct!";}
	}
	self.loseMessage = function(){
		var random_text = Math.floor(Math.random()*4);
		if(random_text == 0 && turn == 1){self.message = "Sigh.."}
		else if(random_text == 1 && turn == 1){self.message = "T.T"}
		else if(random_text == 2 && turn == 1){self.message = "No Good"}
		else if(random_text == 3 && turn == 1){self.message = ":("}
		else if(random_text == 0 && turn < 5 && turn > 1){self.message = "Oops";}
		else if(random_text == 1 && turn < 5 && turn > 1){self.message = "Wrong One";}
		else if(random_text == 2 && turn < 5 && turn > 1){self.message = "Sorry";}
		else if(random_text == 3 && turn < 5 && turn > 1){self.message = "Nope";} 
		else if(random_text == 0 && turn >= 5 && turn < 10){self.message = "Maybe Next Time";}
		else if(random_text == 1 && turn >= 5 && turn < 10){self.message = "Oh No...";}
		else if(random_text == 2 && turn >= 5 && turn < 10){self.message = "Bummer";}
		else if(random_text == 3 && turn >= 5 && turn < 10){self.message = "^.^";}
		else if(turn >= 10){self.message="You Were Amazing"}
		else{self.message = "Game Over";}
	}

	self.scoreCount = function(){
		if(turn <= 4){self.score++;}
		else if(turn >= 5 && turn < 8){self.score+=10;}
		else if(turn >= 8 && turn < 10){self.score+=50;}
		else if(turn >=10 && turn < 15){self.score+=100;}
		else if(turn >=15 && turn < 20){self.score+=500;}
		else if(turn >=20){self.score+=1000;}
		else{self.score+=7;}
	}

	self.gameOver = function(){
		self.loseMessage();
		$timeout(function(){
			self.message = "Try Again"
		}, timer*3);
		$timeout(function(){
			self.reset();
		}, timer*6);
	}
});
