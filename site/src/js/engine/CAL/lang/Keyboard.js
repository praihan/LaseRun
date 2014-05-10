this.CAL = this.CAL || {};

this.CAL.lang = this.CAL.lang || {};

(function(undefined) {
	"use strict";
	
	/**
	 * @dict
	 * @final
	 */
	var keyCodeToChar = {8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",19:"pause/break",20:"caps lock",27:"esc",32:"space",33:"page up",34:"page down",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",91:"command",93:"right click",96:"numpad 0",97:"numpad 1",98:"numpad 2",99:"numpad 3",100:"numpad 4",101:"numpad 5",102:"numpad 6",103:"numpad 7",104:"numpad 8",105:"numpad 9",106:"numpad *",107:"numpad +",109:"numpad -",110:"numpad .",111:"numpad /",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"num lock",145:"scroll lock",182:"computer",183:"calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
	
	/**
	 * @dict
	 * @final
	 */
	var keyCharToCode = {"backspace":8,"tab":9,"enter":13,"shift":16,"ctrl":17,"alt":18,"pause/break":19,"caps lock":20,"esc":27,"space":32,"page up":33,"page down":34,"end":35,"home":36,"left":37,"up":38,"right":39,"down":40,"insert":45,"delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"a":65,"b":66,"c":67,"d":68,"e":69,"f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,"n":78,"o":79,"p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,"z":90,"command":91,"right click":93,"numpad 0":96,"numpad 1":97,"numpad 2":98,"numpad 3":99,"numpad 4":100,"numpad 5":101,"numpad 6":102,"numpad 7":103,"numpad 8":104,"numpad 9":105,"numpad *":106,"numpad +":107,"numpad -":109,"numpad .":110,"numpad /":111,"f1":112,"f2":113,"f3":114,"f4":115,"f5":116,"f6":117,"f7":118,"f8":119,"f9":120,"f10":121,"f11":122,"f12":123,"num lock":144,"scroll lock":145,"computer":182,"calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};
	
	var Keyboard = function(element) {
		
		var down = this._down = {};
		
		this._listeners = {};
		this._globalListeners = [];
		
		this._pressListeners = {};
		this._globalPressListeners = [];
		
		var globalCallback = function(keyboard, evt) {
			for (var i = 0; i < keyboard._globalListeners.length; ++i) {
				var c = keyboard._globalListeners[i];
				c.callback.call(c.scope, evt);
			}
		}
		
		var pressCallback = function(keyboard, evt) {
			var arr = keyboard._pressListeners[evt.which];
			if (arr) {
				for (var i = 0; i < arr.length; ++i) {
					var c = arr[i];
					c.callback.call(c.scope, evt);
				}
			}
		}
		
		var globalPressCallback = function(keyboard, evt) {
			for (var i = 0; i < keyboard._globalPressListeners.length; ++i) {
				var c = keyboard._globalPressListeners[i];
				c.callback.call(c.scope, evt);
			}
		}
		
		var _this = this;
		
		var keydownListener = function(evt) {
			down[evt.which] = true;
			globalCallback(_this, evt);
		}
		
		var keyupListener = function(evt) {
			if (typeof down[evt.which] === "undefined") {
				return;
			}
			delete down[evt.which];
			globalCallback(_this, evt);
			pressCallback(_this, evt);
			globalPressCallback(_this, evt);
		}
		
		element.addEventListener("keydown", keydownListener);
		element.addEventListener("keyup", keyupListener);
	}
	
	var p = Keyboard.prototype = new CAL.lang.IUpdateableObject();
	
	var s = Keyboard;
	
	p.pause = function() {
		this._paused = true;
	}
	
	p.resume = function() {
		delete this._paused;
	}
	
	p.addEventListener = function(keyCode, callback, scope) {
		var toPush = {callback: callback, scope: scope || callback};
		if (keyCode === -1) {
			this._globalListeners.push(toPush);
			return;
		}
		var listeners = this._listeners;
		if (!listeners[keyCode]) {
			listeners[keyCode] = [toPush];
		} else {
			listeners[keyCode].push(toPush);
		}
	}
	
	p.addPressListener = function(keyCode, callback, scope) {
		var toPush = {callback: callback, scope: scope || callback};
		if (keyCode === -1) {
			this._globalPressListeners.push(toPush);
			return;
		}
		var pressListeners = this._pressListeners;
		if (!pressListeners[keyCode]) {
			pressListeners[keyCode] = [toPush];
		} else {
			pressListeners[keyCode].push(toPush);
		}
	}
	
	p.removeEventListener = function(keyCode, callbackObj) {
		if (keyCode === -1) {
			var l = this._globalListeners;
			for (var i = 0; i < l.length; ++i) {
				if (callbackObj === l[i]) {
					delete this._globalListeners[i];
				}
			}
		}
		var listeners = this._listeners;
		var arr = listeners[keyCode];
		if (!arr) {
			return;
		}
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i] === callbackObj) {
				arr.splice(i, 1);
				if (arr.length < 1) {
					delete this._listeners[keyCode];
				}
				return;
			}
		}
	}
	
	p.removePressListener = function(keyCode, callbackObj) {
		if (keyCode === -1) {
			var l = this._globalPressListeners;
			for (var i = 0; i < l.length; ++i) {
				if (callbackObj === l[i]) {
					delete this._globalPressListeners[i];
				}
			}
		}
		var listeners = this._pressListeners;
		var arr = listeners[keyCode];
		if (!arr) {
			return;
		}
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i] === callbackObj) {
				arr.splice(i, 1);
				if (arr.length < 1) {
					delete this._pressListeners[keyCode];
				}
				return;
			}
		}
	}
	
	p.update = function(params) {
		if (this._paused) {
			return;
		}
		var listeners = this._listeners;
		var down = this._down;
		for (var keyCode in down) {
			var arr = listeners[keyCode];
			if (!arr) {
				continue;
			}
			for (var i = 0; i < arr.length; ++i) {
				var c = arr[i];
				c.callback.call(c.scope, keyCode);
			}
		}
	}
	
	p.isDown = function(keyCodeOrChar) {
		if (typeof keyCodeOrChar === "number") {
			return this._down[keyCodeOrChar] ? true : false;
		} else {
			keyCodeOrChar = keyCodeOrChar.toLowerCase();
			var code = keyCharToCode[keyCodeOrChar.trim()];
			return typeof code === "undefined" ? false : (this._down[code] ? true : false);
		}
	}
	
	
	
	
	p.getKeyName = s.getKeyName = function(keyCode) {
		return keyCodeToChar[keyCode];
	}
			
	p.getKeyCode = s.getKeyCode = function(key) {
		return keyCharToCode[key.trim().toLowerCase()];
	}
	
	
	
	
	CAL.lang.Keyboard = Keyboard;
	
})();