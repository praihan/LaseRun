this.CAL = this.CAL || {};

this.CAL.gamex = this.CAL.gamex || {};

(function(undefined) {
	
	var preloadManifest = [
		{id: "temp", src:"assets/img/temp.png"},
	];
	
	var CANVAS_NAME = "main-canvas";
	
	var Bootstrap = function() {
	}
	
	var s = Bootstrap;
	
    s.run = function() {
		var canvas = document.getElementById(CANVAS_NAME);
		
		var resize = function() {
			canvas.width = jQuery(document).width();
			canvas.height = jQuery(document).height();
		}
		window.onresize = resize;
		resize();
		
		var pointerState = registerPointer(canvas);
		
		var keyboardState = registerKeyboard(canvas);
		
		var resources = new createjs.LoadQueue(false);
		
		var game = new CAL.gamex.Game();
		
		resources.on("complete", function() {
			
			createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
			createjs.Ticker.setFPS(CAL.gamex.TARGET_FPS);
			
			var first = true;
			createjs.Ticker.on("tick", function(evt) {			
				var params = {
					tickEvent: evt, 
					resources: resources, 
					canvas: canvas, 
					first: first,
					pointer: pointerState,
					keyboard: keyboardState
				};
				
				game.update(params);
				game.draw(params);
				first = false;
				
			}, this);
			
		}, this);
		
		resources.loadManifest(preloadManifest);
    }
	
	
	
	
	var registerPointer = function(canvas) {
		var clickListeners = new Array();
		var pointerState = {
			LEFT: 1,
			MIDDLE: 2,
			RIGHT: 3,
			
			down: {},
			location: {x: 0, y: 0},
			
			addEventListener: function(type, callback, callbackScope) {
				switch (type) {
					case "click":
					case "tap":
						clickListeners[clickListeners.length] = {
							callback: callback,
							scope: callbackScope || callback || this,
						}
						break;
					default:
						canvas.addEventListener(type, function(evt) {
							callback.call(callbackScope || callback || this, evt);
						});
				}
			}
		};
		
		var mouseupListener = function(evt) {
			if (pointerState.down[evt.which]) {
				for (var i = 0; i < clickListeners.length; ++i) {
					var c = clickListeners[i];
					c.callback.call(c.scope, evt);
				}
			}
			delete pointerState.down[evt.which];
		}
		canvas.addEventListener("mouseup", mouseupListener);
		
		var mousemoveListener = function(evt) {
			pointerState.location = {x: evt.clientX, y: evt.clientY};
		}
		canvas.addEventListener("mousemove", mousemoveListener);
		
		var mousedownListener = function(evt) {
			pointerState.down[evt.which] = true;
			mousemoveListener(evt);
		}
		canvas.addEventListener("mousedown", mousedownListener);
		
		if ("ontouchstart" in document.documentElement) {
			var touchstartListener = function(evt) {
				var first = evt.changedTouches[0];
				pointerState.down[pointerState.LEFT] = true;
				mousemoveListener(first);
			}
			canvas.addEventListener("touchstart", touchstartListener);
			
			var touchmoveListener = function(evt) {
				mousemoveListener(evt.changedTouches[0]);
			}
			canvas.addEventListener("touchmove", touchmoveListener);
			
			var touchendListener = function(evt) {
				var first = evt.changedTouches[0];
				if (pointerState.down[pointerState.LEFT]) {
					for (var i = 0; i < clickListeners.length; ++i) {
						var c = clickListeners[i];
						c.callback.call(c.scope, evt);
					}
				}
				delete pointerState.down[pointerState.LEFT];
			}
			canvas.addEventListener("touchend", touchendListener);
		}
		return pointerState;
	}
	
	var registerKeyboard = function(canvas) {
		var keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Windows",93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"My Computer",183:"My Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
		
		var keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Windows":91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};
		
		var pressListeners = new Array();
		var keyboardState = {
			getKeyName: function(keyCode) {
				return keyCodeToChar[keyCode];
			},
			getKeyCode: function(key) {
				return keyCharToCode[key.trim()];
			},
			down: {},
			addEventListener: function(type, callback, callbackScope) {
				switch (type) {
					case "keypressed":
						pressListeners[pressListeners.length] = {
							callback: callback,
							scope: callbackScope || callback || this,
						}
						break;
					default:
						canvas.addEventListener(type, function(evt) {
							callback.call(callbackScope || callback || this, evt);
						});
				}
			}
		}
		
		var keydownListener = function(evt) {
			keyboardState.down[evt.keyCode] = true;
			// console.log(evt.keyCode);
		}
		canvas.addEventListener("keydown", keydownListener);
		
		var keyupListener = function(evt) {
			if (keyboardState.down[evt.keyCode]) {
				for (var i = 0; i < pressListeners.length; ++i) {
					var c = pressListeners[i];
					c.callback.call(c.scope, evt);
				}
			}
			delete keyboardState.down[evt.keyCode];
		}
		canvas.addEventListener("keyup", keyupListener);
		return keyboardState;
	}
	
	
	
	
	CAL.gamex.Bootstrap = Bootstrap;
	
})();


