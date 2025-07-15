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
        } else if (item.typename === "CompoundPathItem") {
            // 处理复合路径中的每个路径项
            for (var i = 0; i < item.pathItems.length; i++) {
                var pathItem = item.pathItems[i];
                if (pathItem.filled && pathItem.fillColor) {
                    addColor(pathItem.fillColor);
                }
            }
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
        } else if (item.typename === "CompoundPathItem") {
            // 处理复合路径中的每个路径项
            for (var i = 0; i < item.pathItems.length; i++) {
                var pathItem = item.pathItems[i];
                if (pathItem.filled && pathItem.fillColor) {
                    addColor(pathItem.fillColor);
                }
            }
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
 * 给金属描边
 */
function metalEdging() {
    try {
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

function fn1() {
    alert("内部 fn1");
}

function exportBtnFn() {
    hideNotMetalColor();
    exportToPSD("图.psd");
    app.undo();
    app.redraw();

    hideMetalColor();
    exportToPSD("色.psd");
    app.undo();
    app.redraw();
}

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
var PC = win.add("panel");
PC.alignChildren = ["fill", "fill"];
var sidePanel = PC.add("panel", undefined, "选择标注边");
sidePanel.orientation = "row";
sidePanel.margins = 16;
sidePanel.spacing = 8;
var topCheckBox = sidePanel.add("checkbox", undefined, "上边");
var rightCheckbox = sidePanel.add("checkbox", undefined, "右边");
var bottomCheckbox = sidePanel.add("checkbox", undefined, "下边");
var leftCheckbox = sidePanel.add("checkbox", undefined, "左边");
bottomCheckbox.value = true;
leftCheckbox.value = true;

var unitPanelAndFontSizePanelGroup = PC.add("group");
unitPanelAndFontSizePanelGroup.orientation = "row";

var unitPanel = unitPanelAndFontSizePanelGroup.add("panel", undefined, "选择单位");
unitPanel.orientation = "row";
unitPanel.margins = 16;
unitPanel.spacing = 8;
var unitControl = unitPanel.add("dropdownlist", undefined);
unitControl.preferredSize = [80, -1];
// 定义可选单位列表
var unitItems = ["英寸-in", "毫米-mm", "厘米-cm", "米-m", "磅-pt", "像素-px", "英尺-ft", "派卡-pc"];
// 添加单位选项到下拉列表
for (var i = 0; i < unitItems.length; i++) {
    unitControl.add("item", unitItems[i]);
    // if (i == 0) {
    //     unitControl.add("item", unitItems[0]);
    //     unitControl.add("separator");
    // } else {
    //     unitControl.add("item", unitItems[i]);
    // }
}
// 设置单位选项默认选择第一个
unitControl.selection = 0;

// ==== 标注寸尺 字号大小
var fontSizePanel = unitPanelAndFontSizePanelGroup.add("panel", undefined, "字号大小");
fontSizePanel.orientation = "row";
fontSizePanel.margins = 16;
fontSizePanel.spacing = 8;
var fontSizeControl = fontSizePanel.add("editText", undefined, "10");
fontSizeControl.preferredSize = [80, -1];

win.onClose = function () {
    // alert('关闭')
};

win.show();
