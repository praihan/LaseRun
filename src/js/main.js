CAL.Gamex.Main = (function () {
	
    function run() {
		var resize = function() {
			var c = document.getElementById("main-canvas");
			c.width = $(document).width();
			c.height = $(document).height();
		}
		window.onresize = resize;
		resize();
		
		var lastTick = new Date();
		
		var game = new CAL.Gamex.Game();
		
		var globalUpdate = function() {
			var canvas = document.getElementById("main-canvas");
			
			var thisTick = new Date();
			var tickRate = CAL.Gamex.TARGET_FPS;
			if (lastTick != thisTick) {
				tickRate = 1000 / (thisTick - lastTick);
				lastTick = thisTick;
			}
			
			var renderParams = new CAL.Graphics.RenderParams(canvas, tickRate);
			var updateParams = {};
			
			game.update(updateParams);
			game.draw(renderParams);
		}
		
		globalUpdate();
		this.intervalID = setInterval(globalUpdate, 1000 / CAL.Gamex.TARGET_FPS);
    }
	
	return {
		run: run,
		intervalID: this.intervalID
	};
	
})();


