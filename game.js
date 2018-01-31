$.Init = function () {	
    $.InitGameStates();
    $.InitRequestAnimationFrame();
    $.InitWindowEvents();
    $.InitGameVariables();
    $.InitCanvas();

    $.ToggleGameState($.GameStateLoading);   		
	
    $.GameLoop();
};

$.InitGameStates = function () {
    $.GameStates = { Menu: 0, Loading: 0, Play: 0, Pause: 0, Score: 0, HighScore: 0 };
    $.GameStateMenu = 1;
    $.GameStateLoading = 2;
    $.GameStatePlay = 3;
    $.GameStatePause = 4;
    $.GameStateScore = 5;
    $.GameStateHighScore = 6;
};

$.InitRequestAnimationFrame = function () {
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
};

$.InitWindowEvents = function () {
    window.addEventListener('mousemove', $.MouseMove);
    window.addEventListener('mousedown', $.MouseDown);
    window.addEventListener('mouseup', $.MouseUp);
    window.addEventListener('keydown', $.KeyDown);
    window.addEventListener('keyup', $.KeyUp);
    window.addEventListener("keypress", $.KeyPress);
    window.addEventListener('resize', $.Resize);    
};

$.InitGameVariables = function () {
    $.Keys = [];
    $.KeyCodes = { A: 65, D: 68, S: 83, W: 87, ESC:27, ENTER: 13, SHIFT: 16, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    $.MousePoint = new $.Point(0, 0);
    $.IsMouseDown = false;
    $.Delta = 0;
    $.Then = Date.now();

    $.Canvas = document.getElementById('canvas');
    $.Gtx = $.Canvas.getContext('2d');
};

$.InitCanvas = function () {
    //$.CanvasWidth = 600;//window.innerWidth;
    //$.CanvasHeight = 600;//window.innerHeight;
	//$.CanvasBounds = new $.Rectangle(0, 0, $.CanvasWidth, $.CanvasHeight);

	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
	$.AspectRatio = 1;
	var windowRatio = newWidth / newHeight;

	if (windowRatio > $.AspectRatio) {
		// window width is too wide relative to desired game width
		newWidth = newHeight * $.AspectRatio;
	}
	else {
		// window height is too high relative to desired game height
		newHeight = newWidth / $.AspectRatio;
	}

	$.CanvasBounds = new $.Rectangle(0, 0, newWidth, newHeight);	

	$.Canvas.width = newWidth;
	$.Canvas.height = newHeight;
	$.Canvas.style.marginTop = -newHeight / 2 + 'px';
	$.Canvas.style.marginLeft = -newWidth / 2 + 'px';
};


$.MouseMove = function (e) {
    if ($.GameStates.Play == 1) {
        $.MousePoint = new $.Point(e.clientX - $.Canvas.offsetLeft, e.clientY - $.Canvas.offsetTop);
    }
};

$.MouseDown = function () {
    $.IsMouseDown = true;
};

$.MouseUp = function () {
	$.IsMouseDown = false;
	if ($.GameStates.Play === 1) { $.CurrentGame.MouseUp()}
};

$.KeyDown = function (e) {
    $.Keys[e.keyCode] = true;

    if ($.Keys[$.KeyCodes.ESC]) {
        if ($.GameStates.Play == 1) {
            $.MenuPauseGame();
        }
    }
};

$.KeyUp = function (e) {
    $.Keys[e.keyCode] = false;
};

$.KeyPress = function (e) {

};

$.Resize = function () {
    $.InitCanvas();
};


$.ToggleGameState = function (state) {
    $.GameStates.Menu = 0;
    $.GameStates.Loading = 0;
    $.GameStates.Play = 0;
    $.GameStates.Pause = 0;
    $.GameStates.Score = 0;
    $.GameStates.HighScore = 0;

    //document.body.style.cursor = '';

    switch (state) {
        case $.GameStateMenu:
            $.GameStates.Menu = 1;
            break;
        case $.GameStateLoading:
        		$.GameStates.Loading = 1;
        		$.LoadImages();
            break;
        case $.GameStatePlay:
            $.GameStates.Play = 1;
            //document.body.style.cursor = 'none';
            break;
        case $.GameStatePause:
            $.GameStates.Pause = 1;
            break;
        case $.GameStateScore:
            $.GameStates.Score = 1;
            break;
        case $.GameStateHighScore:
            $.GameStates.HighScore = 1;
            break;
    }
};

$.LoadImages = function () {
    $.ImageCount = 1;
    $.ImagesLoaded = 0;

    $.ImageOne = new Image();
    $.ImageOne.onload = function () { $.ImagesLoaded++; }
    $.ImageOne.src = "image1.png";        
};

$.Loading = function () {
    if ($.ImagesLoaded === $.ImageCount) {
        $.ToggleGameState($.GameStatePlay);
        //document.body.style.cursor = 'none';        
		
		$.CurrentGame = new $.ShuffleGame();	
		$.CurrentGame.Start();
    }
};

$.GameLoop = function () {
    window.requestAnimationFrame($.GameLoop);

    $.UpdateDelta();

    if ($.GameStates.Menu == 1) {

    }
    else if ($.GameStates.Loading == 1) {
        $.Loading();
    }
    else if ($.GameStates.Play == 1) {		
        $.CurrentGame.Update();
		$.CurrentGame.Draw();
    }
    else if ($.GameStates.Pause == 1) {
        
    }
    else if ($.GameStates.Score == 1) {
        
    }
};

$.UpdateDelta = function () {
    var now = Date.now();
    var delta = now - $.Then;
    $.Delta = delta / 1000;
    $.Then = now;
};