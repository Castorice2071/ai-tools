var items = app.activeDocument.pathItems

// 金属颜色
var METALCOLOR = new RGBColor();
METALCOLOR.red = 211;
METALCOLOR.green = 211;
METALCOLOR.blue = 211;

function isColorMatch(color1, color2) {
    if (color1.typename !== color2.typename) return false;
    if (color1.typename === "CMYKColor") {
        return color1.cyan === color2.cyan && color1.magenta === color2.magenta && color1.yellow === color2.yellow && color1.black === color2.black;
    } else if (color1.typename === "RGBColor") {
        return color1.red === color2.red && color1.green === color2.green && color1.blue === color2.blue;
    } else if (color1.typename === "GrayColor") {
        return color1.gray === color2.gray;
    }
    return false; // 不支持的颜色类型
}

$.writeln('items.length: ' + items.length);

for (var i = 0; i < items.length; i++) {
    // items[i].fillColor = color;
    var item = items[i]
    // 检查是否为有效的路径对象
    if (item.typename !== 'PathItem') continue;
    if (item.filled && isColorMatch(item.fillColor, METALCOLOR)) {
        $.writeln('发现匹配的颜色项：' + item.typename);

        // 先设置描边颜色和宽度
        item.strokeColor = METALCOLOR;
        item.strokeWidth = new UnitValue(0.5, 'pt'); // 明确指定单位

         // 然后启用描边
        item.stroked = true;

         // 最后设置描边样式
        item.strokeCap = StrokeCap.BUTTENDCAP;
        
        $.writeln('已设置描边: ' + item.stroked + ', 宽度: ' + item.strokeWidth);
    }
}

