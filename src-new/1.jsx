#target illustrator-12.0

var win = new Window("dialog", "请稍候", undefined, {closeButton: false});

// 添加进度条
var progress = win.add("progressbar", undefined, 0, 100);
progress.preferredSize.width = 300;

// 添加动作按钮
var actionBtn = win.add("button", undefined, "开始处理");

actionBtn.onClick = function() {
    actionBtn.enabled = false;
    progress.value = 0;
    processStep(0);
};

function processStep(i) {
    if (i > 100) {
        progress.value = 0;
        actionBtn.enabled = true;
        return;
    }
    progress.value = i;
    win.update();
    $.sleep(20); // 不要用自定义 sleep，会阻塞UI
    processStep(i + 1);
}

win.show();