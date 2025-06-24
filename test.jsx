var win = new Window("dialog", "标注尺寸", undefined, {
    closeButton: false,
});

dimensionGroup = win.add("group");
dimensionPanel = dimensionGroup.add("panel", [0, 0, 300, 100], "选择标注边");
dimensionPanel.add("checkbox", [66, 35, 116, 50], "左边");
dimensionPanel.add("checkbox", undefined, "右边");
dimensionPanel.add("checkbox", undefined, "顶部");
dimensionPanel.add("checkbox", undefined, "底部");

win.show();
