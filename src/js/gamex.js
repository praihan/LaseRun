this.CAL = this.CAL || {};

CAL.Gamex = CAL.Gamex || {};

CAL.Gamex.TARGET_FPS = CAL.Gamex.TARGET_FPS || 60;

CAL.Gamex.TARGET_UPDATE_FPS = CAL.Gamex.TARGET_UPDATE_FPS || 1000;



CAL.Gamex.Game = function(resources) {	
	this._lastFPSUpdate = CAL.Gamex.TARGET_UPDATE_FPS;
	this._cachedDelta = 0;
	this.tempImg = null;
}

CAL.Gamex.Game.prototype.update = function(updateParams) {
	var delta = updateParams.event.delta;
	this._lastFPSUpdate += delta;
	if (this._lastFPSUpdate > CAL.Gamex.TARGET_UPDATE_FPS) {
		this._lastFPSUpdate = 0;
		this._cachedDelta = delta;
	}
	if (updateParams.first) {
		var canvas = updateParams.canvas;
		$(canvas).css("background-color", CAL.Graphics.Colors.BLACK);
	}
}

CAL.Gamex.Game.prototype.draw = function(renderParams) {
	var canvas = renderParams.canvas;
	var context = canvas.getContext("2d");
	
	context.fillStyle = CAL.Graphics.Colors.BLACK;
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, [CAL.Graphics.FontStyles.BOLD, CAL.Graphics.FontStyles.ITALIC]);	
	context.fillStyle = CAL.Graphics.Colors.WHITE;
	
	context.fillText(this._cachedDelta == 0 ? "Infinite" : Math.floor(1000 / this._cachedDelta).toString(), 200, 50);
};