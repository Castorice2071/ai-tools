//@target illustrator
//@targetengine main
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false); // Fix drag and drop a .jsx file

var color = new CMYKColor();
// 标注颜色CMYK值
color.cyan = 0; // 青色分量（默认0%）
color.magenta = 100; // 品红分量（默认100%）
color.yellow = 100; // 黄色分量（默认100%）
color.black = 10; // 黑色分量（默认10%）

// var res =
//     "dialog { \
//         colorPanel: Panel { \
//             text: '标注颜色', \
//             orientation: 'row', \
//             spacing: 10, \
//             label: StaticText { text: 'CMYK:' }, \
//             cyan: EditText { characters: 4 }, \
//             magenta: EditText { characters: 4 }, \
//             yellow: EditText { characters: 4 }, \
//             black: EditText { characters: 4 }, \
//         }, \
//     } \
// ";

var win = new Window("dialog", "AI-TOOLS", undefined, { closeButton: true });
win.show();
