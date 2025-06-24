/*
 * Illustrator 标注工具优化版
 * 版本: 1.0.0
 * 功能: 为选中对象添加尺寸标注
 */

// 配置管理模块
var Config = {
    VERSION: "1.0.0",
    LAYER_NAME: "尺寸标注层",

    // 环境变量管理
    env: {
        get: function (key, defaultValue) {
            return $.getenv(key) || defaultValue;
        },
        set: function (key, value) {
            $.setenv(key, value);
        },
    },

    // 默认设置
    defaults: {
        font: {
            size: 12,
            face: 2,
            getCurrent: function () {
                return {
                    size: Config.env.get("Specify_defaultFontSize", this.size),
                    face: Config.env.get("Specify_defaultFontFace", this.face),
                };
            },
        },
        line: {
            weight: 0.5,
            gap: 3,
            limitLength: 8,
            getCurrent: function () {
                return {
                    weight: Config.env.get("Specify_defaultLineWeight", this.weight),
                    gap: Config.env.get("Specify_defaultlineGap", this.gap),
                    limitLength: Config.env.get("Specify_defaultDoubleLine", this.limitLength),
                };
            },
        },
        color: {
            cyan: 0,
            magenta: 100,
            yellow: 100,
            black: 10,
            getCurrent: function () {
                var color = new CMYKColor();
                color.cyan = Config.env.get("Specify_defaultColorCyan", this.cyan);
                color.magenta = Config.env.get("Specify_defaultColorMagenta", this.magenta);
                color.yellow = Config.env.get("Specify_defaultColorYellow", this.yellow);
                color.black = Config.env.get("Specify_defaultColorBlack", this.black);
                return color;
            },
        },
    },
};

// 工具函数模块
var Utils = {
    // 类型转换
    toBoolean: function (value) {
        return value === "true" || value === true;
    },

    // 数值验证
    validateNumber: function (value, min, max, name) {
        var num = parseFloat(value);
        if (isNaN(num) || num < min || num > max) {
            throw new Error(name + "必须是" + min + "到" + max + "之间的数字");
        }
        return num;
    },

    // 获取对象边界
    getBounds: function (item) {
        try {
            if (item.typename === "GroupItem") {
                return this.getGroupBounds(item);
            }
            return item.visibleBounds;
        } catch (e) {
            return item.geometricBounds;
        }
    },

    getGroupBounds: function (group) {
        var bounds = {
            left: Infinity,
            top: -Infinity,
            right: -Infinity,
            bottom: Infinity,
        };

        for (var i = 0; i < group.pageItems.length; i++) {
            var itemBounds = this.getBounds(group.pageItems[i]);
            bounds.left = Math.min(bounds.left, itemBounds[0]);
            bounds.top = Math.max(bounds.top, itemBounds[1]);
            bounds.right = Math.max(bounds.right, itemBounds[2]);
            bounds.bottom = Math.min(bounds.bottom, itemBounds[3]);
        }

        return [bounds.left, bounds.top, bounds.right, bounds.bottom];
    },
};

// 标注创建类
function DimensionCreator(doc) {
    this.doc = doc;
    this.settings = Config.defaults;
    this.setupLayer();
}

DimensionCreator.prototype.setupLayer = function () {
    try {
        this.layer = this.doc.layers[Config.LAYER_NAME];
        this.layer.locked = false;
        this.layer.visible = true;
    } catch (e) {
        this.layer = this.doc.layers.add();
        this.layer.name = Config.LAYER_NAME;
    }
};

DimensionCreator.prototype.createDimension = function (item, options) {
    var bounds = Utils.getBounds(item);
    var group = this.layer.groupItems.add();

    if (options.top) {
        this.createTopDimension(bounds, group);
    }
    if (options.bottom) {
        this.createBottomDimension(bounds, group);
    }
    if (options.left) {
        this.createLeftDimension(bounds, group);
    }
    if (options.right) {
        this.createRightDimension(bounds, group);
    }

    return group;
};

DimensionCreator.prototype.createTopDimension = function (bounds, parent) {
    var params = this.calculateDimensionParams(bounds);
    var x = params[0],
        y = params[1],
        width = params[2];
    var group = parent.groupItems.add();
    group.name = "上边标注";

    var lineSettings = this.settings.line.getCurrent();
    var gap = lineSettings.gap * 2; // 增加间距
    var lineY = y - gap;

    // 创建主标注线
    this.createLine(
        [
            [x, lineY],
            [x + width, lineY],
        ],
        group,
    );

    // 创建端点线
    this.createEndLines(x, lineY, x + width, lineY, false, group);

    // 创建箭头
    this.createArrow(x, lineY, "right", group);
    this.createArrow(x + width, lineY, "left", group);

    // 创建标注文字
    this.createText(width, x + width / 2, lineY - lineSettings.limitLength, group);

    return group;
};

