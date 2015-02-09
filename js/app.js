angular.module("tap", [])
.value("THEME",{
	LIGHT_ON:{
		bodyColor: 'bright'
	},
	LIGHT_OFF:{
		bodyColor: 'dark'
	}
})

.controller("controller", function($timeout, $interval, THEME){
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
	var LEADERBOARD_SIZE = 10;
	var score_data = new Firebase('https://tetrataps.firebaseio.com/leaderboard');
	var score_data_view = score_data.limitToLast(LEADERBOARD_SIZE);
	var htmlForPath = {};
	self.THEME = THEME;
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
	self.open_modal = false;
	self.player_name = "nameless";


	// if(self.score_board.length == 0){
	// 	for(i = 0;i < LEADERBOARD_SIZE;i++){
	// 		self.score_board.push({name: 'default', score: 0});
	// 	}
	// }

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
		self.openModal = false;
		score_data_view.on('child_added', function(){self.saveHighScore();});
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
	self.lightClicked = function(){
		if(self.light==true){
			self.light=false;
			self.currentSelection = self.THEME.LIGHT_OFF;
		}else{
			self.light=true;
			self.currentSelection = self.THEME.LIGHT_ON;
		}
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
	self.gameOver = function(){
		self.loseMessage();
		$timeout(function(){self.colorClicked(self.tetra_choices[count]);}, timer*1.5);
		$timeout(function(){self.colorClicked(self.tetra_choices[count]);}, timer*3);
		if(self.score >= self.score_board[self.score_board.length-1].score){
			$timeout(function(){self.message = "High Score!";}, timer*4.5);
			$timeout(function(){newHighScore();}, timer*7.5);			
		}else{
		$timeout(function(){self.message = "Try Again";}, timer*4.5);
		$timeout(function(){self.reset();}, timer*7.5);
		}
	}
	newHighScore = function(){
		self.score_board.splice(9);  
		self.open_modal = true;
	}
	function handleScoreAdded(scoreSnapshot, prevScoreName) {
		var newScoreRow = {name: scoreSnapshot.val().name, score: scoreSnapshot.val().score};
    self.score_board.push(newScoreRow);
    htmlForPath[scoreSnapshot.key()] = newScoreRow;
    self.score_board.sort(function(a,b) {return b.score - a.score});  
  }
	function handleScoreRemoved(scoreSnapshot){
		var removedScoreRow = htmlForPath[scoreSnapshot.key()];
    removedScoreRow.remove();
    delete htmlForPath[scoreSnapshot.key()];
    console.log("deleted");
	}

	score_data_view.on('child_added', function (newScoreSnapshot, prevScoreName) {
    handleScoreAdded(newScoreSnapshot, prevScoreName);
  });
  score_data_view.on('child_removed', function (oldScoreSnapshot) {
    handleScoreRemoved(oldScoreSnapshot);
  });

  var changedCallback = function (scoreSnapshot, prevScoreName) {
    handleScoreRemoved(scoreSnapshot);
    handleScoreAdded(scoreSnapshot, prevScoreName);
  };

  score_data_view.on('child_moved', changedCallback);
  score_data_view.on('child_changed', changedCallback);
	
	self.addHighScore = function(){
		var new_score = score_data.child(self.player_name);
		new_score.setWithPriority({name: self.player_name, score: self.score}, self.score);
		self.reset();
	} 
});








