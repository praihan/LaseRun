this.LaseRun = this.LaseRun || {};

(function(undefined) {
    "use strict";

    LaseRun.extend = function extend(child, parent) {
        if (Object.prototype.toString.call(parent) === "[object Array]") {
            parent.forEach(function(pa) { extend(child, pa); });
        }
        var _extend = function(child, parent, excludeSuper) {
            for (var i in parent) {
                if (excludeSuper && i == "super") {
                    continue;
                }
                child[i] = parent[i];
            }
        }
        if (typeof child === "function" && typeof parent === "function") {
            _extend(child.prototype, parent.prototype);
            _extend(child, parent, true);
            child.super = child.super || [];
            child.super.push(parent);
            return;
        }
        _extend(child, parent);
    }

    LaseRun.scaler = function(obj, subObj) {
        var subObjAvailable = (typeof subObj !== "undefined");
        return {
            scale: function(w, h) {
                if (typeof h === "undefined") {
                    h = w.height || w.y;
                    w = w.width || w.x;
                }
                if (subObjAvailable) {
                    var sub = LaseRun.property.get(obj, subObj);
                    obj.scale.setTo(w / (sub.width || sub.x), h / (sub.height || sub.y));
                } else {
                    obj.scale.setTo(w, h);
                }
                
            }
        }
    }
/*
    LaseRun.resizeSpriteTo = function(s, w, h) {
        if (typeof h === "undefined") {
            h = w.height || w.y;
            w = w.width || w.x;
        }
        s.scale.setTo(w / s.texture.width, h / s.texture.height);
    }
*/
    var physicsTypeMap = {
        "p2": Phaser.Physics.P2JS,
        "arcade": Phaser.Physics.ARCADE,
        "ninja": Phaser.Physics.NINJA
    }

    LaseRun.mapPhysicsType = function(name) {
        return physicsTypeMap[name.toLowerCase()];
    }

    LaseRun.property = LaseRun.property || {};

    LaseRun.property.get = function(obj, prop) {
        prop = prop.split(".");
        for (var i = 0; i < prop.length; ++i) {
            obj = obj[prop[i]];
            if (typeof obj === "undefined") {
                return undefined;
            }
        }
        return obj;
    }

    LaseRun.property.set = function(obj, prop, value) {
        prop = prop.split(".");
        for (var i = 0; i < prop.length - 1; ++i) {
            var tmp = obj;
            obj = obj[prop[i]];
            if (typeof obj === "undefined") {
                obj = tmp[prop[i]] = {};
            }
        }
        obj[prop[prop.length - 1]] = value;
    }

    LaseRun.property.apply = function(obj, props, force) {
        for (var propName in props) {
            if (force || typeof LaseRun.property.get(obj, propName) !== "undefined") {
                LaseRun.property.set(obj, propName, props[propName]);
            }
        }
    }

    LaseRun.path = LaseRun.path || {};

    LaseRun.path.subPath = function(basePath, relPath) {
        return (basePath.charAt(basePath.length - 1) == '/' ? basePath + relPath : basePath + "/" + relPath);
    }

    LaseRun.path.getPath = function getPath(dir) {
        var rv = new String(dir);
        rv.child = function(relPath) {
            return getPath(LaseRun.path.subPath(this, relPath));
        }
        return rv;
    }

    LaseRun.path.assets = LaseRun.path.assets || {};

})();