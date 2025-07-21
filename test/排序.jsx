main();
function main() {
    var bounds = "visibleBounds";
    var items = app.activeDocument.selection;
    if (items.length === 0) {
        return alert("No items selected.");
    }

    items.sort(function (a, b) {
        return a[bounds][1] < b[bounds][1];
    });

    items.map(function (item) {
        $.writeln("item.name: " + item.name);
    });
}
