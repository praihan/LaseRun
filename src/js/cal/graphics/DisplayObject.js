this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	
	var DisplayObject = function() {
		this._location = new CAL.Graphics.Vector2(0, 0);
		this._size = new CAL.Graphics.Vector2(0, 0);
	}
	
	var p = DisplayObject.prototype;
	
	p.setLocation = function(x, y) {
		if (!y) {
			this._location = new CAL.Graphics.Vector2(x.x, x.y);
		}
		this._location = new CAL.Graphics.Vector2(x, y);
	}
	
	p.setX = function(x) {
		this._location.x = x;
	}
	
	p.setY = function(x) {
		this._location.y = y;
	}
	
	p.setSize = function(w, h) {
		if (!h) {
			this._location = new CAL.Graphics.Vector2(w.width, w.height);
		}
		this._location = new CAL.Graphics.Vector2(w, h);
	}
	
})();