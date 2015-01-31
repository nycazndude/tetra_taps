angular.module("tap", [])

.controller("controller", function($timeout, $interval, $scope){
	var self = this;
	var timer = 500;
	var speed = 1000;
	var turn = 1;
	var wait = speed * (turn+2.5); 
	var count = 0;
	self.tetra_choices = [];
	self.red_click = false;
	self.blue_click = false;
	self.green_click = false;
	self.yellow_click = false;
	self.play = true;
	self.player_turn = false;
	self.play_text = "Play";
	self.message = ""; 

	self.initialize = function(){
		console.log("initialize");
		var speed = 1000;
		var turn = 1;
		var wait = speed * (turn+2.5); 		
		self.red_click = false;
		self.blue_click = false;
		self.green_click = false;
		self.yellow_click = false;
		self.play = true;
		self.player_turn = false;
		self.play_text = "Play";
		self.message = ""; 
	}

	self.colorClicked = function(color){
		if(color == "green"){self.green_click = true;}
		else if(color == "red"){self.red_click = true;}
		else if(color == "blue"){self.blue_click = true;}
		else if(color == "yellow"){self.yellow_click = true;}
		else{console.log("invalid color");}
		
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
			self.tetrasTurn(turn, speed);
		}, timer/2);
		
	}

	self.tetrasTurn = function(turn, speed){
		self.player_turn = false;
		timer = speed/2;
		wait = speed * (turn+2); 
		self.message = "Tetra's Turn";
		$timeout(function(){
			var i = 0;
			var stop = $interval(function(){
				if(i >= turn-1){
					$interval.cancel(stop);
				}
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
				}else{self.message="Error"}
				i++;
			}, speed); 
		}, timer);

		self.playersTurn();
	}	

	self.detectClicks = function(color){
		if(color == self.tetra_choices[count]){
			console.log(count, self.tetra_choices[count]);
			count++;	
			self.message = "Correct!";
			if(count >= self.tetra_choices.length){
				count = 0;
				turn++;
				self.tetra_choices = [];
				$timeout(function(){
					speed -= 50;
					self.tetrasTurn(turn, speed);	
				}, 1000);
			}
			$timeout(function(){
				self.message = "Your Turn";
			}, timer);
		}else{
			self.gameOver();
		}
	}
	
	self.playersTurn = function(){
		$timeout(function(){
			self.player_turn = true;
			self.message = "Your Turn";
			console.log("player turn: "+self.player_turn);
			timer = 500;
		}, wait);
		
	}

	self.gameOver = function(){
		var random_text = Math.floor(Math.random()*4);
		if(random_text == 0 && turn < 5){self.message = "Oops";}
		else if(random_text == 1 && turn < 5){self.message = "Wrong One";}
		else if(random_text == 2 && turn < 5){self.message = "Sorry";}
		else if(random_text == 3 && turn < 5){self.message = "Nope";} 
		else if(random_text == 0 && turn >= 5 && turn < 10){self.message = "Not Bad";}
		else if(random_text == 1 && turn >= 5 && turn < 10){self.message = "Keep It Up";}
		else if(random_text == 2 && turn >= 5 && turn < 10){self.message = "Bummer";}
		else if(random_text == 3 && turn >= 5 && turn < 10){self.message = "Game Over";}
		else if(turn > 10){self.message="That Was Amazing"}
		else{self.message = "Game Over";}

		$timeout(function(){
			self.message = "Try Again"
		}, timer*3);
		$timeout(function(){
			count = 0;
			turn = 1;
			self.tetra_choices = [];
			self.initialize();
		}, timer*6);
	}
});
