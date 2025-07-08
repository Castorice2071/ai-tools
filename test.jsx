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
        // 先扩展外观
        app.executeMenuCommand("expandStyle");
        app.doScript("执行扩展", "扩展扩展", false);
        app.doScript("路径操作", "扩展扩展", false); 
        app.doScript("缩放", "扩展扩展", false);
        alert(1)
    } catch (error) {
        alert("Error: " + error.message);
    }
})();
