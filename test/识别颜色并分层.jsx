function getAllColors() {
    var doc = app.activeDocument;
    var colors = [];

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
                    colors.push(
                        "RGB(" +
                            color.red +
                            ", " +
                            color.green +
                            ", " +
                            color.blue +
                            ")",
                    );
                } else if (color.typename === "CMYKColor") {
                    colors.push(
                        "CMYK(" +
                            color.cyan +
                            ", " +
                            color.magenta +
                            ", " +
                            color.yellow +
                            ", " +
                            color.black +
                            ")",
                    );
                } else if (color.typename === "GrayColor") {
                    colors.push("Gray(" + color.gray + ")");
                } else if (color.typename === "SpotColor") {
                    colors.push("SpotColor(" + color.spot.name + ")");
                }
            }
        }
    }

    // 遍历所有页面项目
    if (doc && doc.pageItems.length > 0) {
        for (var i = 0; i < doc.pageItems.length; i++) {
            $.bp();
            // 如果隐藏了，就不收集颜色
            if (!doc.pageItems[i].hidden) {
                collectColors(doc.pageItems[i]);
            }
        }
    }

    // 用对象实现去重
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

var items = app.activeDocument.pathItems;

var colors = getAllColors();

$.writeln(colors.length);
