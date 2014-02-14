CAL.Gamex.Main = (function () {
	
	var manifest = [
		{id: "temp", src:"assets/img/temp.png"},
	];
	
	var CANVAS_NAME = "main-canvas";
	
    function run() {
		var resize = function() {
			var c = document.getElementById(CANVAS_NAME);
			c.width = $(document).width();
			c.height = $(document).height();
		}
		window.onresize = resize;
		resize();
		
		var canvas = document.getElementById(CANVAS_NAME);		
		var stage = new createjs.Stage(canvas);
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.Gamex.Game(resources);
		
		resources.on("complete", function() {
			
			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.setFPS(CAL.Gamex.TARGET_FPS);
			
			createjs.Ticker.on("tick", function(evt) {
				var canvas = document.getElementById(CANVAS_NAME);
				
				var params = {
					event: evt, 
					resources: resources, 
					stage: stage, 
					canvas: document.getElementById(CANVAS_NAME)
				};
				
				game.update(params);
				game.draw(params);
				 
			}, this);
			
		}, this);
		
		resources.loadManifest(manifest);
		
    }
	
	return {
		run: run,
	};
	
})();


