// 脚本版本信息
var VersionInfo = "v2.5";
// 标注图层名称
var layName = "尺寸标注层";
// 标注颜色（CMYK模式）
var color = new CMYKColor();

// 标注位置默认值及其环境变量设置
// 上边标注
var topCheck = false;
var defaultTopCheck = $.getenv("Specify_defaultTopCheck")
    ? convertToBoolean($.getenv("Specify_defaultTopCheck"))
    : topCheck;
// 右边标注
var rightCheck = false;
var defaultRightCheck = $.getenv("Specify_defaultRightCheck")
    ? convertToBoolean($.getenv("Specify_defaultRightCheck"))
    : rightCheck;
// 下边标注
var bottomCheck = false;
var defaultBottomCheck = $.getenv("Specify_defaultBottomCheck")
    ? convertToBoolean($.getenv("Specify_defaultBottomCheck"))
    : bottomCheck;
// 左边标注
var leftCheck = false;
var defaultLeftCheck = $.getenv("Specify_defaultLeftCheck")
    ? convertToBoolean($.getenv("Specify_defaultLeftCheck"))
    : leftCheck;
// 四边全部标注
var allSidesCheck = false;
var defaultAllSidesCheck = $.getenv("Specify_defaultAllSidesCheck")
    ? convertToBoolean($.getenv("Specify_defaultAllSidesCheck"))
    : allSidesCheck;
// 标注模式默认值及其环境变量设置
// 单体标注模式（默认开启）
var eachLength = true;
var defaultEachLength = $.getenv("Specify_defaultEachLength")
    ? convertToBoolean($.getenv("Specify_defaultEachLength"))
    : eachLength;
// 间距标注模式
var betweenLength = false;
var defaultObjBetween = $.getenv("Specify_defaultObjBetween")
    ? convertToBoolean($.getenv("Specify_defaultObjBetween"))
    : betweenLength;
// 总距离标注模式
var overallLength = false;
var defaultOverallLength = $.getenv("Specify_defaultOverallLength")
    ? convertToBoolean($.getenv("Specify_defaultOverallLength"))
    : overallLength;
// 标注样式默认值及其环境变量设置
// 字体样式（默认为黑体）
var setFaceFont = 2;
var defaultFontFace = $.getenv("Specify_defaultFontFace")
    ? $.getenv("Specify_defaultFontFace")
    : setFaceFont;
// 单位模式（默认为自动）
var setUnitMode = 0;
var defaultUnitMode = $.getenv("Specify_defaultUnitMode")
    ? $.getenv("Specify_defaultUnitMode")
    : setUnitMode;
// 比例（默认为1:1）
var setScale = 0;
var defaultScale = $.getenv("Specify_defaultScale")
    ? $.getenv("Specify_defaultScale")
    : setScale;
// 字号大小（默认12pt）
var setFontSize = 12;
var defaultFontSize = $.getenv("Specify_defaultFontSize")
    ? $.getenv("Specify_defaultFontSize")
    : setFontSize;
// 小数位数（默认2位）
var setDecimals = 2;
var defaultDecimals = $.getenv("Specify_defaultDecimals")
    ? $.getenv("Specify_defaultDecimals")
    : setDecimals;
// 线条粗细（默认0.5pt）
var setLineWeight = 0.5;
var defaultLineWeight = $.getenv("Specify_defaultLineWeight")
    ? $.getenv("Specify_defaultLineWeight")
    : setLineWeight;
// 标注线与对象的间距（默认3pt）
var setgap = 3;
var defaultlineGap = $.getenv("Specify_defaultlineGap")
    ? $.getenv("Specify_defaultlineGap")
    : setgap;
// 标注线两端的短线长度（默认8pt）
var setDoubleLine = 8;
var defaultDoubleLine = $.getenv("Specify_defaultDoubleLine")
    ? $.getenv("Specify_defaultDoubleLine")
    : setDoubleLine;
// 箭头设置及其环境变量
// 是否显示箭头
var setArrow = false;
var defaultArrow = $.getenv("Specify_defaultArrow")
    ? convertToBoolean($.getenv("Specify_defaultArrow"))
    : setArrow;
// 箭头大小（默认6pt）
var setAsizeSize = 6;
var defaultTriangleSize = $.getenv("Specify_defaultTriangleSize")
    ? $.getenv("Specify_defaultTriangleSize")
    : setAsizeSize;
// 箭头是否填充
var setArrowSealing = false;
var defaultArrowSealing = $.getenv("Specify_defaultArrowSealing")
    ? convertToBoolean($.getenv("Specify_defaultArrowSealing"))
    : setArrowSealing;

// 标注颜色CMYK值及其环境变量
// 青色分量（默认0%）
var setCyan = 0;
var defaultColorCyan = $.getenv("Specify_defaultColorCyan")
    ? $.getenv("Specify_defaultColorCyan")
    : setCyan;
// 品红分量（默认100%）
var setMagenta = 100;
var defaultColorMagenta = $.getenv("Specify_defaultColorMagenta")
    ? $.getenv("Specify_defaultColorMagenta")
    : setMagenta;
// 黄色分量（默认100%）
var setYellow = 100;
var defaultColorYellow = $.getenv("Specify_defaultColorYellow")
    ? $.getenv("Specify_defaultColorYellow")
    : setYellow;
// 黑色分量（默认10%）
var setBlack = 10;
var defaultColorBlack = $.getenv("Specify_defaultColorBlack")
    ? $.getenv("Specify_defaultColorBlack")
    : setBlack;

// 其他设置及其环境变量
// 是否显示单位后缀
var setUnits = false;
var defaultUnits = $.getenv("Specify_defaultUnits")
    ? convertToBoolean($.getenv("Specify_defaultUnits"))
    : setUnits;
// 是否包含对象描边
var lineStrokes = false;
var defaultLineStrokes = $.getenv("Specify_defaultLineStrokes")
    ? convertToBoolean($.getenv("Specify_defaultLineStrokes"))
    : lineStrokes;
// 是否锁定标注图层
var setlockedLay = false;
var defaultlockedLay = $.getenv("Specify_defaultlockedLay")
    ? convertToBoolean($.getenv("Specify_defaultlockedLay"))
    : setlockedLay;
// 创建主对话框窗口
var win = new Window("dialog", "标注尺寸 " + VersionInfo, undefined, {
    closeButton: false, // 禁用关闭按钮
});
win.alignChildren = "left"; // 子元素左对齐

// 创建标注边选择面板
dimensionPanel = win.add("group", [0, 0, 290, 90]);
dimensionGroup = dimensionPanel.add("panel", [0, 0, 290, 90], "选择标注边");

// 添加左边标注复选框
leftCheckbox = dimensionGroup.add("checkbox", [66, 35, 116, 50], "左边");
leftCheckbox.value = true; // 默认选中
leftCheckbox.helpTip = "在对象左边标注尺寸。"; // 提示信息
// 添加上边标注复选框
topCheckbox = dimensionGroup.add("checkbox", [121, 10, 171, 25], "上边");
topCheckbox.value = defaultTopCheck; // 使用环境变量设置默认值
topCheckbox.helpTip = "在对象上边标注尺寸。"; // 提示信息

