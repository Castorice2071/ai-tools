/**
 * 图稿设计工具箱
 *
 * Author: Li Wei
 * Date: 2025-07
 *
 * Release notes:
 * 0.0.1 Initial version
 * 0.0.7 新增全局变量以管理脚本执行状态，避免重复执行 标注颜色增加描边支持
 * 0.0.8 新增颜色分层功能，注释代码中的 writeln 输出
 * 1.0.0 颜色标注增加金属色排序在前功能
 * 1.0.1 颜色标注与对象排列时，垂直间距默认设置为3
 * 1.0.2 金属描边，处理复合路径置顶
 * 1.0.3 导出PSD，增加尺寸固定，避免错位
 * 1.0.4 新增标注刺绣功能; 标注颜色支持渐变色(需色板);
 */

//@target illustrator
//@targetengine main
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

var bit = 32;
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

var SCRIPT = {
    name: "图稿设计工具箱",
    version: "v1.0.4",
};

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

// 定义一个全局变量用于存储当前脚本是否正在执行任务中
var isRunning = false;

// 金属颜色
var METALCOLOR = new RGBColor();
METALCOLOR.red = 211;
METALCOLOR.green = 211;
METALCOLOR.blue = 211;

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

function buildMsg(code) {
    try {
        if (isRunning) {
            return; // 如果脚本正在运行，直接返回
        }
        isRunning = true; // 设置脚本正在运行状态
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.onResult = function (result) {
            isRunning = false; // 脚本执行完毕，重置状态
        };
        bt.onError = function (error) {
            isRunning = false; // 脚本执行出错，重置状态
        };
        bt.send();
    } catch (error) {}
}

function output(data) {
    if (data instanceof Array) {
        for (var i = 0; i < data.length; i++) {
            $.writeln("Array Item " + (i + 1) + ": " + data[i]);
        }
    } else if (typeof data === "object" && data !== null) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                $.writeln("Key: " + key + ", Value: " + data[key]);
            }
        }
    } else {
        $.writeln("Value: " + data);
    }
}

function isColorMatch(color1, color2, tolerance) {
    // 添加空值检查
    if (!color1 || !color2) return false;

    // 设置默认容差值
    tolerance = tolerance || 0;

    // 检查颜色类型
    if (color1.typename !== color2.typename) {
        // 如果是专色，获取其实际颜色进行比较
        if (color1.typename === "SpotColor") {
            return isColorMatch(color1.spot.color, color2, tolerance);
        }
        if (color2.typename === "SpotColor") {
            return isColorMatch(color1, color2.spot.color, tolerance);
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
            return isColorMatch(color1.spot.color, color2.spot.color, tolerance);

        default:
            return false;
    }
}

/**
 * 获取选中的颜色 - 标注颜色使用
 */
function getSelectedColors(the_obj) {
    var colors = [];

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem" && item.pathItems[0].filled && item.pathItems[0].fillColor) {
            addColor(item.pathItems[0].fillColor);
        } else {
            if (item.filled && item.fillColor) {
                addColor(item.fillColor);
            }

            if (item.stroked && item.strokeColor) {
                addColor(item.strokeColor);
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
        } else if (color.typename === "GradientColor") {
            colors.push("GradientColor(" + color.gradient.name + ")");
        }
    }

    collectColors(the_obj);

    // 去重
    var uniqueColors = {};
    var result = [];
    for (var j = 0; j < colors.length; j++) {
        var c = colors[j];
        if (!uniqueColors[c]) {
            uniqueColors[c] = true;
            result.push(c);
        }
    }
    return result;
}

/**
 * 获取文档中所有的颜色
 */
function getAllColors() {
    var doc = app.activeDocument;
    var colors = [];

    function processLayer(layerOrGroupItem) {
        // 如果图层被锁定或隐藏，跳过
        if (layerOrGroupItem.locked || layerOrGroupItem.hidden) return;

        // 遍历 layerOrGroupItem 的子元素
        for (var i = 0; i < layerOrGroupItem.pageItems.length; i++) {
            var item = layerOrGroupItem.pageItems[i];

            // 如果当前对象是 Group 或者 Layer，继续递归
            if (item.typename === "GroupItem" || item.typename === "Layer") {
                processLayer(item);
            } else {
                collectColors(item);
            }
        }
    }

    function collectColors(item) {
        // $.writeln("collectColors item.typename: " + item.typename);
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem" && item.pathItems[0].filled && item.pathItems[0].fillColor) {
            addColor(item.pathItems[0].fillColor);
            // // 处理复合路径中的每个路径项
            // for (var i = 0; i < item.pathItems.length; i++) {
            //     var pathItem = item.pathItems[i];
            //     if (pathItem.filled && pathItem.fillColor) {

            //     }
            // }
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
        }
    }

    // 检查文档是否存在且有图层
    if (doc && doc.layers.length > 0) {
        // 遍历所有图层
        for (var i = 0; i < doc.layers.length; i++) {
            processLayer(doc.layers[i]);
        }
    }

    // 去重处理
    var uniqueColors = {};
    var result = [];
    for (var j = 0; j < colors.length; j++) {
        var c = colors[j];
        if (!uniqueColors[c]) {
            uniqueColors[c] = true;
            result.push(c);
        }
    }
    return result;
}

/**
 * 隐藏金属色
 */
function hideMetalColor() {
    // 获取当前文档
    var doc = app.activeDocument;

    // 遍历路径项并隐藏指定颜色
    for (var i = 0; i < doc.pathItems.length; i++) {
        var pathItem = doc.pathItems[i];
        if (pathItem.filled && isColorMatch(pathItem.fillColor, METALCOLOR)) {
            pathItem.hidden = true; // 隐藏对象
        }
    }
}

/**
 * 隐藏非金属色
 */
function hideNotMetalColor() {
    // 获取当前文档
    var doc = app.activeDocument;
    // 遍历路径项并隐藏非金属色
    for (var i = 0; i < doc.pathItems.length; i++) {
        var pathItem = doc.pathItems[i];
        if (pathItem.filled && !isColorMatch(pathItem.fillColor, METALCOLOR)) {
            pathItem.hidden = true; // 隐藏对象
        }
    }
}

/**
 * 导出 PSD
 */
function exportToPSD(filePath) {
    try {
        // 获取当前文档
        var doc = app.activeDocument;

        // 设置导出选项
        var psdOptions = new ExportOptionsPhotoshop();
        // psdOptions.layers = true; // 保留图层
        // psdOptions.embedLinkedFiles = true; // 嵌入链接文件

        // 导出为 PSD 文件
        // var file = new File(doc.path + "/" + doc.name.replace(/\.[^\.]+$/, "") + ".psd");

        var file = new File(filePath);
        doc.exportFile(file, ExportType.PHOTOSHOP, psdOptions);
    } catch (error) {
        alert("导出 PSD 文件时出错: " + error.message);
    }
}

