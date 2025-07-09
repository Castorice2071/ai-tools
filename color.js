var doc = app.activeDocument;
var actionFile = new File("~/Desktop/Set_DeleteUnuseColor.aia");
try {
    actionFile.remove();
} catch (e) {

}
var sel = doc.selection;
var swa = doc.swatches;
var lay = doc.activeLayer;
var u = 2.834646;
if (sel.length == 0) {
    alert("请选取标注对象");
} else if (sel.length > 0 && sel[0].typename == "GroupItem") {
    alert("选取对象请勿包含编组，\n请重新选取");
} else {
    if (sel.length > 0 && sel[0].typename != "GroupItem") {
        var win = new Window("dialog", "(CJ)Ai_标注色值V2scN", undefined, {
            closeButton: false
        });
        win.spacing = 6;
        win.alignChildren = "left";
        var g1 = win.add("group");
        g1.alignment = "center";
        var rb11 = g1.add("radiobutton", undefined, "基本标注");
        var rb12 = g1.add("radiobutton", undefined, "进阶标注");
        rb11.value = true;
        var cb31 = win.add("checkbox", undefined, "标注于新图层");
        cb31.alignment = "right";
        cb31.value = true;
        var spacePan3 = win.add("panel", [0, 0, undefined, 3], "");
        spacePan3.alignment = "fill";
        var g2 = win.add("group");
        g2.alignment = "left";
        g2.spacing = 5;
        var st21 = g2.add("statictext", undefined, "● 字体大小：");
        var et21 = g2.add("edittext", [0, 0, 30, 21], "3");
        var st22 = g2.add("statictext", undefined, "mm");
        var st23 = win.add("statictext", undefined, "● 增加选取的色票");
        var st24 = win.add("statictext", undefined, "● 移除未使用的色票");
        var st25 = win.add("statictext", undefined, "● 加注四色值(仅供参考)");
        st23.enabled = st24.enabled = st25.enabled = false;
        var light = win.add("group");
        light.alignment = "center";
        light.spacing = 15;
        var img11 = "PNG\r\n\n\rIHDR\rÜ_tEXtSoftwareAdobe ImageReadyqÉe<×IDATxÚÃ Ù0P\tá ^TB:Ý0ÌAðØA¯t»q÷]iÈ!þ\\§[CôDÿÄD,GòÆpÆ}GÐÙXiÍÎJ! ã\tSËÎgq?k\nqÌì¯pÂîJbéCÈ,,¢÷á£rYkDkçQÊ\"£¡hÊ9ÔX³{¦RÛ³óxlí°dã2¹|ó­°åØY¢\reªZ5ÜjPqnËÿöäÒ³kâþEÜ·o¢\tbÐ¶ÿIEND®B`";
        var icon11 = light.add("image", undefined, img11);
        var img12 = "PNG\r\n\n\rIHDR\rÜ_tEXtSoftwareAdobe ImageReadyqÉe<IDATxÚb` 0bâ ¶²?ñF ^Ï !Nû\rÿïç3üÿ_¡A|8H&A÷çóþÿ??ÿÿÿëëÿÿnÖÂçÓþä¡®@ó×3@4ÁÀýýp <ßá?P]?H1L C@Ád ªá\t@¢Qê/.äÃBÿè3(h¦8CïÃ\r·ñÀ0A\\à0b.¼`¸¢â×X¸LMÌHâN<ap`ddPpPÀÔL+®A#®Ó¯ ÀP`ðÓ¦î½ÛÔ/ÉÁr*¹Mzp`»»lR[µIEND®B`";
        var icon12 = light.add("image", undefined, img12);
        var img13 = "PNG\r\n\n\rIHDR\rÜ_tEXtSoftwareAdobe ImageReadyqÉe<\tIDATxÚb` 0bsâx Vòñ ~Ë ^`Æðÿ|/Ãÿÿëþ¿_Ìð~.Ã1ÿ@¹\\×ý¿Þðÿÿëýÿÿk` Öá<Mÿ9üG{\rP4ñ0Üi`Òþù¾øC!ÎìodÚ@òÍGÀpø»>^ÀÐ4à¯P³bâ²7\"w®©È74¯bø²¦WÀâfýû¯/w^`ð0ûESP'Ã¿<aNEO9À ï÷3ePF:ºMÈ©Ë )ª#¹2ªvx\t?bIEND®B`";
        var icon13 = light.add("image", undefined, img13);
        var img14 = "PNG\r\n\n\rIHDR\rÜ_tEXtSoftwareAdobe ImageReadyqÉe<IDATxÚb` 0bSâ ¶òñB >Ï iÿó;þ¿?Ëðÿÿmÿç71üpaø[ÄØ4h5\\1øÿÿËúÿÿ?Íÿÿÿ®X3jFB÷Á¶ü}ÿÞ6À50Ôfz&¨>?'>üR¦â52(È@o\nþÃãëP4½<c?-`,àÃ'fã'\tÇÝ=`ê ºøþýKPNIá=Ì©(/ÈÏðf&PTAÖ2m¾9CüðaÓ>ï>0\\/ÉÁ@vFr0ç,E±,IEND®B`";
        var icon14 = light.add("image", undefined, img14);
        var img15 = "PNG\r\n\n\rIHDR\rÜ_tEXtSoftwareAdobe ImageReadyqÉe<'IDATxÚb` 0âOb â@|@ÙX÷©eøßráÿôÄçb¸Ç ÉÆÓÿoüÿÿþßõÿWÿ2káêSÿ¹ÞÕ) klíaøéOÿøôï>\\#îføT7¤\t¦h[¼S.£Ü$v$6¨Ù10ËýÐ(­qÂ¿Ïþ`øüÿÃÑ?þjÀ·¤aÓoGÑ·ñÉEoâWüO¯0<@ÑWà×¸¥áë; 63ø7Þ=d0Ð÷ÃÔ´¨ig7Ã 3WÊiQdÈ×óaàêñE@oL2\t%9´Tr=¹¤ub6dæIEND®B`";
        var icon15 = light.add("image", undefined, img15);
        var img16 = "PNG\r\n\n\rIHDR\rÜ_tEXtSoftwareAdobe ImageReadyqÉe<ÿIDATxÚb` 0bsb 6ò/ñD ~Ï ùÿæñS ¾ek1C.Mýaÿ>üßÿsÿÿO\rÍ0Ö\\®IdÁ+ÿÈÄkÙ.Ïð¨V¤\tª1!(Â$b\n]Á5êýÁpàç\t_'0<øûLø(ÀL*ôá\te`(üXÆXÁcfãEãDDDÍäx`àg¸ÏpHóáÐtÝÀqj.¯¨ÑÂk¢¸\n±ûà8+bpüíG×ÄÃX|AFr0Çk­#}\r«IEND®B`";
        var icon16 = light.add("image", undefined, img16);
        icon12.visible = icon13.visible = icon14.visible = icon15.visible = icon16.visible = false;
        var spacePan1 = win.add("panel", [0, 0, undefined, 3], "");
        spacePan1.alignment = "fill";
        var exeBtn = win.add("group");
        exeBtn.alignment = "center";
        var okBtn = exeBtn.add("button", [0, 0, 70, 28], "运行", {
            name: "ok"
        });
        var cancelBtn = exeBtn.add("button", [0, 0, 70, 28], "取消", {
            name: "cancel"
        });
        var spacePan2 = win.add("panel", [0, 0, undefined, 3], "");
        spacePan2.alignment = "fill";
        var giSign = win.add("group");
        giSign.spacing = 0;
        giSign.alignment = "center";
        var cpcImg = "PNG\r\n\n\rIHDR(d×=­tEXtSoftwareAdobe ImageReadyqÉe<ÄIDATxÚÌVËOaÚÖÙ\nÑmÏCY¸\\lyÄ¤Ü[IÆÒxE@à`D!h4áe¤âÁ.^@\"¡8l°õa#ZÅåÛ¥-|Ùô{Ío~óù\npÂ-+uâ^Û]?GÇ«§}ÏSö¶ã;â~:;çäs6æg~\t>f2Ä.ütW¯TsEb¸°DãÆ:ý\"ÞÚ\nãº/\tÎl+++3¢Bð+%pvv7¶Êª*(++SöíÆbð÷¾X,Ö{½i\tiÏ4pgº\r\"Ekûó¦¦ ïÃâ³X,¢»µõÈÍÍÎÂG£HD&Ô74L§[áõÈE¬»i.;!­÷Þ$p©¶ÙØÛ±Ð­Ot¤¤¹ÚZ@¦é~ÍÍºàÈ8Û0®»X6¢ubZ¡p³PÛ<_òzoô@aßsLñÆ!È¦Føk2Ù>,°¸/ûûá\r²hfN©`w8´9L%Áîý~å7¯G\"F56k¸B;,Zý0l×\nVÝçº.>é&ý)kL&Ø½WÓ0YÒòrÐ[ãqM5\n$Éã££ÚÓ¦@=ÅæxSül{hnÔÁÀ¥Ë]:dT0©ECÌD£QÈÏÏ×æH¨³0Þïd÷Ï`AI::Ò:Bö!m±ý¬QöÁKa\t¾-,(ãg$ÿi/8,úÊzcU­ÞÅÔ¡úUîîu¶¡i^ô]ïÆ(||/nû,Çõ:»CP  êP5é `¨¯õnËò¸æSRàp]D8uIF.là¤è·\nÖ\n¤¯Ç;É}.mû.KËË8ÁóÊÔB··\tÑ¯ö1úK£©åTÞli!\r\n8'f¥A­£¯ìY[-ðÌÏpWjV¢âÊûdêìv01Ì°Î¯ÛmR_f½>¯µek4\rµ©ìÒ4È\"÷ð©µêz%æ(µÞBÀÇ}SÑÇct>AÕKýRÏ¨xh½&3zO¥l 7w'&××ãó£¤1GOÌ{@§X¼¸Þ\t(£&ßNO5fj?$\rò ä]ç³2\\âb}W4!uÇ6+¡°/z,N¼ý` ²ÖñºÈIEND®B`";
        var imgSign = giSign.add("image", [0, 0, 50, 25], cpcImg);
        var stSign2 = giSign.add("statictext", undefined, "by calvin530126");
        var arrSelTem = [];
        var cdCMYK = 0;
        var cdSpot = 0;
        for (var j = 0; j < sel.length; j += 1) {
            if (sel[j].fillColor.typename == "CMYKColor" && sel[j].fillColor.typename != "SpotColor") {
                cdCMYK++;
            } else {
                if (sel[j].fillColor.typename == "SpotColor" && sel[j].fillColor.typename != "cdSpot") {
                    cdSpot++;
                }
            }
            arrSelTem.push(sel[j]);
        }
        rb11.onClick = function() {
            icon12.visible = icon13.visible = icon14.visible = icon15.visible = icon16.visible = false;
            st23.enabled = st24.enabled = st25.enabled = false;
            app.redraw();
        };
        rb12.onClick = function() {
            icon12.visible = icon13.visible = icon14.visible = icon15.visible = icon16.visible = false;
            st23.enabled = st24.enabled = st25.enabled = true;
            app.redraw();
        };
        okBtn.onClick = function() {
            main();
            doc.selection = null;
            win.close();
        };
        win.show();
        win.center();
    }
}

