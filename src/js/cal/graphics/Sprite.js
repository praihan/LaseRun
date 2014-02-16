this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	
	var ImageOrigin = {
		Image: "image",
		SpriteSheet: "spritesheet",
	}
	
	var Sprite = function(params) {
		this.setDimensions(params.dimensions || {});
		this.setClipping(params.clipping || params.dimensions);
		this.setRotation(params.rotation || 0);
		
		if (params.image) {
			this._image = params.image;
			if (!params.dimensions) {
					this.setDimensions({
					x: this._image.x, 
					y: this._image.y, 
					width: this._image.width, 
					height: this._image.height
				});
			}
			this._imageOrigin = ImageOrigin.Image;
			return;
		}
		if (params.sprite) {
			var sprite = params.sprite;
			this._img = sprite._img;
			this._spritesheetPtr = sprite._spritesheetPtr;
			if (!params.dimensions) {
				this.setDimensions(sprite.getDimensions());
			}
			if (!params.clipping) {
				this.setClipping(sprite.getClipping());
			}
			return;
		}
		if (params.spritesheet) {
			var ss = params.spritesheet;
			if (!ss.sheet) {
				throw new CALException("No sheet specified for spritesheet option");
			}
			if (!ss.x || !ss.y) {
				throw new CALException("Bad coordinate for image on spritesheet");
			}
			
			
			
			
			// spritesheet code here
			
			
			
			
			return;
		}
		throw new CALException("No image source specified");
	}
	
	var p = Sprite.prototype;
	var s = Sprite;
	
	
	
	
	p.getDimensions = function() {
		return this._dimensions;
	}
	
	p.setX = function(x) {
		this.getDimensions().x = x;
	}
	
	p.setY = function(y) {
		this.getDimensions().y = y;
	}
	
	p.setWidth = function(width) {
		this.getDimensions().width = width;
	}
	
	p.setHeight = function(height) {
		this.getDimensions().height = height;
	}
	
	p.setDimensions = function(d) {
		this._dimensions = {
			x: d.x || 0, 
			y: d.y || 0, 
			width: d.width || 0, 
			height: d.height || 0
		};
	}
	
	p.getClipping = function() {
		return this._clipping;
	}
	
	p.setClippingX = function(x) {
		this.getClipping().x = x;
	}
	
	p.setClippingY = function(y) {
		this.getClipping().y = y;
	}
	
	p.setClipping = function(d) {
		this._clipping = {
			x: d.x || 0, 
			y: d.y || 0, 
		};
	}
	
	p.setRotation = function(radians) {
		this._rotation = radians;
	}
	
	p.getRotation = function() {
		return this._rotation;
	}
	
	p.draw = function(context) {
		context.save();
		if (this._imageOrigin == ImageOrigin.Image) {
			var c = this.getClipping();
			var d = this.getDimensions();
			var r = this.getRotation();
			
			var position;
			if (r != 0) {
				context.translate(d.x + d.width / 2, d.y + d.height / 2);
				context.rotate(r);
				position = {
					x: -d.width / 2,
					y: -d.height / 2
				}
			} else {
				position = {
					x: d.x,
					y: d.y
				}
			}
						
			context.drawImage(this._image, c.x, c.y, d.width, d.height, position.x, position.y, d.width, d.height);
		}
		context.restore();
	}
	
	p.clone = function() {
		return new Sprite({sprite: this});
	}
	
	this.CAL.Graphics.Sprite = Sprite;
	
})();