// 添加四边全选复选框
selectAllCheckbox = dimensionGroup.add("checkbox", [121, 35, 171, 50], "四边");
selectAllCheckbox.value = defaultAllSidesCheck; // 使用环境变量设置默认值
selectAllCheckbox.helpTip = "在对象四边标注尺寸。"; // 提示信息

// 添加下边标注复选框
bottomCheckbox = dimensionGroup.add("checkbox", [121, 60, 171, 75], "下边");
bottomCheckbox.value = true; // 默认选中
bottomCheckbox.helpTip = "在对象下边标注尺寸。"; // 提示信息

// 添加右边标注复选框
rightCheckbox = dimensionGroup.add("checkbox", [176, 35, 226, 50], "右边");
rightCheckbox.value = defaultRightCheck; // 使用环境变量设置默认值
rightCheckbox.helpTip = "在对象右边标注尺寸。"; // 提示信息

// 四边全选复选框的点击事件处理
selectAllCheckbox.onClick = function () {
    if (selectAllCheckbox.value) {
        // 如果选中四边全选
        // 选中所有边并禁用单独选择
        bottomCheckbox.value = true;
        bottomCheckbox.enabled = false;
        leftCheckbox.value = true;
        leftCheckbox.enabled = false;
        topCheckbox.value = true;
        topCheckbox.enabled = false;
        rightCheckbox.value = true;
        rightCheckbox.enabled = false;
    } else {
        // 如果取消四边全选
        // 取消所有边的选中并启用单独选择
        bottomCheckbox.value = false;
        bottomCheckbox.enabled = true;
        leftCheckbox.value = false;
        leftCheckbox.enabled = true;
        topCheckbox.value = false;
        topCheckbox.enabled = true;
        rightCheckbox.value = false;
        rightCheckbox.enabled = true;
    }
};

// 各边复选框的点击事件处理
// 当任一边取消选中时，自动取消四边全选
bottomCheckbox.onClick = function () {
    if (!bottomCheckbox.value) {
        selectAllCheckbox.value = false;
    }
};
leftCheckbox.onClick = function () {
    if (!leftCheckbox.value) {
        selectAllCheckbox.value = false;
    }
};
topCheckbox.onClick = function () {
    if (!topCheckbox.value) {
        selectAllCheckbox.value = false;
    }
};
rightCheckbox.onClick = function () {
    if (!rightCheckbox.value) {
        selectAllCheckbox.value = false;
    }
};
// 创建设置选项面板
optionsPanel = win.add("group", [0, 0, 290, 260]);
modeChecksGroup = optionsPanel.add("panel", [0, 0, 290, 260], "设置选项");

// 添加单体标注复选框
eachSizeCheck = modeChecksGroup.add("checkbox", [10, 20, 85, 35], "单体标注");
eachSizeCheck.helpTip = "每个对象单独尺寸标注模式。"; // 提示信息
eachSizeCheck.value = defaultEachLength; // 使用环境变量设置默认值

// 添加间距标注复选框
betweenCheckbox = modeChecksGroup.add(
    "checkbox",
    [95, 20, 170, 35],
    "间距标注"
);
betweenCheckbox.helpTip = "两个对象之间距离标注模式。"; // 提示信息
betweenCheckbox.value = defaultObjBetween; // 使用环境变量设置默认值
betweenCheckbox.enabled = true; // 启用复选框

// 添加总距离标注复选框
entiretySizeCheck = modeChecksGroup.add(
    "checkbox",
    [180, 20, 270, 35],
    "总距离标注"
);
entiretySizeCheck.helpTip = "所选对象总尺寸标注模式。"; // 提示信息
entiretySizeCheck.value = defaultOverallLength; // 使用环境变量设置默认值
entiretySizeCheck.enabled = true; // 启用复选框

// 添加单位选择下拉列表
unitModeLabel = modeChecksGroup.add("statictext", [10, 48, 55, 63], "单位:"); // 标签文本
unitModeList = modeChecksGroup.add("dropdownlist", [55, 45, 150, 65]); // 下拉列表控件
unitModeList.helpTip = "标注值的单位转换。\n默认: 自动（随软件）"; // 提示信息

// 定义可选单位列表
var items = new Array(
    "自动-auto",
    "毫米-mm",
    "厘米-cm",
    "米-m",
    "磅-pt",
    "像素-px",
    "英寸-in",
    "英尺-ft",
    "派卡-pc"
);

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

// 添加比例设置控件
customScaleLabel = modeChecksGroup.add(
    "statictext",
    [170, 48, 215, 63],
    "比例:"
); // 标签文本
customScaleLabel.enabled = true;
customScaleDropdown = modeChecksGroup.add("dropdownlist", [215, 45, 275, 65]); // 下拉列表控件
customScaleDropdown.helpTip =
    "对象标注值的比例。\n例如：25在1/4比例时，值显示为100。\n\n默认值: 1/1"; // 提示信息

// 添加1/1到1/10的比例选项
for (var n = 1; n <= 10; n += 1) {
    if (n == 1) {
        customScaleDropdown.add("item", "1/" + n); // 添加1/1选项
        customScaleDropdown.add("separator"); // 添加分隔线
    } else {
        customScaleDropdown.add("item", "1/" + n); // 添加其他比例选项
    }
}

// 添加其他常用比例选项
customScaleDropdown.add("separator"); // 添加分隔线
customScaleDropdown.add("item", "1/15");
customScaleDropdown.add("item", "1/20");
customScaleDropdown.add("item", "1/25");
customScaleDropdown.add("item", "1/50");
customScaleDropdown.add("item", "1/100");
customScaleDropdown.add("item", "1/150");
customScaleDropdown.add("item", "1/200");
customScaleDropdown.add("item", "1/300");

// 设置比例下拉列表的默认选项和事件处理
customScaleDropdown.selection = defaultScale; // 使用环境变量设置默认选项
customScaleDropdown.enabled = true;

// 添加字体设置控件
fontdrpLabel = modeChecksGroup.add("statictext", [10, 78, 55, 93], "字体:"); // 标签文本
fontdrplist = modeChecksGroup.add("dropdownlist", [55, 75, 275, 95]); // 下拉列表控件
fontdrplist.helpTip = "标注尺寸字体样式。\n默认:  系统默认"; // 提示信息

// 定义可选字体列表
var items = new Array(
    "系统默认",
    "微软雅黑",
    "黑体",
    "宋体",
    "Arial",
    "Arial-Bold",
    "ArialUnicode",
    "Tahoma",
    "Tahoma-Bold",
    "Times New Roman",
    "Times New Roman-Bold"
);

// 添加字体选项到下拉列表
for (var j = 0; j < items.length; j += 1) {
    if (j == 0) {
        fontdrplist.add("item", items[0]); // 添加第一个选项（系统默认）
        fontdrplist.add("separator"); // 添加分隔线
    } else {
        fontdrplist.add("item", items[j]); // 添加其他字体选项
    }
}
// 设置字体下拉列表的默认选项和事件处理
fontdrplist.selection = defaultFontFace; // 使用环境变量设置默认选项
surfacefont(String(fontdrplist.selection)); // 初始化字体名称
fontdrplist.onChange = function () {
    A = fontdrplist.selection.items;
    surfacefont(String(fontdrplist.selection)); // 更新字体名称
    setFaceFont = fontNamelist; // 更新字体设置
};

