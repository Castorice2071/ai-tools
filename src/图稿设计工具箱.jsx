//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

(function () {
    var bit = 32;
    var aiVersion = app.version.split(".")[0];
    var vs = "illustrator-" + aiVersion + ".0" + bit;

    var SCRIPT = {
        name: "图稿设计工具箱",
        version: "v1.0.0",
    };

    var METALCOLOR = new RGBColor();
    METALCOLOR.red = 0;
    METALCOLOR.green = 0;
    METALCOLOR.blue = 0;

    function buildMsg(code) {
        try {
            var bt = new BridgeTalk();
            bt.target = vs;
            bt.body = code;
            bt.send();
        } catch (error) {}
    }

    function buildMsgFn(code) {
        try {
            var bt = new BridgeTalk();
            var body = "var fn = " + code + ";fn();";
            bt.target = vs;
            bt.body = body;
            bt.send();
        } catch (error) {}
    }

    function output(data) {
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                $.writeln("Array Item " + (i + 1) + ": " + data[i]);
            }
        } else if (typeof data === "object" && data !== null) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    $.writeln("Key: " + key + ", Value: " + data[key]);
                }
            }
        } else {
            $.writeln("Value: " + data);
        }
    }

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

    /**
     * 获取选中的颜色
     */
    function getSelectedColors(the_obj) {
        var colors = [];

        function collectColors(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    collectColors(item.pageItems[i]);
                }
            } else {
                if (item.filled && item.fillColor) {
                    var color = item.fillColor;
                    if (color.typename === "RGBColor") {
                        colors.push("RGB(" + color.red + ", " + color.green + ", " + color.blue + ")");
                    } else if (color.typename === "CMYKColor") {
                        colors.push("CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")");
                    } else if (color.typename === "GrayColor") {
                        colors.push("Gray(" + color.gray + ")");
                    } else if (color.typename === "SpotColor") {
                        colors.push("SpotColor(" + color.spot.name + ")");
                    }
                }
            }
        }

        collectColors(the_obj);

        // 去重
        var uniqueColors = {};
        var result = [];
        for (var j = 0; j < colors.length; j++) {
            var c = colors[j];
            if (!uniqueColors[c]) {
                uniqueColors[c] = true;
                result.push(c);
            }
        }
        return result;
    }

    function getAllColors() {
        var doc = app.activeDocument;
        var colors = [];

        function collectColors(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    collectColors(item.pageItems[i]);
                }
            } else {
                // 处理填充颜色
                if (item.filled && item.fillColor) {
                    var color = item.fillColor;
                    if (color.typename === "RGBColor") {
                        colors.push("RGB(" + color.red + ", " + color.green + ", " + color.blue + ")");
                    } else if (color.typename === "CMYKColor") {
                        colors.push("CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")");
                    } else if (color.typename === "GrayColor") {
                        colors.push("Gray(" + color.gray + ")");
                    } else if (color.typename === "SpotColor") {
                        colors.push("SpotColor(" + color.spot.name + ")");
                    }
                }
            }
        }

        // 遍历所有页面项目
        if (doc && doc.pageItems.length > 0) {
            for (var i = 0; i < doc.pageItems.length; i++) {
                collectColors(doc.pageItems[i]);
            }
        }

        // 用对象实现去重
        var uniqueColors = {};
        var result = [];
        for (var j = 0; j < colors.length; j++) {
            var c = colors[j];
            if (!uniqueColors[c]) {
                uniqueColors[c] = true;
                result.push(c);
            }
        }
        return result;
    }

    /**
     * 隐藏金属色
     */
    function hideMetalColor() {
        // 获取当前文档
        var doc = app.activeDocument;

        // 遍历路径项并隐藏指定颜色
        for (var i = 0; i < doc.pathItems.length; i++) {
            var pathItem = doc.pathItems[i];
            if (pathItem.filled && isColorMatch(pathItem.fillColor, METALCOLOR)) {
                pathItem.hidden = true; // 隐藏对象
            }
        }
    }

    /**
     * 隐藏非金属色
     */
    function hideNotMetalColor() {
        // 获取当前文档
        var doc = app.activeDocument;
        // 遍历路径项并隐藏非金属色
        for (var i = 0; i < doc.pathItems.length; i++) {
            var pathItem = doc.pathItems[i];
            if (pathItem.filled && !isColorMatch(pathItem.fillColor, METALCOLOR)) {
                pathItem.hidden = true; // 隐藏对象
            }
        }
    }

    /**
     * 导出 PSD
     */
    function exportToPSD(name) {
        try {
            // 获取当前文档
            var doc = app.activeDocument;

            // 设置导出选项
            var psdOptions = new ExportOptionsPhotoshop();
            psdOptions.layers = true; // 保留图层
            psdOptions.embedLinkedFiles = true; // 嵌入链接文件

            // 导出为 PSD 文件
            // var file = new File(doc.path + "/" + doc.name.replace(/\.[^\.]+$/, "") + ".psd");
            var file = new File(Folder.desktop + "/" + name);
            doc.exportFile(file, ExportType.PHOTOSHOP, psdOptions);
        } catch (error) {
            alert("导出 PSD 文件时出错: " + error.message);
        }
    }

    function fn1() {
        alert("内部 fn1");
    }

    function exportBtnFn() {
        hideNotMetalColor();
        exportToPSD("图.psd");
        app.undo();
        app.redraw();

        hideMetalColor();
        exportToPSD("色.psd");
        app.undo();
        app.redraw();
    }

    // 创建窗口
    var win = new Window("dialog", SCRIPT.name + " " + SCRIPT.version);

    // 创建 Tab 面板
    // var tabPanel = win.add("tabbedpanel");
    // 创建 面板A
    // var exportTab = tabPanel.add("tab", undefined, "面板A");
    // var buttonGroup = exportTab.add("group");
    // var exportBtn = buttonGroup.add("button", undefined, "导出");
    var btn1 = win.add("button", undefined, "识别颜色并导出");

    // tabPanel.add("tab", undefined, "面板B");
    // tabPanel.add("tab", undefined, "面板C");

    // exportBtn.onClick = function () {
    //     buildMsg("exportBtnFn();");
    // };

    btn1.onClick = function () {
        var colors = getAllColors();

        // 遍历所有颜色
        for (var i = 0; i < colors.length; i++) {
            var colorStr = colors[i];

            // 获取当前文档
            var doc = app.activeDocument;

            // 遍历所有路径项并隐藏不匹配当前颜色的项
            for (var j = 0; j < doc.pathItems.length; j++) {
                var pathItem = doc.pathItems[j];
                if (pathItem.filled && pathItem.fillColor) {
                    var itemColorStr = "";
                    var color = pathItem.fillColor;

                    if (color.typename === "RGBColor") {
                        itemColorStr = "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
                    } else if (color.typename === "CMYKColor") {
                        itemColorStr = "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
                    } else if (color.typename === "GrayColor") {
                        itemColorStr = "Gray(" + color.gray + ")";
                    } else if (color.typename === "SpotColor") {
                        itemColorStr = "SpotColor(" + color.spot.name + ")";
                    }

                    pathItem.hidden = itemColorStr !== colorStr;
                }
            }

            // 导出当前颜色的PSD
            var colorName = colorStr.replace(/[\(\),\s]/g, "_");
            // 处理文件名
            var fileName = colorStr.replace(/^SpotColor\(PANTONE (.+)\)/, "$1");
            fileName = fileName.replace(/^RGB\((.+)\)/, "$1");
            fileName = fileName.replace(/^CMYK\((.+)\)/, "$1");
            fileName = fileName.replace(/^Gray\((.+)\)/, "$1");
            exportToPSD(fileName + ".psd");

            // 恢复所有项的显示状态
            app.undo();
            app.redraw();
        }
    };

    // // 添加窗口关闭事件处理
    // win.onClose = function () {
    //     // 清理资源
    //     win = null;
    //     return true;
    // };

    win.show();
})();
