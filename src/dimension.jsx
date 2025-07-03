//@target illustrator
//@targetengine main

// 脚本版本信息
var VersionInfo = "v0.0.5";
// 标注图层名称
var layName = "尺寸标注层";
// 标注颜色（CMYK模式）
var color = new CMYKColor();

var bit = 64; // AI软件系统位数，默认64位，如果点击按钮没有反应，可以将64改为32。
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

// 实际代码建立 buildMsg(code) 函数传送代码
function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.send();
    } catch (e) {
        alert(e);
    }
}

// 标注位置默认值
var topCheck = false;
var rightCheck = false;
var bottomCheck = false;
var leftCheck = false;

// 标注样式默认值
var fontSize = 12; // 字号大小（默认12pt）
var setDecimals = 2; // 小数位数（默认2位）
var setLineWeight = 0.5; // 线条粗细（默认0.5pt）
var setgap = 3; // 标注线与对象的间距（默认3pt）
var setDoubleLine = 8; // 标注线两端的短线长度（默认8pt）
var setAsizeSize = 6; // 箭头大小（默认6pt）

// 标注颜色CMYK值
color.cyan = 0; // 青色分量
color.magenta = 0; // 品红分量
color.yellow = 0; // 黄色分量
color.black = 100; // 黑色分量

// 创建主对话框窗口
var res =
    "palette { \
    text: '标注尺寸 " +
    VersionInfo +
    "', \
    closeButton: false, \
    alignChildren: 'fill', \
    spacing: 10, \
    margins: 16, \
    dimensionPanel: Panel { \
        text: '选择标注边', \
        orientation: 'column', \
        alignChildren: 'center', \
        margins: 16, \
        spacing: 10, \
        directionGroup: Group { \
            orientation: 'row', \
            spacing: 10, \
            topCheckbox: Checkbox { text: '上边', value: false }, \
            rightCheckbox: Checkbox { text: '右边', value: false }, \
            bottomCheckbox: Checkbox { text: '下边', value: true }, \
            leftCheckbox: Checkbox { text: '左边', value: true } \
        } \
    }, \
    optionsPanel: Panel { \
        text: '设置选项', \
        orientation: 'column', \
        alignChildren: 'right', \
        margins: 16, \
        spacing: 10, \
        unitGroup: Group { \
            orientation: 'row', \
            spacing: 5, \
            unitModeLabel: StaticText { text: '单位:' }, \
            unitModeList: DropDownList { alignment: 'fill', preferredSize: [150, -1] } \
        }, \
        fontSizeGroup: Group { \
            orientation: 'row', \
            spacing: 10, \
            label: StaticText { text: '字号大小:' }, \
            value: EditText { characters: 4 }, \
        }, \
        colorGroup: Group { \
            orientation: 'row', \
            spacing: 10, \
            label: StaticText { text: 'CMYK:' }, \
            cyan: EditText { characters: 4 }, \
            magenta: EditText { characters: 4 }, \
            yellow: EditText { characters: 4 }, \
            black: EditText { characters: 4 }, \
        } \
    }, \
    buttonGroup: Group { \
        orientation: 'row', \
        alignment: 'center', \
        spacing: 10, \
        ok_button: Button { text: '确定', name: 'ok' }, \
        cancel_button: Button { text: '取消', name: 'cancel' } \
    } \
}";

var win = new Window(res);

// 定义可选单位列表
var items = new Array("自动-auto", "毫米-mm", "厘米-cm", "米-m", "磅-pt", "像素-px", "英寸-in", "英尺-ft", "派卡-pc");

// 添加单位选项到下拉列表
for (var j = 0; j < items.length; j += 1) {
    if (j == 0) {
        win.optionsPanel.unitGroup.unitModeList.add("item", items[0]);
        win.optionsPanel.unitGroup.unitModeList.add("separator");
    } else {
        win.optionsPanel.unitGroup.unitModeList.add("item", items[j]);
    }
}
win.optionsPanel.unitGroup.unitModeList.selection = 0;

// 设置 CMYK 默认值
win.optionsPanel.colorGroup.cyan.text = color.cyan;
win.optionsPanel.colorGroup.magenta.text = color.magenta;
win.optionsPanel.colorGroup.yellow.text = color.yellow;
win.optionsPanel.colorGroup.black.text = color.black;

