//@target illustrator
//@targetengine main
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

var bit = 64; // AI软件系统位数，默认64位，如果点击合集面板按钮没有反应，可以将64改为32。
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

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

function main() {
    var SCRIPT = {
            name: "AI-TOOLS",
            version: "v0.0.1",
            path: new File($.fileName).path, // 获取脚本所在目录
        },
        CFG = {};

    var win = new Window("palette", SCRIPT.name + " " + SCRIPT.version);

    var btnsGroup = win.add("group");
    var btn1 = btnsGroup.add("button", undefined, "标注尺寸");
    btn1.onClick = function () {
        load_jsxbin(SCRIPT.path + "./标注尺寸.jsx");
    };
    win.show();
}

try {
    main();
} catch (e) {
    alert("脚本运行错误: " + e.message);
}

// var scriptFile = File($.fileName);
// var scriptPath = scriptFile.parent.fsName;

// var bit = 64; // AI软件系统位数，默认64位，如果点击合集面板按钮没有反应，可以将64改为32。
// var aiVersion = app.version.split(".")[0];
// var vs = "illustrator-" + aiVersion + ".0" + bit;

// function buildMsg(code) {
//     try {
//         var bt = new BridgeTalk();
//         bt.target = vs;
//         var msg = code;
//         bt.body = msg;
//         bt.send();
//     } catch (e) {
//         alert(e);
//     }
// }

// var win = new Window("dialog", "AI-TOOLS");

// var btnGroup = win.add("group");

// var btn1 = btnGroup.add("button", undefined, "标注尺寸");
// var btn2 = btnGroup.add("button", undefined, "获取物体信息");

// btn1.onClick = function () {
//     try {
//         load_jsxbin(File(scriptPath + "./dimension-new.jsxbin"));
//     } catch (e) {
//         alert(e);
//     }
// };

// btn2.onClick = function () {
//     try {
//         var doc = app.activeDocument;
//         var sel = doc.selection;
//         alert(sel[0].geometricBounds);
//         $.writeln(sel[0].geometricBounds);
//         win.close();
//     } catch (e) {
//         alert(e);
//     }
// };

// win.show();

// 读取加载jsxbin文件，传递给AI软件
// function load_jsxbin(file) {
//     var file = new File(file);
//     if (file.open("r")) {
//         var fileContent = file.read();
//         file.close();
//         buildMsg(fileContent);
//     } else {
//         alert("文件打开失败: " + file);
//     }
// }
