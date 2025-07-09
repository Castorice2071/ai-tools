/**
 * 绘制一个填充指定 SpotColor 的小方块，并在右侧标注颜色名
 * @param {Document} doc - 当前文档
 * @param {SpotColor} spotColor - SpotColor 对象
 * @param {number} left - 方块左上角X坐标
 * @param {number} top - 方块左上角Y坐标
 * @param {number} size - 方块边长
 */
function drawSpotColorBlockWithLabel(doc, spotColor, left, top, size) {
    var newSpotColor = new SpotColor();
    newSpotColor.spot = doc.spots.getByName(spotColor); // 获取指定名称的 SpotColor

    // 1. 绘制方块
    var rect = doc.pathItems.rectangle(top, left, size, size);
    rect.filled = true;
    rect.fillColor = newSpotColor;
    rect.stroked = true;
    rect.strokeWidth = 0.5;

    // 2. 绘制文字
    var label = doc.textFrames.add();
    label.contents = spotColor;
    label.left = left + size + 8; // 方块右侧留8pt间距
    label.top = top - size / 2 + 5; // 垂直居中微调
    label.textRange.characterAttributes.size = 10;
}

// 示例调用
var doc = app.activeDocument;
// 获取一个 SpotColor（以第一个 pageItem 的 fillColor 为例）
var spotColor = "PANTONE 266 C";
if (spotColor) {
    drawSpotColorBlockWithLabel(doc, spotColor, 100, 100, 20);
} else {
    alert("未找到 SpotColor 对象！");
}
