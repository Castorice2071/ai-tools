//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);

function main() {
    var SCRIPT = {
        name: "标注尺寸",
        version: "v0.0.5",
    };
    var CFG = {
        rgb: [0, 0, 0],
        cmyk: [0, 0, 0, 100],
        lineWidth: 0.5,
        doubleLineLength: 4, // 两端线段长度
        gap: 2,
    };
    var SETTINGS = {
        name: SCRIPT.name + "_data.json",
        folder: Folder.myDocuments + "/Adobe Scripts/",
    };

    var doc = app.activeDocument;
    var win = buildUI(SCRIPT, CFG);
    var color = createColor(CFG);

    loadSettings(SETTINGS);

    win.okButton.onClick = function () {
        try {
            // 参数同步与类型转换
            CFG.gap = parseFloat(win.gap.text);
            CFG.lineWidth = parseFloat(win.lineWidth.text);

            var sel = doc.selection;
            if (!sel || sel.length <= 0) throw new Error("请先选择标注对象！");

            var top = win.topCheck.value,
                left = win.leftCheck.value,
                right = win.rightCheck.value,
                bottom = win.bottomCheck.value;
            if (!(top || left || right || bottom)) throw new Error("请至少选择一个标注边。");

            var bounds = sel[0].geometricBounds;
            var x = bounds[0],
                y = bounds[1],
                w = bounds[2] - bounds[0],
                h = bounds[1] - bounds[3];

            if (top) {
                drawLine([
                    [x, y + CFG.gap],
                    [x, y + CFG.gap + CFG.doubleLineLength],
                ]);

                drawLine([
                    [x + w, y + CFG.gap],
                    [x + w, y + CFG.gap + CFG.doubleLineLength],
                ]);

                drawLine([
                    [x, y + CFG.gap + CFG.doubleLineLength / 2],
                    [x + w, y + CFG.gap + CFG.doubleLineLength / 2],
                ]);
            }

            if (left) {
                drawLine([
                    [x - CFG.gap - CFG.doubleLineLength, y],
                    [x - CFG.gap, y],
                ]);

                drawLine([
                    [x - CFG.gap - CFG.doubleLineLength, y - h],
                    [x - CFG.gap, y - h],
                ]);

                drawLine([
                    [x - CFG.gap - CFG.doubleLineLength / 2, y],
                    [x - CFG.gap - CFG.doubleLineLength / 2, y - h],
                ]);
            }

            if (right) {
                drawLine([
                    [x + w + CFG.gap, y],
                    [x + w + CFG.gap + CFG.doubleLineLength, y],
                ]);

                drawLine([
                    [x + w + CFG.gap, y - h],
                    [x + w + CFG.gap + CFG.doubleLineLength, y - h],
                ]);

                drawLine([
                    [x + w + CFG.gap + CFG.doubleLineLength / 2, y],
                    [x + w + CFG.gap + CFG.doubleLineLength / 2, y - h],
                ]);
            }

            if (bottom) {
                drawLine([
                    [x, y - h - CFG.gap],
                    [x, y - h - CFG.gap - CFG.doubleLineLength],
                ]);

                drawLine([
                    [x + w, y - h - CFG.gap],
                    [x + w, y - h - CFG.gap - CFG.doubleLineLength],
                ]);

                drawLine([
                    [x, y - h - CFG.gap - CFG.doubleLineLength / 2],
                    [x + w, y - h - CFG.gap - CFG.doubleLineLength / 2],
                ]);
            }

            saveSettings(SETTINGS);
            app.redraw();
        } catch (e) {
            alert(e && e.message ? e.message : e);
        }
    };

    win.cancelButton.onClick = function () {
        win.close();
    };
    win.show();

    /**
     * 绘制线条
     * @param {Array} geo - 线条的坐标数组
     */
    function drawLine(geo) {
        var lineObj = app.activeDocument.pathItems.add();
        lineObj.setEntirePath(geo);
        lineObj.stroked = true;
        lineObj.strokeWidth = CFG.lineWidth;
        lineObj.strokeColor = color;
        lineObj.filled = false;
        lineObj.strokeCap = StrokeCap.BUTTENDCAP;
        return lineObj;
    }

    /**
     * 保存设置到文件
     */
    function saveSettings(prefs) {
        if (!Folder(prefs.folder).exists) Folder(prefs.folder).create();
        var f = new File(prefs.folder + prefs.name);
        f.encoding = "UTF-8";
        f.open("w");
        var data = {
            win_x: win.location.x,
            win_y: win.location.y,
            fontSize: win.fontSize.text,
            unit: win.unit.selection.index,
            topCheck: win.topCheck.value,
            rightCheck: win.rightCheck.value,
            bottomCheck: win.bottomCheck.value,
            leftCheck: win.leftCheck.value,
            gap: win.gap.text,
            lineWidth: win.lineWidth.text,
        };
        f.write(stringify(data));
        f.close();
    }

    /**
     * 加载设置从文件
     */
    function loadSettings(prefs) {
        var f = File(prefs.folder + prefs.name);
        if (!f.exists) return;
        try {
            f.encoding = "UTF-8";
            f.open("r");
            var json = f.readln();
            var data = new Function("return (" + json + ")")();
            f.close();
            if (typeof data != "undefined") {
                win.location = [parseInt(data.win_x) || 100, parseInt(data.win_y) || 100];
                win.fontSize.text = data.fontSize;
                win.unit.selection = data.unit;
                win.topCheck.value = data.topCheck === "true" || data.topCheck === true;
                win.rightCheck.value = data.rightCheck === "true" || data.rightCheck === true;
                win.bottomCheck.value = data.bottomCheck === "true" || data.bottomCheck === true;
                win.leftCheck.value = data.leftCheck === "true" || data.leftCheck === true;
                win.gap.text = data.gap || CFG.gap;
                win.lineWidth.text = data.lineWidth || CFG.lineWidth;
            }
        } catch (err) {
            return;
        }
    }
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

function buildUI(SCRIPT, CFG) {
    var win = new Window("dialog", SCRIPT.name + " " + SCRIPT.version);
    win.orientation = "column";
    win.alignChildren = ["fill", "fill"];

    // 标注边
    var sidePanel = win.add("panel", undefined, "选择标注边");
    sidePanel.orientation = "row";
    sidePanel.alignChildren = ["center", "center"];
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
    win.lineWidth = lineWidthGroup.add("edittext", undefined, CFG.lineWidth.toString());
    win.lineWidth.preferredSize = [80, -1];

    var gapGroup = col2.add("group");
    gapGroup.add("statictext", undefined, "标线间距:");
    win.gap = gapGroup.add("edittext", undefined, CFG.gap.toString());
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

try {
    main();
} catch (error) {
    $.writeln("Error: " + (error && error.message ? error.message : error));
    alert(error && error.message ? error.message : error);
}
