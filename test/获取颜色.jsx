function getAllColors() {
    var doc = app.activeDocument;
    var colors = [];

    function processLayer(layerOrGroupItem) {
        // 如果图层被锁定或隐藏，跳过
        if (layerOrGroupItem.locked || !layerOrGroupItem.visible) return;

        // 遍历 layerOrGroupItem 的子元素
        for (var i = layerOrGroupItem.pageItems.length - 1; i >= 0; i--) {
            var item = layerOrGroupItem.pageItems[i];

            // 打印/处理当前对象
            $.writeln(indent + item.typename + ' : ' + item.name);

            // 如果当前对象是 Group 或者 Layer，继续递归
            if (item.typename === 'GroupItem' || item.typename === 'Layer') {
                processLayer(item);
            } else {
                collectColors(item);
            }
        }

        // // 处理当前图层中的所有项目
        // for (var i = 0; i < layer.pageItems.length; i++) {
        //     collectColors(layer.pageItems[i]);
        // }

        // // 递归处理子图层
        // for (var j = 0; j < layer.layers.length; j++) {
        //     processLayer(layer.layers[j]);
        // }
    }

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else {
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
