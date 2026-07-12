/* TERMS OF USE
 * This source code is subject to the terms of the MIT License. 
 * Copyright(c) 2026 Vladimir Vasilich Tregub
*/
function r4(string) {
    return parseInt(string, 4);
}
var rank = 64;
var a;
var mesh = []; // array of node neighbors; 3 neighbors or less
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
    mesh[r4("22")] = [r4("20"), r4("311"), r4("133")];
    mesh[r4("23")] = [r4("20"), r4("132"), 1];
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
    a[r4("111")][rank] = Number(b111.innerText);
    a[r4("112")][rank] = Number(b112.innerText);
    a[r4("121")][rank] = Number(b121.innerText);
    a[r4("122")][rank] = Number(b122.innerText);
    a[r4("211")][rank] = Number(b211.innerText);
    a[r4("212")][rank] = Number(b212.innerText);
    a[r4("221")][rank] = Number(b221.innerText);
    a[r4("222")][rank] = Number(b222.innerText);
    a[r4("223")][rank] = Number(b223.innerText);
    a[r4("232")][rank] = Number(b232.innerText);
    a[r4("233")][rank] = Number(b233.innerText);
    a[r4("322")][rank] = Number(b322.innerText);
    a[r4("323")][rank] = Number(b323.innerText);
    a[r4("332")][rank] = Number(b332.innerText);
    a[r4("333")][rank] = Number(b333.innerText);
    a[r4("331")][rank] = Number(b331.innerText);
    a[r4("313")][rank] = Number(b313.innerText);
    a[r4("311")][rank] = Number(b311.innerText);
    a[r4("133")][rank] = Number(b133.innerText);
    a[r4("131")][rank] = Number(b131.innerText);
    a[r4("113")][rank] = Number(b113.innerText);

    solvelinsys(a, rank, rank + 1, u);

    const simplexdivs = document.querySelectorAll('div.simplex');
    for (el of simplexdivs) {
        if (el.title) {
            el.innerText = u[r4(el.title)].toFixed(3);
        }
    }
}
function seedData() {
    b111.innerText = 1;
    b112.innerText = 2;
    b121.innerText = 3;
    b122.innerText = 4;
    b211.innerText = 5;
    b212.innerText = 4;
    b221.innerText = 3;
    b222.innerText = 2;
    b223.innerText = 1;
    b232.innerText = 0;
    b233.innerText = -1;
    b322.innerText = -2;
    b323.innerText = -1;
    b332.innerText = -2;
    b333.innerText = -3;
    b331.innerText = -4;
    b313.innerText = -3;
    b311.innerText = -2;
    b133.innerText = -1;
    b131.innerText = 0;
    b113.innerText = 1;
}