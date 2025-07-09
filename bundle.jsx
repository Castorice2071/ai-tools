function add_arrow(Ęuhș, ófÌøܔऔᐈนLBÓÎ, äHywßꁞȁ) {
    var arrow = {};
    arrow.fill = true;
    arrow.length = äHywßꁞȁ / 10 || 5;
    arrow.width = (äHywßꁞȁ / 10) * 1.14 || 5.7;
    arrow.limit = 0.5;
    if (Ęuhș.length < 1) {
        return;
    }
    arrow.width /= 2;
    arrow.angle = Math.atan2(arrow.width, arrow.length);
    for (var p = 0; p < Ęuhș.length; p += 1) {
        if (!Ęuhș [p].stroked || Ęuhș [p].closed) {
            continue;
        }
        A = Ęuhș [p].pathPoints;
        M = A.length - 1;
        arrow.eachlen = Math.max(Ęuhș [p].strokeWidth, arrow.limit) * arrow.length;
        arrow.offset = arrow.eachlen * 0.8;
        if (A[0]) {å = def4Pnts(A[0], A[1]);ȃฑऍÃÄbúVＨꐶ㦐ꐸฅ = arrNeq(å [2], å [3]);âyÒäYUW料㦐Ţᔐᔋऐᔕ = arrNeq(å [0], å [1]);
            m = drawArrow(Ęuhș [p], A[0], å, å [0], 1, arrow, ófÌøܔऔᐈนLBÓÎ);
            if (ȃฑऍÃÄbúVＨꐶ㦐ꐸฅ || âyÒäYUW料㦐Ţᔐᔋऐᔕ) {
                A[0].rightDirection = defHan(m, å, 1);
            } else {
                A[0].rightDirection = A[0].anchor;
            }
            A[0].leftDirection = A[0].anchor;
            if (ȃฑऍÃÄbúVＨꐶ㦐ꐸฅ) {
                A[1].leftDirection = adjHan(å [3], å [2], 1 - m)
            }
        }
        if (A[M]) {å = def4Pnts(A[M - 1], A[M]);ȃฑऍÃÄbúVＨꐶ㦐ꐸฅ = arrNeq(å [0], å [1]);âyÒäYUW料㦐Ţᔐᔋऐᔕ = arrNeq(å [2], å [3]);
            m = drawArrow(Ęuhș [p], A[M], å, å [3], -1, arrow, ófÌøܔऔᐈนLBÓÎ);
            A[M].rightDirection = A[M].anchor;
            if (ȃฑऍÃÄbúVＨꐶ㦐ꐸฅ || âyÒäYUW料㦐Ţᔐᔋऐᔕ) {
                A[M].leftDirection = defHan(m, å, 0);
            } else {
                A[M].leftDirection = A[M].anchor;
            }
            if (ȃฑऍÃÄbúVＨꐶ㦐ꐸฅ) {
                A[M - 1].rightDirection = adjHan(å [0], å [1], m)
            }
        }
    }
}

function def4Pnts(ҿ, ꄗ) {
    return [ҿ.anchor, ҿ.rightDirection, ꄗ.leftDirection, ꄗ.anchor];
}

function drawArrow(line, 㜉Æ, å, Ąฏ, æC, arrow, ÁñUÎ욙ꁁ) {
    if (arrow.offset > 0) {óh = getT4Len(å, arrow.offset * æC);Ҫ㠅㘔 = bezier(å, óh);
    } else {
        if (æC > 0) {óh = 0;Ҫ㠅㘔 = å [0];
        } else {óh = 1;Ҫ㠅㘔 = å [3];
        }
    }
    var㘁 = line.duplicate();㘁.closed = true;㘁.filled = true;㘁.fillColor = 㘁.strokeColor;㘁.stroked = false;
    var m = getRad(Ąฏ, bezier(å, getT4Len(å, arrow.eachlen * æC * Math.cos(arrow.angle))));
    var A = 㘁.pathPoints;
    for (var p = A.length - 1; p > 1; p--) {
        A[p].remove()
    }
    A[0].anchor = getPnt(Ąฏ, m - arrow.angle, arrow.eachlen);
    fixDir(A[0]);
    A[1].anchor = Ąฏ;
    fixDir(A[1]);
    A.add();
    A[2].anchor = getPnt(Ąฏ, m + arrow.angle, arrow.eachlen);
    fixDir(A[2]);㘁.move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);㜉Æ.anchor = Ҫ㠅㘔;
    returnóh;
}

function getRad(ҿ, ꄗ) {
    return Math.atan2(ꄗ [1] - ҿ [1], ꄗ [0] - ҿ [0]);
}

function bezier(å, m) {
    var N = 1 - m;
    return [(N * N * N * å [0][0]) + (3 * N * m * ((N * å [1][0]) + (m * å [2][0]))) + (m * m * m * å [3][0]), (N * N * N * å [0][1]) + (3 * N * m * ((N * å [1][1]) + (m * å [2][1]))) + (m * m * m * å [3][1])];
}

function getPnt(õӇ, 간v, Ԏऍ) {
    return [õӇ [0] + (Math.cos(간v) * Ԏऍ), õӇ [1] + (Math.sin(간v) * Ԏऍ)];
}

function defHan(m, å, p) {
    return [(m * ((m * ((å [p][0] - (2 * å [p + 1][0])) + å [p + 2][0])) + (2 * (å [p + 1][0] - å [p][0])))) + å [p][0], (m * ((m * ((å [p][1] - (2 * å [p + 1][1])) + å [p + 2][1])) + (2 * (å [p + 1][1] - å [p][1])))) + å [p][1]];
}

function adjHan(Ąฏ, ᔔᐇ, U) {
    return [Ąฏ [0] + ((ᔔᐇ [0] - Ąฏ [0]) * U), Ąฏ [1] + ((ᔔᐇ [1] - Ąฏ [1]) * U)];
}

function fixDir(Nf) {
    Nf.rightDirection = Nf.anchor;
    Nf.leftDirection = Nf.anchor;
}

function getT4Len(å, ªâþ) {
    var U = [(å [3][0] - å [0][0]) + (3 * (å [1][0] - å [2][0])), (å [0][0] - (2 * å [1][0])) + å [2][0], å [1][0] - å [0][0]];
    var g = [(å [3][1] - å [0][1]) + (3 * (å [1][1] - å [2][1])), (å [0][1] - (2 * å [1][1])) + å [2][1], å [1][1] - å [0][1]];
    var D = [(U[0] * U[0]) + (g[0] * g[0]), 4 * ((U[0] * U[1]) + (g[0] * g[1])), 2 * ((U[0] * U[2]) + (g[0] * g[2]) + (2 * ((U[1] * U[1]) + (g[1] * g[1])))), 4 * ((U[1] * U[2]) + (g[1] * g[2])), (U[2] * U[2]) + (g[2] * g[2])];
    var q㘂ËÎÁÖ = getLength(D, 1);
    if (ªâþ == 0) {
        return q㘂ËÎÁÖ;
    } else if (ªâþ < 0) {ªâþ += q㘂ËÎÁÖ;
        if (ªâþ < 0) {
            return 0;
        }
    } else {
        if (ªâþ > q㘂ËÎÁÖ) {
            return 1;
        }
    }
    varóh = 0;
    var㘃 = 1;
    var간㜒ÀóÇǷ = 0.001;
    for (varº = 1;º < 30;º += 1) {
        m = óh + ((㘃 - óh) / 2);
        E = ªâþ - getLength(D, m);
        if (Math.abs(E) < 간㜒ÀóÇǷ) {
            break;
        } else if (E < 0) {㘃 = m
        } else {óh = m
        }
    }
    return m;
}

function getLength(D, m) {
    varº = m / 128;
    varꄉ = º * 2;
    var㘈 = function(m, D) {
        return Math.sqrt((m * ((m * ((m * ((m * D[0]) + D[1])) + D[2])) + D[3])) + D[4]) || 0;
    };
    varҭ㜐ó = (㘈 (0, D) - 㘈 (m, D)) / 2;
    for (var p = º; p < m; p += ꄉ) {ҭ㜐ó += (2 * 㘈 (p, D)) + 㘈 (p + º, D)
    }
    returnҭ㜐ó * ꄉ;
}

function arrNeq(ᔉfȇ, ถＨ) {
    for (var p in ᔉfȇ) {
        if (ᔉfȇ [p] != ถＨ [p]) {
            return true;
        }
    }
    return false;
}

function draw_area(ȕȄMመᔉ) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    var sꑝęऑᘅ = ȕȄMመᔉ.data;
    var unit = ȕȄMመᔉ.unit;
    var unit2 = ȕȄMመᔉ.unit2;
    var fonts = ȕȄMመᔉ.fonts;
    var isFraction = ȕȄMመᔉ.isFraction;
    var font_size = ȕȄMመᔉ.font_size;
    var color = ȕȄMመᔉ.color;
    var lineWidth = ȕȄMመᔉ.lineWidth;
    var lineDashed = ȕȄMመᔉ.lineDashed;
    var lineColor = ȕȄMመᔉ.lineColor;
    var decimal = ȕȄMመᔉ.decimal;
    var scale = ȕȄMመᔉ.scale;
    var needRoundAgain = ȕȄMመᔉ.needRoundAgain;
    var specType = ȕȄMመᔉ.specType;
    var swatch = ȕȄMመᔉ.swatch;
    var lineSwatch = ȕȄMመᔉ.lineSwatch;
    var layerName = ȕȄMመᔉ.layerName;
    var params = ȕȄMመᔉ.params;
    color = color_JS_to_AI(color, swatch);
    lineColor = color_JS_to_AI(lineColor, lineSwatch);
    color2 = params.useColor2 && color_JS_to_AI(params.color2, params.swatch2);
    try {
        U㜊ฑऐᔍᘖ.activeLayer = U㜊ฑऐᔍᘖ.layers[layerName];
    } catch (err) {
        varÁñUÎ욙ꁁ = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();
        for (var p = U㜊ฑऐᔍᘖ.layers[0].pageItems.length - 1; p > 0; p--) {
            U㜊ฑऐᔍᘖ.layers[0].pageItems[p].move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);
        }
    }
    varǹaÄ = sꑝęऑᘅ.center[0];
    var DüRn = sꑝęऑᘅ.center[1];
    for (var㜖 = 0;㜖 < textFonts.length;㜖 += 1) {
        if (textFonts[㜖].name.match(/helvetica/i) || textFonts[㜖].name.match(/arial/i) && !textFonts[㜖].name.match(/italic/i) && !textFonts[㜖].name.match(/bold/i) && !textFonts[㜖].name.match(/ultralight/i) && !textFonts[㜖].name.match(/Oblique/i)) {
            if (textFonts[㜖].name.match(/light/i)) {ÙOòÓǨÒbú = textFonts[㜖];
            } else {
                if (textFonts[㜖].name.match(/regular/i) || textFonts[㜖].name.match(/medium/i) || textFonts[㜖].name.match(/mt/i)) {
                    nÔҮ㠉ꄏ㜐 = textFonts[㜖];
                }
            }
        }
    }
    var gºÓñY㖠㕌갇 = U㜊ฑऐᔍᘖ.activeLayer.textFrames.add();
    if (params.display_unit) {
        content = isFraction ? sꑝęऑᘅ.fractions + getAddSpace(unit, params.spaceB4Unit) + unit : sꑝęऑᘅ.value + getAddSpace(unit, params.spaceB4Unit) + unit;
    } else {
        content = isFraction ? sꑝęऑᘅ.fractions : sꑝęऑᘅ.value;
    }
    var content2 = "";
    if (params.useUnit2) {
        if (params.display_unit2) {
            content2 = params.isFraction2 ? sꑝęऑᘅ.fractions2 + getAddSpace(unit2, params.spaceB4Unit) + unit2 : sꑝęऑᘅ.value2 + getAddSpace(unit2, params.spaceB4Unit) + unit2;
        } else {
            content2 = params.isFraction2 ? sꑝęऑᘅ.fractions2 : sꑝęऑᘅ.value2;
        }
    }
    varÊ욎㖢ꄊᘏșiÿ = String(content).length;
    gºÓñY㖠㕌갇.name = "base|" + sꑝęऑᘅ.pathData;
    gºÓñY㖠㕌갇.contents = params.useUnit2 ? content + render2ndUNit(content2, params.unit2Separator, params) : content;
    gºÓñY㖠㕌갇.top = DüRn;
    gºÓñY㖠㕌갇.left = ǹaÄ;
    gºÓñY㖠㕌갇.textRange.characterAttributes.size = font_size;
    gºÓñY㖠㕌갇.textRange.characterAttributes.fillColor = color;
    try {
        gºÓñY㖠㕌갇.textRange.characterAttributes.textFont = textFonts.getByName(fonts) || ÙOòÓǨÒbú || nÔҮ㠉ꄏ㜐;
    } catch (È) {

    }
    if (params.display_unit) {
        if (unit === "\"") {
            unit = "in";Ê욎㖢ꄊᘏșiÿ += 1;
        }
        if (unit === "'") {
            unit = "ft";Ê욎㖢ꄊᘏșiÿ += 1;
        }
    }
    if (params.display_unit2) {
        if (unit2 === "\"") {
            unit2 = "in";
        }
        if (unit2 === "'") {
            unit2 = "ft";
        }
    }
    gºÓñY㖠㕌갇.contents = renderSquareUnit(gºÓñY㖠㕌갇.contents, params.display_unit ? unit : "", params.display_unit, params.useUnit2 && params.display_unit2 ? unit2 : "", params.display_unit2, params.spaceB4Unit);
    if (params.display_unit) {
        unit = unit + "2";Ê욎㖢ꄊᘏșiÿ += 1;
    }
    if (params.display_unit2) {
        unit2 = params.useUnit2 ? unit2 + "2" : unit2
    }
    if (isFraction || params.isFraction2) {
        drawFraction(gºÓñY㖠㕌갇, unit, font_size, null, null);
    }
    smallerUnit(gºÓñY㖠㕌갇, unit, font_size, params.useUnit2 ? unit2 : null, params.spaceB4Unit, true);
    if (params.useColor2) {
        for (varܓē = Ê욎㖢ꄊᘏșiÿ + 1;ܓē < gºÓñY㖠㕌갇.contents.length;ܓē++) {
            gºÓñY㖠㕌갇.textRange.characters[ܓē].fillColor = color2;
        }
    }
    gºÓñY㖠㕌갇.textRange.paragraphAttributes.justification = Justification.CENTER;
    gºÓñY㖠㕌갇.top += (gºÓñY㖠㕌갇.height / 2);
}

function getFontSizeFromUnit(font_size, fontUnit) {
    if (fontUnit === "pt" || fontUnit === "px") {
        return font_size;
    }
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    varÚÃT㕌㥱㜁Ƿҙ = U㜊ฑऐᔍᘖ.artboards[U㜊ฑऐᔍᘖ.artboards.getActiveArtboardIndex()];
    varҏ각홉㮕ꉤꐷ = Math.abs(ÚÃT㕌㥱㜁Ƿҙ.artboardRect[1] - ÚÃT㕌㥱㜁Ƿҙ.artboardRect[3]);
    varǲܔȇďएȔᐉŤ = Math.abs(ÚÃT㕌㥱㜁Ƿҙ.artboardRect[0] - ÚÃT㕌㥱㜁Ƿҙ.artboardRect[2]);
    if (fontUnit === "pH") {
        return (ҏ각홉㮕ꉤꐷ * font_size) / 100;
    } else {
        return (ǲܔȇďएȔᐉŤ * font_size) / 100;
    }
}
if (typeof JSON !== "object") {
    JSON = {};
}

function clearSwatches() {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    app.executeMenuCommand("deselectall");
    U㜊ฑऐᔍᘖ.swatchGroups.getByName("~%temp").remove();
    for (var VE = U㜊ฑऐᔍᘖ.swatches.length - 1; VE >= 0; VE--) {
        if (U㜊ฑऐᔍᘖ.swatches[VE].name.match("~%") !== null) {
            var múȐܐaÆÝD = new GrayColor();
            múȐܐaÆÝD.gray = 50;
            U㜊ฑऐᔍᘖ.swatches[VE].color = múȐܐaÆÝD;
            U㜊ฑऐᔍᘖ.swatches[VE].remove();
        }
    }
}

