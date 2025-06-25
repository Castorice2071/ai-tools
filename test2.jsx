var win = new Window("dialog", {
    name: "Hello",
    alignChildren: "fill",
});

var optionsPanel = win.add("panel", undefined, "xxx", {
    orientation: "row",
    alignChildren: "right",
    margins: 16
});
optionsPanel.orientation = 'row'
optionsPanel.margins = 16

var unitGroup = optionsPanel.add("group", undefined, {
    orientation: "row",
    spacing: 5,
});



unitGroup.add("statictext", undefined, "单位:");
unitGroup.add("edittext", undefined);

optionsPanel.add("statictext", undefined, '我的天');

win.show();

// var res =
//     "dialog { alignChildren: 'fill', \
//     info: Panel { orientation: 'column', alignChildren:'right', \
//         text: 'Personal Info', \
//         name: Group { orientation: 'row', \
//             s: StaticText { text:'Name:' }, \
//             e: EditText { characters: 30 } \
//         } \
//     }, \
//     workInfo: Panel { orientation: 'column', \
//         text: 'Work Info', \
//         name: Group { orientation: 'row', \
//             s: StaticText { text:'Company name:' }, \
//             e: EditText { characters: 30 } \
//         } \
//     }, \
//     buttons: Group { orientation: 'row', alignment: 'right', \
//         okBtn: Button { text:'OK', properties:{name:'ok'} }, \
//         cancelBtn: Button { text:'Cancel', properties:{name:'cancel'} } \
//     } \
// }";
// win = new Window(res);
// win.center();

// // 为OK按钮添加点击事件处理函数
// win.buttons.okBtn.onClick = function () {
//     // 获取输入的值
//     var name = win.info.name.e.text;
//     var company = win.workInfo.name.e.text;

//     // 在这里处理表单数据
//     alert("Name: " + name + "\nCompany: " + company);

//     // 关闭窗口
//     win.close();
// };

// win.show();
