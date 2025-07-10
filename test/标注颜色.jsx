/**
 *
 */

//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

function main() {
    var SCRIPT = {
        name: "分析颜色并标注",
        version: "v0.0.1",
    };

    var CFG = {
        gap: 20, // 对象与颜色块之间的间距
        size: 10, // 颜色块的大小
    };

    var doc = app.activeDocument;
    var sel = doc.selection;
    if (sel.length <= 0) {
        return alert("请先选择一个对象。");
    }

    // var colors = getSelectedColors(sel[0]);
    // if (colors.length === 0) {
    //     return alert("未检测到任何颜色。");
    // }

    for (var i = 0; i < sel.length; i++) {
        var bounds = sel[i].geometricBounds;
        var colors = getSelectedColors(sel[i]);
        var x = bounds[0],
            y = bounds[1],
            w = bounds[2] - bounds[0],
            h = bounds[1] - bounds[3];

        for (var j = 0; j < colors.length; j++) {
            var color = colors[j];
            drawColorBlockWithLabel(color, x, y - h - CFG.gap - (CFG.size + 10) * j, CFG.size);
        }
    }
}

function getSelectedColors(the_obj) {
    var colors = [];

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else {
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

                // // 只要专色
                // if (color.typename === "SpotColor") {
                //     colors.push("SpotColor(" + color.spot.name + ")");
                // }
            }
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

function getAllColors(doc) {
    var colors = [];
    for (var i = 0; i < doc.pageItems.length; i++) {
        var item = doc.pageItems[i];
        if (item.filled && item.fillColor.typename === "RGBColor") {
            var color = item.fillColor;
            colors.push("RGB(" + color.red + ", " + color.green + ", " + color.blue + ")");
        } else if (item.filled && item.fillColor.typename === "CMYKColor") {
            var color = item.fillColor;
            colors.push("CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")");
        } else if (item.filled && item.fillColor.typename === "GrayColor") {
            var color = item.fillColor;
            colors.push("Gray(" + color.gray + ")");
        } else if (item.filled && item.fillColor.typename === "SpotColor") {
            var color = item.fillColor;
            colors.push("SpotColor(" + color.spot.name + ")");
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

function drawColorBlockWithLabel(color, left, top, size) {
    var doc = app.activeDocument;

    // 解析 color 字符串，生成对应的颜色对象
    var fillColor = null;
    var contents = color;
    if (/^RGB\(/.test(color)) {
        // 解析 RGB
        var rgb = color.match(/RGB\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgb) {
            var rgbColor = new RGBColor();
            rgbColor.red = parseInt(rgb[1], 10);
            rgbColor.green = parseInt(rgb[2], 10);
            rgbColor.blue = parseInt(rgb[3], 10);
            fillColor = rgbColor;
        }
    } else if (/^CMYK\(/.test(color)) {
        // 解析 CMYK
        var cmyk = color.match(/CMYK\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
        if (cmyk) {
            var cmykColor = new CMYKColor();
            cmykColor.cyan = parseFloat(cmyk[1]);
            cmykColor.magenta = parseFloat(cmyk[2]);
            cmykColor.yellow = parseFloat(cmyk[3]);
            cmykColor.black = parseFloat(cmyk[4]);
            fillColor = cmykColor;
        }
    } else if (/^Gray\(/.test(color)) {
        // 解析 Gray
        var gray = color.match(/Gray\(([\d.]+)\)/);
        if (gray) {
            var grayColor = new GrayColor();
            grayColor.gray = parseFloat(gray[1]);
            fillColor = grayColor;
        }
    } else if (/^SpotColor\(/.test(color)) {
        contents = color.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");

        // 解析 SpotColor
        var spot = color.match(/SpotColor\((.+)\)/);
        if (spot) {
            try {
                var spotColor = new SpotColor();
                spotColor.spot = doc.spots.getByName(spot[1]);
                fillColor = spotColor;
            } catch (e) {
                // SpotColor 不存在时，默认灰色
                var fallback = new GrayColor();
                fallback.gray = 50;
                fillColor = fallback;
            }
        }
    }

    // 绘制方块
    var rect = doc.pathItems.rectangle(top, left, size, size);
    rect.filled = true;
    rect.fillColor = fillColor || new GrayColor(); // 若解析失败则用灰色
    rect.stroked = true;
    rect.strokeColor = createRGBColor([0, 0, 0]);
    rect.strokeWidth = 0.5;

    // 绘制文字
    var label = doc.textFrames.add();
    try {
        textInfo.textRange.characterAttributes.textFont = app.textFonts.getByName("ArialMT");
    } catch (error) {}
    label.textRange.characterAttributes.size = 8;

    label.contents = contents;
    label.left = left + size + 3; // 方块右侧留 3pt间距
    label.top = top; // 垂直居中微调

    var group = doc.groupItems.add();
    group.name = contents;
    rect.move(group, ElementPlacement.INSIDE);
    label.move(group, ElementPlacement.INSIDE);
}

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

function createRGBColor(rgb) {
    var color = new RGBColor();
    color.red = rgb[0];
    color.green = rgb[1];
    color.blue = rgb[2];
    return color;
}

try {
    main();
} catch (error) {
    $.writeln("Error: " + (error && error.message ? error.message : error));
    alert(error && error.message ? error.message : error);
}
