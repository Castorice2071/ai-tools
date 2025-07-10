/**
 * 标注颜色与排列
 * Author: liwei
 * 
 * Release notes:
 * 0.0.1    Initial version
 */

//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

var bit = 64; // AI软件系统位数，默认64位，如果点击按钮没有反应，可以将64改为32。
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

var SCRIPT = {
    name: "标注颜色与排列",
    version: "v0.0.1",
};

var CFG = {
    gap: 20, // 对象与颜色块之间的间距
    size: 10, // 颜色块的大小
};

var SETTINGS = {
    name: SCRIPT.name + "_data.json",
    folder: Folder.myDocuments + "/Adobe Scripts/",
};

var win = new Window("palette", SCRIPT.name + " " + SCRIPT.version);
win.orientation = "column";
win.alignChildren = ["fill", "fill"];

var panel = win.add("panel", undefined, "参数设置");
panel.orientation = "column";
panel.alignChildren = "fill";
panel.margins = 20;
var groupColumns = panel.add("group");
groupColumns.orientation = "row";
var captionColumns = groupColumns.add("statictext", undefined, "列数:");
win.valueColumns = groupColumns.add("edittext", undefined, 2);
win.valueColumns.preferredSize = [100, -1];

var groupGutter = panel.add("group");
groupGutter.orientation = "row";
groupGutter.alignChildren = ["fill", "fill"];

var groupGutterX = groupGutter.add("group");
groupGutterX.orientation = "row";
var captionGutterX = groupGutterX.add("statictext", undefined, "水平间距");
win.valueGutterX = groupGutterX.add("edittext", undefined, 10);
win.valueGutterX.preferredSize = [50, -1];

var groupGutterY = groupGutter.add("group");
groupGutterY.orientation = "row";
var captionGutterY = groupGutterY.add("statictext", undefined, "垂直间距");
win.valueGutterY = groupGutterY.add("edittext", undefined, 4);
win.valueGutterY.preferredSize = [50, -1];

var winButtons = win.add("group");
winButtons.orientation = "row";
winButtons.alignChildren = ["center", "center"];
winButtons.margins = 0;

win.colorBtn = winButtons.add("button", undefined, "标注颜色");
win.okBtn = winButtons.add("button", undefined, "确定", { name: "ok" });

win.colorBtn.onClick = function () {
    buildMsg("markColor();");
};
win.okBtn.onClick = function () {
    buildMsg("startAction();");
};

function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.send();
    } catch (e) {
        alert(e);
    }
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

function selectionBounds(bounds) {
    bounds = typeof bounds === "string" && bounds.length && bounds.slice(0, 1) === "v" ? "visibleBounds" : "geometricBounds";
    var arr = app.selection;
    var x = [];
    var y = [];
    var w = [];
    var h = [];
    var size = [[], []];
    var i = arr.length;
    while (i--) {
        x.push(arr[i][bounds][0]);
        y.push(arr[i][bounds][1]);
        w.push(arr[i][bounds][2]);
        h.push(arr[i][bounds][3]);
        size[0].push(arr[i][bounds][2] - arr[i][bounds][0]);
        size[1].push(arr[i][bounds][1] - arr[i][bounds][3]);
    }
    return [Math.min.apply(null, x), Math.max.apply(null, y), Math.max.apply(null, w), Math.min.apply(null, h), Math.max.apply(null, size[0]), Math.max.apply(null, size[1])];
}

/**
 * 标注颜色
 */
function markColor() {
    var doc = app.activeDocument;
    var sel = doc.selection;
    if (sel.length <= 0) {
        return alert("请先选择标注对象！");
    }

    for (var i = 0; i < sel.length; i++) {
        var bounds = sel[i].geometricBounds;
        var colors = getSelectedColors(sel[i]);
        sel[i].selected = false

        var x = bounds[0],
            y = bounds[1],
            w = bounds[2] - bounds[0],
            h = bounds[1] - bounds[3];
        
        for (var j = 0; j < colors.length; j++) {
            var color = colors[j];
            drawColorBlockWithLabel(color, x, y - h - CFG.gap - (CFG.size + 10) * j, CFG.size);
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

    function drawColorBlockWithLabel(color, left, top, size) {
        var doc = app.activeDocument;

        // 解析 color 字符串，生成对应的颜色对象
        var fillColor = null;
        var contents = color;
        if (/^RGB\(/.test(color)) {
            contents = "****";

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
            contents = "****";

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
            contents = "****";

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
        group.selected = true;
    }
}

/**
 * 对象排列
 */
function startAction() {
    var bounds = "visibleBounds";
    var items = app.selection;

    var l = items.length;
    var __rows = 0;
    var gutter = {
        x: parseFloat(win.valueGutterX.text),
        y: parseFloat(win.valueGutterY.text),
    };
    var __posXValue = "左对齐";
    var __posYValue = "顶对齐";
    var columns = parseInt(win.valueColumns.text);
    var bnds = selectionBounds(bounds);

    function __align(__pos, __bnds) {
        if (__pos === "水平居中") {
            return (bnds[5] - (__bnds[1] - __bnds[3])) / 2;
        } else if (__pos === "底对齐") {
            return bnds[5] - (__bnds[1] - __bnds[3]);
        } else if (__pos === "垂直居中") {
            return (bnds[4] - (__bnds[2] - __bnds[0])) / 2;
        } else if (__pos === "右对齐") {
            return bnds[4] - (__bnds[2] - __bnds[0]);
        } else {
            return 0;
        }
    }

    if (l > 1) {
        for (var i = (j = 0); i < l; i++, j++) {
            if (j === columns) {
                __rows++;
                j = 0;
            }
            items[i].left = bnds[0] + (bnds[4] + gutter.x) * j + __align(__posXValue, items[i][bounds]);
            items[i].top = bnds[1] - (bnds[5] + gutter.y) * __rows - __align(__posYValue, items[i][bounds]);
        }
    } else {
        isUndo = false;
    }
}

win.show();
