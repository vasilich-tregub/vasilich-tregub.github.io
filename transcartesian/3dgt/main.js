/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function r4(string) {
    return parseInt(string, 4);
}
var rank = 64;
var a;
var mesh = []; // array of node neighbors; 3 neighbors or empty
window.onload = (event) => {
    mesh[0] = [1, 2, 3];
    mesh[1] = [0, r4("23"), r4("32")];
    mesh[2] = [0, r4("31"), r4("13")];
    mesh[3] = [0, r4("12"), r4("21")];
    mesh[r4("10")] = [r4("11"), r4("12"), r4("13")];
    mesh[r4("11")] = [r4("10"), r4("233"), r4("322")];
    mesh[r4("12")] = [r4("10"), r4("321"), 3];
    mesh[r4("13")] = [r4("10"), 2, r4("231")];
    mesh[r4("20")] = [r4("21"), r4("22"), r4("23")];
    mesh[r4("21")] = [r4("20"), 3, r4("312")];
    mesh[r4("22")] = [r4("20"), r4("311"), 1];
    mesh[r4("23")] = [r4("20"), r4("132"), r4("231")];
    mesh[r4("30")] = [r4("31"), r4("32"), r4("33")];
    mesh[r4("31")] = [r4("30"), r4("213"), 2];
    mesh[r4("32")] = [r4("30"), 1, r4("123")];
    mesh[r4("33")] = [r4("30"), r4("122"), r4("211")];
    mesh[r4("100")] = [r4("101"), r4("102"), r4("103")];
    mesh[r4("101")] = [r4("100"), r4("123"), r4("132")];
    mesh[r4("102")] = [r4("100"), r4("131"), r4("113")];
    mesh[r4("103")] = [r4("100"), r4("112"), r4("121")];
    mesh[r4("110")] = [r4("111"), r4("112"), r4("113")];
    mesh[r4("111")] = [r4("110")];
    mesh[r4("112")] = [r4("110"), r4("103")];
    mesh[r4("113")] = [r4("110"), r4("102")];
    mesh[r4("120")] = [r4("121"), r4("122"), r4("123")];
    mesh[r4("121")] = [r4("120"), r4("103")];
    mesh[r4("122")] = [r4("120"), r4("33")];
    mesh[r4("123")] = [r4("120"), r4("32"), r4("101")];
    mesh[r4("130")] = [r4("131"), r4("132"), r4("133")];
    mesh[r4("131")] = [r4("130"), r4("102")];
    mesh[r4("132")] = [r4("130"), r4("101"), r4("23")];
    mesh[r4("133")] = [r4("130"), r4("22")];
    mesh[r4("200")] = [r4("201"), r4("202"), r4("203")];
    mesh[r4("201")] = [r4("200"), r4("223"), r4("232")];
    mesh[r4("202")] = [r4("200"), r4("231"), r4("213")];
    mesh[r4("203")] = [r4("200"), r4("212"), r4("221")];
    mesh[r4("210")] = [r4("211"), r4("212"), r4("213")];
    mesh[r4("211")] = [r4("210"), r4("33")];
    mesh[r4("212")] = [r4("210"), r4("203")];
    mesh[r4("213")] = [r4("210"), r4("202"), r4("31")];
    mesh[r4("220")] = [r4("221"), r4("222"), r4("223")];
    mesh[r4("221")] = [r4("220"), r4("203")];
    mesh[r4("222")] = [r4("220")];
    mesh[r4("223")] = [r4("220"), r4("201")];
    mesh[r4("230")] = [r4("231"), r4("232"), r4("233")];
    mesh[r4("231")] = [r4("230"), r4("13"), r4("202")];
    mesh[r4("232")] = [r4("230"), r4("231")];
    mesh[r4("233")] = [r4("230"), r4("11")];
    mesh[r4("300")] = [r4("301"), r4("302"), r4("303")];
    mesh[r4("301")] = [r4("300"), r4("323"), r4("332")];
    mesh[r4("302")] = [r4("300"), r4("331"), r4("313")];
    mesh[r4("303")] = [r4("300"), r4("312"), r4("321")];
    mesh[r4("310")] = [r4("311"), r4("312"), r4("313")];
    mesh[r4("311")] = [r4("310"), r4("22")];
    mesh[r4("312")] = [r4("310"), r4("21"), r4("303")];
    mesh[r4("313")] = [r4("310"), r4("302")];
    mesh[r4("320")] = [r4("321"), r4("322"), r4("323")];
    mesh[r4("321")] = [r4("320"), r4("303"), r4("12")];
    mesh[r4("322")] = [r4("320"), r4("11")];
    mesh[r4("323")] = [r4("301"), r4("320")];
    mesh[r4("330")] = [r4("331"), r4("332"), r4("333")];
    mesh[r4("331")] = [r4("330"), r4("302")];
    mesh[r4("332")] = [r4("330"), r4("301")];
    mesh[r4("333")] = [r4("330")];
}
function solve() {
    let u = new Float64Array(rank);
    a = new Array(rank);
    for (let i = 0; i < rank; ++i) {
        a[i] = new Float64Array(rank + 1);
        for (let j = 0; j <= rank; ++j) {
            a[i][j] = 0;
        }
    }
    for (let i = 0; i < rank; ++i) {
        if (mesh[i].length == 3) {
            a[i][i] = -3.0;
            a[i][mesh[i][0]] = 1.0;
            a[i][mesh[i][1]] = 1.0;
            a[i][mesh[i][2]] = 1.0;
        }
        else {
            a[i][i] = 1.0;
        }
    }
    a[r4("111")][rank] = Number(boundary111.value);
    a[r4("112")][rank] = Number(boundary112.value);
    a[r4("121")][rank] = Number(boundary121.value);
    a[r4("122")][rank] = Number(boundary122.value);
    a[r4("211")][rank] = Number(boundary211.value);
    a[r4("212")][rank] = Number(boundary212.value);
    a[r4("221")][rank] = Number(boundary221.value);
    a[r4("222")][rank] = Number(boundary222.value);
    a[r4("223")][rank] = Number(boundary223.value);
    a[r4("232")][rank] = Number(boundary232.value);
    a[r4("233")][rank] = Number(boundary233.value);
    a[r4("322")][rank] = Number(boundary322.value);
    a[r4("323")][rank] = Number(boundary323.value);
    a[r4("332")][rank] = Number(boundary332.value);
    a[r4("333")][rank] = Number(boundary333.value);
    a[r4("331")][rank] = Number(boundary331.value);
    a[r4("313")][rank] = Number(boundary313.value);
    a[r4("311")][rank] = Number(boundary311.value);
    a[r4("133")][rank] = Number(boundary133.value);
    a[r4("131")][rank] = Number(boundary131.value);
    a[r4("113")][rank] = Number(boundary113.value);
    solvelinsys(a, rank, rank + 1, u);
    console.log(u[0]);
    console.log(u[1]);
    console.log(u[2]);
    console.log(u[3]);
    results.innerHTML = "<pre>u[0..0] = " + u[0] + "; " + "u[0..1] = " + u[1] + "; " + "u[0..2] = " + u[2] + "; " + "u[0..3] = " + u[3] + ";\n" +
        "u[1..0] = " + u[4] + "; " + "u[1..1] = " + u[5] + "; " + "u[1..3] = " + u[7] + "; " + "u[1..2] = " + u[6] + ";\n" +
        "u[2..0] = " + u[8] + "; " + "u[2..1] = " + u[9] + "; " + "u[2..3] = " + u[0xB] + "; " + "u[2..2] = " + u[0xA] + ";\n" +
        "u[3..0] = " + u[0xC] + "; " + "u[3..1] = " + u[0xD] + "; " + "u[3..3] = " + u[0xF] + "; " + "u[3..2] = " + u[0xE] + ";\n</pre>";
}
function seedData() {
    boundary111.value = 1;
    boundary112.value = 2;
    boundary121.value = 3;
    boundary122.value = 4;
    boundary211.value = 5;
    boundary212.value = 4;
    boundary221.value = 3;
    boundary222.value = 2;
    boundary223.value = 1;
    boundary232.value = 2;
    boundary233.value = 3;
    boundary322.value = 4;
    boundary323.value = 5;
    boundary332.value = 6;
    boundary333.value = 7;
    boundary331.value = 6;
    boundary313.value = 5;
    boundary311.value = 4;
    boundary133.value = 3;
    boundary131.value = 2;
    boundary113.value = 1;
}