CAL.Gamex.Main = (function () {
	
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
			
			down: {},
			location: {x: 0, y: 0},
		};
		
		var mousedownListener = function(evt) {
			pointerState.down[evt.which] = true;
		};
		canvas.addEventListener("mousedown", mousedownListener);
		
		var mouseupListener = function(evt) {
			pointerState.down[evt.which] = false;
		}
		canvas.addEventListener("mouseup", mouseupListener);
		
		var mousemoveListener = function(evt) {
			pointerState.location = {x: evt.clientX, y: evt.clientY};
		}
		canvas.addEventListener("mousemove", mousemoveListener);
		
		function touchHandler(evt) {
			var touches = evt.changedTouches,
				first = touches[0],
				type = "";
			switch(evt.type) {
				case "touchstart": type = "mousedown"; break;
				case "touchmove":  type = "mousemove"; break;        
				case "touchend":   type = "mouseup"; break;
				default: return;
			}
			var simulatedEvent = canvas.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1, 
										  first.screenX, first.screenY, 
									  	  first.clientX, first.clientY, false, 
									  	  false, false, false, 0, null);
			
			first.target.dispatchEvent(simulatedEvent);
			evt.preventDefault();
		}
		canvas.addEventListener("touchstart", touchHandler);
		canvas.addEventListener("touchmove", touchHandler);
		canvas.addEventListener("touchend", touchHandler);
		
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


