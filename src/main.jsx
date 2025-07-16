//@include "./utils.jsx"

analyzeColorsAndExportPSD();

function analyzeColorsAndExportPSD() {
    var colors = getSelectionColors();

    // 获取当前文档
    var doc = app.activeDocument;
    // 获取所有路径项
    var pathItems = doc.pathItems;

    $.writeln("colors.length: " + colors.length);
    $.writeln("colors: " + colors.join(", "));

    // 遍历所有颜色
    for (var i = 0; i < colors.length; i++) {
        $.writeln("Processing color: " + colors[i]);
        var colorStr = colors[i];

        // 创建新组
        var newGroup = app.activeDocument.groupItems.add();
        newGroup.name = "Color_Group_" + (i + 1);

        $.writeln("pathItems.length: " + pathItems.length);
        var length = pathItems.length

        // 遍历选择中的所有路径项
        for (var j = 0; j < length; j++) {
            var item = pathItems[j];
            // 跳过新建组中的项，避免死循环
            if (item.parent && item.parent.name && item.parent.name.indexOf("Color_Group_") === 0) {
                continue;
            }
            if (item.filled && item.fillColor) {
                var itemColorStr = "";
                var color = item.fillColor;

                if (color.typename === "RGBColor") {
                    itemColorStr = "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
                } else if (color.typename === "CMYKColor") {
                    itemColorStr = "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
                } else if (color.typename === "GrayColor") {
                    itemColorStr = "Gray(" + color.gray + ")";
                } else if (color.typename === "SpotColor") {
                    itemColorStr = "SpotColor(" + color.spot.name + ")";
                }

                // 如果颜色匹配，则复制到新组
                if (itemColorStr === colorStr) {
                    $.writeln("Duplicating item: " + item.name + " with color: " + itemColorStr);
                    var duplicate = item.duplicate(newGroup);
                }
            }
        }
    }
}
