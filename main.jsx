#target illustrator
#targetengine main

var scriptFile = File($.fileName);
var scriptPath = scriptFile.parent.fsName;

var bit = 64; // AI软件系统位数，默认64位，如果点击合集面板按钮没有反应，可以将64改为32。
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        var msg = code;
        bt.body = msg;
        bt.send();
    } catch (e) {
        alert(e);
    }
}

var win = new Window("palette", "AI-TOOLS");

var btnGroup = win.add("group");

var btn1 = btnGroup.add("button", undefined, "标注尺寸");
var btn2 = btnGroup.add("button", undefined, "测试");

btn1.onClick = function () {
    try {
        load_jsxbin(File(scriptPath + "./makesize.jsxbin"));
    } catch (e) {
        alert(e);
    }
};

btn2.onClick = function() {
    try {
        $.evalFile(File(scriptPath + "./dimension.jsx"));
    } catch (e) {
        alert(e);
    }
}

win.show();

// 读取加载jsxbin文件，传递给AI软件
function load_jsxbin(file) {
    var file = new File(file);
    if (file.open("r")) {
        var fileContent = file.read();
        file.close();
        buildMsg(fileContent);
    } else {
        alert("文件打开失败: " + file);
    }
}
