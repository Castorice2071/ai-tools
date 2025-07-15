function analyzeColorsAndExportPSD() {
    var colors = getAllColors();

    // 创建文件夹
    CFG.folderName++;
    var fileFolder = Folder.desktop + "/" + CFG.folderName + "/";
    if (!Folder(fileFolder).exists) {
        Folder(fileFolder).create();
    }

    // 遍历所有颜色
    for (var i = 0; i < colors.length; i++) {
        var colorStr = colors[i];

        // 获取当前文档
        var doc = app.activeDocument;

        function processItem(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    processItem(item.pageItems[i]);
                }
            } else if (item.typename === "CompoundPathItem") {
                // 处理复合路径中的每个路径项
                for (var i = 0; i < item.pathItems.length; i++) {
                    var pathItem = item.pathItems[i];
                    if (pathItem.filled && pathItem.fillColor) {
                        var itemColorStr = getColorString(pathItem.fillColor);
                        pathItem.hidden = itemColorStr !== colorStr;
                    }
                }
            } else if (item.filled && item.fillColor) {
                var itemColorStr = getColorString(item.fillColor);
                item.hidden = itemColorStr !== colorStr;
            }
        }

        function getColorString(color) {
            if (color.typename === "RGBColor") {
                return "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
            } else if (color.typename === "CMYKColor") {
                return "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
            } else if (color.typename === "GrayColor") {
                return "Gray(" + color.gray + ")";
            } else if (color.typename === "SpotColor") {
                return "SpotColor(" + color.spot.name + ")";
            }
            return "";
        }

        // 遍历所有图层
        for (var j = 0; j < doc.layers.length; j++) {
            var layer = doc.layers[j];
            if (!layer.locked && layer.visible) {
                for (var k = 0; k < layer.pageItems.length; k++) {
                    processItem(layer.pageItems[k]);
                }
            }
        }

        // 处理文件名
        var fileName = colorStr.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
        fileName = fileName.replace(/^RGB\((.+)\)/, "$1");
        fileName = fileName.replace(/^CMYK\((.+)\)/, "$1");
        fileName = fileName.replace(/^Gray\((.+)\)/, "$1");
        fileName = fileName.replace(/[,]/g, "_");

        exportToPSD(fileFolder + fileName + ".psd");

        // 恢复所有项的显示状态
        app.undo();
        app.redraw();
    }
}