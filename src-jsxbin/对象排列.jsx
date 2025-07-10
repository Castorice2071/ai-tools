var scriptName = "Harmonizer 对象排列";
var settingFile = {
    name: scriptName + "__setting.json",
    folder: Folder.myDocuments + "/LA_AI_Scripts/"
};
var isUndo = false;
var win = new Window("dialog", scriptName + " © by Zane", undefined);
win.orientation = "column";
win.alignChildren = "fill";
var panel = win.add("panel", undefined, "参数设置");
panel.orientation = "column";
panel.alignChildren = "fill";
panel.margins = 20;
var groupColumns = panel.add("group");
groupColumns.orientation = "row";
groupColumns.alignChildren = "垂直居中";
var captionColumns = groupColumns.add("statictext", undefined, "列数:");
var valueColumns = groupColumns.add("edittext", [0, 0, 110, 25], 4);
var groupGutter = panel.add("group");
groupGutter.orientation = "row";
groupGutter.alignChildren = ["fill", "fill"];
var groupGutterX = groupGutter.add("group");
groupGutterX.orientation = "column";
groupGutterX.alignChildren = "左对齐";
var captionGutterX = groupGutterX.add("statictext", undefined, "水平间距");
var valueGutterX = groupGutterX.add("edittext", [0, 0, 80, 25], 0);
var positionX = groupGutterX.add("dropdownlist", [0, 0, 80, 25], ["左对齐", "垂直居中", "右对齐"]);
positionX.selection = 1;
var groupGutterY = groupGutter.add("group");
groupGutterY.orientation = "column";
groupGutterY.alignChildren = "左对齐";
var captionGutterY = groupGutterY.add("statictext", undefined, "垂直间距");
var valueGutterY = groupGutterY.add("edittext", [0, 0, 80, 25], 0);
var positionY = groupGutterY.add("dropdownlist", [0, 0, 80, 25], ["顶对齐", "水平居中", "底对齐"]);
positionY.selection = 1;
var groupCheckbox = panel.add("group");
groupCheckbox.orientation = "row";
var toGroupCheckbox = groupCheckbox.add("checkbox", undefined, "群组");
var randomOrderCheckbox = groupCheckbox.add("checkbox", [0, 0, 100, 20], "随机顺序");
randomOrderCheckbox.onClick = previewStart;
with(panel.add("group")) {
    orientation = "column";
    alignChildren = ["fill", "fill"];
    with(add("group")) {
        orientation = "row";
        alignChildren = ["fill", "fill"];
        var reverseOrder = add("checkbox", undefined, "反转方向");
    }
    with(add("group")) {
        orientation = "row";
        alignChildren = ["fill", "fill"];
        var sortByY = add("radiobutton", undefined, "Y");
        var sortByX = add("radiobutton", undefined, "X");
        var sortByS = add("radiobutton", undefined, "S");
        var sortByW = add("radiobutton", undefined, "W");
        var sortByH = add("radiobutton", undefined, "H");
        sortByY.helpTip = "从上到下排序";
        sortByX.helpTip = "从左到右排序";
        sortByS.helpTip = "按大小(宽度+高度)从最大到最小排序";
        sortByW.helpTip = "按宽度最大到最小排序";
        sortByH.helpTip = "按高度从最小到最大排序";
    }
}
sortByY.onClick = sortByX.onClick = sortByW.onClick = sortByH.onClick = sortByS.onClick = reverseOrder.onClick = previewStart;
var preview = win.add("checkbox", undefined, "预览");
var winButtons = win.add("group");
winButtons.orientation = "row";
winButtons.alignChildren = ["fill", "fill"];
winButtons.margins = 0;
var cancel = winButtons.add("button", undefined, "取消");
cancel.helpTip = "Press Esc to Close";
cancel.onClick = function() {
    win.close();
};
var ok = winButtons.add("button", undefined, "确定");
ok.helpTip = "Press Enter to Run";
ok.onClick = function(e) {
    if (preview.value && isUndo) {
        app.undo()
    }
    startAction();
    if (toGroupCheckbox.value) {
        toGroupItems()
    }
    isUndo = false;
    win.close();
};
ok.active = true;

function handle_key(key, control, min) {
    if (key.shiftKey) {
        step = 10;
    } else if (key.ctrlKey) {
        step = 0.1;
    } else {
        step = 1;
    }
    switch (key.keyName) {
        case "Up":
            control.text = String(Number(parseFloat(control.text)) + step);
            break;
        case "Down":
            control.text = String(Number(parseFloat(control.text)) - step);
    }
    if (control.text === "NaN" || control.text <= 0) {
        control.text = min;
    }
}
valueColumns.addEventListener("keydown", function(e) {
    handle_key(e, this, 1);
    previewStart();
});
valueGutterX.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.keyName === "右对齐") {
        valueGutterY.text = this.text;
    } else {
        handle_key(e, this, 0)
    }
    previewStart();
});
valueGutterY.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.keyName === "左对齐") {
        valueGutterX.text = this.text;
    } else {
        handle_key(e, this, 0)
    }
    previewStart();
});
preview.onClick = function(e) {
    previewStart();
};

function toGroupItems() {
    var items = selection;
    var i = items.length;
    var target = items[0].parent;
    var __group = target.groupItems.add();
    while (i--) {
        items[i].moveToBeginning(__group);
    }
    return __group;
}

