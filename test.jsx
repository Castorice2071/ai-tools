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
