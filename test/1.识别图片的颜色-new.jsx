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

// 从光栅图像中提取颜色信息（使用Illustrator支持的方法）
function extractColorsFromRaster(raster) {
    var result = [];

    try {
        // 创建临时文档
        var tempDoc = app.documents.add(DocumentColorSpace.RGB, raster.width, raster.height);

        // 复制图像到临时文档
        var tempRaster = raster.duplicate(tempDoc, ElementPlacement.PLACEATBEGINNING);
        tempRaster.position = [0, tempDoc.height];

        // 执行描摹
        var pItem = tempRaster.trace();

        // 扩展描摹结果
        pItem.tracing.expandTracing();

        result = UTILS.getAllColorsByDoc(tempDoc);

        // 关闭临时文档
        tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    } catch (e) {
        alert("提取颜色时出错: " + e.message + "\n行号: " + e.line);
    }

    return result;
}

function main() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            return alert("No items selected.");
        }

        var image = items[0];

        var colors = extractColorsFromRaster(image);

        $.writeln("提取到的颜色: " + colors.join(", "));

        // $.writeln("Selected item: " + image.name + ", Type: " + image.typename);

        // // 创建一个临时文档用于分析
        // var tempDoc = app.documents.add(DocumentColorSpace.RGB, image.width, image.height);

        // // 将选中的图像复制到临时文档
        // var duplicatedItem = image.duplicate(tempDoc, ElementPlacement.PLACEATBEGINNING);
        // duplicatedItem.position = [0, 0];

        // var pItem = image.trace();
        // pItem.tracing.expandTracing();
    } catch (error) {
        alert("脚本初始化错误: " + error.message + "\n行号: " + error.line);
    }
}

main();
