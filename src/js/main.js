
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
		
		var rect = new RectangleShape(15, 15, 100, 100);
		var circle = new CircleShape(250, 250, 50);
		var img = new Image();
		img.src = "assets/img/temp.png";
		
		var canvas = document.getElementById("main-canvas");
		var context = canvas.getContext("2d");
		var draw = function() {
			context.fillStyle = "black";
			context.fillRect(0, 0, canvas.width, canvas.height);
			
			context.fillStyle = "red";
			rect.fill(context);
			
			context.lineWidth = 5;
			context.strokeStyle = "red";			
			circle.stroke(context);
			context.drawImage(img, 300, 300);
		}
		setInterval(draw, 1000 / FPS);
    },
	
}


