var items = app.activeDocument.selection;

for (var i = 0; i < items.length; i++) {
    handle(items[i]);
}

function handle(item) {
    if (item.typename === "GroupItem") {
        for (var j = 0; j < item.pageItems.length; j++) {
            handle(item.pageItems[j]);
        }
    } else if (item.typename === "CompoundPathItem") {
        for (var j = 0; j < item.pathItems.length; j++) {
            handle(item.pathItems[j]);
        }
    } else if (item.typename === "PathItem") {
        $.writeln("Processing PathItem: " + item.name);
        $.writeln("Item Parent Type: " + item.parent.typename);
    }
}