win.optionsPanel.fontSizeGroup.value.text = fontSize;

// 添加按钮事件
win.buttonGroup.ok_button.onClick = function () {
    buildMsg("label_Info();");
};
win.buttonGroup.cancel_button.onClick = function () {
    win.close();
};

// 标注信息处理函数
function label_Info() {
    var doc = app.activeDocument;
    var sel = doc.selection;

    if (sel.length <= 0) {
        return alert("请先选择标注对象！");
    }

    // 获取标注边的选择状态
    var top = win.dimensionPanel.directionGroup.topCheckbox.value;
    var left = win.dimensionPanel.directionGroup.leftCheckbox.value;
    var right = win.dimensionPanel.directionGroup.rightCheckbox.value;
    var bottom = win.dimensionPanel.directionGroup.bottomCheckbox.value;

    if (!top && !left && !right && !bottom) {
        return alert("请至少选择一个标注边。");
    }

    try {
        setCMKY();
        setFontSize();
    } catch (error) {
        return alert(error);
    }

    // 获取单位设置
    var unitConvert = win.optionsPanel.unitGroup.unitModeList.selection.toString().replace(/[^a-zA-Z]/g, "");

    // 处理标注图层
    // try {
    //     var specsLayer = doc.layers[layName];
    //     specsLayer.locked = false;
    //     specsLayer.visible = true;
    // } catch (err) {
    //     var specsLayer = doc.layers.add();
    //     specsLayer.name = layName;
    // }

    var specsLayer = doc.activeLayer
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
                var textInfo = specTextLabel(
                    w,
                    x + w / 2,
                    y - h - setDoubleLine / 2 - (setgap + setLineWeight + 3),
                    unitConvert,
                );
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
                var textInfo = specTextLabel(
                    h,
                    x - (setDoubleLine / 2 + setgap + setLineWeight + 5),
                    y - h / 2,
                    unitConvert,
                );
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
                var textInfo = specTextLabel(
                    h,
                    x + w + setDoubleLine / 2 + setgap + setLineWeight + 5,
                    y - h / 2,
                    unitConvert,
                );
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

/**
 * 校验 CMKY
 */
function checkCMKY() {
    var validCyanColor =
        /^[0-9]{1,3}$/.test(win.optionsPanel.colorGroup.cyan.text) &&
        parseInt(win.optionsPanel.colorGroup.cyan.text) >= 0 &&
        parseInt(win.optionsPanel.colorGroup.cyan.text) <= 100;
    var validMagentaColor =
        /^[0-9]{1,3}$/.test(win.optionsPanel.colorGroup.magenta.text) &&
        parseInt(win.optionsPanel.colorGroup.magenta.text) >= 0 &&
        parseInt(win.optionsPanel.colorGroup.magenta.text) <= 100;
    var validYellowColor =
        /^[0-9]{1,3}$/.test(win.optionsPanel.colorGroup.yellow.text) &&
        parseInt(win.optionsPanel.colorGroup.yellow.text) >= 0 &&
        parseInt(win.optionsPanel.colorGroup.yellow.text) <= 100;
    var validBlackColor =
        /^[0-9]{1,3}$/.test(win.optionsPanel.colorGroup.black.text) &&
        parseInt(win.optionsPanel.colorGroup.black.text) >= 0 &&
        parseInt(win.optionsPanel.colorGroup.black.text) <= 100;

    return validCyanColor && validMagentaColor && validYellowColor && validBlackColor;
}

function setCMKY() {
    if (!checkCMKY()) {
        throw new Error("CMKY 颜色设置有误");
    } else {
        color.cyan = win.optionsPanel.colorGroup.cyan.text;
        color.magenta = win.optionsPanel.colorGroup.magenta.text;
        color.yellow = win.optionsPanel.colorGroup.yellow.text;
        color.black = win.optionsPanel.colorGroup.black.text;
    }
}

function setFontSize() {
    if (!/^[0-9]{1,3}(\.[0-9]{1,3})?$/.test(win.optionsPanel.fontSizeGroup.value.text)) {
        throw new Error("字号大小设置有误");
    }
    fontSize = win.optionsPanel.fontSizeGroup.value.text;
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

win.show();
