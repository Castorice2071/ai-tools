// 金属颜色
var METALCOLOR = new RGBColor();
METALCOLOR.red = 211;
METALCOLOR.green = 211;
METALCOLOR.blue = 211;

// 创建一个新文档
// var doc = app.documents.add()

var doc = app.activeDocument;
// doc.pathItems.rectangle(100, 100, 100, 100);

var aaaaa = doc.pathItems.add();
try {
    aaaaa.setEntirePath([
        [0, 0],
        [200, 0],
        [200, 200],
        [0, 200],
        [0, 0],
    ]);

    aaaaa.strokeWidth = new UnitValue(9, 'px'); // 明确指定单位;
    aaaaa.strokeColor = METALCOLOR;
    aaaaa.stroked = true;
} catch (error) {
    alert(error.message);
}

// if (app.documents.length > 0) {
//     var lineList = [];

//     for (i = 0; i < 10; i++) {
//         lineList.push([i * 10 + 50, ((i - 5) ^ 2) * 5 + 50]);
//     }

//     app.defaultStroked = true;
//     newPath = app.activeDocument.pathItems.add();
//     newPath.setEntirePath(lineList);
// }
