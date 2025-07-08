function createColor(rgb) {
    var color = new RGBColor();
    color.red = rgb[0];
    color.green = rgb[1];
    color.blue = rgb[2];
    return color;
}

// 创建一个矩形区域，并在其中添加段落文本（areaText）
// function addAreaText(doc, left, top, width, height, content) {
//     // 创建矩形路径
//     var rect = doc.pathItems.rectangle(top, left, width, height);
//     rect.fillColor = createColor([0, 0, 0]);
//     rect.filled = true;

//     // 在矩形路径上创建段落文本
//     var text = doc.textFrames.areaText(rect.duplicate());
//     try {
//         text.textRange.characterAttributes.textFont =
//             app.textFonts.getByName("Poppins-Regular");
//     } catch (error) {}
//     text.textRange.characterAttributes.fillColor = createColor([255, 255, 255]);
//     text.textRange.characterAttributes.size = 10; // 设置文本大小

//     text.contents = content;
//     text.top = top - height / 2 + text.textRange.characterAttributes.size / 2;
//     return text;
// }

// // 创建一个矩形区域，并在其中添加段落文本（areaText）
// function addAreaText(doc, left, top, width, height, content) {
//     // 创建矩形
//     var rect = doc.pathItems.rectangle(top, left, width, height);
//     rect.fillColor = createColor([0, 0, 0]);
//     rect.filled = true;

//     var lineRef = doc.pathItems.add();
//     var bounds = rect.geometricBounds; // [左, 上, 右, 下]
//     var x = bounds[0];
//     var y = bounds[1];

//     $.writeln("矩形边界: " + bounds);
//     lineRef.setEntirePath([
//         [x, y - height / 2],
//         [x + width, y - height / 2],
//     ]);

//     var text = doc.textFrames.pathText(lineRef);
//     try {
//         text.textRange.characterAttributes.textFont =
//             app.textFonts.getByName("Poppins-Regular");
//     } catch (error) {}
//     text.textRange.characterAttributes.fillColor = createColor([255, 255, 255]);
//     text.textRange.characterAttributes.size = 10; // 设置文本大小

//     text.contents = content;
//     return text;
// }

function addAreaText(doc, left, top, width, height, content) {
    // 创建矩形
    var rect = doc.pathItems.rectangle(top, left, width, height);
    rect.fillColor = createColor([0, 0, 0]);
    rect.filled = true;

    // 创建文本
    var text = doc.textFrames.add();
    try {
        text.textRange.characterAttributes.textFont =
            app.textFonts.getByName("Poppins-Regular");
    } catch (error) {}
    text.textRange.characterAttributes.fillColor = createColor([255, 255, 255]);
    text.textRange.characterAttributes.size = 10; // 设置文本大小

    text.contents = content;
    text.left = left + 5; // 设置文本左边距
    text.top = top - height / 2 + text.textRange.characterAttributes.size / 2; // 设置文本垂直居中
    return text;
}

addAreaText(app.activeDocument, 100, -100, 66, 24, "Crafts");
