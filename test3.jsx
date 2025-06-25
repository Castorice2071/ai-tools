// script to be executed in Photoshop CS4
// #target "photoshop-11.0"

// check that the target app is installed

var bit = 64; // AI软件系统位数，默认64位，如果点击合集面板按钮没有反应，可以将64改为32。
var aiVersion = app.version.split(".")[0];
var vs = "illustrator-" + aiVersion + ".0" + bit;

var targetApp = BridgeTalk.getSpecifier(vs);

$.writeln(targetApp);

// 实际代码建立 buildMsg(code) 函数传送代码
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

if (targetApp) {
    // construct a message object
    var bt = new BridgeTalk();

    // the message is intended for Adobe Bridge CS4
    bt.target = targetApp;

    // the script to evaluate is contained in a string in the "body" property
    bt.body = "new Document('C:\\BridgeScripts');app.document.target.children.length;";

    // define result handler callback
    bt.onResult = function (returnBtObj) {
        processResult(returnBtObj.body);
    }; //fn defined elsewhere

    // send the message asynchronously
    bt.send();
}

$.writeln(BridgeTalk.getTargets());
$.writeln(BridgeTalk.getSpecifier("photoshop"));
$.writeln(BridgeTalk.launch("photoshop-60.032"));

function test1() {
    alert("test1");
}
function test2() {
    alert("test2");
}
function test3() {
    alert("test3");
}

buildMsg("test1();");
buildMsg("test2();");
buildMsg("test3();");