// 字体名称转换函数：将显示名称转换为系统字体名称
function surfacefont(A) {
    if (A == items[0]) {
        fontNamelist = ""; // 系统默认字体
    } else if (A == items[1]) {
        fontNamelist = "MicrosoftYaHei"; // 微软雅黑
    } else if (A == items[2]) {
        fontNamelist = "Simhei"; // 黑体
    } else if (A == items[3]) {
        fontNamelist = "simsun"; // 宋体
    } else if (A == items[4]) {
        fontNamelist = "ArialMT"; // Arial
    } else if (A == items[5]) {
        fontNamelist = "Arial-BoldMT"; // Arial粗体
    } else if (A == items[6]) {
        fontNamelist = "ArialUnicodeMS"; // Arial Unicode
    } else if (A == items[7]) {
        fontNamelist = "Tahoma"; // Tahoma
    } else if (A == items[8]) {
        fontNamelist = "Tahoma-Bold"; // Tahoma粗体
    } else if (A == items[9]) {
        fontNamelist = "TimesNewRomanPSMT"; // Times New Roman
    } else {
        if (A == items[10]) {
            fontNamelist = "TimesNewRomanPS-BoldMT"; // Times New Roman粗体
        }
    }
}

// 添加字号设置控件
fontSizeLabel = modeChecksGroup.add(
    "statictext",
    [10, 108, 80, 123],
    "字号大小:"
); // 标签文本
fontSizeInput = modeChecksGroup.add(
    "edittext",
    [80, 105, 130, 125],
    defaultFontSize
); // 输入框
fontSizeInput.helpTip = "标注字体的大小。\n默认值: " + setFontSize + "pt"; // 提示信息
fontSizeInput.characters = 6; // 设置输入框宽度

// 添加小数位数设置控件
decimalPlacesLabel = modeChecksGroup.add(
    "statictext",
    [155, 108, 225, 123],
    "小数位数:"
); // 标签文本
decimalPlacesInput = modeChecksGroup.add(
    "edittext",
    [225, 105, 275, 125],
    defaultDecimals
); // 输入框
decimalPlacesInput.helpTip = "数值后小数位数 (0~6)。\n默认值: " + setDecimals; // 提示信息
decimalPlacesInput.characters = 6; // 设置输入框宽度
decimalPlacesInput.onChange = function () {
    decimalPlacesInput.text = decimalPlacesInput.text.replace(/[^0-9]/g, ""); // 限制只能输入数字
};
// 添加标线宽度设置控件
lineWeightLabel = modeChecksGroup.add(
    "statictext",
    [10, 138, 80, 153],
    "标线宽度:"
); // 标签文本
lineWeightInput = modeChecksGroup.add(
    "edittext",
    [80, 135, 130, 155],
    defaultLineWeight
); // 输入框
lineWeightInput.helpTip = "标注字体的大小。\n默认值: " + setLineWeight + "pt"; // 提示信息
lineWeightInput.characters = 6; // 设置输入框宽度
lineWeightInput.onChange = function () {
    lineWeightInput.text = lineWeightInput.text.replace(/[^0-9.]/g, ""); // 限制只能输入数字和小数点
};

// 添加标线距离设置控件
lineGapLabel = modeChecksGroup.add(
    "statictext",
    [155, 138, 225, 153],
    "标线距离:"
); // 标签文本
lineGapInput = modeChecksGroup.add(
    "edittext",
    [225, 135, 275, 155],
    defaultlineGap
); // 输入框
lineGapInput.helpTip =
    "标注线与对象边界的距离。\n支持负数值，例：-3。\n默认值: " + setgap + "pt"; // 提示信息
lineGapInput.characters = 6; // 设置输入框宽度

// 添加界线长度设置控件
doubleLineLabel = modeChecksGroup.add(
    "statictext",
    [10, 168, 65, 183],
    "界线长:"
); // 标签文本
doubleLineInput = modeChecksGroup.add(
    "edittext",
    [65, 165, 100, 185],
    defaultDoubleLine
); // 输入框
doubleLineInput.helpTip =
    "标注线两端的短线段。\n默认值: " + setDoubleLine + "pt"; // 提示信息
doubleLineInput.characters = 3; // 设置输入框宽度
// 添加箭头显示设置控件
arrowCheckbox = modeChecksGroup.add("checkbox", [115, 168, 175, 183], "箭头:"); // 复选框
arrowCheckbox.helpTip = "显示/隐藏标线两端箭头符号。"; // 提示信息
arrowCheckbox.value = 1; // 默认选中

// 添加箭头尺寸设置控件
triangleSizeLabel = modeChecksGroup.add("statictext", [175, 165, 210, 185], ""); // 标签文本
triangleSizeInput = modeChecksGroup.add(
    "edittext",
    [175, 165, 210, 185],
    defaultTriangleSize
); // 输入框
triangleSizeInput.helpTip =
    "标注线两端的箭头尺寸。\n默认值: " + setAsizeSize + "pt"; // 提示信息
triangleSizeInput.characters = 3; // 设置输入框宽度
triangleSizeInput.enabled = true; // 启用输入框

// 添加箭头填充设置控件
arrowSealingCheckbox = modeChecksGroup.add(
    "checkbox",
    [225, 168, 275, 183],
    "实心"
); // 复选框
arrowSealingCheckbox.helpTip = "线与面箭头模式切换。"; // 提示信息
arrowSealingCheckbox.value = 1; // 默认选中
arrowSealingCheckbox.enabled = true; // 启用复选框


// 箭头显示复选框点击事件处理
arrowCheckbox.onClick = function () {
    if (arrowCheckbox.value) {
        // 如果选中显示箭头
        // 启用箭头相关设置
        triangleSizeLabel.enabled = true;
        triangleSizeInput.enabled = true;
        arrowSealingCheckbox.enabled = true;
    } else {
        // 如果取消显示箭头
        // 禁用箭头相关设置
        triangleSizeLabel.enabled = false;
        triangleSizeInput.enabled = false;
        arrowSealingCheckbox.value = false;
        arrowSealingCheckbox.enabled = false;
    }
};

// 根据箭头显示状态初始化相关控件
if (arrowCheckbox.value) {
    // 如果选中显示箭头
    // 启用箭头相关设置
    triangleSizeLabel.enabled = true;
    triangleSizeInput.enabled = true;
    arrowSealingCheckbox.enabled = true;
} else {
    // 如果取消显示箭头
    // 禁用箭头相关设置
    triangleSizeLabel.enabled = false;
    triangleSizeInput.enabled = false;
    arrowSealingCheckbox.enabled = false;
}

// 添加CMYK颜色设置控件
colorLabel = modeChecksGroup.add("statictext", [10, 198, 80, 213], "标注颜色:"); // 标签文本

