/**
 * 色板 Swatches
 */

var swatches = app.activeDocument.swatches;
var swatche = swatches[0]; // 获取第一个色板

for (var i = 0; i < swatches.length; i++) {
    var swatch = swatches[i];
    $.writeln("Swatch " + (i + 1) + ": " + swatch.name);
}

// 文档中色板对象的集合
// $.writeln("swatches: " + swatches);
// $.writeln("swatches.length: " + swatches.length);
// $.writeln("swatchGroups.length: " + swatches.swatchGroups.length);

// printProperties(swatches);

// printProperties(swatche);

/**
 * 输出对象所有属性
 */
function printProperties(obj) {
    for (var prop in obj) {
        $.writeln(prop + ": " + obj[prop]);
    }
}

/**
 * 获取当前选中对象中的所有颜色
 */