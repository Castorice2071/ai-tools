//@include "./common.jsx"

/**
 * 颜色分层
 */
function colorLayer() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            return alert("No items selected.");
        }

        if (items.length > 1) {
            return alert("Please select only one item.");
        }

        var outlineColor = new RGBColor();
        outlineColor.red = 217; // 红色分量
        outlineColor.green = 0; // 绿色分量
        outlineColor.blue = 133; // 蓝色分量

        // 操作对象
        var sourceItem = items[0];

        // 创建轮廓对象
        var outlineGroup = copyGroupFillColor(sourceItem, outlineColor);

        return

        $.writeln(outlineGroup)

        // return;

        // 获取选区的颜色分组
        var colorGroups = UTILS.getSelectionColorGroups();

        if (Object.keys(colorGroups).length === 0) {
            return alert("No color groups found in the selection.");
        }

        // 获取选区的边界
        var selectionBounds = sourceItem.geometricBounds;
        var selectionBoundsWidth = selectionBounds[2] - selectionBounds[0];
        var selectionBoundsHeight = selectionBounds[1] - selectionBounds[3];

        // 创建颜色分组
        var index = 0;
        for (var colorKey in colorGroups) {
            var group = colorGroups[colorKey];

            // 创建新组
            var newGroup = app.activeDocument.groupItems.add();
            newGroup.name = "Color_Group_" + (index + 1);

            // 复制轮廓对象并加入新组
            var outlineItem = outlineGroup.duplicate(newGroup);

            // 将相同颜色的对象移动到新组中
            for (var i = 0; i < group.length; i++) {
                var item = group[i];
                item.duplicate(newGroup);
            }

            // 设置新组的位置
            newGroup.translate(index * (selectionBoundsWidth + 40), -selectionBoundsHeight - 40);
            newGroup.selected = false;

            index++;
        }

        // 删除 outlineGroup
        outlineGroup.remove();

        /**
         * 复制对象并填色
         */
        function copyGroupFillColor(group, color) {
            var duplicateGroup = group.duplicate();

            UTILS.setColor(duplicateGroup, color);

            app.activeDocument.selection = duplicateGroup;

            app.executeMenuCommand("group");
            app.executeMenuCommand("Live Pathfinder Merge");
            app.executeMenuCommand("expandStyle");
            app.executeMenuCommand("ungroup");
            app.executeMenuCommand("group");

            // 操作完成之后，重新赋值给 duplicateGroup
            duplicateGroup = app.activeDocument.selection[0];

            app.activeDocument.selection = group;

            return duplicateGroup;
        }
    } catch (error) {
        alert("颜色分层错误: " + error.message);
    }
}

colorLayer();
