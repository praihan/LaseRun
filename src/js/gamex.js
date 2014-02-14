this.CAL = this.CAL || {};

CAL.Gamex = CAL.Gamex || {};

CAL.Gamex.TARGET_FPS = CAL.Gamex.TARGET_FPS || 60;




CAL.Gamex.Game = function(resources) {	
	this._resources = resources;
}

CAL.Gamex.Game.prototype.update = function(updateParams) {
	
}

CAL.Gamex.Game.prototype.draw = function(renderParams) {

	var canvas = renderParams.canvas;
	var context = canvas.getContext("2d");
	
	context.fillStyle = CAL.Graphics.Colors.BLACK;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, [CAL.Graphics.FontStyles.BOLD, CAL.Graphics.FontStyles.ITALIC]);
	/*
	context.fillStyle = CAL.Graphics.Colors.RED;
	this.rect.fill(context);
	
	context.lineWidth = 5;
	context.strokeStyle = CAL.Graphics.Colors.ALICE_BLUE;
	this.circle.stroke(context);
	context.drawImage(this.img, 300, 300);
	
	context.fillStyle = CAL.Graphics.Colors.WHITE;	
	context.fillText(Math.floor(renderParams.event.delta / 1000).toString(), 200, 50);
	*/
//*/
};