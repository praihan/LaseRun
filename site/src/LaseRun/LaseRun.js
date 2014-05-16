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

    LaseRun.path.assets.img = LaseRun.path.assets.img || null;

    LaseRun.path.assets.sound = LaseRun.path.assets.sound || null;

})();