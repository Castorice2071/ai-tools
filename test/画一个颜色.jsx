/**
 *
 */

drawColorBlockWithLabel("RGB(88.0000023543835, 97.0000018179417, 104.000001400709)", 100, -100, 50);

function drawColorBlockWithLabel(color, left, top, size) {
    var doc = app.activeDocument;

    // 解析 color 字符串，生成对应的颜色对象
    var fillColor = null;
    var contents = color;
    if (/^RGB\(/.test(color)) {
        // contents = "****";

        // 解析 RGB
        var rgb = color.match(/RGB\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/);
        $.writeln("RGB match: " + rgb);
        if (rgb) {
            var rgbColor = new RGBColor();
            rgbColor.red = parseFloat(rgb[1]);
            rgbColor.green = parseFloat(rgb[2]);
            rgbColor.blue = parseFloat(rgb[3]);
            fillColor = rgbColor;
        }
    } else if (/^CMYK\(/.test(color)) {
        contents = "****";

        // 解析 CMYK
        var cmyk = color.match(
            /CMYK\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/,
        );
        if (cmyk) {
            var cmykColor = new CMYKColor();
            cmykColor.cyan = parseFloat(cmyk[1]);
            cmykColor.magenta = parseFloat(cmyk[2]);
            cmykColor.yellow = parseFloat(cmyk[3]);
            cmykColor.black = parseFloat(cmyk[4]);
            fillColor = cmykColor;
        }
    } else if (/^Gray\(/.test(color)) {
        contents = "****";

        // 解析 Gray
        var gray = color.match(/Gray\(([\d.]+)\)/);
        if (gray) {
            var grayColor = new GrayColor();
            grayColor.gray = parseFloat(gray[1]);
            fillColor = grayColor;
        }
    } else if (/^SpotColor\(/.test(color)) {
        contents = color.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");

        if (contents === "SpotColor([套版色])") {
            contents = "Black C";
        }

        // 解析 SpotColor
        var spot = color.match(/SpotColor\((.+)\)/);
        if (spot) {
            try {
                var spotColor = new SpotColor();
                spotColor.spot = doc.spots.getByName(spot[1]);
                fillColor = spotColor;
            } catch (e) {
                // SpotColor 不存在时，默认灰色
                var fallback = new GrayColor();
                fallback.gray = 50;
                fillColor = fallback;
            }
        }
    }

    // 绘制方块
    var rect = doc.pathItems.rectangle(top, left, size, size);
    rect.filled = true;
    rect.fillColor = fillColor || new GrayColor(); // 若解析失败则用灰色
    rect.stroked = true;
    rect.strokeColor = createRGBColor([0, 0, 0]);
    rect.strokeWidth = 0.5;

    // 绘制文字
    var label = doc.textFrames.add();
    try {
        label.textRange.characterAttributes.textFont =
            app.textFonts.getByName("ArialMT");
    } catch (error) {}
    label.textRange.characterAttributes.size = 8;

    label.contents = contents;
    label.left = left + size + 3; // 方块右侧留 3pt间距
    label.top = top; // 垂直居中微调

    var group = doc.groupItems.add();
    group.name = contents;
    rect.move(group, ElementPlacement.INSIDE);
    label.move(group, ElementPlacement.INSIDE);
    group.selected = true;
}

function createRGBColor(rgb) {
    var color = new RGBColor();
    color.red = rgb[0];
    color.green = rgb[1];
    color.blue = rgb[2];
    return color;
}