function draw_styleList(øpÞßVҭâsÖÉÌOë, param, specType) {
    try {
        var갇㜊㜙ꄌꄓ = function() {
            var U㜊ฑऐᔍᘖ = app.activeDocument;
            var layerName = param.display.layerName;
            if (!param.display.onObjectLayer) {
                try {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.layers[layerName];
                } catch (err) {
                    try {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.layers.add();ᐙउãÅlpïሙᘙ.name = layerName;
                    } catch (err) {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.activeLayer;
                    }
                }
            } else {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.activeLayer;
            }ᐙउãÅlpïሙᘙ.visible = true;ᐙउãÅlpïሙᘙ.locked = false;
            U㜊ฑऐᔍᘖ.activeLayer = ᐙउãÅlpïሙᘙ;ᐙउãÅlpïሙᘙ = null;
        };
        var DßÊ왊㥲ґđᔈĄखሕᔅb = app.activeDocument.selection;
        app.executeMenuCommand("deselectall");
        varĄċᘇถÄöFÀã = 갇㜊㜙ꄌꄓ ();ĄċᘇถÄöFÀã = 갇㜊㜙ꄌꄓ = null;
        var color = param.display.color;
        var swatch = param.display.swatch;
        var lineWidth = param.display.lineWidth;
        var lineDashed = param.display.lineDashed;
        var fonts = param.display.fontStyle || null;
        var font_size = Number(param.display.font_size);
        var lineColor = param.display.lineColor;
        var lineSwatch = param.display.lineSwatch;
        var params = param.display;
        varҔ㘁ሗæ㡋Ҵұ = øpÞßVҭâsÖÉÌOë [0].position;
        varฅऌĈODÞMsÊꁫ = Ҕ㘁ሗæ㡋Ҵұ === "oTL" || Ҕ㘁ሗæ㡋Ҵұ === "oBL" || Ҕ㘁ሗæ㡋Ҵұ === "oLT" || Ҕ㘁ሗæ㡋Ҵұ === "oRT" ? true : false;
        var㜐㜅㜇ҍꄊ = 0;
        for (var label in øpÞßVҭâsÖÉÌOë) {㜐㜅㜇ҍꄊ += øpÞßVҭâsÖÉÌOë [label].label.length;
        }
        varᔁÈBïÅÅµøtqꁸᐂᐅ = false;
        if (㜐㜅㜇ҍꄊ > 9) {ᔁÈBïÅÅµøtqꁸᐂᐅ = true;
            var value = 0;
            varซธ = new Window("palette{text:'Rendering dimension',bounds:[100,100,580,140],progress:Progressbar{bounds:[20,10,460,30] , minvalue:0,value:" + value + "}};");ซธ.progress.maxvalue = 㜐㜅㜇ҍꄊ;ซธ.center();ซธ.show();
        }
        for (var p = øpÞßVҭâsÖÉÌOë.length - 1; p >= 0; p--) {
            varӁሎ㣦Ѿ = {
                content: øpÞßVҭâsÖÉÌOë [p].label,
                textX: øpÞßVҭâsÖÉÌOë [p].labelPos[0],
                textY: øpÞßVҭâsÖÉÌOë [p].labelPos[1],
                position: Ҕ㘁ሗæ㡋Ҵұ,
                font_size: font_size,
                fonts: fonts,
                color: color,
                swatch: swatch,
                specType: specType,
                params: params
            };
            var nØãÛq㦘ꂂu = 간ꁸ왛㥷욈ҋҠ (Ӂሎ㣦Ѿ);
            if (ฅऌĈODÞMsÊꁫ && øpÞßVҭâsÖÉÌOë [p].label.length > 0) {
                for (varÈ = 0;È < øpÞßVҭâsÖÉÌOë [p].lines.length;È += 1) {
                    if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {ซธ.progress.value++;ซธ.update();
                    }
                    var linePoint = øpÞßVҭâsÖÉÌOë [p].lines[È];
                    var position = øpÞßVҭâsÖÉÌOë [p].position;
                    var isLast = È === (øpÞßVҭâsÖÉÌOë [p].lines.length - 1) ? true : false;
                    varÝkÌÁÛÜñ = {
                        linePoint: linePoint,
                        pinHead: øpÞßVҭâsÖÉÌOë [p].pinHeads[È],
                        position: position,
                        color: color,
                        lineColor: lineColor,
                        lineSwatch: lineSwatch,
                        lineWidth: lineWidth,
                        lineDashed: lineDashed,
                        specType: specType,
                        pathData: øpÞßVҭâsÖÉÌOë [p].pathData,
                        isLast: isLast,
                        layerName: param.display.layerName,
                        params: param.display
                    };쒩욇ꈴčᐈนᐊᔅ (ÝkÌÁÛÜñ, nØãÛq㦘ꂂu);
                }
            }
        }
        try {
            for (varᔎᐁ in DßÊ왊㥲ґđᔈĄखሕᔅb) {
                DßÊ왊㥲ґđᔈĄखሕᔅb[ᔎᐁ].selected = true;
            }
        } catch (D) {

        }
        $.gc();
        $.gc();
        return "done";
    } catch (err) {
        $.gc();
        $.gc();
        return err;
    }
}
var쒩욇ꈴčᐈนᐊᔅ = function(ÝkÌÁÛÜñ, nØãÛq㦘ꂂu) {
    var line = ÝkÌÁÛÜñ.linePoint;
    var color = ÝkÌÁÛÜñ.lineColor;
    var lineSwatch = ÝkÌÁÛÜñ.lineSwatch;
    var lineWidth = ÝkÌÁÛÜñ.lineWidth;
    var lineDashed = ÝkÌÁÛÜñ.lineDashed;
    var layerName = ÝkÌÁÛÜñ.layerName;
    color = color_JS_to_AI(color, lineSwatch);
    varȀsMꉐ㮛ꉝᔀᐘ = function(layerName) {
        try {
            var U㜊ฑऐᔍᘖ = app.activeDocument;
            if (!ÝkÌÁÛÜñ.params.onObjectLayer) {
                U㜊ฑऐᔍᘖ.activeLayer = U㜊ฑऐᔍᘖ.layers[layerName];
            }
        } catch (err) {
            varÁñUÎ욙ꁁ = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();
            for (var p = U㜊ฑऐᔍᘖ.layers[0].pageItems.length - 1; p > 0; p--) {
                U㜊ฑऐᔍᘖ.layers[0].pageItems[p].move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);
            }
        }
    };
    var oòLñùþfÈ = ȀsMꉐ㮛ꉝᔀᐘ (layerName);ȀsMꉐ㮛ꉝᔀᐘ = oòLñùþfÈ = null;
    var nᘘᘘฉđ = app.activeDocument.activeLayer.pathItems.add();
    nᘘᘘฉđ.filled = false;
    nᘘᘘฉđ.stroked = true;
    nᘘᘘฉđ.strokeDashes = [];
    nᘘᘘฉđ.strokeColor = color;
    nᘘᘘฉđ.strokeWidth = lineWidth;
    nᘘᘘฉđ.strokeDashes = lineDashed;
    nᘘᘘฉđ.name = "base|" + ÝkÌÁÛÜñ.pathData;
    nᘘᘘฉđ.setEntirePath(line);
    nᘘᘘฉđ.move(nØãÛq㦘ꂂu, ElementPlacement.INSIDE);
};
var간ꁸ왛㥷욈ҋҠ = function(Ӂሎ㣦Ѿ) {
    var욙Bꉗ㨥㦏 = "";
    varÄlþţԎᔊ = [];
    for (var Bü = 0; Bü < Ӂሎ㣦Ѿ.content.length; Bü += 1) {ÄlþţԎᔊ.push({
            type: Ӂሎ㣦Ѿ.content[Bü].type,
            color: Ӂሎ㣦Ѿ.content[Bü].color,
            colorType: Ӂሎ㣦Ѿ.content[Bü].colorType
        });욙Bꉗ㨥㦏 += Ӂሎ㣦Ѿ.content[Bü].text;욙Bꉗ㨥㦏 = Bü < (Ӂሎ㣦Ѿ.content.length - 1) ? 욙Bꉗ㨥㦏 += "\n" : 욙Bꉗ㨥㦏;
    }
    var content = 욙Bꉗ㨥㦏;
    var textX = Ӂሎ㣦Ѿ.textX;
    var textY = Ӂሎ㣦Ѿ.textY;
    var position = Ӂሎ㣦Ѿ.position;
    var color = Ӂሎ㣦Ѿ.color;
    var swatch = Ӂሎ㣦Ѿ.swatch;
    var fonts = Ӂሎ㣦Ѿ.fonts;
    var font_size = Ӂሎ㣦Ѿ.font_size;
    var leading = font_size * 1.2;
    var layerName = Ӂሎ㣦Ѿ.params.layerName;
    color = color_JS_to_AI(color, swatch);
    varȀsMꉐ㮛ꉝᔀᐘ = function(layerName) {
        var U㜊ฑऐᔍᘖ = app.activeDocument;
        try {
            if (!Ӂሎ㣦Ѿ.params.onObjectLayer) {
                U㜊ฑऐᔍᘖ.activeLayer = U㜊ฑऐᔍᘖ.layers[layerName];
            }
        } catch (err) {
            varÁñUÎ욙ꁁ = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();
            for (var p = U㜊ฑऐᔍᘖ.layers[0].pageItems.length - 1; p > 0; p--) {
                U㜊ฑऐᔍᘖ.layers[0].pageItems[p].move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);
            }
        }
    };
    var oòLñùþfÈ = ȀsMꉐ㮛ꉝᔀᐘ (layerName);ȀsMꉐ㮛ꉝᔀᐘ = oòLñùþfÈ = null;
    for (var㜖 = 0;㜖 < textFonts.length;㜖 += 1) {
        if (textFonts[㜖].name.match(/helvetica/i) || textFonts[㜖].name.match(/arial/i) && !textFonts[㜖].name.match(/italic/i) && !textFonts[㜖].name.match(/bold/i) && !textFonts[㜖].name.match(/ultralight/i) && !textFonts[㜖].name.match(/Oblique/i)) {
            if (textFonts[㜖].name.match(/light/i)) {ÙOòÓǨÒbú = textFonts[㜖];
            } else {
                if (textFonts[㜖].name.match(/regular/i) || textFonts[㜖].name.match(/medium/i) || textFonts[㜖].name.match(/mt/i)) {
                    nÔҮ㠉ꄏ㜐 = textFonts[㜖];
                }
            }
        }
    }
    varꄏᘇøÇﾜ = app.activeDocument.activeLayer.textFrames.add();ꄏᘇøÇﾜ.contents = content;ꄏᘇøÇﾜ.top = textY;ꄏᘇøÇﾜ.left = textX;ꄏᘇøÇﾜ.textRange.characterAttributes.size = font_size;ꄏᘇøÇﾜ.textRange.characterAttributes.fillColor = color;ꄏᘇøÇﾜ.textRange.characterAttributes.leading = leading;
    try {ꄏᘇøÇﾜ.textRange.characterAttributes.textFont = textFonts.getByName(fonts) || ÙOòÓǨÒbú || nÔҮ㠉ꄏ㜐;
    } catch (È) {

    }

    function locations(substring, è㮎ᔐì) {
        var a = [];
        var p = -1;
        while (p = è㮎ᔐì.indexOf(substring, p + 1) >= 0) {
            a.push(p)
        }
        return a;
    }

    function resizeText(ꉟ㜄ꐸ, ǳp, size) {
        for (var p = 0; p < ꉟ㜄ꐸ.length; p += 1) {
            for (var S = 0; S < ǳp.length; S += 1) {ꄏᘇøÇﾜ.textRange.characters[ꉟ㜄ꐸ [p] + S].characterAttributes.size = size;
            }
        }
    }

    function replaceSize(㣥ꀼóm, size) {
        for (var x = 0; x < 㣥ꀼóm.length; x += 1) {
            resizeText(locations(㣥ꀼóm[x], ꄏᘇøÇﾜ.contents), 㣥ꀼóm[x], size);
        }
    }
    varҒÞfꂇ㦛ꄒ = Math.ceil(font_size * 0.75);
    varéßvçnäÛÆWô = Math.ceil(font_size * 0.5);
    var㠈ŦöäuWy = ["#", "pt", "%"];
    varÙôÀßÓgër = ["RGB", "CMYK", "LAB", "Grayscale", "Opacity:", "leading:", "angle:"];
    replaceSize(ÙôÀßÓgër, éßvçnäÛÆWô);
    replaceSize(㠈ŦöäuWy, ҒÞfꂇ㦛ꄒ);
    if (position === "oLT" || position === "iTR" || position === "iBR") {ꄏᘇøÇﾜ.left -= (ꄏᘇøÇﾜ.width * 1.02);
    }
    if (ꄏᘇøÇﾜ.textRange.lines.length > 1 && position === "oTL") {ꄏᘇøÇﾜ.top += (leading * (ꄏᘇøÇﾜ.textRange.lines.length - 1));
    }
    if (position === "iTL" || position === "iTR") {ꄏᘇøÇﾜ.top = textY;
    } else {
        if (position === "iBL" || position === "iBR") {ꄏᘇøÇﾜ.top = textY + ꄏᘇøÇﾜ.height;
        }
    }
    var nØãÛq㦘ꂂu = app.activeDocument.activeLayer.groupItems.add();
    varӆＪ㥱㘗 = Math.ceil(font_size * 0.75);
    var㜆Ȇ쑶ज = ꄏᘇøÇﾜ.top - Math.floor(font_size * 0.2);
    varҽȘᔙᐗ엮 = ꄏᘇøÇﾜ.left - (ӆＪ㥱㘗 * 1.25);
    varꉿᘆÄxýðÛ = 0;
    for (varØÁ = 0;ØÁ < ÄlþţԎᔊ.length;ØÁ += 1) {
        if (ÄlþţԎᔊ [ØÁ].type === "fill" || ÄlþţԎᔊ [ØÁ].type === "stroke") {
            varõҹӄùÛqJû = ÄlþţԎᔊ [ØÁ].color.tempSwatch.name;
            if (ÄlþţԎᔊ [ØÁ].color.tempSwatch.type === "temp") {ᔀณᘙßñञȓ = createColorObjfromData(ÄlþţԎᔊ [ØÁ].color);
            } else {ᔀณᘙßñञȓ = app.activeDocument.swatches.getByName(õҹӄùÛqJû).color;
            }
            varÅ욉ꉠꁛꑠǱhLÌ = new GrayColor();Å욉ꉠꁛꑠǱhLÌ.gray = 0;
            if (ÄlþţԎᔊ [ØÁ].type === "fill") {
                if (position === "iTL" || position === "iBL" || position === "iTR" || position === "iBR") {
                    fHꉚ㦚ÝCûý = app.activeDocument.activeLayer.pathItems.rectangle(㜆Ȇ쑶ज + 0.25, ҽȘᔙᐗ엮 - 0.25, ӆＪ㥱㘗 + 0.5, ӆＪ㥱㘗 + 0.5);
                    fHꉚ㦚ÝCûý.stroked = false;
                    fHꉚ㦚ÝCûý.filled = true;
                    fHꉚ㦚ÝCûý.fillColor = Å욉ꉠꁛꑠǱhLÌ;
                }
                iÄÍJĄᐔüa = app.activeDocument.activeLayer.pathItems.rectangle(㜆Ȇ쑶ज, ҽȘᔙᐗ엮, ӆＪ㥱㘗, ӆＪ㥱㘗);
                iÄÍJĄᐔüa.stroked = false;
                iÄÍJĄᐔüa.filled = true;
                iÄÍJĄᐔüa.fillColor = ᔀณᘙßñञȓ;ꉿᘆÄxýðÛ++;
            } else {
                if (ÄlþţԎᔊ [ØÁ].type === "stroke") {
                    if (position === "iTL" || position === "iBL" || position === "iTR" || position === "iBR") {
                        fHꉚ㦚ÝCûý = app.activeDocument.activeLayer.pathItems.rectangle(㜆Ȇ쑶ज, ҽȘᔙᐗ엮 + 0.25, ӆＪ㥱㘗 - 0.5, ӆＪ㥱㘗 - 0.5);
                        fHꉚ㦚ÝCûý.stroked = true;
                        fHꉚ㦚ÝCûý.filled = false;
                        fHꉚ㦚ÝCûý.strokeWidth = 1;
                        fHꉚ㦚ÝCûý.strokeColor = Å욉ꉠꁛꑠǱhLÌ;
                    }
                    iÄÍJĄᐔüa = app.activeDocument.activeLayer.pathItems.rectangle(㜆Ȇ쑶ज, ҽȘᔙᐗ엮 + 0.25, ӆＪ㥱㘗 - 0.5, ӆＪ㥱㘗 - 0.5);
                    iÄÍJĄᐔüa.stroked = true;
                    iÄÍJĄᐔüa.filled = false;
                    iÄÍJĄᐔüa.strokeWidth = 0.5;
                    iÄÍJĄᐔüa.strokeColor = ᔀณᘙßñञȓ;ꉿᘆÄxýðÛ++;
                }
            }
        }
        if (fHꉚ㦚ÝCûý) {
            fHꉚ㦚ÝCûý.move(nØãÛq㦘ꂂu, ElementPlacement.INSIDE)
        }
        if (iÄÍJĄᐔüa) {
            iÄÍJĄᐔüa.move(nØãÛq㦘ꂂu, ElementPlacement.INSIDE)
        }㜆Ȇ쑶ज -= leading;
        if (iÄÍJĄᐔüa && position === "oRT") {
            iÄÍJĄᐔüa.left += (ӆＪ㥱㘗 * 1.25);
        }
    }
    if (ꉿᘆÄxýðÛ > 0) {
        if (position === "oRT") {ꄏᘇøÇﾜ.left += (ӆＪ㥱㘗 * 1.25);
        } else {
            if (position === "iTL" || position === "iBL") {ꄏᘇøÇﾜ.left += (ӆＪ㥱㘗 * 1.25);
            }
        }
    }ꄏᘇøÇﾜ.move(nØãÛq㦘ꂂu, ElementPlacement.INSIDE);
    varणꄔ각ӇǱ = content.length > 8 ? "..." : "";
    nØãÛq㦘ꂂu.name = "Style: " + content.substring(0, 6) + णꄔ각ӇǱ;
    return nØãÛq㦘ꂂu;
};

function offsetPointLevel(Ĉฐê, ȀԄSíXꄇ㘒, position) {
    varÞJÇ = position === "left" || position === "right" ? 0 : 1;
    for (varԎऍ = 0;Ԏऍ < Ĉฐê.displace.length;Ԏऍ += 1) {Ĉฐê.path[Ĉฐê.displace[Ԏऍ]][ÞJÇ] += ȀԄSíXꄇ㘒;
    }
    returnĈฐê.path;
}

function offsetTextLevel(label, ȀԄSíXꄇ㘒, position) {
    if (position === "left" || position === "right") {
        label[0] += ȀԄSíXꄇ㘒;
    } else {
        label[1] += ȀԄSíXꄇ㘒;
    }
    return label;
}