function main() {
    if (rb12.value == true) {
        playAction();
    }
    doc.selection = null;
    if (cb31.value == true) {
        try {
            newLayer = doc.layers.add();
            newLayer.name = "标注图层";
            lay = doc.layers["标注图层"];
        } catch (e) {

        }
    }
    for (var i = 0; i < arrSelTem.length; i += 1) {
        var selW = Math.round(arrSelTem[i].width);
        var selH = Math.round(arrSelTem[i].height);
        var selL = arrSelTem[i].left;
        var selT = arrSelTem[i].top;
        var selO = arrSelTem[i].opacity / 100;
        if (arrSelTem[i].fillColor.typename == "CMYKColor" && arrSelTem[i].fillColor.typename != "SpotColor") {
            var cmkycolor = arrSelTem[i].fillColor;
            var col = new CMYKColor();
            col.cyan = Math.round(cmkycolor.cyan * selO);
            col.magenta = Math.round(cmkycolor.magenta * selO);
            col.yellow = Math.round(cmkycolor.yellow * selO);
            col.black = Math.round(cmkycolor.black * selO);
            var colVal = "C" + col.cyan + "M" + col.magenta + "Y" + col.yellow + "K" + col.black;
            var txt = lay.textFrames.add();
            txt.contents = colVal;
            txt.fillColor = true;
            txt.strokeColor = false;
            txt.textRange.characterAttributes.fillColor = col;
        } else {
            if (arrSelTem[i].fillColor.typename == "SpotColor" && arrSelTem[i].fillColor.typename != "CMYKColor") {
                var spCol = arrSelTem[i].fillColor;
                var spotColorTint = spCol.tint;
                var txt = lay.textFrames.add();
                if (spCol.spot.colorType == ColorModel.SPOT) {
                    var colName = spCol.spot.name;
                    if (rb12.value == true) {
                        var objTem = arrSelTem[i].duplicate(arrSelTem[i], ElementPlacement.PLACEBEFORE);
                        objTem.selected = true;
                        app.executeMenuCommand("Colors8");
                        var cmkyColor = objTem.fillColor;
                        var col = new CMYKColor();
                        col.cyan = Math.round(cmkyColor.cyan * selO);
                        col.magenta = Math.round(cmkyColor.magenta * selO);
                        col.yellow = Math.round(cmkyColor.yellow * selO);
                        col.black = Math.round(cmkyColor.black * selO);
                        colVal = "C" + col.cyan + "M" + col.magenta + "Y" + col.yellow + "K" + col.black;
                        finalContnets = colName + "\n(" + colVal + ")";
                        objTem.remove();
                        if (spotColorTint == 100 && selO == 1) {
                            txt.contents = finalContnets;
                        } else {
                            if (spotColorTint != 100 || selO != 1) {
                                txt.contents = Math.round(spotColorTint * selO) + "%" + colName + "\n" + "(" + colVal + ")";
                            }
                        }
                    } else {
                        if (rb11.value == true) {
                            finalContnets = colName;
                            if (spotColorTint == 100 && selO == 1) {
                                txt.contents = colName;
                            } else {
                                if (spotColorTint != 100 || selO != 1) {
                                    txt.contents = Math.round(spotColorTint * selO) + "%" + colName;
                                }
                            }
                        }
                    }
                } else {
                    if (spCol.spot.colorType == ColorModel.PROCESS) {
                        var arr1 = spCol.spot.getInternalColor();
                        if (rb12.value == true) {
                            if (spotColorTint == 100 && selO == 1) {
                                colName = spCol.spot.name + "\n" + "(" + "C" + Math.round(arr1[0]) + "M" + Math.round(arr1[1]) + "Y" + Math.round(arr1[2]) + "K" + Math.round(arr1[3]) + ")";
                            } else {
                                if (spotColorTint != 100 || selO != 1) {
                                    var per = Math.round(spotColorTint * selO) / 100;
                                    colName = (per * 100) + "%" + "(" + spCol.spot.name + ")" + "\n(" + "C" + Math.round(arr1[0] * per) + "M" + Math.round(arr1[1] * per) + "Y" + Math.round(arr1[2] * per) + "K" + Math.round(arr1[3] * per) + ")";
                                    txt.contents = colName;
                                }
                            }
                            txt.contents = colName;
                        } else {
                            if (rb11.value == true) {
                                if (spotColorTint == 100 && selO == 1) {
                                    colName = spCol.spot.name;
                                } else {
                                    if (spotColorTint != 100 || selO != 1) {
                                        var per = Math.round(spotColorTint * selO);
                                        colName = per + "%(" + spCol.spot.name + ")";
                                    }
                                }
                                txt.contents = colName;
                            }
                        }
                    }
                }
                txt.fillColor = true;
                txt.strokeColor = false;
                txt.textRange.characterAttributes.fillColor = spCol;
            }
        }
        txt.textRange.characterAttributes.size = Number(et21.text) * u;
        txtW = txt.width;
        txtH = txt.height;
        txt.left = selL;
        txt.top = selT - selH;
        var percent = ((i + 1) / arrSelTem.length) * 100;
        if (percent > 34) {
            icon12.visible = true;
        }
        win.update();
        if (percent > 51) {
            icon13.visible = true;
        }
        win.update();
        if (percent > 68) {
            icon14.visible = true;
        }
        win.update();
        if (percent > 85) {
            icon15.visible = true;
        }
        win.update();
        if (percent > 99) {
            icon16.visible = true;
        }
        win.update();
        app.redraw();
    }
}

