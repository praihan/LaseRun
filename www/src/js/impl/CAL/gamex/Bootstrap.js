this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	
	var preloadManifest = [
		{id: "temp", src:"assets/img/temp.png"},
	];
	
	var CANVAS_NAME = "main-canvas";
	
	var Bootstrap = function() {
	}
	
	var s = Bootstrap;
	
    s.run = function() {
		var canvas = document.getElementById(CANVAS_NAME);
		
		var resize = function() {
			canvas.width = jQuery(document).width();
			canvas.height = jQuery(document).height();
		}
		window.onresize = resize;
		resize();
		
		var pointerState = registerPointer(canvas);
		
		var keyboardState = new CAL.lang.Keyboard(canvas);
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.gamex.Game();
		
		resources.on("complete", function() {
			
			createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
			createjs.Ticker.setFPS(CAL.gamex.TARGET_FPS);
			
			var first = true;
			canvas.focus();
			createjs.Ticker.on("tick", function(evt) {			
				var params = {
					tickEvent: evt, 
					resources: resources, 
					canvas: canvas, 
					first: first,
					pointer: pointerState,
					keyboard: keyboardState
				};
				
				keyboardState.update();
				game.update(params);
				game.draw(params);
				first = false;
				
			}, this);
			
		}, this);
		
		resources.loadManifest(preloadManifest);
    }
	
	
	
	
	var registerPointer = function(canvas) {
		var clickListeners = new Array();
		var pointerState = {
			LEFT: 1,
			MIDDLE: 2,
			RIGHT: 3,
			
			down: {},
			location: {x: 0, y: 0},
			
			addEventListener: function(type, callback, callbackScope) {
				switch (type) {
					case "click":
					case "tap":
						clickListeners[clickListeners.length] = {
							callback: callback,
							scope: callbackScope || callback || this,
						}
						break;
					default:
						canvas.addEventListener(type, function(evt) {
							callback.call(callbackScope || callback || this, evt);
						});
				}
			}
		};
		
		var mouseupListener = function(evt) {
			if (pointerState.down[evt.which]) {
				for (var i = 0; i < clickListeners.length; ++i) {
					var c = clickListeners[i];
					c.callback.call(c.scope, evt);
				}
			}
			delete pointerState.down[evt.which];
		}
		canvas.addEventListener("mouseup", mouseupListener);
		
		var mousemoveListener = function(evt) {
			pointerState.location = {x: evt.clientX, y: evt.clientY};
		}
		canvas.addEventListener("mousemove", mousemoveListener);
		
		var mousedownListener = function(evt) {
			pointerState.down[evt.which] = true;
			mousemoveListener(evt);
		}
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
				if (pointerState.down[pointerState.LEFT]) {
					for (var i = 0; i < clickListeners.length; ++i) {
						var c = clickListeners[i];
						c.callback.call(c.scope, evt);
					}
				}
				delete pointerState.down[pointerState.LEFT];
			}
			canvas.addEventListener("touchend", touchendListener);
		}
		return pointerState;
	}
	
	
	
	CAL.gamex.Bootstrap = Bootstrap;
	
})();


