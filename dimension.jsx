// 脚本版本信息
var VersionInfo = "v2.5";
// 标注图层名称
var layName = "尺寸标注层";
// 标注颜色（CMYK模式）
var color = new CMYKColor();

// 标注位置默认值及其环境变量设置
// 上边标注
var topCheck = false;
// 右边标注
var rightCheck = false;
// 下边标注
var bottomCheck = false;
// 左边标注
var leftCheck = false;

// 标注模式默认值及其环境变量设置
// 单体标注模式（默认开启）
var eachLength = true;
var defaultEachLength = $.getenv("Specify_defaultEachLength") ? convertToBoolean($.getenv("Specify_defaultEachLength")) : eachLength;
// 间距标注模式
var betweenLength = false;
var defaultObjBetween = $.getenv("Specify_defaultObjBetween") ? convertToBoolean($.getenv("Specify_defaultObjBetween")) : betweenLength;
// 总距离标注模式
var overallLength = false;
var defaultOverallLength = $.getenv("Specify_defaultOverallLength") ? convertToBoolean($.getenv("Specify_defaultOverallLength")) : overallLength;
// 标注样式默认值及其环境变量设置
// 字体样式（默认为黑体）
var setFaceFont = 2;
var defaultFontFace = $.getenv("Specify_defaultFontFace") ? $.getenv("Specify_defaultFontFace") : setFaceFont;
// 单位模式（默认为自动）
var setUnitMode = 0;
var defaultUnitMode = $.getenv("Specify_defaultUnitMode") ? $.getenv("Specify_defaultUnitMode") : setUnitMode;
// 比例（默认为1:1）
var setScale = 0;
var defaultScale = $.getenv("Specify_defaultScale") ? $.getenv("Specify_defaultScale") : setScale;
// 字号大小（默认12pt）
var setFontSize = 12;
var defaultFontSize = $.getenv("Specify_defaultFontSize") ? $.getenv("Specify_defaultFontSize") : setFontSize;
// 小数位数（默认2位）
var setDecimals = 2;
var defaultDecimals = $.getenv("Specify_defaultDecimals") ? $.getenv("Specify_defaultDecimals") : setDecimals;
// 线条粗细（默认0.5pt）
var setLineWeight = 0.5;
var defaultLineWeight = $.getenv("Specify_defaultLineWeight") ? $.getenv("Specify_defaultLineWeight") : setLineWeight;
// 标注线与对象的间距（默认3pt）
var setgap = 3;
var defaultlineGap = $.getenv("Specify_defaultlineGap") ? $.getenv("Specify_defaultlineGap") : setgap;
// 标注线两端的短线长度（默认8pt）
var setDoubleLine = 8;
var defaultDoubleLine = $.getenv("Specify_defaultDoubleLine") ? $.getenv("Specify_defaultDoubleLine") : setDoubleLine;
// 箭头设置及其环境变量
// 是否显示箭头
var setArrow = false;
var defaultArrow = $.getenv("Specify_defaultArrow") ? convertToBoolean($.getenv("Specify_defaultArrow")) : setArrow;
// 箭头大小（默认6pt）
var setAsizeSize = 6;
var defaultTriangleSize = $.getenv("Specify_defaultTriangleSize") ? $.getenv("Specify_defaultTriangleSize") : setAsizeSize;
// 箭头是否填充
var setArrowSealing = false;
var defaultArrowSealing = $.getenv("Specify_defaultArrowSealing") ? convertToBoolean($.getenv("Specify_defaultArrowSealing")) : setArrowSealing;

// 标注颜色CMYK值及其环境变量
// 青色分量（默认0%）
var setCyan = 0;
var defaultColorCyan = $.getenv("Specify_defaultColorCyan") ? $.getenv("Specify_defaultColorCyan") : setCyan;
// 品红分量（默认100%）
var setMagenta = 100;
var defaultColorMagenta = $.getenv("Specify_defaultColorMagenta") ? $.getenv("Specify_defaultColorMagenta") : setMagenta;
// 黄色分量（默认100%）
var setYellow = 100;
var defaultColorYellow = $.getenv("Specify_defaultColorYellow") ? $.getenv("Specify_defaultColorYellow") : setYellow;
// 黑色分量（默认10%）
var setBlack = 10;
var defaultColorBlack = $.getenv("Specify_defaultColorBlack") ? $.getenv("Specify_defaultColorBlack") : setBlack;