DimensionCreator.prototype.createBottomDimension = function (bounds, parent) {
    var params = this.calculateDimensionParams(bounds);
    var x = params[0],
        y = params[1],
        width = params[2],
        height = params[3];
    var group = parent.groupItems.add();
    group.name = "下边标注";

    var lineSettings = this.settings.line.getCurrent();
    var gap = lineSettings.gap * 2; // 增加间距
    var bottomY = y + height; // 底边y坐标
    var lineY = bottomY + gap;

    // 创建主标注线
    this.createLine(
        [
            [x, lineY],
            [x + width, lineY],
        ],
        group,
    );

    // 创建端点线
    this.createEndLines(x, lineY, x + width, lineY, false, group);

    // 创建箭头
    this.createArrow(x, lineY, "right", group);
    this.createArrow(x + width, lineY, "left", group);

    // 创建标注文字
    this.createText(width, x + width / 2, lineY + lineSettings.limitLength, group);

    return group;
};

DimensionCreator.prototype.createLeftDimension = function (bounds, parent) {
    var params = this.calculateDimensionParams(bounds);
    var x = params[0],
        y = params[1],
        width = params[2],
        height = params[3];
    var group = parent.groupItems.add();
    group.name = "左边标注";

    var lineSettings = this.settings.line.getCurrent();
    var gap = lineSettings.gap * 2; // 增加间距
    var lineX = x - gap;

    // 创建主标注线
    this.createLine(
        [
            [lineX, y],
            [lineX, y + height],
        ],
        group,
    );

    // 创建端点线
    this.createEndLines(lineX, y, lineX, y + height, true, group);

    // 创建箭头
    this.createArrow(lineX, y, "down", group);
    this.createArrow(lineX, y + height, "up", group);

    // 创建标注文字
    this.createVerticalText(height, lineX - lineSettings.limitLength, y + height / 2, group);

    return group;
};

DimensionCreator.prototype.createRightDimension = function (bounds, parent) {
    var params = this.calculateDimensionParams(bounds);
    var x = params[0],
        y = params[1],
        width = params[2],
        height = params[3];
    var group = parent.groupItems.add();
    group.name = "右边标注";

    var lineSettings = this.settings.line.getCurrent();
    var gap = lineSettings.gap * 2; // 增加间距
    var rightX = x + width; // 右边x坐标
    var lineX = rightX + gap;

    // 创建主标注线
    this.createLine(
        [
            [lineX, y],
            [lineX, y + height],
        ],
        group,
    );

    // 创建端点线
    this.createEndLines(lineX, y, lineX, y + height, true, group);

    // 创建箭头
    this.createArrow(lineX, y, "down", group);
    this.createArrow(lineX, y + height, "up", group);

    // 创建标注文字
    this.createVerticalText(height, lineX + lineSettings.limitLength, y + height / 2, group);

    return group;
};

DimensionCreator.prototype.createEndLines = function (x1, y1, x2, y2, isVertical, parent) {};

DimensionCreator.prototype.createVerticalText = function (value, x, y, parent) {
    var text = parent.textFrames.add();
    text.contents = this.formatDimensionValue(value);

    var fontSettings = this.settings.font.getCurrent();

    // 设置文字样式
    var textRange = text.textRange;
    textRange.size = fontSettings.size;
    textRange.fillColor = this.settings.color.getCurrent();

    // 设置垂直文本，先定位再旋转
    text.position = [x - text.height / 2, y - text.width / 2];
    text.rotate(90);

    return text;
};

DimensionCreator.prototype.createLine = function (points, parent) {
    var line = parent.pathItems.add();
    line.setEntirePath(points);
    line.stroked = true;
    line.strokeWidth = this.settings.line.getCurrent().weight;
    line.strokeColor = this.settings.color.getCurrent();
    line.filled = false;
    return line;
};

DimensionCreator.prototype.createArrow = function (x, y, direction, parent) {
    var lineSettings = this.settings.line.getCurrent();
    var arrowSize = lineSettings.limitLength / 3; // 调整箭头大小为端点线长度的1/3
    var points = [];

    switch (direction) {
        case "left":
            points = [
                [x + arrowSize, y - arrowSize / 2],
                [x, y],
                [x + arrowSize, y + arrowSize / 2],
            ];
            break;
        case "right":
            points = [
                [x - arrowSize, y - arrowSize / 2],
                [x, y],
                [x - arrowSize, y + arrowSize / 2],
            ];
            break;
        case "up":
            points = [
                [x - arrowSize / 2, y - arrowSize],
                [x, y],
                [x + arrowSize / 2, y - arrowSize],
            ];
            break;
        case "down":
            points = [
                [x - arrowSize / 2, y + arrowSize],
                [x, y],
                [x + arrowSize / 2, y + arrowSize],
            ];
            break;
    }

    var path = parent.pathItems.add();
    path.setEntirePath(points);
    path.stroked = true;
    path.strokeWidth = lineSettings.weight;
    path.strokeColor = this.settings.color.getCurrent();
    path.filled = false;

    return path;
};