function drawFraction(label, unit, font_size, position, labelOrientation) {
    function getFractionIndex(㘒ҝǵ, A㜃ғꄇ, ᘖԋᐉócK㨬ꑟﾀ㘙ґ) {
        varâïçåvꑢ㘇Čᐃᔖ = 㘒ҝǵ.contents.indexOf(A㜃ғꄇ, ᘖԋᐉócK㨬ꑟﾀ㘙ґ);
        return {
            start: âïçåvꑢ㘇Čᐃᔖ,
            end: âïçåvꑢ㘇Čᐃᔖ + A㜃ғꄇ.length,
            divider: âïçåvꑢ㘇Čᐃᔖ + A㜃ғꄇ.indexOf("/")
        };
    }

    function makeFraction(ꁺēöÙàFÄ, oàÉß갂) {
        varԃvÄAÅฎȌȑᐖሐ = oàÉß갂.start;
        var TØGÞbGҥणÕ = oàÉß갂.end;
        var divider = oàÉß갂.divider;
        for (var㘅 = ԃvÄAÅฎȌȑᐖሐ;㘅 < divider;㘅++) {ꁺēöÙàFÄ.textRange.characters[㘅].characterAttributes.size = font_size * 0.6;ꁺēöÙàFÄ.textRange.characters[㘅].characterAttributes.baselineShift = font_size * 0.4;
        }
        for (varन = divider + 1;न < TØGÞbGҥणÕ;न++) {ꁺēöÙàFÄ.textRange.characters[न].characterAttributes.size = font_size * 0.6;
        }
        var㥭ሔᘅᔏȌԌąȓᐏÄ㭮 = new RegExp("[0-9]").test(ꁺēöÙàFÄ.contents.charAt(ԃvÄAÅฎȌȑᐖሐ - 2));
        if (ԃvÄAÅฎȌȑᐖሐ > 0 && 㥭ሔᘅᔏȌԌąȓᐏÄ㭮) {ꁺēöÙàFÄ.textRange.characters[ԃvÄAÅฎȌȑᐖሐ - 1].characterAttributes.tracking = ꁺēöÙàFÄ.textRange.characters[ԃvÄAÅฎȌȑᐖሐ - 1].characterAttributes.tracking - 200
        }ꁺēöÙàFÄ.textRange.characters[ԃvÄAÅฎȌȑᐖሐ].characterAttributes.tracking = ꁺēöÙàFÄ.textRange.characters[ԃvÄAÅฎȌȑᐖሐ].characterAttributes.tracking - 150;ꁺēöÙàFÄ.textRange.characters[divider].characterAttributes.tracking = ꁺēöÙàFÄ.textRange.characters[divider].characterAttributes.tracking + 100;ꁺēöÙàFÄ.textRange.characters[TØGÞbGҥणÕ - 1].characterAttributes.tracking = ꁺēöÙàFÄ.textRange.characters[TØGÞbGҥणÕ - 1].characterAttributes.tracking + 100;
    }
    var fractions = label.contents.match(/[\d]+\/[\d]+/g);
    varèWꁩ㜔ሏ = label.contents.match(/'[\d]+/g);
    varõóZ완ҩᐊèþ = 0;
    if (èWꁩ㜔ሏ && èWꁩ㜔ሏ.length > 0) {
        for (varßÖ = 0;ßÖ < èWꁩ㜔ሏ.length;ßÖ += 1) {
            varｿȀiXÎÕR = label.contents.indexOf(èWꁩ㜔ሏ [ßÖ], õóZ완ҩᐊèþ) + 1;
            label.contents = label.contents.substring(0, ｿȀiXÎÕR) + " " + label.contents.substring(ｿȀiXÎÕR);õóZ완ҩᐊèþ += ｿȀiXÎÕR + 1;
        }
        if (èWꁩ㜔ሏ && èWꁩ㜔ሏ.length > 0) {
            label.textRange.paragraphs[0].paragraphAttributes.firstLineIndent -= èWꁩ㜔ሏ.length;
        }
    }
    if (fractions && fractions.length > 0) {
        var욌㦓ñSøQÔAé = [];
        var UYòꐳꉿҩҚᐊመbû = 0;
        for (varҦҼ = 0;ҦҼ < fractions.length;ҦҼ += 1) {욌㦓ñSøQÔAé.push(getFractionIndex(label, fractions[ҦҼ], UYòꐳꉿҩҚᐊመbû));
            UYòꐳꉿҩҚᐊመbû += 욌㦓ñSøQÔAé [ҦҼ].end;
        }
        for (var GѼ = 0; GѼ < fractions.length; GѼ += 1) {
            varárkn욒ꐷÑ = label.contents.indexOf(fractions[GѼ]) + fractions[GѼ].indexOf("/");
            label.contents = label.contents.substring(0, árkn욒ꐷÑ) + String.fromCharCode(8260) + label.contents.substring(árkn욒ꐷÑ + 1);
        }
        for (var㘊 = 0;㘊 < fractions.length;㘊 += 1) {
            makeFraction(label, 욌㦓ñSøQÔAé [㘊]);
        }
    }
}
varðÑÞnÕÚp㯄ǻᐌt = function(ÝkÌÁÛÜñ) {
    try {
        var drawline = ÝkÌÁÛÜñ.drawline;
        var displacement = ÝkÌÁÛÜñ.displacement;
        var displacementList = ÝkÌÁÛÜñ.displacementList;
        var textX = ÝkÌÁÛÜñ.textX;
        var textY = ÝkÌÁÛÜñ.textY;
        var content = ÝkÌÁÛÜñ.content;
        var content2 = ÝkÌÁÛÜñ.content2;
        var isFraction = ÝkÌÁÛÜñ.isFraction;
        var unit = ÝkÌÁÛÜñ.unit;
        var unit2 = ÝkÌÁÛÜñ.unit2;
        var fonts = ÝkÌÁÛÜñ.fonts;
        var font_size = ÝkÌÁÛÜñ.font_size;
        var position = ÝkÌÁÛÜñ.position;
        var color = ÝkÌÁÛÜñ.color;
        var lineWidth = ÝkÌÁÛÜñ.lineWidth;
        var lineDashed = ÝkÌÁÛÜñ.lineDashed;
        var lineColor = ÝkÌÁÛÜñ.lineColor;
        var swatch = ÝkÌÁÛÜñ.swatch;
        var lineSwatch = ÝkÌÁÛÜñ.lineSwatch;
        var labelBg = ÝkÌÁÛÜñ.labelBg;
        var labelBgTextColor = ÝkÌÁÛÜñ.labelBgTextColor;
        var labelBgTextSwatch = ÝkÌÁÛÜñ.labelBgTextSwatch;
        var labelOrientation = ÝkÌÁÛÜñ.labelOrientation;
        var specType = ÝkÌÁÛÜñ.specType;
        var layerName = ÝkÌÁÛÜñ.layerName;
        var params = ÝkÌÁÛÜñ.params;
        labelBgTextColor = color_JS_to_AI(labelBgTextColor, labelBgTextSwatch);
        color = color_JS_to_AI(color, swatch);
        lineColor = color_JS_to_AI(lineColor, lineSwatch);
        color2 = params.useColor2 && color_JS_to_AI(params.color2, params.swatch2);
        for (var㜖 = 0;㜖 < textFonts.length;㜖 += 1) {
            if (textFonts[㜖].name.match(/helvetica/i) || textFonts[㜖].name.match(/arial/i) && !textFonts[㜖].name.match(/italic/i) && !textFonts[㜖].name.match(/bold/i) && !textFonts[㜖].name.match(/ultralight/i) && !textFonts[㜖].name.match(/Oblique/i)) {
                if (textFonts[㜖].name.match(/light/i)) {ÙOòÓǨÒbú = textFonts[㜖];
                } else {
                    if (textFonts[㜖].name.match(/regular/i) || textFonts[㜖].name.match(/medium/i) || textFonts[㜖].name.match(/mt/i)) {
                        nÔҮ㠉ꄏ㜐 = textFonts[㜖];
                    }
                }
            }
        }
        varꄏᘇøÇﾜ = app.activeDocument.activeLayer.textFrames.add();
        varÊ욎㖢ꄊᘏșiÿ = content.length;ꄏᘇøÇﾜ.contents = params.useUnit2 ? content + render2ndUNit(content2, params.unit2Separator, params) : content;ꄏᘇøÇﾜ.textRange.characterAttributes.size = font_size;ꄏᘇøÇﾜ.top = textY;ꄏᘇøÇﾜ.left = textX;ꄏᘇøÇﾜ.textRange.characterAttributes.fillColor = color;
        try {ꄏᘇøÇﾜ.textRange.characterAttributes.textFont = textFonts.getByName(fonts) || ÙOòÓǨÒbú || nÔҮ㠉ꄏ㜐;
        } catch (È) {

        }ꄏᘇøÇﾜ.textRange.paragraphAttributes.justification = Justification.CENTER;
        varҢ㠆üµaØpíSÕ = font_size;
        if (labelBg) {

        }
        varꄍșᐑआԋᐂ쑁 = 0;
        if (labelBg) {

        }
        if (labelBg) {
            varꑗȖऎሓሐऌᐊᐗÒÊ = ꄏᘇøÇﾜ.width + ((Ң㠆üµaØpíSÕ / 3) * 2);
            varÉÂJ㦔ᔌᐏᔊïüNQÒA = ꄏᘇøÇﾜ.height + ((Ң㠆üµaØpíSÕ / 3) * 2);
        }

        function translatePoint(lҢҊy, slope, 縉㣥नî) {
            return [(Math.cos((slope * Math.PI) / 180) * 縉㣥नî) + lҢҊy[0], (Math.sin((slope * Math.PI) / 180) * 縉㣥नî) + lҢҊy[1]];
        }
        varᘃyþꑜ = 0;
        if (ÝkÌÁÛÜñ.slope !== undefined) {
            if (ÝkÌÁÛÜñ.slope === 0) {ꄏᘇøÇﾜ.top = (ꄏᘇøÇﾜ.top + (ꄏᘇøÇﾜ.height / 2)) - (Ң㠆üµaØpíSÕ / 3);
            } else if (ÝkÌÁÛÜñ.slope === 180) {ꄏᘇøÇﾜ.top = ꄏᘇøÇﾜ.top + (ꄏᘇøÇﾜ.height / 2) + (Ң㠆üµaØpíSÕ / 3.5);
            } else {
                if (labelOrientation !== "Slope") {
                    var extra2ndLIneSegementNoSlopOffset = params.useUnit2 && params.unit2_lineBreak ? Ң㠆üµaØpíSÕ * 1.2 : Ң㠆üµaØpíSÕ / 2;
                    if (ÝkÌÁÛÜñ.slope === 90) {ꄏᘇøÇﾜ.left = ꄏᘇøÇﾜ.left + extra2ndLIneSegementNoSlopOffset;
                    } else {
                        if (ÝkÌÁÛÜñ.slope === 270) {ꄏᘇøÇﾜ.left = ꄏᘇøÇﾜ.left - extra2ndLIneSegementNoSlopOffset;
                        }
                    }
                }ꄏᘇøÇﾜ.top = ꄏᘇøÇﾜ.top + (ꄏᘇøÇﾜ.height / 2);
            }
            if (labelBg) {ꑗȖऎሓሐऌᐊᐗÒÊ = ꄏᘇøÇﾜ.width + ((Ң㠆üµaØpíSÕ / 3) * 2);ÉÂJ㦔ᔌᐏᔊïüNQÒA = ꄏᘇøÇﾜ.height + ((Ң㠆üµaØpíSÕ / 3) * 2);
            }
            varउÑAJT㨯đԉᐕᔂ = [];
            if (ÝkÌÁÛÜñ.slope > 90 && ÝkÌÁÛÜñ.slope <= 180 && labelOrientation !== "Slope") {ᘃyþꑜ = ÝkÌÁÛÜñ.slope - 180;
            } else if (ÝkÌÁÛÜñ.slope > 180 && ÝkÌÁÛÜñ.slope <= 270) {
                if (ÝkÌÁÛÜñ.slope === 270 && labelOrientation !== "Slope") {ᘃyþꑜ = ÝkÌÁÛÜñ.slope + 90;
                } else if (labelOrientation !== "Slope") {ᘃyþꑜ = ÝkÌÁÛÜñ.slope + 180;
                } else {ᘃyþꑜ = ÝkÌÁÛÜñ.slope;
                    if (ÝkÌÁÛÜñ.slope === 270) {ꄏᘇøÇﾜ.left = (ꄏᘇøÇﾜ.left - (ꄏᘇøÇﾜ.width / 2)) + (Ң㠆üµaØpíSÕ / 2.5)
                    }
                }
            } else if (ÝkÌÁÛÜñ.slope > 270 && ÝkÌÁÛÜñ.slope < 360 || ÝkÌÁÛÜñ.slope > 270 && ÝkÌÁÛÜñ.slope === 0) {ᘃyþꑜ = ÝkÌÁÛÜñ.slope - 0;
            } else {
                if (ÝkÌÁÛÜñ.slope === 90 && labelOrientation !== "Slope") {ᘃyþꑜ = ÝkÌÁÛÜñ.slope - 90;
                } else {ᘃyþꑜ = ÝkÌÁÛÜñ.slope - 0;
                    if (ÝkÌÁÛÜñ.slope === 90) {ꄏᘇøÇﾜ.left = (ꄏᘇøÇﾜ.left + (ꄏᘇøÇﾜ.width / 2)) - (Ң㠆üµaØpíSÕ / 2.5)
                    }
                }
            }
            midPoint = "[" + ÝkÌÁÛÜñ.midPoint.toString() + "]";उÑAJT㨯đԉᐕᔂ = [ꄏᘇøÇﾜ.left + (ꄏᘇøÇﾜ.width / 2), ꄏᘇøÇﾜ.top - (ꄏᘇøÇﾜ.height / 2)];
        } else {
            if (labelOrientation === "Slope") {
                if (position === "left") {ᘃyþꑜ = 90;ꄏᘇøÇﾜ.left = (ꄏᘇøÇﾜ.left + (ꄏᘇøÇﾜ.width / 2)) - (Ң㠆üµaØpíSÕ / 2.5);
                } else if (position === "right") {ᘃyþꑜ = -90;
                } else if (position === "bottom") {ᘃyþꑜ = 180;
                } else {ᘃyþꑜ = 0;
                }
            }
        }
        if (ÝkÌÁÛÜñ.slope === undefined) {
            var Clå㧁ꁳҨȅงÙøéCJ = params.useUnit2 && params.unit2_lineBreak ? (ꄏᘇøÇﾜ.height / 2) - (Ң㠆üµaØpíSÕ / 2) : 0;
            if (position === "left") {ꄏᘇøÇﾜ.top = textY + (ꄏᘇøÇﾜ.height / 2);ꄏᘇøÇﾜ.left = ((textX - ꄏᘇøÇﾜ.width) - ꄍșᐑआԋᐂ쑁) - (Ң㠆üµaØpíSÕ / 2);
                if (labelOrientation === "Slope") {ꄏᘇøÇﾜ.left = ((ꄏᘇøÇﾜ.left + (ꄏᘇøÇﾜ.width / 2)) - (Ң㠆üµaØpíSÕ / 2)) - Clå㧁ꁳҨȅงÙøéCJ;
                    YÐSZJùa㡡㕌 = Math.abs(ꄏᘇøÇﾜ.visibleBounds[1] - ꄏᘇøÇﾜ.visibleBounds[3]) + (Ң㠆üµaØpíSÕ / 2) + ꄍșᐑआԋᐂ쑁;
                } else {
                    YÐSZJùa㡡㕌 = Math.abs(ꄏᘇøÇﾜ.visibleBounds[0] - ꄏᘇøÇﾜ.visibleBounds[2]) + (Ң㠆üµaØpíSÕ / 2) + ꄍșᐑआԋᐂ쑁;
                }
            } else if (position === "right") {ꄏᘇøÇﾜ.top = textY + (ꄏᘇøÇﾜ.height / 2);ꄏᘇøÇﾜ.left = textX + (Ң㠆üµaØpíSÕ / 2);
                if (labelOrientation === "Slope") {ꄏᘇøÇﾜ.left = (ꄏᘇøÇﾜ.left - (ꄏᘇøÇﾜ.width / 2)) + (Ң㠆üµaØpíSÕ / 2) + Clå㧁ꁳҨȅงÙøéCJ;
                    YÐSZJùa㡡㕌 = Math.abs(ꄏᘇøÇﾜ.visibleBounds[1] - ꄏᘇøÇﾜ.visibleBounds[3]) + Ң㠆üµaØpíSÕ + ꄍșᐑआԋᐂ쑁;
                } else {
                    YÐSZJùa㡡㕌 = Math.abs(ꄏᘇøÇﾜ.visibleBounds[0] - ꄏᘇøÇﾜ.visibleBounds[2]) + (Ң㠆üµaØpíSÕ / 2) + ꄍșᐑआԋᐂ쑁;
                }
            } else if (position === "top") {ꄏᘇøÇﾜ.top = textY + ꄏᘇøÇﾜ.height + (Ң㠆üµaØpíSÕ / 5) + ꄍșᐑआԋᐂ쑁;
                YÐSZJùa㡡㕌 = Math.abs(ꄏᘇøÇﾜ.visibleBounds[1] - ꄏᘇøÇﾜ.visibleBounds[3]) + (Ң㠆üµaØpíSÕ / 2) + ꄍșᐑआԋᐂ쑁;
            } else {
                if (position === "bottom") {ꄏᘇøÇﾜ.top = (textY - (Ң㠆üµaØpíSÕ / 2)) - ꄍșᐑआԋᐂ쑁;
                    YÐSZJùa㡡㕌 = Math.abs(ꄏᘇøÇﾜ.visibleBounds[1] - ꄏᘇøÇﾜ.visibleBounds[3]) + (Ң㠆üµaØpíSÕ / 2) + ꄍșᐑआԋᐂ쑁;
                }
            }
            if (displacementList !== undefined) {
                if (displacementList[displacement] !== undefined) {
                    if (YÐSZJùa㡡㕌 > displacementList[displacement]) {
                        displacementList[displacement] = YÐSZJùa㡡㕌;
                    }
                } else {
                    displacementList[displacement] = YÐSZJùa㡡㕌;
                }
            }
            varꐺ왗Ҹpá = 0;
            if (displacement > 0) {
                for (var E = 0; E < displacement; E += 1) {
                    if (position === "left" || position === "bottom") {ꐺ왗Ҹpá += ((0 - displacementList[(displacement - E) - 1]) - Ң㠆üµaØpíSÕ);
                    } else {
                        if (position === "right" || position === "top") {ꐺ왗Ҹpá += displacementList[(displacement - E) - 1] + Ң㠆üµaØpíSÕ;
                        }
                    }
                }
            }
            if (position === "left" || position === "right") {ꄏᘇøÇﾜ.left += ꐺ왗Ҹpá;
            } else {
                if (position === "top" || position === "bottom") {ꄏᘇøÇﾜ.top += ꐺ왗Ҹpá;
                }
            }
        }
        varÃAÍæPsvꄓꄏélã = app.activeDocument.activeLayer.groupItems.add();
        varêꁿҔǸᔈܔऒᔊऍjÖ = function() {
            varĈSHÄqü㨜ѽǰ = app.activeDocument;
            try {
                if (!params.onObjectLayer) {ĈSHÄqü㨜ѽǰ.activeLayer = ĈSHÄqü㨜ѽǰ.layers[layerName];
                } else {ĈSHÄqü㨜ѽǰ.activeLayer = app.activeDocument.activeLayer;
                }
            } catch (err) {
                varÁñUÎ욙ꁁ = ĈSHÄqü㨜ѽǰ.activeLayer.groupItems.add();
                for (var p = ĈSHÄqü㨜ѽǰ.layers[0].pageItems.length - 1; p > 0; p--) {ĈSHÄqü㨜ѽǰ.layers[0].pageItems[p].move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);
                }
            }
            var nᘘᘘฉđ = app.activeDocument.activeLayer.pathItems.add();

            function drawDimensionParts(Ĉฐê, filled, closed, name, dashed) {
                if (displacement > 0) {Ĉฐê.path = offsetPointLevel(Ĉฐê, ꐺ왗Ҹpá, position)
                }
                var Oõô㨰ᘃÚ = app.activeDocument.activeLayer.pathItems.add();
                Oõô㨰ᘃÚ.filled = filled;
                Oõô㨰ᘃÚ.stroked = !filled;
                Oõô㨰ᘃÚ.strokeDashes = dashed ? [lineWidth * 3] : lineDashed;
                if (filled) {
                    Oõô㨰ᘃÚ.fillColor = lineColor;
                } else {
                    Oõô㨰ᘃÚ.strokeColor = lineColor;
                }
                Oõô㨰ᘃÚ.strokeWidth = lineWidth;
                Oõô㨰ᘃÚ.setEntirePath(Ĉฐê.path);
                Oõô㨰ᘃÚ.closed = closed;
                Oõô㨰ᘃÚ.name = name;
                Oõô㨰ᘃÚ.move(ÃAÍæPsvꄓꄏélã, ElementPlacement.INSIDE);
            }
            try {
                if (drawline.base.display) {
                    if (displacement > 0) {
                        drawline.base.path = offsetPointLevel(drawline.base, ꐺ왗Ҹpá, position)
                    }
                    nᘘᘘฉđ.filled = false;
                    nᘘᘘฉđ.stroked = true;
                    nᘘᘘฉđ.strokeDashes = [];
                    nᘘᘘฉđ.strokeColor = lineColor;
                    nᘘᘘฉđ.strokeWidth = lineWidth;
                    nᘘᘘฉđ.strokeDashes = lineDashed;
                    nᘘᘘฉđ.setEntirePath(drawline.base.path);
                    if (drawline.base.curveHandles) {
                        nᘘᘘฉđ.pathPoints[drawline.base.displace[0]].rightDirection = drawline.base.curveHandles.startPointRH;
                        nᘘᘘฉđ.pathPoints[drawline.base.displace[1]].leftDirection = drawline.base.curveHandles.endPointLH;
                    }
                    if (drawline.base.arrow) {
                        varҾ神ꄖ㘌ต㢌ꁜꁫ = [nᘘᘘฉđ];
                        add_arrow(Ҿ神ꄖ㘌ต㢌ꁜꁫ, ÃAÍæPsvꄓꄏélã, params.lineArrowSize);
                    }
                    if (midPoint !== undefined) {
                        nᘘᘘฉđ.name = "base|" + ÝkÌÁÛÜñ.pathData + midPoint;
                    } else {
                        nᘘᘘฉđ.name = "base|" + ÝkÌÁÛÜñ.pathData;
                    }
                    nᘘᘘฉđ.move(ÃAÍæPsvꄓꄏélã, ElementPlacement.INSIDE);
                }
                nᘘᘘฉđ = null;
                if (drawline.ds.parts.length > 0) {
                    for (var㜂 = 0;㜂 < drawline.ds.parts.length;㜂 += 1) {
                        if (drawline.ds.parts[㜂] !== false) {
                            drawDimensionParts(drawline.ds.parts[㜂], drawline.ds.parts[㜂].filled, drawline.ds.parts[㜂].closed, drawline.ds.parts[㜂].name, drawline.ds.dashed);
                            drawDimensionParts(drawline.de.parts[㜂], drawline.de.parts[㜂].filled, drawline.de.parts[㜂].closed, drawline.de.parts[㜂].name, drawline.de.dashed);
                        }
                    }
                }ĈSHÄqü㨜ѽǰ = null;
            } catch (newE) {

            }
            return nᘘᘘฉđ;
        };
        varꂇ㠊ܐÞâáòï = newêꁿҔǸᔈܔऒᔊऍjÖ ();
        if (labelBg) {
            varᘐćԋPwzLãÏ㦓 = ꄏᘇøÇﾜ.top;
            varҔȐꁞꄒ㘌Ӏҟ = ꄏᘇøÇﾜ.left;
            if (ÝkÌÁÛÜñ.slope === undefined) {홈왋왗㜀उȈถᔙᔒ = params.useUnit2 && params.unit2_lineBreak ? Ң㠆üµaØpíSÕ / 4 : Ң㠆üµaØpíSÕ / 4;
                if (position === "top") {ꄏᘇøÇﾜ.top += 홈왋왗㜀उȈถᔙᔒ + (Ң㠆üµaØpíSÕ / 3);ᘐćԋPwzLãÏ㦓 = ꄏᘇøÇﾜ.top + ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꄏᘇøÇﾜ.height) / 2);ҔȐꁞꄒ㘌Ӏҟ = ꄏᘇøÇﾜ.left - ((ꑗȖऎሓሐऌᐊᐗÒÊ - ꄏᘇøÇﾜ.width) / 2);
                } else if (position === "bottom") {ꄏᘇøÇﾜ.top -= 홈왋왗㜀उȈถᔙᔒ;ᘐćԋPwzLãÏ㦓 = ꄏᘇøÇﾜ.top + ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꄏᘇøÇﾜ.height) / 2);ҔȐꁞꄒ㘌Ӏҟ = ꄏᘇøÇﾜ.left - ((ꑗȖऎሓሐऌᐊᐗÒÊ - ꄏᘇøÇﾜ.width) / 2);
                } else if (position === "left") {홈왋왗㜀उȈถᔙᔒ = Ң㠆üµaØpíSÕ / 4;ꄏᘇøÇﾜ.left -= 홈왋왗㜀उȈถᔙᔒ;ҔȐꁞꄒ㘌Ӏҟ = ꄏᘇøÇﾜ.left - ((ꑗȖऎሓሐऌᐊᐗÒÊ - ꄏᘇøÇﾜ.width) / 2);ᘐćԋPwzLãÏ㦓 += ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꄏᘇøÇﾜ.height) / 1.5);
                } else {홈왋왗㜀उȈถᔙᔒ = Ң㠆üµaØpíSÕ / 4;ꄏᘇøÇﾜ.left += 홈왋왗㜀उȈถᔙᔒ;ҔȐꁞꄒ㘌Ӏҟ = ꄏᘇøÇﾜ.left - ((ꑗȖऎሓሐऌᐊᐗÒÊ - ꄏᘇøÇﾜ.width) / 2);ᘐćԋPwzLãÏ㦓 += ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꄏᘇøÇﾜ.height) / 1.5);
                }
                if (ꑗȖऎሓሐऌᐊᐗÒÊ < ÉÂJ㦔ᔌᐏᔊïüNQÒA) {
                    if (position === "left") {ҔȐꁞꄒ㘌Ӏҟ -= (ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꑗȖऎሓሐऌᐊᐗÒÊ);ꄏᘇøÇﾜ.left -= ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꑗȖऎሓሐऌᐊᐗÒÊ) / 2);
                    } else if (position === "right") {ꄏᘇøÇﾜ.left += ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꑗȖऎሓሐऌᐊᐗÒÊ) / 2);
                    } else {ҔȐꁞꄒ㘌Ӏҟ -= ((ÉÂJ㦔ᔌᐏᔊïüNQÒA - ꑗȖऎሓሐऌᐊᐗÒÊ) / 2);
                    }ᘐćԋPwzLãÏ㦓 += (Ң㠆üµaØpíSÕ / 5);ꑗȖऎሓሐऌᐊᐗÒÊ = ÉÂJ㦔ᔌᐏᔊïüNQÒA;
                }
            } else {ҔȐꁞꄒ㘌Ӏҟ = उÑAJT㨯đԉᐕᔂ [0] - (ꑗȖऎሓሐऌᐊᐗÒÊ / 2);ᘐćԋPwzLãÏ㦓 = उÑAJT㨯đԉᐕᔂ [1] + (ÉÂJ㦔ᔌᐏᔊïüNQÒA / 2);
            }
            var jdt㡫ȇµµPvMvdÓõ = params.useUnit2 && params.unit2_lineBreak ? ÉÂJ㦔ᔌᐏᔊïüNQÒA / 4 : ÉÂJ㦔ᔌᐏᔊïüNQÒA / 2;
            varǻӆꄌÛªbä = app.activeDocument.pathItems.roundedRectangle(ᘐćԋPwzLãÏ㦓, ҔȐꁞꄒ㘌Ӏҟ, ꑗȖऎሓሐऌᐊᐗÒÊ, ÉÂJ㦔ᔌᐏᔊïüNQÒA, jdt㡫ȇµµPvMvdÓõ, jdt㡫ȇµµPvMvdÓõ);ǻӆꄌÛªbä.filled = true;ǻӆꄌÛªbä.stroked = false;ǻӆꄌÛªbä.fillColor = labelBgTextColor;ǻӆꄌÛªbä.name = "lbg";
        }
        if (ÝkÌÁÛÜñ.slope !== undefined) {홈왋왗㜀उȈถᔙᔒ = params.useUnit2 && params.unit2_lineBreak ? Ң㠆üµaØpíSÕ * 1.5 : Ң㠆üµaØpíSÕ / 2;
            if (!labelBg) {
                if ((ÝkÌÁÛÜñ.slope + 90) === 180 || (ÝkÌÁÛÜñ.slope + 90) === 360) {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.width / 2) + 홈왋왗㜀उȈถᔙᔒ);
                } else if (ÝkÌÁÛÜñ.slope === 0 || ÝkÌÁÛÜñ.slope === 180) {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.height / 2) + (Ң㠆üµaØpíSÕ / 2));
                } else if (ÝkÌÁÛÜñ.slope > 180 && ÝkÌÁÛÜñ.slope <= 270) {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.height / 2) + (Ң㠆üµaØpíSÕ / 1.7));
                } else {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.height / 2) + (Ң㠆üµaØpíSÕ / 5));
                }
            } else {
                if ((ÝkÌÁÛÜñ.slope + 90) === 180 || (ÝkÌÁÛÜñ.slope + 90) === 360) {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.width / 2) + ((Ң㠆üµaØpíSÕ / 3) * 2));ӈ㠅cúK = translatePoint([ǻӆꄌÛªbä.left, ǻӆꄌÛªbä.top], ÝkÌÁÛÜñ.slope + 90, (ǻӆꄌÛªbä.width / 2) + (Ң㠆üµaØpíSÕ / 3));
                } else if ((ÝkÌÁÛÜñ.slope + 90) === 90) {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.height / 2) + (Ң㠆üµaØpíSÕ / 1.2));ӈ㠅cúK = translatePoint([ǻӆꄌÛªbä.left, ǻӆꄌÛªbä.top], ÝkÌÁÛÜñ.slope + 90, (ǻӆꄌÛªbä.height / 2) + (Ң㠆üµaØpíSÕ / 1.8));
                } else {ÍÔÒ㜗 = translatePoint([ꄏᘇøÇﾜ.left, ꄏᘇøÇﾜ.top], ÝkÌÁÛÜñ.slope + 90, (ꄏᘇøÇﾜ.height / 2) + ((Ң㠆üµaØpíSÕ / 3) * 2));ӈ㠅cúK = translatePoint([ǻӆꄌÛªbä.left, ǻӆꄌÛªbä.top], ÝkÌÁÛÜñ.slope + 90, (ǻӆꄌÛªbä.height / 2) + (Ң㠆üµaØpíSÕ / 3));
                }ǻӆꄌÛªbä.left = ӈ㠅cúK[0];ǻӆꄌÛªbä.top = ӈ㠅cúK[1];
                try {ǻӆꄌÛªbä.rotate(ᘃyþꑜ);
                } catch (È) {
                    alert(È);
                }
            }ꄏᘇøÇﾜ.left = ÍÔÒ㜗 [0];ꄏᘇøÇﾜ.top = ÍÔÒ㜗 [1];ꄏᘇøÇﾜ.rotate(ᘃyþꑜ);
        } else {
            try {ǻӆꄌÛªbä.rotate(ᘃyþꑜ);
            } catch (È) {

            }ꄏᘇøÇﾜ.rotate(ᘃyþꑜ);
        }
        if (labelBg) {ǻӆꄌÛªbä.move(ÃAÍæPsvꄓꄏélã, ElementPlacement.INSIDE)
        }ꄏᘇøÇﾜ.move(ÃAÍæPsvꄓꄏélã, ElementPlacement.INSIDE);ÃAÍæPsvꄓꄏélã.zOrder(ZOrderMethod.SENDTOBACK);ꂇ㠊ܐÞâáòï = êꁿҔǸᔈܔऒᔊऍjÖ = null;
        $.gc();ÃAÍæPsvꄓꄏélã.name = ÝkÌÁÛÜñ.slope === undefined ? "D=" + content : "S=" + content;
    } catch (eeee) {

    }
    if (isFraction || params.isFraction2) {
        drawFraction(ꄏᘇøÇﾜ, unit, font_size, position || ÝkÌÁÛÜñ.slope, labelOrientation);
    }
    smallerUnit(ꄏᘇøÇﾜ, unit, font_size, params.useUnit2 ? unit2 : null, params.spaceB4Unit);
    if (params.useColor2) {
        for (varªZ = Ê욎㖢ꄊᘏșiÿ + 1;ªZ < ꄏᘇøÇﾜ.contents.length;ªZ++) {ꄏᘇøÇﾜ.textRange.characters[ªZ].fillColor = color2;
        }
    }
    varฐऄIÃꂁĀ = ÝkÌÁÛÜñ.slope !== undefined ? true : false;ÝkÌÁÛÜñ = ꂇ㠊ܐÞâáòï = null;êꁿҔǸᔈܔऒᔊऍjÖ = null;
    varǫàynÏ = displacementList !== undefined ? displacementList[displacement] : null;
    displacementList = null;
    if (ฐऄIÃꂁĀ) {
        returnÃAÍæPsvꄓꄏélã.visibleBounds;
    } else {
        returnǫàynÏ;
    }
};

