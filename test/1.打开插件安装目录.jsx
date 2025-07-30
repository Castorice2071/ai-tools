function init() {
    var str = Folder.userData + "/Adobe/CEP/extensions/";
    var f = new Folder(str);
    if (f.exists == true) {
        //不存在目录 则新建目录
        f.execute();
    }
}

init();
