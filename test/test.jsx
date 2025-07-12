//@target illustrator
//@targetengine main

var SCRIPT = {
    name: "图稿设计工具箱",
    version: "v1.0.0",
};

// 创建窗口
var win = new Window("palette", SCRIPT.name + " " + SCRIPT.version);

// 创建 Tab 面板
var TPDEL = win.add("tabbedpanel", undefined, undefined, { name: "TPDEL" });
// 创建 面板A
var TA = TPDEL.add("tab", undefined, undefined, { name: "TA" });
TA.text = "面板A";

var btn1 = TA.add("button", undefined, "识别颜色并导出");

win.show();
