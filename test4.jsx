var msg = "当前软件：" + app.name;
alert(msg);

if ($.appName == "Adobe Illustrator") {
    // 这里写AI的标注逻辑
    alert("这里是Illustrator专用代码");
} else if ($.appName == "Adobe Photoshop") {
    // 这里写PS的标注逻辑
    alert("这里是Photoshop专用代码");
}
