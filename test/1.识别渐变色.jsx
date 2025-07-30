function getColorText(color) {
    if (color.typename === "RGBColor") {
        return "RGB(" + color.red + ", " + color.green + ", " + color.blue + ")";
    } else if (color.typename === "CMYKColor") {
        return "CMYK(" + color.cyan + ", " + color.magenta + ", " + color.yellow + ", " + color.black + ")";
    } else if (color.typename === "GrayColor") {
        return "Gray(" + color.gray + ")";
    } else if (color.typename === "SpotColor") {
        return "SpotColor(" + color.spot.name + ")";
    } else if (color.typename === "PatternColor") {
        return "PatternColor(" + color.pattern.name + ")";
    }

    return null;
}

function main() {
    try {
        var items = app.activeDocument.selection;
        if (items.length === 0) {
            return alert("No items selected.");
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            var color = item.fillColor;

            $.writeln("==================================================");
            $.writeln("color.typename: " + color.typename);

            // $.writeln("angle: " + item.fillColor.angle);
            // $.writeln("gradient: " + item.fillColor.gradient);
            // $.writeln("hiliteAngle: " + item.fillColor.hiliteAngle);
            // $.writeln("hiliteLength: " + item.fillColor.hiliteLength);
            // $.writeln("length: " + item.fillColor.length);
            // $.writeln("matrix: " + item.fillColor.matrix);
            // $.writeln("origin: " + item.fillColor.origin);
            // $.writeln("typename: " + item.fillColor.typename);

            var gradient = item.fillColor.gradient;
            if (gradient) {
                $.writeln("gradient.name: " + gradient.name);
                $.writeln("gradient.type: " + gradient.type);
                $.writeln("gradient.gradientStops.length: " + gradient.gradientStops.length);

                for (var j = 0; j < gradient.gradientStops.length; j++) {
                    var stop = gradient.gradientStops[j];
                    $.writeln("stop.color: " + stop.color);
                    $.writeln("stop.colorText: " + getColorText(stop.color));
                }
            }
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

main();
