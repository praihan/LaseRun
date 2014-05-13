/**
* @license TweenJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*
* SoundJS FlashPlugin also includes swfobject (http://code.google.com/p/swfobject/)
* 
* NOTE: This is an altered source version
*/

this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.CAL.ext.createjs || {};
(function() {
  var d = CAL.ext.createjs, a = function(b, c, a) {
    this.initialize(b, c, a);
  }, b = a.prototype;
  b.type = null;
  b.target = null;
  b.currentTarget = null;
  b.eventPhase = 0;
  b.bubbles = !1;
  b.cancelable = !1;
  b.timeStamp = 0;
  b.defaultPrevented = !1;
  b.propagationStopped = !1;
  b.immediatePropagationStopped = !1;
  b.removed = !1;
  b.initialize = function(b, a, e) {
    this.type = b;
    this.bubbles = a;
    this.cancelable = e;
    this.timeStamp = (new Date).getTime();
  };
  b.preventDefault = function() {
    this.defaultPrevented = !0;
  };
  b.stopPropagation = function() {
    this.propagationStopped = !0;
  };
  b.stopImmediatePropagation = function() {
    this.immediatePropagationStopped = this.propagationStopped = !0;
  };
  b.remove = function() {
    this.removed = !0;
  };
  b.clone = function() {
    return new a(this.type, this.bubbles, this.cancelable);
  };
  b.toString = function() {
    return "[Event (type=" + this.type + ")]";
  };
  d.Event = a;
})();
this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.createjs = this.createjs || {};
(function() {
  var d = function() {
  }, a = d.prototype;
  d.initialize = function(b) {
    b.addEventListener = a.addEventListener;
    b.on = a.on;
    b.removeEventListener = b.off = a.removeEventListener;
    b.removeAllEventListeners = a.removeAllEventListeners;
    b.hasEventListener = a.hasEventListener;
    b.dispatchEvent = a.dispatchEvent;
    b._dispatchEvent = a._dispatchEvent;
    b.willTrigger = a.willTrigger;
  };
  a._listeners = null;
  a._captureListeners = null;
  a.initialize = function() {
  };
  a.addEventListener = function(b, a, c) {
    var e;
    e = c ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
    var d = e[b];
    return d && this.removeEventListener(b, a, c), d = e[b], d ? d.push(a) : e[b] = [a], a;
  };
  a.on = function(b, a, c, e, d, g) {
    return a.handleEvent && (c = c || a, a = a.handleEvent), c = c || this, this.addEventListener(b, function(b) {
      a.call(c, b, d);
      e && b.remove();
    }, g);
  };
  a.removeEventListener = function(b, a, c) {
    if (c = c ? this._captureListeners : this._listeners) {
      var e = c[b];
      if (e) {
        for (var d = 0, g = e.length;g > d;d++) {
          if (e[d] == a) {
            1 == g ? delete c[b] : e.splice(d, 1);
            break;
          }
        }
      }
    }
  };
  a.off = a.removeEventListener;
  a.removeAllEventListeners = function(b) {
    b ? (this._listeners && delete this._listeners[b], this._captureListeners && delete this._captureListeners[b]) : this._listeners = this._captureListeners = null;
  };
  a.dispatchEvent = function(b, a) {
    if ("string" == typeof b) {
      var c = this._listeners;
      if (!c || !c[b]) {
        return!1;
      }
      b = new createjs.Event(b);
    }
    if (b.target = a || this, b.bubbles && this.parent) {
      for (var e = this, c = [e];e.parent;) {
        c.push(e = e.parent);
      }
      for (var d = c.length, e = d - 1;0 <= e && !b.propagationStopped;e--) {
        c[e]._dispatchEvent(b, 1 + (0 == e));
      }
      for (e = 1;d > e && !b.propagationStopped;e++) {
        c[e]._dispatchEvent(b, 3);
      }
    } else {
      this._dispatchEvent(b, 2);
    }
    return b.defaultPrevented;
  };
  a.hasEventListener = function(b) {
    var a = this._listeners, c = this._captureListeners;
    return!!(a && a[b] || c && c[b]);
  };
  a.willTrigger = function(b) {
    for (var a = this;a;) {
      if (a.hasEventListener(b)) {
        return!0;
      }
      a = a.parent;
    }
    return!1;
  };
  a.toString = function() {
    return "[EventDispatcher]";
  };
  a._dispatchEvent = function(b, a) {
    var c, e = 1 == a ? this._captureListeners : this._listeners;
    if (b && e && (e = e[b.type]) && (c = e.length)) {
      b.currentTarget = this;
      b.eventPhase = a;
      b.removed = !1;
      for (var e = e.slice(), d = 0;c > d && !b.immediatePropagationStopped;d++) {
        var g = e[d];
        g.handleEvent ? g.handleEvent(b) : g(b);
        b.removed && (this.off(b.type, g, 1 == a), b.removed = !1);
      }
    }
  };
  createjs.EventDispatcher = d;
})();
this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.createjs = this.createjs || {};
(function() {
  var d = function(b, a, c) {
    this.initialize(b, a, c);
  }, a = d.prototype = new createjs.EventDispatcher;
  d.NONE = 0;
  d.LOOP = 1;
  d.REVERSE = 2;
  d.IGNORE = {};
  d._tweens = [];
  d._plugins = {};
  d.get = function(b, a, c, e) {
    return e && d.removeTweens(b), new d(b, a, c);
  };
  d.tick = function(b, a) {
    for (var c = d._tweens.slice(), e = c.length - 1;0 <= e;e--) {
      var f = c[e];
      a && !f.ignoreGlobalPause || f._paused || f.tick(f._useTicks ? 1 : b);
    }
  };
  d.handleEvent = function(b) {
    "tick" == b.type && this.tick(b.delta, b.paused);
  };
  d.removeTweens = function(b) {
    if (b.tweenjs_count) {
      for (var a = d._tweens, c = a.length - 1;0 <= c;c--) {
        a[c]._target == b && (a[c]._paused = !0, a.splice(c, 1));
      }
      b.tweenjs_count = 0;
    }
  };
  d.removeAllTweens = function() {
    for (var b = d._tweens, a = 0, c = b.length;c > a;a++) {
      var e = b[a];
      e.paused = !0;
      e.target.tweenjs_count = 0;
    }
    b.length = 0;
  };
  d.hasActiveTweens = function(b) {
    return b ? b.tweenjs_count : d._tweens && !!d._tweens.length;
  };
  d.installPlugin = function(b, a) {
    var c = b.priority;
    null == c && (b.priority = c = 0);
    for (var e = 0, f = a.length, g = d._plugins;f > e;e++) {
      var h = a[e];
      if (g[h]) {
        for (var l = g[h], m = 0, n = l.length;n > m && !(c < l[m].priority);m++) {
        }
        g[h].splice(m, 0, b);
      } else {
        g[h] = [b];
      }
    }
  };
  d._register = function(b, a) {
    var c = b._target, e = d._tweens;
    if (a) {
      c && (c.tweenjs_count = c.tweenjs_count ? c.tweenjs_count + 1 : 1), e.push(b), !d._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", d), d._inited = !0);
    } else {
      for (c && c.tweenjs_count--, c = e.length;c--;) {
        if (e[c] == b) {
          return e.splice(c, 1), void 0;
        }
      }
    }
  };
  a.ignoreGlobalPause = !1;
  a.loop = !1;
  a.duration = 0;
  a.pluginData = null;
  a.target = null;
  a.position = null;
  a.passive = !1;
  a._paused = !1;
  a._curQueueProps = null;
  a._initQueueProps = null;
  a._steps = null;
  a._actions = null;
  a._prevPosition = 0;
  a._stepPosition = 0;
  a._prevPos = -1;
  a._target = null;
  a._useTicks = !1;
  a._inited = !1;
  a.initialize = function(b, a, c) {
    this.target = this._target = b;
    a && (this._useTicks = a.useTicks, this.ignoreGlobalPause = a.ignoreGlobalPause, this.loop = a.loop, a.onChange && this.addEventListener("change", a.onChange), a.override && d.removeTweens(b));
    this.pluginData = c || {};
    this._curQueueProps = {};
    this._initQueueProps = {};
    this._steps = [];
    this._actions = [];
    a && a.paused ? this._paused = !0 : d._register(this, !0);
    a && null != a.position && this.setPosition(a.position, d.NONE);
  };
  a.wait = function(b, a) {
    if (null == b || 0 >= b) {
      return this;
    }
    var c = this._cloneProps(this._curQueueProps);
    return this._addStep({d:b, p0:c, e:this._linearEase, p1:c, v:a});
  };
  a.to = function(b, a, c) {
    return(isNaN(a) || 0 > a) && (a = 0), this._addStep({d:a || 0, p0:this._cloneProps(this._curQueueProps), e:c, p1:this._cloneProps(this._appendQueueProps(b))});
  };
  a.call = function(b, a, c) {
    return this._addAction({f:b, p:a ? a : [this], o:c ? c : this._target});
  };
  a.set = function(b, a) {
    return this._addAction({f:this._set, o:this, p:[b, a ? a : this._target]});
  };
  a.play = function(b) {
    return b || (b = this), this.call(b.setPaused, [!1], b);
  };
  a.pause = function(b) {
    return b || (b = this), this.call(b.setPaused, [!0], b);
  };
  a.setPosition = function(b, a) {
    0 > b && (b = 0);
    null == a && (a = 1);
    var c = b, e = !1;
    if (c >= this.duration && (this.loop ? c %= this.duration : (c = this.duration, e = !0)), c == this._prevPos) {
      return e;
    }
    var d = this._prevPos;
    if (this.position = this._prevPos = c, this._prevPosition = b, this._target) {
      if (e) {
        this._updateTargetProps(null, 1);
      } else {
        if (0 < this._steps.length) {
          for (var g = 0, h = this._steps.length;h > g && !(this._steps[g].t > c);g++) {
          }
          g = this._steps[g - 1];
          this._updateTargetProps(g, (this._stepPosition = c - g.t) / g.d);
        }
      }
    }
    return 0 != a && 0 < this._actions.length && (this._useTicks ? this._runActions(c, c) : 1 == a && d > c ? (d != this.duration && this._runActions(d, this.duration), this._runActions(0, c, !0)) : this._runActions(d, c)), e && this.setPaused(!0), this.dispatchEvent("change"), e;
  };
  a.tick = function(b) {
    this._paused || this.setPosition(this._prevPosition + b);
  };
  a.setPaused = function(b) {
    return this._paused = !!b, d._register(this, !b), this;
  };
  a.w = a.wait;
  a.t = a.to;
  a.c = a.call;
  a.s = a.set;
  a.toString = function() {
    return "[Tween]";
  };
  a.clone = function() {
    throw "Tween can not be cloned.";
  };
  a._updateTargetProps = function(b, a) {
    var c, e, f, g;
    if (b || 1 != a) {
      if (this.passive = !!b.v, this.passive) {
        return;
      }
      b.e && (a = b.e(a, 0, 1, 1));
      c = b.p0;
      e = b.p1;
    } else {
      this.passive = !1, c = e = this._curQueueProps;
    }
    for (var h in this._initQueueProps) {
      null == (f = c[h]) && (c[h] = f = this._initQueueProps[h]);
      null == (g = e[h]) && (e[h] = g = f);
      f = f == g || 0 == a || 1 == a || "number" != typeof f ? 1 == a ? g : f : f + (g - f) * a;
      var l = !1;
      if (g = d._plugins[h]) {
        for (var m = 0, n = g.length;n > m;m++) {
          var q = g[m].tween(this, h, f, c, e, a, !!b && c == e, !b);
          q == d.IGNORE ? l = !0 : f = q;
        }
      }
      l || (this._target[h] = f);
    }
  };
  a._runActions = function(b, a, c) {
    var d = b, f = a, g = -1, h = this._actions.length, l = 1;
    for (b > a && (d = a, f = b, g = h, h = l = -1);(g += l) != h;) {
      a = this._actions[g];
      var m = a.t;
      (m == f || m > d && f > m || c && m == b) && a.f.apply(a.o, a.p);
    }
  };
  a._appendQueueProps = function(a) {
    var k, c, e, f, g, h;
    for (h in a) {
      if (void 0 === this._initQueueProps[h]) {
        if (c = this._target[h], k = d._plugins[h]) {
          for (e = 0, f = k.length;f > e;e++) {
            c = k[e].init(this, h, c);
          }
        }
        this._initQueueProps[h] = this._curQueueProps[h] = void 0 === c ? null : c;
      }
    }
    for (h in a) {
      if (c = this._curQueueProps[h], k = d._plugins[h]) {
        for (g = g || {}, e = 0, f = k.length;f > e;e++) {
          k[e].step && k[e].step(this, h, c, a[h], g);
        }
      }
      this._curQueueProps[h] = a[h];
    }
    return g && this._appendQueueProps(g), this._curQueueProps;
  };
  a._cloneProps = function(a) {
    var d = {}, c;
    for (c in a) {
      d[c] = a[c];
    }
    return d;
  };
  a._addStep = function(a) {
    return 0 < a.d && (this._steps.push(a), a.t = this.duration, this.duration += a.d), this;
  };
  a._addAction = function(a) {
    return a.t = this.duration, this._actions.push(a), this;
  };
  a._set = function(a, d) {
    for (var c in a) {
      d[c] = a[c];
    }
  };
  createjs.Tween = d;
})();
this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.createjs = this.createjs || {};
(function() {
  var d = function(a, d, c) {
    this.initialize(a, d, c);
  }, a = d.prototype = new createjs.EventDispatcher;
  a.ignoreGlobalPause = !1;
  a.duration = 0;
  a.loop = !1;
  a.position = null;
  a._paused = !1;
  a._tweens = null;
  a._labels = null;
  a._labelList = null;
  a._prevPosition = 0;
  a._prevPos = -1;
  a._useTicks = !1;
  a.initialize = function(a, d, c) {
    this._tweens = [];
    c && (this._useTicks = c.useTicks, this.loop = c.loop, this.ignoreGlobalPause = c.ignoreGlobalPause, c.onChange && this.addEventListener("change", c.onChange));
    a && this.addTween.apply(this, a);
    this.setLabels(d);
    c && c.paused ? this._paused = !0 : createjs.Tween._register(this, !0);
    c && null != c.position && this.setPosition(c.position, createjs.Tween.NONE);
  };
  a.addTween = function(a) {
    var d = arguments.length;
    if (1 < d) {
      for (var c = 0;d > c;c++) {
        this.addTween(arguments[c]);
      }
      return arguments[0];
    }
    return 0 == d ? null : (this.removeTween(a), this._tweens.push(a), a.setPaused(!0), a._paused = !1, a._useTicks = this._useTicks, a.duration > this.duration && (this.duration = a.duration), 0 <= this._prevPos && a.setPosition(this._prevPos, createjs.Tween.NONE), a);
  };
  a.removeTween = function(a) {
    var d = arguments.length;
    if (1 < d) {
      for (var c = !0, e = 0;d > e;e++) {
        c = c && this.removeTween(arguments[e]);
      }
      return c;
    }
    if (0 == d) {
      return!1;
    }
    d = this._tweens;
    for (e = d.length;e--;) {
      if (d[e] == a) {
        return d.splice(e, 1), a.duration >= this.duration && this.updateDuration(), !0;
      }
    }
    return!1;
  };
  a.addLabel = function(a, d) {
    this._labels[a] = d;
    var c = this._labelList;
    if (c) {
      for (var e = 0, f = c.length;f > e && !(d < c[e].position);e++) {
      }
      c.splice(e, 0, {label:a, position:d});
    }
  };
  a.setLabels = function(a) {
    this._labels = a ? a : {};
  };
  a.getLabels = function() {
    var a = this._labelList;
    if (!a) {
      var a = this._labelList = [], d = this._labels, c;
      for (c in d) {
        a.push({label:c, position:d[c]});
      }
      a.sort(function(a, b) {
        return a.position - b.position;
      });
    }
    return a;
  };
  a.getCurrentLabel = function() {
    var a = this.getLabels(), d = this.position, c = a.length;
    if (c) {
      for (var e = 0;c > e && !(d < a[e].position);e++) {
      }
      return 0 == e ? null : a[e - 1].label;
    }
    return null;
  };
  a.gotoAndPlay = function(a) {
    this.setPaused(!1);
    this._goto(a);
  };
  a.gotoAndStop = function(a) {
    this.setPaused(!0);
    this._goto(a);
  };
  a.setPosition = function(a, d) {
    0 > a && (a = 0);
    var c = this.loop ? a % this.duration : a, e = !this.loop && a >= this.duration;
    if (c == this._prevPos) {
      return e;
    }
    this._prevPosition = a;
    this.position = this._prevPos = c;
    for (var f = 0, g = this._tweens.length;g > f;f++) {
      if (this._tweens[f].setPosition(c, d), c != this._prevPos) {
        return!1;
      }
    }
    return e && this.setPaused(!0), this.dispatchEvent("change"), e;
  };
  a.setPaused = function(a) {
    this._paused = !!a;
    createjs.Tween._register(this, !a);
  };
  a.updateDuration = function() {
    for (var a = this.duration = 0, d = this._tweens.length;d > a;a++) {
      var c = this._tweens[a];
      c.duration > this.duration && (this.duration = c.duration);
    }
  };
  a.tick = function(a) {
    this.setPosition(this._prevPosition + a);
  };
  a.resolve = function(a) {
    var d = parseFloat(a);
    return isNaN(d) && (d = this._labels[a]), d;
  };
  a.toString = function() {
    return "[Timeline]";
  };
  a.clone = function() {
    throw "Timeline can not be cloned.";
  };
  a._goto = function(a) {
    a = this.resolve(a);
    null != a && this.setPosition(a);
  };
  createjs.Timeline = d;
})();
this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.createjs = this.createjs || {};
(function() {
  var d = function() {
    throw "Ease cannot be instantiated.";
  };
  d.linear = function(a) {
    return a;
  };
  d.none = d.linear;
  d.get = function(a) {
    return-1 > a && (a = -1), 1 < a && (a = 1), function(b) {
      return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a));
    };
  };
  d.getPowIn = function(a) {
    return function(b) {
      return Math.pow(b, a);
    };
  };
  d.getPowOut = function(a) {
    return function(b) {
      return 1 - Math.pow(1 - b, a);
    };
  };
  d.getPowInOut = function(a) {
    return function(b) {
      return 1 > (b *= 2) ? .5 * Math.pow(b, a) : 1 - .5 * Math.abs(Math.pow(2 - b, a));
    };
  };
  d.quadIn = d.getPowIn(2);
  d.quadOut = d.getPowOut(2);
  d.quadInOut = d.getPowInOut(2);
  d.cubicIn = d.getPowIn(3);
  d.cubicOut = d.getPowOut(3);
  d.cubicInOut = d.getPowInOut(3);
  d.quartIn = d.getPowIn(4);
  d.quartOut = d.getPowOut(4);
  d.quartInOut = d.getPowInOut(4);
  d.quintIn = d.getPowIn(5);
  d.quintOut = d.getPowOut(5);
  d.quintInOut = d.getPowInOut(5);
  d.sineIn = function(a) {
    return 1 - Math.cos(a * Math.PI / 2);
  };
  d.sineOut = function(a) {
    return Math.sin(a * Math.PI / 2);
  };
  d.sineInOut = function(a) {
    return-.5 * (Math.cos(Math.PI * a) - 1);
  };
  d.getBackIn = function(a) {
    return function(b) {
      return b * b * ((a + 1) * b - a);
    };
  };
  d.backIn = d.getBackIn(1.7);
  d.getBackOut = function(a) {
    return function(b) {
      return--b * b * ((a + 1) * b + a) + 1;
    };
  };
  d.backOut = d.getBackOut(1.7);
  d.getBackInOut = function(a) {
    return a *= 1.525, function(b) {
      return 1 > (b *= 2) ? .5 * b * b * ((a + 1) * b - a) : .5 * ((b -= 2) * b * ((a + 1) * b + a) + 2);
    };
  };
  d.backInOut = d.getBackInOut(1.7);
  d.circIn = function(a) {
    return-(Math.sqrt(1 - a * a) - 1);
  };
  d.circOut = function(a) {
    return Math.sqrt(1 - --a * a);
  };
  d.circInOut = function(a) {
    return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
  };
  d.bounceIn = function(a) {
    return 1 - d.bounceOut(1 - a);
  };
  d.bounceOut = function(a) {
    return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375;
  };
  d.bounceInOut = function(a) {
    return.5 > a ? .5 * d.bounceIn(2 * a) : .5 * d.bounceOut(2 * a - 1) + .5;
  };
  d.getElasticIn = function(a, b) {
    var d = 2 * Math.PI;
    return function(c) {
      if (0 == c || 1 == c) {
        return c;
      }
      var e = b / d * Math.asin(1 / a);
      return-(a * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - e) * d / b));
    };
  };
  d.elasticIn = d.getElasticIn(1, .3);
  d.getElasticOut = function(a, b) {
    var d = 2 * Math.PI;
    return function(c) {
      if (0 == c || 1 == c) {
        return c;
      }
      var e = b / d * Math.asin(1 / a);
      return a * Math.pow(2, -10 * c) * Math.sin((c - e) * d / b) + 1;
    };
  };
  d.elasticOut = d.getElasticOut(1, .3);
  d.getElasticInOut = function(a, b) {
    var d = 2 * Math.PI;
    return function(c) {
      var e = b / d * Math.asin(1 / a);
      return 1 > (c *= 2) ? -.5 * a * Math.pow(2, 10 * (c -= 1)) * Math.sin((c - e) * d / b) : .5 * a * Math.pow(2, -10 * (c -= 1)) * Math.sin((c - e) * d / b) + 1;
    };
  };
  d.elasticInOut = d.getElasticInOut(1, .3 * 1.5);
  createjs.Ease = d;
})();
this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.createjs = this.createjs || {};
(function() {
  var d = function() {
    throw "MotionGuidePlugin cannot be instantiated.";
  };
  d.priority = 0;
  d.install = function() {
    return createjs.Tween.installPlugin(d, ["guide", "x", "y", "rotation"]), createjs.Tween.IGNORE;
  };
  d.init = function(a, b, d) {
    var c = a.target;
    return c.hasOwnProperty("x") || (c.x = 0), c.hasOwnProperty("y") || (c.y = 0), c.hasOwnProperty("rotation") || (c.rotation = 0), "rotation" == b && (a.__needsRot = !0), "guide" == b ? null : d;
  };
  d.step = function(a, b, k, c, e) {
    if ("rotation" == b && (a.__rotGlobalS = k, a.__rotGlobalE = c, d.testRotData(a, e)), "guide" != b) {
      return c;
    }
    var f;
    c.hasOwnProperty("path") || (c.path = []);
    b = c.path;
    if (c.hasOwnProperty("end") || (c.end = 1), c.hasOwnProperty("start") || (c.start = k && k.hasOwnProperty("end") && k.path === b ? k.end : 0), c.hasOwnProperty("_segments") && c._length) {
      return c;
    }
    k = b.length;
    if (!(6 <= k && 0 == (k - 2) % 4)) {
      throw "invalid 'path' data, please see documentation for valid paths";
    }
    c._segments = [];
    c._length = 0;
    for (var g = 2;k > g;g += 4) {
      for (var h, l, m = b[g - 2], n = b[g - 1], q = b[g + 0], w = b[g + 1], x = b[g + 2], y = b[g + 3], u = m, v = n, r = 0, s = [], t = 1;10 >= t;t++) {
        l = t / 10;
        var p = 1 - l;
        h = p * p * m + 2 * p * l * q + l * l * x;
        l = p * p * n + 2 * p * l * w + l * l * y;
        r += s[s.push(Math.sqrt((f = h - u) * f + (f = l - v) * f)) - 1];
        u = h;
        v = l;
      }
      c._segments.push(r);
      c._segments.push(s);
      c._length += r;
    }
    f = c.orient;
    c.orient = !0;
    b = {};
    return d.calc(c, c.start, b), a.__rotPathS = Number(b.rotation.toFixed(5)), d.calc(c, c.end, b), a.__rotPathE = Number(b.rotation.toFixed(5)), c.orient = !1, d.calc(c, c.end, e), c.orient = f, c.orient ? (a.__guideData = c, d.testRotData(a, e), c) : c;
  };
  d.testRotData = function(a, b) {
    if (void 0 === a.__rotGlobalS || void 0 === a.__rotGlobalE) {
      if (a.__needsRot) {
        return;
      }
      a.__rotGlobalS = a.__rotGlobalE = void 0 !== a._curQueueProps.rotation ? a._curQueueProps.rotation : b.rotation = a.target.rotation || 0;
    }
    if (void 0 !== a.__guideData) {
      var d = a.__guideData, c = a.__rotGlobalE - a.__rotGlobalS, e = a.__rotPathE - a.__rotPathS, f = c - e;
      if ("auto" == d.orient) {
        180 < f ? f -= 360 : -180 > f && (f += 360);
      } else {
        if ("cw" == d.orient) {
          for (;0 > f;) {
            f += 360;
          }
          0 == f && 0 < c && 180 != c && (f += 360);
        } else {
          if ("ccw" == d.orient) {
            for (f = c - (180 < e ? 360 - e : e);0 < f;) {
              f -= 360;
            }
            0 == f && 0 > c && -180 != c && (f -= 360);
          }
        }
      }
      d.rotDelta = f;
      d.rotOffS = a.__rotGlobalS - a.__rotPathS;
      a.__rotGlobalS = a.__rotGlobalE = a.__guideData = a.__needsRot = void 0;
    }
  };
  d.tween = function(a, b, k, c, e, f, g) {
    e = e.guide;
    if (void 0 == e || e === c.guide) {
      return k;
    }
    if (e.lastRatio != f) {
      switch(d.calc(e, (e.end - e.start) * (g ? e.end : f) + e.start, a.target), e.orient) {
        case "cw":
        ;
        case "ccw":
        ;
        case "auto":
          a.target.rotation += e.rotOffS + e.rotDelta * f;
          break;
        default:
          a.target.rotation += e.rotOffS;
      }
      e.lastRatio = f;
    }
    return "rotation" != b || e.orient && "false" != e.orient ? a.target[b] : k;
  };
  d.calc = function(a, b, k) {
    void 0 == a._segments && d.validate(a);
    void 0 == k && (k = {x:0, y:0, rotation:0});
    var c = a._segments, e = a.path, f = a._length * b, g = c.length - 2;
    for (b = 0;f > c[b] && g > b;) {
      f -= c[b], b += 2;
    }
    for (var c = c[b + 1], h = 0, g = c.length - 1;f > c[h] && g > h;) {
      f -= c[h], h++;
    }
    f = h / ++g + f / (g * c[h]);
    b = 2 * b + 2;
    g = 1 - f;
    return k.x = g * g * e[b - 2] + 2 * g * f * e[b + 0] + f * f * e[b + 2], k.y = g * g * e[b - 1] + 2 * g * f * e[b + 1] + f * f * e[b + 3], a.orient && (k.rotation = 57.2957795 * Math.atan2((e[b + 1] - e[b - 1]) * g + (e[b + 3] - e[b + 1]) * f, (e[b + 0] - e[b - 2]) * g + (e[b + 2] - e[b + 0]) * f)), k;
  };
  createjs.MotionGuidePlugin = d;
})();
this.CAL = this.CAL || {};
this.CAL.ext = this.CAL.ext || {};
this.CAL.ext.createjs = this.createjs = this.createjs || {};
(function() {
  var d = createjs.TweenJS = createjs.TweenJS || {};
  d.version = "0.5.1";
  d.buildDate = "Thu, 12 Dec 2013 23:33:38 GMT";
})();