function draw_Measurement(lines, 홈㠆갌㘂Ү갊ċr, param, specType) {
    try {
        var갇㜊㜙ꄌꄓ = function() {
            var U㜊ฑऐᔍᘖ = app.activeDocument;
            var layerName = param.display.layerName;
            if (!param.display.onObjectLayer) {
                try {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.layers[layerName];
                } catch (err) {
                    try {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.layers.add();ᐙउãÅlpïሙᘙ.name = layerName;
                    } catch (err) {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.activeLayer;
                    }
                }
            } else {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.activeLayer;
            }ᐙउãÅlpïሙᘙ.visible = true;ᐙउãÅlpïሙᘙ.locked = false;
            U㜊ฑऐᔍᘖ.activeLayer = ᐙउãÅlpïሙᘙ;ᐙउãÅlpïሙᘙ = null;
        };
        var DßÊ왊㥲ґđᔈĄखሕᔅb = app.activeDocument.selection;
        app.executeMenuCommand("deselectall");
        varĄċᘇถÄöFÀã = 갇㜊㜙ꄌꄓ ();ĄċᘇถÄöFÀã = 갇㜊㜙ꄌꄓ = null;
        varनሓᐅ㡠ꉣ㜃 = 홈㠆갌㘂Ү갊ċr.roundCornerList;
        varǩकฃᐋč = 홈㠆갌㘂Ү갊ċr.segmentList;
        var J㦚욘 = 홈㠆갌㘂Ү갊ċr.anglesList;
        varԏᘃ㘓 = 홈㠆갌㘂Ү갊ċr.areaList;
        var selectionBounds = 홈㠆갌㘂Ү갊ċr.selectionBounds;
        var unit = param.display.unit;
        var unit2 = param.display.unit2;
        var isFraction = param.display.isFraction;
        unit = renderFeetUnit(unit, isFraction, param.display.display_unit);
        unit2 = renderFeetUnit(unit2, param.display.isFraction2, param.display.display_unit2);
        var labelOrientation = param.display.labelOrientation;
        var decimal = Number(param.display.decimal);
        varखฏฉᘍÒjíन = param.display.scale.split("=", 2);
        var DधǴ㜎갌áRÓ = param.display.scale2.split("=", 2);
        var scale = 1;
        var needRoundAgain = false;
        if (खฏฉᘍÒjíन.length === 1) {

        } else {
            unit = trimEnds(खฏฉᘍÒjíन [0]);
        }
        if (DधǴ㜎갌áRÓ.length > 1) {
            unit2 = trimEnds(DधǴ㜎갌áRÓ [0]);
        }
        var fonts = param.display.fontStyle || null;
        var font_size = Number(param.display.font_size);
        var color = param.display.color;
        var lineExtendDist = Number(param.display.lineExtendDist);
        var lineWidth = param.display.lineWidth;
        var lineDashed = param.display.lineDashed;
        var lineColor = param.display.lineColor;
        var labelBg = param.display.labelBg;
        var labelBgTextColor = param.display.labelBgTextColor;
        var labelBgTextSwatch = param.display.labelBgTextSwatch;
        var swatch = param.display.swatch;
        var lineSwatch = param.display.lineSwatch;
        var eaCÔꁶＪ힘간ᔅÓ = [];
        varꐴ욕㕅㕆ӉsIfoe = [];
        varᔁÈBïÅÅµøtqꁸᐂᐅ = false;
        varÍâýõȗฌȓሑVytD = नሓᐅ㡠ꉣ㜃 !== null ? lines.length + नሓᐅ㡠ꉣ㜃.length : lines.length;ÍâýõȗฌȓሑVytD = J㦚욘 !== null ? ÍâýõȗฌȓሑVytD + J㦚욘.length : ÍâýõȗฌȓሑVytD;ÍâýõȗฌȓሑVytD = ԏᘃ㘓 !== null ? ÍâýõȗฌȓሑVytD + ԏᘃ㘓.length : ÍâýõȗฌȓሑVytD;
        if (ÍâýõȗฌȓሑVytD > 9) {ᔁÈBïÅÅµøtqꁸᐂᐅ = true;
            var value = 0;
            varซธ = new Window("palette{text:'Rendering dimension',bounds:[100,100,580,140],progress:Progressbar{bounds:[20,10,460,30] , minvalue:0,value:" + value + "},bottomGroup: Group{cancelButton: Button { text: 'Cancel', properties:{name:'cancel'}, size: [120,24], alignment:['right', 'center'] }}};");ซธ.progress.maxvalue = ÍâýõȗฌȓሑVytD;ซธ.center();ซธ.show();
        }
        varชऑF욐ꁀ㜎㘁ȐČᘅԍ = [0, 0, 0, 0];
        varÀ㣮㘄㘓ҟҽ㜎Ąd = [];
        if (param.display.showSegment) {À㣮㘄㘓ҟҽ㜎Ąd = [selectionBounds[0], selectionBounds[1], selectionBounds[2], selectionBounds[3]];

            function aaddSegmentsBounds(㘑čᐑUO) {
                if (À㣮㘄㘓ҟҽ㜎Ąd.length > 0) {
                    if (㘑čᐑUO[0] < (À㣮㘄㘓ҟҽ㜎Ąd[0] - lineWidth)) {À㣮㘄㘓ҟҽ㜎Ąd[0] = 㘑čᐑUO[0]
                    }
                    if (㘑čᐑUO[1] > (À㣮㘄㘓ҟҽ㜎Ąd[1] + lineWidth)) {À㣮㘄㘓ҟҽ㜎Ąd[1] = 㘑čᐑUO[1]
                    }
                    if (㘑čᐑUO[2] > (À㣮㘄㘓ҟҽ㜎Ąd[2] + lineWidth)) {À㣮㘄㘓ҟҽ㜎Ąd[2] = 㘑čᐑUO[2]
                    }
                    if (㘑čᐑUO[3] < (À㣮㘄㘓ҟҽ㜎Ąd[3] - lineWidth)) {À㣮㘄㘓ҟҽ㜎Ąd[3] = 㘑čᐑUO[3]
                    }
                } else {À㣮㘄㘓ҟҽ㜎Ąd = [㘑čᐑUO[0], 㘑čᐑUO[1], 㘑čᐑUO[2], 㘑čᐑUO[3]];
                }
            }
            if (ǩकฃᐋč.length > 0) {
                for (var㜑 = 0;㜑 < ǩकฃᐋč.length;㜑 += 1) {
                    if (ǩकฃᐋč [㜑] !== null) {
                        linePoint = ǩकฃᐋč [㜑].line;
                        displacement = 0;
                        content = param.display.isFraction ? ǩकฃᐋč [㜑].fractions + unit : ǩकฃᐋč [㜑].value + unit;
                        content2 = param.display.isFraction2 ? ǩकฃᐋč [㜑].fractions2 + unit2 : ǩकฃᐋč [㜑].value2 + unit2;
                        content = param.display.isFraction ? ǩकฃᐋč [㜑].fractions + getAddSpace(unit, param.display.spaceB4Unit) + unit : ǩकฃᐋč [㜑].value + getAddSpace(unit, param.display.spaceB4Unit) + unit;
                        if (param.display.useUnit2) {
                            content2 = param.display.isFraction2 ? ǩकฃᐋč [㜑].fractions2 + getAddSpace(unit2, param.display.spaceB4Unit) + unit2 : ǩकฃᐋč [㜑].value2 + getAddSpace(unit2, param.display.spaceB4Unit) + unit2;
                        }
                        position = null;
                        textX = ǩकฃᐋč [㜑].label[0];
                        textY = ǩकฃᐋč [㜑].label[1];
                        midPoint = ǩकฃᐋč [㜑].midPoint;ÝkÌÁÛÜñ = {
                            pathData: ǩकฃᐋč [㜑].pathData,
                            linePoint: linePoint,
                            drawline: ǩकฃᐋč [㜑].drawline,
                            displacement: displacement,
                            textX: textX,
                            textY: textY,
                            slope: Math.round(ǩकฃᐋč [㜑].slope),
                            midPoint: midPoint,
                            content: content,
                            content2: content2,
                            isFraction: param.display.isFraction,
                            unit: unit,
                            unit2: unit2,
                            fonts: fonts,
                            font_size: font_size,
                            position: position,
                            color: color,
                            swatch: swatch,
                            lineSwatch: lineSwatch,
                            lineExtendDist: lineExtendDist,
                            lineWidth: lineWidth,
                            lineDashed: lineDashed,
                            lineColor: lineColor,
                            labelBg: labelBg,
                            labelBgTextColor: labelBgTextColor,
                            labelBgTextSwatch: labelBgTextSwatch,
                            labelOrientation: labelOrientation,
                            specType: specType,
                            layerName: param.display.layerName,
                            params: param.display
                        };
                        varǳSxYTögÖjZ = ðÑÞnÕÚp㯄ǻᐌt(ÝkÌÁÛÜñ);
                        aaddSegmentsBounds(ǳSxYTögÖjZ);
                    }
                }
            }
            for (varÃwÜ in ชऑF욐ꁀ㜎㘁ȐČᘅԍ) {
                if (À㣮㘄㘓ҟҽ㜎Ąd[ÃwÜ] === selectionBounds[ÃwÜ]) {ชऑF욐ꁀ㜎㘁ȐČᘅԍ [ÃwÜ] = 0;
                } else {ชऑF욐ꁀ㜎㘁ȐČᘅԍ [ÃwÜ] = Math.abs(À㣮㘄㘓ҟҽ㜎Ąd[ÃwÜ] - selectionBounds[ÃwÜ]) - (lineExtendDist / 2);
                }
            }
        }

        function extraSegOffset() {
            varýJüÀYÍ㠇㜗ö = 0;
            if (param.display.lineEndOffet !== "self") {
                if (position === "left") {
                    if (ชऑF욐ꁀ㜎㘁ȐČᘅԍ [0] > 0) {ýJüÀYÍ㠇㜗ö -= ชऑF욐ꁀ㜎㘁ȐČᘅԍ [0]
                    }
                } else if (position === "top") {
                    if (ชऑF욐ꁀ㜎㘁ȐČᘅԍ [1] > 0) {ýJüÀYÍ㠇㜗ö += ชऑF욐ꁀ㜎㘁ȐČᘅԍ [1]
                    }
                } else if (position === "right") {
                    if (ชऑF욐ꁀ㜎㘁ȐČᘅԍ [2] > 0) {ýJüÀYÍ㠇㜗ö += ชऑF욐ꁀ㜎㘁ȐČᘅԍ [2]
                    }
                } else {
                    if (ชऑF욐ꁀ㜎㘁ȐČᘅԍ [3] > 0) {ýJüÀYÍ㠇㜗ö -= ชऑF욐ꁀ㜎㘁ȐČᘅԍ [3]
                    }
                }
            }
            returnýJüÀYÍ㠇㜗ö;
        }
        for (var p = lines.length - 1; p >= 0; p--) {
            if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {ซธ.progress.value++;ซธ.update();
            }

            function addExtraOffset(yâ, position) {
                varÍÔÒ㜗 = yâ;
                if (position === "left") {ÍÔÒ㜗 [0] -= ชऑF욐ꁀ㜎㘁ȐČᘅԍ [0];
                } else if (position === "top") {ÍÔÒ㜗 [1] += ชऑF욐ꁀ㜎㘁ȐČᘅԍ [1];
                } else if (position === "right") {ÍÔÒ㜗 [0] += ชऑF욐ꁀ㜎㘁ȐČᘅԍ [2];
                } else {ÍÔÒ㜗 [1] -= ชऑF욐ꁀ㜎㘁ȐČᘅԍ [3];
                }
                returnÍÔÒ㜗;
            }
            position = lines[p].position;
            linePoint = [];
            if (À㣮㘄㘓ҟҽ㜎Ąd.length > 0) {
                if (lines[p].drawline.base.path.length > 0) {
                    lines[p].drawline.base.path = offsetPointLevel(lines[p].drawline.base, extraSegOffset(), position);
                }
                if (lines[p].drawline.ds.parts !== undefined && lines[p].drawline.ds.parts.length > 0) {
                    for (varÄǶ = 0;ÄǶ < lines[p].drawline.ds.parts.length;ÄǶ += 1) {
                        if (lines[p].drawline.ds.parts[ÄǶ] !== null) {
                            lines[p].drawline.ds.parts[ÄǶ].path = offsetPointLevel(lines[p].drawline.ds.parts[ÄǶ], extraSegOffset(), position);
                            lines[p].drawline.de.parts[ÄǶ].path = offsetPointLevel(lines[p].drawline.de.parts[ÄǶ], extraSegOffset(), position);
                        }
                    }
                }
            }
            displacement = lines[p].displacement;
            content = param.display.isFraction ? lines[p].fractions + getAddSpace(unit, param.display.spaceB4Unit) + unit : lines[p].value + getAddSpace(unit, param.display.spaceB4Unit) + unit;
            if (param.display.useUnit2) {
                content2 = param.display.isFraction2 ? lines[p].fractions2 + getAddSpace(unit2, param.display.spaceB4Unit) + unit2 : lines[p].value2 + getAddSpace(unit2, param.display.spaceB4Unit) + unit2;
            }
            varýµÆ㠉神Ҏl = lines[p].label;
            if (À㣮㘄㘓ҟҽ㜎Ąd.length > 0) {
                varԃᔁykȃȑȍᔇȆआ = offsetTextLevel(lines[p].label, extraSegOffset(), position);
                textX = ԃᔁykȃȑȍᔇȆआ [0];
                textY = ԃᔁykȃȑȍᔇȆआ [1];
            } else {
                textX = ýµÆ㠉神Ҏl[0];
                textY = ýµÆ㠉神Ҏl[1];
            }ÝkÌÁÛÜñ = {
                pathData: lines[p].pathData,
                linePoint: linePoint,
                drawline: lines[p].drawline,
                displacement: displacement,
                textX: textX,
                textY: textY,
                content: content,
                content2: content2,
                isFraction: param.display.isFraction,
                unit: unit,
                unit2: unit2,
                fonts: fonts,
                font_size: font_size,
                position: position,
                color: color,
                lineExtendDist: lineExtendDist,
                lineWidth: lineWidth,
                lineDashed: lineDashed,
                lineColor: lineColor,
                swatch: swatch,
                lineSwatch: lineSwatch,
                labelBg: labelBg,
                labelBgTextColor: labelBgTextColor,
                labelBgTextSwatch: labelBgTextSwatch,
                labelOrientation: labelOrientation,
                specType: specType,
                layerName: param.display.layerName,
                params: param.display
            };
            if (position === "left" || position === "right") {ÝkÌÁÛÜñ.displacementList = eaCÔꁶＪ힘간ᔅÓ;
                eaCÔꁶＪ힘간ᔅÓ [displacement] = ðÑÞnÕÚp㯄ǻᐌt(ÝkÌÁÛÜñ);
            } else {ÝkÌÁÛÜñ.displacementList = ꐴ욕㕅㕆ӉsIfoe;ꐴ욕㕅㕆ӉsIfoe[displacement] = ðÑÞnÕÚp㯄ǻᐌt(ÝkÌÁÛÜñ);
            }ÝkÌÁÛÜñ = null;
        }
        if (J㦚욘 !== null) {
            for (varҹ = 0;ҹ < J㦚욘.length;ҹ += 1) {
                if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {ซธ.progress.value++;ซธ.update();
                }
                if (J㦚욘 [ҹ] !== null) {
                    varᐄǨᘎฎᐏ = {
                        pathData: J㦚욘 [ҹ].pathData,
                        angle: J㦚욘 [ҹ].angle,
                        startAngle: J㦚욘 [ҹ].startAngle,
                        endAngle: J㦚욘 [ҹ].endAngle,
                        clockwise: J㦚욘 [ҹ].clockwise,
                        text: J㦚욘 [ҹ].text,
                        fractionText: J㦚욘 [ҹ].fractions,
                        joint: J㦚욘 [ҹ].joint,
                        radius: param.display.lineExtendDist,
                        textPos: J㦚욘 [ҹ].textPos,
                        labelBg: param.display.labelBg,
                        labelBgTextColor: param.display.labelBgTextColor,
                        labelBgTextSwatch: param.display.labelBgTextSwatch,
                        isFraction: param.display.isFraction,
                        fonts: fonts,
                        font_size: font_size,
                        color: color,
                        lineWidth: lineWidth,
                        lineDashed: lineDashed,
                        lineColor: lineColor,
                        swatch: swatch,
                        lineSwatch: lineSwatch,
                        decimal: decimal,
                        specType: specType,
                        layerName: param.display.layerName,
                        params: param.display
                    };
                    jiӄธᔖᔍᐏÕ (ᐄǨᘎฎᐏ);
                }
            }
        }
        if (ԏᘃ㘓 !== null) {
            for (var Zs = 0; Zs < ԏᘃ㘓.length; Zs += 1) {
                if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {ซธ.progress.value++;ซธ.update();
                }
                if (ԏᘃ㘓 [Zs] !== null) {
                    varȕȄMመᔉ = {
                        data: ԏᘃ㘓 [Zs],
                        unit: unit || param.display.unit,
                        unit2: unit2 || param.display.unit2,
                        labelBg: param.display.labelBg,
                        labelBgTextColor: param.display.labelBgTextColor,
                        labelBgTextSwatch: param.display.labelBgTextSwatch,
                        isFraction: param.display.isFraction,
                        fonts: fonts,
                        font_size: font_size,
                        color: color,
                        lineWidth: lineWidth,
                        lineDashed: lineDashed,
                        lineColor: lineColor,
                        swatch: swatch,
                        lineSwatch: lineSwatch,
                        decimal: decimal,
                        specType: specType,
                        layerName: param.display.layerName,
                        params: param.display
                    };
                    draw_area(ȕȄMመᔉ);
                }
            }
        }
        if (नሓᐅ㡠ꉣ㜃 [0] !== null) {
            for (varÝl in नሓᐅ㡠ꉣ㜃) {
                if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {ซธ.progress.value++;ซธ.update();
                }
                if (नሓᐅ㡠ꉣ㜃 [Ýl] !== null) {
                    varý㥹ܓᘊĆd = {
                        pathData: नሓᐅ㡠ꉣ㜃 [Ýl][0].pathData,
                        corners: नሓᐅ㡠ꉣ㜃 [Ýl],
                        unit: unit,
                        unit2: unit2,
                        isFraction: param.display.isFraction,
                        fonts: fonts,
                        font_size: font_size,
                        color: color,
                        lineWidth: lineWidth,
                        lineDashed: lineDashed,
                        lineColor: lineColor,
                        swatch: swatch,
                        lineSwatch: lineSwatch,
                        radius: param.display.lineExtendDist,
                        scale: scale,
                        decimal: decimal,
                        needRoundAgain: needRoundAgain,
                        specType: specType,
                        layerName: param.display.layerName,
                        params: param.display
                    };ᘍþSÉwð욎㨴힘ꁵȘ (ý㥹ܓᘊĆd);
                }
            }
        }
        if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {ซธ.close();
        }ðÑÞnÕÚp㯄ǻᐌt = null;
        for (varᔎᐁ in DßÊ왊㥲ґđᔈĄखሕᔅb) {
            DßÊ왊㥲ґđᔈĄखሕᔅb[ᔎᐁ].selected = true;
        }
        $.gc();
        return "done";
    } catch (err) {
        return err;
    }
}
var jiӄธᔖᔍᐏÕ = function(ᐄǨᘎฎᐏ) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    var pathData = ᐄǨᘎฎᐏ.pathData;
    var angle = ᐄǨᘎฎᐏ.angle;
    var startAngle = ᐄǨᘎฎᐏ.startAngle;
    var endAngle = ᐄǨᘎฎᐏ.endAngle;
    var clockwise = ᐄǨᘎฎᐏ.clockwise;
    var joint = ᐄǨᘎฎᐏ.joint;
    var text = ᐄǨᘎฎᐏ.text;
    var fractionText = ᐄǨᘎฎᐏ.fractionText;
    var textPos = ᐄǨᘎฎᐏ.textPos;
    var radius = ᐄǨᘎฎᐏ.radius;
    var fonts = ᐄǨᘎฎᐏ.fonts;
    var labelBg = ᐄǨᘎฎᐏ.labelBg;
    var labelBgTextColor = ᐄǨᘎฎᐏ.labelBgTextColor;
    var labelBgTextSwatch = ᐄǨᘎฎᐏ.labelBgTextSwatch;
    var isFraction = ᐄǨᘎฎᐏ.isFraction;
    var font_size = ᐄǨᘎฎᐏ.font_size;
    var color = ᐄǨᘎฎᐏ.color;
    var lineWidth = ᐄǨᘎฎᐏ.lineWidth;
    var lineDashed = ᐄǨᘎฎᐏ.lineDashed;
    var lineColor = ᐄǨᘎฎᐏ.lineColor;
    var decimal = ᐄǨᘎฎᐏ.decimal;
    var scale = ᐄǨᘎฎᐏ.scale;
    var swatch = ᐄǨᘎฎᐏ.swatch;
    var lineSwatch = ᐄǨᘎฎᐏ.lineSwatch;
    var layerName = ᐄǨᘎฎᐏ.layerName;
    var params = ᐄǨᘎฎᐏ.params;
    color = color_JS_to_AI(color, swatch);
    lineColor = color_JS_to_AI(lineColor, lineSwatch);
    labelBgTextColor = color_JS_to_AI(labelBgTextColor, labelBgTextSwatch);
    try {
        if (!params.onObjectLayer) {
            U㜊ฑऐᔍᘖ.activeLayer = U㜊ฑऐᔍᘖ.layers[layerName];
        }
    } catch (err) {
        varÁñUÎ욙ꁁ = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();
        for (var p = U㜊ฑऐᔍᘖ.layers[0].pageItems.length - 1; p > 0; p--) {
            U㜊ฑऐᔍᘖ.layers[0].pageItems[p].move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);
        }
    }
    varÛUt神éî = draw_arc(U㜊ฑऐᔍᘖ.activeLayer, lineColor, lineWidth, lineDashed, joint, angle, radius, startAngle, endAngle, clockwise);
    for (var㜖 = 0;㜖 < textFonts.length;㜖 += 1) {
        if (textFonts[㜖].name.match(/helvetica/i) || textFonts[㜖].name.match(/arial/i) && !textFonts[㜖].name.match(/italic/i) && !textFonts[㜖].name.match(/bold/i) && !textFonts[㜖].name.match(/ultralight/i) && !textFonts[㜖].name.match(/Oblique/i)) {
            if (textFonts[㜖].name.match(/light/i)) {ÙOòÓǨÒbú = textFonts[㜖];
            } else {
                if (textFonts[㜖].name.match(/regular/i) || textFonts[㜖].name.match(/medium/i) || textFonts[㜖].name.match(/mt/i)) {
                    nÔҮ㠉ꄏ㜐 = textFonts[㜖];
                }
            }
        }
    }
    if (angle !== 90) {
        varꄏᘇøÇﾜ = U㜊ฑऐᔍᘖ.activeLayer.textFrames.add();
        var content = isFraction ? fractionText : text;ꄏᘇøÇﾜ.textRange.characterAttributes.size = font_size;ꄏᘇøÇﾜ.textRange.characterAttributes.fillColor = color;
        try {ꄏᘇøÇﾜ.textRange.characterAttributes.textFont = textFonts.getByName(fonts) || ÙOòÓǨÒbú || nÔҮ㠉ꄏ㜐;
        } catch (È) {

        }ꄏᘇøÇﾜ.contents = content;ꄏᘇøÇﾜ.left = textPos[0];ꄏᘇøÇﾜ.top = textPos[1];
        varĈ왏㜙ढᔋฆ = textPos[2];
        if (Ĉ왏㜙ढᔋฆ < -45 && Ĉ왏㜙ढᔋฆ > -135) {ꄏᘇøÇﾜ.top += (ꄏᘇøÇﾜ.height / 2);ꄏᘇøÇﾜ.left += (ꄏᘇøÇﾜ.width * 0.05);
        } else if (Ĉ왏㜙ढᔋฆ > 45 && Ĉ왏㜙ढᔋฆ < 135) {ꄏᘇøÇﾜ.top += (ꄏᘇøÇﾜ.height / 2);ꄏᘇøÇﾜ.left -= (ꄏᘇøÇﾜ.width * 1);
        } else if (Ĉ왏㜙ढᔋฆ >= 0 && Ĉ왏㜙ढᔋฆ < 45 || Ĉ왏㜙ढᔋฆ <= 0 && Ĉ왏㜙ढᔋฆ > -45) {ꄏᘇøÇﾜ.left -= (ꄏᘇøÇﾜ.width / 2);ꄏᘇøÇﾜ.top += ꄏᘇøÇﾜ.height;
        } else if (Ĉ왏㜙ढᔋฆ === -45) {ꄏᘇøÇﾜ.top += ꄏᘇøÇﾜ.height;ꄏᘇøÇﾜ.left += (ꄏᘇøÇﾜ.width * 0.05);
        } else if (Ĉ왏㜙ढᔋฆ === -135) {ꄏᘇøÇﾜ.left += (ꄏᘇøÇﾜ.width * 0.05);
        } else if (Ĉ왏㜙ढᔋฆ === 135) {ꄏᘇøÇﾜ.left -= ꄏᘇøÇﾜ.width;
        } else if (Ĉ왏㜙ढᔋฆ === 45) {ꄏᘇøÇﾜ.top += ꄏᘇøÇﾜ.height;ꄏᘇøÇﾜ.left -= ꄏᘇøÇﾜ.width;
        } else {ꄏᘇøÇﾜ.left -= (ꄏᘇøÇﾜ.width / 2);
        }
        if (isFraction) {ꄏᘇøÇﾜ.contents += String.fromCharCode(176);
            var unit = String.fromCharCode(176);
            drawFraction(ꄏᘇøÇﾜ, unit, font_size, null, null);
        }
    }
    varฌᔏᘑªÆţघ = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();ฌᔏᘑªÆţघ.name = "angle=" + content + "|" + pathData;ÛUt神éî.move(ฌᔏᘑªÆţघ, ElementPlacement.INSIDE);
    if (ꄏᘇøÇﾜ) {ꄏᘇøÇﾜ.move(ฌᔏᘑªÆţघ, ElementPlacement.INSIDE)
    }
};
varᘍþSÉwð욎㨴힘ꁵȘ = function(ý㥹ܓᘊĆd) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    var corners = ý㥹ܓᘊĆd.corners;
    var unit = ý㥹ܓᘊĆd.unit;
    var unit2 = ý㥹ܓᘊĆd.unit2;
    var fonts = ý㥹ܓᘊĆd.fonts;
    var isFraction = ý㥹ܓᘊĆd.isFraction;
    var font_size = ý㥹ܓᘊĆd.font_size;
    var color = ý㥹ܓᘊĆd.color;
    var lineWidth = ý㥹ܓᘊĆd.lineWidth;
    var lineDashed = ý㥹ܓᘊĆd.lineDashed;
    var lineColor = ý㥹ܓᘊĆd.lineColor;
    var decimal = ý㥹ܓᘊĆd.decimal;
    var scale = ý㥹ܓᘊĆd.scale;
    var needRoundAgain = ý㥹ܓᘊĆd.needRoundAgain;
    var specType = ý㥹ܓᘊĆd.specType;
    var swatch = ý㥹ܓᘊĆd.swatch;
    var lineSwatch = ý㥹ܓᘊĆd.lineSwatch;
    var layerName = ý㥹ܓᘊĆd.layerName;
    var params = ý㥹ܓᘊĆd.params;
    color = color_JS_to_AI(color, swatch);
    lineColor = color_JS_to_AI(lineColor, lineSwatch);
    color2 = params.useColor2 && color_JS_to_AI(params.color2, params.swatch2);
    for (var XçÈ in corners) {
        try {
            U㜊ฑऐᔍᘖ.activeLayer = U㜊ฑऐᔍᘖ.layers[layerName];
        } catch (err) {
            varÁñUÎ욙ꁁ = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();
            for (var p = U㜊ฑऐᔍᘖ.layers[0].pageItems.length - 1; p > 0; p--) {
                U㜊ฑऐᔍᘖ.layers[0].pageItems[p].move(ÁñUÎ욙ꁁ, ElementPlacement.INSIDE);
            }
        }
        varǹaÄ = corners[XçÈ].textPosition[0];
        var DüRn = corners[XçÈ].textPosition[1];
        var㜙ǳ㜇ҡǶ = U㜊ฑऐᔍᘖ.activeLayer.pathItems.ellipse(corners[XçÈ].circleCenter[1] + corners[XçÈ].roundCornerRadius, corners[XçÈ].circleCenter[0] - corners[XçÈ].roundCornerRadius, corners[XçÈ].roundCornerRadius * 2, corners[XçÈ].roundCornerRadius * 2);㜙ǳ㜇ҡǶ.filled = false;㜙ǳ㜇ҡǶ.stroked = true;㜙ǳ㜇ҡǶ.strokeDashes = [1];㜙ǳ㜇ҡǶ.strokeColor = lineColor;㜙ǳ㜇ҡǶ.strokeWidth = lineWidth / 2;㜙ǳ㜇ҡǶ.opacity = 40;
        varꁬ욖Ӈdíz = U㜊ฑऐᔍᘖ.activeLayer.pathItems.add();ꁬ욖Ӈdíz.filled = false;ꁬ욖Ӈdíz.stroked = true;ꁬ욖Ӈdíz.strokeDashes = lineDashed;ꁬ욖Ӈdíz.strokeColor = lineColor;ꁬ욖Ӈdíz.strokeWidth = lineWidth;ꁬ욖Ӈdíz.name = "base|" + ý㥹ܓᘊĆd.pathData;ꁬ욖Ӈdíz.setEntirePath([corners[XçÈ].circleCenter, corners[XçÈ].radiusDrawPoints]);
        for (var㜖 = 0;㜖 < textFonts.length;㜖 += 1) {
            if (textFonts[㜖].name.match(/helvetica/i) || textFonts[㜖].name.match(/arial/i) && !textFonts[㜖].name.match(/italic/i) && !textFonts[㜖].name.match(/bold/i) && !textFonts[㜖].name.match(/ultralight/i) && !textFonts[㜖].name.match(/Oblique/i)) {
                if (textFonts[㜖].name.match(/light/i)) {ÙOòÓǨÒbú = textFonts[㜖];
                } else {
                    if (textFonts[㜖].name.match(/regular/i) || textFonts[㜖].name.match(/medium/i) || textFonts[㜖].name.match(/mt/i)) {
                        nÔҮ㠉ꄏ㜐 = textFonts[㜖];
                    }
                }
            }
        }
        varꄏᘇøÇﾜ = U㜊ฑऐᔍᘖ.activeLayer.textFrames.add();
        var content = isFraction ? corners[XçÈ].fractions + getAddSpace(unit, params.spaceB4Unit) + unit : corners[XçÈ].value + getAddSpace(unit, params.spaceB4Unit) + unit;
        var content2 = "";
        if (params.useUnit2) {
            content2 = params.isFraction2 ? corners[XçÈ].fractions2 + getAddSpace(unit2, params.spaceB4Unit) + unit2 : corners[XçÈ].value2 + getAddSpace(unit2, params.spaceB4Unit) + unit2;
        }
        content = "r= " + content;
        varÊ욎㖢ꄊᘏșiÿ = content.length;ꄏᘇøÇﾜ.contents = params.useUnit2 ? content + render2ndUNit(content2, params.unit2Separator, params) : content;ꄏᘇøÇﾜ.top = DüRn;ꄏᘇøÇﾜ.left = ǹaÄ;ꄏᘇøÇﾜ.textRange.characterAttributes.size = font_size;ꄏᘇøÇﾜ.textRange.characterAttributes.fillColor = color;
        try {ꄏᘇøÇﾜ.textRange.characterAttributes.textFont = textFonts.getByName(fonts) || ÙOòÓǨÒbú || nÔҮ㠉ꄏ㜐;
        } catch (È) {

        }
        if (isFraction || params.isFraction2) {
            drawFraction(ꄏᘇøÇﾜ, unit, font_size, null, null);
        }ꄏᘇøÇﾜ.textRange.characters[0].characterAttributes.size = font_size * 0.75;ꄏᘇøÇﾜ.textRange.characters[1].characterAttributes.size = font_size * 0.75;
        smallerUnit(ꄏᘇøÇﾜ, unit, font_size, params.useUnit2 ? unit2 : null, params.spaceB4Unit);
        if (params.useColor2) {
            for (varܓē = Ê욎㖢ꄊᘏșiÿ + 1;ܓē < ꄏᘇøÇﾜ.contents.length;ܓē++) {ꄏᘇøÇﾜ.textRange.characters[ܓē].fillColor = color2;
            }
        }
        if (corners[XçÈ].radiusDrawPoints[1] > corners[XçÈ].circleCenter[1]) {ꄏᘇøÇﾜ.left = corners[XçÈ].textPosition[0];ꄏᘇøÇﾜ.top = corners[XçÈ].textPosition[1] + (ꄏᘇøÇﾜ.height * 0.4);
        } else {ꄏᘇøÇﾜ.left = corners[XçÈ].textPosition[0];ꄏᘇøÇﾜ.top = corners[XçÈ].textPosition[1] + (ꄏᘇøÇﾜ.height * 0.8);
        }
        var쑹ꁟ㭸ᘘìk = U㜊ฑऐᔍᘖ.activeLayer.groupItems.add();쑹ꁟ㭸ᘘìk.name = "R=" + content;㜙ǳ㜇ҡǶ.move(쑹ꁟ㭸ᘘìk, ElementPlacement.INSIDE);ꁬ욖Ӈdíz.move(쑹ꁟ㭸ᘘìk, ElementPlacement.INSIDE);ꄏᘇøÇﾜ.move(쑹ꁟ㭸ᘘìk, ElementPlacement.INSIDE);
    }
};

