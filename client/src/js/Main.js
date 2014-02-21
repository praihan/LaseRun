CAL.Gamex.Main = (function () {
	
	var preloadManifest = [
		{id: "temp", src:"assets/img/temp.png"},
	];
	
	var CANVAS_NAME = "main-canvas";
	
    function run() {
		var resize = function() {
			var c = document.getElementById(CANVAS_NAME);
			c.width = jQuery(document).width();
			c.height = jQuery(document).height();
		}
		window.onresize = resize;
		resize();
		
		var canvas = document.getElementById(CANVAS_NAME);		
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.Gamex.Game();
		
		resources.on("complete", function() {
			
			createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
			createjs.Ticker.setFPS(CAL.Gamex.TARGET_FPS);
			
			var first = true;
			createjs.Ticker.on("tick", function(evt) {
				var canvas = document.getElementById(CANVAS_NAME);
				
				var params = {
					event: evt, 
					resources: resources, 
					canvas: canvas, 
					first: first,
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


