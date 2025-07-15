//@target illustrator
//@targetengine main
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

var bit = 64;
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

var SCRIPT = {
    name: "图稿设计工具箱",
    version: "v1.0.0",
};

var CFG = {
    folderName: 0,
    // 凸起的金色颜色集合
    metalColors: [
        [88, 97, 104],
        [222, 203, 144],
        [253, 233, 156],
        [176, 174, 132],
        [211, 211, 211],
        [178, 178, 178],
        [170, 88, 61],
        [44, 45, 45],
        [212, 154, 100],
        [242, 192, 179],
        [205, 194, 118],
    ],
};

// 金属颜色
var METALCOLOR = new RGBColor();
METALCOLOR.red = 211;
METALCOLOR.green = 211;
METALCOLOR.blue = 211;

function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.send();
    } catch (error) {}
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

function isColorMatch(color1, color2) {
    if (color1.typename !== color2.typename) return false;
    if (color1.typename === "CMYKColor") {
        return color1.cyan === color2.cyan && color1.magenta === color2.magenta && color1.yellow === color2.yellow && color1.black === color2.black;
    } else if (color1.typename === "RGBColor") {
        return color1.red === color2.red && color1.green === color2.green && color1.blue === color2.blue;
    } else if (color1.typename === "GrayColor") {
        return color1.gray === color2.gray;
    }
    return false; // 不支持的颜色类型
}

/**
 * 获取选中的颜色
 */
