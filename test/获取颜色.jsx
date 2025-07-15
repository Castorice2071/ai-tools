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
        $.writeln("collectColors item.name: " + item.name);
        $.writeln("collectColors item.typename: " + item.typename);
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else {
            $.writeln("collectColors item.filled: " + item.filled);
            $.writeln("collectColors item.fillColor: " + item.fillColor);
            $.writeln("collectColors item.fillColor.typename: " + item.fillColor.typename);
            // 处理填充颜色
            if (item.filled && item.fillColor) {
                var color = item.fillColor;
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

var colors = getAllColors();
$.writeln(colors.length);
