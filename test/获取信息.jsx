//@target illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);

function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

/**
 * 通用输出方法，根据数据类型选择不同的输出逻辑
 * @param {*} data
 */
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

/**
 * 获取所有文字框的内容
 */
function getAllTextFramesContent() {
    var doc = app.activeDocument;
    var textFrames = doc.textFrames;
    var content = [];

    for (var i = 0; i < textFrames.length; i++) {
        content.push(textFrames[i].contents);
    }

    return content;
}

/**
 * 获取选择的文字框内容
 */
function getSelectedTextFramesContent() {
    var doc = app.activeDocument;
    var selection = doc.selection;
    var content = [];
    if (selection.length === 0) {
        alert("请先选择一个或多个文字框。");
        return content;
    }
    for (var i = 0; i < selection.length; i++) {
        if (selection[i].typename === "TextFrame") {
            content.push(selection[i].contents);
        }
    }
    if (content.length === 0) {
        alert("所选对象中没有文字框。");
    }
    return content;
}

/**
 * 解析尺寸
 * @param {Array} allTexts
 * @returns {Array} sizes
 */
function parseSizes(allTexts) {
    var sizes = [];
    var flag = "actual size";

    for (var i = 0; i < allTexts.length; i++) {
        var text = trim(allTexts[i]);
        if (text.toLowerCase().indexOf(flag.toLowerCase()) === -1) {
            continue; // 跳过不包含 "actual size" 的文本（大小写不敏感）
        }
        sizes.push(text);
    }

    return sizes;
}

/**
 * 解析Crafts
 */
function parseCrafts(allTexts) {
    var crafts = [];
    var lines = allText.split("\n");

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line) {
            crafts.push(line);
        }
    }

    return crafts;
}

function main() {
    var allTexts = getAllTextFramesContent();

    var sizes = parseSizes(allTexts);

    output(allTexts);
    output(sizes);

    // // 输出所有文字框的内容
    // for (var i = 0; i < allTexts.length; i++) {
    //     $.writeln("Text Frame " + (i + 1) + ": " + allTexts[i]);
    // }
}

try {
    main();
} catch (error) {
    $.writeln("Error: " + (error && error.message ? error.message : error));
    alert(error && error.message ? error.message : error);
}
