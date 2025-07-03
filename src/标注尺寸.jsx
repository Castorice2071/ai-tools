//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

function main() {
    var SCRIPT = {
        name: "标注尺寸",
        version: "v0.0.5",
    };
    var CFG = {
        rgb: [0, 0, 0],
        cmyk: [0, 0, 0, 100],
        color: getColor(255, 0, 0),
        lineWidth: 0.5, // 标注线宽度
        gap: 3, // 标注线与标注对象的间距
    };
    var SETTINGS = {
        name: SCRIPT.name + "_data.json",
        folder: Folder.myDocuments + "/Adobe Scripts/",
    };

    // GLOBAL VARIABLES
    var doc = app.activeDocument;
    var sel = doc.selection;
    var color = createColor(CFG);

    var win = buildUI(SCRIPT);

    loadSettings(SETTINGS);

    win.okButton.onClick = function () {
        try {
            saveSettings(SETTINGS);
            if (!sel || sel.length <= 0) {
                throw new Error("请先选择标注对象！");
            }

            // 获取标注边的选择状态
            var top = win.topCheck.value;
            var left = win.leftCheck.value;
            var right = win.rightCheck.value;
            var bottom = win.bottomCheck.value;

            if (!(top || left || right || bottom)) {
                throw new Error("请至少选择一个标注边。");
            }

            var bounds = sel[0].geometricBounds;
            var x = bounds[0];
            var y = bounds[1];
            var w = bounds[2] - bounds[0];
            var h = bounds[1] - bounds[3];

            for (var key in CFG) {
                if (CFG.hasOwnProperty(key)) {
                    $.writeln(key + ": " + CFG[key]);
                }
            }

            if (top) {
                drawLine(
                    [
                        [x, y + CFG.gap],
                        [x + w, y + CFG.gap],
                    ],
                    CFG.lineWidth,
                    color,
                );
            }

            if (left) {
                drawLine(
                    [
                        [x - CFG.gap, y],
                        [x - CFG.gap, y - h],
                    ],
                    CFG.lineWidth,
                    color,
                );
            }

            if (right) {
                drawLine(
                    [
                        [x + w + CFG.gap, y],
                        [x + w + CFG.gap, y - h],
                    ],
                    CFG.lineWidth,
                    color,
                );
            }

            if (bottom) {
                drawLine(
                    [
                        [x, y - h - CFG.gap],
                        [x + w, y - h - CFG.gap],
                    ],
                    CFG.lineWidth,
                    color,
                );
            }

            app.redraw(); // 刷新画布
        } catch (e) {
            alert(e.message);
        }
    };

    win.cancelButton.onClick = function () {
        win.close();
    };

    win.show();

    /**
     * Save UI options to a file
     * @param {object} prefs - Object containing preferences
     */
    function saveSettings(prefs) {
        if (!Folder(prefs.folder).exists) {
            Folder(prefs.folder).create();
        }

        var f = new File(prefs.folder + prefs.name);
        f.encoding = "UTF-8";
        f.open("w");

        var data = {};
        data.win_x = win.location.x;
        data.win_y = win.location.y;
        data.fontSize = win.fontSize.text;
        data.unit = win.unit.selection.index;
        data.topCheck = win.topCheck.value;
        data.rightCheck = win.rightCheck.value;
        data.bottomCheck = win.bottomCheck.value;
        data.leftCheck = win.leftCheck.value;
        data.gap = CFG.gap = parseFloat(win.gap.text);
        data.lineWidth = CFG.lineWidth = parseFloat(win.lineWidth.text);

        f.write(stringify(data));
        f.close();
    }

    /**
     * Load options from a file
     * @param {object} prefs - Object containing preferences
     */
    function loadSettings(prefs) {
        var f = File(prefs.folder + prefs.name);
        if (!f.exists) return;

        try {
            f.encoding = "UTF-8";
            f.open("r");
            var json = f.readln();
            try {
                var data = new Function("return (" + json + ")")();
            } catch (err) {
                return;
            }
            f.close();

            if (typeof data != "undefined") {
                win.location = [data.win_x ? parseInt(data.win_x) : 100, data.win_y ? parseInt(data.win_y) : 100];
                win.fontSize.text = data.fontSize;
                win.unit.selection = data.unit;
                win.topCheck.value = data.topCheck === "true";
                win.rightCheck.value = data.rightCheck === "true";
                win.bottomCheck.value = data.bottomCheck === "true";
                win.leftCheck.value = data.leftCheck === "true";
                win.gap.text = data.gap ? data.gap : CFG.gap;
                win.lineWidth.text = data.lineWidth ? data.lineWidth : CFG.lineWidth;
            }
        } catch (err) {
            return;
        }
    }
}

