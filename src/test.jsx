//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

function main() {
    var SCRIPT = {
            name: "Align Text Baseline",
            version: "v0.1.1",
        },
        CFG = {
            layName: "尺寸标注层",
            setgap: 3, // 标注线与对象的间距（默认3pt）
            setDoubleLine: 8, // 标注线两端的短线长度（默认8pt）
        };

    var doc = app.activeDocument;
    var sel = doc.selection;

    if (sel.length <= 0) {
        return alert("请先选择标注对象！");
    }

    // 处理标注图层
    try {
        var specsLayer = doc.layers[CFG.layName];
        specsLayer.locked = false;
        specsLayer.visible = true;
    } catch (err) {
        var specsLayer = doc.layers.add();
        specsLayer.name = CFG.layName;
    }

    var bound = sel[0].geometricBounds;

    var x = bound[0];
    var y = bound[1];
    var w = bound[2] - bound[0];
    var h = bound[1] - bound[3];

    // 处理负宽度和高度
    var xa = w < 0 ? x + w : x;
    var xb = w < 0 ? x : x;
    var ya = h < 0 ? y - h : y;
    var yb = h < 0 ? y : y;

    var setAsizeSize = 6;
    var setDoubleLine = 8;
    var setgap = 3;

    // var topLines1 = new Lineadd(
    //     [
    //         [x, y + CFG.setDoubleLine / 2 + CFG.setgap],
    //         [x + w, y + CFG.setDoubleLine / 2 + CFG.setgap],
    //     ],
    //     specsLayer,
    // );

    var topLines2 = new Lineadd(
        [
            [x, y + CFG.setDoubleLine + CFG.setgap],
            [x, y + CFG.setgap],
        ],
        specsLayer,
    );
    var topLines3 = new Lineadd(
        [
            [x + w, y + CFG.setDoubleLine + CFG.setgap],
            [x + w, y + CFG.setgap],
        ],
        specsLayer,
    );

    // 添加箭头
    var topArrows1 = new ArrowAdd(
        [
            [xa + setAsizeSize, y + setDoubleLine / 2 + setgap - setAsizeSize / 2],
            [xa, y + setDoubleLine / 2 + setgap],
            [xa + setAsizeSize, y + setDoubleLine / 2 + setgap + setAsizeSize / 2],
        ],
        specsLayer,
    );
}

// 辅助函数：获取对象边界
function NO_CLIP_BOUNDS(the_obj) {
    if (the_obj.typename == "GroupItem") {
        if (the_obj.clipped) {
            return the_obj.pageItems[0].geometricBounds;
        } else {
            var left = [];
            var top = [];
            var right = [];
            var bottom = [];
            for (var i = 0; i < the_obj.pageItems.length; i++) {
                var bounds = NO_CLIP_BOUNDS(the_obj.pageItems[i]);
                left.push(bounds[0]);
                top.push(bounds[1]);
                right.push(bounds[2]);
                bottom.push(bounds[3]);
            }
            return [
                Math.min.apply(null, left),
                Math.max.apply(null, top),
                Math.max.apply(null, right),
                Math.min.apply(null, bottom),
            ];
        }
    } else {
        return the_obj.geometricBounds;
    }
}

function Lineadd(geo, layer) {
    var Linename = layer.pathItems.add();
    Linename.setEntirePath(geo);
    Linename.stroked = true;
    Linename.strokeWidth = 1;
    Linename.filled = false;
    Linename.strokeCap = StrokeCap.BUTTENDCAP;
    return Linename;
}

function ArrowAdd(geoAR, layer) {
    var arrowName = layer.pathItems.add();
    arrowName.setEntirePath(geoAR);
    arrowName.stroked = true;
    arrowName.strokeWidth = 1;
    arrowName.filled = false;
    // arrowName.closed = true;
    return arrowName;
}

function textOnLinePath() {
    var thisDoc = app.activeDocument;
    var lineObj = thisDoc.pathItems.add();
    lineObj.setEntirePath(Array(Array(275, -110), Array(525, -110)));
    var linePathText = thisDoc.textFrames.pathText(lineObj);
    linePathText.contents = "250 px";
    applyTextFormats(linePathText);
}

var newRGBColor = new RGBColor();
newRGBColor.red = 0;
newRGBColor.green = 0;
newRGBColor.blue = 0;
function applyTextFormats(thisText) {
    // thisText.spacing = 10;
    thisText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
    thisText.textRange.characterAttributes.fillColor = newRGBColor;
    thisText.textRange.characterAttributes.size = 14;
}

try {
    textOnLinePath();
} catch (error) {
    alert(error);
}
