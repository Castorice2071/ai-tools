var CFG = {
    metalColors: [
        { name: "黑镍凸起" },
        { name: "黑镍凹下" },
        { name: "古金凸起" },
        { name: "古金凹下" },
        { name: "镀金凸起" },
        { name: "镀金凹下" },
        { name: "古青铜凸起" },
        { name: "古青铜凹下" },
        { name: "镀镍凸起" },
        { name: "镀镍凹下" },
        { name: "古银凸起" },
        { name: "古银凹下" },
        { name: "古红铜凸起" },
        { name: "古红铜凹下" },
        { name: "染黑凸起" },
        { name: "染黑凹下" },
        { name: "红铜凸起" },
        { name: "红铜凹下" },
        { name: "玫瑰金凸起" },
        { name: "玫瑰金凹下" },
        { name: "青铜凸起" },
        { name: "青铜凹下" },
    ],
};

var UTILS = {
    /**
     * 数组去重
     * @param {Array} arr
     */
    uniqueArray: function (arr) {
        var unique = {};
        var result = [];
        for (var j = 0; j < arr.length; j++) {
            var c = arr[j];
            if (!unique[c]) {
                unique[c] = true;
                result.push(c);
            }
        }
        return result;
    },

    /**
     * 获取颜色
     * @param {*} obj 对象
     * @returns {Array} 颜色数组
     */
    getColors: function (obj) {
        var colors = [];

        function collectColors(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    collectColors(item.pageItems[i]);
                }
            } else if (item.typename === "CompoundPathItem") {
                for (var i = 0; i < item.pathItems.length; i++) {
                    collectColors(item.pathItems[i]);
                }
            } else {
                if (item.filled && item.fillColor) {
                    addColor(item.fillColor);
                }
            }
        }

        function addColor(color) {
            if (color.typename === "RGBColor") {
                colors.push("RGB(" + color.red + ", " + color.green + ", " + color.blue + ")");
            } else if (color.typename === "CMYKColor") {
                colors.push("CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")");
            } else if (color.typename === "GrayColor") {
                colors.push("Gray(" + color.gray + ")");
            } else if (color.typename === "SpotColor") {
                colors.push("SpotColor(" + color.spot.name + ")");
            } else if (color.typename === "PatternColor") {
                colors.push("PatternColor(" + color.pattern.name + ")");
            }
        }

        collectColors(obj);

        return UTILS.uniqueArray(colors);
    },

    /**
     * 获取选区的颜色
     */
    getSelectionColors: function () {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            alert("No items selected.");
            return [];
        }

        var allColors = [];
        for (var i = 0; i < items.length; i++) {
            var colors = UTILS.getColors(items[i]);
            allColors = allColors.concat(colors);
        }

        return UTILS.uniqueArray(allColors);
    },

    /**
     * 获取选区的金属颜色
     */
    getSelectionMetalColors: function () {
        var selectionColors = UTILS.getSelectionColors().map(function (color) {
            return color.replace(/RGB\(|CMYK\(|Gray\(|SpotColor\(|PatternColor\(|\)/g, "").trim();
        });
        var metalColors = CFG.metalColors.map(function (color) {
            return color.name;
        });
        var selectedMetalColors = selectionColors.filter(function (color) {
            return metalColors.includes(color);
        });

        if (selectedMetalColors.length > 0) {
            alert("选区中的金属颜色: " + selectedMetalColors.join(", "));
        } else {
            alert("选区中没有金属颜色。");
        }

        return selectedMetalColors;
    },
};

// Setup JavaScript Polyfills
function polyfills() {
    Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) callback(this[i], i, this);
    };

    Array.prototype.includes = function (search) {
        return this.indexOf(search) !== -1;
    };

    Array.prototype.indexOf = function (obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) return i;
        }
        return -1;
    };

    Array.prototype.filter = function (callback, context) {
        arr = [];
        for (var i = 0; i < this.length; i++) {
            if (callback.call(context, this[i], i, this)) arr.push(this[i]);
        }
        return arr;
    };

    Array.prototype.map = function (callback, context) {
        arr = [];
        for (var i = 0; i < this.length; i++) {
            arr.push(callback.call(context, this[i], i, this));
        }
        return arr;
    };

    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

/**
 * 获取选区的金属颜色
 */
function getSelectionMetalColors() {
    try {
        var arr = UTILS.getSelectionColors().map(function (color) {
            return color.replace(/RGB\(|CMYK\(|Gray\(|SpotColor\(|PatternColor\(|\)/g, "").trim();
        });
        var metalColors = CFG.metalColors.map(function (color) {
            return color.name;
        });
        $.writeln("选区颜色列表: " + arr.join(", "));
        $.writeln("金属颜色列表: " + metalColors.join(", "));
        var selectedMetalColors = arr.filter(function (color) {
            return metalColors.includes(color);
        });
        if (selectedMetalColors.length > 0) {
            alert("选区中的金属颜色: " + selectedMetalColors.join(", "));
        } else {
            alert("选区中没有金属颜色。");
        }
    } catch (error) {
        alert("获取选区的金属颜色失败: " + error.message);
    }
}

polyfills();
// getSelectionMetalColors();
UTILS.getSelectionMetalColors();