function getColor(red, green, blue) {
    var color = new RGBColor();
    color.red = red;
    color.green = green;
    color.blue = blue;
    return color;
}

function createColor(CFG) {
    var color;
    if (/rgb/i.test(app.activeDocument.documentColorSpace)) {
        color = new RGBColor();
        color.red = CFG.rgb[0];
        color.green = CFG.rgb[1];
        color.blue = CFG.rgb[2];
    } else {
        color = new CMYKColor();
        color.cyan = CFG.cmyk[0];
        color.magenta = CFG.cmyk[1];
        color.yellow = CFG.cmyk[2];
        color.black = CFG.cmyk[3];
    }
    return color;
}

function buildUI(SCRIPT) {
    var win = new Window("dialog", SCRIPT.name + " " + SCRIPT.version);
    win.orientation = "column";
    win.alignChildren = ["fill", "fill"];

    // 标注边
    var sidePanel = win.add("panel", undefined, "选择标注边");
    sidePanel.orientation = "row";
    sidePanel.spacing = 16;
    win.topCheck = sidePanel.add("checkbox", undefined, "上边");
    win.rightCheck = sidePanel.add("checkbox", undefined, "右边");
    win.bottomCheck = sidePanel.add("checkbox", undefined, "下边");
    win.leftCheck = sidePanel.add("checkbox", undefined, "左边");

    // 设置选项面板
    var optionPanel = win.add("panel", undefined, "设置选项");
    optionPanel.orientation = "row";
    optionPanel.alignChildren = ["fill", "top"];

    // 左列
    var col1 = optionPanel.add("group");
    col1.orientation = "column";
    col1.alignChildren = ["left", "center"];

    var unitGroup = col1.add("group");
    unitGroup.add("statictext", undefined, "选择单位:");
    win.unit = unitGroup.add("dropdownlist", undefined, ["px", "mm", "cm", "in"]);
    win.unit.selection = 0;
    win.unit.preferredSize = [80, -1];

    var fontSizeGroup = col1.add("group");
    fontSizeGroup.add("statictext", undefined, "字号大小:");
    win.fontSize = fontSizeGroup.add("edittext", undefined, "12");
    win.fontSize.preferredSize = [80, -1];

    // 右列
    var col2 = optionPanel.add("group");
    col2.orientation = "column";
    col2.alignChildren = ["left", "center"];

    var lineWidthGroup = col2.add("group");
    lineWidthGroup.add("statictext", undefined, "标线宽度:");
    win.lineWidth = lineWidthGroup.add("edittext", undefined, "0.5");
    win.lineWidth.preferredSize = [80, -1];

    var gapGroup = col2.add("group");
    gapGroup.add("statictext", undefined, "标线间距:");
    win.gap = gapGroup.add("edittext", undefined, "3");
    win.gap.preferredSize = [80, -1];

    // 按钮
    var buttonGroup = win.add("group");
    buttonGroup.alignChildren = ["center", "fill"];
    win.okButton = buttonGroup.add("button", undefined, "确定");
    win.cancelButton = buttonGroup.add("button", undefined, "取消");

    return win;
}

function stringify(obj) {
    var json = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key].toString();
            value = value.replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/"/g, '\\"');
            json.push('"' + key + '":"' + value + '"');
        }
    }
    return "{" + json.join(",") + "}";
}

function drawLine(geo, strokeWidth, strokeColor) {
    var lineObj = activeDocument.pathItems.add();
    lineObj.setEntirePath(geo);
    lineObj.stroked = true;
    lineObj.strokeWidth = strokeWidth;
    lineObj.strokeColor = strokeColor;
    lineObj.filled = false;
    lineObj.strokeCap = StrokeCap.BUTTENDCAP;

    return lineObj;
}

try {
    main();
} catch (error) {
    $.writeln("Error: " + error.message);
    alert(error);
}