function jsx_gen_simple_measure(ҊzIaÌटǦ) {
    var왛왃Ƿӂ㘒ईअᐎᘍðZ = app.activeDocument.defaultStrokeWidth;
    var param = JSON.parse(ҊzIaÌटǦ [0]);
    param.display.font_size = getFontSizeFromUnit(param.display.font_size, param.display.fontUnit);
    param.display.lineExtendDist = getFontSizeFromUnit(param.display.lineExtendDist, param.display.lineExtendDistUnit);
    var specType = JSON.parse(ҊzIaÌटǦ [1]);
    var㭹㙇ǵҗ㘕áµ = app.activeDocument.selection;
    varܐሙԄएᐓᔏ = param.display.visualBound;
    var㜆㜂Ðqsҗ㘏 = function() {
        var U㜊ฑऐᔍᘖ = app.activeDocument;
        var layerName = param.display.layerName;
        if (!param.display.onObjectLayer) {
            try {ᐙउãÅlpïሙᘙ = app.activeDocument.layers[layerName];
            } catch (err) {
                try {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.layers.add();ᐙउãÅlpïሙᘙ.name = layerName;
                } catch (err) {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.activeLayer;
                }
            }
        } else {ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ.activeLayer;
        }ᐙउãÅlpïሙᘙ.visible = true;ᐙउãÅlpïሙᘙ.locked = false;
        U㜊ฑऐᔍᘖ.activeLayer = ᐙउãÅlpïሙᘙ;
        try {
            if (!param.display.onObjectLayer) {
                U㜊ฑऐᔍᘖ.activeLayer = U㜊ฑऐᔍᘖ.layers[layerName];
            }
        } catch (err) {
            if (U㜊ฑऐᔍᘖ.layers[0].pageItems[0].typename === "GroupItem") {
                app.executeMenuCommand("ungroup");㭹㙇ǵҗ㘕áµ = U㜊ฑऐᔍᘖ.selection;
            }
        }ᐙउãÅlpïሙᘙ = U㜊ฑऐᔍᘖ = null;
    };
    varऌ욓 = new㜆㜂Ðqsҗ㘏 ();㜆㜂Ðqsҗ㘏 = null;ऌ욓 = null;
    var cRâh㘖ѾᔍᔗvÔi = function() {
        if (㭹㙇ǵҗ㘕áµ.textSelection !== undefined) {
            if (specType === "DIMENSION") {㠅神Ǻሏ왆ǹ = {
                    errorMessage: "Calculate dimension of selected text is not supported!"
                };
                return㠅神Ǻሏ왆ǹ;
            } else {㠅神Ǻሏ왆ǹ = wrapSelectedText(㭹㙇ǵҗ㘕áµ, ܐሙԄएᐓᔏ, specType);㠅神Ǻሏ왆ǹ.param = param;
                return㠅神Ǻሏ왆ǹ;
            }
        } else {
            if (specType === "DIMENSION" && !param.draw.top && !param.draw.bottom && !param.draw.left && !param.draw.right && !param.display.showRoundCorner && !param.display.showSegment && !param.display.anglesCCW && !param.display.anglesCW) {㠅神Ǻሏ왆ǹ = {
                    errorMessage: "Please select which side(s) you want to specify dimension!"
                };
                return㠅神Ǻሏ왆ǹ;
            } else {
                var breakDownMode = param.display.breakDownMode !== undefined ? param.display.breakDownMode : false;
                var relatedToArtboard = param.display.relatedToArtboard;
                var showArea = param.display.showArea;
                var showRoundCorner = param.display.showRoundCorner;
                var showSegment = param.display.showSegment;
                var anglesCCW = param.display.anglesCCW;
                var anglesCW = param.display.anglesCW;㠅神Ǻሏ왆ǹ = wrapSelected(㭹㙇ǵҗ㘕áµ, ܐሙԄएᐓᔏ, specType, breakDownMode, relatedToArtboard, showRoundCorner, showArea, showSegment, anglesCCW, anglesCW);㠅神Ǻሏ왆ǹ.param = param;
                breakDownMode = relatedToArtboard = showRoundCorner = null;
                return㠅神Ǻሏ왆ǹ;
            }
        }
    };
    if (㭹㙇ǵҗ㘕áµ.length > 0 || param.display.relatedToArtboard) {ÉòàᾰｿȋᐋÓØãÚ = cRâh㘖ѾᔍᔗvÔi();㠅神Ǻሏ왆ǹ = null;
    } else {ÉòàᾰｿȋᐋÓØãÚ = {
            errorMessage: "Please select something"
        };
    }
    param = specType = 㭹㙇ǵҗ㘕áµ = cRâh㘖ѾᔍᔗvÔi = null;
    $.gc();
    return JSON.stringify(ÉòàᾰｿȋᐋÓØãÚ);
}