/**
 * 导出 AI
 */
function exportToAI(name) {
    try {
        // 获取当前文档
        var doc = app.activeDocument;

        // 导出为 AI 文件
        var file = new File(Folder.desktop + "/" + name);
        doc.saveAs(file);
    } catch (error) {
        alert("导出 AI 文件时出错: " + error.message);
    }
}

/**
 * 识别颜色并导出PSD
 */
function analyzeColorsAndExportPSD() {
    var colors = getAllColors();

    // 创建文件夹
    CFG.folderName++;
    var fileFolder = Folder.desktop + "/" + CFG.folderName + "/";
    if (!Folder(fileFolder).exists) {
        Folder(fileFolder).create();
    }

    // 遍历所有颜色
    for (var i = 0; i < colors.length; i++) {
        var colorStr = colors[i];

        // 获取当前文档
        var doc = app.activeDocument;

        // 遍历所有路径项并隐藏不匹配当前颜色的项
        for (var j = 0; j < doc.pathItems.length; j++) {
            var pathItem = doc.pathItems[j];
            if (pathItem.filled && pathItem.fillColor) {
                var itemColorStr = "";
                var color = pathItem.fillColor;

                if (color.typename === "RGBColor") {
                    itemColorStr = "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
                } else if (color.typename === "CMYKColor") {
                    itemColorStr = "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
                } else if (color.typename === "GrayColor") {
                    itemColorStr = "Gray(" + color.gray + ")";
                } else if (color.typename === "SpotColor") {
                    itemColorStr = "SpotColor(" + color.spot.name + ")";
                }

                pathItem.hidden = itemColorStr !== colorStr;
            }
        }

        // 处理文件名
        var fileName = colorStr.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
        fileName = fileName.replace(/^RGB\((.+)\)/, "$1");
        fileName = fileName.replace(/^CMYK\((.+)\)/, "$1");
        fileName = fileName.replace(/^Gray\((.+)\)/, "$1");
        fileName = fileName.replace(/[,]/g, "_");

        exportToPSD(fileFolder + fileName + ".psd");

        // 恢复所有项的显示状态
        app.undo();
        app.redraw();
    }

    // 释放文件夹引用
    folder = null;
    fileFolder = null;
    $.gc(); // 触发垃圾回收
    $.gc();

    // 上面的释放与gc，本意是避免文件夹被占用不能删除，结果一直没有生效。反而下面的alert可以满足
    alert("导出完成");
}

/**
 * 识别颜色并导出AI
 */
function analyzeColorsAndExportAI() {
    var colors = getAllColors();
    // 遍历所有颜色
    for (var i = 0; i < colors.length; i++) {
        var colorStr = colors[i];

        // 获取当前文档
        var doc = app.activeDocument;

        // 遍历所有路径项并隐藏不匹配当前颜色的项
        for (var j = 0; j < doc.pathItems.length; j++) {
            var pathItem = doc.pathItems[j];
            if (pathItem.filled && pathItem.fillColor) {
                var itemColorStr = "";
                var color = pathItem.fillColor;

                if (color.typename === "RGBColor") {
                    itemColorStr = "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
                } else if (color.typename === "CMYKColor") {
                    itemColorStr = "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
                } else if (color.typename === "GrayColor") {
                    itemColorStr = "Gray(" + color.gray + ")";
                } else if (color.typename === "SpotColor") {
                    itemColorStr = "SpotColor(" + color.spot.name + ")";
                }

                pathItem.hidden = itemColorStr !== colorStr;
            }
        }

        // 处理文件名
        var fileName = colorStr.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
        fileName = fileName.replace(/^RGB\((.+)\)/, "$1");
        fileName = fileName.replace(/^CMYK\((.+)\)/, "$1");
        fileName = fileName.replace(/^Gray\((.+)\)/, "$1");
        fileName = fileName.replace(/[,]/g, "_");
        exportToAI(fileName + ".ai");

        // 恢复所有项的显示状态
        app.undo();
        app.redraw();
    }
}

/**
 * 重置文件夹
 */
function resetFolder() {
    $.gc();
    $.gc();
    CFG.folderName = 0;

    alert("重置文件夹成功");
}

/**
 * 获取当前图稿中的金属色
 */
function getMetalColors() {
    try {
        var items = app.activeDocument.pathItems;
        var metalColors = [];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            // 检查是否有填充色
            if (item.filled) {
                var fillColor = item.fillColor;
                // 检查是否为RGB颜色
                if (fillColor.typename === "RGBColor") {
                    var rgb = [Math.round(fillColor.red), Math.round(fillColor.green), Math.round(fillColor.blue)];

                    // 检查是否为预定义的金属色
                    for (var j = 0; j < CFG.metalColors.length; j++) {
                        var metalColor = CFG.metalColors[j];
                        if (Math.abs(rgb[0] - metalColor[0]) === 0 && Math.abs(rgb[1] - metalColor[1]) === 0 && Math.abs(rgb[2] - metalColor[2]) === 0) {
                            metalColors.push(rgb);
                            break;
                        }
                    }
                }
            }
        }

        // 去重处理
        var uniqueColors = {};
        var result = [];
        for (var j = 0; j < metalColors.length; j++) {
            var c = metalColors[j];
            if (!uniqueColors[c]) {
                uniqueColors[c] = true;
                result.push(c);
            }
        }

        return result;
    } catch (error) {
        alert("获取当前图稿中的金属色: " + error.message);
        return [];
    }
}

/**
 * 给金属描边
 */
