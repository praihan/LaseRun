var FPS = 60;

Main = {
	
    main: function() {
		var resize = function() {
			var c = document.getElementById("main-canvas");
			c.width = $(document).width();
			c.height = $(document).height();
		}
		window.onresize = resize;
		resize();
		
		var draw = function() {
			var canvas = document.getElementById("main-canvas");
			var context = canvas.getContext("2d");
			context.fillStyle = "#0";
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
		var loop = setInterval(draw, 1000 / FPS);
    },
	
}
