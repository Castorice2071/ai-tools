//@target illustrator

function getAllColors() {
    var doc = app.activeDocument;
    var colorList = [];
    var colorMap = {};

    function colorToString(color) {
        if (color.typename === "RGBColor") {
            return "RGB(" + color.red + "," + color.green + "," + color.blue + ")";
        } else if (color.typename === "CMYKColor") {
            return "CMYK(" + color.cyan + "," + color.magenta + "," + color.yellow + "," + color.black + ")";
        } else if (color.typename === "GrayColor") {
            return "Gray(" + color.gray + ")";
        } else {
            return color.typename;
        }
    }

    for (var i = 0; i < doc.pageItems.length; i++) {
        var item = doc.pageItems[i];
        // 填充色
        if (item.filled && item.fillColor && item.fillColor.typename !== "NoColor") {
            var fillStr = colorToString(item.fillColor);
            if (!colorMap[fillStr]) {
                colorList.push(fillStr);
                colorMap[fillStr] = true;
            }
        }
        // 描边色
        if (item.stroked && item.strokeColor && item.strokeColor.typename !== "NoColor") {
            var strokeStr = colorToString(item.strokeColor);
            if (!colorMap[strokeStr]) {
                colorList.push(strokeStr);
                colorMap[strokeStr] = true;
            }
        }
    }

    return colorList;
}

var colors = getAllColors();
if (colors.length === 0) {
    alert("未检测到任何颜色。");
} else {
    alert("图稿中所有颜色值：\n" + colors.join("\n"));
}
