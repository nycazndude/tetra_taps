angular.module("tap", [])
.controller("controller", function($timeout, $interval){
	var self = this;
	var timer = 500;
	var speed = 1000;
	var turn = 1; 
	var count = 0;
	var wait = speed * (turn+2);
	var win_text1  = ["Correct!",          "Easy!",       "Yep!",      "No Sweat!"     ];
	var win_text2  = ["Right On!",         "Keep It Up!", "Nice!",     "Good!"         ];
	var win_text3  = ["On Fire!",          "You Got It!", "Awesome!",  "Cool!"         ];
	var win_text4  = ["Oh Yeah Baby!",     "Amazing!",    "Wow!",      "You're Good"   ];
	var win_text5  = ["Are You Cheating?", "OWNAGE!",     "Wrecking!", "Terrific!"     ];
	var lose_text1 = ["Sigh..",            "T.T",         "No Good",   "Not Even Close"];
	var lose_text2 = ["Oops!",             "Wrong One",   "Sorry!",    "Nope"          ];
	var lose_text3 = ["Maybe Next Time?",  "Oh No...",    "Bummer!",   "Ay Yaah!"      ];	
	self.score = 0;
	self.tetra_choices = [];
	self.red_click = false;
	self.blue_click = false;
	self.green_click = false;
	self.yellow_click = false;
	self.play = true;
	self.player_turn = false;
	self.play_text = "Play";
	self.message = ""; 
	self.classic_mode = true;
	self.tetra_mode = false;

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
		self.play_text = "Play";
		self.message = "";  
	}

	self.selectClassic = function(){self.classic_mode = true;self.tetra_mode = false;}
	self.selectTetra = function(){self.tetra_mode = true;self.classic_mode = false;}

	self.colorClicked = function(color){
		switch(color){
			case "green":self.green_click = true;break;
			case "red":self.red_click = true;break;
			case "blue":self.blue_click = true;break;
			case "yellow":self.yellow_click = true;break;
			default:self.message="Tetra Broke";self.reset();
		} 
		$timeout(function(){
			switch(color){
				case "green":self.green_click = false;break;
				case "red":self.red_click = false;break;
				case "blue":self.blue_click = false;break;
				case "yellow":self.yellow_click = false;break;
				default:self.message="Tetra Broke";self.reset();
			}  
		}, timer);
		if(self.player_turn == true){self.detectClicks(color);}//detects player clicks
	}

	self.clickedPlay = function(){ 
		self.play = false;
		$timeout(function(){self.tetrasTurn();}, timer/2);	
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
			if(i < self.tetra_choices.length && self.tetra_choices.length != 0){
				self.colorClicked(self.tetra_choices[i]);
				i++;
			} 
			else{self.tetraPicks();}
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
		var tetra_pick;
		switch(tetra_pick = self.randomNumber(4)){
			case 0:self.colorClicked('green');self.tetra_choices.push('green');break;
			case 1:self.colorClicked('red');self.tetra_choices.push('red');break;
			case 2:self.colorClicked('blue');self.tetra_choices.push('blue');break;	
			case 3:self.colorClicked('yellow');self.tetra_choices.push('yellow');break;
			default:self.message="Tetra Hits Reset";self.reset();
		} 
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
		}else{self.player_turn = false;self.gameOver();}//game over when player chooses incorrectly
	}
	self.playersTurn = function(){
		$timeout(function(){
			self.player_turn = true;
			self.message = "Your Move";
			timer = 500;
		}, wait);
	}
	self.winMessage = function(){
		switch(true){
			case (count >= 1  && count <  4):self.message = win_text1[self.randomNumber(4)];break;
			case (count >= 4  && count <  7):self.message = win_text2[self.randomNumber(4)];break;
			case (count >= 7  && count < 10):self.message = win_text3[self.randomNumber(4)];break;
			case (count >= 10 && count < 15):self.message = win_text4[self.randomNumber(4)];break;
			case (count >= 15 && count < 20):self.message = win_text5[self.randomNumber(4)];break;
			case (count >= 20):self.message = "You Are God!";break;
			default:self.message = "Correct!";
		}
	}
	self.loseMessage = function(){
		switch(true){
			case (turn == 1):self.message = lose_text1[self.randomNumber(4)];break;
			case (turn > 1  && turn <  5):self.message = lose_text2[self.randomNumber(4)];break;
			case (turn >= 5 && turn < 10):self.message = lose_text3[self.randomNumber(4)];break;
			case (turn >= 10):self.message = "You Were Amazing!";break;
			default:self.message = "Game Over Man";
		} 
	}
	self.randomNumber = function(num){return Math.floor(Math.random()*num);}
	self.scoreCount = function(){
		switch(true){
			case (turn <= 4):self.score++;break;
			case (turn >=5  && turn <  8):self.score+=10;break;
			case (turn >=8  && turn < 10):self.score+=50;break;
			case (turn >=10 && turn < 15):self.score+=100;break;
			case (turn >=15 && turn < 20):self.score+=500;break;
			case (turn >=20):self.score+=1000;break;
			default:self.score+=7;
		} 
	}
	self.gameOver = function(){
		self.loseMessage();
		$timeout(function(){self.colorClicked(self.tetra_choices[count]);}, timer*1.5);
		$timeout(function(){self.colorClicked(self.tetra_choices[count]);}, timer*3);
		$timeout(function(){self.message = "Try Again";}, timer*4.5);
		$timeout(function(){self.reset();}, timer*7.5);
	}
});
