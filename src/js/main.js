var TARGET_FPS = 60;
var SHOW_FPS = true;

var CAL = CAL || {};

CAL.Gamex = CAL.Gamex || {};

CAL.Gamex.TARGET_FPS = 60;

CAL.Gamex.Main = (function () {
	
    function run() {
		var resize = function() {
			var c = document.getElementById("main-canvas");
			c.width = $(document).width();
			c.height = $(document).height();
		}
		window.onresize = resize;
		resize();
		
		var rect = new CAL.Graphics.RectangleShape(15, 15, 100, 100);
		var circle = new CAL.Graphics.CircleShape(250, 250, 50);
		
		var img = new Image();
		img.src = "assets/img/temp.png";
		
		var lastTick = new Date();
		
		var globalUpdate = function() {
			var canvas = document.getElementById("main-canvas");
			var context = canvas.getContext("2d");
			
			var thisTick = new Date();
			var tickRate = CAL.Gamex.TARGET_FPS;
			if (lastTick != thisTick) {
				tickRate = 1000 / (thisTick - lastTick);
				lastTick = thisTick;
			}
			
			var renderParams = new CAL.Graphics.RenderParams(context, tickRate);
			
			context.fillStyle = CAL.Graphics.Colors.BLACK;
			context.fillRect(0, 0, canvas.width, canvas.height);
			
			context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, CAL.Graphics.FontStyles.BOLD);
			
			context.fillStyle = CAL.Graphics.Colors.RED;
			rect.fill(context);
			
			context.lineWidth = 5;
			context.strokeStyle = CAL.Graphics.Colors.ALICE_BLUE;
			circle.stroke(context);
			context.drawImage(img, 300, 300);
			
			context.fillStyle = CAL.Graphics.Colors.WHITE;
			
			context.fillText(Math.floor(tickRate).toString(), 200, 50);
		}
		var intervalID = setInterval(globalUpdate, 1000 / TARGET_FPS);
    }
	
	return {
		run: run
	};
	
})();


