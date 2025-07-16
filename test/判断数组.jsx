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


function main() {
    var arr = [[1, 2, 3]]

    $.writeln("数组长度: " + arr.length);
    $.writeln("数组内容: " + arr);

    $.writeln("是不是数组: " + arr instanceof Array);
}   

buildMsg("main();");