// 其他设置及其环境变量
// 是否显示单位后缀
var setUnits = false;
var defaultUnits = $.getenv("Specify_defaultUnits") ? convertToBoolean($.getenv("Specify_defaultUnits")) : setUnits;
// 是否包含对象描边
var lineStrokes = false;
var defaultLineStrokes = $.getenv("Specify_defaultLineStrokes") ? convertToBoolean($.getenv("Specify_defaultLineStrokes")) : lineStrokes;
// 是否锁定标注图层
var setlockedLay = false;
var defaultlockedLay = $.getenv("Specify_defaultlockedLay") ? convertToBoolean($.getenv("Specify_defaultlockedLay")) : setlockedLay;
// 创建主对话框窗口
var win = new Window("dialog", "标注尺寸 " + VersionInfo, undefined, {
    closeButton: false, // 禁用关闭按钮
});

// 创建标注边选择面板
dimensionPanel = win.add("group", [0, 0, 290, 90]);
dimensionGroup = dimensionPanel.add("panel", [0, 0, 290, 90], "选择标注边");

// 添加左边标注复选框
leftCheckbox = dimensionGroup.add("checkbox", [66, 35, 116, 50], "左边");
leftCheckbox.value = true; // 默认选中
// 添加下边标注复选框
bottomCheckbox = dimensionGroup.add("checkbox", [121, 60, 171, 75], "下边");
bottomCheckbox.value = true; // 默认选中
// 添加上边标注复选框
topCheckbox = dimensionGroup.add("checkbox", [121, 10, 171, 25], "上边");
topCheckbox.value = false;
// 添加右边标注复选框
rightCheckbox = dimensionGroup.add("checkbox", [176, 35, 226, 50], "右边");
rightCheckbox.value = false;

// 创建设置选项面板
optionsPanel = win.add("group", [0, 0, 290, 260]);
modeChecksGroup = optionsPanel.add("panel", [0, 0, 290, 260], "设置选项");

// 添加单位选择下拉列表
unitModeLabel = modeChecksGroup.add("statictext", [10, 48, 55, 63], "单位:"); // 标签文本
unitModeList = modeChecksGroup.add("dropdownlist", [55, 45, 150, 65]); // 下拉列表控件
unitModeList.helpTip = "标注值的单位转换。\n默认: 自动（随软件）"; // 提示信息

// 定义可选单位列表
var items = new Array("自动-auto", "毫米-mm", "厘米-cm", "米-m", "磅-pt", "像素-px", "英寸-in", "英尺-ft", "派卡-pc");

// 添加单位选项到下拉列表
for (var j = 0; j < items.length; j += 1) {
    if (j == 0) {
        unitModeList.add("item", items[0]); // 添加第一个选项（自动）
        unitModeList.add("separator"); // 添加分隔线
    } else {
        unitModeList.add("item", items[j]); // 添加其他单位选项
    }
}
// 设置单位下拉列表的默认选项和事件处理
unitModeList.selection = defaultUnitMode; // 使用环境变量设置默认选项

var buttonGroup = win.add("group");
buttonGroup.alignment = "column";
ok_button = buttonGroup.add("button", undefined, "确定", {
    name: "ok",
});
ok_button.helpTip = "确定请按回车键";
cancel_button = buttonGroup.add("button", undefined, "取消", {
    name: "cancel",
});
cancel_button.helpTip = "取消请按Esc键";
ok_button.size = cancel_button.size = [80, 25];
ok_button.onClick = do_DIMENSIONS;
cancel_button.onClick = function () {
    win.close();
};
win.show();

// 执行标注尺寸的主函数
function do_DIMENSIONS() {
    find_message(); // 调用消息处理函数
}

// 消息处理函数
function find_message() {
    if (check_app() == false) {
        // 检查应用程序状态
        return;
    }
    label_Info(); // 处理标注信息
}

