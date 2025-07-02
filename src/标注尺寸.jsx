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
        gap: 3, // 标注线与标注对象的间距
    };
    var SETTINGS = {
        name: SCRIPT.name + "_data.json",
        folder: Folder.myDocuments + "/Adobe Scripts/",
    };

    var win = buildUI(SCRIPT);

    loadSettings(SETTINGS);

    win.okButton.onClick = function () {
        saveSettings(SETTINGS);
        // alert(1);
    };
    win.cancelButton.onClick = function () {
        win.close();
    };

    win.show();

    return;

    var doc = app.activeDocument;
    var sel = doc.selection;
    var obj = sel[0];

    // Create color
    var color = createColor(CFG);

    if (!obj) {
        throw new Error("请先选择标注对象！");
    }

    // DIALOG
    var win = new Window("dialog", SCRIPT.name + " " + SCRIPT.version);
    win.orientation = "column";

    // 标注边
    var sidePanel = win.add("panel", undefined, "选择标注边");
    sidePanel.orientation = "row";
    sidePanel.spacing = 16;

    var topCheck = sidePanel.add("checkbox", undefined, "上边");
    var rightCheck = sidePanel.add("checkbox", undefined, "右边");
    var bottomCheck = sidePanel.add("checkbox", undefined, "下边");
    var leftCheck = sidePanel.add("checkbox", undefined, "左边");

    win.show();
    return;

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
        data.fontSize = win.fontSize.text;
        data.unit = win.unit.selection.index;
        data.topCheck = win.topCheck.value;
        data.rightCheck = win.rightCheck.value;
        data.bottomCheck = win.bottomCheck.value;
        data.leftCheck = win.leftCheck.value;

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

    var wrapper = win.add("group");
    wrapper.orientation = "row";
    wrapper.alignChildren = ["fill", "fill"];

    var unitPanel = wrapper.add("panel", undefined, "选择单位");
    win.unit = unitPanel.add("dropdownlist", undefined, ["px", "mm", "cm", "in"]);
    win.unit.selection = 0; // 默认选择 px
    win.unit.preferredSize = [80, -1];

    var sizePanel = wrapper.add("panel", undefined, "字号大小");
    win.fontSize = sizePanel.add("edittext", undefined, "12");
    win.fontSize.preferredSize = [80, -1];

    var buttonGroup = win.add("group");
    buttonGroup.alignChildren = ["center", "fill"];

    win.okButton = buttonGroup.add("button", undefined, "确定");
    win.cancelButton = buttonGroup.add("button", undefined, "取消");

    return win;
}

/**
 * Serialize a JavaScript plain object into a JSON-like string
 * @param {Object} obj - The object to serialize
 * @returns {string} - A JSON-like string representation of the object
 */
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
    app.redraw(); // 刷新画布
} catch (error) {
    alert(error);
}