function metalEdging() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            alert("No items selected.");
            return [];
        }

        // 1. 获取选区的凸起金属颜色
        var metalColors = UTILS.getSelectionMetalColors(true);
        // $.writeln("凸起金属颜色数量: " + metalColors.length);
        // $.writeln("凸起金属颜色: " + metalColors.join(" @ "));

        if (metalColors.length === 0 || metalColors.length >= 2) {
            return alert("只支持选区中有且仅有一个凸起金属颜色");
        }

        // 2. 构造颜色
        var METALCOLOR = new SpotColor();
        METALCOLOR.spot = app.activeDocument.spots.getByName(metalColors[0]);
        // $.writeln("METALCOLOR: " + METALCOLOR.spot);

        // 3. 获取描边宽度
        // var strokeWidth = parseFloat(prompt("请输入描边宽度（单位：毫米）", "0.5"));
        var strokeWidth = parseFloat(PB.strokeWidth.text);

        // $.writeln("描边宽度: " + strokeWidth + "mm");

        // 3. 遍历选区中的 pathItem
        for (var i = 0; i < items.length; i++) {
            handle(items[i]);
        }

        function handle(item) {
            if (item.typename === "GroupItem") {
                for (var j = 0; j < item.pageItems.length; j++) {
                    handle(item.pageItems[j]);
                }
            } else if (item.typename === "CompoundPathItem") {
                for (var j = 0; j < item.pathItems.length; j++) {
                    handle(item.pathItems[j]);
                }
            } else if (item.typename === "PathItem") {
                if (item.filled && item.fillColor && UTILS.isColorMatch(item.fillColor, METALCOLOR, 1)) {
                    // $.writeln("METALCOLOR111: " + METALCOLOR.spot);
                    // 启用描边
                    item.stroked = true;

                    // 设置描边颜色和宽度
                    item.strokeColor = METALCOLOR;
                    item.strokeWidth = new UnitValue(strokeWidth, "mm").as("pt"); // 明确指定单位

                    // 最后设置描边样式
                    item.strokeCap = StrokeCap.ROUNDENDCAP;
                    item.strokeJoin = StrokeJoin.ROUNDENDJOIN;

                    // 置于顶层
                    item.zOrder(ZOrderMethod.BRINGTOFRONT);

                    if (item.parent.typename === "CompoundPathItem") {
                        item.parent.zOrder(ZOrderMethod.BRINGTOFRONT);
                    }
                }
            }
        }
    } catch (error) {
        alert("给凸起金属描边失败: " + error.message);
    }
}

// =========================
// 创建窗口 palette or dialog
var win = new Window("palette", SCRIPT.name + " " + SCRIPT.version);
win.alignChildren = ["fill", "fill"];

// 识别颜色并导出
// =======
var PA = win.add("panel", undefined, "识别颜色");
PA.orientation = "row";
PA.alignChildren = ["fill", "fill"];
PA.margins = CFG.windowMargins;
PA.spacing = 8;
PA.BTN1 = PA.add("button", undefined, "导出PSD");
PA.BTN3 = PA.add("button", undefined, "重置文件夹");
PA.BTN2 = PA.add("button", undefined, "分层");
PA.BTN1.onClick = function () {
    buildMsg("analyzeColorsAndExportPSDNew();");
};
PA.BTN2.onClick = function () {
    // buildMsg("analyzeColorsAndExportAI();");
    buildMsg("colorLayer();");
};
PA.BTN3.onClick = function () {
    buildMsg("resetFolder();");
};

// 金属描边加粗
// =======
var PB = win.add("panel", undefined, "金属描边");
PB.orientation = "row";
PB.alignChildren = ["fill", "fill"];
PB.margins = CFG.windowMargins;
PB.spacing = 8;

PB.strokeWidth = PB.add("editText", undefined, "0.1");
PB.strokeWidth.addEventListener("keydown", function (kd) {
    if (kd.keyName == "Enter") {
        buildMsg("metalEdging();");
    }
});
PB.BTN1 = PB.add("button", undefined, "确定");
PB.BTN1.onClick = function () {
    buildMsg("metalEdging();");
};

// 标注尺寸
// =======
var PC = win.add("panel", undefined, "标注尺寸");
PC.alignChildren = ["fill", "fill"];
PC.margins = CFG.windowMargins;
PC.spacing = 8;

var sidePanel = PC.add("panel", undefined, "选择标注边");
sidePanel.orientation = "row";
sidePanel.alignChildren = ["fill", "fill"];
sidePanel.margins = 16;
sidePanel.spacing = 8;
PC.topCheckbox = sidePanel.add("checkbox", undefined, "上边");
PC.rightCheckbox = sidePanel.add("checkbox", undefined, "右边");
PC.bottomCheckbox = sidePanel.add("checkbox", undefined, "下边");
PC.leftCheckbox = sidePanel.add("checkbox", undefined, "左边");
PC.bottomCheckbox.value = true;
PC.leftCheckbox.value = true;

var unitPanelAndFontSizePanelGroup = PC.add("group");
unitPanelAndFontSizePanelGroup.orientation = "row";
unitPanelAndFontSizePanelGroup.alignChildren = ["fill", "fill"];

var unitPanel = unitPanelAndFontSizePanelGroup.add("panel", undefined, "选择单位");
unitPanel.orientation = "row";
unitPanel.margins = 16;
unitPanel.spacing = 8;
PC.unitControl = unitPanel.add("dropdownlist", undefined);
PC.unitControl.preferredSize = [80, -1];
// 定义可选单位列表
var unitItems = ["英寸-in", "毫米-mm", "厘米-cm", "米-m", "磅-pt", "像素-px", "英尺-ft", "派卡-pc"];
// 添加单位选项到下拉列表
for (var i = 0; i < unitItems.length; i++) {
    PC.unitControl.add("item", unitItems[i]);
}
// 设置单位选项默认选择第一个
PC.unitControl.selection = 0;

// ==== 标注寸尺 字号大小
var fontSizePanel = unitPanelAndFontSizePanelGroup.add("panel", undefined, "字号大小");
fontSizePanel.orientation = "row";
fontSizePanel.margins = 16;
fontSizePanel.spacing = 8;

PC.fontSizeControl = fontSizePanel.add("editText", undefined, "10");
PC.fontSizeControl.preferredSize = [80, -1];

var group = PC.add("group");
group.alignChildren = ["center", "fill"];
PC.BTN1 = group.add("button", undefined, "确定");
PC.BTN1.onClick = function () {
    buildMsg("label_Info();");
};

// 标注颜色与排列
// =======
var PD = win.add("panel", undefined, "标注颜色与排列");
PD.alignChildren = ["fill", "fill"];
PD.margins = CFG.windowMargins;

var groupColumns = PD.add("group");
groupColumns.orientation = "row";
var captionColumns = groupColumns.add("statictext", undefined, "列数:");
PD.valueColumns = groupColumns.add("edittext", undefined, 2);
PD.valueColumns.preferredSize = [100, -1];

var groupGutter = PD.add("group");
groupGutter.orientation = "row";
groupGutter.alignChildren = ["fill", "fill"];

var groupGutterX = groupGutter.add("group");
groupGutterX.orientation = "row";
var captionGutterX = groupGutterX.add("statictext", undefined, "水平间距");
PD.valueGutterX = groupGutterX.add("edittext", undefined, 10);
PD.valueGutterX.preferredSize = [50, -1];

