function edgeIECheck() {
	if (/MSIE 10/i.test(navigator.userAgent)) {
	   // This is internet explorer 10
	   return true;
	}

	if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
	    // This is internet explorer 9 or 11
	    return true;
	}

	if (/Edge\/\d./i.test(navigator.userAgent)){
	   // This is Microsoft Edge
	   return true;
	}
	return false;
}

var microsoft = edgeIECheck();

console.log(microsoft);

var $span = $('span'),
		$audio1 = $('audio')[0],
		$audio2 = $('audio')[1],
		$audio3 = $('audio')[2],
		$audio4 = $('audio')[3],
		$green = $('.top-left'),
		$red = $('.top-right'),
		$yellow = $('.bottom-left'),
		$blue = $('.bottom-right'),
		$press = $('.press');

// closes white space between buttons displayed on microsoft browsers
if (microsoft) {
	$green.css('margin-bottom', '-4px');
	$red.css('margin-bottom', '-4px');
}

var colors = [$green, $red, $yellow, $blue];
var strictMode = false;
var count = 0;
var sequence = [];
var current = null;
var subCount = 0;
var gameStart = false;
var userTurn = false;

//function to set count to 0;
function initial() {
	count = 0;
	sequence = [];
	current = null;
	subCount = 0;
	gameStart = false;
	userTurn = false;
}

//add color to sequence
function addColor() {
	count++;
	var text = "0" + count;
	$span.text(text.slice(-2));
	sequence.push(Math.floor(Math.random()*4));
	subCount = 0;
	current = sequence[subCount];
}

//plays colors in current sequence
function pattern() {
	for (var i=0; i<sequence.length; i++) {
		
		setTimeout((function(color) {
			return function() {
				color.addClass('pressed');
				color.trigger('click');
				setTimeout(function() {					
					color.removeClass('pressed');
				}, 400);
			}
			
		})(colors[sequence[i]]), 800*i);
	}
	setTimeout(function() {
		userTurn = true;
	}, 800*sequence.length);
}

//plays all button lights to signify that the player has won
function winPattern() {
	for (var i=0; i<colors.length; i++) {
		setTimeout((function(index) {
			return function() {
				$press.addClass('pressed');
				$('audio')[index].play();
				setTimeout(function() {
					$press.removeClass('pressed');
				}, 300);
			}
		})(i), 600*i);
	}
}

//adds color to sequence then plays sequence
function colorPlusPattern(time) {
	setTimeout(function() {
		addColor();
		pattern();
	}, time);
}

//checks whether button press matches next button in current sequence
function colorCheck(colorId) {
	if (colorId == current) {
		if (subCount == 19) {
			setTimeout(function() {
				winPattern();
				initial();
				$span.text("00");
				$span.removeClass('start');
			},800);
		} else if (subCount == sequence.length-1) {
			userTurn = false;
			colorPlusPattern(1250);
		} else {
			subCount++;
			current = sequence[subCount];
		}		
	} else {
		userTurn = false;
		// audio1 and audio2 played in succession to make a sound indicating an incorrect button press
		$audio1.play();
		$audio2.play();
		$span.text('!!');
		if (!strictMode) {
			subCount = 0;
			current = sequence[subCount];
			setTimeout(function() {
				var text = "0" + count;
				$span.text(text.slice(-2));
				pattern();
			}, 1250);
		} else {
			initial();
			gameStart = true;
			colorPlusPattern(1250);
		}		
	}
}


$('#start').on('click', function() {
	$span.addClass('start');
	if (!gameStart) {
		gameStart = true;
		colorPlusPattern(750);
	}
});

$('#strict').on('click', function() {
	var $this = $(this);
	if ($this.hasClass('active')) {
		$this.removeClass('active');
		strictMode = false;
	} else {
		$this.addClass('active');
		strictMode = true;
	}
});

$('#reset').on('click', function() {
	initial();
	$span.removeClass('start');
	$span.text('00');
});

$press.on('mousedown', function() {
	$(this).addClass('pressed');
});

$('body').on('mouseup', function() {
	$press.removeClass('pressed');
});

$green.on('click', function() {
	$audio1.play();
	if (gameStart && userTurn) {
		colorCheck(0);
	}
});

$red.on('click', function() {
	$audio2.play();
	if (gameStart && userTurn) {
		colorCheck(1);
	}
});

$yellow.on('click', function() {
	$audio3.play();
	if (gameStart && userTurn) {
		colorCheck(2);
	}
});

$blue.on('click', function() {
	$audio4.play();
	if (gameStart && userTurn) {
		colorCheck(3);
	}
});