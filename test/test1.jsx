//@target illustrator
//@targetengine main
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);

function main() {
    var win = buildUI();

    win.show();
    function buildUI() {
        var win = new Window("palette", "test1");

        dimensionPanel = win.add("group", [0, 0, 290, 90]);

        return win;
    }
}

try {
    main();
} catch (error) {
    alert(error);
}
