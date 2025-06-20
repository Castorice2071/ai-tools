#target illustrator
#targetengine main

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

main_panel();
function main_panel() {
    var panel = new Window("palette", "Adobe Illustrator 工具箱© 2025.06.20");
    panel.alignChildren = ["left", "top"];
    panel.spacing = 2;
    panel.margins = 3;

    // 创建按钮组
    var BtGroup1 = panel.add("group");
    var BtGroup2 = panel.add("group");

    // 设置按钮组为水平布局
    BtGroup1.orientation = "row";
    BtGroup2.orientation = "row";

    // 设置按钮组的边缘间距
    BtGroup1.spacing = 2; // 调整按钮之间的间距
    BtGroup2.spacing = 2;

    // 添加按钮
    var button1 = BtGroup1.add("button", undefined, "标注尺寸");

    button1.onClick = function () {
        alert("标注尺寸");
        if (ScriptUI.environment.keyboardState.ctrlKey) {
            buildMsg("shapes_info();");
        } else if (ScriptUI.environment.keyboardState.altKey) {
            make_size_plus();
        } else {
            buildMsg("make_size();");
        }
    };

    // 显示面板
    panel.show();
}

// 标注尺寸
function make_size() {
    // 定义当前激活文档
    var docRef = activeDocument;
    var mm = 25.4 / 72; // pt 和 mm 转换系数
    var myFont = textFonts.getByName("MicrosoftYaHei");
    var myFontSize = 24;
    var x, y;

    // 格式化尺寸为 mm 取整数
    function formatSize(size) {
        return Math.round(size * mm).toFixed(0);
    }

    // 设置填充颜色为CMYK红色 (0, 100, 100, 0)
    var cmykRed = new CMYKColor();
    cmykRed.cyan = 0;
    cmykRed.magenta = 100;
    cmykRed.yellow = 100;
    cmykRed.black = 0;

    function writeText(text) {
        var textRef = docRef.textFrames.add(); // 建立文本
        textRef.contents = text;
        textRef.textRange.characterAttributes.size = myFontSize; // 设置字体尺寸
        textRef.textRange.characterAttributes.textFont = myFont; // 设置字体名称
        textRef.textRange.characterAttributes.fillColor = cmykRed; // 设置颜色
        textRef.top = y + 15 / mm;
        textRef.left = x + 10 / mm;
    }

    // 遍历选择的物件标注尺寸
    if (docRef.selection.length > 0) {
        var mySelection = docRef.selection;
        for (var i = 0; i < mySelection.length; i++) {
            var s = mySelection[i];
            x = s.left;
            y = s.top;
            var str = formatSize(s.width) + "x" + formatSize(s.height) + "mm";
            writeText(str);
        }
    }
}

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

// 标注尺寸增强版 V2.1
function make_size_plus() {
    load_jsxbin("./makesize.jsx");
}
