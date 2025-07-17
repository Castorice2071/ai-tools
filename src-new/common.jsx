var CFG = {
    metalColors: [
        { label: "黑镍凸起", name: "Raised  Black  Nickel  Metal", isRaised: true },
        { label: "黑镍凹下", name: "Recessed  Black  Nickel  Metal" },
        { label: "古金凸起", name: "Raised Antique  Gold Metal", isRaised: true },
        { label: "古金凹下", name: "Recessed  Antique Gold Metal" },
        { label: "镀金凸起", name: "Raised  Gold Metal", isRaised: true },
        { label: "镀金凹下", name: "Recessed  Gold Metal" },
        { label: "古青铜凸起", name: "Raised Antique Brass Metal", isRaised: true },
        { label: "古青铜凹下", name: "Recessed  Antique Brass Metal" },
        { label: "镀镍凸起", name: "Raised silver Metal", isRaised: true },
        { label: "镀镍凹下", name: "Recessed silver Metal" },
        { label: "古银凸起", name: "Raised Antique (silver) Metal", isRaised: true },
        { label: "古银凹下", name: "Recessed Antique (silver) Metal" },
        { label: "古红铜凸起", name: "Raised Antique Copper Metal", isRaised: true },
        { label: "古红铜凹下", name: "Recessed  Antique Copper Metal" },
        { label: "染黑凸起", name: "Raised  Dye Black Metal", isRaised: true },
        { label: "染黑凹下", name: "Recessed  Dye Black Metal" },
        { label: "红铜凸起", name: "Raised Shiny Copper Metal", isRaised: true },
        { label: "红铜凹下", name: "Recessed  Shiny Copper Metal" },
        { label: "玫瑰金凸起", name: "Raised  Rose Gold Metal", isRaised: true },
        { label: "玫瑰金凹下", name: "Recessed  Rose Gold Metal" },
        { label: "青铜凸起", name: "Raised Shiny Brass Metal", isRaised: true },
        { label: "青铜凹下", name: "Recessed  Shiny Brass Metal" },
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
     * 判断两个颜色是否匹配
     * @param {*} color1
     * @param {*} color2
     * @param {*} tolerance
     */
    isColorMatch: function (color1, color2, tolerance) {
        // 添加空值检查
        if (!color1 || !color2) return false;

        // 设置默认容差值
        tolerance = tolerance || 0;

        // 检查颜色类型
        if (color1.typename !== color2.typename) {
            // 如果是专色，获取其实际颜色进行比较
            if (color1.typename === "SpotColor") {
                return UTILS.isColorMatch(color1.spot.color, color2, tolerance);
            }
            if (color2.typename === "SpotColor") {
                return UTILS.isColorMatch(color1, color2.spot.color, tolerance);
            }
            return false;
        }

        // 根据颜色类型进行比较
        switch (color1.typename) {
            case "CMYKColor":
                return (
                    Math.abs(color1.cyan - color2.cyan) <= tolerance &&
                    Math.abs(color1.magenta - color2.magenta) <= tolerance &&
                    Math.abs(color1.yellow - color2.yellow) <= tolerance &&
                    Math.abs(color1.black - color2.black) <= tolerance
                );

            case "RGBColor":
                return Math.abs(color1.red - color2.red) <= tolerance && Math.abs(color1.green - color2.green) <= tolerance && Math.abs(color1.blue - color2.blue) <= tolerance;

            case "GrayColor":
                return Math.abs(color1.gray - color2.gray) <= tolerance;

            case "SpotColor":
                return UTILS.isColorMatch(color1.spot.color, color2.spot.color, tolerance);

            default:
                return false;
        }
    },

    /**
     * 获取颜色文本
     * @param {*} color
     */
    getColorText: function (color) {
        if (color.typename === "RGBColor") {
            return "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
        } else if (color.typename === "CMYKColor") {
            return "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
        } else if (color.typename === "GrayColor") {
            return "Gray(" + color.gray + ")";
        } else if (color.typename === "SpotColor") {
            return "SpotColor(" + color.spot.name + ")";
        } else if (color.typename === "PatternColor") {
            return "PatternColor(" + color.pattern.name + ")";
        }

        return null;
    },

    /**
     * 输出对象所有属性
     * @param {*} obj
     */
    printProperties: function (obj) {
        for (var prop in obj) {
            $.writeln(prop + ": " + obj[prop]);
        }
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
     * 设置颜色
     * @param {*} obj 对象
     * @param {*} color 颜色
     */
    setColor: function (obj, color) {
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
                item.filled = true; // 确保填充为true
                item.fillColor = color; // 设置填充颜色
                item.stroked = false; // 确保不描边
            }
        }

        collectColors(obj);
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
     * @param {boolean} isRaised 是否只获取凸起的金属颜色
     * @returns {Array} 金属颜色数组
     */
    getSelectionMetalColors: function (isRaised) {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            alert("No items selected.");
            return [];
        }

        var selectionColors = UTILS.getSelectionColors().map(function (color) {
            color = color
                .replace(/^RGB\(/, "")
                .replace(/^CMYK\(/, "")
                .replace(/^Gray\(/, "")
                .replace(/^SpotColor\(/, "")
                .replace(/^PatternColor\(/, "");
            color = color.replace(/\)$/, "").trim();
            return color;
        });
        var metalColors = CFG.metalColors.map(function (color) {
            return color.name;
        });
        if (isRaised) {
            metalColors = CFG.metalColors
                .filter(function (color) {
                    return color.isRaised;
                })
                .map(function (color) {
                    return color.name;
                });
        }
        var selectedMetalColors = selectionColors.filter(function (color) {
            return metalColors.includes(color);
        });

        return selectedMetalColors;
    },
};

polyfills();
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

    Object.keys = function (obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };
}
