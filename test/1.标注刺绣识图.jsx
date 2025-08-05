var CFG = {
    folderName: 0,
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

    markColorGap: 40, // 对象与颜色块之间的间距
    markColorSize: 10, // 颜色块的大小

    // 窗口 margin
    windowMargins: 12,

    // 刺绣色号图片目录
    embroideredFolder: Folder.userData + "/Adobe/Embroidered/",
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
                colors.push("RGB(" + Math.round(color.red) + ", " + Math.round(color.green) + ", " + Math.round(color.blue) + ")");
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
     * 获取文档中所有的颜色
     */
    getAllColorsByDoc: function (doc) {
        var doc = doc || app.activeDocument;
        var items = doc.pathItems;
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

    /**
     * 获取选区的颜色分组
     */
    getSelectionColorGroups: function () {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            alert("No items selected.");
            return null;
        }
        var colorGroups = {};

        for (var i = 0; i < items.length; i++) {
            handle(items[i]);
        }

        function handle(item) {
            if (item.typename === "GroupItem") {
                for (var j = 0; j < item.pageItems.length; j++) {
                    handle(item.pageItems[j]);
                }
            } else if (item.typename === "CompoundPathItem" && item.pathItems[0].filled && item.pathItems[0].fillColor) {
                // 对于复合路径，处理第一个路径项
                var firstPathItem = item.pathItems[0];
                var colorKey = UTILS.getColorText(firstPathItem.fillColor);
                if (colorKey) {
                    if (!colorGroups[colorKey]) {
                        colorGroups[colorKey] = [];
                    }
                    colorGroups[colorKey].push(item);
                }
            } else if (item.typename === "PathItem") {
                if (item.filled && item.fillColor) {
                    var colorKey = UTILS.getColorText(item.fillColor);
                    if (colorKey) {
                        if (!colorGroups[colorKey]) {
                            colorGroups[colorKey] = [];
                        }
                        colorGroups[colorKey].push(item);
                    }
                }
            }
        }

        return colorGroups;
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

function markEmbroideryNew() {
    try {
        // 打开文件选择框
        var file = new File().openDlg();
        if (!file) return; // 用户取消选择

        // 打开选中的文件
        var doc = app.open(file, DocumentColorSpace.RGB);

        // 获取 RasterItem
        var image = doc.pageItems[0]; // 假设第一个图层是图片
        if (!image || image.typename !== "RasterItem") {
            throw new Error("所选文件中没有找到图片");
        }

        // 执行描摹

        var pItem = image.trace();

        // 扩展描摹结果
        pItem.tracing.tracingOptions.loadFromPreset("高保真度照片"); // 使用高保真度照片
        pItem.tracing.expandTracing();

        // 获取描摹结果所有的颜色
        var colors = UTILS.getAllColorsByDoc(doc);

        // 关闭临时文档
        doc.close(SaveOptions.DONOTSAVECHANGES);

        $.writeln("提取到的颜色: " + colors.join(", "));

        // 打开原始文件
        var originalDoc = app.activeDocument;

        // 循环标注颜色图片
        for (var i = 0; i < colors.length; i++) {
            var color = colors[i];
            if (color.indexOf("RGB") !== 0) {
                $.writeln("跳过图案颜色: " + color);
                continue; // 跳过图案颜色
            }

            // RGB(250, 247, 242) -> 250-247-242
            var fileName = color
                .replace(/^RGB\(/, "")
                .replace(/\)$/, "")
                .replace(/,\s*/g, "-")
                .trim();

            $.writeln("标注颜色: " + color + ", 文件名: " + fileName);

            placeImage(fileName, 0, -i * 120, 100);
        }

        // 绘制矩形

        function placeImage(fileName, left, top, height) {
            var doc = app.activeDocument;
            var filePath = CFG.embroideredFolder + fileName + ".png";
            var file = new File(filePath);
            if (!file.exists) return;

            var fixedWidth = 100;
            var imageFrame = doc.placedItems.add();
            imageFrame.file = file;

            // 计算比例以保持宽高比
            var aspectRatio = imageFrame.height / imageFrame.width;
            imageFrame.width = fixedWidth;
            imageFrame.height = fixedWidth * aspectRatio;

            imageFrame.left = left || 0;
            imageFrame.top = top - (height - imageFrame.height) / 2;
            imageFrame.embed();
            return imageFrame;
        }
    } catch (error) {
        alert("标注刺绣出错了: " + error.message + "\n line: " + error.line);
    }
}

markEmbroideryNew();