function getSelectedColors(the_obj) {
    var colors = [];

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem" && item.pathItems[0].fillColor) {
            addColor(item.pathItems[0].fillColor);
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

/**
 * 获取文档中所有的颜色
 */
function getAllColors() {
    var doc = app.activeDocument;
    var colors = [];

    function processLayer(layerOrGroupItem) {
        // 如果图层被锁定或隐藏，跳过
        if (layerOrGroupItem.locked || layerOrGroupItem.hidden) return;

        // 遍历 layerOrGroupItem 的子元素
        for (var i = 0; i < layerOrGroupItem.pageItems.length; i++) {
            var item = layerOrGroupItem.pageItems[i];

            // 如果当前对象是 Group 或者 Layer，继续递归
            if (item.typename === "GroupItem" || item.typename === "Layer") {
                processLayer(item);
            } else {
                collectColors(item);
            }
        }
    }

    function collectColors(item) {
        $.writeln("collectColors item.typename: " + item.typename);
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem" && item.pathItems[0].fillColor) {
            addColor(item.pathItems[0].fillColor);
            // // 处理复合路径中的每个路径项
            // for (var i = 0; i < item.pathItems.length; i++) {
            //     var pathItem = item.pathItems[i];
            //     if (pathItem.filled && pathItem.fillColor) {

            //     }
            // }
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

    // 检查文档是否存在且有图层
    if (doc && doc.layers.length > 0) {
        // 遍历所有图层
        for (var i = 0; i < doc.layers.length; i++) {
            processLayer(doc.layers[i]);
        }
    }

    // 去重处理
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

/**
 * 隐藏金属色
 */
function hideMetalColor() {
    // 获取当前文档
    var doc = app.activeDocument;

    // 遍历路径项并隐藏指定颜色
    for (var i = 0; i < doc.pathItems.length; i++) {
        var pathItem = doc.pathItems[i];
        if (pathItem.filled && isColorMatch(pathItem.fillColor, METALCOLOR)) {
            pathItem.hidden = true; // 隐藏对象
        }
    }
}

/**
 * 隐藏非金属色
 */
function hideNotMetalColor() {
    // 获取当前文档
    var doc = app.activeDocument;
    // 遍历路径项并隐藏非金属色
    for (var i = 0; i < doc.pathItems.length; i++) {
        var pathItem = doc.pathItems[i];
        if (pathItem.filled && !isColorMatch(pathItem.fillColor, METALCOLOR)) {
            pathItem.hidden = true; // 隐藏对象
        }
    }
}

/**
 * 导出 PSD
 */
function exportToPSD(filePath) {
    try {
        // 获取当前文档
        var doc = app.activeDocument;

        // 设置导出选项
        var psdOptions = new ExportOptionsPhotoshop();
        // psdOptions.layers = true; // 保留图层
        // psdOptions.embedLinkedFiles = true; // 嵌入链接文件

        // 导出为 PSD 文件
        // var file = new File(doc.path + "/" + doc.name.replace(/\.[^\.]+$/, "") + ".psd");

        var file = new File(filePath);
        doc.exportFile(file, ExportType.PHOTOSHOP, psdOptions);
    } catch (error) {
        alert("导出 PSD 文件时出错: " + error.message);
    }
}

/**
 * 导出 AI
 */
function exportToAI(name) {
    try {
        // 获取当前文档
        var doc = app.activeDocument;

        // 导出为 AI 文件
        var file = new File(Folder.desktop + "/" + name);
        doc.saveAs(file);
    } catch (error) {
        alert("导出 AI 文件时出错: " + error.message);
    }
}

/**
 * 识别颜色并导出PSD
 */
function analyzeColorsAndExportPSD() {
    var colors = getAllColors();

    // 创建文件夹
    CFG.folderName++;
    var fileFolder = Folder.desktop + "/" + CFG.folderName + "/";
    if (!Folder(fileFolder).exists) {
        Folder(fileFolder).create();
    }

    // 遍历所有颜色
    for (var i = 0; i < colors.length; i++) {
        var colorStr = colors[i];

        // 获取当前文档
        var doc = app.activeDocument;

        // 遍历所有路径项并隐藏不匹配当前颜色的项
        for (var j = 0; j < doc.pathItems.length; j++) {
            var pathItem = doc.pathItems[j];
            if (pathItem.filled && pathItem.fillColor) {
                var itemColorStr = "";
                var color = pathItem.fillColor;

                if (color.typename === "RGBColor") {
                    itemColorStr = "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
                } else if (color.typename === "CMYKColor") {
                    itemColorStr = "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
                } else if (color.typename === "GrayColor") {
                    itemColorStr = "Gray(" + color.gray + ")";
                } else if (color.typename === "SpotColor") {
                    itemColorStr = "SpotColor(" + color.spot.name + ")";
                }

                pathItem.hidden = itemColorStr !== colorStr;
            }
        }

        // 处理文件名
        var fileName = colorStr.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
        fileName = fileName.replace(/^RGB\((.+)\)/, "$1");
        fileName = fileName.replace(/^CMYK\((.+)\)/, "$1");
        fileName = fileName.replace(/^Gray\((.+)\)/, "$1");
        fileName = fileName.replace(/[,]/g, "_");

        exportToPSD(fileFolder + fileName + ".psd");

        // 恢复所有项的显示状态
        app.undo();
        app.redraw();
    }

    // 释放文件夹引用
    folder = null;
    fileFolder = null;
    $.gc(); // 触发垃圾回收
    $.gc();

    // 上面的释放与gc，本意是避免文件夹被占用不能删除，结果一直没有生效。反而下面的alert可以满足
    alert("导出完成");
}

/**
 * 识别颜色并导出AI
 */
function analyzeColorsAndExportAI() {
    var colors = getAllColors();
    // 遍历所有颜色
    for (var i = 0; i < colors.length; i++) {
        var colorStr = colors[i];

        // 获取当前文档
        var doc = app.activeDocument;

        // 遍历所有路径项并隐藏不匹配当前颜色的项
        for (var j = 0; j < doc.pathItems.length; j++) {
            var pathItem = doc.pathItems[j];
            if (pathItem.filled && pathItem.fillColor) {
                var itemColorStr = "";
                var color = pathItem.fillColor;

                if (color.typename === "RGBColor") {
                    itemColorStr = "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
                } else if (color.typename === "CMYKColor") {
                    itemColorStr = "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
                } else if (color.typename === "GrayColor") {
                    itemColorStr = "Gray(" + color.gray + ")";
                } else if (color.typename === "SpotColor") {
                    itemColorStr = "SpotColor(" + color.spot.name + ")";
                }

                pathItem.hidden = itemColorStr !== colorStr;
            }
        }

        // 处理文件名
        var fileName = colorStr.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
        fileName = fileName.replace(/^RGB\((.+)\)/, "$1");
        fileName = fileName.replace(/^CMYK\((.+)\)/, "$1");
        fileName = fileName.replace(/^Gray\((.+)\)/, "$1");
        fileName = fileName.replace(/[,]/g, "_");
        exportToAI(fileName + ".ai");

        // 恢复所有项的显示状态
        app.undo();
        app.redraw();
    }
}

/**
 * 重置文件夹
 */
function resetFolder() {
    $.gc();
    $.gc();
    CFG.folderName = 0;

    alert("重置文件夹成功");
}

/**
 * 获取当前图稿中的金属色
 */
function getMetalColors() {
    try {
        var items = app.activeDocument.pathItems;
        var metalColors = [];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            // 检查是否有填充色
            if (item.filled) {
                var fillColor = item.fillColor;
                // 检查是否为RGB颜色
                if (fillColor.typename === "RGBColor") {
                    var rgb = [Math.round(fillColor.red), Math.round(fillColor.green), Math.round(fillColor.blue)];

                    // 检查是否为预定义的金属色
                    for (var j = 0; j < CFG.metalColors.length; j++) {
                        var metalColor = CFG.metalColors[j];
                        if (Math.abs(rgb[0] - metalColor[0]) === 0 && Math.abs(rgb[1] - metalColor[1]) === 0 && Math.abs(rgb[2] - metalColor[2]) === 0) {
                            metalColors.push(rgb);
                            break;
                        }
                    }
                }
            }
        }

        // 去重处理
        var uniqueColors = {};
        var result = [];
        for (var j = 0; j < metalColors.length; j++) {
            var c = metalColors[j];
            if (!uniqueColors[c]) {
                uniqueColors[c] = true;
                result.push(c);
            }
        }

        return result;
    } catch (error) {
        alert("获取当前图稿中的金属色: " + error.message);
        return [];
    }
}

/**
 * 给金属描边
 */
function metalEdging() {
    try {
        var metalColors = getMetalColors();
        if (metalColors.length <= 0) {
            return alert("没有匹配的金属颜色");
        }

        if (metalColors.length >= 2) {
            return alert("金属颜色超过1种");
        }

        // 金属颜色
        var METALCOLOR = new RGBColor();
        METALCOLOR.red = metalColors[0][0];
        METALCOLOR.green = metalColors[0][1];
        METALCOLOR.blue = metalColors[0][2];

        var items = app.activeDocument.pathItems;

        var strokeWidth = parseFloat(PB.strokeWidth.text);

        for (var i = 0; i < items.length; i++) {
            // items[i].fillColor = color;
            var item = items[i];
            // 检查是否为有效的路径对象
            if (item.typename !== "PathItem") continue;
            if (item.filled && isColorMatch(item.fillColor, METALCOLOR)) {
                $.writeln("发现匹配的颜色项：" + item.typename);

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

                $.writeln("已设置描边: " + item.stroked + ", 宽度: " + item.strokeWidth);
            }
        }
    } catch (error) {
        alert("出错了: " + error.message);
    }
}

// =========================
// 创建窗口 palette or dialog
var win = new Window("palette", SCRIPT.name + " " + SCRIPT.version);
win.alignChildren = ["fill", "fill"];

// 识别颜色并导出
// =======
var PA = win.add("panel", undefined, "识别颜色并导出");
PA.orientation = "row";
PA.alignChildren = ["fill", "fill"];
PA.margins = 16;
PA.spacing = 8;
PA.BTN1 = PA.add("button", undefined, "PSD");
PA.BTN2 = PA.add("button", undefined, "AI");
PA.BTN3 = PA.add("button", undefined, "重置文件夹");
PA.BTN1.onClick = function () {
    buildMsg("analyzeColorsAndExportPSD();");
};
PA.BTN2.onClick = function () {
    buildMsg("analyzeColorsAndExportAI();");
};
PA.BTN3.onClick = function () {
    buildMsg("resetFolder();");
};

// 金属描边加粗
// =======
var PB = win.add("panel", undefined, "金属描边");
PB.orientation = "row";
PB.alignChildren = ["fill", "fill"];

PB.strokeWidth = PB.add("editText", undefined, "0.1");
PB.strokeWidth.addEventListener("keydown", function (kd) {
    $.writeln(kd.keyName);
    if (kd.keyName == "Enter") {
        buildMsg("metalEdging();");
    }
});
PB.BTN1 = PB.add("button", undefined, "确定");
PB.BTN1.onClick = function () {
    buildMsg("metalEdging();");
};

// 标注尺寸
// =======
var PC = win.add("panel", undefined, "标注尺寸");
PC.alignChildren = ["fill", "fill"];
var sidePanel = PC.add("panel", undefined, "选择标注边");
sidePanel.orientation = "row";
sidePanel.margins = 16;
sidePanel.spacing = 8;
PC.topCheckbox = sidePanel.add("checkbox", undefined, "上边");
PC.rightCheckbox = sidePanel.add("checkbox", undefined, "右边");
PC.bottomCheckbox = sidePanel.add("checkbox", undefined, "下边");
PC.leftCheckbox = sidePanel.add("checkbox", undefined, "左边");
PC.bottomCheckbox.value = true;
PC.leftCheckbox.value = true;

var unitPanelAndFontSizePanelGroup = PC.add("group");
unitPanelAndFontSizePanelGroup.orientation = "row";

var unitPanel = unitPanelAndFontSizePanelGroup.add("panel", undefined, "选择单位");
unitPanel.orientation = "row";
unitPanel.margins = 16;
unitPanel.spacing = 8;
PC.unitControl = unitPanel.add("dropdownlist", undefined);
PC.unitControl.preferredSize = [80, -1];
// 定义可选单位列表
var unitItems = ["英寸-in", "毫米-mm", "厘米-cm", "米-m", "磅-pt", "像素-px", "英尺-ft", "派卡-pc"];
// 添加单位选项到下拉列表
for (var i = 0; i < unitItems.length; i++) {
    PC.unitControl.add("item", unitItems[i]);
}
// 设置单位选项默认选择第一个
PC.unitControl.selection = 0;

// ==== 标注寸尺 字号大小
var fontSizePanel = unitPanelAndFontSizePanelGroup.add("panel", undefined, "字号大小");
fontSizePanel.orientation = "row";
fontSizePanel.margins = 16;
fontSizePanel.spacing = 8;

PC.fontSizeControl = fontSizePanel.add("editText", undefined, "10");
PC.fontSizeControl.preferredSize = [80, -1];

var group = PC.add("group");
group.alignChildren = ["center", "fill"];
PC.BTN1 = group.add("button", undefined, "确定");
PC.BTN1.onClick = function () {
    buildMsg("label_Info();");
};

win.onClose = function () {
    // alert('关闭')
};

win.show();

/**
 * 创建一个 RGB 颜色
 */
function createRGBColor(rgb) {
    var color = new RGBColor();
    color.red = rgb[0];
    color.green = rgb[1];
    color.blue = rgb[2];
    return color;
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
            return [Math.min.apply(null, left), Math.max.apply(null, top), Math.max.apply(null, right), Math.min.apply(null, bottom)];
        }
    } else {
        return the_obj.geometricBounds;
    }
}

