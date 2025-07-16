$.writeln("Running main.jsx script...");

/**
 * 获取颜色
 * @param {*} obj
 * @returns
 */
function getColors(obj) {
    var colors = [];

    function collectColors(item) {
        if (item.typename === "GroupItem") {
            for (var i = 0; i < item.pageItems.length; i++) {
                collectColors(item.pageItems[i]);
            }
        } else if (item.typename === "CompoundPathItem") {
            for (var i = 0; i < item.pathItems.length; i++) {
                collectColors(item.pathItems[i]);
            }
        } else {
            if (item.filled && item.fillColor) {
                addColor(item.fillColor);
            }
        }
    }

    function addColor(color) {
        if (color.typename === "RGBColor") {
            colors.push("RGB(" + color.red + ", " + color.green + ", " + color.blue + ")");
        } else if (color.typename === "CMYKColor") {
            colors.push("CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")");
        } else if (color.typename === "GrayColor") {
            colors.push("Gray(" + color.gray + ")");
        } else if (color.typename === "SpotColor") {
            colors.push("SpotColor(" + color.spot.name + ")");
        } else if (color.typename === "PatternColor") {
            colors.push("PatternColor(" + color.pattern.name + ")");
        }
    }

    collectColors(obj);

    return uniqueArray(colors);
}

/**
 *
 * @returns
 */
function getSelectionColors() {
    var items = app.selection;
    if (items.length === 0) {
        alert("No items selected.");
        return [];
    }

    var allColors = [];
    for (var i = 0; i < items.length; i++) {
        var colors = getColors(items[i]);
        allColors = allColors.concat(colors);
    }

    return uniqueArray(allColors);
}

/**
 * 数组去重
 * @param {Array} arr
 */
function uniqueArray(arr) {
    var unique = {};
    var result = [];
    for (var j = 0; j < arr.length; j++) {
        var c = arr[j];
        if (!unique[c]) {
            unique[c] = true;
            result.push(c);
        }
    }
    return result;
}

function main() {
    try {
        var win = new Window("dialog", "Hello World");
        var BTN1 = win.add("button", undefined, "Click Me");

        BTN1.onClick = function () {
            var colors = getSelectionColors();

            $.writeln("colors.length: " + colors.length);
            $.writeln("colors: " + colors.join(", "));
        };
        $.writeln("Dialog displayed successfully.");

        win.show();
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

main();
