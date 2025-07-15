var CFG = {
    // 凸起的金色颜色集合
    metalColors: [
        [88, 97, 104],
        [222, 203, 144],
        [253, 233, 156],
        [176, 174, 132],
        [211, 211, 211],
        [178, 178, 178],
        [170, 88, 61],
        [44, 45, 45],
        [212, 154, 100],
        [242, 192, 179],
        [205, 194, 118],
    ],
};

function isColorMatch(color1, color2) {
    if (color1.typename !== color2.typename) return false;
    if (color1.typename === "CMYKColor") {
        return color1.cyan === color2.cyan && color1.magenta === color2.magenta && color1.yellow === color2.yellow && color1.black === color2.black;
    } else if (color1.typename === "RGBColor") {
        return color1.red === color2.red && color1.green === color2.green && color1.blue === color2.blue;
    } else if (color1.typename === "GrayColor") {
        return color1.gray === color2.gray;
    }
    return false; // 不支持的颜色类型
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
        } else if (item.typename === "CompoundPathItem" && item.pathItems[0].fillColor) {
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
        var metalColors = getMetalColors();
        if (metalColors.length <= 0) {
            return alert("没有匹配的金属颜色");
        }

        if (metalColors.length >= 2) {
            return alert("金属颜色超过1种");
        }

        // 金属颜色
        var METALCOLOR = new RGBColor();
        METALCOLOR.red = metalColors[0][0];
        METALCOLOR.green = metalColors[0][1];
        METALCOLOR.blue = metalColors[0][2];

        var items = app.activeDocument.pathItems;

        var strokeWidth = 0.5;

        for (var i = 0; i < items.length; i++) {
            // items[i].fillColor = color;
            var item = items[i];
            // 检查是否为有效的路径对象
            if (item.typename !== "PathItem") continue;
            if (item.filled && isColorMatch(item.fillColor, METALCOLOR)) {
                $.writeln("发现匹配的颜色项：" + item.typename);

                // 先设置描边颜色和宽度
                item.strokeColor = METALCOLOR;
                item.strokeWidth = new UnitValue(strokeWidth, "mm").as("pt"); // 明确指定单位

                // 然后启用描边
                item.stroked = true;

                // 最后设置描边样式
                item.strokeCap = StrokeCap.ROUNDENDCAP;
                item.strokeJoin = StrokeJoin.ROUNDENDJOIN;

                // 置于顶层
                item.zOrder(ZOrderMethod.BRINGTOFRONT);

                $.writeln("已设置描边: " + item.stroked + ", 宽度: " + item.strokeWidth);
            }
        }
    } catch (error) {
        alert("出错了: " + error.message);
    }
}

metalEdging();
