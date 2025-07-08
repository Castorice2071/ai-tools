// var doc = app.activeDocument;
// var x1 = 0,
//     y1 = 0,
//     x2 = 300,
//     y2 = -300; // 设定选区范围
// doc.selection = null;
// for (var i = 0; i < doc.pageItems.length; i++) {
//     var item = doc.pageItems[i];
//     var bounds = item.geometricBounds;
//     $.writeln("item " + i + ": " + bounds);
//     if (
//         bounds[0] >= x1 &&
//         bounds[2] <= x2 &&
//         bounds[1] <= y1 &&
//         bounds[3] >= y2
//     ) {
//         item.selected = true;
//     }
// }

// try {
//     var item = app.activeDocument.selection[0]; // 获取当前选中的第一个对象
//     item.selected = true;
//     var bounds = item.geometricBounds;
//     $.writeln("item " + i + ": " + bounds);
// } catch (error) {
//     alert(error.message);
// }

// var doc = app.activeDocument;
// var docWidth = doc.width;   // 文档宽度（单位：点）
// var docHeight = doc.height; // 文档高度（单位：点）
// alert("文档宽度: " + docWidth + " pt\n文档高度: " + docHeight + " pt");

// var color = new RGBColor();
// color.red = 0;
// color.green = 0;
// color.blue = 0;
// var rect = app.activeDocument.pathItems.rectangle(0, 0, 100, 100);
// rect.stroked = true;
// rect.strokeWidth = 1;
// rect.strokeColor = color; // 黑色
// rect.filled = false;