// 处理标注信息的函数
function label_Info() {
    var doc = app.activeDocument; // 获取当前文档
    var sel = doc.selection; // 获取选中对象

    // 获取标注边的选择状态
    var top = topCheckbox.value;
    var left = leftCheckbox.value;
    var right = rightCheckbox.value;
    var bottom = bottomCheckbox.value;

    // 验证至少选择了一个标注边
    if (!top && !left && !right && !bottom) {
        alert("请至少选择一个标注边。", "信息提示");
        return;
    }

    // 处理单位设置并保存到环境变量
    var theUnitModeList = unitModeList.selection.toString().replace(/[^a-zA-Z]/g, ""); // 提取单位字母
    unitConvert = theUnitModeList; // 设置单位转换值
    $.setenv("Specify_defaultUnitMode", unitModeList.selection.index); // 保存单位模式索引

    scale = 1; // 设置比例
    tsize = setFontSize; // 使用默认字号
    decimals = setDecimals; // 使用默认小数位数
    LineW = setLineWeight; // 使用默认线宽
    Gap = setgap; // 使用默认标线距离
    Gaps = setgap; // 使用默认标线间距
    limitLen = setDoubleLine; // 使用默认界线长度
    asize = setAsizeSize; // 使用默认箭头尺寸
    // 设置CMYK颜色值
    color.cyan = setCyan; // 设置青色值
    color.magenta = setMagenta; // 设置品红值
    color.yellow = setYellow; // 设置黄色值
    color.black = setBlack; // 设置黑色值

    // 处理标注图层
    try {
        var specsLayer = doc.layers[layName]; // 尝试获取已存在的标注图层
        specsLayer.locked = false; // 解锁图层
        specsLayer.visible = true; // 设置图层可见
    } catch (err) {
        var specsLayer = doc.layers.add(); // 如果图层不存在，创建新图层
        specsLayer.name = layName; // 设置图层名称
    }
    var itemsGroup = specsLayer.groupItems.add(); // 在标注图层中添加组
    // 处理单体标注模式
    if (sel.length > 0) {
        // 如果有选中对象且选择了单体标注
        labelGroupNames = "单体"; // 设置标注组名称
        // 根据选择的标注边添加标注
        if (top) {
            Each_DIMENSIONS(sel[0], "Top"); // 添加上边标注
        }
        if (left) {
            Each_DIMENSIONS(sel[0], "Left"); // 添加左边标注
        }
        if (right) {
            Each_DIMENSIONS(sel[0], "Right"); // 添加右边标注
        }
        if (bottom) {
            Each_DIMENSIONS(sel[0], "Bottom"); // 添加下边标注
        }
    }

    // 单体标注函数：为每个选中对象添加标注
    function Each_DIMENSIONS(bound, where) {
        var bound = new Array(); // 创建边界数组
        for (var i = 0; i < sel.length; i += 1) {
            // 遍历所有选中对象
            a = NO_CLIP_BOUNDS(sel[i]); // 获取对象边界（考虑剪切蒙版）
            bound[0] = a[0]; // 左边界
            bound[1] = a[1]; // 上边界
            bound[2] = a[2]; // 右边界
            bound[3] = a[3]; // 下边界
            linedraw(bound, where); // 绘制标注线
        }
    }

    /**
     * 添加线条函数：创建一个新的路径项并设置其属性
     * @param {Array} geo - 线条的路径点数组
     * @returns {PathItem} 创建的线条对象
     */
    function Lineadd(geo) {
        var Linename = itemsGroup.pathItems.add(); // 在标注组中创建新的路径项
        Linename.setEntirePath(geo); // 设置路径点
        Linename.stroked = true; // 启用描边
        Linename.strokeWidth = LineW; // 设置线宽
        Linename.strokeColor = color; // 设置线条颜色
        Linename.filled = false; // 禁用填充
        Linename.strokeCap = StrokeCap.BUTTENDCAP; // 设置线条端点样式为平头
        return Linename; // 返回创建的线条对象
    }

    /**
     * 添加箭头函数：创建箭头路径并设置其样式
     * @param {Array} geoAR - 箭头的路径点数组
     * @returns {PathItem} 创建的箭头对象
     */
    function arrowsAdd(geoAR) {
        var arrowName = itemsGroup.pathItems.add(); // 在标注组中创建新的路径项
        arrowName.setEntirePath(geoAR); // 设置箭头路径点
        if (true) {
            // 如果选择了箭头填充
            arrowName.stroked = false; // 禁用描边
            arrowName.strokeColor = NoColor; // 设置描边颜色为无
            arrowName.filled = true; // 启用填充
            arrowName.fillColor = color; // 设置填充颜色
            arrowName.closed = true; // 闭合路径
        } else {
            // 如果未选择箭头填充
            arrowName.stroked = true; // 启用描边
            arrowName.strokeWidth = LineW; // 设置线宽
            arrowName.strokeColor = color; // 设置描边颜色
            arrowName.filled = false; // 禁用填充
            arrowName.fillColor = NoColor; // 设置填充颜色为无
            arrowName.strokeJoin = StrokeJoin.ROUNDENDJOIN; // 设置线条连接处为圆角
            arrowName.strokeCap = StrokeCap.BUTTENDCAP; // 设置线条端点为平头
            arrowName.closed = false; // 不闭合路径
        }
        return arrowName; // 返回创建的箭头对象
    }

    /**
     * 绘制标注线函数：根据边界和位置绘制标注线、箭头和文字
     * @param {Array} bound - 对象的边界数组 [左, 上, 右, 下]
     * @param {String} where - 标注位置（"Top", "Bottom", "Left", "Right"）
     */
    function linedraw(bound, where) {
        var x = bound[0]; // 左边界
        var y = bound[1]; // 上边界
        var w = bound[2] - bound[0]; // 宽度
        var h = bound[1] - bound[3]; // 高度
        // 处理负宽度情况，确保箭头位置正确
        if (w < 0) {
            xa = x + w; // 调整箭头X坐标起点
            xb = x - w; // 调整箭头X坐标终点
        } else {
            xa = xb = x; // 正常宽度时箭头X坐标
        }
        // 处理负高度情况，确保箭头位置正确
        if (h < 0) {
            ya = y - h; // 调整箭头Y坐标起点
            yb = y + h; // 调整箭头Y坐标终点
        } else {
            ya = yb = y; // 正常高度时箭头Y坐标
        }
        // 如果对象有宽度，处理水平方向的标注
        if (w != 0) {
            // 处理上边标注
            if (where == "Top") {
                var topGroup = specsLayer.groupItems.add(); // 创建上边标注组
                topGroup.name = "上_" + labelGroupNames; // 设置标注组名称
                // 创建水平标注线
                var topLines1 = new Lineadd([
                    [x, y + limitLen / 2 + Gap], // 左端点
                    [x + w, y + limitLen / 2 + Gap], // 右端点
                ]);
                // 创建左侧垂直界线
                var topLines2 = new Lineadd([
                    [x, y + limitLen + Gap], // 上端点
                    [x, y + Gap], // 下端点
                ]);
                // 创建右侧垂直界线
                var topLines3 = new Lineadd([
                    [x + w, y + limitLen + Gap], // 上端点
                    [x + w, y + Gap], // 下端点
                ]);
                // 将标注线添加到标注组中
                topLines1.move(topGroup, ElementPlacement.PLACEATBEGINNING);
                topLines2.move(topGroup, ElementPlacement.PLACEATEND);
                topLines3.move(topGroup, ElementPlacement.PLACEATEND);
                // 如果启用了箭头显示
                if (true) {
                    // 创建左侧箭头
                    var topArrows1 = new arrowsAdd([
                        [xa + asize, y + limitLen / 2 + Gap - asize / 2], // 箭头左上点
                        [xa, y + limitLen / 2 + Gap], // 箭头尖端
                        [xa + asize, y + limitLen / 2 + Gap + asize / 2], // 箭头左下点
                    ]);
                    // 创建右侧箭头
                    var topArrows2 = new arrowsAdd([
                        [xb + w - asize, y + limitLen / 2 + Gap - asize / 2], // 箭头右上点
                        [xb + w, y + limitLen / 2 + Gap], // 箭头尖端
                        [xb + w - asize, y + limitLen / 2 + Gap + asize / 2], // 箭头右下点
                    ]);
                    // 将箭头添加到标注组中
                    topArrows1.move(topGroup, ElementPlacement.PLACEATEND);
                    topArrows2.move(topGroup, ElementPlacement.PLACEATEND);
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(w, x + w / 2, y + limitLen / 2 + Gap + LineW, unitConvert);
                textInfo.top += textInfo.height; // 调整文字垂直位置
                textInfo.left -= textInfo.width / 2; // 文字水平居中
                textInfo.move(topGroup, ElementPlacement.PLACEATBEGINNING);
                // 将整个标注组添加到主标注组中
                topGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
            // 处理下边标注
            if (where == "Bottom") {
                var bottomGroup = specsLayer.groupItems.add(); // 创建下边标注组
                bottomGroup.name = "下_" + labelGroupNames; // 设置标注组名称
                // 创建水平标注线
                var bottomLines1 = new Lineadd([
                    [x, y - h - (limitLen / 2 + Gap)], // 左端点
                    [x + w, y - h - (limitLen / 2 + Gap)], // 右端点
                ]);
                // 创建左侧垂直界线
                var bottomLines2 = new Lineadd([
                    [x, y - h - limitLen - Gap], // 上端点
                    [x, y - h - Gap], // 下端点
                ]);
                // 创建右侧垂直界线
                var bottomLines3 = new Lineadd([
                    [x + w, y - h - limitLen - Gap], // 上端点
                    [x + w, y - h - Gap], // 下端点
                ]);
                // 将标注线添加到标注组中
                bottomLines1.move(bottomGroup, ElementPlacement.PLACEATBEGINNING);
                bottomLines2.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomLines3.move(bottomGroup, ElementPlacement.PLACEATEND);
                // 如果启用了箭头显示
                if (true) {
                    // 创建左侧箭头
                    var bottomArrows1 = new arrowsAdd([
                        [xa + asize, y - h - (limitLen / 2 + Gap) - asize / 2], // 箭头左上点
                        [xa, y - h - (limitLen / 2 + Gap)], // 箭头尖端
                        [xa + asize, y - h - (limitLen / 2 + Gap) + asize / 2], // 箭头左下点
                    ]);
                    // 创建右侧箭头
                    var bottomArrows2 = new arrowsAdd([
                        [xb + w - asize, y - h - (limitLen / 2 + Gap) - asize / 2], // 箭头右上点
                        [xb + w, y - h - (limitLen / 2 + Gap)], // 箭头尖端
                        [xb + w - asize, y - h - (limitLen / 2 + Gap) + asize / 2], // 箭头右下点
                    ]);
                    // 将箭头添加到标注组中
                    bottomArrows1.move(bottomGroup, ElementPlacement.PLACEATEND);
                    bottomArrows2.move(bottomGroup, ElementPlacement.PLACEATEND);
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(w, x + w / 2, y - h - limitLen / 2 - (Gap + LineW), unitConvert);
                textInfo.top -= 0; // 保持文字垂直位置不变
                textInfo.left -= textInfo.width / 2; // 文字水平居中
                textInfo.move(bottomGroup, ElementPlacement.PLACEATBEGINNING);
                // 将整个标注组添加到主标注组中
                bottomGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }
        // 如果对象有高度，处理垂直方向的标注
        if (h != 0) {
            // 处理左边标注
            if (where == "Left") {
                var leftGroup = specsLayer.groupItems.add(); // 创建左边标注组
                leftGroup.name = "左_" + labelGroupNames; // 设置标注组名称
                // 创建垂直标注线
                var leftLines1 = new Lineadd([
                    [x - (limitLen / 2 + Gap), y], // 上端点
                    [x - (limitLen / 2 + Gap), y - h], // 下端点
                ]);
                // 创建上侧水平界线
                var leftLines2 = new Lineadd([
                    [x - limitLen - Gap, y], // 左端点
                    [x - Gap, y], // 右端点
                ]);
                // 创建下侧水平界线
                var leftLines3 = new Lineadd([
                    [x - limitLen - Gap, y - h], // 左端点
                    [x - Gap, y - h], // 右端点
                ]);
                // 将标注线添加到标注组中
                leftLines1.move(leftGroup, ElementPlacement.PLACEATBEGINNING);
                leftLines2.move(leftGroup, ElementPlacement.PLACEATEND);
                leftLines3.move(leftGroup, ElementPlacement.PLACEATEND);
                // 如果启用了箭头显示
                if (true) {
                    // 创建上侧箭头
                    var leftArrows1 = new arrowsAdd([
                        [x - (limitLen / 2 + Gap) - asize / 2, ya - asize], // 箭头上左点
                        [x - (limitLen / 2 + Gap), ya], // 箭头尖端
                        [x - (limitLen / 2 + Gap) + asize / 2, ya - asize], // 箭头上右点
                    ]);
                    // 创建下侧箭头
                    var leftArrows2 = new arrowsAdd([
                        [x - (limitLen / 2 + Gap) - asize / 2, yb - h + asize], // 箭头下左点
                        [x - (limitLen / 2 + Gap), yb - h], // 箭头尖端
                        [x - (limitLen / 2 + Gap) + asize / 2, yb - h + asize], // 箭头下右点
                    ]);
                    // 将箭头添加到标注组中
                    leftArrows1.move(leftGroup, ElementPlacement.PLACEATEND);
                    leftArrows2.move(leftGroup, ElementPlacement.PLACEATEND);
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(h, x - (limitLen / 2 + Gap + LineW), y - h / 2, unitConvert);
                textInfo.rotate(-90, true, false, false, false, Transformation.BOTTOMLEFT); // 文字旋转90度
                textInfo.top += textInfo.width; // 调整文字垂直位置
                textInfo.top += textInfo.height / 2; // 文字垂直居中
                textInfo.left -= textInfo.width; // 调整文字水平位置
                textInfo.move(leftGroup, ElementPlacement.PLACEATBEGINNING);
                // 将整个标注组添加到主标注组中
                leftGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
            // 处理右边标注
            if (where == "Right") {
                var rightGroup = specsLayer.groupItems.add(); // 创建右边标注组
                rightGroup.name = "右_" + labelGroupNames; // 设置标注组名称
                // 创建垂直标注线
                var rightLines1 = new Lineadd([
                    [x + w + limitLen / 2 + Gap, y], // 上端点
                    [x + w + limitLen / 2 + Gap, y - h], // 下端点
                ]);
                // 创建上侧水平界线
                var rightLines2 = new Lineadd([
                    [x + w + limitLen + Gap, y], // 左端点
                    [x + w + Gap, y], // 右端点
                ]);
                // 创建下侧水平界线
                var rightLines3 = new Lineadd([
                    [x + w + limitLen + Gap, y - h], // 左端点
                    [x + w + Gap, y - h], // 右端点
                ]);
                // 将标注线添加到标注组中
                rightLines1.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                rightLines2.move(rightGroup, ElementPlacement.PLACEATEND);
                rightLines3.move(rightGroup, ElementPlacement.PLACEATEND);
                // 如果启用了箭头显示
                if (true) {
                    // 创建上侧箭头
                    var rightArrows1 = new arrowsAdd([
                        [x + w + limitLen / 2 + Gap - asize / 2, ya - asize], // 箭头上左点
                        [x + w + limitLen / 2 + Gap, ya], // 箭头尖端
                        [x + w + limitLen / 2 + Gap + asize / 2, ya - asize], // 箭头上右点
                    ]);
                    // 创建下侧箭头
                    var rightArrows2 = new arrowsAdd([
                        [x + w + limitLen / 2 + Gap - asize / 2, yb - h + asize], // 箭头下左点
                        [x + w + limitLen / 2 + Gap, yb - h], // 箭头尖端
                        [x + w + limitLen / 2 + Gap + asize / 2, yb - h + asize], // 箭头下右点
                    ]);
                    rightArrows1.move(rightGroup, ElementPlacement.PLACEATEND);
                    rightArrows2.move(rightGroup, ElementPlacement.PLACEATEND);
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(h, x + w + limitLen / 2 + Gap + LineW, y - h / 2, unitConvert);
                textInfo.rotate(-90, true, false, false, false, Transformation.BOTTOMLEFT); // 文字旋转90度
                textInfo.top += textInfo.width; // 调整文字垂直位置
                textInfo.top += textInfo.height / 2; // 文字垂直居中
                textInfo.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                // 将整个标注组添加到主标注组中
                rightGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }
    }

    /*
     * 创建标注文字函数：根据值和单位创建文字标注
     * @param {Number} val - 标注值
     * @param {Number} x - 文字X坐标
     * @param {Number} y - 文字Y坐标
     * @param {String} wheres - 单位类型（"auto", "mm", "cm", "m", "pt", "px", "in", "ft", "pc"）
     */
    function specTextLabel(val, x, y, wheres) {
        var textInfo = doc.textFrames.add(); // 创建文本框
        textInfo.textRange.characterAttributes.size = tsize; // 设置字号
        textInfo.textRange.characterAttributes.fillColor = color; // 设置文字颜色
        textInfo.textRange.characterAttributes.alignment = StyleRunAlignmentType.center; // 设置文字居中对齐
        try {
            textInfo.textRange.characterAttributes.textFont = app.textFonts.getByName(fontNamelist); // 设置字体
        } catch (e) {
            // 如果指定字体不存在，使用默认字体
        }
        var value = val * scale; // 应用比例尺
        var unitsInfo = ""; // 单位后缀
        // 根据单位类型进行转换
        switch (wheres) {
            case "auto": // 自动使用文档标尺单位
                switch (doc.rulerUnits) {
                    case RulerUnits.Millimeters: // 毫米
                        value = new UnitValue(value, "pt").as("mm"); // 点转毫米
                        value = value.toFixed(decimals); // 保留指定小数位
                        unitsInfo = " mm"; // 设置单位后缀
                        break;
                    case RulerUnits.Centimeters: // 厘米
                        value = new UnitValue(value, "pt").as("cm"); // 点转厘米
                        value = value.toFixed(decimals); // 保留指定小数位
                        unitsInfo = " cm"; // 设置单位后缀
                        break;
                    case RulerUnits.Pixels: // 像素
                        value = new UnitValue(value, "pt").as("px"); // 点转像素
                        value = value.toFixed(decimals); // 保留指定小数位
                        unitsInfo = " px"; // 设置单位后缀
                        break;
                    case RulerUnits.Inches: // 英寸
                        value = new UnitValue(value, "pt").as("in"); // 点转英寸
                        value = value.toFixed(decimals); // 保留指定小数位
                        unitsInfo = " in"; // 设置单位后缀
                        break;
                    case RulerUnits.Picas: // 派卡
                        value = new UnitValue(value, "pt").as("pc"); // 点转派卡
                        var vd = value - Math.floor(value); // 获取小数部分
                        vd = 12 * vd; // 转换为点数（1派卡=12点）
                        value = Math.floor(value) + "p" + vd.toFixed(decimals); // 格式化为派卡+点
                        unitsInfo = ""; // 派卡不需要单位后缀
                        break;
                    default: // 默认使用点
                        value = new UnitValue(value, "pt").as("pt"); // 保持点单位
                        value = value.toFixed(decimals); // 保留指定小数位
                        unitsInfo = " pt"; // 设置单位后缀
                }
                break;
            case "mm": // 毫米
                value = new UnitValue(value, "pt").as("mm"); // 点转毫米
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " mm"; // 设置单位后缀
                break;
            case "cm": // 厘米
                value = new UnitValue(value, "pt").as("cm"); // 点转厘米
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " cm"; // 设置单位后缀
                break;
            case "m": // 米
                value = new UnitValue(value, "pt").as("m"); // 点转米
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " m"; // 设置单位后缀
                break;
            case "pt": // 点
                value = new UnitValue(value, "pt").as("pt"); // 保持点单位
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " pt"; // 设置单位后缀
                break;
            case "px": // 像素
                value = new UnitValue(value, "pt").as("px"); // 点转像素
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " px"; // 设置单位后缀
                break;
            case "in": // 英寸
                value = new UnitValue(value, "pt").as("in"); // 点转英寸
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " in"; // 设置单位后缀
                break;
            case "ft": // 英尺
                value = new UnitValue(value, "pt").as("ft"); // 点转英尺
                value = value.toFixed(decimals); // 保留指定小数位
                unitsInfo = " ft"; // 设置单位后缀
                break;
            case "pc": // 派卡
                value = new UnitValue(value, "pt").as("pc"); // 点转派卡
                var vd = value - Math.floor(value); // 获取小数部分
                vd = 12 * vd; // 转换为点数（1派卡=12点）
                value = Math.floor(value) + "p" + vd.toFixed(decimals); // 格式化为派卡+点
                unitsInfo = ""; // 派卡不需要单位后缀
                break;
        }
        if (true) {
            // 如果选择显示单位
            textInfo.contents = value.toString().replace(/-/g, "") + unitsInfo; // 设置文本内容（值+单位），移除负号
        } else {
            // 如果不显示单位
            textInfo.contents = value.toString().replace(/-/g, ""); // 仅设置值，移除负号
        }
        textInfo.top = y; // 设置文本框顶部位置
        textInfo.left = x; // 设置文本框左边位置
        return textInfo; // 返回创建的文本框对象
    }
}

/*
 * 将字符串转换为布尔值的辅助函数
 * @param {String} string - 要转换的字符串
 * @returns {Boolean} - 转换后的布尔值
 */
function convertToBoolean(string) {
    switch (
        string.toLowerCase() // 转换为小写进行比较
    ) {
        case "true":
            return true;
        case "false":
            return false;
    }
}

/*
 * 计算对象（包括剪切蒙版）的几何边界和可视边界
 * @param {Object} the_obj - 要计算边界的对象
 * @returns {Array} - 返回包含几何边界和可视边界的数组 [几何左,几何上,几何右,几何下,可视左,可视上,可视右,可视下]
 */
function NO_CLIP_BOUNDS(the_obj) {
    var NO_CLIP_OBJECTS_AND_MASKS = new Array(); // 存储所有非剪切对象和蒙版对象
    GET_NO_CLIP_OBJECTS_AND_MASKS(the_obj); // 递归获取所有非剪切对象和蒙版
    // 初始化存储边界值的数组
    var v_left = new Array(); // 可视左边界
    var g_left = new Array(); // 几何左边界
    var v_top = new Array(); // 可视上边界
    var g_top = new Array(); // 几何上边界
    var v_right = new Array(); // 可视右边界
    var g_right = new Array(); // 几何右边界
    var v_bottom = new Array(); // 可视下边界
    var g_bottom = new Array(); // 几何下边界
    // 遍历所有对象，获取它们的边界值
    for (var i = 0; i < NO_CLIP_OBJECTS_AND_MASKS.length; i += 1) {
        g_left[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[0]; // 几何左边界
        v_left[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[0]; // 可视左边界
        g_top[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[1]; // 几何上边界
        v_top[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[1]; // 可视上边界
        g_right[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[2]; // 几何右边界
        v_right[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[2]; // 可视右边界
        g_bottom[i] = NO_CLIP_OBJECTS_AND_MASKS[i].geometricBounds[3]; // 几何下边界
        v_bottom[i] = NO_CLIP_OBJECTS_AND_MASKS[i].visibleBounds[3]; // 可视下边界
    }
    // 计算所有对象的最小/最大边界值
    var v_L = MIN_IN_ARRAY(v_left); // 最小可视左边界
    var g_L = MIN_IN_ARRAY(g_left); // 最小几何左边界
    var v_T = MAX_IN_ARRAY(v_top); // 最大可视上边界
    var g_T = MAX_IN_ARRAY(g_top); // 最大几何上边界
    var v_R = MAX_IN_ARRAY(v_right); // 最大可视右边界
    var g_R = MAX_IN_ARRAY(g_right); // 最大几何右边界
    var v_B = MIN_IN_ARRAY(v_bottom); // 最小可视下边界
    var g_B = MIN_IN_ARRAY(g_bottom); // 最小几何下边界
    // 返回包含所有边界值的数组
    return [g_L, g_T, g_R, g_B, v_L, v_T, v_R, v_B];

    /**
     * 递归获取所有非剪切对象和蒙版对象
     * @param {Object} the_obj - 要处理的对象
     */
    function GET_NO_CLIP_OBJECTS_AND_MASKS(the_obj) {
        // 如果是剪切组，只添加第一个子项（蒙版内容）
        if (IS_CLIP(the_obj)) {
            NO_CLIP_OBJECTS_AND_MASKS.push(the_obj.pageItems[0]);
            return;
        }
        // 如果是组，递归处理所有子项
        if (the_obj.constructor.name == "GroupItem") {
            try {
                var N_sub_obj = the_obj.pageItems.length;
                for (var i = 0; i < N_sub_obj; i += 1) {
                    GET_NO_CLIP_OBJECTS_AND_MASKS(the_obj.pageItems[i]);
                }
            } catch (error) {
                // 忽略访问子项时可能出现的错误
            }
            return;
        }
        // 如果是普通对象，直接添加到数组
        NO_CLIP_OBJECTS_AND_MASKS.push(the_obj);
        return;
    }
}

/**
 * 检查对象是否为剪切组
 * @param {Object} the_obj - 要检查的对象
 * @returns {Boolean} - 如果是剪切组返回true，否则返回false
 */
function IS_CLIP(the_obj) {
    try {
        if (the_obj.constructor.name == "GroupItem") {
            // 如果是组对象
            if (the_obj.clipped) {
                // 检查是否启用了剪切
                return true;
            }
        }
    } catch (error) {
        // 忽略访问对象属性时可能出现的错误
    }
    return false;
}

/*
 * 获取数组中的最大值
 * @param {Array} the_array - 要处理的数组
 * @returns {Number} - 数组中的最大值
 */
function MAX_IN_ARRAY(the_array) {
    var MAX = the_array[0]; // 初始化最大值为第一个元素
    for (var i = 0; i < the_array.length; i += 1) {
        if (the_array[i] > MAX) {
            // 如果当前元素大于最大值
            MAX = the_array[i]; // 更新最大值
        }
    }
    return MAX;
}

/**
 * 获取数组中的最小值
 * @param {Array} the_array - 要处理的数组
 * @returns {Number} - 数组中的最小值
 */
function MIN_IN_ARRAY(the_array) {
    var MIN = the_array[0]; // 初始化最小值为第一个元素
    for (var i = 0; i < the_array.length; i += 1) {
        if (the_array[i] < MIN) {
            // 如果当前元素小于最小值
            MIN = the_array[i]; // 更新最小值
        }
    }
    return MIN;
}

/*
 * 检查应用程序环境是否满足运行条件
 * @returns {Boolean} - 如果满足条件返回true，否则返回false
 */
function check_app() {
    // 检查是否是Illustrator、有打开的文档且有选中的对象
    if (app.name == "Adobe Illustrator" && app.documents.length > 0 && app.activeDocument.selection.length > 0) {
        return true;
    } else {
        if (app.documents.length == 0) {
            alert("警告：\n请先打开文档哦!", "错误提示");
        } else {
            if (app.activeDocument.selection.length == 0) {
                alert("警告：\n请先选择标注对象!", "错误提示");
            }
        }
        return false;
    }
}
