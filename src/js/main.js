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
			context.fillStyle = "black";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = "red";
			context.fillRect(10, 10, 50, 50);
			context.beginPath();
			context.arc(100, 20, 0, 2 * Math.PI, false);
			context.closePath();
			context.fill();
		}
		var loop = setInterval(draw, 1000 / FPS);
    },
	
}
