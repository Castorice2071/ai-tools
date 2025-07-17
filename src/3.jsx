var pageItems = app.activeDocument.pageItems;
var pathItems = app.activeDocument.pathItems;

$.writeln("pageItems.length: " + pageItems.length);
$.writeln("pathItems.length: " + pathItems.length);

var item = pageItems.getByName("222");

if (item) {
    $.writeln("Item found: " + item.name);
    $.writeln("Item type: " + item.typename);
    $.writeln("Item position: " + item.position);
    $.writeln("Item size: " + item.width + "x" + item.height);
    $.writeln("Item fill color: " + (item.filled ? item.fillColor.typename : "None"));
    $.writeln("Item spot: " + item.fillColor.spot);
    $.writeln("Item spot.name: " + item.fillColor.spot.name);
    $.writeln("Item spot.color: " + item.fillColor.spot.color);
    $.writeln("Item spot.colorType: " + item.fillColor.spot.colorType);
    $.writeln("Item spot.parent: " + item.fillColor.spot.parent);
    $.writeln("Item spot.spotKind: " + item.fillColor.spot.spotKind);
}
