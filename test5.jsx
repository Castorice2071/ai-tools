/**
 * 新建一个文档
 */
function createNewDocument() {
    var doc = app.documents.add();
    return doc;
}

var texts = [
    {
        label: "Crafts",
        value: "Soft Enamel",
    },
    {
        label: "Material",
        value: "Stamping",
    },
];

// 在新文档中绘制表格
function drawTable(doc, data, startX, startY, cellWidth, cellHeight) {
    var layer = doc.activeLayer;
    var rows = data.length;
    var cols = 2; // label 和 value

    // 画表格线
    for (var i = 0; i <= rows; i++) {
        var y = startY - i * cellHeight;
        var line = doc.pathItems.add();
        line.setEntirePath([
            [startX, y],
            [startX + cols * cellWidth, y]
        ]);
        line.stroked = true;
        line.strokeWidth = 0.5;
        line.filled = false;
    }
    for (var j = 0; j <= cols; j++) {
        var x = startX + j * cellWidth;
        var line = doc.pathItems.add();
        line.setEntirePath([
            [x, startY],
            [x, startY - rows * cellHeight]
        ]);
        line.stroked = true;
        line.strokeWidth = 0.5;
        line.filled = false;
    }

    // 填充文字
    for (var i = 0; i < rows; i++) {
        // label
        var labelText = doc.textFrames.add();
        labelText.contents = data[i].label;
        labelText.left = startX + 5;
        labelText.top = startY - i * cellHeight - 5;
        // value
        var valueText = doc.textFrames.add();
        valueText.contents = data[i].value;
        valueText.left = startX + cellWidth + 5;
        valueText.top = startY - i * cellHeight - 5;
    }
}

// 示例调用
var doc = createNewDocument();
drawTable(app.activeDocument, texts, 100, 600, 100, 40);