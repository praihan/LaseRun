
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
			var rect = new RectangleShape(15, 15, 100, 100);
			rect.fill(context);
			
			context.lineWidth = 5;
			context.strokeStyle = "red";
			var circle = new CircleShape(250, 250, 50);
			circle.stroke(context);
		}
		
		setInterval(draw, 1000 / FPS);
    },
	
}