function round(value, sÝùzqSPv) {
    return Number(Math.round(value + "e" + sÝùzqSPv) + "e-" + sÝùzqSPv);
}

function trimEnds(x) {
    return x.replace(/^\s+|\s+$/gm, "");
}

function speceesReview() {
    return "MC5YS3drQWhFQUFFY0Y0dDRo.77-977-9a--_vUPvv71y77-977-9GRPvv71GAe-_vVET77-977-9U2h5Vgc5NH5x77-9Hu-_vT8";
}

function getSelectedSwatch() {
    try {
        var홊㥮㮎ᘅóOÂÐÁ = app.activeDocument.swatches.getSelected()[0];
        varídÎÐìÃÌüeEü = getColorObj(홊㥮㮎ᘅóOÂÐÁ.color, true);
        return JSON.stringify({
            name: 홊㥮㮎ᘅóOÂÐÁ.name,
            color: ídÎÐìÃÌüeEü
        });
    } catch (err) {
        return "error";
    }
}

function getAllFonts() {
    varܓïìõËwEȖᔙऋ = [];
    for (varҴ = 0;Ҵ < textFonts.length;Ҵ += 1) {
        varȔᔗéὗ㦏 = {
            family: textFonts[Ҵ].family,
            style: textFonts[Ҵ].style,
            name: textFonts[Ҵ].name
        };ܓïìõËwEȖᔙऋ.push(Ȕᔗéὗ㦏);
    }
    if (ܓïìõËwEȖᔙऋ.length > 0) {
        return JSON.stringify(ܓïìõËwEȖᔙऋ);
    } else {
        returnܓïìõËwEȖᔙऋ;
    }
}

function hex_to_RGB(ꉟ갇M홊) {
    varҩǯvall = new RGBColor();ҩǯvall.red = parseInt(cutHex(ꉟ갇M홊).substring(0, 2), 16);ҩǯvall.green = parseInt(cutHex(ꉟ갇M홊).substring(2, 4), 16);ҩǯvall.blue = parseInt(cutHex(ꉟ갇M홊).substring(4, 6), 16);
    returnҩǯvall;
}

function color_JS_to_AI(color, swatch) {
    if (!swatch) {
        return hex_to_RGB(color);
    } else {
        try {
            varô㭶ǵǧᔘ = app.activeDocument.swatches.getByName(swatch.name);
            returnô㭶ǵǧᔘ.color;
        } catch (err) {
            try {
                var㨛ढ㘑ȏ = swatch.color.type === "SpotColor" ? createColorObjfromData(swatch.color.color) : createColorObjfromData(swatch.color);
                varĄÀÞÞ㨴 = app.activeDocument.spots.add();ĄÀÞÞ㨴.name = swatch.name;ĄÀÞÞ㨴.color = 㨛ढ㘑ȏ;ĄÀÞÞ㨴.colorType = swatch.color.colorType === "ColorModel.SPOT" ? ColorModel.SPOT : ColorModel.PROCESS;
                varҹ㜖㜃Ș욕Ť = new SpotColor();ҹ㜖㜃Ș욕Ť.spot = ĄÀÞÞ㨴;
                returnҹ㜖㜃Ș욕Ť;
            } catch (err) {
                alert(err);
            }
        }
    }
}

function rgb2cmyk(ñ, Ñ, b) {
    var rlÞťᔀइñ = 0;
    varòXbyóïÍlQ = 0;
    varऌĉĔᐏöҬ = 0;
    varᐙøÌZçï흵 = 0;
    varñ = parseInt("" + ñ.replace(/\s/g, ""), 10);
    varÑ = parseInt("" + Ñ.replace(/\s/g, ""), 10);
    var b = parseInt("" + b.replace(/\s/g, ""), 10);
    if (ñ == null || Ñ == null || b == null || isNaN(ñ) || isNaN(Ñ) || isNaN(b)) {
        alert("Please enter numeric RGB values!");
        return;
    }
    if (ñ < 0 || Ñ < 0 || b < 0 || ñ > 255 || Ñ > 255 || b > 255) {
        alert("RGB values must be in the range 0 to 255.");
        return;
    }
    if (ñ == 0 && Ñ == 0 && b == 0) {ᐙøÌZçï흵 = 1;
        return [0, 0, 0, 1];
    }
    rlÞťᔀइñ = 1 - (ñ / 255);òXbyóïÍlQ = 1 - (Ñ / 255);ऌĉĔᐏöҬ = 1 - (b / 255);
    varö왂ĖÖ = Math.min(rlÞťᔀइñ, Math.min(òXbyóïÍlQ, ऌĉĔᐏöҬ));
    rlÞťᔀइñ = (rlÞťᔀइñ - ö왂ĖÖ) / (1 - ö왂ĖÖ);òXbyóïÍlQ = (òXbyóïÍlQ - ö왂ĖÖ) / (1 - ö왂ĖÖ);ऌĉĔᐏöҬ = (ऌĉĔᐏöҬ - ö왂ĖÖ) / (1 - ö왂ĖÖ);ᐙøÌZçï흵 = ö왂ĖÖ;
    return [rlÞťᔀइñ, òXbyóïÍlQ, ऌĉĔᐏöҬ, ᐙøÌZçï흵];
}

function cutHex(º) {
    returnº.charAt(0) === "#" ? º.substring(1, 7) : º;
}

function calGroupBounds(ณ욕, ܐሙԄएᐓᔏ) {
    var갋㖣왅왗Ｐ = [];
    for (var p = 0; p < ณ욕.pageItems.length; p += 1) {
        if (ณ욕.pageItems[p].clipped === true) {ĄᔂԂԅy갇 = ณ욕.pageItems[p].pathItems[0];
            if (ܐሙԄएᐓᔏ === false) {㦲㥹갃ऒȍÄ = ĄᔂԂԅy갇.geometricBounds;
            } else {㦲㥹갃ऒȍÄ = ĄᔂԂԅy갇.visibleBounds;
            }
        } else if (ณ욕.pageItems[p].typename === "GroupItem") {㦲㥹갃ऒȍÄ = calGroupBounds(ณ욕.pageItems[p], ܐሙԄएᐓᔏ);
        } else {ĄᔂԂԅy갇 = ณ욕.pageItems[p];
            if (ܐሙԄएᐓᔏ === false) {㦲㥹갃ऒȍÄ = ĄᔂԂԅy갇.geometricBounds;
            } else {㦲㥹갃ऒȍÄ = ĄᔂԂԅy갇.visibleBounds;
            }
        }
        if (p > 0) {
            if (㦲㥹갃ऒȍÄ [0] < 갋㖣왅왗Ｐ [0]) {갋㖣왅왗Ｐ [0] = 㦲㥹갃ऒȍÄ [0]
            }
            if (㦲㥹갃ऒȍÄ [1] > 갋㖣왅왗Ｐ [1]) {갋㖣왅왗Ｐ [1] = 㦲㥹갃ऒȍÄ [1]
            }
            if (㦲㥹갃ऒȍÄ [2] > 갋㖣왅왗Ｐ [2]) {갋㖣왅왗Ｐ [2] = 㦲㥹갃ऒȍÄ [2]
            }
            if (㦲㥹갃ऒȍÄ [3] < 갋㖣왅왗Ｐ [3]) {갋㖣왅왗Ｐ [3] = 㦲㥹갃ऒȍÄ [3]
            }
        } else {갋㖣왅왗Ｐ [0] = 㦲㥹갃ऒȍÄ [0];갋㖣왅왗Ｐ [1] = 㦲㥹갃ऒȍÄ [1];갋㖣왅왗Ｐ [2] = 㦲㥹갃ऒȍÄ [2];갋㖣왅왗Ｐ [3] = 㦲㥹갃ऒȍÄ [3];
        }
    }
    return갋㖣왅왗Ｐ;
}

function createTempSwatch(color, uè각आऋù) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    if (color.typename === "SpotColor") {욍㜔ꄉË㦒 = color.spot.name
    }
    if (color.typename === "GradientColor") {욍㜔ꄉË㦒 = color.gradient.name
    }
    if (color.typename === "PatternColor") {욍㜔ꄉË㦒 = color.pattern.name
    }
    varनBWÚØ엯ꁞ㜎 = {};
    try {
        var tempSwatch = U㜊ฑऐᔍᘖ.swatches.getByName(욍㜔ꄉË㦒);नBWÚØ엯ꁞ㜎 = {
            name: 욍㜔ꄉË㦒,
            type: "user"
        };
    } catch (È) {
        if (color.typename !== "NoColor" && uè각आऋù) {नBWÚØ엯ꁞ㜎 = {
                name: "noTempSwatch",
                type: "temp"
            };
        } else {नBWÚØ엯ꁞ㜎 = {
                name: null,
                type: "empty"
            };
        }
    }
    returnनBWÚØ엯ꁞ㜎;
}

function createColorObjfromData(color) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    switch (color.type) {
        case "RGBColor":
            㨛ढ㘑ȏ = new RGBColor();㨛ढ㘑ȏ.red = color.red;㨛ढ㘑ȏ.green = color.green;㨛ढ㘑ȏ.blue = color.blue;
            break;
        case "CMYKColor":
            㨛ढ㘑ȏ = new CMYKColor();㨛ढ㘑ȏ.cyan = color.cyan;㨛ढ㘑ȏ.magenta = color.magenta;㨛ढ㘑ȏ.yellow = color.yellow;㨛ढ㘑ȏ.black = color.black;
            break;
        case "GrayColor":
            㨛ढ㘑ȏ = new GrayColor();㨛ढ㘑ȏ.gray = color.gray;
            break;
        case "LabColor":
            㨛ढ㘑ȏ = new LabColor();㨛ढ㘑ȏ.a = color.a;㨛ढ㘑ȏ.b = color.b;㨛ढ㘑ȏ.l = color.l;
            break;
        case "SpotColor":
            㨛ढ㘑ȏ = U㜊ฑऐᔍᘖ.swatches.getByName(color.tempSwatch.name).color;㨛ढ㘑ȏ.tint = color.tint;
            break;
        case "GradientColor":
            varÑûꐲ㖤㜑ܒԅ = U㜊ฑऐᔍᘖ.gradients.add();
            varคฌᘇEÏᔙ = "G" + Date.now() + Math.floor(Math.random() * 10000);Ñûꐲ㖤㜑ܒԅ.name = คฌᘇEÏᔙ;Ñûꐲ㖤㜑ܒԅ.type = color.gradientType === "GradientType.LINEAR" ? GradientType.LINEAR:
                GradientType.RADIAL;
                varꉉçöuøßVUfWÃïÈÜꂃ = color.gradientStops.length - 2;
                for (var ZÁ = 0; ZÁ < ꉉçöuøßVUfWÃïÈÜꂃ; ZÁ += 1) {Ñûꐲ㖤㜑ܒԅ.gradientStops.add();
                }
                for (var갆 = 0;갆 < color.gradientStops.length;갆 += 1) {Ñûꐲ㖤㜑ܒԅ.gradientStops[갆].color = createColorObjfromData(color.gradientStops[갆].color);Ñûꐲ㖤㜑ܒԅ.gradientStops[갆].midPoint = color.gradientStops[갆].midPoint;Ñûꐲ㖤㜑ܒԅ.gradientStops[갆].opacity = color.gradientStops[갆].opacity;Ñûꐲ㖤㜑ܒԅ.gradientStops[갆].rampPoint = color.gradientStops[갆].rampPoint;
                }㨛ढ㘑ȏ = new GradientColor();㨛ढ㘑ȏ.gradient = Ñûꐲ㖤㜑ܒԅ;㨛ढ㘑ȏ.angle = color.angle;㨛ढ㘑ȏ.origin = color.origin;
                var tempSwatch = U㜊ฑऐᔍᘖ.swatches.getByName(คฌᘇEÏᔙ);
                var múȐܐaÆÝD = new GrayColor();
                múȐܐaÆÝD.gray = 50;
                tempSwatch.color = múȐܐaÆÝD;
                tempSwatch.remove();
                break;
            default:
                㨛ढ㘑ȏ = new GrayColor();㨛ढ㘑ȏ.gray = 100;
    }
    return㨛ढ㘑ȏ;
}

function getColorObj(color, uè각आऋù) {
    var tempSwatch = createTempSwatch(color, uè각आऋù);
    if (color.typename === "RGBColor") {㮗ïËJꂜ = {
            type: "RGBColor",
            red: color.red,
            green: color.green,
            blue: color.blue,
            tempSwatch: tempSwatch
        };
    } else if (color.typename === "CMYKColor") {㮗ïËJꂜ = {
            type: "CMYKColor",
            cyan: color.cyan,
            magenta: color.magenta,
            yellow: color.yellow,
            black: color.black,
            tempSwatch: tempSwatch,
            rgb: app.convertSampleColor(ImageColorSpace.CMYK, [color.cyan, color.magenta, color.yellow, color.black], ImageColorSpace.RGB, ColorConvertPurpose.defaultpurpose)
        };
    } else if (color.typename === "GrayColor") {㮗ïËJꂜ = {
            type: "GrayColor",
            gray: color.gray,
            tempSwatch: tempSwatch,
            rgb: app.convertSampleColor(ImageColorSpace.CMYK, [0, 0, 0, color.gray], ImageColorSpace.RGB, ColorConvertPurpose.defaultpurpose)
        };
    } else if (color.typename === "SpotColor") {
        try {㮗ïËJꂜ = {
                type: "SpotColor",
                name: color.spot.name,
                tint: color.tint,
                color: getColorObj(color.spot.color, true),
                colorType: color.spot.colorType.toString(),
                tempSwatch: tempSwatch
            };
        } catch (err) {
            alert(err);
        }
    } else if (color.typename === "LabColor") {㮗ïËJꂜ = {
            type: "LabColor",
            a: color.a,
            b: color.b,
            l: color.l,
            tempSwatch: tempSwatch
        };
    } else if (color.typename === "NoColor") {㮗ïËJꂜ = {
            type: "NoColor",
            tempSwatch: null
        };
    } else if (color.typename === "PatternColor") {㮗ïËJꂜ = {
            type: "PatternColor",
            name: color.pattern.name,
            tempSwatch: tempSwatch
        };
    } else {
        if (color.typename === "GradientColor") {
            var gradientStops = [];
            for (var A = 0; A < color.gradient.gradientStops.length; A += 1) {
                gradientStops[A] = {
                    color: getColorObj(color.gradient.gradientStops[A].color, false),
                    midPoint: color.gradient.gradientStops[A].midPoint,
                    opacity: color.gradient.gradientStops[A].opacity,
                    rampPoint: color.gradient.gradientStops[A].rampPoint
                };
            }㮗ïËJꂜ = {
                type: "GradientColor",
                gradientType: color.gradient.type.toString(),
                angle: color.angle,
                hiliteAngle: color.hiliteAngle,
                hiliteLength: color.hiliteLength,
                length: color.length,
                origin: color.origin,
                gradientStops: gradientStops,
                name: color.gradient.name,
                tempSwatch: tempSwatch
            };
        }
    }
    return㮗ïËJꂜ;
}

function getShapeStyle(ณ욕, ꁡMjeôÐ왝) {
    var fillColor = null;
    var strokeColor = null;
    var fontFamily = null;
    var fontStyle = null;
    var fontSize = 0;
    var leading = null;
    varᐙऒĔᔎĉKꂀ쑻ᘘ = 0;
    varऒᘆEkᘍखĆᘅ = 0;
    varÁҭꄏᘊकìK = ณ욕.filled;
    varꄗӆ㜄JMÉTI = ณ욕.stroked;
    var imagePath = "";
    var emptyPath = false;
    if (ณ욕.typename === "PathItem") {
        if (!ณ욕.filled && !ณ욕.stroked && !ꁡMjeôÐ왝) {
            emptyPath = true
        }
    }
    if (ณ욕.typename === "RasterItem") {
        imagePath = "Embeded image";
    } else {
        if (ณ욕.typename === "PlacedItem") {
            imagePath = ณ욕.file + "";
        }
    }
    try {
        if (ณ욕.typename === "TextFrame") {
            fillColor = getColorObj(ณ욕.textRanges[0].characterAttributes.fillColor, true);ÁҭꄏᘊकìK = fillColor.type !== "NoColor" ? true : false;
        } else {
            fillColor = getColorObj(ณ욕.fillColor, ณ욕.filled);ÁҭꄏᘊकìK = ณ욕.filled;
        }
    } catch (È) {
        fillColor = null;
    }
    try {
        if (ณ욕.typename === "TextFrame") {
            strokeColor = getColorObj(ณ욕.textRanges[0].characterAttributes.strokeColor, true);ꄗӆ㜄JMÉTI = strokeColor.type !== "NoColor" ? true : false;
        } else {
            strokeColor = getColorObj(ณ욕.strokeColor, ณ욕.stroked);ꄗӆ㜄JMÉTI = ณ욕.stroked;
        }
    } catch (È) {
        strokeColor = null;
    }
    if (strokeColor !== null && strokeColor.type !== "NoColor") {
        if (ณ욕.typename === "TextFrame") {ᐙऒĔᔎĉKꂀ쑻ᘘ = ณ욕.textRanges[0].characterAttributes.strokeWeight;
        } else {ᐙऒĔᔎĉKꂀ쑻ᘘ = ณ욕.strokeWidth;
        }
    }
    if (ณ욕.typename === "TextFrame") {
        fontFamily = ณ욕.textRanges[0].characterAttributes.textFont.family;
        fontStyle = ณ욕.textRanges[0].characterAttributes.textFont.style;
        fontSize = ณ욕.textRanges[0].characterAttributes.size;
        leading = ณ욕.textRanges[0].characterAttributes.leading;
    }ऒᘆEkᘍखĆᘅ = ณ욕.opacity;
    varꁥꉋꑖ㯃 = {
        fillColor: fillColor,
        filled: ÁҭꄏᘊकìK,
        strokeColor: strokeColor,
        stroked: ꄗӆ㜄JMÉTI,
        storkeWidth: ᐙऒĔᔎĉKꂀ쑻ᘘ,
        opacity: ऒᘆEkᘍखĆᘅ,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        fontSize: fontSize,
        leading: leading,
        imagePath: imagePath,
        emptyPath: emptyPath
    };
    returnꁥꉋꑖ㯃;
}

