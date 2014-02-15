this.CAL = this.CAL || {};

var gamex = this.CAL.Gamex = this.CAL.Gamex || {};

(function() {
	
	gamex.TARGET_FPS = CAL.Gamex.TARGET_FPS || 60;

	gamex.TARGET_UPDATE_FPS = CAL.Gamex.TARGET_UPDATE_FPS || 1000;
	
	gamex.Game = function(resources) {	
		this._lastFPSUpdate = CAL.Gamex.TARGET_UPDATE_FPS;
		this._cachedDelta = 0;
		this.tempImg = null;
	}
	
	var p = gamex.Game.prototype;
	
	p.update = function(updateParams) {
		var delta = updateParams.event.delta;
		this._lastUpdateParams = updateParams;
		
		if (updateParams.first) {
			var canvas = updateParams.canvas;
			$(canvas).css("background-color", CAL.Graphics.Colors.BLACK);
			this.tempImage = updateParams.resources.getResult("temp");
			this._fpsTimer = new CAL.Util.DeltaTimer(
				CAL.Gamex.TARGET_UPDATE_FPS, 
				function(_this) {
					_this._cachedDelta = _this._lastUpdateParams.event.delta;
				}, 
				this,
				CAL.Gamex.TARGET_UPDATE_FPS);
		}
		this._fpsTimer.update(delta);
	}
	
	p.draw = function(renderParams) {
		var canvas = renderParams.canvas;
		var context = canvas.getContext("2d");
		
		context.fillStyle = CAL.Graphics.Colors.BLACK;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		context.font = CAL.Graphics.getFont("Ubuntu Mono", 50, [CAL.Graphics.FontStyles.BOLD, CAL.Graphics.FontStyles.ITALIC]);	
		context.fillStyle = CAL.Graphics.Colors.WHITE;
		
		context.fillText(this._cachedDelta == 0 ? "Infinite" : Math.floor(1000 / this._cachedDelta).toString(), 200, 50);
		
		context.drawImage(this.tempImage, 200, 200, this.tempImage.width, this.tempImage.height);
	};
	
})();