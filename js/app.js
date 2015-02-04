angular.module("tap", [])
.controller("controller", function($timeout, $interval){
	var self = this;
	var timer = 500;
	var speed = 1000;
	var count = 0;
	var wait = speed * (self.level+2);
	var win_text1  = ["Correct!",          "Easy!",       "Yep!",      "No Sweat!",      "Rock On!", "Yay!"        ];
	var win_text2  = ["Right On!",         "Bingo!",      "Nice!",     "Good!",          "Yes!",     "Cool"      ];
	var win_text3  = ["On Fire!",          "You Got It!", "Awesome!",  "Keep It Up!",    "Sweet!",   "Fantastic!"];
	var win_text4  = ["Oh Yeah Baby!",     "Amazing!",    "Wow!",      "You're Good",    "A++",      "Brilliant!"];
	var win_text5  = ["Are You Cheating?", "OWNAGE!",     "Wrecking!", "Terrific!",      "You're The Bomb!"      ];
	var lose_text1 = ["Sigh..",            "T.T",         "No Good",   "Not Even Close", "Try Harder!"           ];
	var lose_text2 = ["Oops!",             "Wrong One",   "Sorry!",    "Nope",           "Yikes!"                ];
	var lose_text3 = ["Maybe Next Time?",  "Oopsies!",    "Oh No...",  "Bummer!",        "Ay Yaah!",    "Close!" ];	
	var lose_text4 = ["You Were Amazing!", "You Had It!", "So Close!", "Ouch!",          "Unlucky!"];
	self.score = 0;
	self.level = 0;
	self.light = false;
	self.score_clicked = false;
	self.tetra_choices = [];
	self.score_board = [];
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
		count = 0;
		wait = speed * (self.level+2);
		self.score = 0;
		self.level = 0;
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
		self.level++;
		timer = speed/2;
		wait = speed * (self.level+2); // waits for tetra to finish clicks
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
			if(i >= self.level-1){$interval.cancel(stop);}
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
			if(i >= self.level-1){$interval.cancel(stop);}
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
			case (count >= 1  && count <  3):self.message = win_text1[self.randomNumber(win_text1.length)];break;
			case (count >= 3  && count <  6):self.message = win_text2[self.randomNumber(win_text2.length)];break;
			case (count >= 6  && count <  9):self.message = win_text3[self.randomNumber(win_text3.length)];break;
			case (count >= 9  && count < 12):self.message = win_text4[self.randomNumber(win_text4.length)];break;
			case (count >= 12 && count < 16):self.message = win_text5[self.randomNumber(win_text5.length)];break;
			case (count >= 16):self.message = "You Are God!";break;
			default:self.message = "Correct!";
		}
	}
	self.loseMessage = function(){
		switch(true){
			case (self.level >= 1  && self.level <  4):self.message = lose_text1[self.randomNumber(lose_text1.length)];break;
			case (self.level >= 4  && self.level <  7):self.message = lose_text2[self.randomNumber(lose_text2.length)];break;
			case (self.level >= 7  && self.level < 10):self.message = lose_text3[self.randomNumber(lose_text3.length)];break;
			case (self.level >= 10 && self.level < 16):self.message = lose_text4[self.randomNumber(lose_text4.length)];break;
			case (self.level >= 16):self.message = "Even God Can Lose";break;
			default:self.message = "Game Over Man";
		} 
	}
	self.randomNumber = function(num){return Math.floor(Math.random()*num);}
	self.scoreCount = function(){
		switch(true){
			case (self.level <= 3):self.score++;break;
			case (self.level >= 3 && self.level <  6):self.score+=7;break;
			case (self.level >= 6 && self.level <  9):self.score+=99;break;
			case (self.level >= 9 && self.level < 12):self.score+=326;break;
			case (self.level >=12 && self.level < 15):self.score+=1239;break;
			case (self.level >=15 && self.level < 20):self.score+=5898;break;
			case (self.level >=20):self.score+=9001;break;
			default:self.score+=7;
		} 
	}
	self.scoreView = function(){
		if(self.score_clicked==true){
			self.score_clicked=false;
		}else{
			self.score_clicked=true;
		}
	}
	self.gameOver = function(){
		self.loseMessage();
		// self.newHighScore();
		$timeout(function(){self.colorClicked(self.tetra_choices[count]);}, timer*1.5);
		$timeout(function(){self.colorClicked(self.tetra_choices[count]);}, timer*3);
		$timeout(function(){self.message = "Try Again";}, timer*4.5);
		$timeout(function(){self.reset();}, timer*7.5);
	}
	// self.newHighScore = function(){
		// if(self.score_board.length == 0){
			// self.score_board.push({name: 'Creator', score: self.score});
		// }
	// }
	self.lightClicked = function(){
		if(self.light==true){
			self.light=false;
			document.body.style.background = "#333"; 
		}else{
			self.light=true;
			document.body.style.background = "whitesmoke";
		}
	}
});