var groupGutterY = groupGutter.add("group");
groupGutterY.orientation = "row";
var captionGutterY = groupGutterY.add("statictext", undefined, "垂直间距");
PD.valueGutterY = groupGutterY.add("edittext", undefined, 3);
PD.valueGutterY.preferredSize = [50, -1];

var winButtons = PD.add("group");
winButtons.orientation = "row";
winButtons.margins = [0, 16, 0, 0];
winButtons.alignChildren = ["center", "center"];
PD.BTN1 = winButtons.add("button", undefined, "标注颜色");
PD.BTN2 = winButtons.add("button", undefined, "对象排列");
PD.BTN3 = winButtons.add("button", undefined, "标注刺绣");

PD.BTN1.onClick = function () {
    buildMsg("markColor();");
};

PD.BTN2.onClick = function () {
    buildMsg("startAction();");
};

PD.BTN3.onClick = function () {
    buildMsg("markEmbroidery();");
};

win.show();

// =============================================================
/**
 * 创建一个 RGB 颜色
 */
function createRGBColor(rgb) {
    var color = new RGBColor();
    color.red = rgb[0];
    color.green = rgb[1];
    color.blue = rgb[2];
    return color;
}

// 辅助函数：获取对象边界
function NO_CLIP_BOUNDS(the_obj) {
    if (the_obj.typename == "GroupItem") {
        if (the_obj.clipped) {
            return the_obj.pageItems[0].geometricBounds;
        } else {
            var left = [];
            var top = [];
            var right = [];
            var bottom = [];
            for (var i = 0; i < the_obj.pageItems.length; i++) {
                var bounds = NO_CLIP_BOUNDS(the_obj.pageItems[i]);
                left.push(bounds[0]);
                top.push(bounds[1]);
                right.push(bounds[2]);
                bottom.push(bounds[3]);
            }
            return [Math.min.apply(null, left), Math.max.apply(null, top), Math.max.apply(null, right), Math.min.apply(null, bottom)];
        }
    } else {
        return the_obj.geometricBounds;
    }
}

