//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

function main() {
    var SCRIPT = {
        name: "标注尺寸",
        version: "v0.0.1",
    };

    var doc = app.activeDocument
    var sel = doc.selection
    var obj = sel[0]

    if (!obj) {
        throw new Error("请先选择标注对象！")
    }
}

try {
    main();
} catch (error) {
    alert(error);
}
