this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	
	var subPath = function(basePath, relPath) {
		return (basePath.charAt(basePath.length - 1) == '/' ? basePath + relPath : basePath + "/" + relPath);
	}
	
	var assetDir = "assets";
	var imgDir = subPath(assetDir, "img");
	
	var imgPath = function(relPath) {
		return subPath(imgDir, relPath);
	}
	
	var preloadManifest = [
		{id: "sky", src: imgPath("sky.png")},
		{id: "dirt_ground_1", src: imgPath("dirt_ground_1.png")}
	];
	
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
		
		var pointerState = new CAL.lang.Mouse(canvas);
		
		var keyboardState = new CAL.lang.Keyboard(canvas);
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.gamex.Game();
		
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
				};
				
				keyboardState.update();
				game.update(params);
				game.draw(params);
				first = false;
				
			}, this);
			
		}, this);
		
		resources.loadManifest(preloadManifest);
    }	
	
	CAL.gamex.Bootstrap = Bootstrap;
	
})();


