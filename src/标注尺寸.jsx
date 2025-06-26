//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

function main() {
    var SCRIPT = {
            name: "标注尺寸",
            version: "v0.0.1",
        },
        CFG = {
            color: getColor(255, 0, 0),
        };

    var doc = app.activeDocument;
    var sel = doc.selection;
    var obj = sel[0];

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
        [x, y + h],
        [x + w, y + h],
    ];

    drawLine(bottomGeo);

    function drawLine(geo) {
        var lineObj = doc.pathItems.add();
        lineObj.setEntirePath(geo);
        lineObj.stroked = true;
        lineObj.strokeWidth = 1;
        lineObj.strokeColor = CFG.color;
        lineObj.filled = false;
        lineObj.strokeCap = StrokeCap.BUTTENDCAP;
    }
}

function getColor(red, green, blue) {
    var color = new RGBColor();
    color.red = red;
    color.green = green;
    color.blue = blue;
    return color;
}
try {
    main();
} catch (error) {
    alert(error);
}
