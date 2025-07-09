//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);

var bit = 64; // AI软件系统位数，默认64位，如果点击合集面板按钮没有反应，可以将64改为32。
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

function main() {
    var SCRIPT = {
            name: "AI-TOOLS",
            version: "v0.0.1",
            path: new File($.fileName).path, // 获取脚本所在目录
        },
        CFG = {};

    var win = buildUI(SCRIPT, CFG);

    win.btn1.onClick = function () {
        load_jsxbin(SCRIPT.path + "./标注尺寸.jsxbin");
    };

    win.btn2.onClick = function () {
        load_jsxbin(SCRIPT.path + "./标注颜色.jsxbin");
    };

    win.btn3.onClick = function () {
        load_jsxbin(SCRIPT.path + "./对象排列.jsxbin");
    };

    win.show();
}

function buildUI(SCRIPT, CFG) {
    var win = new Window("palette", SCRIPT.name + " " + SCRIPT.version);

    win.btn1 = win.add("button", undefined, "标注尺寸");
    win.btn2 = win.add("button", undefined, "标注颜色");
    win.btn3 = win.add("button", undefined, "对象排列");

    return win;
}

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

function load_jsxbin(file) {
    var file = new File(file);
    if (file.open("r")) {
        var fileContent = file.read();
        file.close();
        buildMsg(fileContent.toString());
    } else {
        alert("文件打开失败: " + file);
    }
}

try {
    main();
} catch (error) {
    $.writeln("Error: " + (error && error.message ? error.message : error));
    alert(error && error.message ? error.message : error);
}
