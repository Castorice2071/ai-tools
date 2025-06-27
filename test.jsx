// (function () {
//     try {
//         // 参数说明：
//         // "动作名称", "动作集名称", 是否显示对话框（可选，true/false）, 是否使用快捷键（可选，1/2/3/4）
//         app.doScript("1", "动作集2", false);
//     } catch (error) {
//         alert("Error: " + error.message);
//     }
// })();

(function () {
    try {
        // if (app.documents.length === 0) {
        //     alert("请先打开一个文档。");
        //     return;
        // }
        // var doc = app.activeDocument;
        // if (doc.selection.length === 0) {
        //     alert("请先选择对象。");
        //     return;
        // }
        // 先扩展外观
        // app.executeMenuCommand("expandStyle");
        // 再扩展两次
        // app.executeMenuCommand("expand");

        app.doScript("动作1", "动作集1", false);
    } catch (error) {
        alert("Error: " + error.message);
    }
})();