// 添加青色(Cyan)输入框
colorInputCyan = modeChecksGroup.add(
    "edittext",
    [80, 195, 125, 215],
    defaultColorCyan
); // 输入框
colorInputCyan.helpTip = "青色值 C（0-100）。\n默认值: " + setCyan; // 提示信息
colorInputCyan.characters = 4; // 设置输入框宽度

// 添加品红色(Magenta)输入框
colorInputMagenta = modeChecksGroup.add(
    "edittext",
    [130, 195, 175, 215],
    defaultColorMagenta
); // 输入框
colorInputMagenta.helpTip = "红色值 M（0-100）。\n默认值: " + setMagenta; // 提示信息
colorInputMagenta.characters = 4; // 设置输入框宽度

// 添加黄色(Yellow)输入框
colorInputYellow = modeChecksGroup.add(
    "edittext",
    [180, 195, 225, 215],
    defaultColorYellow
); // 输入框
colorInputYellow.helpTip = "黄色值 Y（0-100）。\n默认值: " + setYellow; // 提示信息
colorInputYellow.characters = 4; // 设置输入框宽度

// 添加黑色(Black)输入框
colorInputBlack = modeChecksGroup.add(
    "edittext",
    [230, 195, 275, 215],
    defaultColorBlack
); // 输入框
colorInputBlack.helpTip = "黑色值 K（0-100）。\n默认值: " + setBlack;
colorInputBlack.characters = 4;
// 添加单位后缀复选框
textUnitsCheck = modeChecksGroup.add(
    "checkbox",
    [10, 225, 85, 240],
    "单位后缀"
); // 复选框控件
textUnitsCheck.helpTip = "显示标注值单位。\n示例: 220 mm"; // 提示信息
textUnitsCheck.value = 1; // 默认选中

