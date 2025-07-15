function getSelectedColors(the_obj) {
    var colors = [];

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem") {
            // 处理复合路径中的每个路径项
            for (var i = 0; i < item.pathItems.length; i++) {
                var pathItem = item.pathItems[i];
                if (pathItem.filled && pathItem.fillColor) {
                    addColor(pathItem.fillColor);
                }
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
        $.writeln("collectColors item.typename: " + item.typename);
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem") {
            // 处理复合路径中的每个路径项
            for (var i = 0; i < item.pathItems.length; i++) {
                var pathItem = item.pathItems[i];
                if (pathItem.filled && pathItem.fillColor) {
                    addColor(pathItem.fillColor);
                }
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
 * 隐藏非此颜色的项
 */
function hiddenPathByColor(colorStr) {
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
}

var doc = app.activeDocument;

var item = doc.pageItems.getByName("我的天");

// var colors = getSelectedColors(item);
// var colors = getAllColors();

// $.writeln("item: " + item);
// $.writeln("item.pathItems: " + item.pathItems);
// $.writeln("colors.length: " + colors.length);
// $.writeln("colors: " + colors);

hiddenPathByColor("RGB(253, 233, 156)")

// app.undo();