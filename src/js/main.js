CAL.Gamex.Main = (function () {
	
	var manifest = [
		{id: temp, src:"assets/img/temp.png"},
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
		
		var stage = new createjs.Stage(document.getElementById(CANVAS_NAME));
		var game = new CAL.Gamex.Game();
		
		var globalUpdate = function(evt) {
		}
		
		var resources = new createjs.LoadQueue(false);
		resources.addEventListener("complete", function() {
			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.addEventListener("tick", function(evt) {
				var canvas = document.getElementById(CANVAS_NAME);
				
				var params = {event: evt, resources: resources, stage: stage};
				
				game.update(params);
				game.draw(params);						  
			});
		});
		resources.loadManifest(manifest);
    }
	
	return {
		run: run,
		intervalID: this.intervalID
	};
	
})();