function playAction() {
    var set = "Set_DeleteUnuseColor";
    var action = "Action_DeleteUnuseColor";
    var actionStr = ["/version 3", "/name [ 20", "5365745f44656c657465556e757365436f6c6f72", "]", "/isOpen 1", "/actionCount 1", "/action-1 {", "/name [ 23", "416374696f6e5f44656c657465556e757365436f6c6f72", "]", "/keyIndex 0", "/colorIndex 0", "/isOpen 1", "/eventCount 3", "/event-1 {", "/useRulersIn1stQuadrant 0", "/internalName (ai_plugin_swatches)", "/localizedName [ 6", "e889b2e7a5a8", "]", "/isOpen 0", "/isOn 1", "/hasDialog 0", "/parameterCount 1", "/parameter-1 {", "/key 1835363957", "/showInPalette -1", "/type (enumerated)", "/name [ 27", "e981b8e58f96e585a8e983a8e69caae4bdbfe794a8e889b2e7a5a8", "]", "/value 11", "}", "}", "/event-2 {", "/useRulersIn1stQuadrant 0", "/internalName (ai_plugin_swatches)", "/localizedName [ 6", "e889b2e7a5a8", "]", "/isOpen 0", "/isOn 1", "/hasDialog 1", "/showDialog 0", "/parameterCount 1", "/parameter-1 {", "/key 1835363957", "/showInPalette -1", "/type (enumerated)", "/name [ 12", "e588aae999a4e889b2e7a5a8", "]", "/value 3", "}", "}", "/event-3 {", "/useRulersIn1stQuadrant 0", "/internalName (ai_plugin_swatches)", "/localizedName [ 6", "e889b2e7a5a8", "]", "/isOpen 0", "/isOn 1", "/hasDialog 0", "/parameterCount 2", "/parameter-1 {", "/key 1835363957", "/showInPalette -1", "/type (enumerated)", "/name [ 21", "e5a29ee58aa0e981b8e58f96e79a84e9a18fe889b2", "]", "/value 9", "}", "/parameter-2 {", "/key 1634495605", "/showInPalette -1", "/type (boolean)", "/value 0", "}", "}", "}"].join("\n");
    createAction(actionStr, set);
    try {
        app.loadAction(f_170701);
    } catch (e) {
        alert("尚未指定路径或路径有误或档案不存在，\n请重新选取");
    }
    app.doScript(action, set);
    app.unloadAction(set, "");
    f_170701.remove();

    function createAction(actionStr, set) {
        f_170701 = new File("~/Desktop/" + set + ".aia");
        f_170701.encoding = "UTF-8";
        f_170701.open("w");
        f_170701.write(actionStr);
        f_170701.close();
        f_170701.hidden = true;
    }
}