function makeMockItem(fillColor, opacity, strokeWidth) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    varõUçꉏԌD = U㜊ฑऐᔍᘖ.pathItems.rectangle(0, 0, 10, 10);õUçꉏԌD.stroked = true;õUçꉏԌD.filled = false;õUçꉏԌD.strokeColor = fillColor;õUçꉏԌD.strokeWidth = strokeWidth;õUçꉏԌD.opacity = opacity;
    returnõUçꉏԌD;
}

function getStyle(ณ욕, breakDownMode) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    var errorMessage = "";
    varȌᘑᔓHëÄññ쑂ų = [];
    try {
        if (ณ욕.clipped === true) {ܔซCǭǸ = "clipped";
            errorMessage = "No style specification apply to clip group.";
        } else if (ณ욕.typename === "GroupItem") {ܔซCǭǸ = "groupped";
            errorMessage = "Style specification cannot apply to selection containing group(s). Please use the Direct Selection Tool(A) to select multiple items.";
        } else if (ณ욕.typename === "TextFrame") {ܔซCǭǸ = "TextFrame";ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ณ욕));
        } else {
            if (ณ욕.typename === "PathItem" || ณ욕.typename === "CompoundPathItem") {
                varýꁅꁪझӂ㘍ꄎóÓùÞEv = ณ욕.strokeWidth;
                varêÓªêdꉑ㮌ढ㘘J = 0;
                var y㨮㨝ҥOÆö = true;
                varçCvӅҦअčXk = false;
                varîèå㘀ሐċµPM = ณ욕.opacity;
                var隣ҟᐉe = new NoColor();
                varāฑᐈᘙFpv왚ԍᔍܓ = U㜊ฑऐᔍᘖ.layers[0].visible;
                if (āฑᐈᘙFpv왚ԍᔍܓ === false) {
                    U㜊ฑऐᔍᘖ.layers[0].visible = true;
                }
                varᘉçEUYÉëč = makeMockItem(隣ҟᐉe, îèå㘀ሐċµPM, 0);ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ᘉçEUYÉëč, true));ᘉçEUYÉëč.remove();
                if (āฑᐈᘙFpv왚ԍᔍܓ === false) {
                    U㜊ฑऐᔍᘖ.layers[0].visible = false;
                }
                if (!breakDownMode) {
                    if (ณ욕.typename === "CompoundPathItem") {
                        for (var갃 = 0;갃 < ณ욕.pathItems.length;갃 += 2) {ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ณ욕.pathItems[갃]));
                        }
                    } else {ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ณ욕));
                    }
                } else {
                    if (ณ욕.typename === "CompoundPathItem") {êÓªêdꉑ㮌ढ㘘J = ณ욕.pathItems.length;
                    }
                    if (ณ욕.stroked === true && ณ욕.filled === false && ณ욕.strokeDashes.length > 0) {
                        y㨮㨝ҥOÆö = false;çCvӅҦअčXk = true;
                    }
                    varᔆᔎᘑQmËꉛ㨬ฐउआ = app.activeDocument.selection;
                    U㜊ฑऐᔍᘖ.selection.selected = false;
                    app.executeMenuCommand("deselectall");ܔซCǭǸ = "PathItem";
                    var höèǲĀᐎ = ณ욕.duplicate();
                    höèǲĀᐎ.position = [-10000000, 10000000];
                    höèǲĀᐎ.selected = true;
                    app.executeMenuCommand("expandStyle");
                    if (y㨮㨝ҥOÆö) {
                        app.executeMenuCommand("ungroup");
                    }
                    varᘐꑡ㡠डǬē = U㜊ฑऐᔍᘖ.selection;
                    varӄ㘍ทܔeªM㘁Ҝ = 0;
                    for (varǺ = 0;Ǻ < ᘐꑡ㡠डǬē.length;Ǻ += 1) {
                        if (ᘐꑡ㡠डǬē [Ǻ].typename === "CompoundPathItem" || ᘐꑡ㡠डǬē [Ǻ].typename === "GroupItem") {ӄ㘍ทܔeªM㘁Ҝ++;
                        }
                    }
                    if (ӄ㘍ทܔeªM㘁Ҝ > 1) {ýꁅꁪझӂ㘍ꄎóÓùÞEv = 0;
                    }
                    for (var N = 0; N < ᘐꑡ㡠डǬē.length; N += 1) {
                        if (ᘐꑡ㡠डǬē [N].typename === "CompoundPathItem") {
                            if (ᘐꑡ㡠डǬē [N].pathItems[0].stroked) {

                            } else {
                                if (êÓªêdꉑ㮌ढ㘘J === ᘐꑡ㡠डǬē [N].pathItems.length) {

                                } else {
                                    var fill = ᘐꑡ㡠डǬē [N].pathItems[0].fillColor;
                                    var eùÚÔ = ᘐꑡ㡠डǬē [N].opacity;
                                    var DûqÒGÐlæ = makeMockItem(fill, eùÚÔ, ýꁅꁪझӂ㘍ꄎóÓùÞEv);ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(DûqÒGÐlæ));
                                    DûqÒGÐlæ.remove();
                                }
                            }
                        } else if (ᘐꑡ㡠डǬē [N].typename === "GroupItem") {
                            if (çCvӅҦअčXk) {ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ᘐꑡ㡠डǬē [N].pathItems[0]));
                            } else {
                                try {
                                    varåqLäÿòᘇȒ = ᘐꑡ㡠डǬē [N].compoundPathItems[0].pathItems[0].fillColor;
                                    varङÍÂRȇऍᔉ = ᘐꑡ㡠डǬē [N].opacity;
                                    varǰҨ갉㜃Ƕ = makeMockItem(åqLäÿòᘇȒ, ङÍÂRȇऍᔉ, ýꁅꁪझӂ㘍ꄎóÓùÞEv);ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ǰҨ갉㜃Ƕ));ǰҨ갉㜃Ƕ.remove();
                                } catch (È) {ܔซCǭǸ = "groupped";
                                    errorMessage = "Oops. Some errors occurred when trying Appearance Mode to this object. Probably because of certain effect(s) applied";
                                }
                            }
                        } else {
                            if (ᘐꑡ㡠डǬē [N].typename === "RasterItem") {ܔซCǭǸ = "effects";
                                errorMessage = "Oops. Some errors occurred when trying Appearance Mode to this object. Probably because of certain effect(s) applied";
                            } else {ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ᘐꑡ㡠डǬē [N]));
                            }
                        }ᘐꑡ㡠डǬē [N].remove();
                        for (varᔎᐁ in ᔆᔎᘑQmËꉛ㨬ฐउआ) {ᔆᔎᘑQmËꉛ㨬ฐउआ [ᔎᐁ].selected = true;
                        }
                    }
                }
            } else if (ณ욕.typename === "RasterItem" || ณ욕.typename === "PlacedItem") {ܔซCǭǸ = "Image";ȌᘑᔓHëÄññ쑂ų.push(getShapeStyle(ณ욕));
            } else {
                errorMessage = "Selected object is not supported for style specification";
            }
        }
    } catch (err) {
        alert("shapeStyle!!!: " + err);
    }
    varșᘒUÅOÿҕţ = {
        type: ܔซCǭǸ,
        styleList: ȌᘑᔓHëÄññ쑂ų,
        errorMessage: errorMessage
    };
    returnșᘒUÅOÿҕţ;
}

function getAnchors(ณ욕, éꄗҚǰᘈᔄ) {
    var allPathPoints = [];
    if (!ณ욕.clipped && ณ욕.typename === "PathItem") {ᔂᐍሖèꁽฑᘓ = ณ욕.closed;
        for (varӉ = 0;Ӊ < ณ욕.selectedPathPoints.length;Ӊ += 1) {
            varሗฉCÍǭ㘆 = ณ욕.selectedPathPoints[Ӊ];
            var갇ѿ㠀간ǳ = {
                anchor: ሗฉCÍǭ㘆.anchor,
                leftD: ሗฉCÍǭ㘆.leftDirection,
                rightD: ሗฉCÍǭ㘆.rightDirection,
                selected: ሗฉCÍǭ㘆.selected.toString().slice(19)
            };
            allPathPoints.push(갇ѿ㠀간ǳ);
        }
        return {
            allPathPoints: allPathPoints,
            closed: ᔂᐍሖèꁽฑᘓ
        };
    } else if (éꄗҚǰᘈᔄ === "showSegment" && ณ욕.clipped && ณ욕.pathItems[0].typename === "PathItem") {ᔂᐍሖèꁽฑᘓ = ณ욕.pathItems[0].closed;
        for (varÖҽ = 0;Öҽ < ณ욕.pathItems[0].pathPoints.length;Öҽ += 1) {
            var rkyÅùꉛŧҠई = ณ욕.pathItems[0].pathPoints[Öҽ];
            var㘅ăȀĎจᔖȉĎᐎ = {
                anchor: rkyÅùꉛŧҠई.anchor,
                leftD: rkyÅùꉛŧҠई.leftDirection,
                rightD: rkyÅùꉛŧҠई.rightDirection,
                selected: rkyÅùꉛŧҠई.selected.toString().slice(19)
            };
            allPathPoints.push(㘅ăȀĎจᔖȉĎᐎ);
        }
        return {
            allPathPoints: allPathPoints,
            closed: ᔂᐍሖèꁽฑᘓ
        };
    } else if (!ณ욕.clipped && ณ욕.typename === "CompoundPathItem") {
        return {
            allPathPoints: null,
            closed: false,
            errorMessage: "Use direct selection tool to select path in compound path to show segment length."
        };
    } else if (éꄗҚǰᘈᔄ === "showSegment") {
        return {
            allPathPoints: null,
            closed: false,
            errorMessage: "Item not supported to show segment length."
        };
    } else {
        return null;
    }
}

function draw_arc(ฉÚ쑴각㘅, lineColor, lineWidth, lineDashed, joint, angle, radius, startAngle, endAngle, clockwise) {
    radius = clockwise ? radius * 0.85 : radius;
    var DQ = ฉÚ쑴각㘅.pathItems.add();
    DQ.stroke = true;
    DQ.strokeColor = lineColor;
    DQ.strokeWidth = lineWidth;
    DQ.strokeDashes = lineDashed;
    DQ.filled = false;
    DQ.name = "arc";
    DQ.closed = false;
    if (angle === 90) {
        var gEþñ = radius * Math.cos(0.785398);
        DQ.setEntirePath([
            [joint.x + gEþñ, joint.y],
            [joint.x + gEþñ, joint.y + gEþñ],
            [joint.x, joint.y + gEþñ]
        ]);
    } else {
        varғÚ = DQ.pathPoints.add();ғÚ.anchor = [joint.x + radius, joint.y];ғÚ.rightDirection = [joint.x + radius, joint.y + (((Math.sqrt(2) - 1) / 3) * 4 * radius)];ғÚ.leftDirection = ғÚ.anchor;
        varᔉᘑ = DQ.pathPoints.add();ᔉᘑ.anchor = [joint.x, joint.y + radius];ᔉᘑ.leftDirection = [joint.x + (((Math.sqrt(2) - 1) / 3) * 4 * radius), joint.y + radius];
        if (90 < angle) {ᔉᘑ.rightDirection = [joint.x - (((Math.sqrt(2) - 1) / 3) * 4 * radius), joint.y + radius];
            varåªò = DQ.pathPoints.add();åªò.anchor = [joint.x - radius, joint.y];åªò.leftDirection = [joint.x - radius, joint.y + (((Math.sqrt(2) - 1) / 3) * 4 * radius)];
        }
        if (180 < angle) {åªò.rightDirection = [joint.x - radius, joint.y - (((Math.sqrt(2) - 1) / 3) * 4 * radius)];
            varøZB = DQ.pathPoints.add();øZB.anchor = [joint.x, joint.y - radius];øZB.leftDirection = [joint.x - (((Math.sqrt(2) - 1) / 3) * 4 * radius), joint.y - radius];
        }
        if (270 < angle) {øZB.rightDirection = [joint.x + (((Math.sqrt(2) - 1) / 3) * 4 * radius), joint.y - radius];
            var xज = DQ.pathPoints.add();
            xज.anchor = [joint.x + radius, joint.y];
            xज.leftDirection = [joint.x + radius, joint.y - (((Math.sqrt(2) - 1) / 3) * 4 * radius)];
        }
        if (angle <= 90) {
            if (angle < 90) {
                mvPath(ғÚ, ᔉᘑ, angle / 90)
            }ᔉᘑ.rightDirection = ᔉᘑ.anchor;
        } else if (90 < angle && angle <= 180) {
            if (angle < 180) {
                mvPath(ᔉᘑ, åªò, (angle - 90) / 90)
            }åªò.rightDirection = åªò.anchor;
        } else if (180 < angle && angle <= 270) {
            if (angle < 270) {
                mvPath(åªò, øZB, (angle - 180) / 90)
            }øZB.rightDirection = øZB.anchor;
        } else {
            if (270 < angle && angle < 360) {
                if (angle < 360) {
                    mvPath(øZB, xज, (angle - 270) / 90)
                }
                xज.rightDirection = xज.anchor;
            }
        }
    }
    varČyd왓왋㭸ҍ = clockwise ? endAngle + 90 : startAngle + 90;
    var갆N = getRotationMatrix(Čyd왓왋㭸ҍ);
    varî㜈 = getTranslationMatrix(joint.x, joint.y);
    varØ㜁 = invertMatrix(î㜈);
    var각s = concatenateMatrix(Ø㜁, 갆N);각s = concatenateMatrix(각s, î㜈);
    DQ.transform(각s, 1, 1, 1, 1, 1, Transformation.DOCUMENTORIGIN);
    return DQ;
}

function mvPath(Öñ, ҿ, ÖӆҚ) {
    var Nf = [];
    var vWÛÇ = [];
    Nf[0] = Öñ.anchor;
    Nf[1] = Öñ.rightDirection;
    Nf[2] = ҿ.leftDirection;
    Nf[3] = ҿ.anchor;Öñ.rightDirection = linearSprit(Nf[0], Nf[1], ÖӆҚ);ҿ.anchor = nwAnchor(Nf[0], Nf[1], Nf[2], Nf[3], ÖӆҚ);ҿ.leftDirection = nwDirection(Nf[0], Nf[1], Nf[2], ÖӆҚ);
    return true;
}

function linearSprit(Öñ, ҿ, m) {
    var lꑠᘄ = [];
    for (var p = 0; p < 2; p += 1) {
        lꑠᘄ [p] = (ҿ [p] * m) + (Öñ [p] * (1 - m));
    }
    return lꑠᘄ;
}

function nwDirection(Öñ, ҿ, ꄗ, m) {
    var lꑠᘄ = [];
    for (var p = 0; p < 2; p += 1) {
        lꑠᘄ [p] = (Math.pow(1 - m, 2) * Öñ [p]) + (2 * (1 - m) * m * ҿ [p]) + (m * m * ꄗ [p]);
    }
    return lꑠᘄ;
}

function nwAnchor(Öñ, ҿ, ꄗ, ìX, m) {
    varúãÞò = [];
    for (var p = 0; p < 2; p += 1) {úãÞò [p] = (Math.pow(1 - m, 3) * Öñ [p]) + (3 * Math.pow(1 - m, 2) * m * ҿ [p]) + (3 * Math.pow(m, 2) * (1 - m) * ꄗ [p]) + (Math.pow(m, 3) * ìX[p]);
    }
    returnúãÞò;
}

function wrapSelected(㭹㙇ǵҗ㘕áµ, ܐሙԄएᐓᔏ, specType, breakDownMode, relatedToArtboard, showRoundCorner, showArea, showSegment, anglesCCW, anglesCW) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    varሒԂᐔᘘᔂᔈ = {};
    var selectedBounds = [];
    var allIremProps = [];
    var selectedPathPoints = [];
    varᔁÈBïÅÅµøtqꁸᐂᐅ = false;
    if (㭹㙇ǵҗ㘕áµ.length > 9) {ᔁÈBïÅÅµøtqꁸᐂᐅ = true;
        var value = 0;
        varéooñúÆBJáKvÁ = new Window("palette{text:'Gathering Objects Information',bounds:[100,100,580,140],progress:Progressbar{bounds:[20,10,460,30] , minvalue:0,value:" + value + "}};");éooñúÆBJáKvÁ.progress.maxvalue = 㭹㙇ǵҗ㘕áµ.length;éooñúÆBJáKvÁ.center();éooñúÆBJáKvÁ.show();
    }
    for (var p = 0; p < 㭹㙇ǵҗ㘕áµ.length; p += 1) {
        if (ᔁÈBïÅÅµøtqꁸᐂᐅ) {éooñúÆBJáKvÁ.progress.value++;éooñúÆBJáKvÁ.update();
        }
        if (㭹㙇ǵҗ㘕áµ [p].clipped === true) {
            if (ܐሙԄएᐓᔏ === false || specType !== "DIMENSION") {ұҚӀ = 㭹㙇ǵҗ㘕áµ [p].pathItems[0].geometricBounds;
            } else {ұҚӀ = 㭹㙇ǵҗ㘕áµ [p].pathItems[0].visibleBounds;
            }
        } else if (㭹㙇ǵҗ㘕áµ [p].typename === "GroupItem") {ұҚӀ = calGroupBounds(㭹㙇ǵҗ㘕áµ [p], ܐሙԄएᐓᔏ);
        } else {
            if (ܐሙԄएᐓᔏ === false || specType !== "DIMENSION") {ұҚӀ = 㭹㙇ǵҗ㘕áµ [p].geometricBounds;
            } else {ұҚӀ = 㭹㙇ǵҗ㘕áµ [p].visibleBounds;
            }
        }
        if (p > 0) {
            if (ұҚӀ [0] < selectedBounds[0]) {
                selectedBounds[0] = ұҚӀ [0]
            }
            if (ұҚӀ [1] > selectedBounds[1]) {
                selectedBounds[1] = ұҚӀ [1]
            }
            if (ұҚӀ [2] > selectedBounds[2]) {
                selectedBounds[2] = ұҚӀ [2]
            }
            if (ұҚӀ [3] < selectedBounds[3]) {
                selectedBounds[3] = ұҚӀ [3]
            }
        } else {
            selectedBounds[0] = ұҚӀ [0];
            selectedBounds[1] = ұҚӀ [1];
            selectedBounds[2] = ұҚӀ [2];
            selectedBounds[3] = ұҚӀ [3];
        }
        var name = specType + Date.now() + "_" + p;
        if (specType === "STYLESPEC") {
            try {șᘒUÅOÿҕţ = getStyle(㭹㙇ǵҗ㘕áµ [p], breakDownMode);
            } catch (È) {

            }
        }
        var area = null;
        if (showRoundCorner || showSegment || anglesCCW || anglesCW || showArea && specType === "DIMENSION") {
            varéꄗҚǰᘈᔄ = showRoundCorner ? "showRoundCorner" : "showSegment";
            varǫҏҦÑwrÙNढ각 = getAnchors(㭹㙇ǵҗ㘕áµ [p], éꄗҚǰᘈᔄ);
            if (ǫҏҦÑwrÙNढ각 !== null) {ᔘÎÓÈºIҹǳȅ = ǫҏҦÑwrÙNढ각.allPathPoints;
                closedPath = ǫҏҦÑwrÙNढ각.closed;
                anchorError = ǫҏҦÑwrÙNढ각.errorMessage;
            }
            if (closedPath) {
                area = 㭹㙇ǵҗ㘕áµ [p].area;
            }
        }
        var㘍Æ = {
            style: șᘒUÅOÿҕţ,
            anchors: ᔘÎÓÈºIҹǳȅ,
            closedPath: closedPath,
            anchorError: anchorError,
            objectStyleLimitation: "normal",
            name: name,
            area: area,
            left: ұҚӀ [0],
            top: ұҚӀ [1],
            right: ұҚӀ [2],
            bottom: ұҚӀ [3],
            width: Math.abs(ұҚӀ [0] - ұҚӀ [2]),
            height: Math.abs(ұҚӀ [1] - ұҚӀ [3])
        };
        allIremProps.push(㘍Æ);
    }ሒԂᐔᘘᔂᔈ.selectedBounds = {
        left: selectedBounds[0],
        top: selectedBounds[1],
        right: selectedBounds[2],
        bottom: selectedBounds[3],
        width: Math.abs(selectedBounds[0] - selectedBounds[2]),
        height: Math.abs(selectedBounds[1] - selectedBounds[3])
    };
    varÚÃT㕌㥱㜁Ƿҙ = U㜊ฑऐᔍᘖ.artboards[U㜊ฑऐᔍᘖ.artboards.getActiveArtboardIndex()];
    varҔᐖᔋᔈȐuÐ = {
        style: null,
        objectStyleLimitation: "normal",
        name: ÚÃT㕌㥱㜁Ƿҙ.name,
        left: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[0],
        top: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[1],
        right: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[2],
        bottom: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[3],
        width: Math.abs(ÚÃT㕌㥱㜁Ƿҙ.artboardRect[0] - ÚÃT㕌㥱㜁Ƿҙ.artboardRect[2]),
        height: Math.abs(ÚÃT㕌㥱㜁Ƿҙ.artboardRect[1] - ÚÃT㕌㥱㜁Ƿҙ.artboardRect[3])
    };ሒԂᐔᘘᔂᔈ.artboard = ҔᐖᔋᔈȐuÐ;
    if (relatedToArtboard) {
        allIremProps.push(ҔᐖᔋᔈȐuÐ);ሒԂᐔᘘᔂᔈ.selectedBounds = {
            left: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[0],
            top: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[1],
            right: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[2],
            bottom: ÚÃT㕌㥱㜁Ƿҙ.artboardRect[3],
            width: Math.abs(ÚÃT㕌㥱㜁Ƿҙ.artboardRect[0] - ÚÃT㕌㥱㜁Ƿҙ.artboardRect[2]),
            height: Math.abs(ÚÃT㕌㥱㜁Ƿҙ.artboardRect[1] - ÚÃT㕌㥱㜁Ƿҙ.artboardRect[3])
        };
    }ሒԂᐔᘘᔂᔈ.allIremProps = allIremProps;
    returnሒԂᐔᘘᔂᔈ;
}

