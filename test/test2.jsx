/**
 * 复制选区形状，合并为单一黑色形状，去除无用路径（自动处理 GroupItem）
 */
function copyAndMergeSelectionToBlack() {
    var items = app.activeDocument.selection;
    if (items.length === 0) {
        alert("No items selected.");
        return;
    }

    // 复制并粘贴
    app.copy();
    app.paste();

    // 获取新选区
    var newItems = app.activeDocument.selection;

    // 如果只有一个对象，且是 GroupItem，递归处理组内所有路径
    if (newItems.length === 1 && newItems[0].typename === "GroupItem") {
        var group = newItems[0];
        var black = new RGBColor();
        black.red = 0;
        black.green = 0;
        black.blue = 0;

        function fillGroupItems(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    fillGroupItems(item.pageItems[i]);
                }
            } else if (item.typename === "PathItem" || item.typename === "CompoundPathItem") {
                item.filled = true;
                item.fillColor = black;
                item.stroked = false;
            }
        }
        fillGroupItems(group);
        return;
    }

    // 如果只有一个对象且不是组，直接填充黑色
    if (newItems.length === 1) {
        var item = newItems[0];
        var black = new RGBColor();
        black.red = 0;
        black.green = 0;
        black.blue = 0;
        item.filled = true;
        item.fillColor = black;
        item.stroked = false;
        return;
    }

    // 多对象时，尝试解除编组和展开外观
    app.executeMenuCommand("ungroup");
    app.executeMenuCommand("expandStyle");

    // 再次获取选区
    newItems = app.activeDocument.selection;

    // 再次确认数量
    if (newItems.length < 2) {
        alert("合并操作需要至少两个对象。");
        return;
    }

    // 路径查找器合并
    app.executeMenuCommand("Live Pathfinder Merge");
    app.executeMenuCommand("expandStyle");
    app.executeMenuCommand("ungroup");

    // 获取合并后的选区
    var mergedItems = app.activeDocument.selection;
    if (!mergedItems || mergedItems.length === 0) {
        alert("合并后未检测到对象，请检查选区类型。");
        return;
    }

    // 只处理第一个对象（通常为主形状）
    var mainItem = mergedItems[0];
    var black = new RGBColor();
    black.red = 0;
    black.green = 0;
    black.blue = 0;

    if (mainItem.typename === "CompoundPathItem" || mainItem.typename === "PathItem") {
        mainItem.filled = true;
        mainItem.fillColor = black;
        mainItem.stroked = false;
    } else if (mainItem.typename === "GroupItem" || mainItem.typename === "Group") {
        for (var i = 0; i < mainItem.pageItems.length; i++) {
            var item = mainItem.pageItems[i];
            if (item.filled !== undefined) item.filled = true;
            if (item.fillColor !== undefined) item.fillColor = black;
            if (item.stroked !== undefined) item.stroked = false;
        }
    }
}

copyAndMergeSelectionToBlack();