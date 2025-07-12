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

var METALCOLOR = new RGBColor();
METALCOLOR.red = 0;
METALCOLOR.green = 0;
METALCOLOR.blue = 0;

function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.send();
    } catch (error) { }
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

function getAllColors() {
    var doc = app.activeDocument;
    var colors = [];

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else {
            // 处理填充颜色
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
            }
        }
    }

    // 遍历所有页面项目
    if (doc && doc.pageItems.length > 0) {
        for (var i = 0; i < doc.pageItems.length; i++) {
            collectColors(doc.pageItems[i]);
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
function exportToPSD(name) {
    try {
        // 获取当前文档
        var doc = app.activeDocument;

        // 设置导出选项
        var psdOptions = new ExportOptionsPhotoshop();
        psdOptions.layers = true; // 保留图层
        psdOptions.embedLinkedFiles = true; // 嵌入链接文件

        // 导出为 PSD 文件
        // var file = new File(doc.path + "/" + doc.name.replace(/\.[^\.]+$/, "") + ".psd");
        var file = new File(Folder.desktop + "/" + name);
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
        exportToPSD(fileName + ".psd");

        // 恢复所有项的显示状态
        app.undo();
        app.redraw();
    }
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

var PA = win.add("panel");
PA.orientation = "row";
PA.BTN1 = PA.add("button", undefined, "识别颜色并导出 - PSD");
PA.BTN2 = PA.add("button", undefined, "识别颜色并导出 - AI");
PA.BTN1.onClick = function () {
    buildMsg("analyzeColorsAndExportPSD();");
};
PA.BTN2.onClick = function () {
    buildMsg("analyzeColorsAndExportAI();");
};

var PB = win.add("panel");
PB.alignChildren = ["fill", "fill"];

var sidePanel = PB.add("panel", undefined, "选择标注边");
sidePanel.orientation = "row";
sidePanel.margins = 16;
sidePanel.spacing = 8;
var topCheckBox = sidePanel.add("checkbox", undefined, "上边");
var rightCheckbox = sidePanel.add("checkbox", undefined, "右边");
var bottomCheckbox = sidePanel.add("checkbox", undefined, "下边");
var leftCheckbox = sidePanel.add("checkbox", undefined, "左边");
bottomCheckbox.value = true;
leftCheckbox.value = true;

var unitPanelAndFontSizePanelGroup = PB.add("group");
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

win.show();