// 标注信息处理函数
function label_Info() {
    var doc = app.activeDocument;
    var sel = doc.selection;

    if (sel.length <= 0) {
        return alert("请先选择标注对象！");
    }

    var setDecimals = 2; // 小数位数（默认2位）
    var setLineWeight = 0.5; // 线条粗细（默认0.5pt）
    var setgap = 3; // 标注线与对象的间距（默认3pt）
    var setDoubleLine = 8; // 标注线两端的短线长度（默认8pt）
    var setAsizeSize = 6; // 箭头大小（默认6pt）

    // 获取标注边的选择状态
    var top = PC.topCheckbox.value;
    var left = PC.leftCheckbox.value;
    var right = PC.rightCheckbox.value;
    var bottom = PC.bottomCheckbox.value;

    // 获取单位设置
    var unitConvert = PC.unitControl.selection.toString().replace(/[^a-zA-Z]/g, "");
    var fontSize = PC.fontSizeControl.text;
    var color = createRGBColor([0, 0, 0]);
    // $.writeln("unitConvert: " + unitConvert);
    // $.writeln("fontSize: " + fontSize);

    if (!top && !left && !right && !bottom) {
        return alert("请至少选择一个标注边。");
    }

    var specsLayer = doc.activeLayer;
    var itemsGroup = specsLayer.groupItems.add();

    // 处理单体标注
    if (sel.length > 0) {
        if (top) Each_DIMENSIONS(sel[0], "Top");
        if (left) Each_DIMENSIONS(sel[0], "Left");
        if (right) Each_DIMENSIONS(sel[0], "Right");
        if (bottom) Each_DIMENSIONS(sel[0], "Bottom");
    }

    // 单体标注函数
    function Each_DIMENSIONS(bound, where) {
        var bound = new Array();
        for (var i = 0; i < sel.length; i += 1) {
            var a = NO_CLIP_BOUNDS(sel[i]);
            bound[0] = a[0];
            bound[1] = a[1];
            bound[2] = a[2];
            bound[3] = a[3];
            linedraw(bound, where);
        }
    }

    // 线条创建函数
    function Lineadd(geo) {
        var Linename = itemsGroup.pathItems.add();
        Linename.setEntirePath(geo);
        Linename.stroked = true;
        Linename.strokeWidth = setLineWeight;
        Linename.strokeColor = color;
        Linename.filled = false;
        Linename.strokeCap = StrokeCap.BUTTENDCAP;
        return Linename;
    }

    // 箭头创建函数
    function arrowsAdd(geoAR) {
        var arrowName = itemsGroup.pathItems.add();
        arrowName.setEntirePath(geoAR);
        arrowName.stroked = false;
        arrowName.strokeColor = NoColor;
        arrowName.filled = true;
        arrowName.fillColor = color;
        arrowName.closed = true;
        return arrowName;
    }

    // 标注线绘制函数
    function linedraw(bound, where) {
        var x = bound[0];
        var y = bound[1];
        var w = bound[2] - bound[0];
        var h = bound[1] - bound[3];

        // 处理负宽度和高度
        var xa = w < 0 ? x + w : x;
        var xb = w < 0 ? x : x;
        var ya = h < 0 ? y - h : y;
        var yb = h < 0 ? y : y;

        // 处理水平方向标注
        if (w != 0) {
            if (where == "Top") {
                var topGroup = specsLayer.groupItems.add();
                topGroup.name = "上";

                // 创建标注线
                var topLines1 = new Lineadd([
                    [x, y + setDoubleLine / 2 + setgap],
                    [x + w, y + setDoubleLine / 2 + setgap],
                ]);
                var topLines2 = new Lineadd([
                    [x, y + setDoubleLine + setgap],
                    [x, y + setgap],
                ]);
                var topLines3 = new Lineadd([
                    [x + w, y + setDoubleLine + setgap],
                    [x + w, y + setgap],
                ]);

                // 添加箭头
                var topArrows1 = new arrowsAdd([
                    [xa + setAsizeSize, y + setDoubleLine / 2 + setgap - setAsizeSize / 2],
                    [xa, y + setDoubleLine / 2 + setgap],
                    [xa + setAsizeSize, y + setDoubleLine / 2 + setgap + setAsizeSize / 2],
                ]);
                var topArrows2 = new arrowsAdd([
                    [xb + w - setAsizeSize, y + setDoubleLine / 2 + setgap - setAsizeSize / 2],
                    [xb + w, y + setDoubleLine / 2 + setgap],
                    [xb + w - setAsizeSize, y + setDoubleLine / 2 + setgap + setAsizeSize / 2],
                ]);

                // 创建文字
                var textInfo = specTextLabel(w, x + w / 2, y + setDoubleLine / 2 + setgap + setLineWeight, unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                textInfo.top += textInfo.height;
                // textInfo.left -= textInfo.width / 2;

                // 组织元素
                topLines1.move(topGroup, ElementPlacement.PLACEATBEGINNING);
                topLines2.move(topGroup, ElementPlacement.PLACEATEND);
                topLines3.move(topGroup, ElementPlacement.PLACEATEND);
                topArrows1.move(topGroup, ElementPlacement.PLACEATEND);
                topArrows2.move(topGroup, ElementPlacement.PLACEATEND);
                textInfo.move(topGroup, ElementPlacement.PLACEATBEGINNING);
                topGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }

            if (where == "Bottom") {
                var bottomGroup = specsLayer.groupItems.add();
                bottomGroup.name = "下";

                // 创建标注线
                var bottomLines1 = new Lineadd([
                    [x, y - h - (setDoubleLine / 2 + setgap)],
                    [x + w, y - h - (setDoubleLine / 2 + setgap)],
                ]);
                var bottomLines2 = new Lineadd([
                    [x, y - h - setDoubleLine - setgap],
                    [x, y - h - setgap],
                ]);
                var bottomLines3 = new Lineadd([
                    [x + w, y - h - setDoubleLine - setgap],
                    [x + w, y - h - setgap],
                ]);

                // 添加箭头
                var bottomArrows1 = new arrowsAdd([
                    [xa + setAsizeSize, y - h - (setDoubleLine / 2 + setgap) - setAsizeSize / 2],
                    [xa, y - h - (setDoubleLine / 2 + setgap)],
                    [xa + setAsizeSize, y - h - (setDoubleLine / 2 + setgap) + setAsizeSize / 2],
                ]);
                var bottomArrows2 = new arrowsAdd([
                    [xb + w - setAsizeSize, y - h - (setDoubleLine / 2 + setgap) - setAsizeSize / 2],
                    [xb + w, y - h - (setDoubleLine / 2 + setgap)],
                    [xb + w - setAsizeSize, y - h - (setDoubleLine / 2 + setgap) + setAsizeSize / 2],
                ]);

                // 创建文字
                var textInfo = specTextLabel(w, x + w / 2, y - h - setDoubleLine / 2 - (setgap + setLineWeight + 3), unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                // textInfo.left -= textInfo.width / 2;

                // 组织元素
                bottomLines1.move(bottomGroup, ElementPlacement.PLACEATBEGINNING);
                bottomLines2.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomLines3.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomArrows1.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomArrows2.move(bottomGroup, ElementPlacement.PLACEATEND);
                textInfo.move(bottomGroup, ElementPlacement.PLACEATBEGINNING);
                bottomGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }

        // 处理垂直方向标注
        if (h != 0) {
            if (where == "Left") {
                var leftGroup = specsLayer.groupItems.add();
                leftGroup.name = "左";

                // 创建标注线
                var leftLines1 = new Lineadd([
                    [x - (setDoubleLine / 2 + setgap), y],
                    [x - (setDoubleLine / 2 + setgap), y - h],
                ]);
                var leftLines2 = new Lineadd([
                    [x - setDoubleLine - setgap, y],
                    [x - setgap, y],
                ]);
                var leftLines3 = new Lineadd([
                    [x - setDoubleLine - setgap, y - h],
                    [x - setgap, y - h],
                ]);

                // 添加箭头
                var leftArrows1 = new arrowsAdd([
                    [x - (setDoubleLine / 2 + setgap) - setAsizeSize / 2, ya - setAsizeSize],
                    [x - (setDoubleLine / 2 + setgap), ya],
                    [x - (setDoubleLine / 2 + setgap) + setAsizeSize / 2, ya - setAsizeSize],
                ]);
                var leftArrows2 = new arrowsAdd([
                    [x - (setDoubleLine / 2 + setgap) - setAsizeSize / 2, yb - h + setAsizeSize],
                    [x - (setDoubleLine / 2 + setgap), yb - h],
                    [x - (setDoubleLine / 2 + setgap) + setAsizeSize / 2, yb - h + setAsizeSize],
                ]);

                // 创建文字
                var textInfo = specTextLabel(h, x - (setDoubleLine / 2 + setgap + setLineWeight + 5), y - h / 2, unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.RIGHT;
                textInfo.top += textInfo.height / 2;
                // textInfo.left -= textInfo.width + 5;

                // 组织元素
                leftLines1.move(leftGroup, ElementPlacement.PLACEATBEGINNING);
                leftLines2.move(leftGroup, ElementPlacement.PLACEATEND);
                leftLines3.move(leftGroup, ElementPlacement.PLACEATEND);
                leftArrows1.move(leftGroup, ElementPlacement.PLACEATEND);
                leftArrows2.move(leftGroup, ElementPlacement.PLACEATEND);
                textInfo.move(leftGroup, ElementPlacement.PLACEATBEGINNING);
                leftGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }

            if (where == "Right") {
                var rightGroup = specsLayer.groupItems.add();
                rightGroup.name = "右";

                // 创建标注线
                var rightLines1 = new Lineadd([
                    [x + w + setDoubleLine / 2 + setgap, y],
                    [x + w + setDoubleLine / 2 + setgap, y - h],
                ]);
                var rightLines2 = new Lineadd([
                    [x + w + setDoubleLine + setgap, y],
                    [x + w + setgap, y],
                ]);
                var rightLines3 = new Lineadd([
                    [x + w + setDoubleLine + setgap, y - h],
                    [x + w + setgap, y - h],
                ]);

                // 添加箭头
                var rightArrows1 = new arrowsAdd([
                    [x + w + setDoubleLine / 2 + setgap - setAsizeSize / 2, ya - setAsizeSize],
                    [x + w + setDoubleLine / 2 + setgap, ya],
                    [x + w + setDoubleLine / 2 + setgap + setAsizeSize / 2, ya - setAsizeSize],
                ]);
                var rightArrows2 = new arrowsAdd([
                    [x + w + setDoubleLine / 2 + setgap - setAsizeSize / 2, yb - h + setAsizeSize],
                    [x + w + setDoubleLine / 2 + setgap, yb - h],
                    [x + w + setDoubleLine / 2 + setgap + setAsizeSize / 2, yb - h + setAsizeSize],
                ]);

                // 创建文字
                var textInfo = specTextLabel(h, x + w + setDoubleLine / 2 + setgap + setLineWeight + 5, y - h / 2, unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
                textInfo.top += textInfo.height / 2;

                // 组织元素
                rightLines1.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                rightLines2.move(rightGroup, ElementPlacement.PLACEATEND);
                rightLines3.move(rightGroup, ElementPlacement.PLACEATEND);
                rightArrows1.move(rightGroup, ElementPlacement.PLACEATEND);
                rightArrows2.move(rightGroup, ElementPlacement.PLACEATEND);
                textInfo.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                rightGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }
    }

    // 创建标注文字函数
    function specTextLabel(val, x, y, wheres) {
        var textInfo = doc.textFrames.add();
        try {
            textInfo.textRange.characterAttributes.textFont = app.textFonts.getByName("ArialMT");
        } catch (error) {}
        textInfo.textRange.characterAttributes.size = fontSize;
        textInfo.textRange.characterAttributes.fillColor = color;
        textInfo.textRange.characterAttributes.alignment = StyleRunAlignmentType.center;

        var value = val;
        var unitsInfo = "";

        // 单位转换
        switch (wheres) {
            case "auto":
                switch (doc.rulerUnits) {
                    case RulerUnits.Millimeters:
                        value = new UnitValue(value, "pt").as("mm");
                        unitsInfo = " mm";
                        break;
                    case RulerUnits.Centimeters:
                        value = new UnitValue(value, "pt").as("cm");
                        unitsInfo = " cm";
                        break;
                    case RulerUnits.Pixels:
                        value = new UnitValue(value, "pt").as("px");
                        unitsInfo = " px";
                        break;
                    case RulerUnits.Inches:
                        value = new UnitValue(value, "pt").as("in");
                        unitsInfo = "″";
                        break;
                    case RulerUnits.Picas:
                        value = new UnitValue(value, "pt").as("pc");
                        var vd = value - Math.floor(value);
                        vd = 12 * vd;
                        value = Math.floor(value) + "p" + vd.toFixed(setDecimals);
                        break;
                    default:
                        value = new UnitValue(value, "pt").as("pt");
                        unitsInfo = " pt";
                }
                break;
            case "mm":
                value = new UnitValue(value, "pt").as("mm");
                unitsInfo = " mm";
                break;
            case "cm":
                value = new UnitValue(value, "pt").as("cm");
                unitsInfo = " cm";
                break;
            case "m":
                value = new UnitValue(value, "pt").as("m");
                unitsInfo = " m";
                break;
            case "pt":
                value = new UnitValue(value, "pt").as("pt");
                unitsInfo = " pt";
                break;
            case "px":
                value = new UnitValue(value, "pt").as("px");
                unitsInfo = " px";
                break;
            case "in":
                value = new UnitValue(value, "pt").as("in");
                unitsInfo = "″";
                break;
            case "ft":
                value = new UnitValue(value, "pt").as("ft");
                unitsInfo = " ft";
                break;
            case "pc":
                value = new UnitValue(value, "pt").as("pc");
                var vd = value - Math.floor(value);
                vd = 12 * vd;
                value = Math.floor(value) + "p" + vd.toFixed(setDecimals);
                break;
        }

        value = value.toString().replace(/-/g, "");
        if (wheres != "pc") {
            value = parseFloat(value).toFixed(setDecimals);
        }

        // 如果小数位是0，则去掉小数点和0
        var zeros = "";
        for (var i = 0; i < setDecimals; i++) {
            zeros += "0";
        }
        if (value.slice(-setDecimals) === zeros) {
            value = value.slice(0, -setDecimals - 1);
        }

        textInfo.contents = value + unitsInfo;
        textInfo.top = y;
        textInfo.left = x;
        return textInfo;
    }
}

function selectionBounds(bounds) {
    bounds = typeof bounds === "string" && bounds.length && bounds.slice(0, 1) === "v" ? "visibleBounds" : "geometricBounds";
    var arr = app.selection;
    var x = [];
    var y = [];
    var w = [];
    var h = [];
    var size = [[], []];
    var i = arr.length;
    while (i--) {
        x.push(arr[i][bounds][0]);
        y.push(arr[i][bounds][1]);
        w.push(arr[i][bounds][2]);
        h.push(arr[i][bounds][3]);
        size[0].push(arr[i][bounds][2] - arr[i][bounds][0]);
        size[1].push(arr[i][bounds][1] - arr[i][bounds][3]);
    }
    return [Math.min.apply(null, x), Math.max.apply(null, y), Math.max.apply(null, w), Math.min.apply(null, h), Math.max.apply(null, size[0]), Math.max.apply(null, size[1])];
}

function isColorMatchWithWhite(color) {
    if (color.typename === "RGBColor") {
        return color.red === 255 && color.green === 255 && color.blue === 255;
    } else if (color.typename === "CMYKColor") {
        return color.cyan === 0 && color.magenta === 0 && color.yellow === 0 && color.black === 0;
    } else if (color.typename === "GrayColor") {
        return color.gray === 100;
    }
    return false; // 不支持的颜色类型
}

/**
 * 标注颜色
 */
function markColor() {
    try {
        var doc = app.activeDocument;
        var sel = doc.selection;
        if (sel.length <= 0) {
            return alert("No items selected.");
        }

        // 凸起金属
        var raisedMetalColors = CFG.metalColors
            .filter(function (item) {
                return item.isRaised;
            })
            .map(function (color) {
                return "SpotColor(" + color.name + ")";
            });

        // 金属
        var metalColors = CFG.metalColors.map(function (color) {
            return "SpotColor(" + color.name + ")";
        });

        for (var i = 0; i < sel.length; i++) {
            var bounds = sel[i].geometricBounds;
            var colors = getSelectedColors(sel[i]);

            sel[i].selected = false;

            // colors 排序
            //      凸起金属---凹下金属---色号
            colors.sort(function (a, b) {
                if (metalColors.includes(a)) {
                    if (metalColors.includes(b)) {
                        if (raisedMetalColors.includes(a)) {
                            return -1;
                        } else if (raisedMetalColors.includes(b)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    return -1;
                } else {
                    return 1;
                }
            });

            var x = bounds[0],
                y = bounds[1],
                w = bounds[2] - bounds[0],
                h = bounds[1] - bounds[3];

            for (var j = 0; j < colors.length; j++) {
                var color = colors[j];
                drawColorBlockWithLabel(color, x, y - h - CFG.markColorGap - (CFG.markColorSize + 3) * j, CFG.markColorSize);
            }
        }

        function drawColorBlockWithLabel(color, left, top, size) {
            var doc = app.activeDocument;

            // 解析 color 字符串，生成对应的颜色对象
            var fillColor = null;
            var contents = color;
            if (/^RGB\(/.test(color)) {
                contents = "****";

                // 解析 RGB
                var rgb = color.match(/RGB\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
                if (rgb) {
                    var rgbColor = new RGBColor();
                    rgbColor.red = parseInt(rgb[1], 10);
                    rgbColor.green = parseInt(rgb[2], 10);
                    rgbColor.blue = parseInt(rgb[3], 10);
                    fillColor = rgbColor;

                    // 如果是白色
                    if (isColorMatchWithWhite(rgbColor)) {
                        contents = "White C";
                    }
                }
            } else if (/^CMYK\(/.test(color)) {
                contents = "****";

                // 解析 CMYK
                var cmyk = color.match(/CMYK\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
                if (cmyk) {
                    var cmykColor = new CMYKColor();
                    cmykColor.cyan = parseFloat(cmyk[1]);
                    cmykColor.magenta = parseFloat(cmyk[2]);
                    cmykColor.yellow = parseFloat(cmyk[3]);
                    cmykColor.black = parseFloat(cmyk[4]);
                    fillColor = cmykColor;

                    // 如果是白色
                    if (isColorMatchWithWhite(cmykColor)) {
                        contents = "White C";
                    }
                }
            } else if (/^Gray\(/.test(color)) {
                contents = "****";

                // 解析 Gray
                var gray = color.match(/Gray\(([\d.]+)\)/);
                if (gray) {
                    var grayColor = new GrayColor();
                    grayColor.gray = parseFloat(gray[1]);
                    fillColor = grayColor;
                }
            } else if (/^SpotColor\(/.test(color)) {
                contents = color.replace(/^SpotColor\((.+)\)/, "$1");
                // PANTONE 颜色处理
                contents = contents.replace("PANTONE ", "");
                // contents = color.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
                // 特殊处理套版色
                // 如果是套版色，替换为 "Black C"
                if (contents === "[套版色]") {
                    contents = "Black C";
                }

                // 解析 SpotColor
                var spot = color.match(/SpotColor\((.+)\)/);
                if (spot) {
                    try {
                        var spotColor = new SpotColor();
                        spotColor.spot = doc.spots.getByName(spot[1]);
                        fillColor = spotColor;
                    } catch (e) {
                        // SpotColor 不存在时，默认灰色
                        var fallback = new GrayColor();
                        fallback.gray = 50;
                        fillColor = fallback;
                    }
                }
            } else if (/^PatternColor\(/.test(color)) {
                contents = color.replace(/^PatternColor\((.+)\)/, "$1");

                // 解析 PatternColor
                var pattern = color.match(/PatternColor\((.+)\)/);
                if (pattern) {
                    try {
                        var patternColor = new PatternColor();
                        patternColor.pattern = doc.patterns.getByName(patternColor[1]);
                        fillColor = patternColor;
                    } catch (e) {
                        // SpotColor 不存在时，默认灰色
                        var fallback = new GrayColor();
                        fallback.gray = 50;
                        fillColor = fallback;
                    }
                }
            } else if (/^GradientColor\(/.test(color)) {
                contents = color.replace(/^GradientColor\((.+)\)/, "$1");

                // 解析 GradientColor
                var gradient = color.match(/GradientColor\((.+)\)/);
                if (gradient) {
                    try {
                        var gradientColor = new GradientColor();
                        gradientColor.gradient = doc.gradients.getByName(gradient[1]);
                        fillColor = gradientColor;
                    } catch (e) {
                        // SpotColor 不存在时，默认灰色
                        var fallback = new GrayColor();
                        fallback.gray = 50;
                        fillColor = fallback;
                    }
                }
            }

            // 绘制方块
            var rect = doc.pathItems.rectangle(top, left, size, size);
            rect.filled = true;
            rect.fillColor = fillColor || new GrayColor(); // 若解析失败则用灰色
            rect.stroked = true;
            rect.strokeColor = createRGBColor([0, 0, 0]);
            rect.strokeWidth = 0.5;

            // 绘制文字
            var label = doc.textFrames.add();
            try {
                label.textRange.characterAttributes.textFont = app.textFonts.getByName("ArialMT");
            } catch (error) {}
            label.textRange.characterAttributes.size = 8;

            label.contents = contents;
            label.left = left + size + 3; // 方块右侧留 3pt间距
            label.top = top; // 垂直居中微调

            var group = doc.groupItems.add();
            group.name = contents;
            rect.move(group, ElementPlacement.INSIDE);
            label.move(group, ElementPlacement.INSIDE);
            group.selected = true;
        }
    } catch (error) {
        alert("标注颜色出错了: " + error.message);
    }
}

/**
 * 对象排列
 */
function startAction() {
    try {
        var bounds = "visibleBounds";
        var items = app.selection;

        // 从上到下排序
        items.sort(function (a, b) {
            return a[bounds][1] < b[bounds][1];
        });

        var l = items.length;
        var __rows = 0;
        var gutter = {
            x: parseFloat(PD.valueGutterX.text),
            y: parseFloat(PD.valueGutterY.text),
        };
        var __posXValue = "左对齐";
        var __posYValue = "顶对齐";
        var columns = parseInt(PD.valueColumns.text);
        var bnds = selectionBounds(bounds);

        function __align(__pos, __bnds) {
            if (__pos === "水平居中") {
                return (bnds[5] - (__bnds[1] - __bnds[3])) / 2;
            } else if (__pos === "底对齐") {
                return bnds[5] - (__bnds[1] - __bnds[3]);
            } else if (__pos === "垂直居中") {
                return (bnds[4] - (__bnds[2] - __bnds[0])) / 2;
            } else if (__pos === "右对齐") {
                return bnds[4] - (__bnds[2] - __bnds[0]);
            } else {
                return 0;
            }
        }

        if (l > 1) {
            for (var i = (j = 0); i < l; i++, j++) {
                if (j === columns) {
                    __rows++;
                    j = 0;
                }
                items[i].left = bnds[0] + (bnds[4] + gutter.x) * j + __align(__posXValue, items[i][bounds]);
                items[i].top = bnds[1] - (bnds[5] + gutter.y) * __rows - __align(__posYValue, items[i][bounds]);
            }
        } else {
            isUndo = false;
        }
    } catch (error) {
        alert("对象排列出错了: " + error.message);
    }
}

/**
 * 识别颜色并导出PSD
 */
function analyzeColorsAndExportPSDNew() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            return alert("No items selected.");
        }

        // 1. 获取选区的颜色分组
        var colorGroups = UTILS.getSelectionColorGroups();

        if (Object.keys(colorGroups).length === 0) {
            return alert("没有识别出颜色");
        }

        // 获取选区的边界
        var sourceItem = items[0];
        var selectionBounds = sourceItem.geometricBounds;
        var selectionBoundsWidth = selectionBounds[2] - selectionBounds[0];
        var selectionBoundsHeight = selectionBounds[1] - selectionBounds[3];
        var doc = app.activeDocument;

        // 2.创建文件夹
        CFG.folderName++;
        var fileFolder = Folder.desktop + "/" + CFG.folderName + "/";
        if (!Folder(fileFolder).exists) {
            Folder(fileFolder).create();
        }

        // // 3. 隐藏所有颜色分组中的项
        // for (var colorName in colorGroups) {
        //     var group = colorGroups[colorName];
        //     for (var i = 0; i < group.length; i++) {
        //         var item = group[i];
        //         item.hidden = true; // 确保所有项都隐藏
        //     }
        // }

        // 4. 显示当前颜色并导出
        for (var colorName in colorGroups) {
            // 创建底层矩形（透明填充，无描边）
            var bgRect = doc.pathItems.rectangle(
                selectionBounds[1], // top
                selectionBounds[0], // left
                selectionBoundsWidth,
                selectionBoundsHeight,
            );
            bgRect.filled = true;
            var noColor = new NoColor();
            bgRect.fillColor = noColor;
            bgRect.stroked = false;
            bgRect.locked = false;
            bgRect.hidden = false;

            var group = colorGroups[colorName];
            // $.writeln("colorName: " + colorName);

            // 先隐藏所有 colorGroups 中的项
            for (var key in colorGroups) {
                var groupItems = colorGroups[key];
                for (var i = 0; i < groupItems.length; i++) {
                    groupItems[i].hidden = true; // 隐藏所有分组项
                }
            }

            // 显示当前颜色分组
            for (var i = 0; i < group.length; i++) {
                var item = group[i];
                item.hidden = false;
            }

            // 处理文件名
            var fileName = colorName
                .replace(/^SpotColor\(PANTONE (.+)\)/, "$1")
                .replace(/^SpotColor\((.+)\)/, "$1")
                .replace(/^RGB\((.+)\)/, "$1")
                .replace(/^CMYK\((.+)\)/, "$1")
                .replace(/^Gray\((.+)\)/, "$1")
                .replace(/[,]/g, "_");

            exportToPSD(fileFolder + fileName + ".psd");

            // 恢复所有项的显示状态
            app.undo();
            app.redraw();
        }

        alert("导出完成");
    } catch (error) {
        alert("识别颜色并导出PSD出错了: " + error.message);
    }
}

/**
 * 颜色分层
 */
function colorLayer() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            return alert("No items selected.");
        }

        if (items.length > 1) {
            return alert("Please select only one item.");
        }

        var outlineColor = new RGBColor();
        outlineColor.red = 217; // 红色分量
        outlineColor.green = 0; // 绿色分量
        outlineColor.blue = 133; // 蓝色分量

        // 操作对象
        var sourceItem = items[0];

        // 创建轮廓对象
        var outlineGroup = copyGroupFillColor(sourceItem, outlineColor);

        // 获取选区的颜色分组
        var colorGroups = UTILS.getSelectionColorGroups();

        if (Object.keys(colorGroups).length === 0) {
            return alert("No color groups found in the selection.");
        }

        // 获取选区的边界
        var selectionBounds = sourceItem.geometricBounds;
        var selectionBoundsWidth = selectionBounds[2] - selectionBounds[0];
        var selectionBoundsHeight = selectionBounds[1] - selectionBounds[3];

        // 创建颜色分组
        var index = 0;
        for (var colorKey in colorGroups) {
            var group = colorGroups[colorKey];

            // 创建新组
            var newGroup = app.activeDocument.groupItems.add();
            newGroup.name = "Color_Group_" + (index + 1);

            // 复制轮廓对象并加入新组
            var outlineItem = outlineGroup.duplicate(newGroup);

            // 将相同颜色的对象移动到新组中
            for (var i = 0; i < group.length; i++) {
                var item = group[i];
                item.duplicate(newGroup);
            }

            // 设置新组的位置
            newGroup.translate(index * (selectionBoundsWidth + 40), -selectionBoundsHeight - 40);
            newGroup.selected = false;

            index++;
        }

        // 删除 outlineGroup
        outlineGroup.remove();

        /**
         * 复制对象并填色
         */
        function copyGroupFillColor(group, color) {
            var duplicateGroup = group.duplicate();

            UTILS.setColor(duplicateGroup, color);

            app.activeDocument.selection = duplicateGroup;

            app.executeMenuCommand("group");
            app.executeMenuCommand("Live Pathfinder Merge");
            app.executeMenuCommand("expandStyle");
            app.executeMenuCommand("ungroup");
            app.executeMenuCommand("group");

            // 操作完成之后，重新赋值给 duplicateGroup
            duplicateGroup = app.activeDocument.selection[0];

            app.activeDocument.selection = group;

            return duplicateGroup;
        }
    } catch (error) {
        alert("颜色分层错误: " + error.message);
    }
}

/**
 * 标注刺绣
 */
function markEmbroidery() {
    try {
        var f = new Folder(CFG.embroideredFolder);
        if (!f.exists) {
            return alert("刺绣色号文件夹不存在: " + CFG.embroideredFolder);
        }

        var items = app.activeDocument.selection;
        if (items.length === 0) {
            alert("No items selected.");
            return;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var bounds = item.geometricBounds;
            var x = bounds[0],
                y = bounds[1],
                w = bounds[2] - bounds[0],
                h = bounds[1] - bounds[3];
            var left = x + w + 10,
                top = y;

            var fillColor = getFillColor(item);
            $.writeln("Fill Color: " + fillColor);
            if (fillColor) {
                placeImage(fillColor, left, top, h);
            }
        }

        function getFillColor(item) {
            if (!item.filled || !item.fillColor) return null;
            var color = item.fillColor;
            switch (color.typename) {
                case "RGBColor":
                    return Math.round(color.red) + "-" + Math.round(color.green) + "-" + Math.round(color.blue);
                case "CMYKColor":
                    return color.cyan + "-" + color.magenta + "-" + color.yellow + "-" + color.black;
                case "GrayColor":
                    return color.gray;
                case "SpotColor":
                    return color.spot.name;
                default:
                    return null;
            }
        }

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
        alert("标注刺绣出错了: " + error.message);
    }
}
