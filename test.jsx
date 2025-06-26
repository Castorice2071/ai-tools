var win = new Window("dialog", "标注尺寸", undefined);

optionsPanel = win.add("group").add("panel", [0, 0, 300, 110], "设置选项");

optionsPanel.alignChildren = "left"

unitModeLabel = optionsPanel.add("statictext", undefined, "单位:");
unitModeList = optionsPanel.add("dropdownlist", undefined);
// 定义可选单位列表
var items = new Array("自动-auto", "毫米-mm", "厘米-cm", "米-m", "磅-pt", "像素-px", "英寸-in", "英尺-ft", "派卡-pc");

// 添加单位选项到下拉列表
for (var j = 0; j < items.length; j += 1) {
    if (j == 0) {
        unitModeList.add("item", items[0]);
        unitModeList.add("separator");
    } else {
        unitModeList.add("item", items[j]);
    }
}
unitModeList.selection = 0;

win.show();
/**
 * 获取选中对象的宽度
 */
function getSelectedWidth() {
    var sel = app.activeDocument.selection;
    if (sel.length === 0) {
        alert("请先选择一个对象");
        return;
    }
    var bounds = sel[0].geometricBounds;
    var width = bounds[2] - bounds[0];
    return width;
}

// var w = getSelectedWidth();
// $.writeln("pt", new UnitValue(w, "pt").as("pt"));
// $.writeln("px", new UnitValue(w, "pt").as("px"));
// $.writeln("cm", new UnitValue(w, "pt").as("cm"));
// $.writeln("in", new UnitValue(w, "pt").as("in"));



var str =
    "dialog { \
    colorPanel: Panel { \
        text: '标注颜色', \
        orientation: 'column', \
        alignChildren: 'right', \
        cyan: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Cyan:' } \
            value: EditText { characters: 4 } \
        }, \
        magenta: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Magenta:' } \
            value: EditText { characters: 4 } \
        }, \
        yellow: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Yellow:' } \
            value: EditText { characters: 4 } \
        }, \
        black: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Black:' } \
            value: EditText { characters: 4 } \
        }, \
    } \
}";

// 创建主对话框窗口
var res =
    "dialog { \
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
    colorPanel: Panel { \
        text: '标注颜色', \
        orientation: 'row', \
        alignChildren: 'right', \
        cyan: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Cyan:' } \
            value: EditText { characters: 4 } \
        }, \
        magenta: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Magenta:' } \
            value: EditText { characters: 4 } \
        }, \
        yellow: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Yellow:' } \
            value: EditText { characters: 4 } \
        }, \
        black: Group { \
            orientation: 'row', \
            label: StaticText { text: 'Black:' } \
            value: EditText { characters: 4 } \
        }, \
    }, \
    optionsPanel: Panel { \
        text: '设置选项', \
        orientation: 'column', \
        alignChildren: 'left', \
        margins: 16, \
        spacing: 10, \
        unitGroup: Group { \
            orientation: 'row', \
            spacing: 5, \
            unitModeLabel: StaticText { text: '单位:' }, \
            unitModeList: DropDownList { alignment: 'fill', preferredSize: [150, -1] } \
        }, \
    }, \
    buttonGroup: Group { \
        orientation: 'row', \
        alignment: 'center', \
        spacing: 10, \
        ok_button: Button { text: '确定', name: 'ok' }, \
        cancel_button: Button { text: '取消', name: 'cancel' } \
    } \
}";


var res = `
    

`

var win = new Window(res);
// win.buttonGroup.ok_button.onClick = function () {
//     alert("确定");
//     win.close();
// };
// win.buttonGroup.cancel_button.onClick = function () {
//     alert("取消");
//     win.close();
// };

win.show();
