this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	"use strict";
	
	var subPath = function(basePath, relPath) {
		return (basePath.charAt(basePath.length - 1) == '/' ? basePath + relPath : basePath + "/" + relPath);
	}
	
	var assetDir = "assets";
	var imgDir = subPath(assetDir, "img");
	
	var imgPath = function(relPath) {
		return subPath(imgDir, relPath);
	}
	
	var preloadManifest = [
	];
	
	var loadLevel = function(levelName) {
		preloadManifest.push({id: levelName + "/sky", src: imgPath(subPath(levelName, "sky.png"))});
		preloadManifest.push({id: levelName + "/floor", src: imgPath(subPath(levelName, "floor.png"))});
		preloadManifest.push({id: levelName + "/ground", src: imgPath(subPath(levelName, "ground.png"))});
	}
	
	var loadChar = function(charName) {
		preloadManifest.push({id: "chars/" + charName, src: imgPath(subPath("chars", charName + ".png"))});
	}
	
	loadLevel("skyland");
	loadChar("red_ball");
	loadChar("blue_ball");
	
	var Bootstrap = function() {
	}
	
	var s = Bootstrap;
	
    s.run = function(CANVAS_NAME) {
		var canvas = document.getElementById(CANVAS_NAME);
		canvas.focus();
		
		var resize = function() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		window.addEventListener("resize", resize, false);
		resize();
		
		jQuery(canvas).css("background-color", CAL.graphics.Colors.BLACK);
		
		var pointerState = new CAL.lang.Mouse(canvas);
		
		var keyboardState = new CAL.lang.Keyboard(canvas);
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.gamex.Game();
		game.setFPSFont(CAL.graphics.getFont("Ubuntu Mono", 50, [CAL.graphics.FontStyles.BOLD, CAL.graphics.FontStyles.ITALIC]));
		game.setFPSColor(CAL.graphics.Colors.BLACK);
		game.setScreen(new CAL.gamex.screens.SkyLandScreen());
		
		resources.on("complete", function() {
			
			createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
			createjs.Ticker.setFPS(CAL.gamex.TARGET_FPS);
			
			var first = true;
			createjs.Ticker.on("tick", function(evt) {
				var params = {
					tickEvent: evt, 
					resources: resources, 
					canvas: canvas, 
					first: first,
					pointer: pointerState,
					keyboard: keyboardState,
					viewport: {x: canvas.width, y: canvas.height},
					game: game,
				};
				
				keyboardState.update();
				pointerState.update();
				
				game.update(params);
				game.draw(params);
				
				first = false;
			}, this);
		}, this);
		
		resources.loadManifest(preloadManifest);
    }	
	
	CAL.gamex.Bootstrap = Bootstrap;
	
})();