// 标注信息处理函数
function label_Info() {
    var doc = app.activeDocument;
    var sel = doc.selection;

    if (sel.length <= 0) {
        return alert("请先选择标注对象！");
    }

    var setDecimals = 2; // 小数位数（默认2位）
    var setLineWeight = 0.5; // 线条粗细（默认0.5pt）
    var setgap = 3; // 标注线与对象的间距（默认3pt）
    var setDoubleLine = 8; // 标注线两端的短线长度（默认8pt）
    var setAsizeSize = 6; // 箭头大小（默认6pt）

    // 获取标注边的选择状态
    var top = PC.topCheckbox.value;
    var left = PC.leftCheckbox.value;
    var right = PC.rightCheckbox.value;
    var bottom = PC.bottomCheckbox.value;

    // 获取单位设置
    var unitConvert = PC.unitControl.selection.toString().replace(/[^a-zA-Z]/g, "");
    var fontSize = PC.fontSizeControl.text;
    var color = createRGBColor([0, 0, 0]);
    $.writeln("unitConvert: " + unitConvert);
    $.writeln("fontSize: " + fontSize);

    if (!top && !left && !right && !bottom) {
        return alert("请至少选择一个标注边。");
    }

    var specsLayer = doc.activeLayer;
    var itemsGroup = specsLayer.groupItems.add();

    // 处理单体标注
    if (sel.length > 0) {
        if (top) Each_DIMENSIONS(sel[0], "Top");
        if (left) Each_DIMENSIONS(sel[0], "Left");
        if (right) Each_DIMENSIONS(sel[0], "Right");
        if (bottom) Each_DIMENSIONS(sel[0], "Bottom");
    }

    // 单体标注函数
    function Each_DIMENSIONS(bound, where) {
        var bound = new Array();
        for (var i = 0; i < sel.length; i += 1) {
            var a = NO_CLIP_BOUNDS(sel[i]);
            bound[0] = a[0];
            bound[1] = a[1];
            bound[2] = a[2];
            bound[3] = a[3];
            linedraw(bound, where);
        }
    }

    // 线条创建函数
    function Lineadd(geo) {
        var Linename = itemsGroup.pathItems.add();
        Linename.setEntirePath(geo);
        Linename.stroked = true;
        Linename.strokeWidth = setLineWeight;
        Linename.strokeColor = color;
        Linename.filled = false;
        Linename.strokeCap = StrokeCap.BUTTENDCAP;
        return Linename;
    }

    // 箭头创建函数
    function arrowsAdd(geoAR) {
        var arrowName = itemsGroup.pathItems.add();
        arrowName.setEntirePath(geoAR);
        arrowName.stroked = false;
        arrowName.strokeColor = NoColor;
        arrowName.filled = true;
        arrowName.fillColor = color;
        arrowName.closed = true;
        return arrowName;
    }

    // 标注线绘制函数
    function linedraw(bound, where) {
        var x = bound[0];
        var y = bound[1];
        var w = bound[2] - bound[0];
        var h = bound[1] - bound[3];

        // 处理负宽度和高度
        var xa = w < 0 ? x + w : x;
        var xb = w < 0 ? x : x;
        var ya = h < 0 ? y - h : y;
        var yb = h < 0 ? y : y;

        // 处理水平方向标注
        if (w != 0) {
            if (where == "Top") {
                var topGroup = specsLayer.groupItems.add();
                topGroup.name = "上";

                // 创建标注线
                var topLines1 = new Lineadd([
                    [x, y + setDoubleLine / 2 + setgap],
                    [x + w, y + setDoubleLine / 2 + setgap],
                ]);
                var topLines2 = new Lineadd([
                    [x, y + setDoubleLine + setgap],
                    [x, y + setgap],
                ]);
                var topLines3 = new Lineadd([
                    [x + w, y + setDoubleLine + setgap],
                    [x + w, y + setgap],
                ]);

                // 添加箭头
                var topArrows1 = new arrowsAdd([
                    [xa + setAsizeSize, y + setDoubleLine / 2 + setgap - setAsizeSize / 2],
                    [xa, y + setDoubleLine / 2 + setgap],
                    [xa + setAsizeSize, y + setDoubleLine / 2 + setgap + setAsizeSize / 2],
                ]);
                var topArrows2 = new arrowsAdd([
                    [xb + w - setAsizeSize, y + setDoubleLine / 2 + setgap - setAsizeSize / 2],
                    [xb + w, y + setDoubleLine / 2 + setgap],
                    [xb + w - setAsizeSize, y + setDoubleLine / 2 + setgap + setAsizeSize / 2],
                ]);

                // 创建文字
                var textInfo = specTextLabel(w, x + w / 2, y + setDoubleLine / 2 + setgap + setLineWeight, unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                textInfo.top += textInfo.height;
                // textInfo.left -= textInfo.width / 2;

                // 组织元素
                topLines1.move(topGroup, ElementPlacement.PLACEATBEGINNING);
                topLines2.move(topGroup, ElementPlacement.PLACEATEND);
                topLines3.move(topGroup, ElementPlacement.PLACEATEND);
                topArrows1.move(topGroup, ElementPlacement.PLACEATEND);
                topArrows2.move(topGroup, ElementPlacement.PLACEATEND);
                textInfo.move(topGroup, ElementPlacement.PLACEATBEGINNING);
                topGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }

            if (where == "Bottom") {
                var bottomGroup = specsLayer.groupItems.add();
                bottomGroup.name = "下";

                // 创建标注线
                var bottomLines1 = new Lineadd([
                    [x, y - h - (setDoubleLine / 2 + setgap)],
                    [x + w, y - h - (setDoubleLine / 2 + setgap)],
                ]);
                var bottomLines2 = new Lineadd([
                    [x, y - h - setDoubleLine - setgap],
                    [x, y - h - setgap],
                ]);
                var bottomLines3 = new Lineadd([
                    [x + w, y - h - setDoubleLine - setgap],
                    [x + w, y - h - setgap],
                ]);

                // 添加箭头
                var bottomArrows1 = new arrowsAdd([
                    [xa + setAsizeSize, y - h - (setDoubleLine / 2 + setgap) - setAsizeSize / 2],
                    [xa, y - h - (setDoubleLine / 2 + setgap)],
                    [xa + setAsizeSize, y - h - (setDoubleLine / 2 + setgap) + setAsizeSize / 2],
                ]);
                var bottomArrows2 = new arrowsAdd([
                    [xb + w - setAsizeSize, y - h - (setDoubleLine / 2 + setgap) - setAsizeSize / 2],
                    [xb + w, y - h - (setDoubleLine / 2 + setgap)],
                    [xb + w - setAsizeSize, y - h - (setDoubleLine / 2 + setgap) + setAsizeSize / 2],
                ]);

                // 创建文字
                var textInfo = specTextLabel(w, x + w / 2, y - h - setDoubleLine / 2 - (setgap + setLineWeight + 3), unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                // textInfo.left -= textInfo.width / 2;

                // 组织元素
                bottomLines1.move(bottomGroup, ElementPlacement.PLACEATBEGINNING);
                bottomLines2.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomLines3.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomArrows1.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomArrows2.move(bottomGroup, ElementPlacement.PLACEATEND);
                textInfo.move(bottomGroup, ElementPlacement.PLACEATBEGINNING);
                bottomGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }

        // 处理垂直方向标注
        if (h != 0) {
            if (where == "Left") {
                var leftGroup = specsLayer.groupItems.add();
                leftGroup.name = "左";

                // 创建标注线
                var leftLines1 = new Lineadd([
                    [x - (setDoubleLine / 2 + setgap), y],
                    [x - (setDoubleLine / 2 + setgap), y - h],
                ]);
                var leftLines2 = new Lineadd([
                    [x - setDoubleLine - setgap, y],
                    [x - setgap, y],
                ]);
                var leftLines3 = new Lineadd([
                    [x - setDoubleLine - setgap, y - h],
                    [x - setgap, y - h],
                ]);

                // 添加箭头
                var leftArrows1 = new arrowsAdd([
                    [x - (setDoubleLine / 2 + setgap) - setAsizeSize / 2, ya - setAsizeSize],
                    [x - (setDoubleLine / 2 + setgap), ya],
                    [x - (setDoubleLine / 2 + setgap) + setAsizeSize / 2, ya - setAsizeSize],
                ]);
                var leftArrows2 = new arrowsAdd([
                    [x - (setDoubleLine / 2 + setgap) - setAsizeSize / 2, yb - h + setAsizeSize],
                    [x - (setDoubleLine / 2 + setgap), yb - h],
                    [x - (setDoubleLine / 2 + setgap) + setAsizeSize / 2, yb - h + setAsizeSize],
                ]);

                // 创建文字
                var textInfo = specTextLabel(h, x - (setDoubleLine / 2 + setgap + setLineWeight + 5), y - h / 2, unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.RIGHT;
                textInfo.top += textInfo.height / 2;
                // textInfo.left -= textInfo.width + 5;

                // 组织元素
                leftLines1.move(leftGroup, ElementPlacement.PLACEATBEGINNING);
                leftLines2.move(leftGroup, ElementPlacement.PLACEATEND);
                leftLines3.move(leftGroup, ElementPlacement.PLACEATEND);
                leftArrows1.move(leftGroup, ElementPlacement.PLACEATEND);
                leftArrows2.move(leftGroup, ElementPlacement.PLACEATEND);
                textInfo.move(leftGroup, ElementPlacement.PLACEATBEGINNING);
                leftGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }

            if (where == "Right") {
                var rightGroup = specsLayer.groupItems.add();
                rightGroup.name = "右";

                // 创建标注线
                var rightLines1 = new Lineadd([
                    [x + w + setDoubleLine / 2 + setgap, y],
                    [x + w + setDoubleLine / 2 + setgap, y - h],
                ]);
                var rightLines2 = new Lineadd([
                    [x + w + setDoubleLine + setgap, y],
                    [x + w + setgap, y],
                ]);
                var rightLines3 = new Lineadd([
                    [x + w + setDoubleLine + setgap, y - h],
                    [x + w + setgap, y - h],
                ]);

                // 添加箭头
                var rightArrows1 = new arrowsAdd([
                    [x + w + setDoubleLine / 2 + setgap - setAsizeSize / 2, ya - setAsizeSize],
                    [x + w + setDoubleLine / 2 + setgap, ya],
                    [x + w + setDoubleLine / 2 + setgap + setAsizeSize / 2, ya - setAsizeSize],
                ]);
                var rightArrows2 = new arrowsAdd([
                    [x + w + setDoubleLine / 2 + setgap - setAsizeSize / 2, yb - h + setAsizeSize],
                    [x + w + setDoubleLine / 2 + setgap, yb - h],
                    [x + w + setDoubleLine / 2 + setgap + setAsizeSize / 2, yb - h + setAsizeSize],
                ]);

                // 创建文字
                var textInfo = specTextLabel(h, x + w + setDoubleLine / 2 + setgap + setLineWeight + 5, y - h / 2, unitConvert);
                // 文字居中
                textInfo.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
                textInfo.top += textInfo.height / 2;

                // 组织元素
                rightLines1.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                rightLines2.move(rightGroup, ElementPlacement.PLACEATEND);
                rightLines3.move(rightGroup, ElementPlacement.PLACEATEND);
                rightArrows1.move(rightGroup, ElementPlacement.PLACEATEND);
                rightArrows2.move(rightGroup, ElementPlacement.PLACEATEND);
                textInfo.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                rightGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }
    }

    // 创建标注文字函数
    function specTextLabel(val, x, y, wheres) {
        var textInfo = doc.textFrames.add();
        try {
            textInfo.textRange.characterAttributes.textFont = app.textFonts.getByName("ArialMT");
        } catch (error) {}
        textInfo.textRange.characterAttributes.size = fontSize;
        textInfo.textRange.characterAttributes.fillColor = color;
        textInfo.textRange.characterAttributes.alignment = StyleRunAlignmentType.center;

        var value = val;
        var unitsInfo = "";

        // 单位转换
        switch (wheres) {
            case "auto":
                switch (doc.rulerUnits) {
                    case RulerUnits.Millimeters:
                        value = new UnitValue(value, "pt").as("mm");
                        unitsInfo = " mm";
                        break;
                    case RulerUnits.Centimeters:
                        value = new UnitValue(value, "pt").as("cm");
                        unitsInfo = " cm";
                        break;
                    case RulerUnits.Pixels:
                        value = new UnitValue(value, "pt").as("px");
                        unitsInfo = " px";
                        break;
                    case RulerUnits.Inches:
                        value = new UnitValue(value, "pt").as("in");
                        unitsInfo = "″";
                        break;
                    case RulerUnits.Picas:
                        value = new UnitValue(value, "pt").as("pc");
                        var vd = value - Math.floor(value);
                        vd = 12 * vd;
                        value = Math.floor(value) + "p" + vd.toFixed(setDecimals);
                        break;
                    default:
                        value = new UnitValue(value, "pt").as("pt");
                        unitsInfo = " pt";
                }
                break;
            case "mm":
                value = new UnitValue(value, "pt").as("mm");
                unitsInfo = " mm";
                break;
            case "cm":
                value = new UnitValue(value, "pt").as("cm");
                unitsInfo = " cm";
                break;
            case "m":
                value = new UnitValue(value, "pt").as("m");
                unitsInfo = " m";
                break;
            case "pt":
                value = new UnitValue(value, "pt").as("pt");
                unitsInfo = " pt";
                break;
            case "px":
                value = new UnitValue(value, "pt").as("px");
                unitsInfo = " px";
                break;
            case "in":
                value = new UnitValue(value, "pt").as("in");
                unitsInfo = "″";
                break;
            case "ft":
                value = new UnitValue(value, "pt").as("ft");
                unitsInfo = " ft";
                break;
            case "pc":
                value = new UnitValue(value, "pt").as("pc");
                var vd = value - Math.floor(value);
                vd = 12 * vd;
                value = Math.floor(value) + "p" + vd.toFixed(setDecimals);
                break;
        }

        value = value.toString().replace(/-/g, "");
        if (wheres != "pc") {
            value = parseFloat(value).toFixed(setDecimals);
        }

        // 如果小数位是0，则去掉小数点和0
        var zeros = "";
        for (var i = 0; i < setDecimals; i++) {
            zeros += "0";
        }
        if (value.slice(-setDecimals) === zeros) {
            value = value.slice(0, -setDecimals - 1);
        }

        textInfo.contents = value + unitsInfo;
        textInfo.top = y;
        textInfo.left = x;
        return textInfo;
    }
}