function selectionBounds(bounds) {
    bounds = typeof bounds === "string" && bounds.length && bounds.slice(0, 1) === "v" ? "visibleBounds" : "geometricBounds";
    var arr = selection;
    var x = [];
    var y = [];
    var w = [];
    var h = [];
    var size = [
        [],
        []
    ];
    var i = arr.length;
    while (i--) {
        x.push(arr[i][bounds][0]);
        y.push(arr[i][bounds][1]);
        w.push(arr[i][bounds][2]);
        h.push(arr[i][bounds][3]);
        size[0].push(arr[i][bounds][2] - arr[i][bounds][0]);
        size[1].push(arr[i][bounds][1] - arr[i][bounds][3]);
    }
    return [Math.min.apply(null, x), Math.max.apply(null, y), Math.max.apply(null, w), Math.min.apply(null, h), Math.max.apply(null, size[0]), Math.max.apply(null, size[1])];
}
Array.prototype.randomArray = function() {
    var ix = this.length;
    while (0 !== ix) {
        $i = Math.floor(Math.random() * ix);
        ix -= 1;
        ti = this[ix];
        this[ix] = this[$i];
        this[$i] = ti;
    }
    return this;
};

function startAction() {
    var bounds = "visibleBounds";
    var items = sortByY.value ? selection.sort(function(a, b) {
        return a[bounds][1] <= b[bounds][1];
    }) : (sortByX.value ? selection.sort(function(a, b) {
        return a[bounds][0] >= b[bounds][0];
    }) : (sortByS.value ? selection.sort(function(a, b) {
        return (a.width + a.height) <= (b.width + b.height);
    }) : (sortByW.value ? selection.sort(function(a, b) {
        return a.width <= b.width;
    }) : (sortByH.value ? selection.sort(function(a, b) {
        return a.height <= b.height;
    }) : selection))));
    if (randomOrderCheckbox.value) {
        items.randomArray()
    }
    if (reverseOrder.value) {
        items.reverse()
    }
    var l = items.length;
    var __rows = 0;
    var gutter = {
        x: parseFloat(valueGutterX.text),
        y: parseFloat(valueGutterY.text)
    };
    var __posXValue = positionX.selection.text.toLowerCase();
    var __posYValue = positionY.selection.text.toLowerCase();
    var columns = parseInt(valueColumns.text);
    var bnds = selectionBounds(bounds);

    function __align(__pos, __bnds) {
        if (__pos === "水平居中") {
            return (bnds[5] - (__bnds[1] - __bnds[3])) / 2;
        } else if (__pos === "底对齐") {
            return bnds[5] - (__bnds[1] - __bnds[3]);
        } else if (__pos === "垂直居中") {
            return (bnds[4] - (__bnds[2] - __bnds[0])) / 2;
        } else if (__pos === "右对齐") {
            return bnds[4] - (__bnds[2] - __bnds[0]);
        } else {
            return 0;
        }
    }
    if (l > 1) {
        for (var i = j = 0; i < l; i++, j++) {
            if (j === columns) {
                __rows++;
                j = 0;
            }
            items[i].left = bnds[0] + ((bnds[4] + gutter.x) * j) + __align(__posXValue, items[i][bounds]);
            items[i].top = (bnds[1] - ((bnds[5] + gutter.y) * __rows)) - __align(__posYValue, items[i][bounds]);
        }
    } else {
        isUndo = false;
    }
}

function previewStart() {
    if (preview.value) {
        if (isUndo) {
            app.undo()
        } else {
            isUndo = true
        }
        startAction();
        app.redraw();
    } else {
        if (isUndo) {
            app.undo();
            app.redraw();
            isUndo = false;
        }
    }
}
valueColumns.addEventListener("change", function(e) {
    previewStart();
});
valueGutterY.addEventListener("change", function(e) {
    previewStart();
});
valueGutterX.addEventListener("change", function(e) {
    previewStart();
});
positionX.addEventListener("change", function(e) {
    previewStart();
});
positionY.addEventListener("change", function(e) {
    previewStart();
});

function saveSettings() {
    var $file = new File(settingFile.folder + settingFile.name);
    var data = [valueColumns.text, valueGutterX.text, positionX.selection.index, valueGutterY.text, positionY.selection.index, toGroupCheckbox.value, randomOrderCheckbox.value, sortByY.value, reverseOrder.value, sortByX.value, sortByW.value, sortByH.value, sortByS.value].toString();
    $file.open("w");
    $file.write(data);
    $file.close();
}

function loadSettings() {
    var $file = File(settingFile.folder + settingFile.name);
    if ($file.exists) {
        try {
            $file.open("r");
            var data = $file.read().split("\n");
            var $main = data[0].split(",");
            valueColumns.text = $main[0];
            valueGutterX.text = $main[1];
            positionX.selection = parseInt($main[2]);
            valueGutterY.text = $main[3];
            positionY.selection = parseInt($main[4]);
            toGroupCheckbox.value = $main[5] === "true";
            randomOrderCheckbox.value = $main[6] === "true";
            sortByY.value = $main[7] === "true";
            reverseOrder.value = $main[8] === "true";
            sortByX.value = $main[9] === "true";
            sortByW.value = $main[10] === "true";
            sortByH.value = $main[11] === "true";
            sortByS.value = $main[12] === "true";
        } catch (e) {

        }
        $file.close();
    }
}
win.onClose = function() {
    if (isUndo) {
        app.undo();
        app.redraw();
        isUndo = false;
    }
    saveSettings();
    return true;
};

function checkSettingFolder() {
    var $folder = new Folder(settingFile.folder);
    if (!$folder.exists) {
        $folder.create()
    }
}
checkSettingFolder();
loadSettings();
win.center();
win.show();