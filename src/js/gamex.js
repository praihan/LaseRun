var CAL = CAL || {};

CAL.Gamex = CAL.Gamex || {};

CAL.Gamex.TARGET_FPS = CAL.Gamex.TARGET_FPS || 60;




CAL.Gamex.Game = function() {
	this.rect = new CAL.Graphics.RectangleShape(15, 15, 100, 100);
	this.circle = new CAL.Graphics.CircleShape(250, 250, 50);
	
	this.img = new Image();
	this.img.src = "assets/img/temp.png";
	this._firstUpdate = false;
}

CAL.Gamex.Game.prototype.update = function(updateParams) {
	
}

CAL.Gamex.Game.prototype.draw = function(renderParams) {
	var canvas = renderParams.getCanvas();
	var context = canvas.getContext("2d");
	
	context.fillStyle = CAL.Graphics.Colors.BLACK;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, [CAL.Graphics.FontStyles.BOLD, CAL.Graphics.FontStyles.ITALIC]);
	
	context.fillStyle = CAL.Graphics.Colors.RED;
	this.rect.fill(context);
	
	context.lineWidth = 5;
	context.strokeStyle = CAL.Graphics.Colors.ALICE_BLUE;
	this.circle.stroke(context);
	context.drawImage(this.img, 300, 300);
	
	context.fillStyle = CAL.Graphics.Colors.WHITE;	
	context.fillText(Math.floor(renderParams.getTickRate()).toString(), 200, 50);
}