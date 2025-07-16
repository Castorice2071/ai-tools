/**
 * 获取对象的颜色键值
 * @param {Object} item - 图形对象
 * @returns {string} 颜色键值
 */
function getColorKey(item) {
    function processColor(color) {
        if (!color) return null;

        switch (color.typename) {
            case "RGBColor":
                return "RGB(" + color.red + "," + color.green + "," + color.blue + ")";
            case "CMYKColor":
                return "CMYK(" + color.cyan + "," + color.magenta + "," + color.yellow + "," + color.black + ")";
            case "SpotColor":
                return "SpotColor(" + color.spot.name + ")";
            case "GrayColor":
                return "Gray(" + color.gray + ")";
            default:
                return null;
        }
    }

    // 处理不同类型的对象
    if (item.typename === "PathItem") {
        return item.filled ? processColor(item.fillColor) : null;
    } else if (item.typename === "CompoundPathItem" && item.pathItems.length > 0) {
        return item.pathItems[0].filled ? processColor(item.pathItems[0].fillColor) : null;
    } else if (item.typename === "GroupItem") {
        // 对于组，返回第一个有填充色的子对象的颜色
        for (var i = 0; i < item.pageItems.length; i++) {
            var colorKey = getColorKey(item.pageItems[i]);
            if (colorKey) return colorKey;
        }
    }

    return null;
}

/**
 * 获取选中元素的颜色并分组
 */
function getColorGroups() {
    var items = app.activeDocument.selection;

    if (items.length === 0) {
        alert("No items selected.");
        return null;
    }

    var colorGroups = {};
    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var colorKey = getColorKey(item);
        if (!colorKey) continue;

        // 将对象按颜色分组
        if (!colorGroups[colorKey]) {
            colorGroups[colorKey] = [];
        }
        colorGroups[colorKey].push(item);
    }

    return colorGroups;
}

var a1 = getColorGroups();
// AI 中没有 JSON.stringify，可以使用自定义方法输出分组信息
if (a1) {
    for (var color in a1) {
        $.writeln("Color: " + color);
        $.writeln("Items count: " + a1[color].length);
    }
}
