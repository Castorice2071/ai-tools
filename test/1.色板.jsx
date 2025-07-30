function main() {
    var items = app.activeDocument.swatches

    $.writeln("items.length: " + items.length);

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        $.writeln("==================================================");
        $.writeln("item.name: " + item.name);
        $.writeln("item.color: " + item.color);
        $.writeln("item.color.typename: " + item.color.typename);

        // if (item.color.typename === "GradientColor") {
        //     var gradient = item.color.gradient;
        //     if (gradient) {
        //         $.writeln("gradient.name: " + gradient.name);
        //         $.writeln("gradient.type: " + gradient.type);
        //         $.writeln("gradient.gradientStops.length: " + gradient.gradientStops.length);

        //         for (var j = 0; j < gradient.gradientStops.length; j++) {
        //             var stop = gradient.gradientStops[j];
        //             $.writeln("stop.color: " + stop.color);
        //             $.writeln("stop.colorText: " + getColorText(stop.color));
        //         }
        //     }
        // } else {
        //     $.writeln("colorText: " + getColorText(item.color));
        // }
    }
}

main();