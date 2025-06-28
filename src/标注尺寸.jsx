//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

function main() {
    var SCRIPT = {
            name: "标注尺寸",
            version: "v0.0.1",
        },
        CFG = {
            rgb: [0, 0, 0],
            cmyk: [0, 0, 0, 100],
            color: getColor(255, 0, 0),
            gap: 3, // 标注线与标注对象的间距
        },
        SETTINGS = {
            name: SCRIPT.name + "_data.json",
            folder: Folder.myDocuments + "/Adobe Scripts/",
        };

    var doc = app.activeDocument;
    var sel = doc.selection;
    var obj = sel[0];

    // Create color
    var color = createColor(CFG);

    if (!obj) {
        throw new Error("请先选择标注对象！");
    }

    var bounds = obj.geometricBounds;
    var x = bounds[0];
    var y = bounds[1];
    var w = bounds[2] - bounds[0];
    var h = bounds[1] - bounds[3];

    $.writeln("w ", w);
    $.writeln("h ", h);
    $.writeln("x ", x);
    $.writeln("y ", y);

    var bottomGeo = [
        [x, y - h - CFG.gap],
        [x + w, y - h - CFG.gap],
    ];

    var topGeo = [
        [x, y],
        [x + w, y],
    ];

    drawLine(topGeo);

    function drawLine(geo) {
        var lineObj = doc.pathItems.add();
        lineObj.setEntirePath(geo);
        lineObj.stroked = true;
        lineObj.strokeWidth = 1;
        lineObj.strokeColor = color;
        lineObj.filled = false;
        lineObj.strokeCap = StrokeCap.BUTTENDCAP;

        // 计算文本位置（示例：线段中点）
        var x = (geo[0][0] + geo[1][0]) / 2;
        var y = (geo[0][1] + geo[1][1]) / 2;

        var textObj = doc.textFrames.add();
        textObj.contents = "250 px";
        textObj.left = x;
        textObj.top -= y;

        return lineObj;
    }

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
        data.mode = isOneAngle.value;
        data.side1 = side1Inp.text;
        data.side2 = side2Inp.text;
        data.angle1 = angle1Inp.text;
        data.angle2 = angle2Inp.text;
        data.legend = isAddInfo.value;

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
                side1Inp.text = parseFloat(data.side1) + " " + CFG.units;
                side2Inp.text = parseFloat(data.side2) + " " + CFG.units;
                angle1Inp.text = data.angle1;
                angle2Inp.text = data.angle2;
                if (data.mode) {
                    isOneAngle.value = data.mode === "true";
                    isTwoAngle.value = data.mode === "false";
                    side2Inp.enabled = isOneAngle.value;
                    angle2Inp.enabled = !isOneAngle.value;
                }
                isAddInfo.value = data.legend === "true";
            }
        } catch (err) {
            return;
        }
    }

    function draw() {}
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

try {
    main();
    app.redraw(); // 刷新画布
} catch (error) {
    alert(error);
}
