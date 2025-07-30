// Adobe Illustrator 图片颜色提取脚本
// 功能：通过Illustrator支持的API分析图片颜色
// 适配：Illustrator CS6及以上版本

try {
    if (app.documents.length === 0) {
        alert("请先打开一个包含图片的Illustrator文档");
        exit();
    }

    var doc = app.activeDocument;
    var rasterItems = [];

    // 收集文档中的所有光栅图像
    for (var i = 0; i < doc.pageItems.length; i++) {
        var item = doc.pageItems[i];
        if (item.typename === "RasterItem") {
            rasterItems.push(item);
        }
    }

    if (rasterItems.length === 0) {
        alert("未在文档中找到任何图片（光栅图像）");
        exit();
    }

    // 选择要分析的图片
    var selectedImage = selectImageToAnalyze(rasterItems);
    if (!selectedImage) exit();

    // 提取颜色信息
    var colorData = extractColorsFromRaster(selectedImage);

    // 显示并保存结果
    if (colorData.colors.length > 0) {
        displayColorResults(colorData);
        saveColorResults(colorData);
    } else {
        alert("未能从图片中提取颜色信息");
    }
} catch (e) {
    alert("脚本错误: " + e.message + "\n行号: " + e.line);
}

// 让用户选择要分析的图片
function selectImageToAnalyze(images) {
    if (images.length === 1) {
        return images[0];
    }

    var list = "请选择要分析的图片（输入编号）：\n";
    for (var i = 0; i < images.length; i++) {
        list += i + 1 + ". " + (images[i].name || "未命名图片") + "\n";
    }

    var input = prompt(list, "1");
    var index = parseInt(input) - 1;

    if (index >= 0 && index < images.length) {
        return images[index];
    }

    alert("无效的选择");
    return null;
}

// 从光栅图像中提取颜色信息（使用Illustrator支持的方法）
function extractColorsFromRaster(raster) {
    var result = {
        name: raster.name || "未命名图片",
        width: raster.width,
        height: raster.height,
        colors: [],
    };

    try {
        // 创建临时文档（使用正确的参数顺序）
        var tempDoc = app.documents.add(DocumentColorSpace.RGB, raster.width, raster.height);

        // 复制图像到临时文档
        var tempRaster = raster.duplicate(tempDoc, ElementPlacement.PLACE_AT_BEGINNING);
        tempRaster.position = [0, tempDoc.height];

        // 关键：使用Illustrator的图像描摹功能来获取颜色
        var traceOptions = new TraceOptions();
        traceOptions.mode = TraceMode.COLOR;
        traceOptions.palette = TracePalette.LIMITED;
        traceOptions.maxColors = 32;
        traceOptions.fuzziness = 15;

        // 执行描摹
        tempRaster.trace(traceOptions);

        // 扩展描摹结果以获取颜色
        var tracedItem = tempDoc.pageItems[0];
        tracedItem.expand();

        // 收集所有路径的填充色
        var colorSet = new Object(); // 用于去重

        for (var i = 0; i < tempDoc.pageItems.length; i++) {
            var item = tempDoc.pageItems[i];
            if (item.filled && item.fillColor.typename === "RGBColor") {
                var rgb = item.fillColor;
                var hex = rgbToHex(rgb.red, rgb.green, rgb.blue);

                // 去重
                if (!colorSet[hex]) {
                    colorSet[hex] = true;
                    result.colors.push({
                        hex: hex,
                        rgb: {
                            red: Math.round(rgb.red),
                            green: Math.round(rgb.green),
                            blue: Math.round(rgb.blue),
                        },
                    });
                }
            }
        }

        // 关闭临时文档
        tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    } catch (e) {
        alert("提取颜色时出错: " + e.message);
    }

    return result;
}

// RGB转十六进制（Illustrator中RGB值范围是0-255）
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1).toUpperCase();
}

// 显示颜色分析结果
function displayColorResults(data) {
    var message = "图片颜色分析结果:\n";
    message += "名称: " + data.name + "\n";
    message += "尺寸: " + Math.round(data.width) + "x" + Math.round(data.height) + "\n";
    message += "提取到 " + data.colors.length + " 种颜色:\n\n";

    for (var i = 0; i < data.colors.length; i++) {
        var c = data.colors[i];
        message += i + 1 + ". " + c.hex + " (R:" + c.rgb.red + ", G:" + c.rgb.green + ", B:" + c.rgb.blue + ")\n";
    }

    alert(message);
}

// 保存颜色结果到文件
function saveColorResults(data) {
    var file = File.saveDialog("保存颜色信息", "文本文件:*.txt");
    if (!file) return;

    var content = "图片颜色分析报告\n";
    content += "==================\n";
    content += "图片名称: " + data.name + "\n";
    content += "图片尺寸: " + Math.round(data.width) + "x" + Math.round(data.height) + "\n";
    content += "颜色数量: " + data.colors.length + "\n\n";

    content += "颜色列表:\n";
    for (var i = 0; i < data.colors.length; i++) {
        var c = data.colors[i];
        content += i + 1 + ". " + c.hex + " R:" + c.rgb.red + " G:" + c.rgb.green + " B:" + c.rgb.blue + "\n";
    }

    file.encoding = "UTF-8";
    file.open("w");
    file.write(content);
    file.close();

    alert("颜色信息已保存到:\n" + file.fsName);
}
