/**
 * 获取选中对象的宽度
 */
function getSelectedWidth() {
    var sel = app.activeDocument.selection;
    if (sel.length === 0) {
        alert("请先选择一个对象");
        return;
    }
    var bounds = sel[0].geometricBounds;
    var width = bounds[2] - bounds[0];
    return width;
}

var w = getSelectedWidth();
$.writeln("pt", new UnitValue(w, "pt").as("pt"));
$.writeln("px", new UnitValue(w, "pt").as("px"));
$.writeln("cm", new UnitValue(w, "pt").as("cm"));
$.writeln("in", new UnitValue(w, "pt").as("in"));
