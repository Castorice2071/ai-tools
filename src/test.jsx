var metalColors = ["Raised  Gold Metal"];

var METALCOLOR = new SpotColor();
METALCOLOR.spot = app.activeDocument.spots.getByName(metalColors[0]);

$.writeln("METALCOLOR: " + METALCOLOR.spot);

// 创建个矩形
var rect = app.activeDocument.pathItems.rectangle(0, 0, 100, 100);
rect.filled = true;
rect.fillColor = METALCOLOR;
rect.strokeColor = METALCOLOR;
rect.strokeWidth = new UnitValue("0.5", "mm").as("pt"); // 明确指定单位
rect.stroked = true;

// app.activeDocument.spots.getByName("Raised  Gold Metal")
