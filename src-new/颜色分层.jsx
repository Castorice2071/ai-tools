//@include "./common.jsx"

function getSelectionColorGroups() {
    var items = app.activeDocument.selection;
    if (items.length === 0) {
        alert("No items selected.");
        return null;
    }

    var colorGroups = {};

    for (var i = 0; i < items.length; i++) {
        handle(items[i]);
    }

    function handle(item) {
        if (item.typename === "GroupItem") {
            for (var j = 0; j < item.pageItems.length; j++) {
                handle(item.pageItems[j]);
            }
        } else if (
            item.typename === "CompoundPathItem" &&
            item.pathItems[0].filled &&
            item.pathItems[0].fillColor
        ) {
            // 对于复合路径，处理第一个路径项
            var firstPathItem = item.pathItems[0];
            var colorKey = UTILS.getColorText(firstPathItem.fillColor);
            if (colorKey) {
                if (!colorGroups[colorKey]) {
                    colorGroups[colorKey] = [];
                }
                colorGroups[colorKey].push(item);
            }
        } else if (item.typename === "PathItem") {
            if (item.filled && item.fillColor) {
                var colorKey = UTILS.getColorText(item.fillColor);
                if (colorKey) {
                    if (!colorGroups[colorKey]) {
                        colorGroups[colorKey] = [];
                    }
                    colorGroups[colorKey].push(item);
                }
            }
        }
    }

    return colorGroups;
}

/**
 * 颜色分层
 */
function colorLayer() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            return alert("No items selected.");
        }

        // 1. 获取选区的颜色分组
        var colorGroups = getSelectionColorGroups();
        UTILS.printProperties(colorGroups);

        if (Object.keys(colorGroups).length === 0) {
            return alert("No color groups found in the selection.");
        }

        // 获取选区的边界
        // 获取选区的边界
        var selectionBounds = items[0].geometricBounds;
        for (var i = 1; i < items.length; i++) {
            var bounds = items[i].geometricBounds;
            selectionBounds[0] = Math.min(selectionBounds[0], bounds[0]); // 左
            selectionBounds[1] = Math.max(selectionBounds[1], bounds[1]); // 上
            selectionBounds[2] = Math.max(selectionBounds[2], bounds[2]); // 右
            selectionBounds[3] = Math.min(selectionBounds[3], bounds[3]); // 下
        }
        var selectionBoundsWidth = selectionBounds[2] - selectionBounds[0];
        var selectionBoundsHeight = selectionBounds[1] - selectionBounds[3];

        $.writeln("Selection Width: " + selectionBoundsWidth);
        $.writeln("Selection Height: " + selectionBoundsHeight);

        // 2. 创建颜色分组
        var index = 0;
        for (var colorKey in colorGroups) {
            var group = colorGroups[colorKey];

            // 创建新组
            var newGroup = app.activeDocument.groupItems.add();
            newGroup.name = "Color_Group_" + (index + 1);

            // 将相同颜色的对象移动到新组中
            for (var i = 0; i < group.length; i++) {
                var item = group[i];
                item.duplicate(newGroup);
            }

            // 设置新组的位置
            newGroup.translate(
                index * (selectionBoundsWidth + 40),
                -selectionBoundsHeight - 40,
            );

            index++;
        }
    } catch (error) {
        alert("颜色分层错误: " + error.message);
    }
}

colorLayer();