function wrapSelectedText(㭹㙇ǵҗ㘕áµ, ܐሙԄएᐓᔏ, specType) {
    var U㜊ฑऐᔍᘖ = app.activeDocument;
    var allIremProps = [];
    varሒԂᐔᘘᔂᔈ = {};
    varұҚӀ = [];
    try {
        varĈघ = 㭹㙇ǵҗ㘕áµ.parent.textFrames[0];
        varᐌᘐऎᘕXìz㗹ԋ = 0;
        varċꐷꄍ = 0;
        varһठҁ㜇IÂꄕ = 0;
        varґøàG㯀욛 = true;
        for (var p = 0; p < Ĉघ.lines.length; p += 1) {
            if (ґøàG㯀욛) {
                try {
                    var NÉHҽðNomÒyuÁÍø = Ĉघ.lines[p].characterAttributes.leading;
                    var㘈ꄉฃऋÄúmÒÀbꉿꐽ = Ĉघ.lines[p].end - Ĉघ.lines[p].start;
                    if (p === 0) {
                        NÉHҽðNomÒyuÁÍø = Ĉघ.lines[p].characters[0].characterAttributes.size;
                        for (var H = 0; H < 㘈ꄉฃऋÄúmÒÀbꉿꐽ; H += 1) {
                            if (Ĉघ.lines[p].characters[H].characterAttributes.size > NÉHҽðNomÒyuÁÍø) {
                                NÉHҽðNomÒyuÁÍø = Ĉघ.lines[p].characters[H].characterAttributes.size;
                            }
                        }
                    } else {
                        for (varÑ = 0;Ñ < 㘈ꄉฃऋÄúmÒÀbꉿꐽ;Ñ += 1) {
                            if (Ĉघ.lines[p].characters[Ñ].characterAttributes.leading > NÉHҽðNomÒyuÁÍø) {
                                NÉHҽðNomÒyuÁÍø = Ĉघ.lines[p].characters[Ñ].characterAttributes.leading;
                            }
                        }
                    }һठҁ㜇IÂꄕ += NÉHҽðNomÒyuÁÍø;
                } catch (È) {Ĉघ.lines[p].contents = " ";
                    NÉHҽðNomÒyuÁÍø = Ĉघ.lines[p].characterAttributes.leading;һठҁ㜇IÂꄕ += NÉHҽðNomÒyuÁÍø;Ĉघ.lines[p].contents = "";
                }
            }
            if (Ĉघ.lines[p].start <= 㭹㙇ǵҗ㘕áµ.start && Ĉघ.lines[p].end >= 㭹㙇ǵҗ㘕áµ.start) {ċꐷꄍ = p + 1;ґøàG㯀욛 = false;
                try {쑁㘁ᐎāᘇȘȀĎÙ㮐 = String(Ĉघ.lines[p].paragraphs[0].paragraphAttributes.justification);
                } catch (È) {쑁㘁ᐎāᘇȘȀĎÙ㮐 = "Justification.LEFT";
                }
                varĐऄȄሓF㦰갆णȄ = 㭹㙇ǵҗ㘕áµ.start - Ĉघ.lines[p].start;
                varǲᔖĄ㯄㭺Ŧ갋㘏㜍 = (Ĉघ.lines[p].end - 㭹㙇ǵҗ㘕áµ.start) - 1;
                if (ǲᔖĄ㯄㭺Ŧ갋㘏㜍 === 0) {ǲᔖĄ㯄㭺Ŧ갋㘏㜍 = 1;
                }
                varᘑᔖऄËµሏ = Ĉघ.lines[p];
                try {
                    var㦰ѿҟg욅 = Ĉघ.lines[p].characters[ĐऄȄሓF㦰갆णȄ].contents;
                } catch (È) {
                    try {
                        if (Ĉघ.lines[p].paragraphAttributes.hyphenation && ǲᔖĄ㯄㭺Ŧ갋㘏㜍 < 0) {ᘑᔖऄËµሏ = Ĉघ.lines[p + 1];ĐऄȄሓF㦰갆णȄ = 0;ǲᔖĄ㯄㭺Ŧ갋㘏㜍 = ᘑᔖऄËµሏ.characters.length - 1;һठҁ㜇IÂꄕ += ᘑᔖऄËµሏ.characters[0].characterAttributes.leading;
                        }
                    } catch (ee) {Ĉघ.lines[p].contents = " ";ǲᔖĄ㯄㭺Ŧ갋㘏㜍 = 1;
                    }
                }
                var bñsü㠅㘍㜋ćᔄ = U㜊ฑऐᔍᘖ.textFrames.add();
                for (varÎ = 0;Î < ĐऄȄሓF㦰갆णȄ;Î += 1) {ᘑᔖऄËµሏ.characters[Î].duplicate(bñsü㠅㘍㜋ćᔄ, ElementPlacement.INSIDE);
                }
                var㨜㨭㘔ţĎꈴ = 㭹㙇ǵҗ㘕áµ.end;
                if (㨜㨭㘔ţĎꈴ > Ĉघ.lines[p].end) {㨜㨭㘔ţĎꈴ = Ĉघ.lines[p].end
                }
                var욣了õCãìøÞꐼᾩ = 1;
                varҊ갉Èxꁡᾪţ = U㜊ฑऐᔍᘖ.textFrames.add();
                var홋Ӈ㜅ҝß㥰 = 0;홋Ӈ㜅ҝß㥰 = ᘑᔖऄËµሏ.characters[ĐऄȄሓF㦰갆णȄ].characterAttributes.size;
                for (varñ = ĐऄȄሓF㦰갆णȄ;ñ < (ĐऄȄሓF㦰갆णȄ + ǲᔖĄ㯄㭺Ŧ갋㘏㜍);ñ++) {ᘑᔖऄËµሏ.characters[ñ].duplicate(Ҋ갉Èxꁡᾪţ, ElementPlacement.INSIDE);
                    if (ñ < (ĐऄȄሓF㦰갆णȄ + 욣了õCãìøÞꐼᾩ)) {
                        varᔆąóðzꁨꁦ㘊 = ᘑᔖऄËµሏ.characters[ñ];
                    }
                }
                break;
            }
        }
    } catch (err) {
        alert("err " + err);
    }
    var dèÝqÖÁＪܔ = 㭹㙇ǵҗ㘕áµ.parent.textFrames[0].geometricBounds;
    varሗȔꑟ料 = U㜊ฑऐᔍᘖ.pathItems.add();ሗȔꑟ料.stroked = true;ሗȔꑟ料.filled = false;
    if (쑁㘁ᐎāᘇȘȀĎÙ㮐 === "Justification.LEFT" || 쑁㘁ᐎāᘇȘȀĎÙ㮐 === "Justification.FULLJUSTIFYLASTLINELEFT" || 쑁㘁ᐎāᘇȘȀĎÙ㮐 === "Justification.FULLJUSTIFY") {ȄᔉFtꑤฉᘖԅ = bñsü㠅㘍㜋ćᔄ.width + dèÝqÖÁＪܔ [0];
    } else if (쑁㘁ᐎāᘇȘȀĎÙ㮐 === "Justification.RIGHT" || 쑁㘁ᐎāᘇȘȀĎÙ㮐 === "Justification.FULLJUSTIFYLASTLINERIGHT") {ȄᔉFtꑤฉᘖԅ = dèÝqÖÁＪܔ [2] - Ҋ갉Èxꁡᾪţ.width;
    } else {
        var㢍ሏᔔᘓÊUÑÁÙ = (dèÝqÖÁＪܔ [2] - dèÝqÖÁＪܔ [0]) / 2;ȄᔉFtꑤฉᘖԅ = (㢍ሏᔔᘓÊUÑÁÙ - ((bñsü㠅㘍㜋ćᔄ.width + Ҋ갉Èxꁡᾪţ.width) / 2)) + bñsü㠅㘍㜋ćᔄ.width + dèÝqÖÁＪܔ [0];
    }
    varถԄԋሙฃऎ = U㜊ฑऐᔍᘖ.textFrames.add();ᔆąóðzꁨꁦ㘊.duplicate(ถԄԋሙฃऎ, ElementPlacement.INSIDE);ұҚӀ [0] = ȄᔉFtꑤฉᘖԅ;ұҚӀ [1] = (dèÝqÖÁＪܔ [1] - һठҁ㜇IÂꄕ) + 홋Ӈ㜅ҝß㥰;ұҚӀ [2] = ȄᔉFtꑤฉᘖԅ + ถԄԋሙฃऎ.width;ұҚӀ [3] = dèÝqÖÁＪܔ [1] - һठҁ㜇IÂꄕ;
    var name = specType + Date.now() + "_" + p;
    varșᘒUÅOÿҕţ = getStyle(ถԄԋሙฃऎ);
    varᔔᘔ홋署ᔕᐍ = ถԄԋሙฃऎ.createOutline();
    try {
        var㥚㘗㜘ซᔈԏᘆฑiÖ = ᔔᘔ홋署ᔕᐍ.compoundPathItems[0].opacity;șᘒUÅOÿҕţ.styleList[0].opacity = 㥚㘗㜘ซᔈԏᘆฑiÖ;
    } catch (È) {

    }ᔔᘔ홋署ᔕᐍ.remove();
    bñsü㠅㘍㜋ćᔄ.remove();Ҋ갉Èxꁡᾪţ.remove();㭹㙇ǵҗ㘕áµ.select();
    var㘍Æ = {
        style: șᘒUÅOÿҕţ,
        objectStyleLimitation: "selectedText",
        name: name,
        left: ұҚӀ [0],
        top: ұҚӀ [1],
        right: ұҚӀ [2],
        bottom: ұҚӀ [3],
        width: Math.abs(ұҚӀ [0] - ұҚӀ [2]),
        height: Math.abs(ұҚӀ [1] - ұҚӀ [3])
    };
    allIremProps.push(㘍Æ);
    if (ܐሙԄएᐓᔏ === false) {
        selectedBounds = Ĉघ.geometricBounds;
    } else {
        selectedBounds = Ĉघ.visibleBounds;
    }ሒԂᐔᘘᔂᔈ.selectedBounds = {
        left: selectedBounds[0],
        top: selectedBounds[1],
        right: selectedBounds[2],
        bottom: selectedBounds[3],
        width: Math.abs(selectedBounds[0] - selectedBounds[2]),
        height: Math.abs(selectedBounds[1] - selectedBounds[3])
    };ሒԂᐔᘘᔂᔈ.allIremProps = allIremProps;
    returnሒԂᐔᘘᔂᔈ;
}

function checkLargeCanvas() {
    varŧN = app.activeDocument;
    var pageItems = ŧN.pageItems;
    var defaultStrokeWidth = ŧN.defaultStrokeWidth;
    if (defaultStrokeWidth === 0.1 && pageItems.length === 0) {
        return "large";
    } else {
        return "normal";
    }
}

function getEncryptKey() {
    return "DIFH3nkjhfo349";
}

function renderFeetUnit(IӂÁb, G㘓ҋĒऊȒĒ, ÏÃꁜꑞ욚ᔙoë) {
    varᔑᘄARalü = IӂÁb;
    if (IӂÁb === "inches") {ᔑᘄARalü = "\"";
    } else {
        if (IӂÁb === "ft") {ᔑᘄARalü = G㘓ҋĒऊȒĒ ? "" : "'";
        }
    }
    if (!ÏÃꁜꑞ욚ᔙoë) {ᔑᘄARalü = "";
    }
    returnᔑᘄARalü;
}

function renderSqFeetUnit(IӂÁb, G㘓ҋĒऊȒĒ, ÏÃꁜꑞ욚ᔙoë) {
    varᔑᘄARalü = IӂÁb;
    if (IӂÁb === "\"") {ᔑᘄARalü = "in";
    } else {
        if (IӂÁb === "'") {ᔑᘄARalü = G㘓ҋĒऊȒĒ ? "ft" : "ft";
        }
    }
    if (!ÏÃꁜꑞ욚ᔙoë) {ᔑᘄARalü = "ft";
    }
    returnᔑᘄARalü;
}

function render2ndUNit(content, unit2Separator, params) {
    varÕÈÙKꁩ㡡 = params.unit2_lineBreak ? "\n" : " ";
    varĕĔSҋ갇 = unit2Separator.length > 1 ? "" : " ";
    returnÕÈÙKꁩ㡡 + unit2Separator.slice(0, 1) + ĕĔSҋ갇 + content + unit2Separator.slice(1, 2);
}

function getAddSpace(unit, spaceB4Unit) {
    varĕĔSҋ갇 = spaceB4Unit ? " " : "";
    if (unit === "'" || unit === "\"" || unit.length === 0) {ĕĔSҋ갇 = ""
    }
    returnĕĔSҋ갇;
}

function smallerUnit(label, unit, font_size, unit2, spaceB4Unit, ऒdªäǸआ) {
    varǳp = label.textRange.contents;
    var흵ȃW = ǳp.indexOf(unit);
    if (unit2 && unit === unit2) {ťEóÕg = ǳp.indexOf(unit2, ǳp.indexOf(unit2) + 1);
    } else {ťEóÕg = ǳp.indexOf(unit2);
    }Õ욝ᘉN = ťEóÕg ? ťEóÕg : -1;

    function decreaseSize(ꁺēöÙàFÄ, ᔑᘄARalü, 홈왉㭮ȗ) {
        if (ᔑᘄARalü.length > 0) {
            if (ᔑᘄARalü !== "\"" && ᔑᘄARalü !== "'") {
                var㜈간ҹǥ㘖 = spaceB4Unit ? 홈왉㭮ȗ - 1 : 홈왉㭮ȗ;
                for (varÞË = 㜈간ҹǥ㘖;ÞË < (홈왉㭮ȗ + ᔑᘄARalü.length);ÞË++) {ꁺēöÙàFÄ.textRange.characters[ÞË].characterAttributes.size = font_size * 0.75;
                }
            }
        }
    }
    if (흵ȃW > -1) {
        decreaseSize(label, unit, 흵ȃW)
    }
    if (unit2 && Õ욝ᘉN > -1) {
        decreaseSize(label, unit2, Õ욝ᘉN);
    }

    function scaleSquareSign(ꁺēöÙàFÄ, ᔑᘄARalü, 홈왉㭮ȗ) {
        if (ᔑᘄARalü.length > 0) {
            if (ᔑᘄARalü !== "\"" && ᔑᘄARalü !== "'") {
                var㜈간ҹǥ㘖 = spaceB4Unit ? (홈왉㭮ȗ - 1) + ᔑᘄARalü.length : (홈왉㭮ȗ - 1) + ᔑᘄARalü.length;ꁺēöÙàFÄ.textRange.characters[㜈간ҹǥ㘖].characterAttributes.size = font_size * 0.5;ꁺēöÙàFÄ.textRange.characters[㜈간ҹǥ㘖 - 1].characterAttributes.tracking = 80;ꁺēöÙàFÄ.textRange.characters[㜈간ҹǥ㘖].characterAttributes.baselineShift = font_size * 0.3;
            }
        }
    }
    if (ऒdªäǸआ && 흵ȃW > -1) {
        scaleSquareSign(label, unit, 흵ȃW)
    }
    if (unit2 && ऒdªäǸआ && Õ욝ᘉN > -1) {
        scaleSquareSign(label, unit2, Õ욝ᘉN)
    }
}

function renderSquareUnit(content, unit, display_unit, unit2, display_unit2, spaceB4Unit) {
    if (unit === "in" || unit2 === "in") {
        content = content.replace("\"", spaceB4Unit ? " in" : "in");
    }
    if (unit === "ft" || unit2 === "ft") {
        content = content.replace("'", spaceB4Unit ? " ft" : "ft");
    }
    if (display_unit) {
        varÉnYàXÁgªïòÿKc = content.indexOf(unit);
        pðØvÎôÞQól = content.slice(0, ÉnYàXÁgªïòÿKc + unit.length) + "2" + content.slice(ÉnYàXÁgªïòÿKc + unit.length);
    } else {
        pðØvÎôÞQól = content;
    }
    if (display_unit2) {
        varᘀᐙᐗᔋฆҩᔊ = display_unit ? ÉnYàXÁgªïòÿKc.length + unit.length + 1 : 0;
        varᘅȐȏሕܒᘌOoêtl = unit2 && unit === unit2 ? pðØvÎôÞQól.indexOf(unit2, pðØvÎôÞQól.indexOf(unit2) + 1) : pðØvÎôÞQól.indexOf(unit2, ᘀᐙᐗᔋฆҩᔊ);
        JáＪҔ㘖Đ = unit2 ? pðØvÎôÞQól.slice(0, ᘅȐȏሕܒᘌOoêtl + unit2.length) + "2" + pðØvÎôÞQól.slice(ᘅȐȏሕܒᘌOoêtl + unit2.length) : pðØvÎôÞQól;
    } else {
        JáＪҔ㘖Đ = pðØvÎôÞQól;
    }
    return JáＪҔ㘖Đ;
}

function getXMPmeta(ฃᔏ) {
    if (นSTÍሐ === undefined) {นSTÍሐ = new ExternalObject("lib:AdobeXMPScript")
    }
    varŧN = app.activeDocument;
    varëûÚÎꉍȏêÓ = ŧN.XMPString;
    varėԋ = new XMPMeta(ëûÚÎꉍȏêÓ);
    var cÛꁿꁥꁦҟᐄ = new Namespace("specees", "https://specees.dazed.design/");
    varᐁฉङâOए = ėԋ.getProperty(cÛꁿꁥꁦҟᐄ, ฃᔏ);
    returnᐁฉङâOए || "unMarked";
}

function saveXMPmeta(ฃᔏ, value) {
    if (นSTÍሐ === undefined) {นSTÍሐ = new ExternalObject("lib:AdobeXMPScript")
    }
    varŧN = app.activeDocument;
    varëûÚÎꉍȏêÓ = ŧN.XMPString;
    varėԋ = new XMPMeta(ëûÚÎꉍȏêÓ);
    var cÛꁿꁥꁦҟᐄ = new Namespace("specees", "https://specees.dazed.design/");
    XMPMeta.registerNamespace(cÛꁿꁥꁦҟᐄ, "specees");ėԋ.setProperty(cÛꁿꁥꁦҟᐄ, ฃᔏ, value);
    varङᔓ = ėԋ.serialize();ŧN.XMPString = ङᔓ;
}