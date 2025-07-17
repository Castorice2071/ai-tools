//@include "./common.jsx"

/**
 * 编写一个函数，复制选区的轮廓
 */
function copySelectionOutline() {
    var items = app.activeDocument.selection;
    if (items.length === 0) {
        return alert("No items selected.");
    }

    if (items.length > 1) {
        return alert("Please select only one item.");
    }

    // 0. 定义一个轮廓的颜色
    var outlineColor = new RGBColor();
    outlineColor.red = 0; // 红色分量
    outlineColor.green = 0; // 绿色分量
    outlineColor.blue = 0; // 蓝色分量

    // 1. 复制选区
    app.copy();

    // 2. 粘贴到下面
    app.paste();

    // 3. 获取新创建的选区
    var newItems = app.activeDocument.selection;

    // 4. 填色
    UTILS.setColor(newItems[0], outlineColor);

    // 6. 路径查找器 - 合并
    // app.executeMenuCommand("Live Pathfinder Merge");

    app.executeMenuCommand("Live Pathfinder Add");

    // $.writeln("New items count: " + newItems.length);

    // var newItem = newItems[0];

    // // 4. 设置新选区的填充颜色为透明
    // for (var i = 0; i < newItems.length; i++) {
    //     var item = newItems[i];
    //     $.writeln("Processing item.name: " + item.name);
    //     $.writeln("Processing item.typename: " + item.typename);

    //     // if (item.filled) {
    //     //     item.filled = false; // 设置填充为透明
    //     // }
    // }

    // 对新选区应用路径查找器中的合并操作
    // app.executeMenuCommand("Live Pathfinder Merge");
}

copySelectionOutline();


