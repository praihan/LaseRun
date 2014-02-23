CAL.Gamex.Main = (function(undefined) {
	
	var preloadManifest = [
		{id: "temp", src:"assets/img/temp.png"},
	];
	
	var CANVAS_NAME = "main-canvas";
	
    function run() {
		var canvas = document.getElementById(CANVAS_NAME);
		
		var resize = function() {
			canvas.width = jQuery(document).width();
			canvas.height = jQuery(document).height();
		}
		window.onresize = resize;
		resize();
		
		var pointerState = {
			LEFT: 1,
			MIDDLE: 2,
			RIGHT: 3,
			
			down: {"1": false, "2": false, "3": false},
			location: {x: 0, y: 0},
		};
		
		var mouseupListener = function(evt) {
			pointerState.down[evt.which] = false;
		}
		canvas.addEventListener("mouseup", mouseupListener);
		
		var mousemoveListener = function(evt) {
			pointerState.location = {x: evt.clientX, y: evt.clientY};
		}
		canvas.addEventListener("mousemove", mousemoveListener);
		
		var mousedownListener = function(evt) {
			pointerState.down[evt.which] = true;
			mousemoveListener(evt);
		};
		canvas.addEventListener("mousedown", mousedownListener);
		
		if ("ontouchstart" in document.documentElement) {
			var touchstartListener = function(evt) {
				var first = evt.changedTouches[0];
				pointerState.down[pointerState.LEFT] = true;
				mousemoveListener(first);
			}
			canvas.addEventListener("touchstart", touchstartListener);
			
			var touchmoveListener = function(evt) {
				mousemoveListener(evt.changedTouches[0]);
			}
			canvas.addEventListener("touchmove", touchmoveListener);
			
			var touchendListener = function(evt) {
				var first = evt.changedTouches[0];
				pointerState.down[pointerState.LEFT] = false;
			}
			canvas.addEventListener("touchend", touchendListener);
		}
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.Gamex.Game();
		
		resources.on("complete", function() {
			
			createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
			createjs.Ticker.setFPS(CAL.Gamex.TARGET_FPS);
			
			var first = true;
			createjs.Ticker.on("tick", function(evt) {			
				var params = {
					tickEvent: evt, 
					resources: resources, 
					canvas: canvas, 
					first: first,
					pointerState: pointerState,
				};
				
				game.update(params);
				game.draw(params);
				first = false;
				
			}, this);
			
		}, this);
		
		resources.loadManifest(preloadManifest);
		
    }
	
	return {
		run: run,
	};
	
})();


