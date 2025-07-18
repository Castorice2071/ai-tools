//@target illustrator

var bit = 32;
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

function buildMsg(code) {
    try {
        var bt = new BridgeTalk();
        bt.target = vs;
        bt.body = code;
        bt.send();
    } catch (error) {}
}

var win = new Window("palette", "按键激活状态查看");

var btn1 = win.add("button", undefined, "按钮1", { name: "btn1", type: "momentary" });
var btn2 = win.add("button", undefined, "按钮2", { name: "btn2", type: "momentary" });

btn1.onClick = function () {
    btn1.enabled = false;
    buildMsg("fn1()");
    btn1.enabled = true;
};

btn2.onClick = function () {
    alert("按钮2被点击了");
};

win.show();

function fn1() {
    $.writeln("按钮1被点击了");
}
