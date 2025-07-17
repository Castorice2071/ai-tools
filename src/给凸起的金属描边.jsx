//@include "./common.jsx"

var bit = 32;
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.send();
    } catch (error) {}
}

var win = new Window("palette", "Hello World");
win.alignChildren = ["fill", "fill"];

// 金属描边加粗
// =======
var PB = win.add("panel", undefined, "金属描边");
PB.orientation = "row";
PB.alignChildren = ["fill", "fill"];
PB.margins = 20;
PB.spacing = 8;

PB.BTN1 = PB.add("button", undefined, "确定");
PB.BTN2 = PB.add("button", undefined, "取消");
PB.BTN1.onClick = function () {
    buildMsg("metalEdging();");
};

win.show();

// =====================

/**
 * 给凸起金属描边
 */
function metalEdging() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            alert("No items selected.");
            return [];
        }

        // 1. 获取选区的凸起金属颜色
        var metalColors = UTILS.getSelectionMetalColors(true);
        $.writeln("凸起金属颜色数量: " + metalColors.length);
        $.writeln("凸起金属颜色: " + metalColors.join(" @ "));

        if (metalColors.length === 0 || metalColors.length >= 2) {
            return alert("只支持选区中有且仅有一个凸起金属颜色");
        }

        // 2. 构造颜色
        var METALCOLOR = new SpotColor();
        METALCOLOR.spot = app.activeDocument.spots.getByName(metalColors[0]);
        $.writeln("METALCOLOR: " + METALCOLOR.spot);

        // 3. 获取描边宽度
        var strokeWidth = parseFloat(prompt("请输入描边宽度（单位：毫米）", "0.5"));

        $.writeln("描边宽度: " + strokeWidth + "mm");

        // 3. 遍历选区中的 pathItem
        for (var i = 0; i < items.length; i++) {
            handle(items[i]);
        }

        function handle(item) {
            if (item.typename === "GroupItem") {
                for (var j = 0; j < item.pageItems.length; j++) {
                    handle(item.pageItems[j]);
                }
            } else if (item.typename === "CompoundPathItem") {
                for (var j = 0; j < item.pathItems.length; j++) {
                    handle(item.pathItems[j]);
                }
            } else if (item.typename === "PathItem") {
                if (item.filled && item.fillColor && UTILS.isColorMatch(item.fillColor, METALCOLOR, 1)) {

                    $.writeln("METALCOLOR111: " + METALCOLOR.spot);
                    // 先设置描边颜色和宽度
                    item.strokeColor = METALCOLOR;
                    item.strokeWidth = new UnitValue(strokeWidth, "mm").as("pt"); // 明确指定单位

                    // 然后启用描边
                    item.stroked = true;

                    // 最后设置描边样式
                    item.strokeCap = StrokeCap.ROUNDENDCAP;
                    item.strokeJoin = StrokeJoin.ROUNDENDJOIN;

                    // 置于顶层
                    item.zOrder(ZOrderMethod.BRINGTOFRONT);
                }
            }
        }
    } catch (error) {
        alert("给凸起金属描边失败: " + error.message);
    }
}
