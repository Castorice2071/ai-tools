//@target illustrator

function main() {
    var win = new Window("dialog", "我的天");
    win.show();
}

try {
    var doc = app.activeDocument;
    var sel = doc.selection;
    if (sel.length <= 0) {
        alert("请先选择标注对象！");
    } else {
        main();
    }
} catch (error) {}