// 恢复所有设置为默认值的函数
function restoreDefaults() {
    // 恢复标注边选择复选框的默认值和状态
    topCheckbox.value = topCheck;
    topCheckbox.enabled = true;
    rightCheckbox.value = rightCheck;
    rightCheckbox.enabled = true;
    bottomCheckbox.value = true;
    bottomCheckbox.enabled = true;
    leftCheckbox.value = true;
    leftCheckbox.enabled = true;
    selectAllCheckbox.value = allSidesCheck;

    // 恢复标注模式复选框的默认值
    eachSizeCheck.value = eachLength; // 单体标注
    betweenCheckbox.value = betweenLength; // 间距标注
    entiretySizeCheck.value = overallLength; // 总距标注

    // 恢复单位和比例下拉列表的默认选项
    unitModeList.selection = setUnitMode; // 单位模式
    customScaleDropdown.selection = setScale; // 自定义比例

    // 恢复字体相关设置的默认值
    fontdrplist.selection = setFaceFont; // 字体
    fontSizeInput.text = setFontSize; // 字号
    decimalPlacesInput.text = setDecimals; // 小数位数

    // 恢复线条相关设置的默认值
    lineWeightInput.text = setLineWeight; // 标线宽度
    lineGapInput.text = setgap; // 标线距离
    doubleLineInput.text = setDoubleLine; // 界线长度

    // 恢复箭头相关设置的默认值
    triangleSizeInput.text = setAsizeSize; // 箭头尺寸
    triangleSizeInput.enabled = false; // 禁用箭头尺寸输入框
    arrowCheckbox.value = 1; // 显示箭头
    arrowSealingCheckbox.value = 1; // 箭头实心
    arrowSealingCheckbox.enabled = false; // 禁用箭头实心复选框

    // 恢复CMYK颜色设置的默认值
    colorInputCyan.text = setCyan; // 青色
    colorInputMagenta.text = setMagenta; // 品红
    colorInputYellow.text = setYellow; // 黄色
    colorInputBlack.text = setBlack; // 黑色

    // 恢复其他设置的默认值
    textUnitsCheck.value = 1; // 显示单位后缀
    lineStrokeCheckbox.value = lineStrokes; // 包含描边
    lockedLay.value = setlockedLay; // 锁定标注层

    // 禁用恢复默认按钮
    restoreDefaultsButton.enabled = false;
    $.setenv("Specify_defaultTopCheck", "");
    $.setenv("Specify_defaultRightCheck", "");
    $.setenv("Specify_defaultBottomCheck", "");
    $.setenv("Specify_defaultLeftCheck", "");
    $.setenv("Specify_defaultAllSidesCheck", "");
    $.setenv("Specify_defaultEachLength", "");
    $.setenv("Specify_defaultObjBetween", "");
    $.setenv("Specify_defaultOverallLength", "");
    $.setenv("Specify_defaultUnitMode", "");
    $.setenv("Specify_defaultScale", "");
    $.setenv("Specify_defaultFontFace", "");
    $.setenv("Specify_defaultFontSize", "");
    $.setenv("Specify_defaultDecimals", "");
    $.setenv("Specify_defaultLineWeight", "");
    $.setenv("Specify_defaultlineGap", "");
    $.setenv("Specify_defaultDoubleLine", "");
    $.setenv("Specify_defaultTriangleSize", "");
    $.setenv("Specify_defaultArrow", "");
    $.setenv("Specify_defaultArrowSealing", "");
    $.setenv("Specify_defaultColorCyan", "");
    $.setenv("Specify_defaultColorMagenta", "");
    $.setenv("Specify_defaultColorYellow", "");
    $.setenv("Specify_defaultColorBlack", "");
    $.setenv("Specify_defaultUnits", "");
    $.setenv("Specify_defaultLineStrokes", "");
    $.setenv("Specify_defaultlockedLay", "");
}
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
    win.close(); // 关闭窗口
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
        win.show();
    }
    // 获取标注模式的选择状态
    var eachSizes = eachSizeCheck.value; // 单体标注
    var betweenSize = betweenCheckbox.value; // 间距标注
    var entiretySize = entiretySizeCheck.value; // 总距标注

    // 验证至少选择了一个标注模式
    if (!eachSizes && !betweenSize && !entiretySize) {
        alert("请至少选择一个标注模式。\n 【单体、间距、总距离】", "信息提示");
        win.show();
    }
    // 保存标注边选择状态到环境变量
    var displayTopCheckboxLabel = topCheckbox.value;
    $.setenv("Specify_defaultTopCheck", displayTopCheckboxLabel); // 保存上边选择状态
    var displayRightCheckLabel = rightCheckbox.value;
    $.setenv("Specify_defaultRightCheck", displayRightCheckLabel); // 保存右边选择状态
    var displayBottomCheckLabel = bottomCheckbox.value;
    $.setenv("Specify_defaultBottomCheck", displayBottomCheckLabel); // 保存下边选择状态
    var displayLeftCheckLabel = leftCheckbox.value;
    $.setenv("Specify_defaultLeftCheck", displayLeftCheckLabel); // 保存左边选择状态
    var displayAllSidesCheckLabel = selectAllCheckbox.value;
    $.setenv("Specify_defaultAllSidesCheck", displayAllSidesCheckLabel); // 保存全选状态
    // 保存标注模式选择状态到环境变量
    var displayEachLengthLayLabel = eachSizeCheck.value;
    $.setenv("Specify_defaultEachLength", displayEachLengthLayLabel); // 保存单体标注状态
    var displayObjBetweenLayLabel = betweenCheckbox.value;
    $.setenv("Specify_defaultObjBetween", displayObjBetweenLayLabel); // 保存间距标注状态
    var displayOverallLengthLayLabel = entiretySizeCheck.value;
    $.setenv("Specify_defaultOverallLength", displayOverallLengthLayLabel); // 保存总距标注状态

    // 处理单位设置并保存到环境变量
    var theUnitModeList = unitModeList.selection
        .toString()
        .replace(/[^a-zA-Z]/g, ""); // 提取单位字母
    unitConvert = theUnitModeList; // 设置单位转换值
    $.setenv("Specify_defaultUnitMode", unitModeList.selection.index); // 保存单位模式索引

    // 处理比例设置并保存到环境变量
    var theScale = parseInt(
        customScaleDropdown.selection
            .toString()
            .replace(/1\//g, "")
            .replace(/[^0-9]/g, "")
    ); // 提取比例数值
    scale = theScale; // 设置比例值
    $.setenv("Specify_defaultScale", customScaleDropdown.selection.index); // 保存比例索引

    // 保存字体设置到环境变量
    $.setenv("Specify_defaultFontFace", fontdrplist.selection.index); // 保存字体索引

    // 保存箭头设置到环境变量
    var displayArrowCheckLabel = arrowCheckbox.value;
    $.setenv("Specify_defaultArrow", displayArrowCheckLabel); // 保存箭头显示状态
    var displayArrowSealingCheckLabel = arrowSealingCheckbox.value;
    $.setenv("Specify_defaultArrowSealing", displayArrowSealingCheckLabel); // 保存箭头填充状态

    // 保存其他设置到环境变量
    var displayUnitsLabel = textUnitsCheck.value;
    $.setenv("Specify_defaultUnits", displayUnitsLabel); // 保存单位后缀显示状态
    var displayLineStrokesLayLabel = lineStrokeCheckbox.value;
    $.setenv("Specify_defaultLineStrokes", displayLineStrokesLayLabel); // 保存包含描边状态
    var displaylockedLayLabel = lockedLay.value;
    $.setenv("Specify_defaultlockedLay", displaylockedLayLabel); // 保存锁定标注层状态
    // 验证和处理字号输入
    if (parseFloat(fontSizeInput.text) > 0) {
        // 检查字号是否大于0
        tsize = parseFloat(fontSizeInput.text); // 设置字号值
    } else {
        tsize = setFontSize; // 使用默认字号
    }
    // 验证字号格式（1-3位整数，可选1-3位小数）
    var validFontSize = /^[0-9]{1,3}(\.[0-9]{1,3})?$/.test(fontSizeInput.text);
    if (validFontSize) {
        objtsize = fontSizeInput.text; // 保存有效的字号值
        $.setenv("Specify_defaultFontSize", objtsize); // 保存到环境变量
    }
    if (!validFontSize) {
        // 字号格式无效
        alert("请输入有效的字号值。\n值范围：>0 ~ 999.999", "错误提示");
        fontSizeInput.active = true; // 激活字号输入框
        fontSizeInput.text = defaultFontSize; // 重置为默认值
        win.show();
    }
    // 验证和处理小数位数输入
    if (parseFloat(decimalPlacesInput.text) >= 0) {
        // 检查小数位数是否大于等于0
        decimals = parseFloat(decimalPlacesInput.text); // 设置小数位数
    } else {
        decimals = setDecimals; // 使用默认小数位数
    }
    // 验证小数位数格式（0-6之间的单个整数）
    var validDecimalPlaces = /^[0-6]{1}$/.test(decimalPlacesInput.text);
    if (validDecimalPlaces) {
        objdecimals = decimalPlacesInput.text; // 保存有效的小数位数
        $.setenv("Specify_defaultDecimals", objdecimals); // 保存到环境变量
    }
    if (!validDecimalPlaces) {
        // 小数位数格式无效
        alert("请输入有效的小数点位数。\n值范围：0 ~ 6整数。", "错误提示");
        decimalPlacesInput.active = true; // 激活小数位数输入框
        decimalPlacesInput.text = defaultDecimals; // 重置为默认值
        win.show();
    }
    // 验证和处理线宽输入
    if (parseFloat(lineWeightInput.text) > 0) {
        // 检查线宽是否大于0
        LineW = parseFloat(lineWeightInput.text); // 设置线宽值
    } else {
        LineW = setLineWeight; // 使用默认线宽
    }
    // 验证线宽格式（1-2位整数，可选1-3位小数）
    var validLineWeight = /^[0-9]{1,2}(\.[0-9]{1,3})?$/.test(
        lineWeightInput.text
    );
    if (validLineWeight) {
        objstrokeW = lineWeightInput.text; // 保存有效的线宽值
        $.setenv("Specify_defaultLineWeight", objstrokeW); // 保存到环境变量
    }
    if (!validLineWeight) {
        // 线宽格式无效
        alert("请输入有效的线宽值。\n值范围：>0 ~ 99.999", "错误提示");
        lineWeightInput.active = true; // 激活线宽输入框
        lineWeightInput.text = defaultLineWeight; // 重置为默认值
        win.show();
    }
    // 验证和处理标线距离输入
    if (parseFloat(lineGapInput.text)) {
        // 检查标线距离是否为有效数值
        Gap = parseFloat(lineGapInput.text); // 设置标线距离值
        Gaps = parseFloat(lineGapInput.text); // 设置标线间距值
    } else {
        Gap = setgap; // 使用默认标线距离
        Gaps = setgap; // 使用默认标线间距
    }
    // 验证标线距离格式（可选负号，1-2位整数，可选1-3位小数）
    var lineGapInfo = /^[-]{0,1}[0-9]{1,2}(\.[0-9]{1,3})?$/.test(
        lineGapInput.text
    );
    if (lineGapInfo) {
        objLineGap = lineGapInput.text; // 保存有效的标线距离值
        $.setenv("Specify_defaultlineGap", objLineGap); // 保存到环境变量
    }
    if (!lineGapInfo) {
        // 标线距离格式无效
        alert(
            "请输入有效的标线与对象距离值。\n值范围：-99.999 ~ 99.999",
            "错误提示"
        );
        lineGapInput.active = true; // 激活标线距离输入框
        lineGapInput.text = defaultlineGap; // 重置为默认值
        win.show();
    }
    // 验证和处理界线长度输入
    if (parseFloat(doubleLineInput.text) > 0) {
        // 检查界线长度是否大于0
        limitLen = parseFloat(doubleLineInput.text); // 设置界线长度值
    } else {
        limitLen = setDoubleLine; // 使用默认界线长度
    }
    // 验证界线长度格式（1-2位整数，可选1-3位小数）
    var doubleLineInfo = /^[0-9]{1,2}(\.[0-9]{1,3})?$/.test(
        doubleLineInput.text
    );
    if (doubleLineInfo) {
        objDoubleLine = doubleLineInput.text; // 保存有效的界线长度值
        $.setenv("Specify_defaultDoubleLine", objDoubleLine); // 保存到环境变量
    }
    if (!doubleLineInfo) {
        // 界线长度格式无效
        alert("请输入有效的两端短线值。\n值范围：>0 ~ 99.999", "错误提示");
        doubleLineInput.active = true; // 激活界线长度输入框
        doubleLineInput.text = defaultDoubleLine; // 重置为默认值
        win.show();
    }
    // 验证和处理箭头尺寸输入
    if (parseFloat(triangleSizeInput.text) > 0) {
        // 检查箭头尺寸是否大于0
        asize = parseFloat(triangleSizeInput.text); // 设置箭头尺寸值
    } else {
        asize = setAsizeSize; // 使用默认箭头尺寸
    }
    // 验证箭头尺寸格式（1-2位整数，可选1-3位小数）
    var triangleSizeInfo = /^[0-9]{1,2}(\.[0-9]{1,3})?$/.test(
        triangleSizeInput.text
    );
    if (triangleSizeInfo) {
        objTriangleSize = triangleSizeInput.text; // 保存有效的箭头尺寸值
        $.setenv("Specify_defaultTriangleSize", objTriangleSize); // 保存到环境变量
    }
    if (!triangleSizeInfo) {
        // 箭头尺寸格式无效
        beep(); // 发出提示音
        alert("请输入有效的标注箭头尺寸。\n值范围：>0 ~ 99.999。", "错误提示");
        triangleSizeInput.active = true; // 激活箭头尺寸输入框
        triangleSizeInput.text = defaultTriangleSize; // 重置为默认值
        win.show();
    }
    // 验证CMYK颜色值输入
    // 验证青色值（0-100之间的整数）
    var validCyanColor =
        /^[0-9]{1,3}$/.test(colorInputCyan.text) &&
        parseInt(colorInputCyan.text) >= 0 &&
        parseInt(colorInputCyan.text) <= 100;
    if (!validCyanColor) {
        // 青色值无效
        beep(); // 发出提示音
        alert("青色值必须为0—100之间整数。", "错误提示");
        colorInputCyan.active = true; // 激活青色输入框
        colorInputCyan.text = defaultColorCyan; // 重置为默认值
        win.show();
    }

    // 验证品红色值（0-100之间的整数）
    var validMagentaColor =
        /^[0-9]{1,3}$/.test(colorInputMagenta.text) &&
        parseInt(colorInputMagenta.text) >= 0 &&
        parseInt(colorInputMagenta.text) <= 100;
    if (!validMagentaColor) {
        // 品红色值无效
        beep(); // 发出提示音
        alert("红色值必须为0—100之间整数。", "错误提示");
        colorInputMagenta.active = true; // 激活品红色输入框
        colorInputMagenta.text = defaultColorMagenta; // 重置为默认值
        win.show();
    }

    // 验证黄色值（0-100之间的整数）
    var validYellowColor =
        /^[0-9]{1,3}$/.test(colorInputYellow.text) &&
        parseInt(colorInputYellow.text) >= 0 &&
        parseInt(colorInputYellow.text) <= 100;
    if (!validYellowColor) {
        // 黄色值无效
        beep(); // 发出提示音
        alert("黄色值必须为0—100之间整数。", "错误提示");
        colorInputYellow.active = true; // 激活黄色输入框
        colorInputYellow.text = defaultColorYellow; // 重置为默认值
        win.show();
    }

    // 验证黑色值（0-100之间的整数）
    var validBlackColor =
        /^[0-9]{1,3}$/.test(colorInputBlack.text) &&
        parseInt(colorInputBlack.text) >= 0 &&
        parseInt(colorInputBlack.text) <= 100;
    if (!validBlackColor) {
        // 黑色值无效
        beep(); // 发出提示音
        alert("黑色值必须为0—100之间整数。", "错误提示");
        colorInputBlack.active = true; // 激活黑色输入框
        colorInputBlack.text = defaultColorBlack; // 重置为默认值
        win.show();
    }
    // 如果所有CMYK颜色值都有效，保存颜色设置
    if (
        validCyanColor &&
        validMagentaColor &&
        validYellowColor &&
        validBlackColor
    ) {
        // 设置CMYK颜色值
        color.cyan = colorInputCyan.text; // 设置青色值
        color.magenta = colorInputMagenta.text; // 设置品红色值
        color.yellow = colorInputYellow.text; // 设置黄色值
        color.black = colorInputBlack.text; // 设置黑色值

        // 保存CMYK颜色值到环境变量
        $.setenv("Specify_defaultColorCyan", color.cyan); // 保存青色值
        $.setenv("Specify_defaultColorMagenta", color.magenta); // 保存品红色值
        $.setenv("Specify_defaultColorYellow", color.yellow); // 保存黄色值
        $.setenv("Specify_defaultColorBlack", color.black); // 保存黑色值
    }
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
    if (sel.length > 0 && eachSizeCheck.value) {
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
    // 处理间距标注模式
    if (sel.length == 2 && betweenSize) {
        // 如果选中两个对象且选择了间距标注
        labelGroupNames = "间距"; // 设置标注组名称
        // 根据选择的标注边添加标注
        if (top) {
            Double_DIMENSIONS(sel[0], sel[1], "Top"); // 添加上边间距标注
        }
        if (left) {
            Double_DIMENSIONS(sel[0], sel[1], "Left"); // 添加左边间距标注
        }
        if (right) {
            Double_DIMENSIONS(sel[0], sel[1], "Right"); // 添加右边间距标注
        }
        if (bottom) {
            Double_DIMENSIONS(sel[0], sel[1], "Bottom"); // 添加下边间距标注
        }
    } else {
        if (sel.length !== 2 && betweenSize) {
            // 如果选中对象不是两个但选择了间距标注
            alert("间距标注：\n请先选择二个对象。 ", "错误提示");
        }
    }
    // 处理总距标注模式
    if (sel.length > 1 && entiretySize) {
        // 如果选中多个对象且选择了总距标注
        labelGroupNames = "总距"; // 设置标注组名称
        // 根据选择的标注边添加标注
        if (top) {
            Entirety_DIMENSIONS(sel[0], "Top"); // 添加上边总距标注
        }
        if (left) {
            Entirety_DIMENSIONS(sel[0], "Left"); // 添加左边总距标注
        }
        if (right) {
            Entirety_DIMENSIONS(sel[0], "Right"); // 添加右边总距标注
        }
        if (bottom) {
            Entirety_DIMENSIONS(sel[0], "Bottom"); // 添加下边总距标注
        }
    } else {
        if (sel.length == 1 && entiretySize) {
            // 如果只选中一个对象但选择了总距标注
            alert("总距离标注：\n请先选择多个对象。", "错误提示");
        }
    }

    // 单体标注函数：为每个选中对象添加标注
    function Each_DIMENSIONS(bound, where) {
        var bound = new Array(); // 创建边界数组
        for (var i = 0; i < sel.length; i += 1) {
            // 遍历所有选中对象
            a = NO_CLIP_BOUNDS(sel[i]); // 获取对象边界（考虑剪切蒙版）
            if (lineStrokeCheckbox.value) {
                // 如果包含描边
                // 使用包含描边的边界值
                bound[0] = a[4]; // 左边界
                bound[1] = a[5]; // 上边界
                bound[2] = a[6]; // 右边界
                bound[3] = a[7]; // 下边界
            } else {
                // 使用不包含描边的边界值
                bound[0] = a[0]; // 左边界
                bound[1] = a[1]; // 上边界
                bound[2] = a[2]; // 右边界
                bound[3] = a[3]; // 下边界
            }
            linedraw(bound, where); // 绘制标注线
        }
    }

    function Double_DIMENSIONS(item1, item2, where) {
        var bound = new Array();
        for (var i = 1; i < sel.length; i += 1) {
            var a = NO_CLIP_BOUNDS(sel[i]);
            if (lineStrokeCheckbox.value) {
                a[0] = a[4];
                a[1] = a[5];
                a[2] = a[6];
                a[3] = a[7];
            } else {
                a[0] = a[0];
                a[1] = a[1];
                a[2] = a[2];
                a[3] = a[3];
            }
            var b = NO_CLIP_BOUNDS(sel[i - 1]);
            if (lineStrokeCheckbox.value) {
                b[0] = b[4];
                b[1] = b[5];
                b[2] = b[6];
                b[3] = b[7];
            } else {
                b[0] = b[0];
                b[1] = b[1];
                b[2] = b[2];
                b[3] = b[3];
            }
            if (where == "Top" || where == "Bottom") {
                if (b[0] > a[0]) {
                    if (b[0] > a[2]) {
                        bound[0] = a[2];
                        bound[2] = a[0];
                    } else {
                        bound[0] = b[2];
                        bound[2] = a[2];
                    }
                } else {
                    if (a[0] >= b[0]) {
                        if (a[0] > b[2]) {
                            bound[0] = a[2];
                            bound[2] = a[0];
                        } else {
                            bound[0] = a[2];
                            bound[2] = b[2];
                        }
                    }
                }
                bound[1] = Math.max(a[1], b[1]);
                bound[3] = Math.min(a[3], b[3]);
            } else {
                if (where == "Left" || where == "Right") {
                    if (b[3] > a[3]) {
                        if (b[3] > a[1]) {
                            bound[3] = a[1];
                            bound[1] = a[3];
                        } else {
                            bound[3] = b[1];
                            bound[1] = a[1];
                        }
                    } else {
                        if (a[3] >= b[3]) {
                            if (a[3] > b[1]) {
                                bound[3] = a[1];
                                bound[1] = a[3];
                            } else {
                                bound[3] = a[1];
                                bound[1] = b[1];
                            }
                        }
                    }
                    bound[0] = Math.min(a[0], b[0]);
                    bound[2] = Math.max(a[2], b[2]);
                }
            }
            Gap = tsize + limitLen + Gaps;
            linedraw(bound, where);
            if (where == "Top" || where == "Bottom") {
                if (b[0] > a[0]) {
                    if (b[0] > a[2]) {
                        bound[0] = a[2];
                    } else {
                        bound[0] = b[0];
                    }
                } else {
                    if (a[0] >= b[0]) {
                        if (a[0] > b[2]) {
                            bound[0] = b[2];
                        } else {
                            bound[0] = a[0];
                        }
                    }
                }
                if (b[2] > a[2]) {
                    if (b[0] > a[2]) {
                        bound[2] = b[0];
                    } else {
                        bound[2] = a[2];
                    }
                } else {
                    if (a[2] >= b[2]) {
                        if (a[0] > b[2]) {
                            bound[2] = a[0];
                        } else {
                            bound[2] = b[2];
                        }
                    }
                }
                bound[1] = Math.max(a[1], b[1]);
                bound[3] = Math.min(a[3], b[3]);
            } else {
                if (where == "Left" || where == "Right") {
                    if (b[1] > a[1]) {
                        if (b[3] > a[1]) {
                            bound[1] = b[3];
                        } else {
                            bound[1] = a[1];
                        }
                    } else {
                        if (a[1] >= b[1]) {
                            if (a[3] > b[1]) {
                                bound[1] = a[3];
                            } else {
                                bound[1] = b[1];
                            }
                        }
                    }
                    if (b[3] > a[3]) {
                        if (b[3] > a[1]) {
                            bound[3] = a[1];
                        } else {
                            bound[3] = b[3];
                        }
                    } else {
                        if (a[3] >= b[3]) {
                            if (a[3] > b[1]) {
                                bound[3] = b[1];
                            } else {
                                bound[3] = a[3];
                            }
                        }
                    }
                    bound[0] = Math.min(a[0], b[0]);
                    bound[2] = Math.max(a[2], b[2]);
                }
            }
            Gap = tsize + limitLen + Gaps;
            linedraw(bound, where);
            if (where == "Top" || where == "Bottom") {
                if (b[0] > a[0]) {
                    if (b[0] > a[2]) {
                        bound[0] = b[2];
                        bound[2] = b[0];
                    } else {
                        bound[0] = b[0];
                        bound[2] = a[0];
                    }
                } else {
                    if (a[0] >= b[0]) {
                        if (a[0] > b[2]) {
                            bound[0] = b[2];
                            bound[2] = b[0];
                        } else {
                            bound[0] = a[0];
                            bound[2] = b[0];
                        }
                    }
                }
                bound[1] = Math.max(a[1], b[1]);
                bound[3] = Math.min(a[3], b[3]);
            } else {
                if (where == "Left" || where == "Right") {
                    if (b[3] > a[3]) {
                        if (b[3] > a[1]) {
                            bound[3] = b[1];
                            bound[1] = b[3];
                        } else {
                            bound[3] = b[3];
                            bound[1] = a[3];
                        }
                    } else {
                        if (a[3] >= b[3]) {
                            if (a[3] > b[1]) {
                                bound[3] = b[1];
                                bound[1] = b[3];
                            } else {
                                bound[3] = a[3];
                                bound[1] = b[3];
                            }
                        }
                    }
                    bound[0] = Math.min(a[0], b[0]);
                    bound[2] = Math.max(a[2], b[2]);
                }
            }
            Gap = tsize + limitLen + Gaps;
            linedraw(bound, where);
        }
    }

    /**
     * 总距标注函数：计算多个选中对象的整体边界，并添加标注
     * @param {Object} item1 - 第一个选中对象（未使用）
     * @param {String} where - 标注位置（"Top", "Bottom", "Left", "Right"）
     */
    function Entirety_DIMENSIONS(item1, where) {
        var bound = new Array(); // 存储边界数组
        var n = sel.length; // 获取选中对象数量
        if (n > 0) {
            var bound = NO_CLIP_BOUNDS(sel[0]); // 获取第一个对象的边界
            // 根据是否包含描边设置边界值
            if (lineStrokeCheckbox.value) {
                // 如果包含描边
                bound[0] = bound[4]; // 使用包含描边的左边界
                bound[1] = bound[5]; // 使用包含描边的上边界
                bound[2] = bound[6]; // 使用包含描边的右边界
                bound[3] = bound[7]; // 使用包含描边的下边界
            } else {
                // 如果不包含描边
                bound[0] = bound[0]; // 使用不包含描边的左边界
                bound[1] = bound[1]; // 使用不包含描边的上边界
                bound[2] = bound[2]; // 使用不包含描边的右边界
                bound[3] = bound[3]; // 使用不包含描边的下边界
            }
        }
        if (n > 1) {
            // 如果选中了多个对象
            // 遍历其余对象，更新整体边界
            for (var i = 1; i < sel.length; i += 1) {
                var b = NO_CLIP_BOUNDS(sel[i]); // 获取当前对象的边界
                // 根据是否包含描边设置边界值
                if (lineStrokeCheckbox.value) {
                    // 如果包含描边
                    b[0] = b[4]; // 使用包含描边的左边界
                    b[1] = b[5]; // 使用包含描边的上边界
                    b[2] = b[6]; // 使用包含描边的右边界
                    b[3] = b[7]; // 使用包含描边的下边界
                } else {
                    // 如果不包含描边
                    b[0] = b[0]; // 使用不包含描边的左边界
                    b[1] = b[1]; // 使用不包含描边的上边界
                    b[2] = b[2]; // 使用不包含描边的右边界
                    b[3] = b[3]; // 使用不包含描边的下边界
                }
                // 更新整体边界：取最小的左边界和下边界，最大的右边界和上边界
                if (bound[0] > b[0]) {
                    bound[0] = b[0]; // 更新左边界
                }
                if (bound[1] < b[1]) {
                    bound[1] = b[1]; // 更新上边界
                }
                if (bound[2] < b[2]) {
                    bound[2] = b[2]; // 更新右边界
                }
                if (bound[3] > b[3]) {
                    bound[3] = b[3]; // 更新下边界
                }
            }
        }
        // 计算标注线与对象的间距：字号 + 界线长度 * 2 + 标线距离
        Gap = (tsize + limitLen) * 2 + Gaps;
        linedraw(bound, where); // 绘制标注线
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
        if (arrowSealingCheckbox.value) {
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
                if (arrowCheckbox.value) {
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
                        [
                            xb + w - asize,
                            xb + w - asize,
                            y + limitLen / 2 + Gap + asize / 2,
                        ], // 箭头右下点
                    ]);
                    // 将箭头添加到标注组中
                    topArrows1.move(topGroup, ElementPlacement.PLACEATEND);
                    topArrows2.move(topGroup, ElementPlacement.PLACEATEND);
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(
                    w,
                    x + w / 2,
                    y + limitLen / 2 + Gap + LineW,
                    unitConvert
                );
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
                bottomLines1.move(
                    bottomGroup,
                    ElementPlacement.PLACEATBEGINNING
                );
                bottomLines2.move(bottomGroup, ElementPlacement.PLACEATEND);
                bottomLines3.move(bottomGroup, ElementPlacement.PLACEATEND);
                // 如果启用了箭头显示
                if (arrowCheckbox.value) {
                    // 创建左侧箭头
                    var bottomArrows1 = new arrowsAdd([
                        [xa + asize, y - h - (limitLen / 2 + Gap) - asize / 2], // 箭头左上点
                        [xa, y - h - (limitLen / 2 + Gap)], // 箭头尖端
                        [xa + asize, y - h - (limitLen / 2 + Gap) + asize / 2], // 箭头左下点
                    ]);
                    // 创建右侧箭头
                    var bottomArrows2 = new arrowsAdd([
                        [
                            xb + w - asize,
                            y - h - (limitLen / 2 + Gap) - asize / 2,
                        ], // 箭头右上点
                        [xb + w, y - h - (limitLen / 2 + Gap)], // 箭头尖端
                        [
                            xb + w - asize,
                            y - h - (limitLen / 2 + Gap) + asize / 2,
                        ], // 箭头右下点
                    ]);
                    // 将箭头添加到标注组中
                    bottomArrows1.move(
                        bottomGroup,
                        ElementPlacement.PLACEATEND
                    );
                    bottomArrows2.move(
                        bottomGroup,
                        ElementPlacement.PLACEATEND
                    );
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(
                    w,
                    x + w / 2,
                    y - h - limitLen / 2 - (Gap + LineW),
                    unitConvert
                );
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
                if (arrowCheckbox.value) {
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
                var textInfo = specTextLabel(
                    h,
                    x - (limitLen / 2 + Gap + LineW),
                    y - h / 2,
                    unitConvert
                );
                textInfo.rotate(
                    -90,
                    true,
                    false,
                    false,
                    false,
                    Transformation.BOTTOMLEFT
                ); // 文字旋转90度
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
                if (arrowCheckbox.value) {
                    // 创建上侧箭头
                    var rightArrows1 = new arrowsAdd([
                        [x + w + limitLen / 2 + Gap - asize / 2, ya - asize], // 箭头上左点
                        [x + w + limitLen / 2 + Gap, ya], // 箭头尖端
                        [x + w + limitLen / 2 + Gap + asize / 2, ya - asize], // 箭头上右点
                    ]);
                    // 创建下侧箭头
                    var rightArrows2 = new arrowsAdd([
                        [
                            x + w + limitLen / 2 + Gap - asize / 2,
                            yb - h + asize,
                        ], // 箭头下左点
                        [x + w + limitLen / 2 + Gap, yb - h], // 箭头尖端
                        [
                            x + w + limitLen / 2 + Gap + asize / 2,
                            yb - h + asize,
                        ], // 箭头下右点
                    ]);
                    rightArrows1.move(rightGroup, ElementPlacement.PLACEATEND);
                    rightArrows2.move(rightGroup, ElementPlacement.PLACEATEND);
                }
                // 创建并定位标注文字
                var textInfo = specTextLabel(
                    h,
                    x + w + limitLen / 2 + Gap + LineW,
                    y - h / 2,
                    unitConvert
                );
                textInfo.rotate(
                    -90,
                    true,
                    false,
                    false,
                    false,
                    Transformation.BOTTOMLEFT
                ); // 文字旋转90度
                textInfo.top += textInfo.width; // 调整文字垂直位置
                textInfo.top += textInfo.height / 2; // 文字垂直居中
                textInfo.move(rightGroup, ElementPlacement.PLACEATBEGINNING);
                // 将整个标注组添加到主标注组中
                rightGroup.move(itemsGroup, ElementPlacement.PLACEATEND);
            }
        }
    }
    // 如果选择了锁定标注层，则锁定标注层
    if (lockedLay.value == true) {
        specsLayer.locked = true;
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
        textInfo.textRange.characterAttributes.alignment =
            StyleRunAlignmentType.center; // 设置文字居中对齐
        try {
            textInfo.textRange.characterAttributes.textFont =
                app.textFonts.getByName(fontNamelist); // 设置字体
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
        if (textUnitsCheck.value) {
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
        case "true": // 如果是"true"
            return true;
            break;
        case "false": // 如果是"false"
            return false;
            break;
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
    if (
        app.name == "Adobe Illustrator" &&
        app.documents.length > 0 &&
        app.activeDocument.selection.length > 0
    ) {
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
