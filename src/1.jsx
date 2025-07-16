/**
 * 按颜色分层复制选中的元素
 * @param {number} verticalGap - 垂直间距（单位：像素）
 */
function copyAndArrangeByColor(verticalGap) {
    try {
        if (!app.activeDocument.selection.length) {
            alert("请先选择要处理的对象！");
            return;
        }

        // 默认垂直间距
        verticalGap = verticalGap || 50;

        // 获取选中的对象
        var selection = app.activeDocument.selection;

        // 用于存储不同颜色的对象组
        var colorGroups = {};

        // 获取选区的边界
        var selectionBounds = selection[0].geometricBounds;
        for (var i = 1; i < selection.length; i++) {
            var bounds = selection[i].geometricBounds;
            selectionBounds[0] = Math.min(selectionBounds[0], bounds[0]); // 左
            selectionBounds[1] = Math.max(selectionBounds[1], bounds[1]); // 上
            selectionBounds[2] = Math.max(selectionBounds[2], bounds[2]); // 右
            selectionBounds[3] = Math.min(selectionBounds[3], bounds[3]); // 下
        }

        // 遍历选中的对象
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];

            // 获取对象的颜色信息
            var colorKey = getColorKey(item);
            if (!colorKey) continue;

            // 将对象按颜色分组
            if (!colorGroups[colorKey]) {
                colorGroups[colorKey] = [];
            }
            colorGroups[colorKey].push(item);
        }

        // 计算选区高度
        var selectionHeight = selectionBounds[1] - selectionBounds[3];

        // 复制并排列每个颜色组
        var currentY = selectionBounds[3] - verticalGap; // 从选区底部开始
        var index = 0;
        for (var colorKey in colorGroups) {
            var group = colorGroups[colorKey];

            // 创建新组
            var newGroup = app.activeDocument.groupItems.add();
            newGroup.name = "Color_Group_" + (index + 1);

            // 复制并移动每个对象
            for (var j = 0; j < group.length; j++) {
                var duplicate = group[j].duplicate(newGroup);
                var offset = currentY - selectionBounds[3];
                duplicate.translate(0, offset);
            }

            currentY -= selectionHeight + verticalGap;
            index++;
        }

        alert("处理完成，共分离了 " + index + " 种颜色。");
    } catch (error) {
        alert("错误：" + error.message);
    }
}

/**
 * 获取对象的颜色键值
 * @param {Object} item - 图形对象
 * @returns {string} 颜色键值
 */
function getColorKey(item) {
    function processColor(color) {
        if (!color) return null;

        switch (color.typename) {
            case "RGBColor":
                return "RGB(" + color.red + "," + color.green + "," + color.blue + ")";
            case "CMYKColor":
                return "CMYK(" + color.cyan + "," + color.magenta + "," + color.yellow + "," + color.black + ")";
            case "SpotColor":
                return "SpotColor(" + color.spot.name + ")";
            case "GrayColor":
                return "Gray(" + color.gray + ")";
            default:
                return null;
        }
    }

    // 处理不同类型的对象
    if (item.typename === "PathItem") {
        return item.filled ? processColor(item.fillColor) : null;
    } else if (item.typename === "CompoundPathItem" && item.pathItems.length > 0) {
        return item.pathItems[0].filled ? processColor(item.pathItems[0].fillColor) : null;
    } else if (item.typename === "GroupItem") {
        // 对于组，返回第一个有填充色的子对象的颜色
        for (var i = 0; i < item.pageItems.length; i++) {
            var colorKey = getColorKey(item.pageItems[i]);
            if (colorKey) return colorKey;
        }
    }

    return null;
}

copyAndArrangeByColor(50); // 调用函数，设置默认垂直间距为50像素
