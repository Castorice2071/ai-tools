//@target illustrator

/**
 * 通用输出方法，根据数据类型选择不同的输出逻辑
 * @param {*} data
 */
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
        } else if (color.typename === "SpotColor") {
            return "SpotColor(" + color.spot.name + ")";
        } else {
            return color.typename;
        }
    }

    $.writeln("doc.pageItems.length: " + doc.pageItems.length);

    // var item = doc.pageItems[2];
    // item.selected = true; // 选中第一个元素，避免某些情况下无法获取颜色

    // $.writeln("0 " + item.filled + " " + item.fillColor + " " + item.fillColor.typename + " " + item.fillColor.spot.name);

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
    output(colors);
}
