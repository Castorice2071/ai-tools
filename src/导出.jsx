//@target illustrator
//@targetengine main
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

(function () {
    var SCRIPT = {
        name: "隐藏指定颜色",
        version: "v0.1",
    };

    var METALCOLOR = new RGBColor();
    METALCOLOR.red = 0;
    METALCOLOR.green = 0;
    METALCOLOR.blue = 0;

    var win = new Window("dialog", SCRIPT.name + " " + SCRIPT.version);
    win.orientation = "column";

    var buttonGroup = win.add("group");
    win.btn1 = buttonGroup.add("button", undefined, "隐藏金属色并导出 PSD");
    win.btn2 = buttonGroup.add("button", undefined, "隐藏非金属色并导出 PSD");
    win.btn3 = buttonGroup.add("button", undefined, "测试");

    win.btn1.onClick = function () {
        // var selectedColor = getColorBySelected(); // 获取选中对象的颜色
        // if (!selectedColor) return;

        // 调用隐藏颜色的函数
        hideColor(targetColor);

        // 导出为 psd 文件
        exportToPSD();

        // 撤销隐藏操作
        app.undo();

        // 刷新页面
        app.redraw();
    };

    win.btn2.onClick = function () {
        // var selectedColor = getColorBySelected(); // 获取选中对象的颜色
        // if (!selectedColor) return;

        // 设置要隐藏的颜色 【非金属色】
        var targetColor = new RGBColor();
        targetColor.red = 255;
        targetColor.green = 255;
        targetColor.blue = 255;

        // 调用隐藏颜色的函数
        hideColor(targetColor);

        // 导出为 psd 文件
        exportToPSD();
    };

    win.btn3.onClick = function () {
        hideNotMetalColor();
        exportToPSD("图.psd");
        app.undo();
        app.redraw();

        hideMetalColor();
        exportToPSD("色.psd");
        app.undo();
        app.redraw();
    };

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

    function getColorBySelected() {
        // 获取当前文档
        var doc = app.activeDocument;

        // 获取选中的对象
        var selectedItems = doc.selection;
        if (selectedItems.length === 0) {
            alert("请先选择一个对象");
            return null;
        }

        // 获取第一个选中对象的填充颜色
        var firstItem = selectedItems[0];
        if (firstItem.filled) {
            return firstItem.fillColor;
        } else {
            alert("选中的对象没有填充颜色");
            return null;
        }
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

    win.show();
})();

// // alert(app.activeDocument.documentColorSpace);
// // 设置要隐藏的颜色（这里以黑色为例）
// var targetColor = new CMYKColor();
// targetColor.cyan = 11.33;
// targetColor.magenta = 23.44;
// targetColor.yellow = 57.81;
// targetColor.black = 0;

// app.activeDocument.pageItems.getByName("hello").hidden = true;

// 获取当前文档
// var doc = app.activeDocument;
// $.bp();

// // 遍历文档中的所有对象
// for (var i = doc.pathItems.length - 1; i >= 0; i--) {
//     var pathItem = doc.pathItems[i];
//     if (pathItem.filled && pathItem.fillColor == targetColor) {
//         pathItem.hidden = true; // 隐藏对象
//     }
// }
