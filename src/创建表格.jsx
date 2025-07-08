function createColor(rgb) {
    var color = new RGBColor();
    color.red = rgb[0];
    color.green = rgb[1];
    color.blue = rgb[2];
    return color;
}

function addAreaTextByLabel(doc, left, top, width, height, content) {
    // 创建矩形
    var rect = doc.pathItems.rectangle(top, left, width, height);
    rect.fillColor = createColor([0, 0, 0]);
    rect.filled = true;

    // 创建文本
    var text = doc.textFrames.add();
    try {
        text.textRange.characterAttributes.textFont = app.textFonts.getByName("Poppins-Regular");
    } catch (error) {}
    text.textRange.characterAttributes.fillColor = createColor([255, 255, 255]);
    text.textRange.characterAttributes.size = 10; // 设置文本大小

    text.contents = content;
    text.left = left + 5; // 设置文本左边距
    text.top = top - height / 2 + text.textRange.characterAttributes.size / 2; // 设置文本垂直居中
    return text;
}

function addAreaTextByValue(doc, left, top, width, height, content) {
    // 创建矩形
    var rect = doc.pathItems.rectangle(top, left, width, height);
    rect.fillColor = createColor([220, 220, 220]); // 设置灰色背景
    rect.filled = true;

    // 创建文本
    var text = doc.textFrames.add();
    try {
        text.textRange.characterAttributes.textFont = app.textFonts.getByName("Poppins-Regular");
    } catch (error) {}
    text.textRange.characterAttributes.fillColor = createColor([51, 51, 51]); // 设置深灰色文本
    text.textRange.characterAttributes.size = 10; // 设置文本大小

    text.contents = content;
    text.left = left + 5; // 设置文本左边距
    text.top = top - height / 2 + text.textRange.characterAttributes.size / 2; // 设置文本垂直居中
    return text;
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

function main() {
    var doc = app.activeDocument;

    var left = 100;
    var top = -100;
    var labelWidth = 66;
    var valueWidth = 136;
    var height = 24;

    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        addAreaTextByLabel(doc, left, top - i * (height + 1), labelWidth, height, text.label);
        addAreaTextByValue(doc, left + labelWidth + 1, top - i * (height + 1), valueWidth, height, text.value);
    }
}

main();