DimensionCreator.prototype.createText = function (value, x, y, parent) {
    var text = parent.textFrames.add();
    text.contents = this.formatDimensionValue(value);

    var fontSettings = this.settings.font.getCurrent();

    // 设置文字样式
    var textRange = text.textRange;
    textRange.size = fontSettings.size;
    textRange.fillColor = this.settings.color.getCurrent();

    // 居中对齐文本
    text.position = [x - text.width / 2, y - text.height / 2];

    return text;
};

DimensionCreator.prototype.calculateDimensionParams = function (bounds) {
    return [
        bounds[0], // x
        bounds[1], // y
        bounds[2] - bounds[0], // width
        bounds[3] - bounds[1], // height (修正：y2 - y1)
    ];
};

DimensionCreator.prototype.formatDimensionValue = function (value) {
    // 根据当前单位设置格式化数值
    return value.toFixed(2) + " pt";
};

// UI类
function DimensionUI() {
    this.win = new Window("dialog", "标注尺寸 " + Config.VERSION);
    this.createUI();
}

DimensionUI.prototype.createUI = function () {
    // 创建边界选择面板
    this.createBoundaryPanel();
    // 创建设置面板
    this.createSettingsPanel();
    // 创建按钮组
    this.createButtonGroup();
};

DimensionUI.prototype.createBoundaryPanel = function () {
    var panel = this.win.add("panel", undefined, "选择标注边");
    panel.orientation = "row";
    panel.alignChildren = "center";

    this.controls = {
        top: panel.add("checkbox", undefined, "上边"),
        right: panel.add("checkbox", undefined, "右边"),
        bottom: panel.add("checkbox", undefined, "下边"),
        left: panel.add("checkbox", undefined, "左边"),
    };

    // 设置默认值和提示
    for (var key in this.controls) {
        if (this.controls.hasOwnProperty(key)) {
            var ctrl = this.controls[key];
            ctrl.value = false;
            ctrl.helpTip = "选择是否添加" + ctrl.text + "标注";
        }
    }
};

DimensionUI.prototype.createSettingsPanel = function () {
    var panel = this.win.add("panel", undefined, "设置");
    panel.orientation = "column";

    // 字号设置
    var fontGroup = panel.add("group");
    fontGroup.add("statictext", undefined, "字号:");
    this.fontSizeInput = fontGroup.add("edittext", undefined, Config.defaults.font.size);
    this.fontSizeInput.characters = 4;

    // 线宽设置
    var lineGroup = panel.add("group");
    lineGroup.add("statictext", undefined, "线宽:");
    this.lineWeightInput = lineGroup.add("edittext", undefined, Config.defaults.line.weight);
    this.lineWeightInput.characters = 4;
};

DimensionUI.prototype.createButtonGroup = function () {
    var self = this;
    var group = this.win.add("group");
    group.orientation = "row";
    group.alignChildren = "center";

    var okBtn = group.add("button", undefined, "确定");
    var cancelBtn = group.add("button", undefined, "取消");

    okBtn.onClick = function () {
        self.onOK();
    };
    cancelBtn.onClick = function () {
        self.win.close();
    };
};

DimensionUI.prototype.onOK = function () {
    try {
        this.validateInputs();
        this.applyDimensions();
        this.win.close();
    } catch (e) {
        alert(e.message);
    }
};

DimensionUI.prototype.validateInputs = function () {
    // 验证是否选择了至少一个边
    var hasSelected = false;
    for (var key in this.controls) {
        if (this.controls.hasOwnProperty(key) && this.controls[key].value) {
            hasSelected = true;
            break;
        }
    }

    if (!hasSelected) {
        throw new Error("请至少选择一个标注边");
    }

    // 验证数值输入
    Utils.validateNumber(this.fontSizeInput.text, 1, 1000, "字号");
    Utils.validateNumber(this.lineWeightInput.text, 0.1, 10, "线宽");
};

DimensionUI.prototype.applyDimensions = function () {
    var doc = app.activeDocument;
    var selection = doc.selection;

    if (!selection.length) {
        throw new Error("请选择要标注的对象");
    }

    var creator = new DimensionCreator(doc);

    // 更新设置
    Config.defaults.font.size = parseFloat(this.fontSizeInput.text);
    Config.defaults.line.weight = parseFloat(this.lineWeightInput.text);

    // 为每个选中对象添加标注
    for (var i = 0; i < selection.length; i++) {
        creator.createDimension(selection[i], {
            top: this.controls.top.value,
            right: this.controls.right.value,
            bottom: this.controls.bottom.value,
            left: this.controls.left.value,
        });
    }
};

DimensionUI.prototype.show = function () {
    return this.win.show();
};

// 主函数
function main() {
    try {
        if (!app.documents.length) {
            throw new Error("请先打开一个文档");
        }

        var ui = new DimensionUI();
        ui.show();
    } catch (e) {
        alert(e.message);
    }
}

// 运行脚本
main();
