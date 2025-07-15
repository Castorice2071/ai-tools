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

var doc = app.activeDocument;

var item = doc.pageItems.getByName("zzz");

var colors = getSelectedColors(item);

$.writeln("item: " + item);
$.writeln("item.pathItems: " + item.pathItems);
$.writeln("colors.length: " + colors.length);
$.writeln("colors: " + colors);
