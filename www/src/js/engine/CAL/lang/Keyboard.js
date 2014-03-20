this.CAL = this.CAL || {};

this.CAL.lang = this.CAL.lang || {};

(function(undefined) {
	"use strict";
	
	var keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Command",93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"Computer",183:"Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
		
	var keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Command":91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"Computer":182,"Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};
	
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
		
		var globalPressCallback = function(keyboard, evt) {
			for (var i = 0; i < keyboard._pressListeners.length; ++i) {
				var c = keyboard._pressListeners[i];
				c.callback.call(c.scope, evt);
			}
		}
		
		var keydownListener = function(evt) {
			down[evt.which] = true;
			globalCallback(this, evt);
		}
		
		var keyupListener = function(evt) {
			delete down[evt.which];
			globalCallback(this, evt);
			globalPressCallback(this, evt);
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
	
	p.clearEventListeners = function(keyCode) {
		if (typeof keyCode === "undefined") {
			delete this._listeners;
			this._globalListeners.length = 0;
			this._pressListeners.length = 0;
			this._listeners = {};
			return;
		} else if (keyCode === -1) {
			this._globalListeners.length = 0;
			return;
		} else if (keyCode === -2) {
			this._pressListeners.length = 0;
			return;
		}
		listeners[keyCode].length = 0;
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
				delete arr[i];
				if (arr.length = 0) {
					delete this._listeners[keyCode];
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
			var code = keyCharToCode[keyCodeOrChar.trim()];
			return typeof code === "undefined" ? false : (this._down[code] ? true : false);
		}
	}
	
	
	
	
	p.getKeyName = s.getKeyName = function(keyCode) {
		return keyCodeToChar[keyCode];
	}
			
	p.getKeyCode = s.getKeyCode = function(key) {
		return keyCharToCode[key.trim()];
	}
	
	
	
	
	CAL.lang.Keyboard = Keyboard;
	
})();